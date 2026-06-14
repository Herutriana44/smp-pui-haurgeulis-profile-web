import { getNavbar } from "@/lib/data"
import { NavbarForm } from "./navbar-form"

export default async function AdminNavbarPage() {
  const data = await getNavbar()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Navbar</h1>
      <NavbarForm data={data} />
    </div>
  )
}
