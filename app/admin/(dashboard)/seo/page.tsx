import { getSiteSeoForAdmin } from "@/lib/data"
import { SeoForm } from "./seo-form"

export default async function AdminSeoPage() {
  const data = await getSiteSeoForAdmin()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">SEO & Metadata</h1>
      <p className="mb-6 text-muted-foreground">
        Kelola metadata untuk Google index, sitemap.xml, dan robots.txt. Perubahan mempengaruhi SEO website.
      </p>
      <SeoForm data={data} />
    </div>
  )
}
