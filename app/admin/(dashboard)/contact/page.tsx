import { getContact } from "@/lib/data"
import { ContactForm } from "./contact-form"

export default async function AdminContactPage() {
  const data = await getContact()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Kontak</h1>
      <ContactForm data={data} />
    </div>
  )
}
