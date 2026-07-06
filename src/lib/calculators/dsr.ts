/**
 * DSR (총부채원리금상환비율) 계산기
 * DSR = (모든 대출의 연간 원리금 상환액 합계) / 연소득 * 100
 */

export interface DsrInput {
  /** 연소득 (원) */
  annualIncome: number;
  /** 기존 대출 연간 원리금 상환액 합계 (원) */
  existingAnnualRepayment: number;
  /** 신규 대출 연간 원리금 상환액 (원) */
  newAnnualRepayment: number;
  /** 보수 계산용 신규 대출 상환액 가산율 (%) */
  stressBufferPercent?: number;
}

export interface DsrResult {
  /** DSR 비율 (%) */
  dsrRatio: number;
  /** 총 연간 원리금 상환액 (원) */
  totalAnnualRepayment: number;
  /** 위험도: safe(40% 이하), caution(40~50%), danger(50% 초과) */
  riskLevel: "safe" | "caution" | "danger";
  /** 규제 기준 40% 기준 여유/초과 금액 (원) */
  marginFromLimit: number;
  /** 보수 계산 DSR 비율 (%) */
  stressDsrRatio: number;
  /** 보수 계산 40% 기준 여유/초과 금액 (원) */
  stressMarginFromLimit: number;
}

export function calculateDsr(input: DsrInput): DsrResult {
  const { annualIncome, existingAnnualRepayment, newAnnualRepayment, stressBufferPercent = 0 } = input;

  if (annualIncome <= 0) {
    throw new Error("연소득은 0보다 커야 합니다.");
  }

  const totalAnnualRepayment = existingAnnualRepayment + newAnnualRepayment;
  const dsrRatio = Math.round((totalAnnualRepayment / annualIncome) * 10000) / 100;
  const stressedNewRepayment = newAnnualRepayment * (1 + Math.max(stressBufferPercent, 0) / 100);
  const stressedTotalAnnualRepayment = existingAnnualRepayment + stressedNewRepayment;
  const stressDsrRatio = Math.round((stressedTotalAnnualRepayment / annualIncome) * 10000) / 100;

  let riskLevel: DsrResult["riskLevel"];
  if (dsrRatio <= 40) {
    riskLevel = "safe";
  } else if (dsrRatio <= 50) {
    riskLevel = "caution";
  } else {
    riskLevel = "danger";
  }

  // 40% 기준 여유/초과 금액
  const limit40 = annualIncome * 0.4;
  const marginFromLimit = Math.round(limit40 - totalAnnualRepayment);
  const stressMarginFromLimit = Math.round(limit40 - stressedTotalAnnualRepayment);

  return {
    dsrRatio,
    totalAnnualRepayment,
    riskLevel,
    marginFromLimit,
    stressDsrRatio,
    stressMarginFromLimit,
  };
}
