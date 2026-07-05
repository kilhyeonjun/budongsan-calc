/**
 * 갈아타기 종합 계산기
 * 매도 → 매수 시 총 자금 흐름 계산
 */

import { calculateMortgage } from "./mortgage";
import { calculateDsr } from "./dsr";
import { calculateLtv } from "./ltv";
import { calculateAcquisitionTax, type AcquisitionTaxInput } from "./acquisitionTax";
import { calculateBrokerageFee } from "./brokerageFee";

export interface HomeUpgradeInput {
  // 매도 (현재 집)
  /** 현재 집 매도 예상가 (원) */
  currentSalePrice: number;
  /** 현재 남은 대출 잔액 (원) */
  currentLoanBalance: number;
  /** 현재 집 보유 기간 (년) */
  holdingYears: number;

  // 매수 (새 집)
  /** 새 집 매수가 (원) */
  newPurchasePrice: number;
  /** 새 집 전용면적 (㎡) */
  newArea: number;
  /** 조정대상지역 여부 */
  isRegulatedArea: boolean;

  // 대출
  /** 신규 대출 희망액 (원) */
  newLoanAmount: number;
  /** 신규 대출 금리 (%) */
  newLoanRate: number;
  /** 신규 대출 기간 (년) */
  newLoanYears: number;

  // 소득
  /** 부부 합산 연소득 (원) */
  annualIncome: number;
  /** 기존 다른 대출 연간 원리금 (원, 주담대 제외 신용/학자금 등) */
  otherAnnualRepayment: number;

  // 보유 자산
  /** 보유 현금 (원) */
  cash: number;
}

export interface HomeUpgradeResult {
  // 매도
  /** 매도 중개수수료 (원) */
  saleBrokerageFee: number;
  /** 매도 후 순현금 (원) */
  netCashAfterSale: number;

  // 매수
  /** 취득세 합계 (원) */
  acquisitionTaxTotal: number;
  /** 매수 중개수수료 (원) */
  purchaseBrokerageFee: number;
  /** 기타 비용 (이사/수리 등 예비) (원) */
  miscCosts: number;
  /** 매수에 필요한 총 현금 (원) */
  totalCashNeeded: number;

  // 자금 흐름
  /** 투입 가능한 총 자금 (매도순현금 + 보유현금) (원) */
  totalAvailableCash: number;
  /** 부족/여유 현금 (원, 양수=여유, 음수=부족) */
  cashGap: number;

  // 대출
  /** 신규 대출 월 상환액 (원) */
  newMonthlyPayment: number;
  /** 신규 대출 총 이자 (원) */
  newTotalInterest: number;
  /** DSR 비율 (%) */
  dsrRatio: number;
  /** DSR 위험도 */
  dsrRiskLevel: "safe" | "caution" | "danger";
  /** LTV 비율 (%) */
  ltvRatio: number;

  // 종합 판정
  /** 갈아타기 판정 */
  verdict: "possible" | "caution" | "difficult";
  /** 판정 사유 */
  verdictReasons: string[];
}

export function calculateHomeUpgrade(input: HomeUpgradeInput): HomeUpgradeResult {
  const {
    currentSalePrice, currentLoanBalance,
    newPurchasePrice, newArea, isRegulatedArea,
    newLoanAmount, newLoanRate, newLoanYears,
    annualIncome, otherAnnualRepayment,
    cash,
  } = input;

  // 1. 매도 중개수수료
  const saleBrokerage = calculateBrokerageFee({
    transactionType: "sale",
    transactionAmount: currentSalePrice,
  });
  const saleBrokerageFee = saleBrokerage.maxFee;

  // 2. 매도 후 순현금
  const netCashAfterSale = currentSalePrice - currentLoanBalance - saleBrokerageFee;

  // 3. 취득세 (1주택 갈아타기 = 취득 후 1주택 가정)
  const taxInput: AcquisitionTaxInput = {
    propertyValue: newPurchasePrice,
    houseCount: 1,
    area: newArea,
    isRegulatedArea,
  };
  const tax = calculateAcquisitionTax(taxInput);
  const acquisitionTaxTotal = tax.totalTax;

  // 4. 매수 중개수수료
  const purchaseBrokerage = calculateBrokerageFee({
    transactionType: "sale",
    transactionAmount: newPurchasePrice,
  });
  const purchaseBrokerageFee = purchaseBrokerage.maxFee;

  // 5. 기타 비용 (이사비 + 수리비 + 예비비: 매수가의 1% 추정, 최소 500만, 최대 3000만)
  const miscCosts = Math.min(30_000_000, Math.max(5_000_000, Math.round(newPurchasePrice * 0.01)));

  // 6. 매수에 필요한 총 현금 (대출 제외한 자기자본)
  const totalCashNeeded = newPurchasePrice - newLoanAmount + acquisitionTaxTotal + purchaseBrokerageFee + miscCosts;

  // 7. 투입 가능한 총 자금
  const totalAvailableCash = netCashAfterSale + cash;

  // 8. 부족/여유
  const cashGap = totalAvailableCash - totalCashNeeded;

  // 9. 신규 대출 상환
  const mortgage = calculateMortgage({
    principal: newLoanAmount,
    annualRate: newLoanRate,
    years: newLoanYears,
    repaymentType: "equalPrincipalInterest",
  });
  const newMonthlyPayment = mortgage.monthlyPayment;
  const newTotalInterest = mortgage.totalInterest;

  // 10. DSR
  const newAnnualRepayment = newMonthlyPayment * 12;
  const dsr = calculateDsr({
    annualIncome,
    existingAnnualRepayment: otherAnnualRepayment,
    newAnnualRepayment,
  });

  // 11. LTV
  const ltv = calculateLtv({
    propertyValue: newPurchasePrice,
    seniorLoan: 0,
    desiredLoan: newLoanAmount,
  });

  // 12. 종합 판정
  const verdictReasons: string[] = [];
  let verdict: HomeUpgradeResult["verdict"] = "possible";

  if (cashGap < 0) {
    verdictReasons.push(`자금이 ${Math.abs(cashGap).toLocaleString()}원 부족합니다.`);
    verdict = "difficult";
  }
  if (dsr.riskLevel === "danger") {
    verdictReasons.push(`DSR ${dsr.dsrRatio}%로 규제 한도(40%)를 크게 초과합니다.`);
    verdict = "difficult";
  } else if (dsr.riskLevel === "caution") {
    verdictReasons.push(`DSR ${dsr.dsrRatio}%로 규제 한도에 근접합니다.`);
    if (verdict !== "difficult") verdict = "caution";
  }
  if (ltv.ltvRatio > 70) {
    verdictReasons.push(`LTV ${ltv.ltvRatio}%로 일반 한도(70%)를 초과합니다.`);
    if (verdict !== "difficult") verdict = "caution";
  }
  if (verdictReasons.length === 0) {
    verdictReasons.push("자금, DSR, LTV 모두 양호합니다.");
  }

  return {
    saleBrokerageFee,
    netCashAfterSale,
    acquisitionTaxTotal,
    purchaseBrokerageFee,
    miscCosts,
    totalCashNeeded,
    totalAvailableCash,
    cashGap,
    newMonthlyPayment,
    newTotalInterest,
    dsrRatio: dsr.dsrRatio,
    dsrRiskLevel: dsr.riskLevel,
    ltvRatio: ltv.ltvRatio,
    verdict,
    verdictReasons,
  };
}
