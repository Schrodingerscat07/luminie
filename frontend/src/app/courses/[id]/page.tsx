'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Users, BookOpen, Video, FileText, Calendar, Clock } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import toast from 'react-hot-toast'

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
  modules?: Array<{
    id: number
    title: string
    orderIndex: number
    lectures?: Array<{
      id: number
      title: string
      videoUrl: string
      readingMaterialsUrl: string
      orderIndex: number
    }>
    assignments?: Array<{
      id: number
      title: string
      dueDays: number
      weight: number
      orderIndex: number
    }>
  }>
  _count?: {
    enrollments: number
    reviews: number
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch course')
        }
        const data = await response.json()
        setCourse(data.data)
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error('Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        </div>
      </main>
    )
  }

  if (!course) {
    return (
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4 text-white">Course Not Found</h1>
            <p className="text-gray-400 mb-8">The course you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/courses')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Course Header */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-purple-500/20 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {course.title}
                </h1>
                <p className="text-gray-300 text-lg mb-4">{course.description}</p>
              </div>
              {course.isProfessorCourse && (
                <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Professor's Course
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>{course.departmentOrClub}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{course._count?.enrollments || 0} students enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{parseFloat(course.averageRating.toString()).toFixed(1)}</span>
                <span className="text-gray-500">({course.totalRatings} ratings)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-green-400" />
                <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Instructor</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {course.creator?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-white font-medium">{course.creator?.fullName || 'Unknown'}</span>
                </div>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                Enroll Now
              </button>
            </div>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {course.tags.map((tagItem, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {tagItem.tagName}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Course Content */}
          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Course Content</h2>
              {course.modules.map((module, moduleIdx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: moduleIdx * 0.1 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-cyan-500/20"
                >
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                    {module.title}
                  </h3>

                  {/* Lectures */}
                  {module.lectures && module.lectures.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Video className="w-5 h-5 text-purple-400" />
                        Lectures
                      </h4>
                      <div className="space-y-3">
                        {module.lectures.map((lecture, lectureIdx) => (
                          <div
                            key={lecture.id}
                            className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-white font-medium mb-2">{lecture.title}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  {lecture.videoUrl && (
                                    <a
                                      href={lecture.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                      <Video className="w-4 h-4" />
                                      Watch Video
                                    </a>
                                  )}
                                  {lecture.readingMaterialsUrl && (
                                    <a
                                      href={lecture.readingMaterialsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                    >
                                      <FileText className="w-4 h-4" />
                                      Reading Materials
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assignments */}
                  {module.assignments && module.assignments.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-yellow-400" />
                        Assignments
                      </h4>
                      <div className="space-y-3">
                        {module.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="bg-slate-800/50 rounded-lg p-4 border border-yellow-500/10 hover:border-yellow-500/30 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-white font-medium mb-2">{assignment.title}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span>Due in {assignment.dueDays} days</span>
                                  <span>Weight: {assignment.weight}%</span>
                                </div>
                              </div>
                              <button className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm">
                                Start Assignment
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-purple-500/20">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No content yet</h3>
              <p className="text-gray-400">This course doesn't have any modules or lectures yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}

