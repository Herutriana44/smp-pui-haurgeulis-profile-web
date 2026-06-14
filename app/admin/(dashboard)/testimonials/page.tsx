import { createClient } from "@/lib/supabase/server"
import { TestimonialsForm } from "./testimonials-form"

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase.from("testimonials").select("*").order("sort_order")
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Testimoni</h1>
      <TestimonialsForm testimonials={testimonials ?? []} />
    </div>
  )
}
