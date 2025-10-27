'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Save, Video, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

interface Module {
  title: string
  lectures: Lecture[]
}

interface Lecture {
  title: string
  videoUrl: string
  readingMaterialsUrl: string
}

export default function CreateCoursePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentOrClub: '',
    tags: [] as string[]
  })

  const [modules, setModules] = useState<Module[]>([
    {
      title: '',
      lectures: [{ title: '', videoUrl: '', readingMaterialsUrl: '' }]
    }
  ])

  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addModule = () => {
    setModules(prev => [...prev, { title: '', lectures: [{ title: '', videoUrl: '', readingMaterialsUrl: '' }] }])
  }

  const removeModule = (index: number) => {
    setModules(prev => prev.filter((_, i) => i !== index))
  }

  const updateModule = (index: number, field: string, value: string) => {
    setModules(prev => prev.map((module, i) =>
      i === index ? { ...module, [field]: value } : module
    ))
  }

  const addLecture = (moduleIndex: number) => {
    setModules(prev => prev.map((module, i) =>
      i === moduleIndex
        ? { ...module, lectures: [...module.lectures, { title: '', videoUrl: '', readingMaterialsUrl: '' }] }
        : module
    ))
  }

  const removeLecture = (moduleIndex: number, lectureIndex: number) => {
    setModules(prev => prev.map((module, i) =>
      i === moduleIndex
        ? { ...module, lectures: module.lectures.filter((_, j) => j !== lectureIndex) }
        : module
    ))
  }

  const updateLecture = (moduleIndex: number, lectureIndex: number, field: string, value: string) => {
    setModules(prev => prev.map((module, i) =>
      i === moduleIndex
        ? {
            ...module,
            lectures: module.lectures.map((lecture, j) =>
              j === lectureIndex ? { ...lecture, [field]: value } : lecture
            )
          }
        : module
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, create the course
      const courseResponse = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          departmentOrClub: formData.departmentOrClub,
          tags: formData.tags
        })
      })

      if (!courseResponse.ok) {
        throw new Error('Failed to create course')
      }

      const courseData = await courseResponse.json()
      const courseId = courseData.data.id

      // Then, create modules and lectures
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i]
        
        // Create module
        const moduleResponse = await fetch('http://localhost:5000/api/modules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId,
            title: module.title,
            orderIndex: i + 1
          })
        })

        if (!moduleResponse.ok) {
          throw new Error('Failed to create module')
        }

        const moduleData = await moduleResponse.json()
        const moduleId = moduleData.data.id

        // Create lectures for this module
        for (let j = 0; j < module.lectures.length; j++) {
          const lecture = module.lectures[j]
          await fetch(`http://localhost:5000/api/modules/${moduleId}/lectures`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: lecture.title,
              videoUrl: lecture.videoUrl,
              readingMaterialsUrl: lecture.readingMaterialsUrl,
              orderIndex: j + 1
            })
          })
        }
      }

      toast.success('Course created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        departmentOrClub: '',
        tags: []
      })
      setModules([{ title: '', lectures: [{ title: '', videoUrl: '', readingMaterialsUrl: '' }] }])
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Failed to create course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create New Course
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Course Information */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-purple-400" />
                Course Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your course..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department or Club *
                  </label>
                  <input
                    type="text"
                    name="departmentOrClub"
                    value={formData.departmentOrClub}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., Computer Science, Robotics Club"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Press Enter to add tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-purple-300 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modules and Lectures */}
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Module {moduleIndex + 1}</h3>
                    {modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Module Title *
                      </label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="e.g., Introduction to Programming"
                      />
                    </div>

                    {/* Lectures */}
                    {module.lectures.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-cyan-400">Lecture {lectureIndex + 1}</span>
                          {module.lectures.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLecture(moduleIndex, lectureIndex)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <input
                              type="text"
                              value={lecture.title}
                              onChange={(e) => updateLecture(moduleIndex, lectureIndex, 'title', e.target.value)}
                              required
                              className="w-full px-3 py-2 bg-slate-800 border border-cyan-500/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                              placeholder="Lecture title"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Video URL (YouTube, Vimeo, etc.)</label>
                            <input
                              type="url"
                              value={lecture.videoUrl}
                              onChange={(e) => updateLecture(moduleIndex, lectureIndex, 'videoUrl', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-800 border border-cyan-500/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                              placeholder="https://youtube.com/watch?v=..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Reading Materials URL (optional)</label>
                            <input
                              type="url"
                              value={lecture.readingMaterialsUrl}
                              onChange={(e) => updateLecture(moduleIndex, lectureIndex, 'readingMaterialsUrl', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-800 border border-cyan-500/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                              placeholder="https://drive.google.com/..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addLecture(moduleIndex)}
                      className="w-full py-2 bg-slate-800 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Lecture
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addModule}
                className="w-full py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-white rounded-lg hover:from-cyan-500/30 hover:to-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                Add Module
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
}


