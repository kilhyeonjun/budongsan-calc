import { describe, it, expect } from "vitest";
import { calculateDsr } from "./dsr";
import { calculateLtv } from "./ltv";
import { calculateAcquisitionTax } from "./acquisitionTax";
import { calculateBrokerageFee } from "./brokerageFee";
import { calculateHomeUpgrade } from "./homeUpgrade";

describe("calculateDsr", () => {
  it("연소득 1억, 기존 1200만, 신규 2860만 → DSR 약 40.6%", () => {
    const result = calculateDsr({
      annualIncome: 100_000_000,
      existingAnnualRepayment: 12_000_000,
      newAnnualRepayment: 28_600_000,
    });
    expect(result.dsrRatio).toBeCloseTo(40.6, 0);
    expect(result.riskLevel).toBe("caution");
    expect(result.totalAnnualRepayment).toBe(40_600_000);
  });

  it("DSR 40% 이하는 safe", () => {
    const result = calculateDsr({
      annualIncome: 100_000_000,
      existingAnnualRepayment: 10_000_000,
      newAnnualRepayment: 20_000_000,
    });
    expect(result.riskLevel).toBe("safe");
    expect(result.marginFromLimit).toBe(10_000_000);
  });

  it("DSR 50% 초과는 danger", () => {
    const result = calculateDsr({
      annualIncome: 100_000_000,
      existingAnnualRepayment: 20_000_000,
      newAnnualRepayment: 35_000_000,
    });
    expect(result.riskLevel).toBe("danger");
  });

  it("보수 계산 가산율을 신규 대출 상환액에만 반영", () => {
    const result = calculateDsr({
      annualIncome: 100_000_000,
      existingAnnualRepayment: 10_000_000,
      newAnnualRepayment: 20_000_000,
      stressBufferPercent: 10,
    });
    expect(result.dsrRatio).toBe(30);
    expect(result.stressDsrRatio).toBe(32);
    expect(result.stressMarginFromLimit).toBe(8_000_000);
  });
});

describe("calculateLtv", () => {
  it("9억 주택에 5억 대출 → LTV 55.56%", () => {
    const result = calculateLtv({
      propertyValue: 900_000_000,
      seniorLoan: 0,
      desiredLoan: 500_000_000,
    });
    expect(result.ltvRatio).toBeCloseTo(55.56, 1);
    expect(result.limits.general70).toBe(true);
    expect(result.limits.regulated60).toBe(true);
    expect(result.limits.speculative50).toBe(false);
  });

  it("선순위 있을 때 합산", () => {
    const result = calculateLtv({
      propertyValue: 900_000_000,
      seniorLoan: 200_000_000,
      desiredLoan: 400_000_000,
    });
    expect(result.ltvRatio).toBeCloseTo(66.67, 1);
    expect(result.limits.general70).toBe(true);
    expect(result.limits.regulated60).toBe(false);
  });

  it("70% 기준 최대 대출 가능액", () => {
    const result = calculateLtv({
      propertyValue: 900_000_000,
      seniorLoan: 100_000_000,
      desiredLoan: 500_000_000,
    });
    expect(result.maxLoanAt70).toBe(530_000_000);
    expect(result.maxLoanAt60).toBe(440_000_000);
  });
});

describe("calculateAcquisitionTax", () => {
  it("1주택 6억 이하 = 1%", () => {
    const result = calculateAcquisitionTax({
      propertyValue: 500_000_000,
      houseCount: 1,
      area: 84,
      isRegulatedArea: false,
    });
    expect(result.taxRate).toBe(1);
    expect(result.acquisitionTax).toBe(5_000_000);
    expect(result.ruralTax).toBe(0); // 85㎡ 이하
    expect(result.totalTax).toBe(5_500_000); // 취득세 + 지교육세10%
  });

  it("1주택 9억 초과 = 3%", () => {
    const result = calculateAcquisitionTax({
      propertyValue: 1_000_000_000,
      houseCount: 1,
      area: 110,
      isRegulatedArea: false,
    });
    expect(result.taxRate).toBe(3);
    expect(result.acquisitionTax).toBe(30_000_000);
    expect(result.ruralTax).toBe(2_000_000); // 85㎡ 초과: 과세표준의 0.2%
    expect(result.totalTax).toBe(35_000_000);
  });

  it("1주택 7.5억 → 세율 약 2%", () => {
    const result = calculateAcquisitionTax({
      propertyValue: 750_000_000,
      houseCount: 1,
      area: 84,
      isRegulatedArea: false,
    });
    // (750000000 - 600000000) / 300000000 * 2 + 1 = 2.0
    expect(result.taxRate).toBe(2);
  });

  it("조정지역 2주택 = 8%", () => {
    const result = calculateAcquisitionTax({
      propertyValue: 900_000_000,
      houseCount: 2,
      area: 84,
      isRegulatedArea: true,
    });
    expect(result.taxRate).toBe(8);
  });
});

describe("calculateBrokerageFee", () => {
  it("매매 7억 → 0.5%, 350만원", () => {
    // 6억 초과 ~ 9억 이하 구간 = 0.5%
    const result = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 700_000_000,
    });
    expect(result.maxRate).toBe(0.5);
    expect(result.maxFee).toBe(3_500_000);
  });

  it("매매 9.5억 → 0.5%", () => {
    const result = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 950_000_000,
    });
    expect(result.maxRate).toBe(0.5);
    expect(result.maxFee).toBe(4_750_000);
  });

  it("매매 13억 → 0.6%, 16억 → 0.7%", () => {
    const mid = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 1_300_000_000,
    });
    const high = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 1_600_000_000,
    });
    expect(mid.maxRate).toBe(0.6);
    expect(mid.maxFee).toBe(7_800_000);
    expect(high.maxRate).toBe(0.7);
    expect(high.maxFee).toBe(11_200_000);
  });

  it("매매 4천만 → 0.6%, cap 25만원", () => {
    const result = calculateBrokerageFee({
      transactionType: "sale",
      transactionAmount: 40_000_000,
    });
    expect(result.maxRate).toBe(0.6);
    expect(result.maxFee).toBe(240_000); // 40000000 * 0.6% = 240000 < cap 250000
  });

  it("전세 3억 → 0.3%", () => {
    const result = calculateBrokerageFee({
      transactionType: "jeonse",
      transactionAmount: 300_000_000,
    });
    expect(result.maxRate).toBe(0.3);
    expect(result.maxFee).toBe(900_000);
  });

  it("전세 13억 → 0.5%, 16억 → 0.6%", () => {
    const mid = calculateBrokerageFee({
      transactionType: "jeonse",
      transactionAmount: 1_300_000_000,
    });
    const high = calculateBrokerageFee({
      transactionType: "jeonse",
      transactionAmount: 1_600_000_000,
    });
    expect(mid.maxRate).toBe(0.5);
    expect(mid.maxFee).toBe(6_500_000);
    expect(high.maxRate).toBe(0.6);
    expect(high.maxFee).toBe(9_600_000);
  });

  it("월세 보증금 1천만, 월세 50만 → 기준금액 계산", () => {
    // 보증금 + 월세*100 = 10000000 + 50000000 = 60000000
    const result = calculateBrokerageFee({
      transactionType: "monthly",
      transactionAmount: 0,
      monthlyDeposit: 10_000_000,
      monthlyRent: 500_000,
    });
    // 60000000 → 0.4%, cap 300000
    expect(result.baseAmount).toBe(60_000_000);
    expect(result.maxRate).toBe(0.4);
    expect(result.maxFee).toBe(240_000); // 60000000 * 0.4% = 240000 < 300000
  });
});

describe("calculateHomeUpgrade", () => {
  it("기본 갈아타기 시나리오: 7억→9억", () => {
    const result = calculateHomeUpgrade({
      currentSalePrice: 700_000_000,
      currentLoanBalance: 400_000_000,
      holdingYears: 5,
      newPurchasePrice: 900_000_000,
      newArea: 84,
      isRegulatedArea: false,
      newLoanAmount: 500_000_000,
      newLoanRate: 4.0,
      newLoanYears: 30,
      annualIncome: 100_000_000,
      otherAnnualRepayment: 0,
      cash: 50_000_000,
    });

    // 매도 후 순현금: 700000000 - 400000000 - 중개수수료
    expect(result.netCashAfterSale).toBeLessThan(300_000_000);
    expect(result.netCashAfterSale).toBeGreaterThan(295_000_000);

    // LTV: 500000000 / 900000000 ≈ 55.56%
    expect(result.ltvRatio).toBeCloseTo(55.56, 0);

    // DSR: 월상환 약 238만 * 12 / 1억 ≈ 28.6%
    expect(result.dsrRatio).toBeGreaterThan(25);
    expect(result.dsrRatio).toBeLessThan(35);
    expect(result.dsrRiskLevel).toBe("safe");

    // 판정 문자열
    expect(result.verdict).toBeDefined();
    expect(result.verdictReasons.length).toBeGreaterThan(0);
  });

  it("자금 부족 시 difficult 판정", () => {
    const result = calculateHomeUpgrade({
      currentSalePrice: 500_000_000,
      currentLoanBalance: 400_000_000,
      holdingYears: 3,
      newPurchasePrice: 900_000_000,
      newArea: 84,
      isRegulatedArea: false,
      newLoanAmount: 300_000_000,
      newLoanRate: 4.5,
      newLoanYears: 30,
      annualIncome: 80_000_000,
      otherAnnualRepayment: 5_000_000,
      cash: 10_000_000,
    });

    expect(result.cashGap).toBeLessThan(0);
    expect(result.verdict).toBe("difficult");
  });
});
