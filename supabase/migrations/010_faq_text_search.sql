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
