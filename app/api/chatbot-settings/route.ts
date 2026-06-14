import { NextResponse } from "next/server"
import { getChatbotKeywords } from "@/lib/data"
import { createClient } from "@/lib/supabase/server"

/** Public API - returns enabled, welcome_message, keywords (no API key) */
export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("chatbot_settings")
    .select("enabled, welcome_message")
    .limit(1)
    .single()

  const keywords = await getChatbotKeywords()

  return NextResponse.json({
    enabled: !!data?.enabled,
    welcomeMessage: data?.welcome_message || "Halo! Ada yang bisa saya bantu?",
    keywords: keywords.map((k) => ({ label: k.label, message: k.message })),
  })
}
