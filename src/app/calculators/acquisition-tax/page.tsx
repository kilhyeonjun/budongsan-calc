import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculatorGuides } from "@/lib/guideContent";
import ClientPage from "./ClientPage";

const title = "취득세 계산기 | 주택·아파트 취득세 간이 계산";
const description = "주택 가격, 전용면적, 주택 수, 조정대상지역 여부로 취득세, 지방교육세, 농어촌특별세를 간이 계산하세요.";
const faq = calculatorGuides["acquisition-tax"].faq;
const url = "https://budongsan-calc.vercel.app/calculators/acquisition-tax";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["취득세 계산기", "아파트 취득세 계산기", "주택 취득세 계산기", "부동산 취득세 계산기"],
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
              name: "취득세 계산기",
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
