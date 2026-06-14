import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * GET /api/admin/chat-usage - Fetch chat usage logs (tokens & prompts)
 * Query: ?limit=50 (default 50)
 * Requires authenticated admin.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10) || 50, 200)

    const admin = createAdminClient()
    const { data: logs, error } = await admin
      .from("chat_usage_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Chat usage fetch error:", error)
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ logs: [], summary: { totalRequests: 0, totalPromptTokens: 0, totalCompletionTokens: 0, totalTokens: 0 } })
      }
      return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 })
    }

    const list = logs || []
    const totals = list.reduce(
      (acc, t) => ({
        prompt: acc.prompt + (t.prompt_tokens || 0),
        completion: acc.completion + (t.completion_tokens || 0),
        total: acc.total + (t.total_tokens || 0),
        count: acc.count + 1,
      }),
      { prompt: 0, completion: 0, total: 0, count: 0 }
    )

    return NextResponse.json({
      logs: list,
      summary: {
        totalRequests: totals.count,
        totalPromptTokens: totals.prompt,
        totalCompletionTokens: totals.completion,
        totalTokens: totals.total,
      },
    })
  } catch (err) {
    console.error("Chat usage API error:", err)
    return NextResponse.json({ error: "Gagal memproses" }, { status: 500 })
  }
}
