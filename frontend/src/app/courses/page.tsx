import { Suspense } from 'react'
import { FeaturedCourses } from '@/components/sections/featured-courses'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function CoursesPage() {
  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Explore Courses
            </h1>
            <p className="text-gray-400 text-lg">
              Discover the perfect course for you
            </p>
          </div>
          <FeaturedCourses />
        </Suspense>
      </div>
    </main>
  )
}

