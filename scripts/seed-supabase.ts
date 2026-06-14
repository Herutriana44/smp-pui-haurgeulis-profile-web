/**
 * Seeder: Migrate JSON data + images to Supabase
 * Run: npx tsx scripts/seed-supabase.ts
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { config as loadDotenv } from "dotenv"
import { createClient } from "@supabase/supabase-js"
import type { PostgrestError } from "@supabase/supabase-js"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

function throwIfError(label: string, error: PostgrestError | null): void {
  if (error) {
    let msg = `${label}: ${error.message} (${error.code ?? "no code"})`
    if (
      error.code === "42501" ||
      (typeof error.message === "string" &&
        (error.message.includes("permission denied for schema public") ||
          error.message.includes("permission denied for table")))
    ) {
      msg +=
        "\n\n→ Solusi: (1) Jalankan SQL migrasi `019_restore_public_api_grants.sql` di Dashboard > SQL Editor (memulihkan grant tabel + sequence).\n" +
        "   (2) Jika belum: jalankan juga `018_grant_public_schema_usage.sql`.\n" +
        "   (3) Pastikan `SUPABASE_SERVICE_ROLE_KEY` adalah secret **service_role**, bukan anon key."
    }
    throw new Error(msg)
  }
}

/** Parse .env.local baris KEY=value (spasi di sekitar = diperbolehkan; nilai JWT aman) */
function loadEnvLocalManually(): void {
  const envPath = join(process.cwd(), ".env.local")
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, "utf-8")
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key) process.env[key] = value
  }
}

// dotenv + parser manual (parser manual dijalankan terakhir agar menang atas baris sulit)
loadDotenv({ path: join(process.cwd(), ".env.local") })
loadEnvLocalManually()

/** Decode claim `role` dari JWT Supabase (anon / authenticated / service_role) */
function jwtRole(jwt: string): string | null {
  try {
    const parts = jwt.trim().split(".")
    if (parts.length !== 3) return null
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const pad = b64.length % 4
    if (pad) b64 += "=".repeat(4 - pad)
    const payload = JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as { role?: string }
    return payload.role ?? null
  } catch {
    return null
  }
}

const dataDir = join(process.cwd(), "data")
const publicDir = join(process.cwd(), "public")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Buat file .env.local di root project dengan dua baris (tanpa spasi sebelum nama variabel):\n" +
      "  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=eyJ... (dari Dashboard > Settings > API > service_role, BUKAN anon)"
  )
  process.exit(1)
}

const roleClaim = jwtRole(serviceRoleKey)
if (roleClaim && roleClaim !== "service_role") {
  console.error(
    `SUPABASE_SERVICE_ROLE_KEY punya JWT role "${roleClaim}", bukan "service_role".\n` +
      "Salin secret **service_role** (panjang, dimulai eyJ...) dari Supabase Dashboard > Settings > API.\n" +
      "Jangan pakai **anon** / **publishable** key untuk seed."
  )
  process.exit(1)
}
if (!roleClaim) {
  console.warn(
    "Tidak bisa memverifikasi JWT: pastikan SUPABASE_SERVICE_ROLE_KEY adalah JWT lengkap service_role dari Dashboard."
  )
}

console.log("Env: URL OK, JWT role =", roleClaim ?? "(tidak ter-parse), jalankan seed…")

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const BUCKET = "assets"
const imageMap = new Map<string, string>()
let uploadCounter = 0

function getContentType(pathOrUrl: string): string {
  const ext = (pathOrUrl.split(".").pop() || "").toLowerCase()
  const mime: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  }
  return mime[ext] || "image/jpeg"
}

function getLocalPath(urlOrPath: string): string {
  if (!urlOrPath || urlOrPath.startsWith("http")) return ""
  const path = urlOrPath.startsWith("/") ? urlOrPath.slice(1) : urlOrPath
  return join(publicDir, path)
}

async function ensureBucketExists(): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === BUCKET)
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) console.warn("Could not create bucket (may already exist):", error.message)
  }
}

async function uploadImage(pathOrUrl: string, storagePath: string): Promise<string> {
  if (!pathOrUrl || pathOrUrl.startsWith("http")) return pathOrUrl
  const cached = imageMap.get(pathOrUrl)
  if (cached) return cached

  const localPath = getLocalPath(pathOrUrl)
  if (!existsSync(localPath)) {
    console.warn(`  [SKIP] File not found: ${localPath}`)
    return pathOrUrl
  }

  const contentType = getContentType(pathOrUrl)
  uploadCounter += 1
  const uniquePath = `${storagePath.replace(/\.[a-z]+$/i, "")}-${uploadCounter}${pathOrUrl.match(/\.[a-z]+$/i)?.[0] || ".jpg"}`

  try {
    const buffer = readFileSync(localPath)
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(uniquePath, buffer, { upsert: true, contentType })

    if (error) {
      console.warn(`  [UPLOAD ERROR] ${pathOrUrl}:`, error.message)
      return pathOrUrl
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    const url = urlData.publicUrl
    imageMap.set(pathOrUrl, url)
    console.log(`  [UPLOADED] ${pathOrUrl} -> ${url}`)
    return url
  } catch (e) {
    console.warn(`  [ERROR] ${pathOrUrl}:`, e)
    return pathOrUrl
  }
}

function extractImagePaths(obj: unknown): string[] {
  const paths: string[] = []
  if (!obj) return paths

  const visit = (o: unknown) => {
    if (typeof o === "string") {
      if (o.startsWith("/images/") || o.match(/\.(jpe?g|png|gif|webp|svg)$/i)) {
        paths.push(o)
      }
    } else if (Array.isArray(o)) {
      o.forEach(visit)
    } else if (typeof o === "object" && o !== null) {
      for (const v of Object.values(o)) visit(v)
    }
  }
  visit(obj)
  return [...new Set(paths)]
}

async function resolveImages<T>(obj: T, section: string): Promise<T> {
  const paths = extractImagePaths(obj)
  const resolved: Record<string, string> = {}
  for (const p of paths) {
    const filename = p.split("/").pop() || "image.jpg"
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\s+/g, "_")
    const storagePath = `images/${section}/${safeName}`
    resolved[p] = await uploadImage(p, storagePath)
  }

  const replacer = (o: unknown): unknown => {
    if (typeof o === "string") {
      return resolved[o] ?? o
    }
    if (Array.isArray(o)) return o.map(replacer)
    if (typeof o === "object" && o !== null) {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(o)) {
        out[k] = replacer(v)
      }
      return out
    }
    return o
  }
  return replacer(obj) as T
}

async function seed() {
  console.log("Starting seed...")
  console.log(
    "Pastikan migrasi 017_rls_service_role_tables.sql sudah dijalankan agar RLS mengizinkan penulisan dengan SUPABASE_SERVICE_ROLE_KEY (bukan anon key)."
  )
  await ensureBucketExists()

  // Hero
  const heroJson = JSON.parse(readFileSync(join(dataDir, "hero.json"), "utf-8"))
  const heroResolved = await resolveImages(heroJson, "hero")
  const { data: existingHero, error: heroSelErr } = await supabase.from("hero").select("id").limit(1).maybeSingle()
  throwIfError("hero select", heroSelErr)
  let heroId = existingHero?.id

  if (heroId) {
    const { error: heroUpdErr } = await supabase.from("hero").update({
      brosur_image_url: heroResolved.brosurImage || null,
      title: heroResolved.title || "",
      subtitle: heroResolved.subtitle || "",
      description: heroResolved.description || "",
      cta_primary: heroResolved.cta_primary || "",
      cta_secondary: heroResolved.cta_secondary || "",
      image_url: heroResolved.image || null,
    }).eq("id", heroId)
    throwIfError("hero update", heroUpdErr)
  } else {
    const { data: inserted, error: heroInsErr } = await supabase.from("hero").insert({
      brosur_image_url: heroResolved.brosurImage || null,
      title: heroResolved.title || "",
      subtitle: heroResolved.subtitle || "",
      description: heroResolved.description || "",
      cta_primary: heroResolved.cta_primary || "",
      cta_secondary: heroResolved.cta_secondary || "",
      image_url: heroResolved.image || null,
    }).select("id").single()
    throwIfError("hero insert", heroInsErr)
    heroId = inserted?.id
  }
  if (heroId) {
    const { error: delStatsErr } = await supabase.from("hero_stats").delete().eq("hero_id", heroId)
    throwIfError("hero_stats delete", delStatsErr)
    for (let i = 0; i < (heroResolved.stats || []).length; i++) {
      const s = heroResolved.stats[i]
      const { error: stErr } = await supabase
        .from("hero_stats")
        .insert({ hero_id: heroId, value: s.value, label: s.label, sort_order: i })
      throwIfError(`hero_stats insert[${i}]`, stErr)
    }
  }
  console.log("Hero seeded")

  // About
  const aboutJson = JSON.parse(readFileSync(join(dataDir, "about.json"), "utf-8"))
  const aboutResolved = await resolveImages(aboutJson, "about")
  const { data: existingAbout, error: aboutSelErr } = await supabase.from("about").select("id").limit(1).maybeSingle()
  throwIfError("about select", aboutSelErr)
  if (existingAbout) {
    const { error: aboutUpdErr } = await supabase.from("about").update({
      title: aboutResolved.title || "",
      subtitle: aboutResolved.subtitle || "",
      description: aboutResolved.description || "",
      image_url: aboutResolved.image || null,
      paragraphs: aboutResolved.paragraphs || [],
      highlights: aboutResolved.highlights || [],
    }).eq("id", existingAbout.id)
    throwIfError("about update", aboutUpdErr)
  } else {
    const { error: aboutInsErr } = await supabase.from("about").insert({
      title: aboutResolved.title || "",
      subtitle: aboutResolved.subtitle || "",
      description: aboutResolved.description || "",
      image_url: aboutResolved.image || null,
      paragraphs: aboutResolved.paragraphs || [],
      highlights: aboutResolved.highlights || [],
    })
    throwIfError("about insert", aboutInsErr)
  }
  console.log("About seeded")

  // Visi Misi
  const visiJson = JSON.parse(readFileSync(join(dataDir, "visi-misi.json"), "utf-8"))
  const visiResolved = await resolveImages(visiJson, "visi-misi")
  const { data: existingVisi, error: visiSelErr } = await supabase.from("visi_misi").select("id").limit(1).maybeSingle()
  throwIfError("visi_misi select", visiSelErr)
  let visiId = existingVisi?.id

  if (visiId) {
    const { error: visiUpdErr } = await supabase.from("visi_misi").update({
      title: visiResolved.title || "",
      icon_image_url: visiResolved.iconImage || null,
      subtitle: visiResolved.subtitle || "",
      visi_title: visiResolved.visi?.title || "",
      visi_content: visiResolved.visi?.content || "",
      misi_title: visiResolved.misi?.title || "",
      misi_items: visiResolved.misi?.items || [],
    }).eq("id", visiId)
    throwIfError("visi_misi update", visiUpdErr)
  } else {
    const { data: inserted, error: visiInsErr } = await supabase.from("visi_misi").insert({
      title: visiResolved.title || "",
      icon_image_url: visiResolved.iconImage || null,
      subtitle: visiResolved.subtitle || "",
      visi_title: visiResolved.visi?.title || "",
      visi_content: visiResolved.visi?.content || "",
      misi_title: visiResolved.misi?.title || "",
      misi_items: visiResolved.misi?.items || [],
    }).select("id").single()
    throwIfError("visi_misi insert", visiInsErr)
    visiId = inserted?.id
  }
  if (visiId) {
    const { error: vmDelErr } = await supabase.from("visi_misi_values").delete().eq("visi_misi_id", visiId)
    throwIfError("visi_misi_values delete", vmDelErr)
    for (let i = 0; i < (visiResolved.values || []).length; i++) {
      const v = visiResolved.values[i]
      const { error: vmInsErr } = await supabase.from("visi_misi_values").insert({
        visi_misi_id: visiId,
        title: v.title || "",
        description: v.description || "",
        icon_image_url: v.iconImage || null,
        sort_order: i,
      })
      throwIfError(`visi_misi_values insert[${i}]`, vmInsErr)
    }
  }
  console.log("Visi Misi seeded")

  // Programs
  const progJson = JSON.parse(readFileSync(join(dataDir, "programs.json"), "utf-8"))
  const progResolved = await resolveImages(progJson, "programs")
  const { data: existingProg, error: progSelErr } = await supabase.from("programs").select("id").limit(1).maybeSingle()
  throwIfError("programs select", progSelErr)
  let progId = existingProg?.id

  if (progId) {
    const { error: progUpdErr } = await supabase.from("programs").update({
      title: progResolved.title || "",
      subtitle: progResolved.subtitle || "",
      program_unggulan: progResolved.program_unggulan || "",
    }).eq("id", progId)
    throwIfError("programs update", progUpdErr)
  } else {
    const { data: inserted, error: progInsErr } = await supabase.from("programs").insert({
      title: progResolved.title || "",
      subtitle: progResolved.subtitle || "",
      program_unggulan: progResolved.program_unggulan || "",
    }).select("id").single()
    throwIfError("programs insert", progInsErr)
    progId = inserted?.id
  }
  if (progId) {
    const { error: piDelErr } = await supabase.from("program_items").delete().eq("programs_id", progId)
    throwIfError("program_items delete", piDelErr)
    for (let i = 0; i < (progResolved.programs || []).length; i++) {
      const p = progResolved.programs[i]
      const { error: piInsErr } = await supabase.from("program_items").insert({
        programs_id: progId,
        title: p.title || "",
        description: p.description || "",
        icon_image_url: p.iconImage || null,
        features: p.features || [],
        sort_order: i,
      })
      throwIfError(`program_items insert[${i}]`, piInsErr)
    }
  }
  console.log("Programs seeded")

  // Extracurriculars (butuh tabel dari migrasi 014 + policy 017)
  try {
    const extraJson = JSON.parse(readFileSync(join(dataDir, "extracurriculars.json"), "utf-8"))
    const extraResolved = await resolveImages(extraJson, "extracurriculars")
    const { data: existingExtra, error: exSelErr } = await supabase
      .from("extracurriculars")
      .select("id")
      .limit(1)
      .maybeSingle()
    throwIfError("extracurriculars select", exSelErr)
    let extraId = existingExtra?.id

    if (extraId) {
      const { error: exUpdErr } = await supabase
        .from("extracurriculars")
        .update({
          title: extraResolved.title || "",
          subtitle: extraResolved.subtitle || "",
          lead: extraResolved.lead || "",
        })
        .eq("id", extraId)
      throwIfError("extracurriculars update", exUpdErr)
    } else {
      const { data: inserted, error: exInsErr } = await supabase
        .from("extracurriculars")
        .insert({
          title: extraResolved.title || "",
          subtitle: extraResolved.subtitle || "",
          lead: extraResolved.lead || "",
        })
        .select("id")
        .single()
      throwIfError("extracurriculars insert", exInsErr)
      extraId = inserted?.id
    }
    if (extraId) {
      const { error: exItemDelErr } = await supabase
        .from("extracurricular_items")
        .delete()
        .eq("extracurriculars_id", extraId)
      throwIfError("extracurricular_items delete", exItemDelErr)
      const items = extraResolved.items || []
      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        const { error: exItemInsErr } = await supabase.from("extracurricular_items").insert({
          extracurriculars_id: extraId,
          title: it.title || "",
          description: it.description || "",
          detail: it.detail || "",
          icon_image_url: it.iconImage || null,
          features: it.features || [],
          sort_order: i,
        })
        throwIfError(`extracurricular_items insert[${i}]`, exItemInsErr)
      }
    }
    console.log("Extracurriculars seeded")
  } catch (e) {
    console.warn("Extracurriculars seed skipped:", (e as Error).message)
  }

  // Contact
  const contactJson = JSON.parse(readFileSync(join(dataDir, "contact.json"), "utf-8"))
  const { data: existingContact, error: ctSelErr } = await supabase.from("contact").select("id").limit(1).maybeSingle()
  throwIfError("contact select", ctSelErr)
  if (existingContact) {
    const { error: ctUpdErr } = await supabase.from("contact").update({
      title: contactJson.title || "",
      subtitle: contactJson.subtitle || "",
      description: contactJson.description || "",
      address: contactJson.address || "",
      phone: contactJson.phone || "",
      whatsapp: contactJson.whatsapp || "",
      email: contactJson.email || "",
      hours: contactJson.hours || "",
      social: contactJson.social || {},
      map_embed: contactJson.map_embed || "",
    }).eq("id", existingContact.id)
    throwIfError("contact update", ctUpdErr)
  } else {
    const { error: ctInsErr } = await supabase.from("contact").insert({
      title: contactJson.title || "",
      subtitle: contactJson.subtitle || "",
      description: contactJson.description || "",
      address: contactJson.address || "",
      phone: contactJson.phone || "",
      whatsapp: contactJson.whatsapp || "",
      email: contactJson.email || "",
      hours: contactJson.hours || "",
      social: contactJson.social || {},
      map_embed: contactJson.map_embed || "",
    })
    throwIfError("contact insert", ctInsErr)
  }
  console.log("Contact seeded")

  // Navbar
  const navbarJson = JSON.parse(readFileSync(join(dataDir, "navbar.json"), "utf-8"))
  const navbarResolved = await resolveImages(navbarJson, "navbar")
  const { data: existingNavbar, error: nbSelErr } = await supabase.from("navbar").select("id").limit(1).maybeSingle()
  throwIfError("navbar select", nbSelErr)
  if (existingNavbar) {
    const { error: nbUpdErr } = await supabase.from("navbar").update({
      brand: navbarResolved.brand || "",
      brand_image_url: navbarResolved.brandImage || null,
      brand_image_alt: navbarResolved.brandImageAlt || "",
      links: navbarResolved.links || [],
      cta: navbarResolved.cta || {},
    }).eq("id", existingNavbar.id)
    throwIfError("navbar update", nbUpdErr)
  } else {
    const { error: nbInsErr } = await supabase.from("navbar").insert({
      brand: navbarResolved.brand || "",
      brand_image_url: navbarResolved.brandImage || null,
      brand_image_alt: navbarResolved.brandImageAlt || "",
      links: navbarResolved.links || [],
      cta: navbarResolved.cta || {},
    })
    throwIfError("navbar insert", nbInsErr)
  }
  console.log("Navbar seeded")

  // Footer
  const footerJson = JSON.parse(readFileSync(join(dataDir, "footer.json"), "utf-8"))
  const { data: existingFooter, error: ftSelErr } = await supabase.from("footer").select("id").limit(1).maybeSingle()
  throwIfError("footer select", ftSelErr)
  if (existingFooter) {
    const { error: ftUpdErr } = await supabase.from("footer").update({
      brand: footerJson.brand || "",
      description: footerJson.description || "",
      quick_links: footerJson.quick_links || [],
      programs: footerJson.programs || [],
      copyright: footerJson.copyright || "",
    }).eq("id", existingFooter.id)
    throwIfError("footer update", ftUpdErr)
  } else {
    const { error: ftInsErr } = await supabase.from("footer").insert({
      brand: footerJson.brand || "",
      description: footerJson.description || "",
      quick_links: footerJson.quick_links || [],
      programs: footerJson.programs || [],
      copyright: footerJson.copyright || "",
    })
    throwIfError("footer insert", ftInsErr)
  }
  console.log("Footer seeded")

  // Facilities
  const facJson = JSON.parse(readFileSync(join(dataDir, "facilities.json"), "utf-8"))
  const facResolved = await resolveImages(facJson, "facilities")
  const { error: facDelErr } = await supabase.from("facilities").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  throwIfError("facilities delete", facDelErr)
  for (let i = 0; i < (facResolved.facilities || []).length; i++) {
    const f = facResolved.facilities[i]
    const { error: facInsErr } = await supabase.from("facilities").insert({
      title: f.title || "",
      description: f.description || "",
      image_url: f.image || null,
      sort_order: i,
    })
    throwIfError(`facilities insert[${i}]`, facInsErr)
  }
  console.log("Facilities seeded")

  // Teachers
  const teachersJson = JSON.parse(readFileSync(join(dataDir, "teachers.json"), "utf-8"))
  const teachersResolved = await resolveImages(teachersJson, "teachers")
  const { error: tchDelErr } = await supabase.from("teachers").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  throwIfError("teachers delete", tchDelErr)
  for (let i = 0; i < (teachersResolved.teachers || []).length; i++) {
    const t = teachersResolved.teachers[i]
    const { error: tchInsErr } = await supabase.from("teachers").insert({
      name: t.name || "",
      role: t.role || "",
      description: t.description || "",
      image_url: t.image || null,
      sort_order: i,
    })
    throwIfError(`teachers insert[${i}]`, tchInsErr)
  }
  console.log("Teachers seeded")

  // Gallery
  const galleryJson = JSON.parse(readFileSync(join(dataDir, "gallery.json"), "utf-8"))
  const galleryResolved = await resolveImages(galleryJson, "gallery")
  const { error: galDelErr } = await supabase.from("gallery_images").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  throwIfError("gallery_images delete", galDelErr)
  for (let i = 0; i < (galleryResolved.images || []).length; i++) {
    const g = galleryResolved.images[i]
    const { error: galInsErr } = await supabase.from("gallery_images").insert({
      src_url: g.src || "",
      alt: g.alt || "",
      caption: g.caption || "",
      sort_order: i,
    })
    throwIfError(`gallery_images insert[${i}]`, galInsErr)
  }
  console.log("Gallery seeded")

  // Testimonials
  const testJson = JSON.parse(readFileSync(join(dataDir, "testimonials.json"), "utf-8"))
  const { error: tstDelErr } = await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  throwIfError("testimonials delete", tstDelErr)
  for (let i = 0; i < (testJson.testimonials || []).length; i++) {
    const t = testJson.testimonials[i]
    const { error: tstInsErr } = await supabase.from("testimonials").insert({
      name: t.name || "",
      role: t.role || "",
      content: t.content || "",
      rating: t.rating ?? 5,
      sort_order: i,
    })
    throwIfError(`testimonials insert[${i}]`, tstInsErr)
  }
  console.log("Testimonials seeded")

  // Instagram
  const igJson = JSON.parse(readFileSync(join(dataDir, "instagram-post.json"), "utf-8"))
  const { error: igDelErr } = await supabase.from("instagram_posts").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  throwIfError("instagram_posts delete", igDelErr)
  for (let i = 0; i < (igJson.post || []).length; i++) {
    const { error: igInsErr } = await supabase.from("instagram_posts").insert({
      embed_html: igJson.post[i] || "",
      sort_order: i,
    })
    throwIfError(`instagram_posts insert[${i}]`, igInsErr)
  }
  console.log("Instagram seeded")

  // Chatbot settings (ensure row exists)
  const { data: chatbotRow, error: cbSelErr } = await supabase.from("chatbot_settings").select("id").limit(1).maybeSingle()
  throwIfError("chatbot_settings select", cbSelErr)
  if (!chatbotRow) {
    const { error: cbInsErr } = await supabase.from("chatbot_settings").insert({
      gemini_api_key: "",
      enabled: true,
      welcome_message: "Halo! Ada yang bisa saya bantu tentang sekolah kami?",
      model: "gemini-2.0-flash",
    })
    throwIfError("chatbot_settings insert", cbInsErr)
    console.log("Chatbot settings seeded")
  }

  // Chatbot keywords (seed default if empty)
  try {
    const { data: existingKw, error: kwSelErr } = await supabase.from("chatbot_keywords").select("id").limit(1)
    throwIfError("chatbot_keywords select", kwSelErr)
    if (!existingKw?.length) {
      const { error: kwInsErr } = await supabase.from("chatbot_keywords").insert([
        { label: "Cara mendaftar", message: "Bagaimana cara mendaftar?", sort_order: 0 },
        { label: "Jam operasional", message: "Jam operasional sekolah?", sort_order: 1 },
        { label: "Program yang ditawarkan", message: "Apa saja program yang ditawarkan?", sort_order: 2 },
        { label: "Lokasi sekolah", message: "Di mana lokasi sekolah?", sort_order: 3 },
      ])
      throwIfError("chatbot_keywords insert", kwInsErr)
      console.log("Chatbot keywords seeded")
    }
  } catch (e) {
    console.warn("Chatbot keywords seed skipped:", (e as Error).message)
  }

  // Chatbot FAQ (seed from JSON if table exists and empty)
  try {
    const { data: existingFaq, error: faqSelErr } = await supabase.from("chatbot_faq").select("id").limit(1)
    throwIfError("chatbot_faq select", faqSelErr)
    if (!existingFaq?.length) {
      const faqJson = JSON.parse(readFileSync(join(dataDir, "chatbot-faq.json"), "utf-8"))
      for (let i = 0; i < (faqJson.faq || []).length; i++) {
        const f = faqJson.faq[i]
        const { error: faqInsErr } = await supabase.from("chatbot_faq").insert({
          question: f.question || "",
          answer: f.answer || "",
          sort_order: i,
        })
        throwIfError(`chatbot_faq insert[${i}]`, faqInsErr)
      }
      console.log("Chatbot FAQ seeded")
    }
  } catch (e) {
    console.warn("Chatbot FAQ seed skipped (table may not exist):", (e as Error).message)
  }

  console.log("Seed complete!")
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
