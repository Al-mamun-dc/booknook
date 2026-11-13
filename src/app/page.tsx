
import Banner from "@/components/banner"
import ExtraSections from "@/components/ExtraSections"
import NewArrivals from "@/components/NewArrivals"




export default function Home() {
  return (
    <main className="flex min-h-full flex-col">
     
      <Banner/>
      <NewArrivals />
      <ExtraSections/>
     
    </main>
  )
}
