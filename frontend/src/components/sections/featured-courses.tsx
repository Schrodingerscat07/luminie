'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Users, BookOpen } from 'lucide-react'

// Mock data - in real app, this would come from API
const featuredCourses = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning with Python and scikit-learn.',
    instructor: 'Dr. Sarah Johnson',
    rating: 4.8,
    students: 1250,
    duration: '8 weeks',
    price: 'Free',
    image: '/api/placeholder/400/250',
    tags: ['Machine Learning', 'Python', 'Data Science'],
    isProfessorCourse: true
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    description: 'Master modern web development with React, Node.js, and MongoDB.',
    instructor: 'Prof. Michael Chen',
    rating: 4.9,
    students: 2100,
    duration: '12 weeks',
    price: 'Free',
    image: '/api/placeholder/400/250',
    tags: ['Web Development', 'React', 'Node.js'],
    isProfessorCourse: true
  },
  {
    id: 3,
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive guide to data structures and algorithms for coding interviews.',
    instructor: 'Dr. Emily Rodriguez',
    rating: 4.7,
    students: 1800,
    duration: '10 weeks',
    price: 'Free',
    image: '/api/placeholder/400/250',
    tags: ['Algorithms', 'Programming', 'Interview Prep'],
    isProfessorCourse: true
  }
]

export function FeaturedCourses() {
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
          {featuredCourses.map((course, index) => (
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
                    <span className="font-medium">by {course.instructor}</span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-blue-500 mr-1" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-green-500 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Enroll Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {course.price}
                    </span>
                    <motion.button
                      className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Enroll Now
                    </motion.button>
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

