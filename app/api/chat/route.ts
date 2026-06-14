import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { processChatJob } from "@/lib/process-chat"

/**
 * POST /api/chat - Enqueue chat job, invoke Edge Function (atau pg-boss), return job_id
 * Client polls GET /api/chat/status?job_id=xxx untuk hasil
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history = [] } = body as { message: string; history?: { role: string; content: string }[] }

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak valid" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: settings } = await supabase
      .from("chatbot_settings")
      .select("enabled")
      .limit(1)
      .single()

    if (!settings?.enabled) {
      return NextResponse.json(
        { error: "Chatbot belum diaktifkan. Silakan admin mengatur di panel admin." },
        { status: 503 }
      )
    }

    const { data: job, error: insertErr } = await supabase
      .from("chat_jobs")
      .insert({
        message: message.trim(),
        history: history || [],
        status: "pending",
      })
      .select("id")
      .single()

    if (insertErr || !job?.id) {
      console.error("Chat job insert error:", insertErr)
      return NextResponse.json({ error: "Gagal membuat job" }, { status: 500 })
    }

    try {
      await processChatJob(job.id)
    } catch (e) {
      console.error("Process chat error:", e)
      try {
        const admin = createAdminClient()
        await admin
        .from("chat_jobs")
        .update({
          status: "failed",
          error_message: e instanceof Error ? e.message : "Processing error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id)
      } catch (_) {}
    }

    return NextResponse.json({ job_id: job.id })
  } catch (err) {
    console.error("Chat API error:", err)
    return NextResponse.json({ error: "Gagal memproses pesan" }, { status: 500 })
  }
}
