import { createClient } from "@/lib/supabase/server"
import { FacilitiesForm } from "./facilities-form"

export default async function AdminFacilitiesPage() {
  const supabase = await createClient()
  const { data: facilities } = await supabase
    .from("facilities")
    .select("*")
    .order("sort_order")
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Fasilitas</h1>
      <FacilitiesForm facilities={facilities ?? []} />
    </div>
  )
}
