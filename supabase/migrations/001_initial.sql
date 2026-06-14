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
