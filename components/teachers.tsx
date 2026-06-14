import Image from "next/image"

type TeachersData = {
  title: string
  subtitle: string
  teachers: { name: string; role: string; description: string; image: string }[]
}

export function Teachers({ data }: { data: TeachersData | null }) {
  if (!data) return null
  const teachersData = data
  return (
    <section id="guru" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {teachersData.title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {teachersData.subtitle}
          </h2>
        </div>

        {/* Teacher Cards - Menggunakan Flex untuk centering yang fleksibel */}
        <div className="flex flex-wrap justify-center gap-8">
          {teachersData.teachers.map((teacher) => (
            <div
              key={teacher.name}
              className="group flex w-full flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center shadow-sm transition-all hover:shadow-md sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-[300px]"
            >
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/10">
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {teacher.name}
                </h3>
                <p className="text-sm font-semibold text-primary">{teacher.role}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {teacher.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
