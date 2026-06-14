"use client"

import { useState } from "react"
import Image from "next/image"
import RegistrationModal from './RegistrationModal'

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

export function Hero({ data }: { data: HeroData | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  if (!data) return null
  const heroData = data

  return (
    <>
      {/* Brosur Banner - Gambar landscape di atas hero */}
      {/* {heroData.brosurImage && (
        <div className="relative w-full overflow-hidden pt-28 lg:pt-24"> 
          <Image
            src={heroData.brosurImage}
            alt="Brosur informasi SMP PUI HAURGEULIS"
            width={1920}
            height={640}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )} */}
    <section id="beranda" className="relative min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:py-24">
        {/* Text Content */}
        <div className="flex flex-1 flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 self-center rounded-full bg-primary/10 px-4 py-1.5 lg:self-start">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">
              Pendaftaran Dibuka
            </span>
          </div>

          <h1 className="font-serif text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            {heroData.title}
          </h1>
          <p className="font-serif text-lg font-semibold text-primary md:text-xl">
            {heroData.subtitle}
          </p>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
            {heroData.description}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-primary px-8 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {heroData.cta_primary}
            </button>
            <a 
              href="#tentang"
              className="rounded-full border border-primary/30 bg-transparent px-8 py-2.5 text-base font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              {heroData.cta_secondary}
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-1">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src={heroData.image}
              alt="SMP PUI HAURGEULIS — suasana kegiatan sekolah"
              width={640}
              height={480}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-accent/20" />
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/20" />
        </div>
      </div>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Stats Bar */}
      {/* <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-card p-6 shadow-lg md:grid-cols-4 md:gap-8 md:p-8">
          {heroData.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="font-serif text-3xl font-extrabold text-primary md:text-4xl">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </section>
    </>
  )
}
