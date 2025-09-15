// import { useState } from "react";
// import { CheckCircle, Pencil, Trash2, PlusCircle, Sparkles, Zap, Target, ArrowRight, Star, Calendar, Clock, Users, Shield, Layers, TrendingUp, BookOpen, Heart } from "lucide-react";

// // Mock Framer Motion (since it's not available, we'll use CSS animations)
// const MotionDiv = ({ children, className, style, animate, initial, transition, whileHover, ...props }) => (
//   <div className={className} style={style} {...props}>
//     {children}
//   </div>
// );

// export default function Landing() {
//     const [tasks, setTasks] = useState([
//         { id: 1, text: "Complete project proposal", completed: false, priority: "high" },
//         { id: 2, text: "Review team feedback", completed: true, priority: "medium" },
//         { id: 3, text: "Schedule client meeting", completed: false, priority: "high" },
//     ]);
//     const [newTask, setNewTask] = useState("");
//     const [editingId, setEditingId] = useState(null);
//     const [editText, setEditText] = useState("");

//     const addTask = () => {
//         if (!newTask.trim()) return;
//         setTasks([...tasks, { 
//             id: Date.now(), 
//             text: newTask, 
//             completed: false, 
//             priority: "medium" 
//         }]);
//         setNewTask("");
//     };

//     const toggleTask = (id) => {
//         setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
//     };

//     const deleteTask = (id) => {
//         setTasks(tasks.filter((t) => t.id !== id));
//     };

//     const startEditing = (id, text) => {
//         setEditingId(id);
//         setEditText(text);
//     };

//     const saveEdit = (id) => {
//         setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
//         setEditingId(null);
//         setEditText("");
//     };

//     return (
//         <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
//            {/* Animated Background Elements - 12 moving objects */}
//             <div className="absolute inset-0 overflow-hidden">
//                 {/* Floating geometric shapes */}
//                 <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-200/40 to-rose-200/40 rounded-full blur-xl animate-float-slow"></div>
//                 <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-violet-200/30 to-purple-200/30 rounded-full blur-2xl animate-bounce-slow" style={{animationDuration: '4s'}}></div>
//                 <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-200/40 to-teal-200/40 rounded-full blur-lg animate-pulse-slow" style={{animationDuration: '3s'}}></div>
//                 <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rotate-45 blur-sm animate-spin-slow" style={{animationDuration: '8s'}}></div>
//                 <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-gradient-to-r from-indigo-200/35 to-blue-200/35 rounded-xl blur-xl animate-float-delayed"></div>
                
//                 {/* Floating Icons */}
//                 <div className="absolute top-32 left-1/4 animate-float">
//                     <Sparkles className="w-6 h-6 text-pink-400" />
//                 </div>
//                 <div className="absolute top-48 right-1/3 animate-float-delayed">
//                     <Calendar className="w-8 h-8 text-violet-500" />
//                 </div>
//                 <div className="absolute bottom-40 right-1/4 animate-float">
//                     <Target className="w-7 h-7 text-emerald-500" />
//                 </div>
//                 <div className="absolute top-60 left-1/2 animate-float-slow">
//                     <Clock className="w-5 h-5 text-amber-500" />
//                 </div>
//                 <div className="absolute bottom-60 left-1/5 animate-bounce-slow" style={{animationDuration: '5s'}}>
//                     <Users className="w-6 h-6 text-indigo-500" />
//                 </div>
//                 <div className="absolute top-1/3 right-1/5 animate-float-delayed">
//                     <BookOpen className="w-7 h-7 text-teal-500" />
//                 </div>
//                 <div className="absolute bottom-1/4 left-2/3 animate-pulse-slow" style={{animationDuration: '4s'}}>
//                     <TrendingUp className="w-6 h-6 text-rose-500" />
//                 </div>
                
//                 {/* Additional geometric elements */}
//                 <div className="absolute top-1/4 left-3/4 w-16 h-16 bg-gradient-to-r from-cyan-200/40 to-sky-200/40 rounded-lg rotate-12 animate-float-slow"></div>
//             </div>

//             <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32">
//                 {/* Hero Section */}
//                 <MotionDiv className="flex flex-col items-center justify-center mb-20">
//                     <div className="flex items-center gap-2 mb-6 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-rose-200/50 shadow-sm">
//                         <Star className="w-4 h-4 text-amber-500" />
//                         <span className="text-slate-700 text-sm font-medium">Trusted by professionals worldwide</span>
//                     </div>
                    
//                     <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-rose-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
//                         Taskly
//                     </h1>
                    
//                     <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
//                         Smart Task Management
//                         <span className="block text-2xl md:text-3xl font-medium text-slate-600 mt-2">
//                             Made Simple
//                         </span>
//                     </h2>
                    
//                     <p className="text-slate-600 text-lg max-w-2xl mb-12 leading-relaxed">
//                         Streamline your workflow with an intuitive task management solution. 
//                         Organize projects, track progress, and achieve your goals with elegance and efficiency.
//                     </p>

//                     <div className="flex gap-6">
//                         <button className="group bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-rose-500/25">
//                             Get Started Free
//                             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                         </button>
//                         <button className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg border border-rose-200/50 hover:bg-white/90 hover:shadow-lg transition-all duration-300">
//                             Watch Demo
//                         </button>
//                     </div>
//                 </MotionDiv>

//                 {/* Features Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl w-full">
//                     <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 hover:border-rose-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg">
//                         <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
//                             <Layers className="w-8 h-8 text-yellow-800 " />
//                         </div>
//                         <h3 className="text-xl font-bold text-slate-800 mb-4">Organized Workflows</h3>
//                         <p className="text-slate-600">
//                             Structure your tasks with intuitive categories, priorities, and due dates for maximum productivity.
//                         </p>
//                     </div>

//                     <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100 hover:border-violet-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg">
//                         <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
//                             <Shield className="w-8 h-8 text-yellow-800" />
//                         </div>
//                         <h3 className="text-xl font-bold text-slate-800 mb-4">Secure & Reliable</h3>
//                         <p className="text-slate-600">
//                             Your data is protected with enterprise-grade security. Focus on your work, we'll handle the rest.
//                         </p>
//                     </div>

//                     <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg">
//                         <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
//                             <TrendingUp className="w-8 h-8 text-yellow-800" />
//                         </div>
//                         <h3 className="text-xl font-bold text-slate-800 mb-4">Progress Tracking</h3>
//                         <p className="text-slate-600">
//                             Visualize your achievements with detailed analytics and progress reports that motivate success.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Interactive Demo */}
//                 <div className="mb-20 max-w-4xl w-full">
//                     <h2 className="text-4xl font-bold text-slate-800 mb-4">Experience Taskly</h2>
//                     <p className="text-slate-600 mb-12 text-lg">
//                         Try our intuitive interface right here. Add tasks, mark them complete, and see the magic in action.
//                     </p>
                    
//                     <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-rose-100 shadow-2xl">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-2xl font-bold text-slate-800">My Tasks</h3>
//                             <div className="text-slate-600 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-2 rounded-full border border-rose-200">
//                                 {tasks.filter(t => t.completed).length} of {tasks.length} completed
//                             </div>
//                         </div>

//                         <div className="space-y-3 mb-6">
//                             {tasks.map((task) => (
//                                 <div
//                                     key={task.id}
//                                     className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
//                                         task.completed 
//                                             ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm' 
//                                             : 'bg-white hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:shadow-md border-slate-200 hover:border-rose-200'
//                                     }`}
//                                 >
//                                     <div className="flex items-center space-x-4">
//                                         <button onClick={() => toggleTask(task.id)}>
//                                             <CheckCircle
//                                                 className={`w-6 h-6 transition-colors ${
//                                                     task.completed ? "text-emerald-500" : "text-slate-400 hover:text-emerald-500"
//                                                 }`}
//                                             />
//                                         </button>
//                                         {editingId === task.id ? (
//                                             <input
//                                                 type="text"
//                                                 value={editText}
//                                                 onChange={(e) => setEditText(e.target.value)}
//                                                 onBlur={() => saveEdit(task.id)}
//                                                 className="bg-white border border-rose-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
//                                                 autoFocus
//                                             />
//                                         ) : (
//                                             <div className="flex items-center gap-3">
//                                                 <span
//                                                     className={`text-lg ${
//                                                         task.completed ? "line-through text-slate-500" : "text-slate-800"
//                                                     }`}
//                                                 >
//                                                     {task.text}
//                                                 </span>
//                                                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                                     task.priority === 'high' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
//                                                     task.priority === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
//                                                     'bg-emerald-100 text-emerald-700 border border-emerald-200'
//                                                 }`}>
//                                                     {task.priority}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="flex space-x-2">
//                                         <button onClick={() => startEditing(task.id, task.text)}>
//                                             <Pencil className="w-5 h-5 text-slate-400 hover:text-violet-500 transition-colors" />
//                                         </button>
//                                         <button onClick={() => deleteTask(task.id)}>
//                                             <Trash2 className="w-5 h-5 text-slate-400 hover:text-rose-500 transition-colors" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="flex items-center space-x-3">
//                             <input
//                                 type="text"
//                                 placeholder="What would you like to accomplish?"
//                                 value={newTask}
//                                 onChange={(e) => setNewTask(e.target.value)}
//                                 className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
//                                 onKeyPress={(e) => e.key === 'Enter' && addTask()}
//                             />
//                             <button
//                                 onClick={addTask}
//                                 className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-rose-500/25"
//                             >
//                                 <PlusCircle className="w-6 h-6" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* CTA Section */}
//                 <div className="text-center mb-20">
//                     <h2 className="text-5xl font-bold text-slate-800 mb-6">Ready to Transform Your Productivity?</h2>
//                     <p className="text-slate-600 text-xl mb-8 max-w-2xl">
//                         Join thousands of professionals who have streamlined their workflow with Taskly. 
//                         Start your journey to organized excellence today.
//                     </p>
//                     <button className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-violet-500/25">
//                         Start Your Free Trial
//                         <Heart className="w-5 h-5 inline-block ml-2" />
//                     </button>
//                 </div>
//             </div>

//             <style jsx>{`
//                 @keyframes float {
//                     0%, 100% { transform: translateY(0px); }
//                     50% { transform: translateY(-15px); }
//                 }
//                 @keyframes float-delayed {
//                     0%, 100% { transform: translateY(0px); }
//                     50% { transform: translateY(-12px); }
//                 }
//                 @keyframes float-slow {
//                     0%, 100% { transform: translateY(0px) rotate(0deg); }
//                     50% { transform: translateY(-8px) rotate(5deg); }
//                 }
//                 @keyframes bounce-slow {
//                     0%, 100% { transform: translateY(0px); }
//                     50% { transform: translateY(-10px); }
//                 }
//                 @keyframes pulse-slow {
//                     0%, 100% { opacity: 0.6; }
//                     50% { opacity: 0.9; }
//                 }
//                 @keyframes spin-slow {
//                     from { transform: rotate(0deg); }
//                     to { transform: rotate(360deg); }
//                 }
//                 .animate-float {
//                     animation: float 4s ease-in-out infinite;
//                 }
//                 .animate-float-delayed {
//                     animation: float-delayed 5s ease-in-out infinite 1s;
//                 }
//                 .animate-float-slow {
//                     animation: float-slow 8s ease-in-out infinite;
//                 }
//                 .animate-bounce-slow {
//                     animation: bounce-slow 6s ease-in-out infinite;
//                 }
//                 .animate-pulse-slow {
//                     animation: pulse-slow 4s ease-in-out infinite;
//                 }
//                 .animate-spin-slow {
//                     animation: spin-slow 12s linear infinite;
//                 }
//             `}</style>
//         </div>
//     );
// }











import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Target
} from 'lucide-react'

const Landing = () => {
  useEffect(() => {
    // Create stars
    const createStars = () => {
      const starsContainer = document.querySelector('.stars')
      if (!starsContainer) return

      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 2 + 's'
        starsContainer.appendChild(star)
      }
    }

    createStars()
  }, [])

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Task Analysis",
      description: "Our AI automatically categorizes tasks, suggests priorities, and detects deadlines from your input."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Smart Analytics",
      description: "Get insights into your productivity patterns with AI-generated weekly summaries and performance metrics."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Intelligent Automation",
      description: "Let AI handle the boring stuff - automatic categorization, priority detection, and smart scheduling."
    }
  ]

  const stats = [
    { icon: <Users className="h-6 w-6" />, number: "10K+", label: "Active Users" },
    { icon: <CheckCircle className="h-6 w-6" />, number: "1M+", label: "Tasks Completed" },
    { icon: <Clock className="h-6 w-6" />, number: "40%", label: "Time Saved" },
    { icon: <Target className="h-6 w-6" />, number: "95%", label: "Success Rate" }
  ]

  return (
    <div className="galaxy-bg">
      <div className="stars"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">AI TaskMaster</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-400/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
              <span className="text-purple-300 text-sm font-medium">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Your </span>
              <span className="gradient-text">Personal</span>
              <br />
              <span className="gradient-text">Task Manager</span>
              <br />
              <span className="text-white">Powered by </span>
              <span className="gradient-text">AI</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Experience the future of productivity with our AI-driven task management platform. 
              Automatically categorize tasks, detect priorities, and get intelligent insights 
              to boost your efficiency by 40%.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16"
          >
            <Link to="/register" className="btn-primary text-lg px-8 py-4 pulse-glow">
              Start Your AI Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/login" className="px-8 py-4 border border-purple-400 text-purple-300 rounded-lg hover:bg-purple-600/20 transition-all duration-300">
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-purple-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-8 text-center floating-animation hover:border-purple-400 transition-all duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-purple-400 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card p-8 md:p-12 text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
            See AI in Action
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Watch how our AI instantly analyzes "Finish DBMS assignment by Friday" and automatically:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-white font-medium">Detects Deadline</div>
              <div className="text-sm text-green-300">Friday identified</div>
            </div>
            <div className="bg-orange-600/20 border border-orange-400/30 rounded-lg p-6">
              <Star className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-white font-medium">Sets Priority</div>
              <div className="text-sm text-orange-300">High priority assigned</div>
            </div>
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <Brain className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-medium">Categorizes</div>
              <div className="text-sm text-blue-300">Study category</div>
            </div>
          </div>

          <Link to="/register" className="btn-primary text-lg">
            Try AI Analysis Now
          </Link>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Ready to </span>
            <span className="gradient-text">Supercharge</span>
            <br />
            <span className="text-white">Your Productivity?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their task management with AI.
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn-primary text-lg px-10 py-4 pulse-glow">
              Get Started Free
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-600/20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold gradient-text">AI TaskMaster</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 AI TaskMaster. Powered by advanced artificial intelligence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing