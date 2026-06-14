import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/chat/status?job_id=xxx - Poll status & result chat job
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("job_id")

    if (!jobId) {
      return NextResponse.json({ error: "job_id required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: job, error } = await supabase
      .from("chat_jobs")
      .select("id, status, result_text, error_message")
      .eq("id", jobId)
      .single()

    if (error || !job) {
      return NextResponse.json({ error: "Job tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      job_id: job.id,
      status: job.status,
      text: job.result_text,
      error: job.error_message,
    })
  } catch (err) {
    console.error("Chat status API error:", err)
    return NextResponse.json({ error: "Gagal mengambil status" }, { status: 500 })
  }
}
