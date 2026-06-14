-- pg_cron (opsional): Re-index FAQ embeddings & process queue
-- Supabase Pro/Team: pg_cron & pg_net tersedia
-- Untuk Free tier: gunakan API /api/chat/index-faq atau Vercel Cron

-- Uncomment jika pg_cron tersedia:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- CREATE EXTENSION IF NOT EXISTS pg_net;
-- SELECT cron.schedule('index-faq-daily', '0 2 * * *', $$ ... $$);
