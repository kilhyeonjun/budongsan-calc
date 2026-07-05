"use client";

import { useState } from "react";
import { calculateBrokerageFee, type BrokerageFeeInput, type BrokerageFeeResult, type TransactionType } from "@/lib/calculators/brokerageFee";
import { AdSlot } from "@/components/ads/AdSlot";

function formatKrw(v: number) { return `${Math.round(v / 10_000).toLocaleString()}만원`; }

export default function BrokerageFeePage() {
  const [input, setInput] = useState<BrokerageFeeInput>({
    transactionType: "sale",
    transactionAmount: 700_000_000,
    monthlyDeposit: 10_000_000,
    monthlyRent: 500_000,
  });
  const [result, setResult] = useState<BrokerageFeeResult | null>(null);

  const handleCalculate = () => {
    setResult(calculateBrokerageFee(input));
  };

  const txTypes: { value: TransactionType; label: string }[] = [
    { value: "sale", label: "매매" },
    { value: "jeonse", label: "전세" },
    { value: "monthly", label: "월세" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">🤝 중개수수료 계산기</h1>
        <p className="mt-1 text-sm text-gray-600">매매·전세·월세 거래 시 부동산 중개수수료 상한액을 계산합니다.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">거래 유형</label>
          <div className="flex gap-2">
            {txTypes.map((t) => (
              <button key={t.value} onClick={() => setInput({ ...input, transactionType: t.value })} className={`px-4 py-2 text-sm rounded-lg border ${input.transactionType === t.value ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {input.transactionType !== "monthly" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{input.transactionType === "sale" ? "매매가" : "전세금"}</label>
            <div className="flex items-center gap-2">
              <input type="number" value={input.transactionAmount} onChange={(e) => setInput({ ...input, transactionAmount: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={10_000_000} />
              <span className="text-sm text-gray-500">원</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">보증금</label>
              <div className="flex items-center gap-2">
                <input type="number" value={input.monthlyDeposit} onChange={(e) => setInput({ ...input, monthlyDeposit: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={1_000_000} />
                <span className="text-sm text-gray-500">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">월세</label>
              <div className="flex items-center gap-2">
                <input type="number" value={input.monthlyRent} onChange={(e) => setInput({ ...input, monthlyRent: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" step={100_000} />
                <span className="text-sm text-gray-500">원</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleCalculate} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">수수료 계산하기</button>
      </div>

      {result && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-center mb-4">
              <p className="text-xs text-gray-500">상한 수수료 (개인 중개사 기준)</p>
              <p className="text-2xl font-bold text-blue-700">{formatKrw(result.maxFee)}</p>
              <p className="text-sm text-gray-500 mt-1">상한 요율 {result.maxRate}%</p>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-2 text-gray-600">계산 기준 금액</td><td className="py-2 text-right">{formatKrw(result.baseAmount)}</td></tr>
                <tr><td className="py-2 text-gray-600">부가세 포함 (법인)</td><td className="py-2 text-right">{formatKrw(result.feeWithVat)}</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-3">{result.note}</p>
          </div>
          <AdSlot slot="afterResult" className="my-4" />
        </>
      )}
    </div>
  );
}
