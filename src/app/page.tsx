import Link from "next/link";
import { guideArticles } from "@/lib/guideContent";
import { JsonLd } from "@/components/seo/JsonLd";

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
    <div className="space-y-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: "부동산계산기",
              url: "https://budongsan-calc.vercel.app",
              inLanguage: "ko-KR",
              description: "매도·매수·대출·세금·중개수수료를 한 번에 계산하는 부동산 갈아타기 계산기입니다.",
            },
            {
              "@type": "ItemList",
              name: "부동산 계산기 목록",
              itemListElement: CALCULATORS.map((calc, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: `${calc.label} 계산기`,
                url: `https://budongsan-calc.vercel.app${calc.href}`,
              })),
            },
          ],
        }}
      />
      <section className="hero-panel overflow-hidden px-5 py-10 text-center md:px-8 md:py-14">
        <p className="eyebrow">부동산 갈아타기 의사결정 도구</p>
        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          집 팔고 더 큰 집 갈 수 있을까?
        </h1>
        <p className="body-copy mt-4 text-base md:text-lg max-w-2xl mx-auto">
          매도·매수·대출·세금·중개수수료·부족현금을 한 번에 계산하세요.
          갈아타기 가능성, 월 상환 부담, DSR 위험도를 빠르게 점검합니다.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/calculators/home-upgrade"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            갈아타기 계산기 시작하기 →
          </Link>
          <Link
            href="/guides/home-upgrade-cost-checklist"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white/70 px-6 py-3 font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200"
          >
            갈아타기 비용 가이드
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">calculators</p>
            <h2 className="section-title mt-1">계산기 목록</h2>
          </div>
          <Link href="/guides" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300">
            전체 가이드 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="content-card group block p-5 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-2xl dark:bg-blue-950/40">{calc.emoji}</div>
              <h3 className="mt-4 font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-300">
                {calc.label} 계산기
              </h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">{calc.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-card p-6">
        <p className="eyebrow">why</p>
        <h2 className="section-title mt-1 mb-3">왜 갈아타기 계산기인가요?</h2>
        <div className="body-copy text-sm space-y-2">
          <p>
            기존 부동산 계산기는 취득세 따로, 대출이자 따로, 중개수수료 따로 계산해야 합니다.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">갈아타기 계산기</strong>는 현재 집 매도부터 새 집 매수까지 전체 자금 흐름을 한 번에 보여줍니다.
            부족 현금, 월 상환 부담, DSR 위험도까지 즉시 확인하세요.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
            ※ 모든 계산 결과는 참고용 추정치이며 법적 효력이 없습니다. 정확한 판단은 세무사·대출 전문가에게 확인하세요.
          </p>
        </div>
      </section>

      <section className="content-card p-6">
        <p className="eyebrow">how to use</p>
        <h2 className="section-title mt-1 mb-4">처음 방문했다면 이 순서로 점검하세요</h2>
        <ol className="grid gap-3 text-sm text-gray-700 dark:text-gray-200 md:grid-cols-3">
          <li className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
            <strong className="block text-gray-900 dark:text-white">1. 갈아타기 현금흐름</strong>
            매도 후 순현금과 새 집 매수 필요 현금을 먼저 비교합니다.
          </li>
          <li className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
            <strong className="block text-gray-900 dark:text-white">2. 대출·DSR 부담</strong>
            월 상환액, 총 이자, DSR 40% 기준 여유를 함께 확인합니다.
          </li>
          <li className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
            <strong className="block text-gray-900 dark:text-white">3. 세금·수수료 검산</strong>
            취득세와 양쪽 중개수수료를 보수적으로 반영해 예비비를 남깁니다.
          </li>
        </ol>
      </section>

      <section>
        <div className="mb-4">
          <p className="eyebrow">guides</p>
          <h2 className="section-title mt-1">검색용 부동산 가이드</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {guideArticles.map((article) => (
            <Link key={article.slug} href={`/guides/${article.slug}`} className="content-card block p-5 transition hover:-translate-y-0.5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">{article.title}</h3>
              <p className="body-copy mt-2 text-sm">{article.description}</p>
              <p className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-300">읽기 →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
