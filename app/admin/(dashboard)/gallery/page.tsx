import { createClient } from "@/lib/supabase/server"
import { GalleryForm } from "./gallery-form"

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: images } = await supabase.from("gallery_images").select("*").order("sort_order")
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Galeri</h1>
      <GalleryForm images={images ?? []} />
    </div>
  )
}
