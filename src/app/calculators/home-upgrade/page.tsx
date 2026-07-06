import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculatorGuides } from "@/lib/guideContent";
import ClientPage from "./ClientPage";

const title = "부동산 갈아타기 계산기 | 매도·매수·대출·세금 한번에";
const description = "현재 집 매도부터 새 집 매수까지 부족 현금, 월 상환액, DSR, LTV, 취득세, 중개수수료를 한 번에 계산하세요.";
const faq = calculatorGuides["home-upgrade"].faq;
const url = "https://budongsan-calc.vercel.app/calculators/home-upgrade";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["부동산 갈아타기 계산기", "아파트 갈아타기", "부족 현금 계산", "주택 매도 매수 계산기"],
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    locale: "ko_KR",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "부동산 갈아타기 계산기",
              url,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              inLanguage: "ko-KR",
              description,
              offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
            },
            {
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ],
        }}
      />
      <ClientPage />
    </>
  );
}
