"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/app/actions"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

type Testimonial = { id: string; name: string; role: string; content: string; rating: number }

export function TestimonialsForm({ testimonials: initial }: { testimonials: Testimonial[] }) {
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editing, setEditing] = useState<Record<string, { name: string; role: string; content: string; rating: number }>>({})

  async function handleAdd() {
    if (!newName.trim() || !newContent.trim()) return
    await createTestimonial({ name: newName.trim(), role: newRole.trim(), content: newContent.trim() })
    setNewName("")
    setNewRole("")
    setNewContent("")
    toast.success("Testimoni ditambahkan")
    window.location.reload()
  }

  async function handleUpdate(id: string) {
    const e = editing[id] ?? initial.find((t) => t.id === id)
    if (!e) return
    await updateTestimonial(id, { name: e.name, role: e.role, content: e.content, rating: e.rating })
    toast.success("Testimoni diperbarui")
    window.location.reload()
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus testimoni ini?")) return
    await deleteTestimonial(id)
    toast.success("Testimoni dihapus")
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Nama</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1" /></div>
            <div><Label>Role</Label><Input value={newRole} onChange={(e) => setNewRole(e.target.value)} className="mt-1" /></div>
          </div>
          <div><Label>Konten</Label><textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} className="mt-1 w-full min-h-[80px] rounded-md border px-3 py-2" /></div>
          <Button onClick={handleAdd} type="button"><Plus className="mr-2 h-4 w-4" />Tambah</Button>
        </CardContent>
      </Card>
      {initial.map((t) => {
        const e = editing[t.id] ?? { name: t.name, role: t.role, content: t.content, rating: t.rating }
        return (
          <Card key={t.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Nama</Label><Input value={e.name} onChange={(v) => setEditing((p) => ({ ...p, [t.id]: { ...e, name: v.target.value } }))} className="mt-1" /></div>
                <div><Label>Role</Label><Input value={e.role} onChange={(v) => setEditing((p) => ({ ...p, [t.id]: { ...e, role: v.target.value } }))} className="mt-1" /></div>
              </div>
              <div><Label>Konten</Label><textarea value={e.content} onChange={(v) => setEditing((p) => ({ ...p, [t.id]: { ...e, content: v.target.value } }))} className="mt-1 w-full min-h-[60px] rounded-md border px-3 py-2" /></div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => handleUpdate(t.id)}>Simpan</Button>
                <Button type="button" variant="destructive" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
