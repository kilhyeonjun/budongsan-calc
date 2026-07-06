import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideArticle, guideArticles } from "@/lib/guideContent";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guideArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideArticle(slug);

  if (!article) {
    return { title: "가이드 없음" };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      locale: "ko_KR",
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideArticle(slug);

  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <header className="hero-panel p-6 md:p-8">
        <Link href="/guides" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300">
          ← 가이드 목록
        </Link>
        <div className="mt-5 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-4 text-2xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {article.title}
        </h1>
        <p className="body-copy mt-3 text-base">{article.description}</p>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">최종 업데이트: {article.updatedAt}</p>
      </header>

      <div className="content-card p-5 md:p-7 space-y-7">
        {article.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="section-title">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="body-copy leading-7">{paragraph}</p>
            ))}
            {section.bullets && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <aside className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 dark:border-blue-900/60 dark:bg-blue-950/30">
        <p className="text-sm text-gray-600 dark:text-gray-300">직접 숫자를 넣어 확인해보세요.</p>
        <Link href={article.relatedCalculator.href} className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          {article.relatedCalculator.label} 열기 →
        </Link>
      </aside>
    </article>
  );
}
