import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import ClientPage from "./ClientPage";

const title = "부동산 중개수수료 계산기 | 매매·전세·월세 복비 계산";
const description = "매매, 전세, 월세 거래금액별 부동산 중개수수료 상한액과 법인 부가세 포함 금액을 계산하세요.";
const url = "https://budongsan-calc.vercel.app/calculators/brokerage-fee";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["중개수수료 계산기", "부동산 중개수수료 계산기", "아파트 중개수수료 계산기", "월세 중개수수료 계산기"],
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
          name: "부동산 중개수수료 계산기",
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
