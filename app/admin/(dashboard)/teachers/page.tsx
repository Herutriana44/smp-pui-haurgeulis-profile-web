import { createClient } from "@/lib/supabase/server"
import { TeachersForm } from "./teachers-form"

export default async function AdminTeachersPage() {
  const supabase = await createClient()
  const { data: teachers } = await supabase.from("teachers").select("*").order("sort_order")
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Guru</h1>
      <TeachersForm teachers={teachers ?? []} />
    </div>
  )
}
