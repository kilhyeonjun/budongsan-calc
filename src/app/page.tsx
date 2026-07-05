import Link from "next/link";

const CALCULATORS = [
  { href: "/calculators/home-upgrade", emoji: "🏠", label: "갈아타기", desc: "매도→매수 전체 자금 흐름" },
  { href: "/calculators/mortgage", emoji: "💰", label: "주택담보대출", desc: "월 상환액·총 이자 계산" },
  { href: "/calculators/dsr", emoji: "📊", label: "DSR", desc: "총부채원리금상환비율" },
  { href: "/calculators/ltv", emoji: "🏦", label: "LTV", desc: "담보인정비율 계산" },
  { href: "/calculators/acquisition-tax", emoji: "📋", label: "취득세", desc: "주택 취득세 간이 계산" },
  { href: "/calculators/brokerage-fee", emoji: "🤝", label: "중개수수료", desc: "매매·전세·월세 수수료" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          집 팔고 더 큰 집 갈 수 있을까?
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          매도·매수·대출·세금·중개수수료·부족현금을 한 번에 계산하세요.
          <br className="hidden md:block" />
          갈아타기 의사결정을 위한 부동산 계산기 허브.
        </p>
        <Link
          href="/calculators/home-upgrade"
          className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          갈아타기 계산기 시작하기 →
        </Link>
      </section>

      {/* Calculator Cards */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">계산기 목록</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-2">{calc.emoji}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {calc.label} 계산기
              </h3>
              <p className="text-sm text-gray-500 mt-1">{calc.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Brief explanation */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">왜 갈아타기 계산기인가요?</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            기존 부동산 계산기는 취득세 따로, 대출이자 따로, 중개수수료 따로 계산해야 합니다.
          </p>
          <p>
            <strong>갈아타기 계산기</strong>는 현재 집 매도부터 새 집 매수까지 전체 자금 흐름을 한 번에 보여줍니다.
            부족 현금, 월 상환 부담, DSR 위험도까지 즉시 확인하세요.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            ※ 모든 계산 결과는 참고용 추정치이며 법적 효력이 없습니다. 정확한 판단은 세무사·대출 전문가에게 확인하세요.
          </p>
        </div>
      </section>
    </div>
  );
}
