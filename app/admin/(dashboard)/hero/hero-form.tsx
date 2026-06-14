"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateHero, updateHeroStats } from "@/app/actions"
import { UploadInput } from "@/components/admin/upload-input"
import { toast } from "sonner"

type HeroData = {
  brosurImage?: string
  title: string
  subtitle: string
  description: string
  cta_primary: string
  cta_secondary: string
  image: string
  stats?: { value: string; label: string }[]
}

export function HeroForm({ data }: { data: HeroData | null }) {
  const [brosurImage, setBrosurImage] = useState(data?.brosurImage ?? "")
  const [image, setImage] = useState(data?.image ?? "")
  const [stats, setStats] = useState(data?.stats ?? [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    await updateHero({
      brosur_image_url: brosurImage || null,
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      description: formData.get("description") as string,
      cta_primary: formData.get("cta_primary") as string,
      cta_secondary: formData.get("cta_secondary") as string,
      image_url: image || null,
    })
    const statsData = stats.filter((s) => s.value || s.label)
    if (statsData.length) {
      await updateHeroStats(statsData)
    }
    toast.success("Hero berhasil diperbarui")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gambar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Brosur Image</Label>
            <div className="mt-2 flex gap-4">
              <UploadInput
                getPath={(f) => `images/hero/${Date.now()}-${f.name}`}
                onSuccess={(url) => {
                  setBrosurImage(url)
                  toast.success("Gambar berhasil diunggah")
                }}
                onError={(msg) => toast.error(msg)}
              />
              {brosurImage && (
                <img src={brosurImage} alt="Brosur" className="h-20 w-32 object-cover rounded" />
              )}
            </div>
          </div>
          <div>
            <Label>Main Image</Label>
            <div className="mt-2 flex gap-4">
              <UploadInput
                getPath={(f) => `images/hero/${Date.now()}-${f.name}`}
                onSuccess={(url) => {
                  setImage(url)
                  toast.success("Gambar berhasil diunggah")
                }}
                onError={(msg) => toast.error(msg)}
              />
              {image && (
                <img src={image} alt="Hero" className="h-20 w-32 object-cover rounded" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input id="title" name="title" defaultValue={data?.title} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="subtitle">Subjudul</Label>
            <Input id="subtitle" name="subtitle" defaultValue={data?.subtitle} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={data?.description}
              className="mt-1 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cta_primary">CTA Primary</Label>
              <Input id="cta_primary" name="cta_primary" defaultValue={data?.cta_primary} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="cta_secondary">CTA Secondary</Label>
              <Input id="cta_secondary" name="cta_secondary" defaultValue={data?.cta_secondary} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats (opsional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex gap-4">
              <Input
                placeholder="Value"
                value={stat.value}
                onChange={(e) => {
                  const next = [...stats]
                  next[i] = { ...next[i], value: e.target.value }
                  setStats(next)
                }}
              />
              <Input
                placeholder="Label"
                value={stat.label}
                onChange={(e) => {
                  const next = [...stats]
                  next[i] = { ...next[i], label: e.target.value }
                  setStats(next)
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit">Simpan</Button>
    </form>
  )
}
