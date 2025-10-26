import { Suspense } from 'react'
import { HeroSection } from '@/components/sections/hero-section'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        
        {/* Quick Links Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Explore Our Platform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link
                href="/courses"
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-4">Browse Courses</h3>
                  <p className="text-gray-400 mb-4">
                    Discover a wide range of courses designed for your academic and professional growth
                  </p>
                  <div className="flex items-center text-cyan-400 group-hover:translate-x-2 transition-transform">
                    Explore <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>

              <Link
                href="/features"
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-4">Platform Features</h3>
                  <p className="text-gray-400 mb-4">
                    Learn about our innovative features designed to enhance your learning experience
                  </p>
                  <div className="flex items-center text-purple-400 group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>

              <Link
                href="/about"
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-4">About Us</h3>
                  <p className="text-gray-400 mb-4">
                    Discover our mission, values, and commitment to transforming education
                  </p>
                  <div className="flex items-center text-pink-400 group-hover:translate-x-2 transition-transform">
                    Find Out More <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </Suspense>
    </main>
  )
}

