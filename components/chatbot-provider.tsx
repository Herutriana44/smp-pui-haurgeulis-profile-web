"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ChatbotWidget } from "./chatbot-widget"

type Keyword = { label: string; message: string }

export function ChatbotProvider() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<{
    enabled: boolean
    welcomeMessage: string
    keywords?: Keyword[]
  } | null>(null)

  const isAdmin = pathname?.startsWith("/admin")

  useEffect(() => {
    if (isAdmin) return
    fetch("/api/chatbot-settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setSettings({ enabled: false, welcomeMessage: "", keywords: [] }))
  }, [isAdmin])

  if (isAdmin || !settings?.enabled) return null

  return (
    <ChatbotWidget
      welcomeMessage={settings.welcomeMessage}
      keywords={settings.keywords || []}
    />
  )
}
