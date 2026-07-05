"use client";

import { useState } from "react";
import { calculateDsr, type DsrInput, type DsrResult } from "@/lib/calculators/dsr";
import { AdSlot } from "@/components/ads/AdSlot";

export default function DsrPage() {
  const [input, setInput] = useState<DsrInput>({
    annualIncome: 100_000_000,
    existingAnnualRepayment: 12_000_000,
    newAnnualRepayment: 28_600_000,
  });
  const [result, setResult] = useState<DsrResult | null>(null);

  const handleCalculate = () => {
    try { setResult(calculateDsr(input)); } catch { alert("연소득은 0보다 커야 합니다."); }
  };

  const riskColors = { safe: "text-green-700 bg-green-50", caution: "text-yellow-700 bg-yellow-50", danger: "text-red-700 bg-red-50" };
  const riskLabels = { safe: "✅ 안전 (40% 이하)", caution: "⚠️ 주의 (40~50%)", danger: "🚫 위험 (50% 초과)" };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">📊 DSR 계산기</h1>
        <p className="mt-1 text-sm text-gray-600">총부채원리금상환비율(DSR)을 계산합니다. 모든 대출의 연간 원리금 상환액 / 연소득.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">부부 합산 연소득</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.annualIncome} onChange={(e) => setInput({ ...input, annualIncome: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={10_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기존 대출 연간 원리금 상환액</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.existingAnnualRepayment} onChange={(e) => setInput({ ...input, existingAnnualRepayment: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={1_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">신규 대출 연간 원리금 상환액</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.newAnnualRepayment} onChange={(e) => setInput({ ...input, newAnnualRepayment: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={1_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <button onClick={handleCalculate} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">DSR 계산하기</button>
      </div>

      {result && (
        <>
          <div className={`border rounded-xl p-5 text-center ${riskColors[result.riskLevel]}`}>
            <p className="text-3xl font-bold">{result.dsrRatio}%</p>
            <p className="mt-1 text-sm font-medium">{riskLabels[result.riskLevel]}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm space-y-2">
            <p>총 연간 원리금 상환액: <strong>{(result.totalAnnualRepayment / 10_000).toLocaleString()}만원</strong></p>
            <p>40% 기준 여유/초과: <strong className={result.marginFromLimit >= 0 ? "text-green-700" : "text-red-700"}>{(result.marginFromLimit / 10_000).toLocaleString()}만원</strong></p>
          </div>
          <AdSlot slot="afterResult" className="my-4" />
        </>
      )}
    </div>
  );
}
