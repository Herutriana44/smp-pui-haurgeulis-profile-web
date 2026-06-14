import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
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
  HardDrive,
  Bot,
  Search,
  Dumbbell,
} from "lucide-react"

const sections = [
  { href: "/admin/hero", label: "Hero", icon: ImageIcon },
  { href: "/admin/about", label: "Tentang", icon: FileText },
  { href: "/admin/visi-misi", label: "Visi & Misi", icon: BookOpen },
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

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Kelola konten website dari menu di samping atau pilih section di bawah.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.href} href={section.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Edit {section.label}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
