import type { MetadataRoute } from "next"
import { getSeoConfig } from "@/lib/seo-config"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoConfig()
  const baseUrl = seo.url.replace(/\/$/, "")
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
