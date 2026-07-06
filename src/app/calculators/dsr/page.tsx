import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculatorGuides } from "@/lib/guideContent";
import ClientPage from "./ClientPage";

const title = "DSR 계산기 | 주담대·신용대출 총부채원리금상환비율";
const description = "연소득과 기존·신규 대출 연간 원리금으로 DSR 40% 기준 여유 또는 초과 금액을 계산하세요.";
const faq = calculatorGuides["dsr"].faq;
const url = "https://budongsan-calc.vercel.app/calculators/dsr";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["DSR 계산기", "주담대 DSR 계산기", "스트레스 DSR 계산기", "부부 DSR 계산기"],
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
              name: "DSR 계산기",
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
