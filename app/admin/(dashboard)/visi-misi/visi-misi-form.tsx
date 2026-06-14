"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateVisiMisi, updateVisiMisiValues } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"

type VisiMisiData = {
  title: string
  iconImage?: string
  subtitle: string
  visi: { title: string; content: string }
  misi: { title: string; items: string[] }
  values: { title: string; description: string; iconImage?: string }[]
}

export function VisiMisiForm({ data }: { data: VisiMisiData | null }) {
  const [iconImage, setIconImage] = useState(data?.iconImage ?? "")
  const [valueImages, setValueImages] = useState<Record<number, string>>({})

  if (!data) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const misiItems = (formData.get("misi_items") as string)?.split("\n").filter(Boolean) ?? []
    await updateVisiMisi({
      title: formData.get("title") as string,
      icon_image_url: iconImage || null,
      subtitle: formData.get("subtitle") as string,
      visi_title: formData.get("visi_title") as string,
      visi_content: formData.get("visi_content") as string,
      misi_title: formData.get("misi_title") as string,
      misi_items: misiItems,
    })
    const values = data.values.map((v, i) => ({
      title: formData.get(`value_title_${i}`) as string,
      description: formData.get(`value_desc_${i}`) as string,
      icon_image_url: valueImages[i] || v.iconImage || null,
    }))
    await updateVisiMisiValues(values)
    toast.success("Visi & Misi berhasil diperbarui")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Header</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Judul</Label><Input name="title" defaultValue={data.title} className="mt-1" /></div>
          <div><Label>Subjudul</Label><Input name="subtitle" defaultValue={data.subtitle} className="mt-1" /></div>
          <div>
            <Label>Icon</Label>
            <div className="mt-2 flex gap-4">
              <UploadInput
                getPath={(f) => `images/visi-misi/${Date.now()}-${f.name}`}
                onSuccess={(url) => { setIconImage(url); toast.success("Gambar diunggah") }}
                onError={(msg) => toast.error(msg)}
              />
              {iconImage && <img src={iconImage} alt="" className="h-12 w-12 object-contain" />}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Visi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Judul Visi</Label><Input name="visi_title" defaultValue={data.visi.title} className="mt-1" /></div>
          <div><Label>Konten Visi</Label><textarea name="visi_content" defaultValue={data.visi.content} className="mt-1 w-full min-h-[80px] rounded-md border px-3 py-2" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Misi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Judul Misi</Label><Input name="misi_title" defaultValue={data.misi.title} className="mt-1" /></div>
          <div>
            <Label>Daftar Misi</Label>
            <textarea name="misi_items" defaultValue={data.misi.items?.join("\n")} className="mt-1 w-full min-h-[120px] rounded-md border px-3 py-2" placeholder="Tulis satu poin misi per baris" />
            <p className="mt-1 text-xs text-muted-foreground">Satu poin misi per baris</p>
          </div>
        </CardContent>
      </Card>
      {data.values.map((v, i) => (
        <Card key={i}>
          <CardHeader><CardTitle>Nilai {i + 1}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Judul</Label><Input name={`value_title_${i}`} defaultValue={v.title} className="mt-1" /></div>
            <div><Label>Deskripsi</Label><textarea name={`value_desc_${i}`} defaultValue={v.description} className="mt-1 w-full min-h-[60px] rounded-md border px-3 py-2" /></div>
            <div>
              <Label>Gambar</Label>
              <div className="mt-2 flex gap-4">
                <UploadInput
                  getPath={(f) => `images/visi-misi/values/${Date.now()}-${f.name}`}
                  onSuccess={(url) => { setValueImages((p) => ({ ...p, [i]: url })); toast.success("Gambar diunggah") }}
                  onError={(msg) => toast.error(msg)}
                />
                {(valueImages[i] || v.iconImage) && <img src={valueImages[i] || v.iconImage!} alt="" className="h-24 w-32 object-cover rounded" />}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="submit">Simpan</Button>
    </form>
  )
}
