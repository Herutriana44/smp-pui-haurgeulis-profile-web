"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp?: string
  responseTimeSec?: number
}
type Keyword = { label: string; message: string }

const POLL_INTERVAL = 500
const POLL_MAX_ATTEMPTS = 60

export function ChatbotWidget({
  welcomeMessage,
  keywords = [],
}: {
  welcomeMessage: string
  keywords?: Keyword[]
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  function getTimeStr() {
    return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  }

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: welcomeMessage, timestamp: getTimeStr() }])
    }
  }, [open, welcomeMessage, messages.length])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  async function pollStatus(jobId: string): Promise<string> {
    for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
      const res = await fetch(`/api/chat/status?job_id=${jobId}`)
      const data = await res.json()
      if (data.status === "completed") return data.text || "Maaf, tidak ada respons."
      if (data.status === "failed") throw new Error(data.error || "Gagal memproses pesan")
      await new Promise((r) => setTimeout(r, POLL_INTERVAL))
    }
    throw new Error("Timeout. Silakan coba lagi.")
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const startTime = Date.now()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text.trim(), timestamp: getTimeStr() }])
    setLoading(true)

    try {
      const history = messages
        .filter((m) => m.role !== "assistant" || m.content !== welcomeMessage)
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), history }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pesan")
      }

      const jobId = data.job_id
      if (!jobId) throw new Error("Tidak ada job_id")

      const resultText = await pollStatus(jobId)
      const responseTimeSec = (Date.now() - startTime) / 1000
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: resultText, timestamp: getTimeStr(), responseTimeSec },
      ])
    } catch (err) {
      const responseTimeSec = (Date.now() - startTime) / 1000
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: (err as Error).message || "Terjadi kesalahan. Coba lagi.",
          timestamp: getTimeStr(),
          responseTimeSec,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSend() {
    sendMessage(input.trim())
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-20 z-50 flex h-[420px] flex-col overflow-hidden rounded-2xl border bg-card shadow-xl transition-all duration-300",
          "left-4 right-4 w-[calc(100vw-2rem)] max-w-[360px] sm:left-auto sm:right-6 sm:w-[360px]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">Chatbot Sekolah</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {keywords.length > 0 && messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {keywords.map((kw, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(kw.message)}
                  disabled={loading}
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                >
                  {kw.label}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div>{m.content}</div>
              <div className="mt-1 flex items-center justify-between gap-2 text-[10px] opacity-70">
                <span>{m.timestamp ?? ""}</span>
                {m.role === "assistant" && m.responseTimeSec != null && (
                  <span className="ml-auto">{m.responseTimeSec.toFixed(1)}s</span>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-1 px-4 py-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>

        <div className="border-t p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
        aria-label="Buka chatbot"
      >
        <Bot className="h-7 w-7" />
      </button>
    </>
  )
}
