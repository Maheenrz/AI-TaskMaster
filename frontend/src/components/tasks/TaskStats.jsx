import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";
import { BarChart3, PieChart as PieChartIcon, List, TrendingUp, Filter, Calendar, Eye } from "lucide-react";

export default function TaskStats({ tasks }) {
    const [viewMode, setViewMode] = useState("charts");
    const [chartType, setChartType] = useState("pie"); // "pie", "bar", "line"
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState("all"); // "all", "week", "month"
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        inProgress: 0,
        byPriority: { low: 0, medium: 0, high: 0 },
        completionTrend: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);

    // Calculate stats and filter tasks
    useEffect(() => {
        setIsLoading(true);
        
        // Apply date filter first
        let tasksToFilter = [...tasks];
        if (dateRange !== "all") {
            const now = new Date();
            const cutoffDate = new Date();
            
            if (dateRange === "week") {
                cutoffDate.setDate(now.getDate() - 7);
            } else if (dateRange === "month") {
                cutoffDate.setMonth(now.getMonth() - 1);
            }
            
            tasksToFilter = tasksToFilter.filter(task => 
                new Date(task.createdAt) >= cutoffDate
            );
        }

        // Apply priority and status filters
        const filtered = tasksToFilter.filter((task) => {
            const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter;
            const statusMatch = statusFilter === "all" || task.status === statusFilter;
            return priorityMatch && statusMatch;
        });

        setFilteredTasks(filtered);

        // Calculate completion trend (last 7 days)
        const completionTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayTasks = tasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate.toDateString() === date.toDateString();
            });
            const completed = dayTasks.filter(task => task.status === 'completed').length;
            
            completionTrend.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                completed: completed,
                total: dayTasks.length
            });
        }

        const newStats = {
            total: filtered.length,
            pending: filtered.filter((t) => t.status === "pending").length,
            completed: filtered.filter((t) => t.status === "completed").length,
            inProgress: filtered.filter((t) => t.status === "in-progress").length,
            byPriority: {
                low: filtered.filter((t) => t.priority === "low").length,
                medium: filtered.filter((t) => t.priority === "medium").length,
                high: filtered.filter((t) => t.priority === "high").length,
            },
            completionTrend
        };
        
        setStats(newStats);
        setIsLoading(false);
    }, [tasks, priorityFilter, statusFilter, dateRange]);

    // Chart data preparations
    const priorityData = [
        { name: "High", value: stats.byPriority.high, color: "#eb8a8aff" },
        { name: "Medium", value: stats.byPriority.medium, color: "#f0c67eff" },
        { name: "Low", value: stats.byPriority.low, color: "#bff1e0ff" }
    ];

    const statusData = [
        { name: "Pending", value: stats.pending, color: "#f0c67eff" },
        { name: "In Progress", value: stats.inProgress, color: "#99befaff" },
        { name: "Completed", value: stats.completed, color: "#bff1e0ff" }
    ];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                className="text-sm font-semibold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-[#D6DAC8] shadow-lg">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 lg:mb-0 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-[#D6A99D]" />
                    Task Analytics
                </h2>
                
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                    <button
                        className={`p-2 rounded-xl transition-colors ${viewMode === "charts"
                            ? "bg-[#D6A99D] text-white shadow-lg"
                            : "bg-[#FBF3D5] text-slate-600 hover:bg-[#D6DAC8]"
                        }`}
                        onClick={() => setViewMode("charts")}
                        title="Charts View"
                    >
                        <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-2 rounded-xl transition-colors ${viewMode === "summary"
                            ? "bg-[#D6A99D] text-white shadow-lg"
                            : "bg-[#FBF3D5] text-slate-600 hover:bg-[#D6DAC8]"
                        }`}
                        onClick={() => setViewMode("summary")}
                        title="Summary View"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-2 rounded-xl transition-colors ${viewMode === "lists"
                            ? "bg-[#D6A99D] text-white shadow-lg"
                            : "bg-[#FBF3D5] text-slate-600 hover:bg-[#D6DAC8]"
                        }`}
                        onClick={() => setViewMode("lists")}
                        title="List View"
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[#FBF3D5] rounded-2xl border border-[#D6DAC8]">
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Filters:</span>
                </div>
                
                <select
                    className="px-3 py-2 bg-white border border-[#D6DAC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A99D]"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="all">All Priorities</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>

                <select
                    className="px-3 py-2 bg-white border border-[#D6DAC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A99D]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    className="px-3 py-2 bg-white border border-[#D6DAC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A99D]"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                </select>

                {viewMode === "charts" && (
                    <select
                        className="px-3 py-2 bg-white border border-[#D6DAC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D6A99D]"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        <option value="pie">Pie Charts</option>
                        <option value="bar">Bar Charts</option>
                        <option value="line">Trend Line</option>
                    </select>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D6A99D] mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading statistics...</p>
                </div>
            )}

            {/* Summary View */}
            {!isLoading && viewMode === "summary" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
                        <div className="text-sm font-medium text-blue-700">Total Tasks</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                        <div className="text-3xl font-bold text-orange-600 mb-2">{stats.pending}</div>
                        <div className="text-sm font-medium text-orange-700">Pending</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{stats.inProgress}</div>
                        <div className="text-sm font-medium text-blue-700">In Progress</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.completed}</div>
                        <div className="text-sm font-medium text-emerald-700">Completed</div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 mt-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Priority Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {priorityData.map((item, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div 
                                                className="w-4 h-4 rounded-full mr-3"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <span className="font-medium text-slate-700">{item.name} Priority</span>
                                        </div>
                                        <span className="text-xl font-bold" style={{ color: item.color }}>
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* List View */}
            {!isLoading && viewMode === "lists" && (
                <div>
                    <div className="mb-4 text-slate-600">
                        Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} 
                        {(priorityFilter !== "all" || statusFilter !== "all" || dateRange !== "all") && " (filtered)"}
                    </div>
                    
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <List className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p>No tasks found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {filteredTasks.map((task) => (
                                <div key={task._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'medium' ? 'bg-[#FBF3D5] text-amber-700' :
                                                'bg-[#D6DAC8] text-green-700'
                                            }`}>
                                                {task.priority}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 mb-2">{task.description}</p>
                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                        {task.updatedAt && (
                                            <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Charts View */}
            {!isLoading && viewMode === "charts" && (
                <div className="space-y-8">
                    {chartType === "pie" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Priority Distribution */}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Priority Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={priorityData.filter(item => item.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {priorityData.map((entry, index) => (
                                                <Cell key={`priority-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid #D6DAC8',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Status Distribution */}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusData.filter(item => item.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`status-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid #D6DAC8',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {chartType === "bar" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Priority Bar Chart */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Tasks by Priority</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={priorityData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid #D6DAC8',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#D6A99D" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Status Bar Chart */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Tasks by Status</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={statusData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: '1px solid #D6DAC8',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#9CAFAA" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {chartType === "line" && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                                Task Completion Trend (Last 7 Days)
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={stats.completionTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #D6DAC8',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="completed" 
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                                        name="Completed Tasks"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#D6A99D" 
                                        strokeWidth={3}
                                        dot={{ fill: '#D6A99D', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: '#D6A99D', strokeWidth: 2 }}
                                        name="Total Tasks"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && stats.total === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
                    <p>Create some tasks to see your analytics here!</p>
                </div>
            )}
        </div>
    );
}