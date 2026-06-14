import { getPrograms } from "@/lib/data"
import { ProgramsForm } from "./programs-form"

export default async function AdminProgramsPage() {
  const data = await getPrograms()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Program</h1>
      <ProgramsForm data={data} />
    </div>
  )
}
