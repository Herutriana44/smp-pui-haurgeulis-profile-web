"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createFacility, updateFacility, deleteFacility } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

type Facility = {
  id: string
  title: string
  description: string
  image_url: string | null
  sort_order: number
}

export function FacilitiesForm({ facilities: initial }: { facilities: Facility[] }) {
  const [facilities, setFacilities] = useState(initial)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newImage, setNewImage] = useState<string | null>(null)
  const [editing, setEditing] = useState<Record<string, { title: string; description: string; image_url: string | null }>>({})

  async function handleAdd() {
    if (!newTitle.trim()) return
    await createFacility({
      title: newTitle.trim(),
      description: newDesc.trim(),
      image_url: newImage,
    })
    setNewTitle("")
    setNewDesc("")
    setNewImage(null)
    toast.success("Fasilitas ditambahkan")
    window.location.reload()
  }

  async function handleUpdate(id: string) {
    const e = editing[id]
    if (!e) return
    await updateFacility(id, {
      title: e.title,
      description: e.description,
      image_url: e.image_url,
    })
    setEditing((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    toast.success("Fasilitas diperbarui")
    window.location.reload()
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus fasilitas ini?")) return
    await deleteFacility(id)
    toast.success("Fasilitas dihapus")
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Fasilitas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Judul</Label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Nama fasilitas" className="mt-1" />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Deskripsi"
              className="mt-1 w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <Label>Gambar</Label>
            <div className="mt-2 flex gap-4">
              <UploadInput
                getPath={(f) => `images/facilities/${Date.now()}-${f.name}`}
                onSuccess={(url) => { setNewImage(url); toast.success("Gambar diunggah") }}
                onError={(msg) => toast.error(msg)}
              />
              {newImage && <img src={newImage} alt="" className="h-20 w-32 object-cover rounded" />}
            </div>
          </div>
          <Button onClick={handleAdd} type="button">
            <Plus className="mr-2 h-4 w-4" />
            Tambah
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold">Daftar Fasilitas</h3>
        {facilities.map((f) => {
          const e = editing[f.id] ?? { title: f.title, description: f.description, image_url: f.image_url }
          return (
            <Card key={f.id}>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Judul</Label>
                  <Input
                    value={e.title}
                    onChange={(v) => setEditing((p) => ({ ...p, [f.id]: { ...e, title: v.target.value } }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Deskripsi</Label>
                  <textarea
                    value={e.description}
                    onChange={(v) => setEditing((p) => ({ ...p, [f.id]: { ...e, description: v.target.value } }))}
                    className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div>
                  <Label>Gambar</Label>
                  <div className="mt-2 flex gap-4">
                    <UploadInput
                      getPath={(file) => `images/facilities/${Date.now()}-${file.name}`}
                      onSuccess={(url) => {
                        const fac = facilities.find((x) => x.id === f.id)
                        setEditing((prev) => ({
                          ...prev,
                          [f.id]: {
                            ...(prev[f.id] || (fac ? { title: fac.title, description: fac.description, image_url: fac.image_url } : { title: "", description: "", image_url: null })),
                            image_url: url,
                          },
                        }))
                        toast.success("Gambar diunggah")
                      }}
                      onError={(msg) => toast.error(msg)}
                    />
                    {(e.image_url || f.image_url) && (
                      <img src={e.image_url || f.image_url!} alt="" className="h-20 w-32 object-cover rounded" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => handleUpdate(f.id)}>
                    Simpan
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => handleDelete(f.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
