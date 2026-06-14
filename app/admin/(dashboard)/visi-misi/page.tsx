import { getVisiMisi } from "@/lib/data"
import { VisiMisiForm } from "./visi-misi-form"

export default async function AdminVisiMisiPage() {
  const data = await getVisiMisi()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Visi & Misi</h1>
      <VisiMisiForm data={data} />
    </div>
  )
}
