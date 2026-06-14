import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

const BUCKET = "assets"

/**
 * POST /api/upload - Upload file ke Supabase Storage
 * Memerlukan auth. Mendukung progress via XHR dari client.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const path = formData.get("path") as string | null

    if (!file || !path || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "File atau path tidak valid" }, { status: 400 })
    }

    const admin = createAdminClient()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = file.type || "image/jpeg"

    const { data, error } = await admin.storage
      .from(BUCKET)
      .upload(path, buffer, { upsert: true, contentType })

    if (error) {
      return NextResponse.json({ error: error.message || "Gagal mengunggah ke storage" }, { status: 500 })
    }

    const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(data.path)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error("upload error:", err)
    return NextResponse.json({ error: "Gagal mengunggah" }, { status: 500 })
  }
}
