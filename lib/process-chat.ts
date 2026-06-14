/**
 * Process chat job - RAG + LLM + log ke chat_usage_log
 * Digunakan oleh API route sebagai fallback/suplemen Edge Function
 */

import { createAdminClient } from "@/lib/supabase/admin"

const EMBED_DIM = 768
const GEMINI_EMBED_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent"
const GEMINI_GENERATE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

interface UsageMetadata {
  promptTokenCount?: number
  candidatesTokenCount?: number
  totalTokenCount?: number
}

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
  return data.embedding.values
}

async function generateWithLLM(
  apiKey: string,
  model: string,
  systemPrompt: string,
  history: { role: string; content: string }[],
  message: string
): Promise<{ text: string; usage?: UsageMetadata }> {
  const contents = [
    ...history.slice(-10).map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ]

  const res = await fetch(`${GEMINI_GENERATE_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
    }),
  })
  if (!res.ok) throw new Error(`LLM failed: ${await res.text()}`)
  const data = await res.json()
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, terjadi kesalahan. Silakan coba lagi."
  const raw = data?.usageMetadata ?? data?.usage_metadata
  const usage: UsageMetadata | undefined = raw
    ? {
        promptTokenCount: raw.promptTokenCount ?? raw.prompt_token_count ?? 0,
        candidatesTokenCount: raw.candidatesTokenCount ?? raw.candidates_token_count ?? 0,
        totalTokenCount: raw.totalTokenCount ?? raw.total_token_count ?? 0,
      }
    : undefined
  return { text, usage }
}

export async function processChatJob(jobId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { data: job } = await supabase.from("chat_jobs").select("*").eq("id", jobId).single()
  if (!job || job.status !== "pending") {
    return { ok: false, error: "Job not found or already processed" }
  }

  await supabase
    .from("chat_jobs")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", jobId)

  const { data: settings } = await supabase
    .from("chatbot_settings")
    .select("gemini_api_key, model, enabled, use_gemini_api")
    .limit(1)
    .single()

  const apiKey = settings?.gemini_api_key?.trim()
  const model = settings?.model?.trim() || "gemini-2.0-flash"
  const useGeminiApi = settings?.use_gemini_api !== false

  const BASE_PROMPT = `Kamu adalah asisten chatbot untuk website profil sekolah SMP PUI HAURGEULIS (Sekolah Menengah Pertama Persatuan Umat Islam di Haurgeulis).
Jawab pertanyaan pengunjung dengan ramah dan informatif. Gunakan bahasa Indonesia yang santun.
Jika tidak tahu, sarankan hubungi 0838-2333-4998 (Tata Usaha / informasi).`

  let context = ""
  let useLLM = !!apiKey && useGeminiApi

  if (apiKey) {
    try {
      const embedding = await getEmbedding(job.message, apiKey)
      const { data: matches } = await supabase.rpc("match_knowledge", {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 5,
      })
      const rows = Array.isArray(matches) ? matches : []
      if (rows.length) {
        context = rows.map((m: { content: string }) => m.content).join("\n\n")
      }
    } catch (e) {
      console.error("RAG vector search error:", e)
    }
  }

  if (!context) {
    try {
      const { data: faqRows } = await supabase.rpc("search_faq_text", {
        query_text: job.message,
        max_results: 5,
      })
      const rows = Array.isArray(faqRows) ? faqRows : []
      if (rows.length) {
        context = rows
          .map((r: { question: string; answer: string }) => `Q: ${r.question}\nA: ${r.answer}`)
          .join("\n\n")
      }
    } catch (e) {
      console.error("RAG text search fallback error:", e)
    }
  }

  const systemPrompt = context
    ? `${BASE_PROMPT}\n\nKonteks dari knowledge base:\n${context}`
    : `${BASE_PROMPT}\n\nTidak ada template jawaban dari RAG. Gunakan pengetahuan umum untuk menjawab pertanyaan pengunjung dengan ramah dan informatif.`

  let resultText = ""
  let usageMetadata: UsageMetadata | undefined

  if (useLLM) {
    try {
      const genResult = await generateWithLLM(
        apiKey!,
        model,
        systemPrompt,
        job.history || [],
        job.message
      )
      resultText = genResult.text
      usageMetadata = genResult.usage
    } catch (e) {
      console.error("LLM error:", e)
      useLLM = false
    }
  }

  if (!useLLM || !resultText) {
    if (context) {
      const answers = context.split(/\n\n+/).map((chunk) => {
        const aIdx = chunk.indexOf("A: ")
        return aIdx >= 0 ? chunk.slice(aIdx + 3).trim() : chunk.trim()
      }).filter(Boolean)
      resultText = `${answers.join("\n\n")}\n\nUntuk pertanyaan lebih lanjut, hubungi 0838-2333-4998 (Umi Meli).`
    } else {
      resultText =
        "Maaf, layanan chatbot sedang tidak tersedia. Silakan hubungi 0838-2333-4998 (Umi Meli) untuk bantuan."
    }
  }

  await supabase
    .from("chat_jobs")
    .update({ status: "completed", result_text: resultText, updated_at: new Date().toISOString() })
    .eq("id", jobId)

  const preview = (s: string, maxLen: number) =>
    s.length > maxLen ? s.slice(0, maxLen) + "…" : s
  const promptTokens = usageMetadata?.promptTokenCount ?? 0
  const completionTokens = usageMetadata?.candidatesTokenCount ?? 0
  const totalTokens = usageMetadata?.totalTokenCount ?? 0
  const usedModel = useLLM ? model : null

  const { error: logErr } = await supabase.from("chat_usage_log").insert({
    job_id: jobId,
    model: usedModel,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: totalTokens,
    system_prompt_preview: preview(systemPrompt, 500),
    user_message_preview: preview(job.message, 200),
  })
  if (logErr) {
    console.error("chat_usage_log insert error:", logErr)
  }

  return { ok: true }
}
