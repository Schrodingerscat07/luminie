'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Award, Clock } from 'lucide-react'

const stats = [
  {
    icon: BookOpen,
    value: '100+',
    label: 'Courses Available',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Users,
    value: '500+',
    label: 'Active Students',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Award,
    value: '4.8',
    label: 'Average Rating',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Access Available',
    color: 'from-purple-500 to-purple-600'
  }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
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
              Platform Statistics
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of students and professors who are already using CollegeCoursera
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <stat.icon className="w-10 h-10 text-gray-700" />
                  </div>
                </div>
                
                {/* Floating animation */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-20`}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </div>
              
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                whileHover={{ scale: 1.05 }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

