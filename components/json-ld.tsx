import { siteConfig } from "@/lib/site-config"

type SeoConfig = {
  name: string
  shortName: string
  url: string
  description: string
}

const contactData = {
  address: "Jl. Jendral Ahmad Yani (Samping Polsek Haurgeulis), Haurgeulis",
  phone: "083823334998",
  email: "smppui.haurgeulis@example.com",
  hours: "Senin - Jumat: 07.00 - 15.30 WIB",
}

/**
 * JSON-LD Structured Data untuk SEO Google.
 * Membantu Google memahami bahwa ini adalah lembaga pendidikan (School).
 */
export function JsonLd({ config }: { config?: SeoConfig | null }) {
  const name = config?.name || siteConfig.name
  const shortName = config?.shortName || siteConfig.shortName
  const url = config?.url || siteConfig.url
  const description = config?.description || siteConfig.description

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": `${url}/#organization`,
    name,
    alternateName: shortName,
    description,
    url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contactData.address,
      addressLocality: "Haurgeulis",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    telephone: `+62${contactData.phone.replace(/\D/g, "").replace(/^0/, "")}`,
    email: contactData.email,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "10:30",
    },
    sameAs: [] as string[],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name,
    url,
    description,
    publisher: {
      "@id": `${url}/#organization`,
    },
    inLanguage: "id",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  )
}
