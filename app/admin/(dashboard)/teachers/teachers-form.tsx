"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createTeacher, updateTeacher, deleteTeacher } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

type Teacher = { id: string; name: string; role: string; description: string; image_url: string | null }

export function TeachersForm({ teachers: initial }: { teachers: Teacher[] }) {
  const [teachers, setTeachers] = useState(initial)
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newImage, setNewImage] = useState<string | null>(null)
  const [editing, setEditing] = useState<Record<string, { name: string; role: string; image_url: string | null }>>({})

  async function handleAdd() {
    if (!newName.trim()) return
    await createTeacher({ name: newName.trim(), role: newRole.trim(), image_url: newImage })
    toast.success("Guru ditambahkan")
    window.location.reload()
  }

  async function handleUpdate(id: string) {
    const e = editing[id]
    const t = teachers.find((x) => x.id === id)
    if (!t) return
    const name = e?.name ?? t.name
    const role = e?.role ?? t.role
    const image_url = e?.image_url ?? t.image_url
    await updateTeacher(id, { name, role, image_url })
    toast.success("Guru diperbarui")
    window.location.reload()
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus guru ini?")) return
    await deleteTeacher(id)
    toast.success("Guru dihapus")
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
          <div>
            <Label>Foto</Label>
            <div className="mt-2 flex gap-4">
              <UploadInput
                getPath={(f) => `images/teachers/${Date.now()}-${f.name}`}
                onSuccess={(url) => { setNewImage(url); toast.success("Gambar diunggah") }}
                onError={(msg) => toast.error(msg)}
              />
              {newImage && <img src={newImage} alt="" className="h-20 w-20 rounded-full object-cover" />}
            </div>
          </div>
          <Button onClick={handleAdd} type="button"><Plus className="mr-2 h-4 w-4" />Tambah</Button>
        </CardContent>
      </Card>
      {teachers.map((t) => {
        const e = editing[t.id] ?? { name: t.name, role: t.role, image_url: t.image_url }
        return (
          <Card key={t.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Nama</Label><Input value={e.name} onChange={(v) => setEditing((p) => ({ ...p, [t.id]: { ...e, name: v.target.value } }))} className="mt-1" /></div>
                <div><Label>Role</Label><Input value={e.role} onChange={(v) => setEditing((p) => ({ ...p, [t.id]: { ...e, role: v.target.value } }))} className="mt-1" /></div>
              </div>
              <div>
                <Label>Foto</Label>
                <div className="mt-2 flex gap-4">
                  <UploadInput
                    getPath={(f) => `images/teachers/${Date.now()}-${f.name}`}
                    onSuccess={(url) => {
                      const teacher = teachers.find((x) => x.id === t.id)
                      setEditing((p) => ({ ...p, [t.id]: { ...(p[t.id] || { name: teacher?.name ?? "", role: teacher?.role ?? "", image_url: teacher?.image_url ?? null }), image_url: url } }))
                      toast.success("Gambar diunggah")
                    }}
                    onError={(msg) => toast.error(msg)}
                  />
                  {(e.image_url || t.image_url) && <img src={e.image_url || t.image_url!} alt="" className="h-20 w-20 rounded-full object-cover" />}
                </div>
              </div>
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
