import { BookOpen, Users, Award, Target } from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Quality Education',
      description: 'Learn from the best professors and industry experts',
    },
    {
      icon: Users,
      title: 'Active Community',
      description: 'Connect with peers and collaborate on projects',
    },
    {
      icon: Award,
      title: 'Recognition',
      description: 'Get certified and boost your career prospects',
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'Structured learning paths to achieve your goals',
    },
  ]

  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            About CollegeCoursera
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            A revolutionary learning platform designed specifically for college students and professors. 
            We're committed to making quality education accessible, engaging, and effective.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/20">
            <p className="text-gray-300 text-lg leading-relaxed">
              At CollegeCoursera, we believe in the transformative power of education. Our mission is to provide 
              a dynamic, interactive learning environment that empowers students to excel academically while 
              helping educators deliver exceptional teaching experiences. With cutting-edge technology, intuitive 
              design, and a commitment to innovation, we're shaping the future of online education.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-white text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Values */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-cyan-500/20">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Innovation</h3>
              <p className="text-gray-400">
                We constantly push the boundaries of what's possible in education technology
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Excellence</h3>
              <p className="text-gray-400">
                We're committed to delivering the highest quality learning experiences
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-pink-500/20">
              <h3 className="text-xl font-semibold text-pink-400 mb-4">Accessibility</h3>
              <p className="text-gray-400">
                Education should be available to everyone, everywhere, anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

