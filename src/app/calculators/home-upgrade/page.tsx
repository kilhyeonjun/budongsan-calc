"use client";

import { useState } from "react";
import { calculateHomeUpgrade, type HomeUpgradeInput, type HomeUpgradeResult } from "@/lib/calculators/homeUpgrade";
import { AdSlot } from "@/components/ads/AdSlot";

function formatKrw(value: number): string {
  if (Math.abs(value) >= 100_000_000) {
    const eok = Math.floor(value / 100_000_000);
    const man = Math.round((value % 100_000_000) / 10_000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${Math.round(value / 10_000).toLocaleString()}만원`;
}

const VERDICT_STYLES = {
  possible: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", label: "✅ 가능" },
  caution: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", label: "⚠️ 주의" },
  difficult: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", label: "🚫 어려움" },
};

export default function HomeUpgradePage() {
  const [input, setInput] = useState<HomeUpgradeInput>({
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
  const [result, setResult] = useState<HomeUpgradeResult | null>(null);

  const handleCalculate = () => {
    try {
      const r = calculateHomeUpgrade(input);
      setResult(r);
    } catch {
      alert("입력값을 확인해주세요.");
    }
  };

  const updateField = (field: keyof HomeUpgradeInput, value: number | boolean) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const numField = (label: string, field: keyof HomeUpgradeInput, unit: string, step = 10_000_000) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={input[field] as number}
          onChange={(e) => updateField(field, Number(e.target.value))}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          step={step}
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">🏠 갈아타기 계산기</h1>
          <p className="mt-1 text-sm text-gray-600">
            현재 집 매도부터 새 집 매수까지 전체 자금 흐름을 한 번에 계산합니다.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6">
          {/* 매도 */}
          <fieldset>
            <legend className="text-base font-semibold text-gray-900 mb-3">📤 현재 주택 매도</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {numField("매도 예상가", "currentSalePrice", "원")}
              {numField("남은 대출 잔액", "currentLoanBalance", "원")}
            </div>
          </fieldset>

          {/* 매수 */}
          <fieldset>
            <legend className="text-base font-semibold text-gray-900 mb-3">📥 새 주택 매수</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {numField("매수가", "newPurchasePrice", "원")}
              {numField("전용면적", "newArea", "㎡", 1)}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">조정대상지역</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField("isRegulatedArea", false)}
                    className={`px-4 py-2 text-sm rounded-lg border ${!input.isRegulatedArea ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700"}`}
                  >
                    비조정
                  </button>
                  <button
                    onClick={() => updateField("isRegulatedArea", true)}
                    className={`px-4 py-2 text-sm rounded-lg border ${input.isRegulatedArea ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700"}`}
                  >
                    조정대상
                  </button>
                </div>
              </div>
            </div>
          </fieldset>

          {/* 대출 */}
          <fieldset>
            <legend className="text-base font-semibold text-gray-900 mb-3">🏦 신규 대출</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {numField("대출 희망액", "newLoanAmount", "원")}
              {numField("금리", "newLoanRate", "%", 0.1)}
              {numField("대출 기간", "newLoanYears", "년", 1)}
            </div>
          </fieldset>

          {/* 소득/자산 */}
          <fieldset>
            <legend className="text-base font-semibold text-gray-900 mb-3">💼 소득 및 자산</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {numField("부부 합산 연소득", "annualIncome", "원")}
              {numField("기타 대출 연 원리금", "otherAnnualRepayment", "원")}
              {numField("보유 현금", "cash", "원")}
            </div>
          </fieldset>

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md text-base"
          >
            갈아타기 분석하기
          </button>
        </div>

        {/* Result */}
        {result && (
          <>
            {/* Verdict */}
            <div className={`border rounded-xl p-5 ${VERDICT_STYLES[result.verdict].bg} ${VERDICT_STYLES[result.verdict].border}`}>
              <div className={`text-xl font-bold ${VERDICT_STYLES[result.verdict].text}`}>
                {VERDICT_STYLES[result.verdict].label}
              </div>
              <ul className="mt-2 space-y-1">
                {result.verdictReasons.map((reason, i) => (
                  <li key={i} className="text-sm text-gray-700">• {reason}</li>
                ))}
              </ul>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryCard label="부족/여유 현금" value={formatKrw(result.cashGap)} positive={result.cashGap >= 0} />
              <SummaryCard label="월 상환액" value={formatKrw(result.newMonthlyPayment)} />
              <SummaryCard label="DSR" value={`${result.dsrRatio}%`} warn={result.dsrRiskLevel !== "safe"} />
              <SummaryCard label="LTV" value={`${result.ltvRatio}%`} warn={result.ltvRatio > 70} />
            </div>

            {/* Detail Table */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">상세 내역</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <DetailRow label="매도 중개수수료" value={formatKrw(result.saleBrokerageFee)} />
                  <DetailRow label="매도 후 순현금" value={formatKrw(result.netCashAfterSale)} />
                  <DetailRow label="취득세 합계" value={formatKrw(result.acquisitionTaxTotal)} />
                  <DetailRow label="매수 중개수수료" value={formatKrw(result.purchaseBrokerageFee)} />
                  <DetailRow label="기타 비용 (이사/수리/예비)" value={formatKrw(result.miscCosts)} />
                  <DetailRow label="매수 필요 총 현금" value={formatKrw(result.totalCashNeeded)} highlight />
                  <DetailRow label="투입 가능 자금" value={formatKrw(result.totalAvailableCash)} highlight />
                  <DetailRow label="부족/여유" value={formatKrw(result.cashGap)} highlight positive={result.cashGap >= 0} />
                  <DetailRow label="신규 대출 총 이자 (30년)" value={formatKrw(result.newTotalInterest)} />
                </tbody>
              </table>
            </div>

            {/* Ad after result */}
            <AdSlot slot="afterResult" className="my-4" />

            {/* Disclaimer */}
            <p className="text-xs text-gray-400">
              ※ 본 계산은 참고용 추정치입니다. 양도소득세는 비과세 요건(1주택 2년 이상 보유) 충족 시 제외했습니다.
              정확한 세액과 대출 가능 여부는 세무사·은행에 확인하세요.
            </p>
          </>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block space-y-4 mt-12">
        <AdSlot slot="desktopSidebar" />
      </aside>
    </div>
  );
}

function SummaryCard({ label, value, positive, warn }: { label: string; value: string; positive?: boolean; warn?: boolean }) {
  let colorClass = "text-gray-900";
  if (positive === true) colorClass = "text-green-700";
  if (positive === false) colorClass = "text-red-700";
  if (warn) colorClass = "text-orange-600";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-base font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value, highlight, positive }: { label: string; value: string; highlight?: boolean; positive?: boolean }) {
  let valueClass = "text-gray-900";
  if (positive === true) valueClass = "text-green-700";
  if (positive === false) valueClass = "text-red-700";

  return (
    <tr className={highlight ? "font-semibold" : ""}>
      <td className="py-2 text-gray-600">{label}</td>
      <td className={`py-2 text-right ${valueClass}`}>{value}</td>
    </tr>
  );
}
