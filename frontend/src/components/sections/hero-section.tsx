'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 liquid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-slate-900/90" />
      
      {/* Floating elements - vibrant colors */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/30 rounded-full float-animation blur-xl" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/30 rounded-full float-animation blur-xl" />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-500/30 rounded-full float-animation blur-xl" />
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-cyan-400/30 rounded-full float-animation blur-xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CollegeCoursera
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Learn, Create, and Excel with our dynamic platform designed for college students and professors. 
            Experience fluid UI, auto-grading, and intelligent recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Explore Courses
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">100+</h3>
              <p className="text-gray-400">Courses Available</p>
            </div>
            
            <div className="text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
              <p className="text-gray-400">Active Students</p>
            </div>
            
            <div className="text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">4.8</h3>
              <p className="text-gray-400">Average Rating</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

