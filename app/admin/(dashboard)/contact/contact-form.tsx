"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateContact } from "@/app/actions"
import { toast } from "sonner"

type ContactData = {
  title: string
  subtitle: string
  description: string
  address: string
  phone: string
  whatsapp: string
  email: string
  hours: string
  social: Record<string, string>
  map_embed: string
}

export function ContactForm({ data }: { data: ContactData | null }) {
  if (!data) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    await updateContact({
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      whatsapp: formData.get("whatsapp") as string,
      email: formData.get("email") as string,
      hours: formData.get("hours") as string,
      map_embed: formData.get("map_embed") as string,
      social: {
        instagram: formData.get("social_instagram") as string,
        facebook: formData.get("social_facebook") as string,
        youtube: formData.get("social_youtube") as string,
        tiktok: formData.get("social_tiktok") as string,
      },
    })
    toast.success("Kontak berhasil diperbarui")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Konten</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Judul</Label><Input name="title" defaultValue={data.title} className="mt-1" /></div>
          <div><Label>Subjudul</Label><Input name="subtitle" defaultValue={data.subtitle} className="mt-1" /></div>
          <div><Label>Deskripsi</Label><textarea name="description" defaultValue={data.description} className="mt-1 w-full min-h-[60px] rounded-md border px-3 py-2" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Info Kontak</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Alamat</Label><Input name="address" defaultValue={data.address} className="mt-1" /></div>
          <div><Label>Telepon</Label><Input name="phone" defaultValue={data.phone} className="mt-1" /></div>
          <div><Label>WhatsApp</Label><Input name="whatsapp" defaultValue={data.whatsapp} className="mt-1" /></div>
          <div><Label>Email</Label><Input name="email" type="email" defaultValue={data.email} className="mt-1" /></div>
          <div><Label>Jam Operasional</Label><Input name="hours" defaultValue={data.hours} className="mt-1" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Instagram</Label><Input name="social_instagram" defaultValue={data.social?.instagram} className="mt-1" /></div>
          <div><Label>Facebook</Label><Input name="social_facebook" defaultValue={data.social?.facebook} className="mt-1" /></div>
          <div><Label>YouTube</Label><Input name="social_youtube" defaultValue={data.social?.youtube} className="mt-1" /></div>
          <div><Label>TikTok</Label><Input name="social_tiktok" defaultValue={data.social?.tiktok} className="mt-1" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Peta (Google Maps)</CardTitle>
          <CardDescription>Tempel kode embed dari Google Maps. Buka Google Maps → Share → Embed a map → Copy HTML</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea name="map_embed" defaultValue={data.map_embed} className="w-full min-h-[80px] rounded-md border px-3 py-2 font-mono text-sm" placeholder='<iframe src="..." ...></iframe>' />
        </CardContent>
      </Card>
      <Button type="submit">Simpan</Button>
    </form>
  )
}
