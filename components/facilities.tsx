import Image from "next/image"

type FacilitiesData = {
  title: string
  subtitle: string
  facilities: { title: string; description: string; image: string }[]
}

export function Facilities({ data }: { data: FacilitiesData | null }) {
  if (!data) return null
  const facilitiesData = data

  return (
    <section id="fasilitas" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {facilitiesData.title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {facilitiesData.subtitle}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {facilitiesData.facilities.map((facility) => (
            <div
              key={facility.title}
              className="group flex w-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-md sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[360px]"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2 p-6">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {facility.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
