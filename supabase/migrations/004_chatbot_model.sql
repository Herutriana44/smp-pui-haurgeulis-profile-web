-- Add model column to chatbot_settings
-- Referensi: https://ai.google.dev/gemini-api/docs/models
ALTER TABLE chatbot_settings
ADD COLUMN IF NOT EXISTS model TEXT DEFAULT 'gemini-2.0-flash';

-- Update existing rows
UPDATE chatbot_settings SET model = 'gemini-2.0-flash' WHERE model IS NULL;
