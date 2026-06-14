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
