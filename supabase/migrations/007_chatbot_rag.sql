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
