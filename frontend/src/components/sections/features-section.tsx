'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  Award, 
  Zap, 
  Brain, 
  Smartphone,
  Shield,
  BarChart3
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Courses',
    description: 'Access a wide range of courses across various disciplines with expert-created content.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Zap,
    title: 'Auto-Grading System',
    description: 'Intelligent MCQ-based grading system that provides instant feedback and progress tracking.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Brain,
    title: 'Smart Recommendations',
    description: 'AI-powered course recommendations based on your interests and learning patterns.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Users,
    title: 'Community Learning',
    description: 'Connect with fellow students, participate in discussions, and learn collaboratively.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Learn anywhere, anytime with our fully responsive design that works on all devices.',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: Award,
    title: 'Professor Verified',
    description: 'Courses created by verified professors with official college recognition and badges.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your data and progress are protected with enterprise-grade security measures.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track your learning journey with detailed analytics and performance insights.',
    color: 'from-teal-500 to-teal-600'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
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
              Why Choose CollegeCoursera?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of online learning with our innovative features and cutting-edge technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-primary-200 h-full">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-gray-700" />
                    </div>
                  </div>
                  
                  {/* Animated background */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20`}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0, 0.2, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-12 border border-primary-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already advancing their education with CollegeCoursera
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

