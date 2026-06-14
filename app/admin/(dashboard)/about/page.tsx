import { getAbout } from "@/lib/data"
import { AboutForm } from "./about-form"

export default async function AdminAboutPage() {
  const data = await getAbout()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Tentang</h1>
      <AboutForm data={data} />
    </div>
  )
}
