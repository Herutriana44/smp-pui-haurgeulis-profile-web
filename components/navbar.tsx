"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import RegistrationModal from './RegistrationModal';

type NavbarData = {
  brand: string
  brandImage: string
  brandImageAlt?: string
  links: { label: string; href: string }[]
  cta?: { label: string; href: string }
}

export function Navbar({ data }: { data: NavbarData | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!data) return null
  const navbarData = data

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#beranda" className="flex items-center gap-2">
            <Image src={navbarData.brandImage} alt={navbarData.brandImageAlt} width={40} height={40} />
            <span className="font-serif text-xl font-bold text-foreground">
              {navbarData.brand}
            </span>
          </a>
  
          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
           {navbarData.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
  
          <div className="hidden lg:block">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="rounded-full bg-primary px-8 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Daftar
            </button>
          </div>
  
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            className="lg:hidden rounded-lg p-2 text-foreground hover:bg-secondary"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
  
        {/* Mobile Nav */}
        {isOpen && (
          <div className="border-t border-border bg-card px-6 py-4 lg:hidden max-h-[calc(100vh-70px)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navbarData.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsModalOpen(true)
                  setIsOpen(false)
                }}
                className="mt-3 w-full rounded-full bg-primary px-8 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Daftar
              </button>
            </div>
          </div>
        )}
      </header>
      <RegistrationModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            />
    </>
  )
}
