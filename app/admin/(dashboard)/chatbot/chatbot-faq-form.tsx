"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createChatbotFaq,
  updateChatbotFaq,
  deleteChatbotFaq,
} from "@/app/actions"
import { toast } from "sonner"
import { Trash2, Plus, RefreshCw } from "lucide-react"

type FaqItem = { id: string; question: string; answer: string; sort_order: number }

export function ChatbotFaqForm({ faq: initial }: { faq: FaqItem[] }) {
  const [faq, setFaq] = useState(initial)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [editing, setEditing] = useState<Record<string, { question: string; answer: string }>>({})

  async function handleAdd() {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Pertanyaan dan jawaban wajib diisi")
      return
    }
    try {
      await createChatbotFaq({ question: newQuestion.trim(), answer: newAnswer.trim() })
      toast.success("Pertanyaan ditambahkan")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambahkan")
    }
  }

  async function handleUpdate(id: string) {
    if (id.startsWith("json-")) {
      toast.error("Data dari JSON tidak bisa diedit. Gunakan Supabase.")
      return
    }
    const e = editing[id]
    const item = faq.find((x) => x.id === id)
    if (!item || !e) return
    try {
      await updateChatbotFaq(id, { question: e.question.trim(), answer: e.answer.trim() })
      toast.success("Pertanyaan diperbarui")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui")
    }
  }

  async function handleReindex() {
    try {
      const res = await fetch("/api/chat/index-faq", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal")
      toast.success(`Index berhasil. ${data.indexed ?? 0} FAQ di-index.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal re-index")
    }
  }

  async function handleDelete(id: string) {
    if (id.startsWith("json-")) {
      toast.error("Data dari JSON tidak bisa dihapus. Gunakan Supabase.")
      return
    }
    if (!confirm("Hapus pertanyaan ini?")) return
    try {
      await deleteChatbotFaq(id)
      toast.success("Pertanyaan dihapus")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pertanyaan & Jawaban (FAQ)</CardTitle>
          <CardDescription>
            Kelola pertanyaan dan jawaban untuk chatbot (RAG). Klik &quot;Re-index&quot; setelah menambah/mengubah FAQ agar embedding diperbarui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pertanyaan</Label>
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Contoh: Berapa biaya pendaftaran?"
              className="mt-1"
            />
          </div>
          <div className="space-y-2">
            <Label>Jawaban</Label>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Ketik jawaban yang akan ditampilkan chatbot..."
              rows={3}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} type="button">
              <Plus className="mr-2 h-4 w-4" />
              Tambah FAQ
            </Button>
            <Button onClick={handleReindex} type="button" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-index (RAG)
            </Button>
          </div>
        </CardContent>
      </Card>

      {faq.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada FAQ. Tambahkan pertanyaan dan jawaban di atas.
        </p>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Daftar FAQ ({faq.length})</h3>
          {faq.map((item) => {
            const e = editing[item.id] ?? { question: item.question, answer: item.answer }
            const isJson = item.id.startsWith("json-")
            return (
              <Card key={item.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Pertanyaan</Label>
                    <Input
                      value={e.question}
                      onChange={(v) =>
                        setEditing((p) => ({
                          ...p,
                          [item.id]: { ...e, question: v.target.value },
                        }))
                      }
                      className="mt-1"
                      disabled={isJson}
                      placeholder="Pertanyaan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Jawaban</Label>
                    <Textarea
                      value={e.answer}
                      onChange={(v) =>
                        setEditing((p) => ({
                          ...p,
                          [item.id]: { ...e, answer: v.target.value },
                        }))
                      }
                      rows={3}
                      className="mt-1"
                      disabled={isJson}
                      placeholder="Jawaban"
                    />
                  </div>
                  <div className="flex gap-2">
                    {!isJson && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleUpdate(item.id)}
                        >
                          Simpan
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {isJson && (
                      <span className="text-xs text-muted-foreground">
                        (Data dari JSON - edit via Supabase)
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
