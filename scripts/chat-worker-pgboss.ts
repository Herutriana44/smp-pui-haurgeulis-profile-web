/**
 * pg-boss Chat Worker: Queue dengan retry otomatis
 * Jalankan: npx tsx scripts/chat-worker-pgboss.ts
 * Memerlukan: DATABASE_URL (Supabase Postgres), NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * API harus mengirim job ke pg-boss - gunakan endpoint yang memakai pg-boss.
 */

import "dotenv/config"
import { config } from "dotenv"
config({ path: ".env.local" })

import PgBoss from "pg-boss"

const QUEUE = "chat-process"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("DATABASE_URL required. Supabase: Settings > Database > Connection string (URI)")
  process.exit(1)
}

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required")
  process.exit(1)
}

const boss = new PgBoss({ connectionString: DATABASE_URL, max: 2 })
boss.on("error", (err) => console.error("pg-boss error:", err))

async function processJob(job: PgBoss.Job<{ job_id: string }>) {
  const { job_id } = job.data
  const res = await fetch(`${SUPABASE_URL}/functions/v1/process-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ job_id }),
  })
  if (!res.ok) throw new Error(`Edge Function: ${res.status}`)
  console.log(`[OK] Job ${job_id}`)
}

async function main() {
  await boss.start()
  await boss.work(QUEUE, { retryLimit: 3, retryDelay: 60 }, processJob)
  console.log(`pg-boss worker listening: ${QUEUE}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
