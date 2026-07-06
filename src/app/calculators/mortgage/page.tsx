import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import ClientPage from "./ClientPage";

const title = "주택담보대출 계산기 | 월 상환액·총 이자 계산";
const description = "주택담보대출 원금, 금리, 기간, 상환방식별 월 상환액과 총 이자, 12개월 상환 스케줄을 계산하세요.";
const url = "https://budongsan-calc.vercel.app/calculators/mortgage";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["주택담보대출 계산기", "주담대 이자 계산기", "원리금균등 계산기", "원금균등 계산기"],
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
          "@type": "WebApplication",
          name: "주택담보대출 계산기",
          url,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          inLanguage: "ko-KR",
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        }}
      />
      <ClientPage />
    </>
  );
}
