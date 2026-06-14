import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { VisiMisi } from "@/components/visi-misi"
import { Programs } from "@/components/programs"
import { Extracurriculars } from "@/components/extracurriculars"
import { Facilities } from "@/components/facilities"
import { Teachers } from "@/components/teachers"
import { Gallery } from "@/components/gallery"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { InstagramPosts } from "@/components/instagram-posts"
import {
  getHero,
  getAbout,
  getVisiMisi,
  getPrograms,
  getExtracurriculars,
  getFacilities,
  getTeachers,
  getGallery,
  getTestimonials,
  getContact,
  getNavbar,
  getFooter,
  getInstagramPosts,
} from "@/lib/data"

export default async function Page() {
  const [
    heroData,
    aboutData,
    visiMisiData,
    programsData,
    extracurricularsData,
    facilitiesData,
    teachersData,
    galleryData,
    testimonialsData,
    contactData,
    navbarData,
    footerData,
    instagramData,
  ] = await Promise.all([
    getHero(),
    getAbout(),
    getVisiMisi(),
    getPrograms(),
    getExtracurriculars(),
    getFacilities(),
    getTeachers(),
    getGallery(),
    getTestimonials(),
    getContact(),
    getNavbar(),
    getFooter(),
    getInstagramPosts(),
  ])

  return (
    <>
      <Navbar data={navbarData} />
      <main>
        <Hero data={heroData} />
        <About data={aboutData} />
        <VisiMisi data={visiMisiData} />
        <Programs data={programsData} />
        <Extracurriculars data={extracurricularsData} />
        <Facilities data={facilitiesData} />
        <Teachers data={teachersData} />
        <Gallery data={galleryData} />
        <InstagramPosts data={instagramData} />
        <Testimonials data={testimonialsData} />
        <Contact data={contactData} />
      </main>
      <Footer footerData={footerData} contactData={contactData} />
    </>
  )
}
