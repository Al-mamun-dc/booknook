
import Banner from "@/components/banner"
import NewArrivals from "@/components/NewArrivals"


import { Testimonials } from "@/components/testimonials"

export default function Home() {
  return (
    <main className="flex min-h-full flex-col">
     
      <Banner/>
      <NewArrivals />
      <Testimonials />
     
    </main>
  )
}
