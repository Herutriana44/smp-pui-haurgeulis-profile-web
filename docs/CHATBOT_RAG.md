# Chatbot RAG + LLM

Chatbot berbasis **RAG (Retrieval-Augmented Generation)** + **LLM (opsional)** dengan:

- **pgvector** – Embedding disimpan di Supabase
- **Edge Functions** – Proses chat & index FAQ
- **Job queue** – `chat_jobs` table + worker opsional
- **LLM fallback** – Jika API key error, pakai RAG-only

## Setup

### 1. Migration

```bash
npx supabase db push
```

Atau jalankan SQL di Supabase SQL Editor: `007_chatbot_rag.sql`, `008_cron.sql` (opsional).

### 2. Deploy Edge Functions

```bash
supabase functions deploy process-chat
supabase functions deploy index-faq
supabase functions deploy process-chat-queue
```

### 3. Set API Key

Di Admin Panel → Chatbot → masukkan Gemini API Key.

### 4. Index FAQ (RAG)

Setelah menambah/mengubah FAQ, klik **"Re-index (RAG)"** di Admin → Chatbot → FAQ.

Atau panggil API:

```bash
curl -X POST https://your-site.com/api/chat/index-faq
```

## Alur Kerja

1. User kirim pesan → API buat `chat_jobs` → invoke Edge Function `process-chat`
2. Edge Function: embed query → cari di pgvector → (jika LLM diaktifkan) panggil LLM → update `chat_jobs`
3. Client polling `GET /api/chat/status?job_id=xxx` sampai `completed`

**Toggle "Aktifkan LLM (Gemini)"** di Admin → Chatbot:
- **Aktif**: RAG + LLM (jawaban diperkaya AI)
- **Nonaktif**: RAG only (jawaban dari FAQ saja)

## Worker (Opsional)

### Polling worker (tanpa pg-boss)

```bash
npm run chat-worker
```

Memproses job `pending` yang tertinggal setiap 10 detik.

### pg-boss worker (dengan retry)

1. Set `DATABASE_URL` di `.env.local` (Supabase → Settings → Database → Connection string)
2. Jalankan:

```bash
npm run chat-worker:pgboss
```

## Cron (Opsional)

Untuk re-index FAQ otomatis (mis. harian), gunakan:

- Vercel Cron: `vercel.json` dengan `crons`
- Supabase pg_cron (Pro): edit `008_cron.sql`
- Layanan eksternal (cron-job.org, dll.) → `POST /api/chat/index-faq`
