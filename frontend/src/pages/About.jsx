import { Info, Target, Users, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-20 p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#D6A99D] mb-4 flex items-center justify-center">
            <Info className="w-8 h-8 mr-2" />
            About This App
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our app is designed to help you stay organized, manage tasks efficiently, 
            and focus on what really matters. Minimal, intuitive, and flexible for everyone. 
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-[#D6DAC8] shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            We believe productivity tools should be simple, elegant, and 
            accessible to everyone. Our mission is to provide a platform 
            where users can not only create and manage tasks, but also track 
            their progress, analyze performance, and collaborate effortlessly.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FBF3D5] rounded-2xl p-6 border border-[#D6DAC8] shadow">
            <Target className="w-8 h-8 text-[#D6A99D] mb-3" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Stay Focused</h3>
            <p className="text-slate-600">
              Prioritize your tasks and focus on high-impact work with 
              a clean and distraction-free dashboard.
            </p>
          </div>

          <div className="bg-[#D6DAC8] rounded-2xl p-6 border border-[#9CAFAA] shadow">
            <Users className="w-8 h-8 text-[#9CAFAA] mb-3" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Collaborate</h3>
            <p className="text-slate-600">
              Share your tasks and progress with teammates or friends 
              for better accountability and teamwork.
            </p>
          </div>

          <div className="bg-[#FBF3D5] rounded-2xl p-6 border border-[#D6DAC8] shadow">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Track Progress</h3>
            <p className="text-slate-600">
              Visualize your completion rates and task breakdowns with 
              easy-to-read charts and analytics.
            </p>
          </div>

          <div className="bg-[#D6DAC8] rounded-2xl p-6 border border-[#9CAFAA] shadow">
            <Info className="w-8 h-8 text-[#D6A99D] mb-3" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Simple & Minimal</h3>
            <p className="text-slate-600">
              No clutter, no complexity. Just the tools you need to 
              stay productive and organized every day.
            </p>
          </div>
        </div>

        {/* Closing Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Start organizing your life today.
          </h2>
          <p className="text-slate-600 mb-6">
            Join us and take control of your productivity with a simple, 
            beautiful, and effective task manager.
          </p>
          <a
            href="/tasks"
            className="px-6 py-3 bg-[#D6A99D] text-white rounded-xl font-medium hover:bg-[#c49488] transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
