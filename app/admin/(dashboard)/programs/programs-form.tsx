"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updatePrograms, updateProgramItems } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"

type ProgramsData = {
  title: string
  subtitle: string
  program_unggulan: string
  programs: { title: string; description: string; iconImage?: string; features: string[] }[]
}

export function ProgramsForm({ data }: { data: ProgramsData | null }) {
  const [icons, setIcons] = useState<Record<number, string>>({})

  if (!data) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    await updatePrograms({
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      program_unggulan: formData.get("program_unggulan") as string,
    })
    const items = data.programs.map((_, i) => ({
      title: formData.get(`item_title_${i}`) as string,
      description: formData.get(`item_desc_${i}`) as string,
      icon_image_url: icons[i] || data.programs[i]?.iconImage || null,
      features: (formData.get(`item_features_${i}`) as string)?.split("\n").filter(Boolean) ?? [],
    }))
    await updateProgramItems(items)
    toast.success("Program berhasil diperbarui")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Header</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Judul</Label><Input name="title" defaultValue={data.title} className="mt-1" /></div>
          <div><Label>Subjudul</Label><Input name="subtitle" defaultValue={data.subtitle} className="mt-1" /></div>
          <div><Label>Program Unggulan</Label><Input name="program_unggulan" defaultValue={data.program_unggulan} className="mt-1" /></div>
        </CardContent>
      </Card>
      {data.programs.map((p, i) => (
        <Card key={i}>
          <CardHeader><CardTitle>Program {i + 1}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Judul</Label><Input name={`item_title_${i}`} defaultValue={p.title} className="mt-1" /></div>
            <div><Label>Deskripsi</Label><textarea name={`item_desc_${i}`} defaultValue={p.description} className="mt-1 w-full min-h-[80px] rounded-md border px-3 py-2" /></div>
            <div>
              <Label>Icon</Label>
              <div className="mt-2 flex gap-4">
                <UploadInput
                  getPath={(f) => `images/programs/${Date.now()}-${f.name}`}
                  onSuccess={(url) => { setIcons((p) => ({ ...p, [i]: url })); toast.success("Gambar diunggah") }}
                  onError={(msg) => toast.error(msg)}
                />
                {(icons[i] || p.iconImage) && <img src={icons[i] || p.iconImage!} alt="" className="h-12 w-12 object-contain" />}
              </div>
            </div>
            <div>
              <Label>Fitur Program</Label>
              <textarea name={`item_features_${i}`} defaultValue={p.features?.join("\n")} className="mt-1 w-full min-h-[60px] rounded-md border px-3 py-2" placeholder="Tulis satu fitur per baris" />
              <p className="mt-1 text-xs text-muted-foreground">Satu fitur per baris</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="submit">Simpan</Button>
    </form>
  )
}
