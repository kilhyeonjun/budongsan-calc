import Link from "next/link";
import { guideArticles } from "@/lib/guideContent";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "부동산 가이드",
  description: "갈아타기, DSR, 취득세, 중개수수료 계산을 위한 부동산 가이드 모음입니다.",
  alternates: {
    canonical: "https://budongsan-calc.vercel.app/guides",
  },
};

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "부동산 가이드",
          url: "https://budongsan-calc.vercel.app/guides",
          inLanguage: "ko-KR",
          description: metadata.description,
        }}
      />
      <section className="hero-panel p-6 md:p-8">
        <p className="eyebrow">부동산 가이드</p>
        <h1 className="mt-2 text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
          계산 전에 확인할 핵심 기준
        </h1>
        <p className="body-copy mt-3 max-w-2xl">
          검색으로 들어온 사용자가 바로 이해할 수 있도록 갈아타기 비용, DSR, 취득세, 중개수수료 기준을 정리했습니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {guideArticles.map((article) => (
          <Link key={article.slug} href={`/guides/${article.slug}`} className="content-card block p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="section-title mt-4">{article.title}</h2>
            <p className="body-copy mt-2 text-sm">{article.description}</p>
            <p className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-300">읽기 →</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
