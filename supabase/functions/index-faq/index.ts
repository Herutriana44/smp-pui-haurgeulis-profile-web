// Edge Function: Index FAQ ke chatbot_knowledge (embeddings)
// Dipanggil oleh cron atau setelah FAQ diubah

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const EMBED_DIM = 768
const GEMINI_EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent"

async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch(`${GEMINI_EMBED_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/gemini-embedding-001",
      content: { parts: [{ text }] },
      outputDimensionality: EMBED_DIM,
    }),
  })
  if (!res.ok) throw new Error(`Embedding failed: ${await res.text()}`)
  const data = await res.json()
  return data.embedding?.values || []
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } })
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const { data: settings } = await supabase.from("chatbot_settings").select("gemini_api_key").limit(1).single()
    const apiKey = settings?.gemini_api_key?.trim()
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), { status: 503 })
    }

    const { data: faqList } = await supabase.from("chatbot_faq").select("id, question, answer").order("sort_order")
    if (!faqList?.length) {
      return new Response(JSON.stringify({ indexed: 0 }), { headers: { "Content-Type": "application/json" } })
    }

    await supabase.from("chatbot_knowledge").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    let indexed = 0
    for (const faq of faqList) {
      const content = `Q: ${faq.question}\nA: ${faq.answer}`
      try {
        const embedding = await getEmbedding(content, apiKey)
        if (embedding.length) {
          await supabase.from("chatbot_knowledge").insert({
            source_id: faq.id,
            content,
            metadata: { question: faq.question },
            embedding,
          })
          indexed++
        }
      } catch (e) {
        console.error(`Failed to embed FAQ ${faq.id}:`, e)
      }
    }

    return new Response(JSON.stringify({ indexed }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  } catch (err) {
    console.error("index-faq error:", err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
