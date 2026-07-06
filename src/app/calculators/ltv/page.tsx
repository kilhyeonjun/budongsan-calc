import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import ClientPage from "./ClientPage";

const title = "LTV 계산기 | 주택담보대출 한도 담보인정비율 계산";
const description = "주택가격, 선순위 대출, 희망 대출액을 넣어 LTV 비율과 70%, 60%, 50% 기준 최대 대출 가능액을 확인하세요.";
const url = "https://budongsan-calc.vercel.app/calculators/ltv";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["LTV 계산기", "주택담보대출 한도 계산기", "담보인정비율 계산", "LTV DSR 계산기"],
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
          name: "LTV 계산기",
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
