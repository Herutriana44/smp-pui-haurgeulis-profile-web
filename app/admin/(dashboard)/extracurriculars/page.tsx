import { createClient } from "@/lib/supabase/server"
import { ExtracurricularsForm } from "./extracurriculars-form"

export default async function AdminExtracurricularsPage() {
  const supabase = await createClient()
  const { data: section } = await supabase.from("extracurriculars").select("*").limit(1).maybeSingle()
  const { data: items } = section
    ? await supabase
        .from("extracurricular_items")
        .select("*")
        .eq("extracurriculars_id", section.id)
        .order("sort_order")
    : { data: [] as never[] }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Ekstrakurikuler</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Kelola judul section dan daftar kegiatan. Pastikan migrasi{" "}
        <code className="rounded bg-muted px-1 text-xs">014_extracurriculars.sql</code> sudah dijalankan di Supabase,
        lalu jalankan seed bila perlu.
      </p>
      <ExtracurricularsForm section={section} items={items ?? []} />
    </div>
  )
}
