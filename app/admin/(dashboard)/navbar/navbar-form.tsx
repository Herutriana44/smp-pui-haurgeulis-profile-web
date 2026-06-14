"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateNavbar } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

type NavbarData = {
  brand: string
  brandImage: string
  brandImageAlt?: string
  links: { label: string; href: string }[]
  cta?: { label: string; href: string }
}

export function NavbarForm({ data }: { data: NavbarData | null }) {
  const [brandImage, setBrandImage] = useState(data?.brandImage ?? "")
  const [links, setLinks] = useState<{ label: string; href: string }[]>(
    data?.links?.length ? [...data.links] : [{ label: "", href: "" }]
  )

  function addLink() {
    setLinks((prev) => [...prev, { label: "", href: "" }])
  }

  function removeLink(i: number) {
    if (links.length <= 1) return
    setLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateLink(i: number, field: "label" | "href", value: string) {
    setLinks((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const validLinks = links.filter((l) => l.label.trim() && l.href.trim())
    await updateNavbar({
      brand: formData.get("brand") as string,
      brand_image_url: brandImage || null,
      brand_image_alt: formData.get("brandImageAlt") as string,
      links: validLinks,
      cta: {
        label: (formData.get("cta_label") as string) || "Daftar",
        href: (formData.get("cta_href") as string) || "#kontak",
      },
    })
    toast.success("Navbar berhasil diperbarui")
  }

  if (!data) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
          <CardDescription>Nama dan logo yang tampil di navbar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nama Brand</Label>
            <Input name="brand" defaultValue={data.brand} className="mt-1" placeholder="SMP PUI HAURGEULIS" />
          </div>
          <div>
            <Label>Logo</Label>
            <div className="mt-2 flex gap-4">
              <UploadInput
                getPath={(f) => `images/navbar/${Date.now()}-${f.name}`}
                onSuccess={(url) => {
                  setBrandImage(url)
                  toast.success("Gambar diunggah")
                }}
                onError={(msg) => toast.error(msg)}
              />
              {brandImage && <img src={brandImage} alt="" className="h-12 w-12 object-contain" />}
            </div>
          </div>
          <div>
            <Label>Alt Text Logo</Label>
            <Input name="brandImageAlt" defaultValue={data.brandImageAlt} className="mt-1" placeholder="Deskripsi singkat logo" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu Navigasi</CardTitle>
          <CardDescription>Tambah atau edit link menu. Contoh: Beranda → #beranda, Tentang → #tentang</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.map((link, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <div className="flex-1 min-w-[120px]">
                <Label className="text-xs">Teks Menu</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  placeholder="Contoh: Beranda"
                  className="mt-1"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label className="text-xs">Link (anchor atau URL)</Label>
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(i, "href", e.target.value)}
                  placeholder="Contoh: #beranda atau #tentang"
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(i)}
                disabled={links.length <= 1}
                aria-label="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Menu
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tombol CTA</CardTitle>
          <CardDescription>Tombol utama di navbar (misalnya Daftar)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Teks Tombol</Label>
            <Input name="cta_label" defaultValue={data.cta?.label ?? "Daftar"} className="mt-1" placeholder="Daftar" />
          </div>
          <div>
            <Label>Link Tombol</Label>
            <Input name="cta_href" defaultValue={data.cta?.href ?? "#kontak"} className="mt-1" placeholder="#kontak" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit">Simpan</Button>
    </form>
  )
}
