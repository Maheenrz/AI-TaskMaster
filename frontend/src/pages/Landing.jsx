import { useState } from "react";
import { CheckCircle, Pencil, Trash2, PlusCircle, Sparkles, Zap, Target, ArrowRight, Star } from "lucide-react";

// Mock Framer Motion (since it's not available, we'll use CSS animations)
const MotionDiv = ({ children, className, style, animate, initial, transition, whileHover, ...props }) => (
  <div className={className} style={style} {...props}>
    {children}
  </div>
);

export default function Landing() {
    const [tasks, setTasks] = useState([
        { id: 1, text: "Design viral TikTok content", completed: false, priority: "high" },
        { id: 2, text: "Launch aesthetic startup", completed: true, priority: "medium" },
        { id: 3, text: "Build personal brand", completed: false, priority: "high" },
    ]);
    const [newTask, setNewTask] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([...tasks, { 
            id: Date.now(), 
            text: newTask, 
            completed: false, 
            priority: "medium" 
        }]);
        setNewTask("");
    };

    const toggleTask = (id) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    const startEditing = (id, text) => {
        setEditingId(id);
        setEditText(text);
    };

    const saveEdit = (id) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
        setEditingId(null);
        setEditText("");
    };

    return (
        <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-bounce" style={{animationDuration: '3s'}}></div>
                <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-ping" style={{animationDuration: '4s'}}></div>
                
                {/* Floating Icons */}
                <div className="absolute top-32 left-1/4 animate-float">
                    <Sparkles className="w-8 h-8 text-pink-400/60" />
                </div>
                <div className="absolute top-48 right-1/3 animate-float-delayed">
                    <Zap className="w-10 h-10 text-yellow-400/60" />
                </div>
                <div className="absolute bottom-40 right-1/4 animate-float">
                    <Target className="w-7 h-7 text-cyan-400/60" />
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32">
                {/* Hero Section */}
                <MotionDiv className="flex flex-col items-center justify-center mb-20">
                    <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/90 text-sm font-medium">Built for the next generation</span>
                    </div>
                    
                    <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6 tracking-tight">
                        TaskFlow
                    </h1>
                    
                    <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Where productivity meets
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400"> aesthetic</span>
                    </p>
                    
                    <p className="text-white/70 text-lg max-w-2xl mb-12 leading-relaxed">
                        The most visually stunning task manager designed for Gen Z and Gen Alpha. 
                        Organize your chaos, manifest your goals, and slay your to-do list ✨
                    </p>

                    <div className="flex gap-6">
                        <button className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2">
                            Start Your Glow Up
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                            Watch Demo
                        </button>
                    </div>
                </MotionDiv>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl w-full">
                    <div className="group p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Aesthetic AF</h3>
                        <p className="text-white/70">
                            Clean, minimal design that's actually pleasing to look at. No more ugly productivity apps.
                        </p>
                    </div>

                    <div className="group p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
                        <p className="text-white/70">
                            Smooth animations and instant responses. Because waiting is not the vibe.
                        </p>
                    </div>

                    <div className="group p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Goal Crusher</h3>
                        <p className="text-white/70">
                            Kanban boards, priority levels, and progress tracking to help you absolutely slay.
                        </p>
                    </div>
                </div>

                {/* Interactive Demo */}
                <div className="mb-20 max-w-4xl w-full">
                    <h2 className="text-4xl font-bold text-white mb-4">Try it right now</h2>
                    <p className="text-white/70 mb-12 text-lg">
                        Experience the magic. Add your dreams, crush your goals.
                    </p>
                    
                    <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Your Goals</h3>
                            <div className="text-white/60">
                                {tasks.filter(t => t.completed).length}/{tasks.length} completed
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                                        task.completed 
                                            ? 'bg-green-500/20 border border-green-400/30' 
                                            : 'bg-white/10 border border-white/20 hover:bg-white/20'
                                    }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => toggleTask(task.id)}>
                                            <CheckCircle
                                                className={`w-6 h-6 transition-colors ${
                                                    task.completed ? "text-green-400" : "text-white/40 hover:text-white/60"
                                                }`}
                                            />
                                        </button>
                                        {editingId === task.id ? (
                                            <input
                                                type="text"
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                onBlur={() => saveEdit(task.id)}
                                                className="bg-white/20 text-white border border-white/30 px-3 py-2 rounded-xl"
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`text-lg ${
                                                        task.completed ? "line-through text-white/60" : "text-white"
                                                    }`}
                                                >
                                                    {task.text}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-green-500/20 text-green-300'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => startEditing(task.id, task.text)}>
                                            <Pencil className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
                                        </button>
                                        <button onClick={() => deleteTask(task.id)}>
                                            <Trash2 className="w-5 h-5 text-white/60 hover:text-red-400 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                placeholder="Add your next big move..."
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <button
                                onClick={addTask}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                            >
                                <PlusCircle className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-bold text-white mb-6">Ready to level up?</h2>
                    <p className="text-white/70 text-xl mb-8 max-w-2xl">
                        Join thousands of creators, entrepreneurs, and go-getters who are already winning with TaskFlow.
                    </p>
                    <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-12 py-5 rounded-3xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                        Start Your Journey ✨
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 4s ease-in-out infinite 2s;
                }
            `}</style>
        </div>
    );
}