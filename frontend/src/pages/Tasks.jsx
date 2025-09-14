import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, CheckCircle, Clock, AlertTriangle, Edit3, Trash2, Star } from 'lucide-react';

export default function Tasks() {
  // Mock tasks data - replace with actual context data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design new landing page",
      description: "Create a modern, responsive landing page with animations",
      status: "completed",
      priority: "high",
      tags: ["design", "urgent"]
    },
    {
      id: 2,
      title: "Review pull requests",
      description: "Check and approve pending code reviews",
      status: "in-progress",
      priority: "medium",
      tags: ["development", "review"]
    },
    {
      id: 3,
      title: "Update documentation",
      description: "Add new API endpoints to the documentation",
      status: "pending",
      priority: "low",
      tags: ["docs"]
    },
    {
      id: 4,
      title: "Team standup meeting",
      description: "Daily team sync and progress update",
      status: "completed",
      priority: "medium",
      tags: ["meeting"]
    },
    {
      id: 5,
      title: "Fix critical bug in payment system",
      description: "Resolve the issue with payment processing failures",
      status: "pending",
      priority: "high",
      tags: ["bug", "urgent", "payment"]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  // Update task status
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Update task priority
  const updateTaskPriority = (taskId, newPriority) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchFilter = filter === "all" || task.status === filter;
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const taskText = (task.title + " " + task.description).toLowerCase();
    const matchSearch = searchWords.every((word) => taskText.includes(word));
    return matchFilter && matchSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 pt-20 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Task Management ✨
          </h1>
          <p className="text-slate-600 text-lg">
            Organize, prioritize, and track your tasks efficiently
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-100 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search and Filters */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 appearance-none"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{tasks.length}</p>
              <p className="text-sm text-slate-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{tasks.filter(t => t.status === 'pending').length}</p>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{tasks.filter(t => t.status === 'in-progress').length}</p>
              <p className="text-sm text-slate-600">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{tasks.filter(t => t.status === 'completed').length}</p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-purple-100">
              <div className="text-slate-400 mb-4">
                <Star className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No tasks found</h3>
              <p className="text-slate-500">Create your first task to get started!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between">
                  
                  {/* Task Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusIcon(task.status)}
                      <h3 className={`text-xl font-semibold ${
                        task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'
                      }`}>
                        {task.title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-600 mb-4">{task.description}</p>
                    
                    {/* Tags */}
                    <div className="flex items-center space-x-2 mb-4">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Status and Priority Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600">Status:</span>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(task.status)} focus:outline-none focus:ring-2 focus:ring-purple-300`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600">Priority:</span>
                        <select
                          value={task.priority}
                          onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getPriorityColor(task.priority)} focus:outline-none focus:ring-2 focus:ring-purple-300`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Form Modal (placeholder) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-purple-100 shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Task</h2>
              {/* Add your task form here */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title..."
                  className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <textarea
                  placeholder="Task description..."
                  rows="3"
                  className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                ></textarea>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}