"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createInstagramPost, updateInstagramPost, deleteInstagramPost } from "@/app/actions"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

type Post = { id: string; embed_html: string; sort_order: number }

export function InstagramForm({ posts: initial }: { posts: Post[] }) {
  const [newEmbed, setNewEmbed] = useState("")
  const [editing, setEditing] = useState<Record<string, string>>({})

  async function handleAdd() {
    if (!newEmbed.trim()) return
    await createInstagramPost(newEmbed.trim())
    setNewEmbed("")
    toast.success("Post ditambahkan")
    window.location.reload()
  }

  async function handleUpdate(id: string) {
    const html = editing[id] ?? initial.find((p) => p.id === id)?.embed_html
    if (!html) return
    await updateInstagramPost(id, html)
    setEditing((p) => {
      const next = { ...p }
      delete next[id]
      return next
    })
    toast.success("Post diperbarui")
    window.location.reload()
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus post ini?")) return
    await deleteInstagramPost(id)
    toast.success("Post dihapus")
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Post Instagram</CardTitle>
          <CardDescription>
            Buka Instagram → post yang ingin ditampilkan → ⋯ (titik tiga) → Embed → Copy code. Tempel kode di bawah.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Kode Embed</Label>
            <textarea value={newEmbed} onChange={(e) => setNewEmbed(e.target.value)} placeholder="Tempel kode embed dari Instagram..." className="mt-1 w-full min-h-[120px] rounded-md border px-3 py-2 font-mono text-sm" />
          </div>
          <Button onClick={handleAdd} type="button"><Plus className="mr-2 h-4 w-4" />Tambah</Button>
        </CardContent>
      </Card>
      {initial.map((p) => {
        const html = editing[p.id] ?? p.embed_html
        return (
          <Card key={p.id}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Kode Embed</Label>
                <textarea value={html} onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: e.target.value }))} className="mt-1 w-full min-h-[80px] rounded-md border px-3 py-2 font-mono text-sm" placeholder="Kode embed dari Instagram" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => handleUpdate(p.id)}>Simpan</Button>
                <Button type="button" variant="destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
