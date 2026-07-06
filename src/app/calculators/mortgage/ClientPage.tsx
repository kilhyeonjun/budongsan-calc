"use client";

import { useState } from "react";
import { calculateMortgage, type MortgageInput, type MortgageResult, type RepaymentType } from "@/lib/calculators/mortgage";
import { AdSlot } from "@/components/ads/AdSlot";
import { CalculatorSeoGuide } from "@/components/content/CalculatorSeoGuide";

function formatKrw(value: number): string {
  if (Math.abs(value) >= 100_000_000) {
    const eok = Math.floor(value / 100_000_000);
    const man = Math.round((value % 100_000_000) / 10_000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${Math.round(value / 10_000).toLocaleString()}만원`;
}

export default function MortgagePage() {
  const [input, setInput] = useState<MortgageInput>({
    principal: 500_000_000,
    annualRate: 4.0,
    years: 30,
    repaymentType: "equalPrincipalInterest",
  });
  const [result, setResult] = useState<MortgageResult | null>(null);

  const handleCalculate = () => {
    setResult(calculateMortgage(input));
  };

  const repaymentOptions: { value: RepaymentType; label: string }[] = [
    { value: "equalPrincipalInterest", label: "원리금균등" },
    { value: "equalPrincipal", label: "원금균등" },
    { value: "bulletRepayment", label: "만기일시" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">💰 주택담보대출 계산기</h1>
        <p className="mt-1 text-sm text-gray-600">대출 원금, 금리, 기간에 따른 월 상환액과 총 이자를 계산합니다.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대출 원금</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.principal} onChange={(e) => setInput({ ...input, principal: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={10_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연 금리</label>
            <div className="flex items-center gap-2">
              <input type="number" value={input.annualRate} onChange={(e) => setInput({ ...input, annualRate: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={0.1} />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대출 기간</label>
            <div className="flex items-center gap-2">
              <input type="number" value={input.years} onChange={(e) => setInput({ ...input, years: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={1} />
              <span className="text-sm text-gray-500">년</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">상환 방식</label>
          <div className="flex gap-2">
            {repaymentOptions.map((opt) => (
              <button key={opt.value} onClick={() => setInput({ ...input, repaymentType: opt.value })} className={`px-4 py-2 text-sm rounded-lg border ${input.repaymentType === opt.value ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleCalculate} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">계산하기</button>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">월 상환액</p>
              <p className="text-lg font-bold text-blue-700 mt-1">{formatKrw(result.monthlyPayment)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">총 상환액</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{formatKrw(result.totalPayment)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">총 이자</p>
              <p className="text-lg font-bold text-red-600 mt-1">{formatKrw(result.totalInterest)}</p>
            </div>
          </div>

          {result.schedule.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 overflow-x-auto">
              <h2 className="text-base font-semibold text-gray-900 mb-3">월별 상환 스케줄 (처음 12개월)</h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2 text-left">회차</th>
                    <th className="py-2 text-right">원금</th>
                    <th className="py-2 text-right">이자</th>
                    <th className="py-2 text-right">상환액</th>
                    <th className="py-2 text-right">잔액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.schedule.map((s) => (
                    <tr key={s.month}>
                      <td className="py-1.5">{s.month}개월</td>
                      <td className="py-1.5 text-right">{formatKrw(s.principal)}</td>
                      <td className="py-1.5 text-right">{formatKrw(s.interest)}</td>
                      <td className="py-1.5 text-right">{formatKrw(s.payment)}</td>
                      <td className="py-1.5 text-right">{formatKrw(s.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <AdSlot slot="afterResult" className="my-4" />
        </>
      )}

      <CalculatorSeoGuide id="mortgage" />
    </div>
  );
}
