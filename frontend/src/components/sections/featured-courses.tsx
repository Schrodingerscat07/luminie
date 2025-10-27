'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Users, BookOpen, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: number
  title: string
  description: string
  departmentOrClub: string
  creatorId: number
  isProfessorCourse: boolean
  averageRating: number
  totalRatings: number
  createdAt: string
  updatedAt: string
  creator?: {
    id: number
    fullName: string
    profilePictureUrl?: string
    isProfessor: boolean
  }
  tags?: Array<{ tagName: string }>
  _count?: {
    enrollments: number
    reviews: number
  }
}

export function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses?limit=9')
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        const data = await response.json()
        setCourses(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error || courses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">No courses available yet.</p>
      </div>
    )
  }
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Featured Courses
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly-rated courses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 group-hover:scale-105">
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary-600/50" />
                  </div>
                  
                  {/* Professor Badge */}
                  {course.isProfessorCourse && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        Professor's Course
                      </span>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="font-medium">by {course.creator?.fullName || 'Unknown'}</span>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    <span className="font-medium">{course.departmentOrClub}</span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{parseFloat(course.averageRating.toString()).toFixed(1)}</span>
                        <span className="text-gray-400 ml-1">({course.totalRatings})</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-blue-500 mr-1" />
                        <span>{course._count?.enrollments || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 3).map((tagItem, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                        >
                          {tagItem.tagName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Enroll Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      Free
                    </span>
                    <Link href={`/courses/${course.id}`}>
                      <motion.button
                        className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Course
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            className="px-8 py-3 bg-white/80 backdrop-blur-sm text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Courses
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

