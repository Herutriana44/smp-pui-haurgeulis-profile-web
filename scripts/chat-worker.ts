/**
 * Chat Worker: Process pending chat jobs (backup jika Edge Function invoke gagal)
 * Mengamankan work task chatbot - job diproses async dengan retry
 *
 * Jalankan: npx tsx scripts/chat-worker.ts
 * Memerlukan: .env.local dengan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Opsional: Jalankan bersamaan dengan pg-boss untuk queue dengan retry
 *   npx tsx scripts/chat-worker-pgboss.ts
 */

import "dotenv/config"
import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const POLL_INTERVAL_MS = 10_000
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env.local")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const fnUrl = `${SUPABASE_URL}/functions/v1/process-chat`

async function processPending() {
  const { data: pending } = await supabase
    .from("chat_jobs")
    .select("id")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(5)

  for (const job of pending || []) {
    try {
      const res = await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({ job_id: job.id }),
      })
      if (res.ok) {
        console.log(`[OK] Processed job ${job.id}`)
      } else {
        console.warn(`[WARN] Job ${job.id} failed: ${res.status}`)
      }
    } catch (e) {
      console.error(`[ERR] Job ${job.id}:`, e)
    }
  }
}

async function main() {
  console.log("Chat worker started. Polling every", POLL_INTERVAL_MS / 1000, "seconds...")
  while (true) {
    await processPending()
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
