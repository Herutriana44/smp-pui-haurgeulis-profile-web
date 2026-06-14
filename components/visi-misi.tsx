"use client"

import Image from "next/image"
import { useState } from "react"
import { Eye, Target } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type VisiMisiData = {
  title: string
  iconImage?: string
  subtitle: string
  visi: { title: string; content: string }
  misi: { title: string; items: string[] }
  values: { title: string; description: string; iconImage?: string }[]
}

type ModalState =
  | null
  | { kind: "visi" }
  | { kind: "misi" }
  | { kind: "value"; value: VisiMisiData["values"][number] }

export function VisiMisi({ data }: { data: VisiMisiData | null }) {
  const [modal, setModal] = useState<ModalState>(null)
  if (!data) return null
  const visiMisiData = data
  const hasIconImage = visiMisiData.iconImage && visiMisiData.iconImage.trim() !== ""

  const visiLines = visiMisiData.visi.content.split("\n").filter((l) => l.trim() !== "")
  const visiPreviewLine = visiLines[0] ?? ""
  const visiHasMore = visiLines.length > 1

  return (
    <section id="visi-misi" className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {visiMisiData.title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {visiMisiData.subtitle}
          </h2>
        </div>

        {/* Visi & Misi Cards */}
        <div className="mb-16 flex flex-wrap justify-center gap-8">
          {/* Visi Card */}
          <button
            type="button"
            onClick={() => setModal({ kind: "visi" })}
            className="flex w-full cursor-pointer flex-col gap-4 rounded-2xl bg-card p-8 text-left shadow-sm outline-none ring-offset-background transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring md:w-[calc(50%-1rem)] lg:max-w-[550px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
                {hasIconImage ? (
                  <Image
                    src={visiMisiData.iconImage!}
                    alt="Logo Visi"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <Eye className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {visiMisiData.visi.title}
              </h3>
            </div>

            <div className="font-serif text-xl text-foreground md:text-2xl">
              <span className="text-3xl font-black text-primary md:text-4xl">
                {visiPreviewLine.slice(0, 1)}
              </span>
              <span className="line-clamp-3">{visiPreviewLine.slice(1)}</span>
              {visiHasMore ? (
                <span className="text-muted-foreground"> …</span>
              ) : null}
            </div>
            <p className="text-sm font-medium text-primary">Klik untuk detail visi</p>
          </button>

          {/* Misi Card */}
          <button
            type="button"
            onClick={() => setModal({ kind: "misi" })}
            className="flex w-full cursor-pointer flex-col gap-4 rounded-2xl bg-card p-8 text-left shadow-sm outline-none ring-offset-background transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring md:w-[calc(50%-1rem)] lg:max-w-[550px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/20">
                {hasIconImage ? (
                  <Image
                    src={visiMisiData.iconImage!}
                    alt="Logo Misi"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <Target className="h-6 w-6 text-accent" />
                )}
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {visiMisiData.misi.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {visiMisiData.misi.items.length} poin misi sekolah
            </p>
            <ul className="flex flex-col gap-2">
              {visiMisiData.misi.items.slice(0, 2).map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="line-clamp-2 leading-relaxed text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            {visiMisiData.misi.items.length > 2 ? (
              <p className="text-sm text-muted-foreground">… dan poin lainnya</p>
            ) : null}
            <p className="text-sm font-medium text-primary">Klik untuk detail misi</p>
          </button>
        </div>

        {/* Values - Image Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {visiMisiData.values.map((value) => {
            const hasValueImage = value.iconImage && value.iconImage.trim() !== ""
            return (
              <button
                key={value.title}
                type="button"
                onClick={() => setModal({ kind: "value", value })}
                className="group flex w-full max-w-[320px] flex-col overflow-hidden rounded-2xl bg-card text-left shadow-sm outline-none ring-offset-background transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.25rem)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {hasValueImage ? (
                    <Image
                      src={value.iconImage!}
                      alt={value.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 p-5 text-center">
                  <h4 className="font-serif text-lg font-bold text-foreground">{value.title}</h4>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                  <span className="text-sm font-medium text-primary">Klik untuk detail</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Dialog open={modal !== null} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent
          className={cn(
            "max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-lg",
            modal?.kind === "value" && "sm:max-w-md"
          )}
        >
          {modal?.kind === "visi" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{visiMisiData.visi.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                {visiMisiData.visi.content.split("\n").map((line, index) => (
                  <div key={index} className="font-serif text-2xl text-foreground md:text-3xl">
                    <span className="mr-1 text-4xl font-black text-primary">{line.slice(0, 1)}</span>
                    <span>{line.slice(1)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {modal?.kind === "misi" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{visiMisiData.misi.title}</DialogTitle>
              </DialogHeader>
              <ul className="flex flex-col gap-3 pt-2">
                {visiMisiData.misi.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {modal?.kind === "value" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">{modal.value.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                {modal.value.iconImage && modal.value.iconImage.trim() !== "" ? (
                  <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={modal.value.iconImage}
                      alt={modal.value.title}
                      fill
                      sizes="(max-width: 448px) 100vw, 448px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <p className="text-sm leading-relaxed text-muted-foreground">{modal.value.description}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
