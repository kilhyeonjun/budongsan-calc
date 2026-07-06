import type { MetadataRoute } from "next";
import { guideArticles } from "@/lib/guideContent";

const BASE_URL = "https://budongsan-calc.vercel.app";
const SITE_UPDATED_AT = "2026-07-06";

const staticRoutes = [
  { route: "", priority: 1.0, changeFrequency: "weekly" as const },
  { route: "/calculators/home-upgrade", priority: 0.9, changeFrequency: "weekly" as const },
  { route: "/calculators/mortgage", priority: 0.8, changeFrequency: "weekly" as const },
  { route: "/calculators/dsr", priority: 0.8, changeFrequency: "weekly" as const },
  { route: "/calculators/ltv", priority: 0.8, changeFrequency: "weekly" as const },
  { route: "/calculators/acquisition-tax", priority: 0.8, changeFrequency: "weekly" as const },
  { route: "/calculators/brokerage-fee", priority: 0.8, changeFrequency: "weekly" as const },
  { route: "/guides", priority: 0.8, changeFrequency: "weekly" as const },
  { route: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { route: "/disclaimer", priority: 0.4, changeFrequency: "yearly" as const },
  { route: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map(({ route, priority, changeFrequency }) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(SITE_UPDATED_AT),
    changeFrequency,
    priority,
  }));

  const guideEntries = guideArticles.map((article) => ({
    url: `${BASE_URL}/guides/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...guideEntries];
}
