"use client";

import { useState } from "react";
import { calculateLtv, type LtvInput, type LtvResult } from "@/lib/calculators/ltv";
import { AdSlot } from "@/components/ads/AdSlot";
import { CalculatorSeoGuide } from "@/components/content/CalculatorSeoGuide";

function formatKrw(v: number) { return `${Math.round(v / 10_000).toLocaleString()}만원`; }

export default function LtvPage() {
  const [input, setInput] = useState<LtvInput>({
    propertyValue: 900_000_000,
    seniorLoan: 0,
    desiredLoan: 500_000_000,
  });
  const [result, setResult] = useState<LtvResult | null>(null);

  const handleCalculate = () => {
    try { setResult(calculateLtv(input)); } catch { alert("주택 가격은 0보다 커야 합니다."); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">🏦 LTV 계산기</h1>
        <p className="mt-1 text-sm text-gray-600">담보인정비율(LTV)을 계산합니다. (대출금 + 선순위) / 주택가격.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주택 가격</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.propertyValue} onChange={(e) => setInput({ ...input, propertyValue: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={10_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기존 선순위 대출</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.seniorLoan} onChange={(e) => setInput({ ...input, seniorLoan: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={10_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">희망 대출 금액</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.desiredLoan} onChange={(e) => setInput({ ...input, desiredLoan: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={10_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <button onClick={handleCalculate} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">LTV 계산하기</button>
      </div>

      {result && (
        <>
          <div className={`border rounded-xl p-5 text-center ${result.ltvRatio <= 60 ? "bg-green-50 text-green-800" : result.ltvRatio <= 70 ? "bg-yellow-50 text-yellow-800" : "bg-red-50 text-red-800"}`}>
            <p className="text-3xl font-bold">{result.ltvRatio}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm space-y-2">
            <p>총 대출 합계: <strong>{formatKrw(result.totalLoan)}</strong></p>
            <p>일반(70%): {result.limits.general70 ? "✅ 가능" : "❌ 초과"} | 조정(60%): {result.limits.regulated60 ? "✅ 가능" : "❌ 초과"} | 투기(50%): {result.limits.speculative50 ? "✅ 가능" : "❌ 초과"}</p>
            <p>70% 기준 최대 대출: <strong>{formatKrw(result.maxLoanAt70)}</strong></p>
            <p>60% 기준 최대 대출: <strong>{formatKrw(result.maxLoanAt60)}</strong></p>
          </div>
          <AdSlot slot="afterResult" className="my-4" />
        </>
      )}

      <CalculatorSeoGuide id="ltv" />
    </div>
  );
}
