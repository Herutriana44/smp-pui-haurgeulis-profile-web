import { Star, Quote } from "lucide-react"

type TestimonialsData = {
  title: string
  subtitle: string
  testimonials: { name: string; role: string; content: string; rating: number }[]
}

export function Testimonials({ data }: { data: TestimonialsData | null }) {
  if (!data) return null
  const testimonialsData = data
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {testimonialsData.title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {testimonialsData.subtitle}
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid gap-8 md:grid-cols-3 justify-items-center">
          {testimonialsData.testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative w-full flex flex-col gap-4 rounded-2xl bg-card p-8 shadow-sm"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />

              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="flex-1 leading-relaxed text-muted-foreground">
                {`"${testimonial.content}"`}
              </p>

              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
