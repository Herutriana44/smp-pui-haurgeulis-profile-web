import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/chat/index-faq - Re-index FAQ ke embeddings (RAG)
 * Memerlukan auth admin. Panggil setelah menambah/mengubah FAQ.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const fnUrl = `${supabaseUrl}/functions/v1/index-faq`

    const res = await fetch(fnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: "{}",
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Index failed" }, { status: res.status })
    }
    return NextResponse.json({ ok: true, indexed: data.indexed })
  } catch (err) {
    console.error("index-faq error:", err)
    return NextResponse.json({ error: "Gagal indexing" }, { status: 500 })
  }
}
