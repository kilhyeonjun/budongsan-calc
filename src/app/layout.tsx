import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "부동산 갈아타기 계산기 | 매도·매수·대출·세금 한번에",
    template: "%s | 부동산 갈아타기 계산기",
  },
  description:
    "집 팔고 더 큰 집 갈 수 있을까? 매도·매수·대출·세금·중개수수료·부족현금을 한 번에 계산하는 부동산 갈아타기 계산기. DSR, LTV, 취득세, 중개수수료까지.",
  keywords: [
    "갈아타기 계산기",
    "부동산 갈아타기",
    "아파트 갈아타기",
    "주택담보대출 계산기",
    "DSR 계산기",
    "LTV 계산기",
    "취득세 계산기",
    "중개수수료 계산기",
  ],
  openGraph: {
    title: "부동산 갈아타기 계산기",
    description: "집 팔고 더 큰 집 갈 수 있을까? 매도·매수·대출·세금을 한 번에 계산하세요.",
    type: "website",
    locale: "ko_KR",
  },
  verification: {
    google: "wt1U3HixvcLottY64RmI8rPhxaOpunHDeLIV7wjvWBU",
    other: {
      "naver-site-verification": "36ccacebe11a20f69e389a1fb2eafec2cccd01d1",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-noto-sans-kr)]">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
