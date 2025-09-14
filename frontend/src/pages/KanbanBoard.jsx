import React, { useState } from 'react';
import { Plus, MoreHorizontal, Clock, CheckCircle, AlertTriangle, User, Calendar } from 'lucide-react';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState({
    pending: [
      {
        id: 1,
        title: "Design System Updates",
        description: "Update color palette and typography guidelines",
        priority: "high",
        assignee: "Sarah Chen",
        dueDate: "2024-01-15",
        tags: ["design", "urgent"]
      },
      {
        id: 2,
        title: "API Documentation",
        description: "Document new authentication endpoints",
        priority: "medium",
        assignee: "John Doe",
        dueDate: "2024-01-18",
        tags: ["docs", "backend"]
      },
      {
        id: 3,
        title: "User Testing Session",
        description: "Conduct usability testing for the new dashboard",
        priority: "low",
        assignee: "Emily Davis",
        dueDate: "2024-01-20",
        tags: ["research", "ux"]
      }
    ],
    'in-progress': [
      {
        id: 4,
        title: "Mobile App Optimization",
        description: "Improve loading speed and user experience",
        priority: "high",
        assignee: "Mike Johnson",
        dueDate: "2024-01-12",
        tags: ["mobile", "performance"]
      },
      {
        id: 5,
        title: "Database Migration",
        description: "Migrate user data to new database schema",
        priority: "medium",
        assignee: "Alex Rivera",
        dueDate: "2024-01-16",
        tags: ["backend", "database"]
      }
    ],
    completed: [
      {
        id: 6,
        title: "Landing Page Redesign",
        description: "Complete redesign of the main landing page",
        priority: "high",
        assignee: "Lisa Wong",
        dueDate: "2024-01-10",
        tags: ["design", "frontend"]
      },
      {
        id: 7,
        title: "Security Audit",
        description: "Complete security review of authentication system",
        priority: "high",
        assignee: "David Kim",
        dueDate: "2024-01-08",
        tags: ["security", "audit"]
      }
    ]
  });

  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(null);

  const columnConfig = {
    pending: {
      title: "To Do",
      icon: AlertTriangle,
      color: "from-orange-400 to-red-400",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    'in-progress': {
      title: "In Progress",
      icon: Clock,
      color: "from-blue-400 to-indigo-400",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    completed: {
      title: "Completed",
      icon: CheckCircle,
      color: "from-emerald-400 to-teal-400",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
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

  const handleDragStart = (e, task, sourceColumn) => {
    setDraggedTask({ task, sourceColumn });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.sourceColumn !== targetColumn) {
      const { task, sourceColumn } = draggedTask;
      
      setTasks(prev => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter(t => t.id !== task.id),
        [targetColumn]: [...prev[targetColumn], task]
      }));
    }
    
    setDraggedTask(null);
  };

  const TaskCard = ({ task, columnKey }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task, columnKey)}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-move hover:scale-105 border border-purple-100"
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">
          {task.title}
        </h3>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Task Description */}
      <p className="text-slate-600 text-xs mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
        {task.tags.length > 2 && (
          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
            +{task.tags.length - 2}
          </span>
        )}
      </div>

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Priority Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-slate-500">
          {/* Assignee */}
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span className="text-xs">{task.assignee.split(' ')[0]}</span>
          </div>
          
          {/* Due Date */}
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 pt-20 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Kanban Board 📋
          </h1>
          <p className="text-slate-600 text-lg">
            Visualize your workflow and manage tasks efficiently
          </p>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(columnConfig).map(([columnKey, config]) => {
            const columnTasks = tasks[columnKey] || [];
            const IconComponent = config.icon;
            
            return (
              <div
                key={columnKey}
                className={`${config.bgColor} rounded-3xl p-6 border-2 ${config.borderColor} min-h-[600px]`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columnKey)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {config.title}
                      </h2>
                      <p className="text-sm text-slate-600">
                        {columnTasks.length} tasks
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAddForm(columnKey)}
                    className="w-8 h-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center text-slate-600 hover:text-purple-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Task Cards */}
                <div className="space-y-4">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} columnKey={columnKey} />
                  ))}
                  
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <IconComponent className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm">No tasks yet</p>
                      <p className="text-xs">Drop tasks here or create new ones</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Task Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-purple-100 shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Add Task to {columnConfig[showAddForm].title}
              </h2>
              
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
                
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300">
                    <option value="">Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  
                  <input
                    type="date"
                    className="p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Assignee name..."
                  className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                
                <input
                  type="text"
                  placeholder="Tags (comma separated)..."
                  className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowAddForm(null)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Board Stats */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-100 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Board Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
              <p className="text-2xl font-bold text-slate-800">
                {Object.values(tasks).flat().length}
              </p>
              <p className="text-sm text-slate-600">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
              <p className="text-2xl font-bold text-orange-600">
                {tasks.pending.length}
              </p>
              <p className="text-sm text-orange-600">To Do</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <p className="text-2xl font-bold text-blue-600">
                {tasks['in-progress'].length}
              </p>
              <p className="text-sm text-blue-600">In Progress</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
              <p className="text-2xl font-bold text-emerald-600">
                {tasks.completed.length}
              </p>
              <p className="text-sm text-emerald-600">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}