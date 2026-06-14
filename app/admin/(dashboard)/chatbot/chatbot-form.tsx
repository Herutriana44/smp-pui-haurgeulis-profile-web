"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateChatbotSettings } from "@/app/actions"
import { toast } from "sonner"

/** Model Gemini API - https://ai.google.dev/gemini-api/docs/models */
const GEMINI_MODELS = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Rekomendasi)" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite (Paling cepat)" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Paling canggih)" },
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { id: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
] as const

type ChatbotData = {
  id: string
  gemini_api_key: string
  enabled: boolean
  use_gemini_api?: boolean | null
  welcome_message: string
  model?: string | null
} | null

export function ChatbotForm({ data }: { data: ChatbotData }) {
  const [enabled, setEnabled] = useState(data?.enabled ?? true)
  const [useGeminiApi, setUseGeminiApi] = useState(data?.use_gemini_api ?? true)
  const [model, setModel] = useState(data?.model ?? "gemini-2.0-flash")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    await updateChatbotSettings({
      gemini_api_key: formData.get("gemini_api_key") as string,
      enabled,
      use_gemini_api: useGeminiApi,
      welcome_message: formData.get("welcome_message") as string,
      model,
    })
    toast.success("Pengaturan chatbot berhasil disimpan")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Status Chatbot</CardTitle>
          <CardDescription>
            Aktifkan atau nonaktifkan chatbot. Jika dinonaktifkan, widget chatbot tidak akan muncul di website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Aktifkan Chatbot</Label>
            <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gemini API</CardTitle>
          <CardDescription>
            API key untuk embedding (RAG) dan LLM. Dapatkan di{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              aistudio.google.com/apikey
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="use_gemini_api">Aktifkan LLM (Gemini)</Label>
              <p className="text-xs text-muted-foreground">
                Jika dinonaktifkan: chatbot hanya pakai RAG (jawaban dari FAQ). Jika diaktifkan: RAG + LLM.
              </p>
            </div>
            <Switch id="use_gemini_api" checked={useGeminiApi} onCheckedChange={setUseGeminiApi} />
          </div>
          <div>
            <Label htmlFor="gemini_api_key">API Key Gemini</Label>
            <Input
              id="gemini_api_key"
              name="gemini_api_key"
              type="password"
              placeholder="AIza..."
              defaultValue={data?.gemini_api_key ?? ""}
              className="mt-1 font-mono"
              autoComplete="off"
            />
          </div>
          <div>
            <Label>Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih model" />
              </SelectTrigger>
              <SelectContent>
                {GEMINI_MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">
              Referensi:{" "}
              <a
                href="https://ai.google.dev/gemini-api/docs/models"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                ai.google.dev/gemini-api/docs/models
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pesan Sambutan</CardTitle>
          <CardDescription>Pesan yang ditampilkan saat pengunjung membuka chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="welcome_message">Pesan Sambutan</Label>
            <Input
              id="welcome_message"
              name="welcome_message"
              defaultValue={data?.welcome_message ?? "Halo! Ada yang bisa saya bantu tentang sekolah kami?"}
              className="mt-1"
              placeholder="Halo! Ada yang bisa saya bantu?"
            />
          </div>
        </CardContent>
      </Card>
      <Button type="submit">Simpan</Button>
    </form>
  )
}
