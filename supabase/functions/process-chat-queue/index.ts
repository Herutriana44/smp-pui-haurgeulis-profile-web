// Edge Function: Process satu pending chat job dari queue
// Dipanggil oleh pg_cron untuk memastikan job tidak tertinggal

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } })
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data: pending } = await supabase
      .from("chat_jobs")
      .select("id")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1)
      .single()

    if (!pending?.id) {
      return new Response(JSON.stringify({ processed: false }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    const fnUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/process-chat`
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    const res = await fetch(fnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ job_id: pending.id }),
    })

    return new Response(
      JSON.stringify({ processed: true, job_id: pending.id, status: res.status }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("process-chat-queue error:", err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
