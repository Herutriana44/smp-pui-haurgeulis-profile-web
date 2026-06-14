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
