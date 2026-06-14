import { getFooter } from "@/lib/data"
import { FooterForm } from "./footer-form"

export default async function AdminFooterPage() {
  const data = await getFooter()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Footer</h1>
      <FooterForm data={data} />
    </div>
  )
}
