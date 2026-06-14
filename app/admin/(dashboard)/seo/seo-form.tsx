"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateSiteSeo } from "@/app/actions"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

type SeoData = {
  id: string
  site_name: string
  short_name: string
  site_url: string
  description: string
  keywords: string[]
  title_template: string
  robots_index: boolean
  robots_follow: boolean
  google_verification: string
  open_graph_image: string
  sitemap_entries: { path: string; changeFrequency: string; priority: number }[]
} | null

const CHANGE_FREQ = [
  { id: "always", label: "Selalu" },
  { id: "hourly", label: "Per jam" },
  { id: "daily", label: "Harian" },
  { id: "weekly", label: "Mingguan" },
  { id: "monthly", label: "Bulanan" },
  { id: "yearly", label: "Tahunan" },
  { id: "never", label: "Tidak pernah" },
] as const

export function SeoForm({ data }: { data: SeoData }) {
  const [robotsIndex, setRobotsIndex] = useState(data?.robots_index ?? true)
  const [robotsFollow, setRobotsFollow] = useState(data?.robots_follow ?? true)
  const [sitemapEntries, setSitemapEntries] = useState(() => {
    const entries = data?.sitemap_entries ?? [{ path: "/", changeFrequency: "weekly", priority: 1 }]
    return Array.isArray(entries) ? entries : [{ path: "/", changeFrequency: "weekly", priority: 1 }]
  })

  function addSitemapEntry() {
    setSitemapEntries((prev) => [...prev, { path: "/", changeFrequency: "weekly", priority: 0.5 }])
  }

  function removeSitemapEntry(i: number) {
    setSitemapEntries((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateSitemapEntry(
    i: number,
    field: "path" | "changeFrequency" | "priority",
    value: string | number
  ) {
    setSitemapEntries((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const keywordsRaw = (formData.get("keywords") as string) || ""
    const keywords = keywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)

    await updateSiteSeo({
      site_name: formData.get("site_name") as string,
      short_name: formData.get("short_name") as string,
      site_url: formData.get("site_url") as string,
      description: formData.get("description") as string,
      keywords,
      title_template: formData.get("title_template") as string,
      robots_index: robotsIndex,
      robots_follow: robotsFollow,
      google_verification: formData.get("google_verification") as string,
      open_graph_image: formData.get("open_graph_image") as string,
      sitemap_entries: sitemapEntries,
    })
    toast.success("SEO & metadata berhasil disimpan")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="metadata" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metadata">Metadata Google</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
        </TabsList>

        <TabsContent value="metadata" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Situs</CardTitle>
              <CardDescription>
                Nama, URL, dan deskripsi yang muncul di hasil pencarian Google
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Nama Situs</Label>
                <Input
                  id="site_name"
                  name="site_name"
                  defaultValue={data?.site_name ?? ""}
                  placeholder="SMP PUI HAURGEULIS"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="short_name">Nama Pendek</Label>
                <Input
                  id="short_name"
                  name="short_name"
                  defaultValue={data?.short_name ?? ""}
                  placeholder="SMP PUI"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="site_url">URL Situs</Label>
                <Input
                  id="site_url"
                  name="site_url"
                  type="url"
                  defaultValue={data?.site_url ?? ""}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={data?.description ?? ""}
                  placeholder="Deskripsi singkat untuk hasil pencarian (max ~160 karakter)"
                  className="mt-1 min-h-[80px]"
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Direkomendasikan 150–160 karakter untuk tampilan optimal di Google
                </p>
              </div>
              <div>
                <Label htmlFor="keywords">Kata Kunci</Label>
                <Textarea
                  id="keywords"
                  name="keywords"
                  defaultValue={
                    Array.isArray(data?.keywords)
                      ? data.keywords.join(", ")
                      : (data?.keywords as string) ?? ""
                  }
                  placeholder="Pisah dengan koma. Contoh: SMP PUI, SMP Haurgeulis, SMP Indramayu"
                  className="mt-1 min-h-[60px]"
                />
              </div>
              <div>
                <Label htmlFor="title_template">Template Judul</Label>
                <Input
                  id="title_template"
                  name="title_template"
                  defaultValue={data?.title_template ?? ""}
                  placeholder="SMP PUI HAURGEULIS — Pendidikan Menengah di Haurgeulis"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Judul default = Nama Situs - Template Judul
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Index</CardTitle>
              <CardDescription>
                Kontrol apakah halaman diindeks dan diikuti oleh Google
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="robots_index">Index</Label>
                  <p className="text-xs text-muted-foreground">
                    Izinkan Google mengindeks halaman ini
                  </p>
                </div>
                <Switch
                  id="robots_index"
                  checked={robotsIndex}
                  onCheckedChange={setRobotsIndex}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="robots_follow">Follow</Label>
                  <p className="text-xs text-muted-foreground">
                    Izinkan Google mengikuti link di halaman
                  </p>
                </div>
                <Switch
                  id="robots_follow"
                  checked={robotsFollow}
                  onCheckedChange={setRobotsFollow}
                />
              </div>
              <div>
                <Label htmlFor="google_verification">Google Search Console Verification</Label>
                <Input
                  id="google_verification"
                  name="google_verification"
                  defaultValue={data?.google_verification ?? ""}
                  placeholder="2gmumy-6QJqokZ-eBWIYUwPBlvDJS5o-J9YfY390bjg"
                  className="mt-1 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Dapatkan di Google Search Console
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Graph</CardTitle>
              <CardDescription>
                Gambar yang ditampilkan saat link dibagikan di media sosial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="open_graph_image">URL Gambar</Label>
                <Input
                  id="open_graph_image"
                  name="open_graph_image"
                  defaultValue={data?.open_graph_image ?? ""}
                  placeholder="/images/foto2/logo_preview_rev_1.png"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entri Sitemap</CardTitle>
              <CardDescription>
                URL yang ditampilkan di sitemap.xml. Google menggunakan ini untuk mengindeks halaman.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sitemapEntries.map((entry, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-end gap-4 rounded-lg border p-4"
                >
                  <div className="flex-1 min-w-[120px]">
                    <Label>Jalur URL</Label>
                    <Input
                      value={entry.path}
                      onChange={(e) => updateSitemapEntry(i, "path", e.target.value)}
                      placeholder="/"
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Contoh: / atau /tentang</p>
                  </div>
                  <div className="w-[140px]">
                    <Label>Seberapa Sering Diupdate</Label>
                    <select
                      value={entry.changeFrequency}
                      onChange={(e) =>
                        updateSitemapEntry(i, "changeFrequency", e.target.value)
                      }
                      className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {CHANGE_FREQ.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[80px]">
                    <Label>Prioritas</Label>
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.1}
                      value={entry.priority}
                      onChange={(e) =>
                        updateSitemapEntry(i, "priority", parseFloat(e.target.value) || 0)
                      }
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSitemapEntry(i)}
                    disabled={sitemapEntries.length <= 1}
                    aria-label="Hapus entri"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addSitemapEntry}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah URL
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit">Simpan</Button>
    </form>
  )
}
