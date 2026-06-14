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
