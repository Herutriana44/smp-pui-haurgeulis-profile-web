"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type UploadInputProps = {
  getPath: (file: File) => string
  onSuccess: (url: string) => void
  onError?: (message: string) => void
  accept?: string
  className?: string
}

export function UploadInput({ getPath, onSuccess, onError, accept = "image/*", className }: UploadInputProps) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    const path = getPath(file)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("path", path)

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (ev) => {
        if (ev.lengthComputable) {
          const pct = Math.round((ev.loaded / ev.total) * 100)
          setProgress(pct)
        } else {
          setProgress(50)
        }
      })

      xhr.addEventListener("load", () => {
        setUploading(false)
        setProgress(100)
        if (inputRef.current) inputRef.current.value = ""
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            if (data.url) {
              onSuccess(data.url)
            } else {
              onError?.("Respons tidak valid")
            }
          } catch {
            onError?.("Gagal memproses respons")
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText)
            onError?.(data.error || "Gagal mengunggah")
          } catch {
            onError?.(`Gagal mengunggah (${xhr.status})`)
          }
        }
        resolve()
      })

      xhr.addEventListener("error", () => {
        setUploading(false)
        setProgress(0)
        if (inputRef.current) inputRef.current.value = ""
        onError?.("Koneksi gagal")
        resolve()
      })

      xhr.addEventListener("abort", () => {
        setUploading(false)
        setProgress(0)
        if (inputRef.current) inputRef.current.value = ""
        resolve()
      })

      xhr.open("POST", "/api/upload")
      xhr.send(formData)
    })
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
      />
      {uploading && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </div>
      )}
    </div>
  )
}
