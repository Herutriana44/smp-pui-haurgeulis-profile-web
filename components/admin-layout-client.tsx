"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  BookOpen,
  Building2,
  GalleryVertical,
  MessageSquare,
  Mail,
  Menu,
  FileText,
  Instagram,
  LogOut,
  Bot,
  HardDrive,
  Search,
  Dumbbell,
} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Target(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: ImageIcon },
  { href: "/admin/about", label: "Tentang", icon: FileText },
  { href: "/admin/visi-misi", label: "Visi & Misi", icon: Target },
  { href: "/admin/programs", label: "Program", icon: BookOpen },
  { href: "/admin/extracurriculars", label: "Ekstrakurikuler", icon: Dumbbell },
  { href: "/admin/facilities", label: "Fasilitas", icon: Building2 },
  { href: "/admin/teachers", label: "Guru", icon: Users },
  { href: "/admin/gallery", label: "Galeri", icon: GalleryVertical },
  { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquare },
  { href: "/admin/contact", label: "Kontak", icon: Mail },
  { href: "/admin/navbar", label: "Navbar", icon: Menu },
  { href: "/admin/footer", label: "Footer", icon: FileText },
  { href: "/admin/instagram", label: "Instagram", icon: Instagram },
  { href: "/admin/chatbot", label: "Chatbot", icon: Bot },
  { href: "/admin/storage", label: "Storage", icon: HardDrive },
  { href: "/admin/seo", label: "SEO", icon: Search },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="mb-6">
        <Link href="/admin" className="font-serif text-xl font-bold" onClick={onNavigate}>
          Admin Panel
        </Link>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-6">
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Keluar
          </button>
        </form>
      </div>
    </>
  )
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar - hidden on mobile */}
      <aside
        className={cn(
          "hidden w-64 shrink-0 flex-col border-r bg-card p-4 md:flex",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar - Sheet overlay */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 max-w-[85vw] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex h-full flex-col p-4">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header with hamburger */}
        <header className="sticky top-0 z-40 flex shrink-0 items-center gap-2 border-b bg-card px-4 py-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/admin" className="font-serif text-lg font-bold truncate">
            Admin Panel
          </Link>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
