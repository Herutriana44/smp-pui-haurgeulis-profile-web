"use client"

import Image from "next/image"
import { CheckCircle } from "lucide-react"

type Item = {
  title: string
  description: string
  detail?: string
  iconImage?: string
  features: string[]
}

type ExtracurricularsData = {
  title: string
  subtitle: string
  lead: string
  items: Item[]
}

export function Extracurriculars({ data }: { data: ExtracurricularsData | null }) {
  if (!data) return null
  const d = data
  return (
    <section id="ekstrakurikuler" className="scroll-mt-20 bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{d.title}</p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {d.subtitle}
          </h2>
          <p className="mt-4 text-left text-base leading-relaxed text-muted-foreground sm:text-center">
            {d.lead}
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {d.items.map((item) => {
            const hasIcon = item.iconImage && item.iconImage.trim() !== ""
            return (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
              >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:gap-8 md:p-8">
                  {hasIcon ? (
                    <div className="relative mx-auto h-28 w-full shrink-0 overflow-hidden rounded-xl bg-primary/5 md:mx-0 md:h-32 md:w-40">
                      <Image
                        src={item.iconImage!}
                        alt={`SMP PUI HAURGEULIS — ${item.title}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-foreground md:text-2xl">{item.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                    {item.detail ? (
                      <p className="border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-foreground/90">
                        {item.detail}
                      </p>
                    ) : null}
                    <div className="grid gap-2 pt-2 sm:grid-cols-2">
                      {item.features.map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
