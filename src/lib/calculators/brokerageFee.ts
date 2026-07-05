/**
 * 중개수수료 계산기
 * 주택 매매/전세/월세 기준
 */

export type TransactionType = "sale" | "jeonse" | "monthly";

export interface BrokerageFeeInput {
  /** 거래 유형 */
  transactionType: TransactionType;
  /** 거래 금액 (원) - 매매가 또는 전세금 */
  transactionAmount: number;
  /** 월세 보증금 (원) - 월세일 때만 */
  monthlyDeposit?: number;
  /** 월세 (원) - 월세일 때만 */
  monthlyRent?: number;
}

export interface BrokerageFeeResult {
  /** 적용 상한 요율 (%) */
  maxRate: number;
  /** 계산 기준 금액 (원) */
  baseAmount: number;
  /** 상한 기준 수수료 (원) */
  maxFee: number;
  /** 부가세 포함 수수료 (원) - 개인 중개사는 비과세, 법인은 10% */
  feeWithVat: number;
  /** 비고 */
  note: string;
}

interface RateTable {
  limit: number;
  rate: number;
  cap: number; // 0이면 cap 없음
}

/**
 * 주택 매매 상한요율 (2021.10.19 시행 기준)
 */
const SALE_RATES: RateTable[] = [
  { limit: 50_000_000, rate: 0.6, cap: 250_000 },
  { limit: 200_000_000, rate: 0.5, cap: 800_000 },
  { limit: 600_000_000, rate: 0.4, cap: 0 },
  { limit: 900_000_000, rate: 0.5, cap: 0 },
  { limit: Infinity, rate: 0.7, cap: 0 },
];

/**
 * 주택 전세/월세 상한요율
 */
const LEASE_RATES: RateTable[] = [
  { limit: 50_000_000, rate: 0.5, cap: 200_000 },
  { limit: 100_000_000, rate: 0.4, cap: 300_000 },
  { limit: 600_000_000, rate: 0.3, cap: 0 },
  { limit: Infinity, rate: 0.4, cap: 0 },
];

function findRate(amount: number, table: RateTable[]): { rate: number; cap: number } {
  for (const entry of table) {
    if (amount < entry.limit) {
      return { rate: entry.rate, cap: entry.cap };
    }
  }
  const last = table[table.length - 1];
  return { rate: last.rate, cap: last.cap };
}

export function calculateBrokerageFee(input: BrokerageFeeInput): BrokerageFeeResult {
  const { transactionType, transactionAmount, monthlyDeposit = 0, monthlyRent = 0 } = input;

  let baseAmount: number;
  let table: RateTable[];

  if (transactionType === "sale") {
    baseAmount = transactionAmount;
    table = SALE_RATES;
  } else if (transactionType === "jeonse") {
    baseAmount = transactionAmount;
    table = LEASE_RATES;
  } else {
    // 월세: 기준금액 = 보증금 + (월세 * 100)
    // 단, 5천만원 미만이면 보증금 + (월세 * 70)
    const calc1 = monthlyDeposit + monthlyRent * 100;
    if (calc1 < 50_000_000) {
      baseAmount = monthlyDeposit + monthlyRent * 70;
    } else {
      baseAmount = calc1;
    }
    table = LEASE_RATES;
  }

  const { rate, cap } = findRate(baseAmount, table);
  let maxFee = Math.round(baseAmount * rate / 100);

  if (cap > 0 && maxFee > cap) {
    maxFee = cap;
  }

  // 부가세: 법인 중개사 10% 추가 (개인은 면세). 여기서는 개인 기준으로 표시, 법인은 참고.
  const feeWithVat = Math.round(maxFee * 1.1);

  return {
    maxRate: rate,
    baseAmount,
    maxFee,
    feeWithVat,
    note: transactionType === "monthly"
      ? `월세 기준금액: 보증금 + 월세×${baseAmount === monthlyDeposit + monthlyRent * 70 ? "70" : "100"}`
      : `${transactionType === "sale" ? "매매" : "전세"} 거래금액 기준`,
  };
}
