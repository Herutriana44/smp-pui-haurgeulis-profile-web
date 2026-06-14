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
