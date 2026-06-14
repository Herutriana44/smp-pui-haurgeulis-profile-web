/**
 * Resolve SEO config: DB (site_seo) > site-config fallback
 */
import { siteConfig } from "@/lib/site-config"
import { getSiteSeo } from "@/lib/data"

export async function getSeoConfig() {
  const seo = await getSiteSeo()
  if (!seo) {
    return {
      name: siteConfig.name,
      shortName: siteConfig.shortName,
      url: siteConfig.url,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
      titleTemplate: "SMP PUI HAURGEULIS — Pendidikan Menengah di Haurgeulis",
      robotsIndex: true,
      robotsFollow: true,
      googleVerification: "",
      openGraphImage: siteConfig.logo,
      sitemapEntries: [{ path: "/", changeFrequency: "weekly" as const, priority: 1 }],
    }
  }
  return {
    name: seo.siteName || siteConfig.name,
    shortName: seo.shortName || siteConfig.shortName,
    url: seo.siteUrl || siteConfig.url,
    description: seo.description || siteConfig.description,
    keywords: seo.keywords?.length ? seo.keywords : siteConfig.keywords,
    titleTemplate: seo.titleTemplate || "SMP PUI HAURGEULIS — Pendidikan Menengah di Haurgeulis",
    robotsIndex: seo.robotsIndex,
    robotsFollow: seo.robotsFollow,
    googleVerification: seo.googleVerification,
    openGraphImage: seo.openGraphImage || siteConfig.logo,
    sitemapEntries: seo.sitemapEntries?.length
      ? seo.sitemapEntries
      : [{ path: "/", changeFrequency: "weekly" as const, priority: 1 }],
  }
}
