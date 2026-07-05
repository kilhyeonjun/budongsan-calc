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
}

export function calculateDsr(input: DsrInput): DsrResult {
  const { annualIncome, existingAnnualRepayment, newAnnualRepayment } = input;

  if (annualIncome <= 0) {
    throw new Error("연소득은 0보다 커야 합니다.");
  }

  const totalAnnualRepayment = existingAnnualRepayment + newAnnualRepayment;
  const dsrRatio = Math.round((totalAnnualRepayment / annualIncome) * 10000) / 100;

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

  return {
    dsrRatio,
    totalAnnualRepayment,
    riskLevel,
    marginFromLimit,
  };
}
