type FooterData = {
  brand: string
  description: string
  quick_links: { label: string; href: string }[]
  programs: { label: string; href: string }[]
  copyright: string
}

type ContactData = {
  phone: string
  email: string
  hours: string
  social: Record<string, string>
}

export function Footer({ footerData, contactData }: { footerData: FooterData | null; contactData: ContactData | null }) {
  if (!footerData || !contactData) return null
  return (
    <footer className="bg-foreground py-16 text-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-bold text-primary-foreground">CB</span>
              </div>
              <span className="font-serif text-xl font-bold">{footerData.brand}</span>
            </div>
            <p className="text-sm leading-relaxed text-background/70">
              {footerData.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={contactData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href={contactData.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={contactData.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href={contactData.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Tiktok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.048-.48.084-.722.114-.24.03-.48.046-.72.046-.298 0-.562-.04-.793-.12-.23-.076-.439-.19-.626-.34-.188-.15-.349-.343-.482-.578H8.084c-.133.235-.295.428-.482.578-.188.15-.39.273-.609.375-.218.09-.45.146-.703.165v-.045c.007-.175.018-.35.032-.525.01-.121.023-.245.039-.37.016-.112.035-.21.057-.288.023-.085.053-.148.09-.192.036-.043.091-.08.166-.11A11.647 11.647 0 0012 13.891c.086 0 .167.002.243.006.075.004.13.023.165.057.035.035.06.082.077.139.017.058.026.125.026.201v.716c-.017.059-.039.113-.068.16zM12 10.334c-1.069 0-1.934.866-1.934 1.935s.865 1.935 1.934 1.935 1.934-.866 1.934-1.935-.865-1.935-1.934-1.935zm7.875.225h-4.928v3.265c0 .307-.251.556-.562.556-.306 0-.562-.25-.562-.556v-3.265H7.207c-.305 0-.562-.25-.562-.56s.257-.556.562-.556h4.927v-3.265c0-.31.256-.556.562-.556.31 0 .562.25.562.556v3.265h3.263c.305 0 .562.25.562.56s-.257.556-.562.556z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-bold">Tautan Cepat</h4>
            <nav className="flex flex-col gap-2">
              {footerData.quick_links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-background/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Programs */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-bold">Program</h4>
            <nav className="flex flex-col gap-2">
              {footerData.programs.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-background/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-bold">Kontak</h4>
            <div className="flex flex-col gap-2 text-sm text-background/70">
              <p>{contactData.phone}</p>
              <p>{contactData.email}</p>
              <p>{contactData.hours}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-background/10 pt-8 text-center">
          <p className="text-sm text-background/50">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
