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
