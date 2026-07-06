import type { MetadataRoute } from "next";
import { guideArticles } from "@/lib/guideContent";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://budongsan-calc.vercel.app";

  const routes = [
    "",
    "/calculators/home-upgrade",
    "/calculators/mortgage",
    "/calculators/dsr",
    "/calculators/ltv",
    "/calculators/acquisition-tax",
    "/calculators/brokerage-fee",
    "/guides",
    ...guideArticles.map((article) => `/guides/${article.slug}`),
    "/about",
    "/disclaimer",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/calculators") || route.startsWith("/guides") ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/calculators/home-upgrade" ? 0.9 : route.startsWith("/guides") ? 0.8 : 0.7,
  }));
}
