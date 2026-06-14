"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const BUCKET = "assets"

export async function uploadToStorage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File | null
  const path = formData.get("path") as string | null
  if (!file || !path || typeof file.arrayBuffer !== "function") {
    throw new Error("File atau path tidak valid")
  }
  const supabase = createAdminClient()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const contentType = file.type || "image/jpeg"
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { upsert: true, contentType })

  if (error) {
    throw new Error(error.message || "Gagal mengunggah ke storage")
  }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return urlData.publicUrl
}

// Hero
export async function updateHero(formData: {
  brosur_image_url?: string | null
  title?: string
  subtitle?: string
  description?: string
  cta_primary?: string
  cta_secondary?: string
  image_url?: string | null
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("hero").select("id").limit(1).single()
  if (existing) {
    await supabase.from("hero").update(formData).eq("id", existing.id)
  } else {
    await supabase.from("hero").insert(formData)
  }
  revalidatePath("/")
}

export async function updateHeroStats(stats: { value: string; label: string }[]) {
  const supabase = await createClient()
  const { data: hero } = await supabase.from("hero").select("id").limit(1).single()
  if (!hero) return
  await supabase.from("hero_stats").delete().eq("hero_id", hero.id)
  for (let i = 0; i < stats.length; i++) {
    await supabase.from("hero_stats").insert({
      hero_id: hero.id,
      value: stats[i].value,
      label: stats[i].label,
      sort_order: i,
    })
  }
  revalidatePath("/")
}

// About
export async function updateAbout(formData: {
  title?: string
  subtitle?: string
  description?: string
  image_url?: string | null
  paragraphs?: string[]
  highlights?: string[]
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("about").select("id").limit(1).single()
  if (existing) {
    await supabase.from("about").update(formData).eq("id", existing.id)
  } else {
    await supabase.from("about").insert(formData)
  }
  revalidatePath("/")
}

// Visi Misi
export async function updateVisiMisi(formData: {
  title?: string
  icon_image_url?: string | null
  subtitle?: string
  visi_title?: string
  visi_content?: string
  misi_title?: string
  misi_items?: string[]
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("visi_misi").select("id").limit(1).single()
  const payload = {
    title: formData.title,
    icon_image_url: formData.icon_image_url,
    subtitle: formData.subtitle,
    visi_title: formData.visi_title,
    visi_content: formData.visi_content,
    misi_title: formData.misi_title,
    misi_items: formData.misi_items,
  }
  if (existing) {
    await supabase.from("visi_misi").update(payload).eq("id", existing.id)
  } else {
    await supabase.from("visi_misi").insert(payload)
  }
  revalidatePath("/")
}

export async function updateVisiMisiValues(
  values: { title: string; description: string; icon_image_url?: string | null }[]
) {
  const supabase = await createClient()
  const { data: vm } = await supabase.from("visi_misi").select("id").limit(1).single()
  if (!vm) return
  await supabase.from("visi_misi_values").delete().eq("visi_misi_id", vm.id)
  for (let i = 0; i < values.length; i++) {
    await supabase.from("visi_misi_values").insert({
      visi_misi_id: vm.id,
      title: values[i].title,
      description: values[i].description,
      icon_image_url: values[i].icon_image_url,
      sort_order: i,
    })
  }
  revalidatePath("/")
}

// Programs
export async function updatePrograms(formData: {
  title?: string
  subtitle?: string
  program_unggulan?: string
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("programs").select("id").limit(1).single()
  if (existing) {
    await supabase.from("programs").update(formData).eq("id", existing.id)
  } else {
    await supabase.from("programs").insert(formData)
  }
  revalidatePath("/")
}

export async function updateProgramItems(
  items: {
    title: string
    description: string
    icon_image_url?: string | null
    features: string[]
  }[]
) {
  const supabase = await createClient()
  const { data: prog } = await supabase.from("programs").select("id").limit(1).single()
  if (!prog) return
  await supabase.from("program_items").delete().eq("programs_id", prog.id)
  for (let i = 0; i < items.length; i++) {
    await supabase.from("program_items").insert({
      programs_id: prog.id,
      title: items[i].title,
      description: items[i].description,
      icon_image_url: items[i].icon_image_url,
      features: items[i].features,
      sort_order: i,
    })
  }
  revalidatePath("/")
}

// Ekstrakurikuler
export async function updateExtracurricularSection(formData: {
  title: string
  subtitle: string
  lead: string
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("extracurriculars").select("id").limit(1).maybeSingle()
  if (existing) {
    await supabase.from("extracurriculars").update(formData).eq("id", existing.id)
  } else {
    await supabase.from("extracurriculars").insert(formData)
  }
  revalidatePath("/")
}

export async function createExtracurricularItem(data: {
  title: string
  description: string
  detail?: string
  icon_image_url?: string | null
  features?: string[]
}) {
  const supabase = await createClient()
  let { data: section } = await supabase.from("extracurriculars").select("id").limit(1).maybeSingle()
  if (!section) {
    const { data: ins, error } = await supabase
      .from("extracurriculars")
      .insert({ title: "Ekstrakurikuler", subtitle: "", lead: "" })
      .select("id")
      .single()
    if (error) throw new Error(error.message)
    section = ins
  }
  if (!section) throw new Error("Gagal memuat section ekstrakurikuler")

  const { count } = await supabase
    .from("extracurricular_items")
    .select("*", { count: "exact", head: true })
    .eq("extracurriculars_id", section.id)

  const { error } = await supabase.from("extracurricular_items").insert({
    extracurriculars_id: section.id,
    title: data.title,
    description: data.description,
    detail: data.detail ?? "",
    icon_image_url: data.icon_image_url ?? null,
    features: data.features ?? [],
    sort_order: count ?? 0,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/")
}

export async function updateExtracurricularItem(
  id: string,
  data: {
    title?: string
    description?: string
    detail?: string
    icon_image_url?: string | null
    features?: string[]
  }
) {
  const supabase = await createClient()
  const { error } = await supabase.from("extracurricular_items").update(data).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
}

export async function deleteExtracurricularItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("extracurricular_items").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
}

// Facilities
export async function createFacility(data: {
  title: string
  description: string
  image_url?: string | null
}) {
  const supabase = await createClient()
  const { data: items } = await supabase.from("facilities").select("id").order("sort_order", { ascending: false }).limit(1)
  const sortOrder = items?.[0] ? 0 : 0
  const { count } = await supabase.from("facilities").select("*", { count: "exact", head: true })
  await supabase.from("facilities").insert({
    ...data,
    sort_order: count ?? 0,
  })
  revalidatePath("/")
}

export async function updateFacility(
  id: string,
  data: { title?: string; description?: string; image_url?: string | null }
) {
  const supabase = await createClient()
  await supabase.from("facilities").update(data).eq("id", id)
  revalidatePath("/")
}

export async function deleteFacility(id: string) {
  const supabase = await createClient()
  await supabase.from("facilities").delete().eq("id", id)
  revalidatePath("/")
}

// Teachers
export async function createTeacher(data: {
  name: string
  role: string
  description?: string
  image_url?: string | null
}) {
  const supabase = await createClient()
  const { count } = await supabase.from("teachers").select("*", { count: "exact", head: true })
  await supabase.from("teachers").insert({
    ...data,
    sort_order: count ?? 0,
  })
  revalidatePath("/")
}

export async function updateTeacher(
  id: string,
  data: { name?: string; role?: string; description?: string; image_url?: string | null }
) {
  const supabase = await createClient()
  await supabase.from("teachers").update(data).eq("id", id)
  revalidatePath("/")
}

export async function deleteTeacher(id: string) {
  const supabase = await createClient()
  await supabase.from("teachers").delete().eq("id", id)
  revalidatePath("/")
}

// Gallery
export async function createGalleryImage(data: {
  src_url: string
  alt?: string
  caption?: string
}) {
  const supabase = await createClient()
  const { count } = await supabase.from("gallery_images").select("*", { count: "exact", head: true })
  await supabase.from("gallery_images").insert({
    ...data,
    sort_order: count ?? 0,
  })
  revalidatePath("/")
}

export async function updateGalleryImage(
  id: string,
  data: { src_url?: string; alt?: string; caption?: string }
) {
  const supabase = await createClient()
  await supabase.from("gallery_images").update(data).eq("id", id)
  revalidatePath("/")
}

export async function deleteGalleryImage(id: string) {
  const supabase = await createClient()
  await supabase.from("gallery_images").delete().eq("id", id)
  revalidatePath("/")
}

// Testimonials
export async function createTestimonial(data: {
  name: string
  role: string
  content: string
  rating?: number
}) {
  const supabase = await createClient()
  const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true })
  await supabase.from("testimonials").insert({
    ...data,
    rating: data.rating ?? 5,
    sort_order: count ?? 0,
  })
  revalidatePath("/")
}

export async function updateTestimonial(
  id: string,
  data: { name?: string; role?: string; content?: string; rating?: number }
) {
  const supabase = await createClient()
  await supabase.from("testimonials").update(data).eq("id", id)
  revalidatePath("/")
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  await supabase.from("testimonials").delete().eq("id", id)
  revalidatePath("/")
}

// Contact
export async function updateContact(formData: {
  title?: string
  subtitle?: string
  description?: string
  address?: string
  phone?: string
  whatsapp?: string
  email?: string
  hours?: string
  social?: Record<string, string>
  map_embed?: string
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("contact").select("id").limit(1).single()
  if (existing) {
    await supabase.from("contact").update(formData).eq("id", existing.id)
  } else {
    await supabase.from("contact").insert(formData)
  }
  revalidatePath("/")
}

// Navbar
export async function updateNavbar(formData: {
  brand?: string
  brand_image_url?: string | null
  brand_image_alt?: string
  links?: { label: string; href: string }[]
  cta?: { label: string; href: string }
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("navbar").select("id").limit(1).single()
  if (existing) {
    await supabase.from("navbar").update(formData).eq("id", existing.id)
  } else {
    await supabase.from("navbar").insert(formData)
  }
  revalidatePath("/")
}

// Footer
export async function updateFooter(formData: {
  brand?: string
  description?: string
  quick_links?: { label: string; href: string }[]
  programs?: { label: string; href: string }[]
  copyright?: string
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("footer").select("id").limit(1).single()
  if (existing) {
    await supabase.from("footer").update(formData).eq("id", existing.id)
  } else {
    await supabase.from("footer").insert(formData)
  }
  revalidatePath("/")
}

// Instagram
export async function createInstagramPost(embed_html: string) {
  const supabase = await createClient()
  const { count } = await supabase.from("instagram_posts").select("*", { count: "exact", head: true })
  await supabase.from("instagram_posts").insert({
    embed_html,
    sort_order: count ?? 0,
  })
  revalidatePath("/")
}

export async function updateInstagramPost(id: string, embed_html: string) {
  const supabase = await createClient()
  await supabase.from("instagram_posts").update({ embed_html }).eq("id", id)
  revalidatePath("/")
}

export async function deleteInstagramPost(id: string) {
  const supabase = await createClient()
  await supabase.from("instagram_posts").delete().eq("id", id)
  revalidatePath("/")
}

// Chatbot settings
export async function updateChatbotSettings(formData: {
  gemini_api_key?: string
  enabled?: boolean
  use_gemini_api?: boolean
  welcome_message?: string
  model?: string
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from("chatbot_settings")
    .select("id")
    .limit(1)
    .single()
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (formData.gemini_api_key !== undefined) payload.gemini_api_key = formData.gemini_api_key
  if (formData.enabled !== undefined) payload.enabled = formData.enabled
  if (formData.use_gemini_api !== undefined) payload.use_gemini_api = formData.use_gemini_api
  if (formData.welcome_message !== undefined) payload.welcome_message = formData.welcome_message
  if (formData.model !== undefined) payload.model = formData.model

  if (existing) {
    await supabase.from("chatbot_settings").update(payload).eq("id", existing.id)
  } else {
    await supabase.from("chatbot_settings").insert({
      ...payload,
      gemini_api_key: formData.gemini_api_key ?? "",
      enabled: formData.enabled ?? true,
      use_gemini_api: formData.use_gemini_api ?? true,
      welcome_message: formData.welcome_message ?? "Halo! Ada yang bisa saya bantu?",
      model: formData.model ?? "gemini-2.0-flash",
    })
  }
  revalidatePath("/")
  revalidatePath("/admin/chatbot")
}

// Chatbot FAQ CRUD
export async function createChatbotFaq(data: { question: string; answer: string }) {
  const supabase = await createClient()
  const { count } = await supabase.from("chatbot_faq").select("*", { count: "exact", head: true })
  await supabase.from("chatbot_faq").insert({
    question: data.question.trim(),
    answer: data.answer.trim(),
    sort_order: count ?? 0,
  })
  revalidatePath("/admin/chatbot")
}

export async function updateChatbotFaq(
  id: string,
  data: { question?: string; answer?: string }
) {
  const supabase = await createClient()
  await supabase.from("chatbot_faq").update(data).eq("id", id)
  revalidatePath("/admin/chatbot")
}

export async function deleteChatbotFaq(id: string) {
  const supabase = await createClient()
  await supabase.from("chatbot_faq").delete().eq("id", id)
  revalidatePath("/admin/chatbot")
}

// Chatbot Keywords CRUD
export async function createChatbotKeyword(data: { label: string; message: string }) {
  const supabase = await createClient()
  const { count } = await supabase.from("chatbot_keywords").select("*", { count: "exact", head: true })
  await supabase.from("chatbot_keywords").insert({
    label: data.label.trim(),
    message: data.message.trim(),
    sort_order: count ?? 0,
  })
  revalidatePath("/admin/chatbot")
}

export async function updateChatbotKeyword(
  id: string,
  data: { label?: string; message?: string }
) {
  const supabase = await createClient()
  await supabase.from("chatbot_keywords").update(data).eq("id", id)
  revalidatePath("/admin/chatbot")
}

export async function deleteChatbotKeyword(id: string) {
  const supabase = await createClient()
  await supabase.from("chatbot_keywords").delete().eq("id", id)
  revalidatePath("/admin/chatbot")
}

// Site SEO & Sitemap
const SEO_ID = "00000000-0000-0000-0000-000000000001"

export async function updateSiteSeo(formData: {
  site_name?: string
  short_name?: string
  site_url?: string
  description?: string
  keywords?: string[]
  title_template?: string
  robots_index?: boolean
  robots_follow?: boolean
  google_verification?: string
  open_graph_image?: string
  sitemap_entries?: { path: string; changeFrequency: string; priority: number }[]
}) {
  const supabase = await createClient()
  const payload = {
    ...formData,
    updated_at: new Date().toISOString(),
  }
  const { data: existing } = await supabase.from("site_seo").select("id").eq("id", SEO_ID).single()
  if (existing) {
    await supabase.from("site_seo").update(payload).eq("id", SEO_ID)
  } else {
    await supabase.from("site_seo").insert({ id: SEO_ID, ...payload })
  }
  revalidatePath("/")
  revalidatePath("/admin/seo")
}
