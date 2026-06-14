import Image from "next/image"
import { CheckCircle } from "lucide-react"

type AboutData = {
  title: string
  subtitle: string
  description: string
  image: string
  paragraphs: string[]
  highlights: string[]
}

export function About({ data }: { data: AboutData | null }) {
  if (!data) return null
  const aboutData = data
  return (
    <section id="tentang" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          {/* Image */}
          <div className="relative flex-1">
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src={aboutData.image}
                alt="Kegiatan pembelajaran SMP PUI HAURGEULIS"
                width={600}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>
            {/* <div className="absolute -bottom-6 -right-6 flex h-28 w-28 flex-col items-center justify-center rounded-2xl bg-primary shadow-lg">
              <span className="font-serif text-2xl font-extrabold text-primary-foreground">15+</span>
              <span className="text-xs font-medium text-primary-foreground/80">Tahun</span>
            </div> */}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {aboutData.title}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
                {aboutData.subtitle}
              </h2>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {aboutData.description}
            </p>

            {aboutData.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {aboutData.highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
