'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, BookOpen, BookCheck, Calendar, Users, Star, Trash2, Edit, Settings, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  _count?: {
    enrollments: number
    reviews: number
    modules: number
  }
}

interface UserProfile {
  id: number
  fullName: string
  email: string
  isProfessor: boolean
  isAdmin: boolean
  createdAt: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'created' | 'enrolled'>('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [createdCourses, setCreatedCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      // In development, we're using userId = 1
      // Fetch user profile
      const profileResponse = await fetch('http://localhost:5000/api/courses')
      setProfile({
        id: 1,
        fullName: 'Development User',
        email: 'dev@college.com',
        isProfessor: true,
        isAdmin: false,
        createdAt: new Date().toISOString()
      })

      // Fetch all courses
      const coursesResponse = await fetch('http://localhost:5000/api/courses')
      if (!coursesResponse.ok) throw new Error('Failed to fetch courses')
      
      const coursesData = await coursesResponse.json()
      const allCourses = coursesData.data || []

      // Filter courses created by user (userId = 1)
      const created = allCourses.filter((course: Course) => course.creatorId === 1)
      setCreatedCourses(created)

      // For enrolled courses, we'll fetch from a different endpoint
      // For now, we'll simulate with a subset of created courses
      // In production, this would come from the enrollments endpoint
      setEnrolledCourses([])
      
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    setDeleting(courseId)
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      toast.success('Course deleted successfully')
      setCreatedCourses(createdCourses.filter(c => c.id !== courseId))
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Failed to delete course')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-purple-500/20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {profile?.fullName}
                  </h1>
                  <p className="text-gray-400">{profile?.email}</p>
                </div>
              </div>
              {profile?.isProfessor && (
                <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/50">
                  <GraduationCap className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 font-medium">Professor</span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="inline w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`px-6 py-3 font-medium transition-all ${
                  activeTab === 'created'
                    ? 'border-b-2 border-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="inline w-4 h-4 mr-2" />
                Created Courses ({createdCourses.length})
              </button>
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`px-6 py-3 font-medium transition-all ${
                  activeTab === 'enrolled'
                    ? 'border-b-2 border-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookCheck className="inline w-4 h-4 mr-2" />
                Enrolled Courses ({enrolledCourses.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-purple-500/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-purple-400" />
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                    <div className="text-white text-lg font-medium">{profile?.fullName}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Email</label>
                    <div className="text-white text-lg font-medium">{profile?.email}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Account Type</label>
                    <div className="text-white text-lg font-medium">
                      {profile?.isProfessor ? 'Professor' : 'Student'}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Member Since</label>
                    <div className="text-white text-lg font-medium flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      {new Date(profile?.createdAt || '').toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-6 h-6 text-cyan-400" />
                      <span className="text-gray-400">Created Courses</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{createdCourses.length}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <BookCheck className="w-6 h-6 text-purple-400" />
                      <span className="text-gray-400">Enrolled Courses</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{enrolledCourses.length}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-6 h-6 text-yellow-400" />
                      <span className="text-gray-400">Average Rating</span>
                    </div>
                    <div className="text-3xl font-bold text-white">-</div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all">
                    Edit Profile
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'created' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Created Courses</h2>
                  <Link href="/create-course">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BookOpen className="w-5 h-5" />
                      Create Course
                    </motion.button>
                  </Link>
                </div>

                {createdCourses.length === 0 ? (
                  <div className="text-center py-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-purple-500/20">
                    <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-2">No courses yet</h3>
                    <p className="text-gray-400 mb-8">Create your first course to get started!</p>
                    <Link href="/create-course">
                      <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create Your First Course
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all group"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-purple-400/50" />
                          </div>

                          <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/courses/${course.id}`}>
                              <button
                                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                                title="View course"
                              >
                                <Edit className="w-4 h-4 text-white" />
                              </button>
                            </Link>
                            <button
                              className="p-2 bg-red-500/50 backdrop-blur-sm rounded-lg hover:bg-red-500/70 transition-colors"
                              onClick={() => handleDelete(course.id)}
                              disabled={deleting === course.id}
                              title="Delete course"
                            >
                              {deleting === course.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-white" />
                              )}
                            </button>
                          </div>

                          {course.isProfessorCourse && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                Professor's Course
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {course.title}
                          </h3>

                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {course.description}
                          </p>

                          <div className="text-sm text-gray-400 mb-4">
                            {course.departmentOrClub}
                          </div>

                          <div className="flex items-center gap-4 text-sm mb-4">
                            <div className="flex items-center text-yellow-400">
                              <Star className="w-4 h-4 mr-1" />
                              <span>{parseFloat(course.averageRating.toString()).toFixed(1)}</span>
                            </div>
                            <div className="flex items-center text-blue-400">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{course._count?.enrollments || 0}</span>
                            </div>
                            <div className="flex items-center text-green-400">
                              <BookOpen className="w-4 h-4 mr-1" />
                              <span>{course._count?.modules || 0} modules</span>
                            </div>
                          </div>

                          <Link href={`/courses/${course.id}`} className="block mt-4">
                            <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all">
                              View Course
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'enrolled' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Enrolled Courses</h2>

                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-purple-500/20">
                    <BookCheck className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-2">Not enrolled yet</h3>
                    <p className="text-gray-400 mb-8">You haven't enrolled in any courses.</p>
                    <Link href="/courses">
                      <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Browse Courses
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                      >
                        {/* Course content similar to created courses */}
                        <Link href={`/courses/${course.id}`} className="block">
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                            <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all">
                              Continue Learning
                            </button>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}

