import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, CheckCircle, Clock, AlertTriangle, Edit3, Trash2, Star } from 'lucide-react';
import { useTasks } from '../context/TasksProvider';
import TaskForm from '../components/tasks/TaskForm';

export default function Tasks() {
  // Get everything from context instead of managing separate state
  const { tasks, loading, deleteTask, addTask, updateTask } = useTasks();
  
  console.log('Tasks component - tasks:', tasks);
  console.log('Tasks component - loading:', loading);
  console.log('Tasks component - addTask function:', typeof addTask);
  
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-[#FBF3D5] text-amber-700 border-[#D6DAC8]';
      default:
        return 'bg-[#D6DAC8] text-green-700 border-[#9CAFAA]';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#D6DAC8] text-emerald-700 border-[#9CAFAA]';
      case 'in-progress':
        return 'bg-[#FBF3D5] text-blue-700 border-[#D6DAC8]';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  // Handle task status update
  const updateTaskStatus = async (taskId, newStatus) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      try {
        await updateTask(taskId, task.title, task.description, task.priority, newStatus);
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  };

  // Handle task priority update
  const updateTaskPriority = async (taskId, newPriority) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      try {
        await updateTask(taskId, task.title, task.description, newPriority, task.status);
      } catch (error) {
        console.error('Failed to update task priority:', error);
      }
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  return (
  <div className="min-h-screen w-full overflow-x-hidden bg-white pt-20 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-[#A0AA9A] font-bold text-slate-800 mb-2">
            Task Management ✨
          </h1>
          <p className="text-gray-500 text-lg">
            Organize, prioritize, and track your tasks efficiently
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg mb-8">
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
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#D6DAC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6A99D] focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white border border-[#D6DAC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6A99D] appearance-none"
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
              onClick={() => {
                setFormMode("add");
                setSelectedTask(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 bg-[#A0AA9A] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#c49488]"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#D6DAC8]">
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
          {loading ? (
            <div className="text-center py-12 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#D6DAC8]">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D6A99D] mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#D6DAC8]">
              <div className="text-slate-400 mb-4">
                <Star className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No tasks found</h3>
              <p className="text-slate-500">Create your first task to get started!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
                    
                    {/* Created Date */}
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-[#FBF3D5] text-slate-700 rounded-full text-sm font-medium border border-[#D6DAC8]">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status and Priority Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600">Status:</span>
                        <select
                          value={task.status || 'pending'}
                          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(task.status || 'pending')} focus:outline-none focus:ring-2 focus:ring-[#D6A99D]`}
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
                          onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getPriorityColor(task.priority)} focus:outline-none focus:ring-2 focus:ring-[#D6A99D]`}
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
                      onClick={() => {
                        setSelectedTask(task);
                        setFormMode("edit");
                        setShowForm(true);
                      }}
                      className="p-2 text-[#9CAFAA] hover:bg-[#FBF3D5] rounded-xl transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-[#9CAFAA] hover:bg-[#FBF3D5] rounded-xl transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <div 
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-[#D6DAC8] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskForm
                mode={formMode}
                task={selectedTask}
                onClose={() => setShowForm(false)}
                addTask={addTask}
                updateTask={updateTask}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}