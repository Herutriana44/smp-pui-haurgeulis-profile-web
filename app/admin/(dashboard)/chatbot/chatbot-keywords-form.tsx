"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createChatbotKeyword,
  updateChatbotKeyword,
  deleteChatbotKeyword,
} from "@/app/actions"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

type KeywordItem = { id: string; label: string; message: string; sort_order: number }

export function ChatbotKeywordsForm({ keywords: initial }: { keywords: KeywordItem[] }) {
  const [keywords, setKeywords] = useState(initial)
  const [newLabel, setNewLabel] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [editing, setEditing] = useState<Record<string, { label: string; message: string }>>({})

  async function handleAdd() {
    if (!newLabel.trim() || !newMessage.trim()) {
      toast.error("Label dan pesan wajib diisi")
      return
    }
    try {
      await createChatbotKeyword({ label: newLabel.trim(), message: newMessage.trim() })
      toast.success("Keyword ditambahkan")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambahkan")
    }
  }

  async function handleUpdate(id: string) {
    const e = editing[id]
    const item = keywords.find((x) => x.id === id)
    if (!item || !e) return
    try {
      await updateChatbotKeyword(id, { label: e.label.trim(), message: e.message.trim() })
      toast.success("Keyword diperbarui")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus keyword ini?")) return
    try {
      await deleteChatbotKeyword(id)
      toast.success("Keyword dihapus")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Cepat</CardTitle>
          <CardDescription>
            Tombol yang muncul di chatbot. User cukup klik, pesan otomatis terkirim. Contoh: &quot;Cara mendaftar&quot;, &quot;Jam operasional&quot;.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Label (teks di tombol)</Label>
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Cara mendaftar"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Pesan (dikirim ke chatbot)</Label>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Bagaimana cara mendaftar?"
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleAdd} type="button">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Keyword
          </Button>
        </CardContent>
      </Card>

      {keywords.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada keyword. Tambahkan di atas.</p>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Daftar Keyword ({keywords.length})</h3>
          {keywords.map((item) => {
            const e = editing[item.id] ?? { label: item.label, message: item.message }
            return (
              <Card key={item.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={e.label}
                        onChange={(v) =>
                          setEditing((p) => ({ ...p, [item.id]: { ...e, label: v.target.value } }))
                        }
                        className="mt-1"
                        placeholder="Cara mendaftar"
                      />
                    </div>
                    <div>
                      <Label>Pesan</Label>
                      <Input
                        value={e.message}
                        onChange={(v) =>
                          setEditing((p) => ({ ...p, [item.id]: { ...e, message: v.target.value } }))
                        }
                        className="mt-1"
                        placeholder="Bagaimana cara mendaftar?"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => handleUpdate(item.id)}>
                      Simpan
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
