import { useState, useEffect } from "react";
import { Search, Calendar, Clock, CheckCircle, AlertTriangle, TrendingUp, Filter, Users, Target, Activity } from "lucide-react";
import TaskStats from "../components/tasks/TaskStats";
import { useTasks } from "../context/TasksProvider";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { tasks, loading } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [quickStats, setQuickStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    completionRate: 0,
    recentTasks: []
  });

  // Calculate quick stats
  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get recent tasks (last 5)
    const recentTasks = tasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setQuickStats({
      total,
      completed,
      pending,
      inProgress,
      completionRate,
      recentTasks
    });
  }, [tasks]);

  // Filter tasks based on search
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority).length;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-[#FBF3D5] text-amber-700';
      default:
        return 'bg-[#D6DAC8] text-green-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D6A99D]"></div>
          <span className="ml-4 text-slate-600 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#D6A99D] mb-2 text-left ">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 text-lg text-left">
                Welcome back! Here's what's happening with your tasks today.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mt-4 lg:mt-0 lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-xl border border-[#D6DAC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6A99D] focus:border-transparent shadow-lg"
              />
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Tasks */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-800">{quickStats.total}</p>
                </div>
                <div className="p-3 bg-[#FBF3D5] rounded-2xl">
                  <Target className="w-6 h-6 text-[#D6A99D]" />
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-[#D6A99D]">{quickStats.completionRate}%</p>
                </div>
                <div className="p-3 bg-[#FBF3D5] rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-[#D6A99D]" />
                </div>
              </div>
              <div className="mt-3 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-[#D6A99D] rounded-full h-2 transition-all duration-500"
                  style={{ width: `${quickStats.completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-[#D6A99D]">{quickStats.pending}</p>
                </div>
                <div className="p-3 bg-[#FBF3D5] rounded-2xl">
                  <Clock className="w-6 h-6 text-[#D6A99D]" />
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-[#D6A99D]">{quickStats.inProgress}</p>
                </div>
                <div className="p-3 bg-[#FBF3D5] rounded-2xl">
                  <Activity className="w-6 h-6 text-[#D6A99D]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

          {/* Task Statistics - Takes up 2/3 of the width */}
          <div className="xl:col-span-2">
            <TaskStats tasks={filteredTasks} />
          </div>

          {/* Sidebar with Recent Tasks and Priority Breakdown */}
          <div className="xl:col-span-1 space-y-6">

            {/* Priority Breakdown */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-[#D6A99D]" />
                Priority Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="font-medium text-red-700">High Priority</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{getTasksByPriority('high')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FBF3D5] rounded-xl border border-[#D6DAC8]">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                    <span className="font-medium text-amber-700">Medium Priority</span>
                  </div>
                  <span className="text-xl font-bold text-amber-600">{getTasksByPriority('medium')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#D6DAC8] rounded-xl border border-[#9CAFAA]">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-medium text-green-700">Low Priority</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{getTasksByPriority('low')}</span>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#D6A99D]" />
                Recent Tasks
              </h3>

              {quickStats.recentTasks.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No tasks yet. Start by creating your first task!
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {quickStats.recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-800 text-sm line-clamp-1">
                          {task.title}
                        </h4>
                        {getStatusIcon(task.status)}
                      </div>

                      <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/tasks")}
                  className="w-full p-3 bg-[#D6A99D] text-white rounded-xl font-medium hover:bg-[#c49488] transition-colors flex items-center justify-center"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create New Task
                </button>
                <button
                  onClick={() => navigate("/analytics")}
                  className="w-full p-3 bg-[#D6DAC8] text-slate-700 rounded-xl font-medium hover:bg-[#c5d4c0] transition-colors flex items-center justify-center"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Search Results ({filteredTasks.length} tasks found)
            </h3>

            {filteredTasks.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No tasks match your search term "{searchTerm}"
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.slice(0, 6).map((task) => (
                  <div
                    key={task._id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 truncate">{task.title}</h4>
                      {getStatusIcon(task.status)}
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-500">
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredTasks.length > 6 && (
              <div className="text-center mt-4">
                <button className="px-6 py-2 bg-[#D6A99D] text-white rounded-xl font-medium hover:bg-[#c49488] transition-colors">
                  View All {filteredTasks.length} Results
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}