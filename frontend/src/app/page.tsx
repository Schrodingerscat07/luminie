import { Suspense } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturedCourses } from '@/components/sections/featured-courses'
import { StatsSection } from '@/components/sections/stats-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        <StatsSection />
        <FeaturedCourses />
        <FeaturesSection />
      </Suspense>
    </main>
  )
}

