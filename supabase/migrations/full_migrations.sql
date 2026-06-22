-- Initial schema for school profile website
-- Run this in Supabase SQL Editor

-- Hero section
CREATE TABLE hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brosur_image_url TEXT,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  cta_primary TEXT DEFAULT '',
  cta_secondary TEXT DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE hero_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_id UUID REFERENCES hero(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- About section
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT,
  paragraphs JSONB DEFAULT '[]',
  highlights JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Visi Misi section
CREATE TABLE visi_misi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  icon_image_url TEXT,
  subtitle TEXT DEFAULT '',
  visi_title TEXT DEFAULT '',
  visi_content TEXT DEFAULT '',
  misi_title TEXT DEFAULT '',
  misi_items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE visi_misi_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visi_misi_id UUID REFERENCES visi_misi(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon_image_url TEXT,
  sort_order INT DEFAULT 0
);

-- Programs section
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  program_unggulan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE program_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programs_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon_image_url TEXT,
  features JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0
);

-- Contact section
CREATE TABLE contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  hours TEXT DEFAULT '',
  social JSONB DEFAULT '{}',
  map_embed TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Navbar
CREATE TABLE navbar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL DEFAULT '',
  brand_image_url TEXT,
  brand_image_alt TEXT DEFAULT '',
  links JSONB DEFAULT '[]',
  cta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Footer
CREATE TABLE footer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  quick_links JSONB DEFAULT '[]',
  programs JSONB DEFAULT '[]',
  copyright TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Facilities (multi-record)
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Teachers (multi-record)
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery images (multi-record)
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src_url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials (multi-record)
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  content TEXT DEFAULT '',
  rating INT DEFAULT 5,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Instagram posts (multi-record)
CREATE TABLE instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  embed_html TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Section metadata for single-record tables (hero, about, etc.)
-- We use a convention: first row is the "active" config

-- Enable RLS on all tables
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE visi_misi ENABLE ROW LEVEL SECURITY;
ALTER TABLE visi_misi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE navbar ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Public read for all tables
CREATE POLICY "Public read hero" ON hero FOR SELECT USING (true);
CREATE POLICY "Public read hero_stats" ON hero_stats FOR SELECT USING (true);
CREATE POLICY "Public read about" ON about FOR SELECT USING (true);
CREATE POLICY "Public read visi_misi" ON visi_misi FOR SELECT USING (true);
CREATE POLICY "Public read visi_misi_values" ON visi_misi_values FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read program_items" ON program_items FOR SELECT USING (true);
CREATE POLICY "Public read contact" ON contact FOR SELECT USING (true);
CREATE POLICY "Public read navbar" ON navbar FOR SELECT USING (true);
CREATE POLICY "Public read footer" ON footer FOR SELECT USING (true);
CREATE POLICY "Public read facilities" ON facilities FOR SELECT USING (true);
CREATE POLICY "Public read teachers" ON teachers FOR SELECT USING (true);
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read instagram_posts" ON instagram_posts FOR SELECT USING (true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Auth all hero" ON hero FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all hero_stats" ON hero_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all about" ON about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all visi_misi" ON visi_misi FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all visi_misi_values" ON visi_misi_values FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all programs" ON programs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all program_items" ON program_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all contact" ON contact FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all navbar" ON navbar FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all footer" ON footer FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all facilities" ON facilities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all teachers" ON teachers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all instagram_posts" ON instagram_posts FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket: create via Supabase Dashboard or run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);
-- CREATE POLICY "Public read assets" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
-- CREATE POLICY "Auth upload assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth update assets" ON storage.objects FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth delete assets" ON storage.objects FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Storage bucket for assets (images, etc.)
-- Run after 001_initial.sql
-- Or create via Supabase Dashboard: Storage > New bucket > name: assets, public: true

INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for assets
CREATE POLICY "Public read assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Authenticated users can upload
CREATE POLICY "Auth insert assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Auth update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Auth delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Chatbot settings (Gemini API key stored in admin, not .env)
CREATE TABLE chatbot_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gemini_api_key TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  welcome_message TEXT DEFAULT 'Halo! Ada yang bisa saya bantu tentang sekolah kami?',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default row (single config)
INSERT INTO chatbot_settings (gemini_api_key, enabled, welcome_message)
VALUES ('', true, 'Halo! Ada yang bisa saya bantu tentang sekolah kami?');

-- Enable RLS
ALTER TABLE chatbot_settings ENABLE ROW LEVEL SECURITY;

-- Public read (untuk cek apakah chatbot enabled - API key tidak di-expose ke client)
CREATE POLICY "Public read chatbot_settings" ON chatbot_settings FOR SELECT USING (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Auth all chatbot_settings" ON chatbot_settings FOR ALL USING (auth.role() = 'authenticated');

-- Add model column to chatbot_settings
-- Referensi: https://ai.google.dev/gemini-api/docs/models
ALTER TABLE chatbot_settings
ADD COLUMN IF NOT EXISTS model TEXT DEFAULT 'gemini-2.5-flash-lite';

-- Update existing rows
UPDATE chatbot_settings SET model = 'gemini-2.5-flash-lite' WHERE model IS NULL;

-- Chatbot FAQ: Pertanyaan dan jawaban yang bisa dikelola admin
-- Digunakan sebagai knowledge base untuk chatbot

CREATE TABLE chatbot_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE chatbot_faq ENABLE ROW LEVEL SECURITY;

-- Public read (untuk chatbot API)
CREATE POLICY "Public read chatbot_faq" ON chatbot_faq FOR SELECT USING (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Auth all chatbot_faq" ON chatbot_faq FOR ALL USING (auth.role() = 'authenticated');

-- Allow service_role to upload/update/delete in storage (for seed script & server-side ops)
-- Run after 002_storage.sql
-- RLS: any matching policy allows the operation

CREATE POLICY "Service role insert assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'service_role');

CREATE POLICY "Service role update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets' AND auth.role() = 'service_role');

-- RAG + Chat Jobs: pgvector embeddings & job queue
-- Run: supabase db push

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base: FAQ chunks with embeddings (untuk RAG retrieval)
CREATE TABLE chatbot_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES chatbot_faq(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- HNSW index untuk similarity search (cosine distance)
CREATE INDEX IF NOT EXISTS chatbot_knowledge_embedding_idx
ON chatbot_knowledge
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Chat jobs: queue untuk memproses pesan (mengamankan work task)
CREATE TABLE chat_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  history JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_text TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_jobs_status ON chat_jobs(status);
CREATE INDEX idx_chat_jobs_created ON chat_jobs(created_at);

-- RLS
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read chatbot_knowledge" ON chatbot_knowledge FOR SELECT USING (true);
CREATE POLICY "Service role all chatbot_knowledge" ON chatbot_knowledge FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public insert chat_jobs" ON chat_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select chat_jobs" ON chat_jobs FOR SELECT USING (true);
CREATE POLICY "Service role update chat_jobs" ON chat_jobs FOR UPDATE USING (auth.role() = 'service_role');

-- RPC: similarity search untuk RAG
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (id uuid, content text, similarity float)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chatbot_knowledge.id,
    chatbot_knowledge.content,
    1 - (chatbot_knowledge.embedding <=> query_embedding) AS similarity
  FROM chatbot_knowledge
  WHERE chatbot_knowledge.embedding IS NOT NULL
    AND 1 - (chatbot_knowledge.embedding <=> query_embedding) > match_threshold
  ORDER BY chatbot_knowledge.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- pg_cron (opsional): Re-index FAQ embeddings & process queue
-- Supabase Pro/Team: pg_cron & pg_net tersedia
-- Untuk Free tier: gunakan API /api/chat/index-faq atau Vercel Cron

-- Uncomment jika pg_cron tersedia:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- CREATE EXTENSION IF NOT EXISTS pg_net;
-- SELECT cron.schedule('index-faq-daily', '0 2 * * *', $$ ... $$);

-- Toggle: Aktifkan Gemini API (LLM) atau RAG only
-- use_gemini_api = true  -> RAG + LLM
-- use_gemini_api = false -> RAG only (tanpa LLM)

ALTER TABLE chatbot_settings
ADD COLUMN IF NOT EXISTS use_gemini_api BOOLEAN DEFAULT true;

UPDATE chatbot_settings SET use_gemini_api = true WHERE use_gemini_api IS NULL;

-- Fallback: text search pada chatbot_faq (tanpa embedding/API)
-- Digunakan ketika embedding gagal atau chatbot_knowledge kosong

CREATE OR REPLACE FUNCTION search_faq_text(query_text TEXT, max_results INT DEFAULT 5)
RETURNS TABLE (question TEXT, answer TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  search_term TEXT := trim(coalesce(query_text, ''));
BEGIN
  IF search_term = '' THEN
    RETURN QUERY SELECT f.question, f.answer FROM chatbot_faq f ORDER BY f.sort_order LIMIT max_results;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT f.question, f.answer
  FROM chatbot_faq f
  WHERE
    f.question ILIKE '%' || search_term || '%'
    OR f.answer ILIKE '%' || search_term || '%'
  ORDER BY
    CASE WHEN f.question ILIKE '%' || search_term || '%' THEN 0 ELSE 1 END,
    f.sort_order
  LIMIT max_results;
END;
$$;

-- Keyword cepat untuk chatbot (user klik, otomatis kirim pesan)
CREATE TABLE chatbot_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  message TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE chatbot_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read chatbot_keywords" ON chatbot_keywords FOR SELECT USING (true);
CREATE POLICY "Auth all chatbot_keywords" ON chatbot_keywords FOR ALL USING (auth.role() = 'authenticated');

-- Seed default keywords
INSERT INTO chatbot_keywords (label, message, sort_order) VALUES
  ('Cara mendaftar', 'Bagaimana cara mendaftar?', 0),
  ('Jam operasional', 'Jam operasional sekolah?', 1),
  ('Program yang ditawarkan', 'Apa saja program yang ditawarkan?', 2),
  ('Lokasi sekolah', 'Di mana lokasi sekolah?', 3);

-- Chat usage log: token & prompt monitoring
-- Run: supabase db push

CREATE TABLE chat_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES chat_jobs(id) ON DELETE SET NULL,
  model TEXT,
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  system_prompt_preview TEXT,
  user_message_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_usage_log_created ON chat_usage_log(created_at DESC);
CREATE INDEX idx_chat_usage_log_job ON chat_usage_log(job_id);

ALTER TABLE chat_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role all chat_usage_log" ON chat_usage_log FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Auth read chat_usage_log" ON chat_usage_log FOR SELECT USING (auth.role() = 'authenticated');

-- Site SEO & Sitemap - metadata dan konfigurasi untuk Google index
-- Run: supabase db push

CREATE TABLE site_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'SMP PUI Haurgeulis',
  short_name TEXT DEFAULT 'TK IT SMART KIDS',
  site_url TEXT NOT NULL DEFAULT 'https://smp-pui-haurgeulis.vercel.app',
  description TEXT DEFAULT '',
  keywords JSONB DEFAULT '[]',
  title_template TEXT DEFAULT 'Taman Kanak-Kanak Terdepan di Haurgeulis',
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  google_verification TEXT DEFAULT '',
  open_graph_image TEXT DEFAULT '',
  sitemap_entries JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Satu baris config (upsert by id)
INSERT INTO site_seo (id, site_name, short_name, site_url, description, keywords, title_template, robots_index, robots_follow, google_verification, open_graph_image, sitemap_entries)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SMP PUI Haurgeulis',
  'TK IT SMART KIDS',
  'https://smp-pui-haurgeulis.vercel.app',
  'SMP PUI Haurgeulis adalah lembaga pendidikan anak usia dini yang berkomitmen membangun generasi cerdas, kreatif, dan berkarakter mulia.',
  '["TK IT SMART KIDS","KOBER SMART KIDS","TK Haurgeulis","Taman Kanak-Kanak Haurgeulis","PAUD Haurgeulis","Pendidikan anak usia dini","TK Indramayu"]'::jsonb,
  'Taman Kanak-Kanak Terdepan di Haurgeulis',
  true,
  true,
  '2gmumy-6QJqokZ-eBWIYUwPBlvDJS5o-J9YfY390bjg',
  '/images/foto2/logo_preview_rev_1.png',
  '[{"path":"/","changeFrequency":"weekly","priority":1}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  short_name = EXCLUDED.short_name,
  site_url = EXCLUDED.site_url,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  title_template = EXCLUDED.title_template,
  robots_index = EXCLUDED.robots_index,
  robots_follow = EXCLUDED.robots_follow,
  google_verification = EXCLUDED.google_verification,
  open_graph_image = EXCLUDED.open_graph_image,
  sitemap_entries = EXCLUDED.sitemap_entries,
  updated_at = now();

ALTER TABLE site_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_seo" ON site_seo FOR SELECT USING (true);
CREATE POLICY "Auth all site_seo" ON site_seo FOR ALL USING (auth.role() = 'authenticated');

-- Ekstrakurikuler SMP (section + items)
CREATE TABLE extracurriculars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  lead TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE extracurricular_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extracurriculars_id UUID REFERENCES extracurriculars(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  detail TEXT DEFAULT '',
  icon_image_url TEXT,
  features JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0
);

ALTER TABLE extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracurricular_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read extracurriculars" ON extracurriculars FOR SELECT USING (true);
CREATE POLICY "Public read extracurricular_items" ON extracurricular_items FOR SELECT USING (true);
CREATE POLICY "Auth all extracurriculars" ON extracurriculars FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all extracurricular_items" ON extracurricular_items FOR ALL USING (auth.role() = 'authenticated');

-- Update metadata default untuk SMP PUI HAURGEULIS (setelah migrasi site_seo ada)
UPDATE site_seo SET
  site_name = 'SMP PUI HAURGEULIS',
  short_name = 'SMP PUI',
  description = 'SMP PUI HAURGEULIS — Sekolah Menengah Pertama Persatuan Umat Islam di Haurgeulis. Kurikulum Merdeka, karakter Islami, literasi & numerasi, serta ekstrakurikuler lengkap.',
  keywords = '["SMP PUI","SMP PUI HAURGEULIS","SMP Haurgeulis","SMP Indramayu","SMP Swasta Haurgeulis","Persatuan Umat Islam","SMP Islam Haurgeulis"]'::jsonb,
  title_template = 'SMP PUI HAURGEULIS — Pendidikan Menengah di Haurgeulis',
  open_graph_image = '/images/foto2/logo_preview_rev_1.png',
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000001';
