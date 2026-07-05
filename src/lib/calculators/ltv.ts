/**
 * LTV (담보인정비율) 계산기
 * LTV = (대출금 + 선순위 채권) / 주택가격 * 100
 */

export interface LtvInput {
  /** 주택 가격 (원) */
  propertyValue: number;
  /** 기존 선순위 대출 (원) */
  seniorLoan: number;
  /** 희망 대출 금액 (원) */
  desiredLoan: number;
}

export interface LtvResult {
  /** LTV 비율 (%) */
  ltvRatio: number;
  /** 총 담보 대출 합계 (원) */
  totalLoan: number;
  /** 규제 기준별 가능 여부 */
  limits: {
    /** 70% 기준 (일반) */
    general70: boolean;
    /** 60% 기준 (조정지역) */
    regulated60: boolean;
    /** 50% 기준 (투기과열) */
    speculative50: boolean;
  };
  /** 70% 기준 최대 대출 가능액 (원) */
  maxLoanAt70: number;
  /** 60% 기준 최대 대출 가능액 (원) */
  maxLoanAt60: number;
}

export function calculateLtv(input: LtvInput): LtvResult {
  const { propertyValue, seniorLoan, desiredLoan } = input;

  if (propertyValue <= 0) {
    throw new Error("주택 가격은 0보다 커야 합니다.");
  }

  const totalLoan = seniorLoan + desiredLoan;
  const ltvRatio = Math.round((totalLoan / propertyValue) * 10000) / 100;

  const maxLoanAt70 = Math.max(0, Math.round(propertyValue * 0.7 - seniorLoan));
  const maxLoanAt60 = Math.max(0, Math.round(propertyValue * 0.6 - seniorLoan));

  return {
    ltvRatio,
    totalLoan,
    limits: {
      general70: ltvRatio <= 70,
      regulated60: ltvRatio <= 60,
      speculative50: ltvRatio <= 50,
    },
    maxLoanAt70,
    maxLoanAt60,
  };
}
