"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateFooter } from "@/app/actions"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

type FooterData = {
  brand: string
  description: string
  quick_links: { label: string; href: string }[]
  programs: { label: string; href: string }[]
  copyright: string
}

export function FooterForm({ data }: { data: FooterData | null }) {
  const [quickLinks, setQuickLinks] = useState<{ label: string; href: string }[]>(
    data?.quick_links?.length ? [...data.quick_links] : [{ label: "", href: "" }]
  )
  const [programs, setPrograms] = useState<{ label: string; href: string }[]>(
    data?.programs?.length ? [...data.programs] : [{ label: "", href: "" }]
  )

  function addQuickLink() {
    setQuickLinks((prev) => [...prev, { label: "", href: "" }])
  }

  function removeQuickLink(i: number) {
    if (quickLinks.length <= 1) return
    setQuickLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateQuickLink(i: number, field: "label" | "href", value: string) {
    setQuickLinks((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  function addProgram() {
    setPrograms((prev) => [...prev, { label: "", href: "" }])
  }

  function removeProgram(i: number) {
    if (programs.length <= 1) return
    setPrograms((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateProgram(i: number, field: "label" | "href", value: string) {
    setPrograms((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const validQuickLinks = quickLinks.filter((l) => l.label.trim() && l.href.trim())
    const validPrograms = programs.filter((l) => l.label.trim() && l.href.trim())
    await updateFooter({
      brand: formData.get("brand") as string,
      description: formData.get("description") as string,
      quick_links: validQuickLinks,
      programs: validPrograms,
      copyright: formData.get("copyright") as string,
    })
    toast.success("Footer berhasil diperbarui")
  }

  if (!data) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Konten Utama</CardTitle>
          <CardDescription>Informasi brand dan copyright di footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nama Brand</Label>
            <Input name="brand" defaultValue={data.brand} className="mt-1" placeholder="SMP PUI HAURGEULIS" />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <textarea
              name="description"
              defaultValue={data.description}
              className="mt-1 w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2"
              placeholder="Deskripsi singkat sekolah"
            />
          </div>
          <div>
            <Label>Copyright</Label>
            <Input name="copyright" defaultValue={data.copyright} className="mt-1" placeholder="© 2024 Nama Sekolah" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Link cepat di footer. Contoh: Beranda → #beranda, Kontak → #kontak</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickLinks.map((link, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <div className="flex-1 min-w-[120px]">
                <Label className="text-xs">Teks</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateQuickLink(i, "label", e.target.value)}
                  placeholder="Contoh: Beranda"
                  className="mt-1"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label className="text-xs">Link</Label>
                <Input
                  value={link.href}
                  onChange={(e) => updateQuickLink(i, "href", e.target.value)}
                  placeholder="Contoh: #beranda"
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeQuickLink(i)}
                disabled={quickLinks.length <= 1}
                aria-label="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addQuickLink}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program</CardTitle>
          <CardDescription>Daftar program yang ditampilkan di footer. Contoh: Program Unggulan → #program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {programs.map((link, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <div className="flex-1 min-w-[120px]">
                <Label className="text-xs">Nama Program</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateProgram(i, "label", e.target.value)}
                  placeholder="Contoh: Program Unggulan"
                  className="mt-1"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label className="text-xs">Link</Label>
                <Input
                  value={link.href}
                  onChange={(e) => updateProgram(i, "href", e.target.value)}
                  placeholder="Contoh: #program"
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProgram(i)}
                disabled={programs.length <= 1}
                aria-label="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addProgram}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Program
          </Button>
        </CardContent>
      </Card>

      <Button type="submit">Simpan</Button>
    </form>
  )
}
