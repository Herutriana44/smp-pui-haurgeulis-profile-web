/**
 * Data fetching from Supabase - used by Server Components.
 * Falls back to JSON imports if Supabase is not configured.
 */

import { createClient } from "@/lib/supabase/server"

const hasSupabase = () =>
  !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

export async function getHero() {
  const fallback = (await import("@/data/hero.json")).default
  const mapHero = (data: typeof fallback) => ({
    brosurImage: data.brosurImage,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    cta_primary: data.cta_primary,
    cta_secondary: data.cta_secondary,
    image: data.image,
    stats: data.stats || [],
  })

  if (!hasSupabase()) return mapHero(fallback)

  try {
    const supabase = await createClient()
    const { data: hero } = await supabase.from("hero").select("*").limit(1).single()
    if (!hero) return mapHero(fallback)
    const { data: stats } = await supabase
      .from("hero_stats")
      .select("*")
      .eq("hero_id", hero.id)
      .order("sort_order")
    return {
      brosurImage: hero.brosur_image_url,
      title: hero.title,
      subtitle: hero.subtitle,
      description: hero.description,
      cta_primary: hero.cta_primary,
      cta_secondary: hero.cta_secondary,
      image: hero.image_url,
      stats: (stats || []).map((s: { value: string; label: string }) => ({ value: s.value, label: s.label })),
    }
  } catch {
    return mapHero(fallback)
  }
}

export async function getAbout() {
  const fallback = (await import("@/data/about.json")).default
  const mapAbout = (data: typeof fallback) => ({
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    image: data.image,
    paragraphs: data.paragraphs || [],
    highlights: data.highlights || [],
  })

  if (!hasSupabase()) return mapAbout(fallback)

  try {
    const supabase = await createClient()
    const { data } = await supabase.from("about").select("*").limit(1).single()
    if (!data) return mapAbout(fallback)
    return {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      image: data.image_url,
      paragraphs: data.paragraphs || [],
      highlights: data.highlights || [],
    }
  } catch {
    return mapAbout(fallback)
  }
}

export async function getVisiMisi() {
  const fallback = (await import("@/data/visi-misi.json")).default

  if (!hasSupabase()) return fallback

  try {
    const supabase = await createClient()
    const { data: vm } = await supabase.from("visi_misi").select("*").limit(1).single()
    if (!vm) return fallback
    const { data: values } = await supabase
      .from("visi_misi_values")
      .select("*")
      .eq("visi_misi_id", vm.id)
      .order("sort_order")
    return {
      title: vm.title,
      iconImage: vm.icon_image_url,
      subtitle: vm.subtitle,
      visi: { title: vm.visi_title, content: vm.visi_content },
      misi: { title: vm.misi_title, items: vm.misi_items || [] },
      values: (values || []).map((v: { title: string; description: string; icon_image_url: string }) => ({
        title: v.title,
        description: v.description,
        iconImage: v.icon_image_url,
      })),
    }
  } catch {
    return fallback
  }
}

export async function getPrograms() {
  const fallback = (await import("@/data/programs.json")).default

  if (!hasSupabase()) return fallback

  try {
    const supabase = await createClient()
    const { data: prog } = await supabase.from("programs").select("*").limit(1).single()
    if (!prog) return fallback
    const { data: items } = await supabase
      .from("program_items")
      .select("*")
      .eq("programs_id", prog.id)
      .order("sort_order")
    return {
      title: prog.title,
      subtitle: prog.subtitle,
      program_unggulan: prog.program_unggulan,
      programs: (items || []).map((p: { title: string; description: string; icon_image_url: string; features: string[] }) => ({
        title: p.title,
        description: p.description,
        iconImage: p.icon_image_url,
        features: p.features || [],
      })),
    }
  } catch {
    return fallback
  }
}

type ExtraItem = {
  title: string
  description: string
  detail?: string
  iconImage?: string
  features: string[]
}

export async function getExtracurriculars() {
  const fallback = (await import("@/data/extracurriculars.json")).default
  const mapItems = (items: ExtraItem[]) =>
    items.map((i) => ({
      title: i.title,
      description: i.description,
      detail: i.detail || "",
      iconImage: i.iconImage,
      features: i.features || [],
    }))

  if (!hasSupabase()) {
    return {
      title: fallback.title,
      subtitle: fallback.subtitle,
      lead: fallback.lead,
      items: mapItems(fallback.items),
    }
  }

  try {
    const supabase = await createClient()
    const { data: section } = await supabase.from("extracurriculars").select("*").limit(1).single()
    if (!section) {
      return {
        title: fallback.title,
        subtitle: fallback.subtitle,
        lead: fallback.lead,
        items: mapItems(fallback.items),
      }
    }
    const { data: rows } = await supabase
      .from("extracurricular_items")
      .select("*")
      .eq("extracurriculars_id", section.id)
      .order("sort_order")

    if (!rows?.length) {
      return {
        title: fallback.title,
        subtitle: fallback.subtitle,
        lead: fallback.lead,
        items: mapItems(fallback.items),
      }
    }

    return {
      title: section.title || fallback.title,
      subtitle: section.subtitle || fallback.subtitle,
      lead: section.lead || fallback.lead,
      items: rows.map((r) => ({
        title: r.title,
        description: r.description || "",
        detail: r.detail || "",
        iconImage: r.icon_image_url || undefined,
        features: (r.features as string[]) || [],
      })),
    }
  } catch {
    return {
      title: fallback.title,
      subtitle: fallback.subtitle,
      lead: fallback.lead,
      items: mapItems(fallback.items),
    }
  }
}

export async function getFacilities() {
  const tmpl = (await import("@/data/facilities.json")).default
  if (!hasSupabase()) return tmpl

  try {
    const supabase = await createClient()
    const { data: items } = await supabase
      .from("facilities")
      .select("*")
      .order("sort_order")
    if (!items?.length) return tmpl
    return {
      title: tmpl.title,
      subtitle: tmpl.subtitle,
      facilities: items.map((f: { title: string; description: string; image_url: string }) => ({
        title: f.title,
        description: f.description,
        image: f.image_url || "/placeholder.svg",
      })),
    }
  } catch {
    return tmpl
  }
}

export async function getTeachers() {
  const tmpl = (await import("@/data/teachers.json")).default
  if (!hasSupabase()) return tmpl

  try {
    const supabase = await createClient()
    const { data: items } = await supabase
      .from("teachers")
      .select("*")
      .order("sort_order")
    if (!items?.length) return tmpl
    return {
      title: tmpl.title,
      subtitle: tmpl.subtitle,
      teachers: items.map((t: { name: string; role: string; description: string; image_url: string }) => ({
        name: t.name,
        role: t.role,
        description: t.description,
        image: t.image_url || "/placeholder.svg",
      })),
    }
  } catch {
    return tmpl
  }
}

export async function getGallery() {
  const tmpl = (await import("@/data/gallery.json")).default
  if (!hasSupabase()) return tmpl

  try {
    const supabase = await createClient()
    const { data: items } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order")
    if (!items?.length) return tmpl
    return {
      title: tmpl.title,
      subtitle: tmpl.subtitle,
      images: items.map((g: { src_url: string; alt: string; caption: string }) => ({
        src: g.src_url,
        alt: g.alt,
        caption: g.caption,
      })),
    }
  } catch {
    return tmpl
  }
}

export async function getTestimonials() {
  const tmpl = (await import("@/data/testimonials.json")).default
  if (!hasSupabase()) return tmpl

  try {
    const supabase = await createClient()
    const { data: items } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order")
    if (!items?.length) return tmpl
    return {
      title: tmpl.title,
      subtitle: tmpl.subtitle,
      testimonials: items.map((t: { name: string; role: string; content: string; rating: number }) => ({
        name: t.name,
        role: t.role,
        content: t.content,
        rating: t.rating,
      })),
    }
  } catch {
    return tmpl
  }
}

export async function getContact() {
  const fallback = (await import("@/data/contact.json")).default

  if (!hasSupabase()) return fallback

  try {
    const supabase = await createClient()
    const { data } = await supabase.from("contact").select("*").limit(1).single()
    if (!data) return fallback
    return {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      address: data.address,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      hours: data.hours,
      social: data.social || {},
      map_embed: data.map_embed,
    }
  } catch {
    return fallback
  }
}

export async function getNavbar() {
  const fallback = (await import("@/data/navbar.json")).default

  if (!hasSupabase()) return fallback

  try {
    const supabase = await createClient()
    const { data } = await supabase.from("navbar").select("*").limit(1).single()
    if (!data) return fallback
    return {
      brand: data.brand,
      brandImage: data.brand_image_url,
      brandImageAlt: data.brand_image_alt,
      links: data.links || [],
      cta: data.cta || {},
    }
  } catch {
    return fallback
  }
}

export async function getFooter() {
  const fallback = (await import("@/data/footer.json")).default

  if (!hasSupabase()) return fallback

  try {
    const supabase = await createClient()
    const { data } = await supabase.from("footer").select("*").limit(1).single()
    if (!data) return fallback
    return {
      brand: data.brand,
      description: data.description,
      quick_links: data.quick_links || [],
      programs: data.programs || [],
      copyright: data.copyright,
    }
  } catch {
    return fallback
  }
}

export async function getInstagramPosts() {
  const tmpl = (await import("@/data/instagram-post.json")).default
  if (!hasSupabase()) return tmpl

  try {
    const supabase = await createClient()
    const { data: items } = await supabase
      .from("instagram_posts")
      .select("*")
      .order("sort_order")
    if (!items?.length) return tmpl
    return {
      title: tmpl.title,
      subtitle: tmpl.subtitle,
      post: items.map((p: { embed_html: string }) => p.embed_html),
    }
  } catch {
    return tmpl
  }
}

/** Site SEO & metadata untuk layout, sitemap, robots */
export async function getSiteSeo(): Promise<{
  siteName: string
  shortName: string
  siteUrl: string
  description: string
  keywords: string[]
  titleTemplate: string
  robotsIndex: boolean
  robotsFollow: boolean
  googleVerification: string
  openGraphImage: string
  sitemapEntries: { path: string; changeFrequency: string; priority: number }[]
} | null> {
  if (!hasSupabase()) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_seo").select("*").limit(1).maybeSingle()
    if (!data) return null
    return {
      siteName: data.site_name || "",
      shortName: data.short_name || "",
      siteUrl: data.site_url || "",
      description: data.description || "",
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      titleTemplate: data.title_template || "",
      robotsIndex: data.robots_index !== false,
      robotsFollow: data.robots_follow !== false,
      googleVerification: data.google_verification || "",
      openGraphImage: data.open_graph_image || "",
      sitemapEntries: Array.isArray(data.sitemap_entries)
        ? data.sitemap_entries
        : [{ path: "/", changeFrequency: "weekly", priority: 1 }],
    }
  } catch {
    return null
  }
}

/** Site SEO for admin (raw DB format) */
export async function getSiteSeoForAdmin() {
  if (!hasSupabase()) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_seo").select("*").limit(1).maybeSingle()
    return data
  } catch {
    return null
  }
}

/** Chatbot settings for public (no API key exposed) - only enabled + welcome */
export async function getChatbotSettings() {
  if (!hasSupabase()) return { enabled: false, welcomeMessage: "" }
  const supabase = await createClient()
  const { data } = await supabase
    .from("chatbot_settings")
    .select("enabled, welcome_message")
    .limit(1)
    .single()
  if (!data) return { enabled: false, welcomeMessage: "" }
  return {
    enabled: !!data.enabled,
    welcomeMessage: data.welcome_message || "Halo! Ada yang bisa saya bantu?",
  }
}

/** Chatbot settings for admin (includes API key) */
export async function getChatbotSettingsForAdmin() {
  if (!hasSupabase()) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from("chatbot_settings")
    .select("*")
    .limit(1)
    .single()
  return data
}

/** Chatbot FAQ - pertanyaan dan jawaban untuk knowledge base chatbot */
export async function getChatbotFaq(): Promise<{ id: string; question: string; answer: string; sort_order: number }[]> {
  if (!hasSupabase()) {
    try {
      const data = (await import("@/data/chatbot-faq.json")).default
      return (data.faq || []).map((f: { question: string; answer: string }, i: number) => ({
        id: `json-${i}`,
        question: f.question,
        answer: f.answer,
        sort_order: i,
      }))
    } catch {
      return []
    }
  }
  try {
    const supabase = await createClient()
    const { data: items } = await supabase
      .from("chatbot_faq")
      .select("id, question, answer, sort_order")
      .order("sort_order")
    return (items || []).map((r) => ({
      id: r.id,
      question: r.question || "",
      answer: r.answer || "",
      sort_order: r.sort_order ?? 0,
    }))
  } catch {
    return []
  }
}

/** Chatbot keywords - tombol cepat untuk user klik */
export async function getChatbotKeywords(): Promise<{ id: string; label: string; message: string; sort_order: number }[]> {
  if (!hasSupabase()) {
    return [
      { id: "1", label: "Cara mendaftar", message: "Bagaimana cara mendaftar?", sort_order: 0 },
      { id: "2", label: "Jam operasional", message: "Jam operasional sekolah?", sort_order: 1 },
      { id: "3", label: "Program yang ditawarkan", message: "Apa saja program yang ditawarkan?", sort_order: 2 },
      { id: "4", label: "Lokasi sekolah", message: "Di mana lokasi sekolah?", sort_order: 3 },
    ]
  }
  try {
    const supabase = await createClient()
    const { data: items } = await supabase
      .from("chatbot_keywords")
      .select("id, label, message, sort_order")
      .order("sort_order")
    return (items || []).map((r) => ({
      id: r.id,
      label: r.label || "",
      message: r.message || "",
      sort_order: r.sort_order ?? 0,
    }))
  } catch {
    return []
  }
}
