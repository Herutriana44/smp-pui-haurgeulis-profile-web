-- Toggle: Aktifkan Gemini API (LLM) atau RAG only
-- use_gemini_api = true  -> RAG + LLM
-- use_gemini_api = false -> RAG only (tanpa LLM)

ALTER TABLE chatbot_settings
ADD COLUMN IF NOT EXISTS use_gemini_api BOOLEAN DEFAULT true;

UPDATE chatbot_settings SET use_gemini_api = true WHERE use_gemini_api IS NULL;
