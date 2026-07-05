"use client";

import { useState } from "react";
import { calculateAcquisitionTax, type AcquisitionTaxInput, type AcquisitionTaxResult } from "@/lib/calculators/acquisitionTax";
import { AdSlot } from "@/components/ads/AdSlot";

function formatKrw(v: number) { return `${Math.round(v / 10_000).toLocaleString()}만원`; }

export default function AcquisitionTaxPage() {
  const [input, setInput] = useState<AcquisitionTaxInput>({
    propertyValue: 900_000_000,
    houseCount: 1,
    area: 84,
    isRegulatedArea: false,
  });
  const [result, setResult] = useState<AcquisitionTaxResult | null>(null);

  const handleCalculate = () => {
    setResult(calculateAcquisitionTax(input));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">📋 취득세 계산기</h1>
        <p className="mt-1 text-sm text-gray-600">주택 매수 시 납부할 취득세를 간이 계산합니다.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주택 가격</label>
          <div className="flex items-center gap-2">
            <input type="number" value={input.propertyValue} onChange={(e) => setInput({ ...input, propertyValue: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={10_000_000} />
            <span className="text-sm text-gray-500">원</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전용면적</label>
            <div className="flex items-center gap-2">
              <input type="number" value={input.area} onChange={(e) => setInput({ ...input, area: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={1} />
              <span className="text-sm text-gray-500">㎡</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주택 수 (취득 후)</label>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((n) => (
                <button key={n} onClick={() => setInput({ ...input, houseCount: n })} className={`px-3 py-2 text-sm rounded-lg border ${input.houseCount === n ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700"}`}>
                  {n === 3 ? "3+" : n}주택
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">조정대상지역</label>
          <div className="flex gap-2">
            <button onClick={() => setInput({ ...input, isRegulatedArea: false })} className={`px-4 py-2 text-sm rounded-lg border ${!input.isRegulatedArea ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700"}`}>비조정</button>
            <button onClick={() => setInput({ ...input, isRegulatedArea: true })} className={`px-4 py-2 text-sm rounded-lg border ${input.isRegulatedArea ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700"}`}>조정대상</button>
          </div>
        </div>
        <button onClick={handleCalculate} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">취득세 계산하기</button>
      </div>

      {result && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-center mb-4">
              <p className="text-xs text-gray-500">총 세금</p>
              <p className="text-2xl font-bold text-gray-900">{formatKrw(result.totalTax)}</p>
              <p className="text-sm text-gray-500 mt-1">세율 {result.taxRate}%</p>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-2 text-gray-600">취득세</td><td className="py-2 text-right">{formatKrw(result.acquisitionTax)}</td></tr>
                <tr><td className="py-2 text-gray-600">지방교육세</td><td className="py-2 text-right">{formatKrw(result.localEducationTax)}</td></tr>
                <tr><td className="py-2 text-gray-600">농어촌특별세</td><td className="py-2 text-right">{result.ruralTax > 0 ? formatKrw(result.ruralTax) : "비과세 (85㎡ 이하)"}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400">{result.disclaimer}</p>
          <AdSlot slot="afterResult" className="my-4" />
        </>
      )}
    </div>
  );
}
