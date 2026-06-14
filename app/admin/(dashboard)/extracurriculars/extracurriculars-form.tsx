"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  updateExtracurricularSection,
  createExtracurricularItem,
  updateExtracurricularItem,
  deleteExtracurricularItem,
} from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

type SectionRow = {
  id: string
  title: string
  subtitle: string
  lead: string
}

type ItemRow = {
  id: string
  title: string
  description: string
  detail: string | null
  icon_image_url: string | null
  features: unknown
  sort_order: number
}

function parseFeatures(f: unknown): string[] {
  if (Array.isArray(f)) return f.map(String).filter(Boolean)
  return []
}

export function ExtracurricularsForm({
  section: initialSection,
  items,
}: {
  section: SectionRow | null
  items: ItemRow[]
}) {
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newDetail, setNewDetail] = useState("")
  const [newImage, setNewImage] = useState<string | null>(null)
  const [newFeatures, setNewFeatures] = useState("")

  const [editing, setEditing] = useState<
    Record<
      string,
      {
        title: string
        description: string
        detail: string
        icon_image_url: string | null
        featuresText: string
      }
    >
  >({})

  async function handleSaveHeader(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await updateExtracurricularSection({
        title: (fd.get("sec_title") as string) ?? "",
        subtitle: (fd.get("sec_subtitle") as string) ?? "",
        lead: (fd.get("sec_lead") as string) ?? "",
      })
      toast.success("Judul section berhasil disimpan")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan")
    }
  }

  async function handleAdd() {
    if (!newTitle.trim()) {
      toast.error("Judul kegiatan wajib diisi")
      return
    }
    const features = newFeatures.split("\n").map((s) => s.trim()).filter(Boolean)
    try {
      await createExtracurricularItem({
        title: newTitle.trim(),
        description: newDesc.trim(),
        detail: newDetail.trim(),
        icon_image_url: newImage,
        features,
      })
      setNewTitle("")
      setNewDesc("")
      setNewDetail("")
      setNewImage(null)
      setNewFeatures("")
      toast.success("Kegiatan ditambahkan")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah")
    }
  }

  async function handleUpdate(id: string) {
    const row = items.find((x) => x.id === id)
    if (!row) return
    const e =
      editing[id] ??
      ({
        title: row.title,
        description: row.description,
        detail: row.detail ?? "",
        icon_image_url: row.icon_image_url,
        featuresText: parseFeatures(row.features).join("\n"),
      })
    const features = e.featuresText.split("\n").map((s) => s.trim()).filter(Boolean)
    try {
      await updateExtracurricularItem(id, {
        title: e.title,
        description: e.description,
        detail: e.detail,
        icon_image_url: e.icon_image_url,
        features,
      })
      setEditing((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      toast.success("Kegiatan diperbarui")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus kegiatan ekstrakurikuler ini?")) return
    try {
      await deleteExtracurricularItem(id)
      toast.success("Kegiatan dihapus")
      window.location.reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus")
    }
  }

  function getEditState(id: string, row: ItemRow) {
    if (editing[id]) return editing[id]
    return {
      title: row.title,
      description: row.description,
      detail: row.detail ?? "",
      icon_image_url: row.icon_image_url,
      featuresText: parseFeatures(row.features).join("\n"),
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Judul & pengantar section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveHeader} className="space-y-4">
            <div>
              <Label htmlFor="sec_title">Judul</Label>
              <Input
                id="sec_title"
                name="sec_title"
                defaultValue={initialSection?.title ?? ""}
                placeholder="Ekstrakurikuler"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sec_subtitle">Subjudul</Label>
              <Input
                id="sec_subtitle"
                name="sec_subtitle"
                defaultValue={initialSection?.subtitle ?? ""}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sec_lead">Pengantar (lead)</Label>
              <textarea
                id="sec_lead"
                name="sec_lead"
                defaultValue={initialSection?.lead ?? ""}
                rows={4}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit">Simpan judul section</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tambah kegiatan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Judul kegiatan</Label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Deskripsi singkat</Label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label>Detail</Label>
            <textarea
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label>Gambar / ikon</Label>
            <div className="mt-2 flex gap-4">
              <UploadInput
                getPath={(f) => `images/extracurriculars/${Date.now()}-${f.name}`}
                onSuccess={(url) => {
                  setNewImage(url)
                  toast.success("Gambar diunggah")
                }}
                onError={(msg) => toast.error(msg)}
              />
              {newImage && <img src={newImage} alt="" className="h-16 w-24 rounded object-cover" />}
            </div>
          </div>
          <div>
            <Label>Fitur (satu per baris)</Label>
            <textarea
              value={newFeatures}
              onChange={(e) => setNewFeatures(e.target.value)}
              rows={4}
              placeholder="Latihan mingguan&#10;Pembina berpengalaman"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button type="button" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah kegiatan
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold">Daftar kegiatan ({items.length})</h3>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada kegiatan. Tambahkan di atas.</p>
        ) : (
          items.map((row) => {
            const e = getEditState(row.id, row)
            return (
              <Card key={row.id}>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label>Judul</Label>
                    <Input
                      value={e.title}
                      onChange={(v) =>
                        setEditing((p) => ({
                          ...p,
                          [row.id]: { ...e, title: v.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Deskripsi singkat</Label>
                    <textarea
                      value={e.description}
                      onChange={(v) =>
                        setEditing((p) => ({
                          ...p,
                          [row.id]: { ...e, description: v.target.value },
                        }))
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <Label>Detail</Label>
                    <textarea
                      value={e.detail}
                      onChange={(v) =>
                        setEditing((p) => ({
                          ...p,
                          [row.id]: { ...e, detail: v.target.value },
                        }))
                      }
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <Label>Gambar</Label>
                    <div className="mt-2 flex gap-4">
                      <UploadInput
                        getPath={(file) => `images/extracurriculars/${Date.now()}-${file.name}`}
                        onSuccess={(url) => {
                          setEditing((prev) => {
                            const base = prev[row.id] ?? {
                              title: row.title,
                              description: row.description,
                              detail: row.detail ?? "",
                              icon_image_url: row.icon_image_url,
                              featuresText: parseFeatures(row.features).join("\n"),
                            }
                            return { ...prev, [row.id]: { ...base, icon_image_url: url } }
                          })
                          toast.success("Gambar diunggah")
                        }}
                        onError={(msg) => toast.error(msg)}
                      />
                      {(e.icon_image_url || row.icon_image_url) && (
                        <img
                          src={e.icon_image_url || row.icon_image_url!}
                          alt=""
                          className="h-16 w-24 rounded object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Fitur (satu per baris)</Label>
                    <textarea
                      value={e.featuresText}
                      onChange={(v) =>
                        setEditing((p) => ({
                          ...p,
                          [row.id]: { ...e, featuresText: v.target.value },
                        }))
                      }
                      rows={4}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => handleUpdate(row.id)}>
                      Simpan
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => handleDelete(row.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
