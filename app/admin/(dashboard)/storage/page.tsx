"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { HardDrive, Image as ImageIcon, FileText, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

type StorageFile = {
  path: string
  size: number
  mimetype?: string
  updated_at?: string
  publicUrl: string
}

type StorageResponse = {
  totalFiles: number
  totalSizeBytes: number
  totalSizeMB: number
  imageFiles: number
  files: StorageFile[]
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function AdminStoragePage() {
  const [data, setData] = useState<StorageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StorageFile | null>(null)
  const [deleting, setDeleting] = useState(false)

  function refetch() {
    setLoading(true)
    fetch("/api/admin/storage")
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat")
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refetch()
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch("/api/admin/storage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: deleteTarget.path }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus")
      toast.success("Gambar berhasil dihapus")
      setDeleteTarget(null)
      refetch()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus")
    } finally {
      setDeleting(false)
    }
  }

  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
  const imageFiles = data?.files.filter((f) =>
    imageExtensions.some((ext) => f.path.toLowerCase().endsWith(ext))
  ) ?? []

  if (loading) {
    return (
      <div>
        <h1 className="mb-8 font-serif text-3xl font-bold">Monitoring Storage</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-8 h-64 rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="mb-8 font-serif text-3xl font-bold">Monitoring Storage</h1>
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Monitoring Storage</h1>
      <p className="mb-6 text-muted-foreground">
        Pantau penggunaan storage Supabase dan daftar semua file yang terupload.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <HardDrive className="h-5 w-5" />
            <CardTitle className="text-base">Total File</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.totalFiles ?? 0}</p>
            <p className="text-xs text-muted-foreground">file di bucket assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5" />
            <CardTitle className="text-base">Total Ukuran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.totalSizeMB ?? 0} MB</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(data?.totalSizeBytes ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <ImageIcon className="h-5 w-5" />
            <CardTitle className="text-base">File Gambar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.imageFiles ?? 0}</p>
            <p className="text-xs text-muted-foreground">file image</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua File Gambar</CardTitle>
          <CardDescription>
            Daftar {imageFiles.length} file gambar yang terupload ke storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {imageFiles.length === 0 ? (
            <p className="text-muted-foreground">Belum ada file gambar.</p>
          ) : (
            <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {imageFiles.map((f) => (
                <div
                  key={f.path}
                  className="group relative overflow-hidden rounded-lg border bg-card p-2 transition hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                    {f.publicUrl ? (
                      <Image
                        src={f.publicUrl}
                        alt={f.path}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No preview
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => setDeleteTarget(f)}
                      aria-label="Hapus gambar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="truncate text-xs font-medium" title={f.path}>
                      {f.path.split("/").pop()}
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {formatBytes(f.size)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                <AlertDialogDescription>
                  Yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan. Pastikan
                  gambar tidak sedang digunakan di halaman website.
                  {deleteTarget && (
                    <span className="mt-2 block font-medium text-foreground">
                      {deleteTarget.path}
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete()
                  }}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Menghapus…" : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
