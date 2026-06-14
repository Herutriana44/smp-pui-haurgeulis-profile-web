"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type GalleryData = {
  title: string
  subtitle: string
  images: { src: string; alt: string; caption: string }[]
}

const ITEMS_PER_ROW = 3
const ROWS_FOR_GRID = 3

export function Gallery({ data }: { data: GalleryData | null }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!data) return null
  const galleryData = data

  const useSlider = galleryData.images.length > ITEMS_PER_ROW * ROWS_FOR_GRID

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <section id="galeri" className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {galleryData.title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {galleryData.subtitle}
          </h2>
        </div>

        {/* Gallery: Grid (≤9 items) atau Horizontal Slider (>9 items) */}
        <div className="relative">
          {useSlider && (
            <>
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
            </>
          )}
          <div
            ref={useSlider ? scrollRef : undefined}
            className={
              useSlider
                ? "flex gap-4 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-thin [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2"
                : "flex flex-wrap justify-center gap-4"
            }
            style={useSlider ? { scrollSnapType: "x mandatory" } : undefined}
          >
            {galleryData.images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setSelectedImage(index)}
                className={
                  useSlider
                    ? "group relative h-64 min-w-[calc(33.333%-0.5rem)] max-w-[400px] shrink-0 overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:min-w-[calc(50%-0.5rem)] lg:min-w-[calc(33.333%-0.75rem)]"
                    : "group relative h-64 w-full overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] max-w-[400px]"
                }
                style={useSlider ? { scrollSnapAlign: "start" } : undefined}
                aria-label={`Lihat foto: ${image.caption}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-foreground/0 p-4 transition-colors group-hover:bg-foreground/40">
                  <span className="translate-y-4 text-sm font-semibold text-primary-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    {image.caption}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-6 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau gambar"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 rounded-full bg-card p-2 text-foreground shadow-lg hover:bg-secondary transition-transform hover:scale-110"
            aria-label="Tutup"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[80vh] max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryData.images[selectedImage].src}
              alt={galleryData.images[selectedImage].alt}
              width={1024}
              height={768}
              className="h-auto max-h-[80vh] w-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 p-4">
              <p className="text-center text-sm font-semibold text-primary-foreground">
                {galleryData.images[selectedImage].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
