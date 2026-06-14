"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

type GalleryImage = { id: string; src_url: string; alt: string; caption: string }

export function GalleryForm({ images: initial }: { images: GalleryImage[] }) {
  const [images, setImages] = useState(initial)
  const [newSrc, setNewSrc] = useState("")
  const [newAlt, setNewAlt] = useState("")
  const [newCaption, setNewCaption] = useState("")
  const [editing, setEditing] = useState<Record<string, { src_url: string; alt: string; caption: string }>>({})

  async function handleAdd() {
    if (!newSrc.trim()) return
    await createGalleryImage({ src_url: newSrc.trim(), alt: newAlt, caption: newCaption })
    setNewSrc("")
    setNewAlt("")
    setNewCaption("")
    toast.success("Gambar ditambahkan")
    window.location.reload()
  }

  async function handleUpdate(id: string) {
    const e = editing[id] ?? images.find((i) => i.id === id)
    if (!e) return
    await updateGalleryImage(id, { src_url: e.src_url, alt: e.alt, caption: e.caption })
    toast.success("Gambar diperbarui")
    window.location.reload()
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus gambar ini?")) return
    await deleteGalleryImage(id)
    toast.success("Gambar dihapus")
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Gambar Galeri</CardTitle>
          <CardDescription>Upload gambar atau masukkan URL gambar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Gambar</Label>
              <Input value={newSrc} onChange={(e) => setNewSrc(e.target.value)} placeholder="URL atau upload" className="mt-1" />
              <UploadInput getPath={(f) => `images/gallery/${Date.now()}-${f.name}`} onSuccess={(url) => { setNewSrc(url); toast.success("Gambar diunggah") }} onError={(msg) => toast.error(msg)} className="mt-2" />
            </div>
            <div>
              <Label>Deskripsi Gambar</Label>
              <Input value={newAlt} onChange={(e) => setNewAlt(e.target.value)} className="mt-1" placeholder="Untuk aksesibilitas" />
            </div>
            <div>
              <Label>Keterangan</Label>
              <Input value={newCaption} onChange={(e) => setNewCaption(e.target.value)} className="mt-1" placeholder="Caption yang ditampilkan" />
            </div>
          </div>
          <Button onClick={handleAdd} type="button"><Plus className="mr-2 h-4 w-4" />Tambah</Button>
        </CardContent>
      </Card>
      {images.map((img) => {
        const e = editing[img.id] ?? { src_url: img.src_url, alt: img.alt, caption: img.caption }
        return (
          <Card key={img.id}>
            <CardContent className="pt-6 flex gap-4 items-start">
              <img src={e.src_url} alt={e.alt} className="h-24 w-32 object-cover rounded" />
              <div className="flex-1 space-y-2">
                <div><Label>URL Gambar</Label><Input value={e.src_url} onChange={(v) => setEditing((p) => ({ ...p, [img.id]: { ...e, src_url: v.target.value } }))} className="mt-1" /></div>
                <div><Label>Deskripsi Gambar</Label><Input value={e.alt} onChange={(v) => setEditing((p) => ({ ...p, [img.id]: { ...e, alt: v.target.value } }))} className="mt-1" placeholder="Untuk aksesibilitas" /></div>
                <div><Label>Keterangan</Label><Input value={e.caption} onChange={(v) => setEditing((p) => ({ ...p, [img.id]: { ...e, caption: v.target.value } }))} className="mt-1" placeholder="Caption yang ditampilkan" /></div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => handleUpdate(img.id)}>Simpan</Button>
                <Button type="button" variant="destructive" onClick={() => handleDelete(img.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
