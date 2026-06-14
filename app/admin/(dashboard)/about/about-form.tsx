"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateAbout } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"

type AboutData = {
  title: string
  subtitle: string
  description: string
  image: string
  paragraphs: string[]
  highlights: string[]
}

export function AboutForm({ data }: { data: AboutData | null }) {
  const [image, setImage] = useState(data?.image ?? "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const paragraphs = (formData.get("paragraphs") as string)?.split("\n").filter(Boolean) ?? []
    const highlights = (formData.get("highlights") as string)?.split("\n").filter(Boolean) ?? []
    await updateAbout({
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      description: formData.get("description") as string,
      image_url: image || null,
      paragraphs,
      highlights,
    })
    toast.success("Tentang berhasil diperbarui")
  }

  if (!data) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Gambar</CardTitle></CardHeader>
        <CardContent>
          <UploadInput
            getPath={(f) => `images/about/${Date.now()}-${f.name}`}
            onSuccess={(url) => { setImage(url); toast.success("Gambar diunggah") }}
            onError={(msg) => toast.error(msg)}
          />
          {image && <img src={image} alt="" className="mt-2 h-32 w-48 object-cover rounded" />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Konten</CardTitle>
          <CardDescription>Informasi section Tentang Kami</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Judul</Label>
            <Input name="title" defaultValue={data.title} className="mt-1" placeholder="Tentang Kami" />
          </div>
          <div>
            <Label>Subjudul</Label>
            <Input name="subtitle" defaultValue={data.subtitle} className="mt-1" placeholder="Subjudul section" />
          </div>
          <div>
            <Label>Deskripsi Utama</Label>
            <textarea name="description" defaultValue={data.description} className="mt-1 w-full min-h-[100px] rounded-md border px-3 py-2" placeholder="Deskripsi singkat tentang sekolah" />
          </div>
          <div>
            <Label>Paragraf Tambahan</Label>
            <textarea name="paragraphs" defaultValue={data.paragraphs.join("\n")} className="mt-1 w-full min-h-[80px] rounded-md border px-3 py-2" placeholder="Tulis satu paragraf per baris" />
            <p className="mt-1 text-xs text-muted-foreground">Satu paragraf per baris</p>
          </div>
          <div>
            <Label>Poin Unggulan</Label>
            <textarea name="highlights" defaultValue={data.highlights.join("\n")} className="mt-1 w-full min-h-[80px] rounded-md border px-3 py-2" placeholder="Tulis satu poin per baris" />
            <p className="mt-1 text-xs text-muted-foreground">Satu poin per baris</p>
          </div>
        </CardContent>
      </Card>
      <Button type="submit">Simpan</Button>
    </form>
  )
}
