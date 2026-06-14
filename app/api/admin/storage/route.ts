import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

const BUCKET = "assets"

type FileObject = {
  name: string
  id: string | null
  updated_at?: string
  created_at?: string
  metadata?: { size?: number; mimetype?: string; eTag?: string }
  size?: number
}

async function listAllFiles(
  admin: ReturnType<typeof createAdminClient>,
  prefix: string
): Promise<{ path: string; size: number; mimetype?: string; updated_at?: string }[]> {
  const files: { path: string; size: number; mimetype?: string; updated_at?: string }[] = []
  const { data, error } = await admin.storage.from(BUCKET).list(prefix, { limit: 1000 })

  if (error) throw error
  if (!data?.length) return files

  for (const item of data as FileObject[]) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name
    // Folders have id === null
    if (item.id === null) {
      const nested = await listAllFiles(admin, fullPath)
      files.push(...nested)
    } else {
      const size = item.metadata?.size ?? item.size ?? 0
      files.push({
        path: fullPath,
        size,
        mimetype: item.metadata?.mimetype,
        updated_at: item.updated_at,
      })
    }
  }
  return files
}

/**
 * GET /api/admin/storage - List all files in assets bucket + storage stats
 * Requires authenticated admin.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()
    const allFiles = await listAllFiles(admin, "")

    const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0)
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    const imageFiles = allFiles.filter((f) =>
      imageExtensions.some((ext) => f.path.toLowerCase().endsWith(ext))
    )

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const publicBase = supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/${BUCKET}`
      : ""

    const filesWithUrl = allFiles.map((f) => ({
      ...f,
      publicUrl: publicBase ? `${publicBase}/${f.path}` : "",
    }))

    return NextResponse.json({
      totalFiles: allFiles.length,
      totalSizeBytes: totalSize,
      totalSizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
      imageFiles: imageFiles.length,
      files: filesWithUrl,
    })
  } catch (err) {
    console.error("Storage list error:", err)
    return NextResponse.json({ error: "Gagal mengambil data storage" }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/storage - Hapus file dari bucket assets
 * Body: { path: string }
 * Requires authenticated admin.
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const path = typeof body?.path === "string" ? body.path.trim() : ""

    if (!path) {
      return NextResponse.json({ error: "Path wajib diisi" }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin.storage.from(BUCKET).remove([path])

    if (error) {
      console.error("Storage delete error:", error)
      return NextResponse.json({ error: error.message || "Gagal menghapus file" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Storage delete error:", err)
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 })
  }
}
