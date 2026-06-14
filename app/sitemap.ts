import type { MetadataRoute } from "next"
import { getSeoConfig } from "@/lib/seo-config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoConfig()
  const baseUrl = seo.url.replace(/\/$/, "")

  return seo.sitemapEntries.map((entry) => ({
    url: `${baseUrl}${entry.path.startsWith("/") ? entry.path : `/${entry.path}`}`,
    lastModified: new Date(),
    changeFrequency: (entry.changeFrequency || "weekly") as
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never",
    priority: entry.priority ?? 1,
  }))
}
