import { describe, it, expect } from "vitest";
import { calculateMortgage } from "./mortgage";

describe("calculateMortgage", () => {
  describe("원리금균등상환", () => {
    it("5억, 4%, 30년 기준 월 상환액 약 238만원", () => {
      const result = calculateMortgage({
        principal: 500_000_000,
        annualRate: 4.0,
        years: 30,
        repaymentType: "equalPrincipalInterest",
      });
      // Expected: 500000000 * (0.04/12) * (1+0.04/12)^360 / ((1+0.04/12)^360 - 1) ≈ 2,387,082
      expect(result.monthlyPayment).toBeGreaterThan(2_380_000);
      expect(result.monthlyPayment).toBeLessThan(2_395_000);
      expect(result.totalPayment).toBe(result.monthlyPayment * 360);
      expect(result.totalInterest).toBe(result.totalPayment - 500_000_000);
    });

    it("3억, 5.5%, 25년 기준 월 상환액 약 184만원", () => {
      const result = calculateMortgage({
        principal: 300_000_000,
        annualRate: 5.5,
        years: 25,
        repaymentType: "equalPrincipalInterest",
      });
      // PMT ≈ 1,838,928
      expect(result.monthlyPayment).toBeGreaterThan(1_830_000);
      expect(result.monthlyPayment).toBeLessThan(1_850_000);
    });

    it("스케줄 첫 달 이자 = 원금 * 월이율", () => {
      const result = calculateMortgage({
        principal: 500_000_000,
        annualRate: 4.0,
        years: 30,
        repaymentType: "equalPrincipalInterest",
      });
      const firstMonth = result.schedule[0];
      const expectedInterest = Math.round(500_000_000 * (0.04 / 12));
      expect(firstMonth.interest).toBe(expectedInterest);
      expect(firstMonth.payment).toBe(result.monthlyPayment);
    });

    it("금리 0%일 때 원금만 분할", () => {
      const result = calculateMortgage({
        principal: 120_000_000,
        annualRate: 0,
        years: 10,
        repaymentType: "equalPrincipalInterest",
      });
      expect(result.monthlyPayment).toBe(1_000_000);
      expect(result.totalInterest).toBe(0);
    });
  });

  describe("원금균등상환", () => {
    it("5억, 4%, 30년 첫 달 상환액", () => {
      const result = calculateMortgage({
        principal: 500_000_000,
        annualRate: 4.0,
        years: 30,
        repaymentType: "equalPrincipal",
      });
      const monthlyPrincipal = Math.round(500_000_000 / 360);
      const firstInterest = Math.round(500_000_000 * (0.04 / 12));
      expect(result.monthlyPayment).toBe(monthlyPrincipal + firstInterest);
      // 원금균등은 총이자가 원리금균등보다 적음
      expect(result.totalInterest).toBeLessThan(500_000_000 * 0.04 * 30);
    });
  });

  describe("만기일시상환", () => {
    it("5억, 4%, 30년 매월 이자만", () => {
      const result = calculateMortgage({
        principal: 500_000_000,
        annualRate: 4.0,
        years: 30,
        repaymentType: "bulletRepayment",
      });
      const monthlyInterest = Math.round(500_000_000 * (0.04 / 12));
      expect(result.monthlyPayment).toBe(monthlyInterest);
      expect(result.totalInterest).toBe(monthlyInterest * 360);
      expect(result.totalPayment).toBe(500_000_000 + result.totalInterest);
    });
  });
});
