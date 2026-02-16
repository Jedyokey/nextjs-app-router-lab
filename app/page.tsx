import { Suspense } from "react"
import HeroSection from "@/components/landing-page/hero-section";
import FeaturedProducts from "@/components/landing-page/featured-products"
import RecentlyLaunchedProducts from "@/components/landing-page/recently-launched-products"
import { LoadSpinner } from "@/components/ui/load-spinner"

export default function Home() {
  return (
    <div>
      <HeroSection />

      <FeaturedProducts />

      <Suspense 
        fallback={<LoadSpinner spinnerText="Loading Recently Launched Products..." />}>
        <RecentlyLaunchedProducts />
      </Suspense>
    </div>
  )
}