import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayoutClient } from "@/components/admin-layout-client"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
