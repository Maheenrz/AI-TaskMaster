import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  CheckCircle, 
  BarChart3, 
  Zap, 
  Star,
  ArrowRight,
  Users,
  Clock,
  Target,
  Wand2,
  TrendingUp,
  Award,
  MessageSquare,
  Calendar,
  Shield,
  Layers
} from 'lucide-react'

const Landing = () => {
  const controls = useAnimation()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Create animated starfield
    const createStars = () => {
      const starsContainer = document.querySelector('.stars')
      if (!starsContainer) return

      // Create multiple layers of stars
      for (let layer = 0; layer < 3; layer++) {
        const layerDiv = document.createElement('div')
        layerDiv.className = `star-layer star-layer-${layer}`
        
        const starCount = layer === 0 ? 50 : layer === 1 ? 30 : 20
        for (let i = 0; i < starCount; i++) {
          const star = document.createElement('div')
          star.className = `star star-${layer}`
          star.style.left = Math.random() * 100 + '%'
          star.style.top = Math.random() * 100 + '%'
          star.style.animationDelay = Math.random() * 3 + 's'
          star.style.animationDuration = (2 + Math.random() * 2) + 's'
          layerDiv.appendChild(star)
        }
        starsContainer.appendChild(layerDiv)
      }
    }

    // Mouse movement parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      })
    }

    createStars()
    window.addEventListener('mousemove', handleMouseMove)
    controls.start({ opacity: 1, y: 0 })

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [controls])

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Task Analysis",
      description: "Our advanced AI automatically categorizes tasks, suggests priorities, and detects deadlines from natural language input.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Smart Task Assistant",
      description: "Chat with your tasks! Ask 'What's my most urgent task?' or 'How was my week?' and get intelligent responses.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Predictive Analytics",
      description: "Get insights into your productivity patterns with AI-generated weekly summaries and performance predictions.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Wand2 className="h-8 w-8" />,
      title: "Magic Scheduling",
      description: "AI suggests optimal time slots for tasks based on your habits, deadlines, and energy patterns.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Tracking",
      description: "Set long-term goals and let AI break them down into actionable daily tasks automatically.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Productivity Insights",
      description: "Receive personalized tips and insights to optimize your workflow and boost efficiency by 40%.",
      color: "from-violet-500 to-purple-500"
    }
  ]

  const stats = [
    { icon: <Users className="h-6 w-6" />, number: "50K+", label: "Active Users", delay: 0.1 },
    { icon: <CheckCircle className="h-6 w-6" />, number: "2M+", label: "Tasks Completed", delay: 0.2 },
    { icon: <Clock className="h-6 w-6" />, number: "45%", label: "Time Saved", delay: 0.3 },
    { icon: <Award className="h-6 w-6" />, number: "98%", label: "Success Rate", delay: 0.4 }
  ]

  const testimonials = [
    {
      text: "This AI task manager changed how I work. It's like having a personal assistant that knows exactly what I need to do next.",
      author: "Sarah Chen",
      role: "Product Manager"
    },
    {
      text: "The AI predictions are scary accurate. It knows my productivity patterns better than I do!",
      author: "Marcus Johnson",
      role: "Software Engineer"
    },
    {
      text: "Finally, a task manager that thinks with me, not just stores my todos. The insights are game-changing.",
      author: "Elena Rodriguez",
      role: "Designer"
    }
  ]

  return (
    <div className="galaxy-bg relative overflow-hidden">
      {/* Enhanced Starfield */}
      <div className="stars absolute inset-0"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            animate={{
              y: [-20, window.innerHeight + 20],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's'
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }}
          >
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">AI TaskMaster</span>
          </motion.div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary transform hover:scale-105 transition-all duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-400/30 rounded-full px-6 py-3 mb-8"
              whileHover={{ scale: 1.05 }}
              style={{
                transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
              }}
            >
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
              <span className="text-purple-300 font-medium">Powered by Advanced AI</span>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
              style={{
                transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
              }}
            >
              <span className="text-white">Your </span>
              <span className="gradient-text animate-pulse">AI-Powered</span>
              <br />
              <span className="gradient-text">Task Manager</span>
              <br />
              <span className="text-white">of the </span>
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Future</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Experience the next generation of productivity with our AI that thinks, learns, and adapts to your workflow. 
              Simply describe your tasks and watch the magic happen - automatic categorization, smart scheduling, and intelligent insights.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20"
          >
            <Link to="/register" className="group btn-primary text-lg px-10 py-5 pulse-glow transform hover:scale-110 transition-all duration-500">
              <span className="flex items-center space-x-2">
                <span>Start Your AI Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link to="/login" className="px-10 py-5 border border-purple-400 text-purple-300 rounded-lg hover:bg-purple-600/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              Sign In
            </Link>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group cursor-pointer"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stat.delay + 1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="flex justify-center mb-3 text-purple-400 group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
                <motion.div 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: stat.delay + 1.2 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* AI Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="glass-card p-8 md:p-12 text-center mb-32 relative overflow-hidden"
        >
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 animate-pulse"></div>
          
          <div className="relative z-10">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold gradient-text mb-8"
              whileInView={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Watch AI Magic in Action
            </motion.h2>
            <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-lg">
              Type: <span className="text-purple-400 font-mono bg-gray-800/50 px-3 py-1 rounded">"Finish DBMS project by Friday, it's important"</span>
              <br />Watch our AI instantly understand and organize your task:
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Calendar, title: "Detects Deadline", detail: "Friday identified", color: "green" },
                { icon: Star, title: "Sets Priority", detail: "High priority", color: "orange" },
                { icon: Layers, title: "Categorizes", detail: "Study/Work", color: "blue" },
                { icon: Clock, title: "Suggests Time", detail: "2 hours needed", color: "purple" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`bg-${item.color}-600/20 border border-${item.color}-400/30 rounded-lg p-6 transform hover:scale-105 transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <item.icon className={`h-8 w-8 text-${item.color}-400 mx-auto mb-3`} />
                  <div className="text-white font-medium mb-1">{item.title}</div>
                  <div className={`text-sm text-${item.color}-300`}>{item.detail}</div>
                </motion.div>
              ))}
            </div>

            <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
              <Wand2 className="h-5 w-5" />
              <span>Try AI Analysis Now</span>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Superpowers for Your Productivity
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover features that transform how you manage tasks and achieve your goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 text-center group hover:scale-105 transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`text-transparent bg-gradient-to-r ${feature.color} bg-clip-text mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by Professionals Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 relative group hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="absolute top-4 left-4 text-purple-400 opacity-50 text-4xl">"</div>
                <p className="text-gray-300 mb-6 italic leading-relaxed pt-6">
                  {testimonial.text}
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.author}</div>
                    <div className="text-purple-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center relative"
        >
          <div className="glass-card p-12 md:p-16 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 animate-pulse"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                <span className="text-white">Ready to </span>
                <span className="gradient-text">Transform</span>
                <br />
                <span className="text-white">Your Productivity </span>
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Forever?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join the AI revolution in task management. Start with a free account and experience 
                the future of productivity. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/register" className="btn-primary text-xl px-12 py-5 pulse-glow transform hover:scale-110 transition-all duration-500 group">
                  <span className="flex items-center space-x-2">
                    <span>Start Free Today</span>
                    <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  </span>
                </Link>
                <div className="text-sm text-gray-400">
                  Free forever • No credit card • Setup in 30 seconds
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative z-10 border-t border-purple-600/20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold gradient-text">AI TaskMaster</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The world's most intelligent task management platform. 
                Powered by advanced AI to revolutionize your productivity.
              </p>
              <div className="flex space-x-4">
                {[Shield, Users, TrendingUp].map((Icon, i) => (
                  <div key={i} className="p-2 bg-purple-600/20 rounded-lg">
                    <Icon className="h-4 w-4 text-purple-400" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                {['Features', 'Pricing', 'API', 'Integrations'].map(item => (
                  <div key={item} className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                  <div key={item} className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-purple-600/20 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 AI TaskMaster. Powered by advanced artificial intelligence.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .star-layer {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: twinkle infinite ease-in-out;
        }
        
        .star-0 {
          width: 1px;
          height: 1px;
          box-shadow: 0 0 6px 1px rgba(255,255,255,0.8);
        }
        
        .star-1 {
          width: 2px;
          height: 2px;
          box-shadow: 0 0 8px 2px rgba(147,197,253,0.8);
        }
        
        .star-2 {
          width: 3px;
          height: 3px;
          box-shadow: 0 0 10px 3px rgba(196,181,253,0.8);
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

export default Landing