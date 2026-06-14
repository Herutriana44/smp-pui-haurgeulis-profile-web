"use client"

import Image from "next/image"
import { Baby, GraduationCap, Music, Users, CheckCircle } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  baby: Baby,
  graduationCap: GraduationCap,
  music: Music,
  users: Users,
}

type ProgramsData = {
  title: string
  subtitle: string
  program_unggulan: string
  programs: { title: string; description: string; icon?: string; iconImage?: string; features: string[] }[]
}

export function Programs({ data }: { data: ProgramsData | null }) {
  if (!data) return null
  const programsData = data
  return (
    <section id="program" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {programsData.title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {programsData.subtitle}
          </h2>
          <p className="text-xl md:text-2xl font-semibold uppercase tracking-wider text-primary text-balance mt-2">
            {programsData.program_unggulan}
          </p>
        </div>

        {/* Program Cards - REVISED TO FLEX FOR CENTERING */}
        <div className="flex flex-wrap justify-center gap-8">
          {programsData.programs.map((program, index) => {
            const Icon = iconMap[program.icon] || Baby
            const hasIconImage = program.iconImage && program.iconImage.trim() !== ""
            
            return (
              <div
                key={program.title}
                className="group flex w-full md:w-[calc(50%-1rem)] lg:max-w-[550px] flex-col gap-5 rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {hasIconImage ? (
                      <Image
                        src={program.iconImage}
                        alt={program.title}
                        width={56}
                        height={56}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {program.title}
                    </h3>
                  </div>
                </div>

                <p className="leading-relaxed text-muted-foreground">
                  {program.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {program.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
