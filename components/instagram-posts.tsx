"use client"

import { useEffect, useState, useRef } from "react"
import Script from "next/script"
import { ChevronLeft, ChevronRight } from "lucide-react"

type InstagramData = {
  title?: string
  subtitle?: string
  post: string[]
}

export function InstagramPosts({ data }: { data: InstagramData | null }) {
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== "undefined" && (window as { instgrm?: { Embeds: { process: () => void } } }).instgrm) {
      ;(window as { instgrm?: { Embeds: { process: () => void } } }).instgrm!.Embeds.process()
    }
  }, [mounted])

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (!data) return null

  return (
    <section id="instagram" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {data.title || "Media Sosial"}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {data.subtitle || "Ikuti Kegiatan Kami di Instagram"}
          </h2>
        </div>

        {/* Instagram Cards - Horizontal slider, 3 items visible */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg transition hover:bg-background"
            aria-label="Geser kiri"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg transition hover:bg-background"
            aria-label="Geser kanan"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-thin [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {data.post.map((embedCode, index) => (
              <div
                key={index}
                className="min-w-[calc(50%-0.75rem)] shrink-0 md:min-w-[calc(33.333%-1rem)]"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm min-h-[400px]">
                  {mounted && (
                    <div
                      className="w-full overflow-hidden rounded-2xl"
                      dangerouslySetInnerHTML={{ __html: embedCode }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Script Instagram Embed.js - load setelah mount agar embed diproses */}
      {mounted && (
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
          onLoad={() => {
            if ((window as { instgrm?: { Embeds: { process: () => void } } }).instgrm) {
              ;(window as { instgrm?: { Embeds: { process: () => void } } }).instgrm!.Embeds.process()
            }
          }}
        />
      )}
    </section>
  )
}
