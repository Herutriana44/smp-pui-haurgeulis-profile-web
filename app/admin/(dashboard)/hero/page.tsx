import { getHero } from "@/lib/data"
import { HeroForm } from "./hero-form"

export default async function AdminHeroPage() {
  const data = await getHero()
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Hero</h1>
      <HeroForm data={data} />
    </div>
  )
}
