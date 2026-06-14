/**
 * Konfigurasi situs untuk SEO dan metadata.
 * Set NEXT_PUBLIC_SITE_URL di .env saat deploy.
 */
export const siteConfig = {
  name: "SMP PUI HAURGEULIS",
  logo: "/images/foto2/logo_preview_rev_1.png",
  shortName: "SMP PUI",
  description:
    "SMP PUI HAURGEULIS adalah Sekolah Menengah Pertama di bawah naungan Persatuan Umat Islam (PUI) yang berkomitmen membentuk generasi berprestasi, berkarakter, dan berakhlak mulia.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://smp-pui-haurgeulis.example.com",
  locale: "id_ID",
  keywords: [
    "SMP PUI",
    "SMP PUI HAURGEULIS",
    "SMP Haurgeulis",
    "SMP Indramayu",
    "SMP Islam Haurgeulis",
    "Persatuan Umat Islam",
    "Sekolah Menengah Pertama",
  ],
}
