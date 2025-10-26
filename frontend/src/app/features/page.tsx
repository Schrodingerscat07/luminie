import { Suspense } from 'react'
import { FeaturesSection } from '@/components/sections/features-section'
import { StatsSection } from '@/components/sections/stats-section'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function FeaturesPage() {
  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Platform Features
            </h1>
            <p className="text-gray-400 text-lg">
              Everything you need to learn and teach effectively
            </p>
          </div>
          <FeaturesSection />
          <div className="mt-20">
            <StatsSection />
          </div>
        </Suspense>
      </div>
    </main>
  )
}

