import { createClient } from "@/lib/supabase/server"
import { InstagramForm } from "./instagram-form"

export default async function AdminInstagramPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from("instagram_posts").select("*").order("sort_order")
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Instagram</h1>
      <InstagramForm posts={posts ?? []} />
    </div>
  )
}
