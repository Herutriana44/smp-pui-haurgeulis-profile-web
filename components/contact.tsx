import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type ContactData = {
  title: string
  subtitle: string
  description: string
  address: string
  phone: string
  whatsapp: string
  email: string
  hours: string
  social: Record<string, string>
  map_embed: string
}

export function Contact({ data }: { data: ContactData | null }) {
  if (!data) return null
  const contactData = data
  return (
    <section id="kontak" className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {contactData.title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            {contactData.subtitle}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {contactData.description}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-2xl bg-card p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Alamat</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {contactData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Telepon</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{contactData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">WhatsApp</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{contactData.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{contactData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Jam Operasional</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{contactData.hours}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a
                href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat via WhatsApp
              </a>
            </Button>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
            <iframe
              src={contactData.map_embed}
              width="100%"
              height="100%"
              style={{ minHeight: "400px", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi SMP PUI HAURGEULIS"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
