import { useState, useEffect, useContext, useRef, useReducer } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";


export default function TaskStats({ tasks }) {
    const [viewMode, setViewMode] = useState("charts"); // "charts" or "summary or list"
    const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "low", "medium", "high"
    const [statusFilter, setStatusFilter] = useState("all"); // "all", "pending", "completed"
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        byPriority: { low: 0, medium: 0, high: 0 },
    });
    const [isLoading, setIsLoading] = useState(false);


    // Calculate stats whenever tasks or filters change
    useEffect(() => {
        setIsLoading(true);
        const filteredTasks = tasks.filter((task) => {
            const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter;
            const statusMatch = statusFilter === "all" || task.status === statusFilter;
            return priorityMatch && statusMatch;
        })
        const newStats = {
            total: filteredTasks.length,
            pending: filteredTasks.filter((t) => t.status === "pending").length,
            completed: filteredTasks.filter((t) => t.status === "completed").length,
            byPriority: {
                low: filteredTasks.filter((t) => t.priority === "low").length,
                medium: filteredTasks.filter((t) => t.priority === "medium").length,
                high: filteredTasks.filter((t) => t.priority === "high").length,
            }

        }
        setStats(newStats);
        setIsLoading(false);

    }, [tasks, priorityFilter, statusFilter]);


    return (
        <div
            className="p-6 rounded-lg shadow-md w-full max-w-4xl mt-16"
        >
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                Task Statistics
            </h2>

            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 rounded-l-md ${viewMode === "charts"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 border"
                        }`}
                    onClick={() => setViewMode("charts")}
                >
                    Charts
                </button>

                <button
                    className={`px-4 py-2 border-t border-b ${viewMode === "summary"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 border"
                        }`}
                    onClick={() => setViewMode("summary")}
                >
                    Summary
                </button>
                <button
                    className={`px-4 py-2 border-t border-b ${viewMode === "lists"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 border"
                        }`}
                    onClick={() => setViewMode("lists")}
                >
                    Lists
                </button>

                {/* setting priority filter */}
                <select
                    className="ml-4 px-3 py-2 border rounded-md"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value={"all"}>All</option>
                    <option value={"low"}>Low</option>
                    <option value={"medium"}>Medium</option>
                    <option value={"high"}>High</option>
                </select>

                {/* setting status filter */}
                <select
                    className="ml-4 px-3 py-2 border rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value={"all"}>All</option>
                    <option value={"pending"}>Pending</option>
                    <option value={"completed"}>Completed</option>
                </select>
            </div>

            {/* show stats */}
            {/* display stats UI based on different view modes */}
            {/* summary */}
            {viewMode === "summary" && (
                <div className="mt-6 text-center text-gray-700">
                    <p className="text-lg">
                        Here is a quick summary of your tasks. Use the filters above to refine the stats.
                    </p>
                    <div className="text-center text-gray-700">
                        {isLoading ? (
                            <p>Loading stats...</p>
                        ) : (
                            <>
                                <p className="text-lg">
                                    <span className="font-semibold">Total Tasks:</span> {stats.total}
                                </p>
                                <p className="text-lg">
                                    <span className="font-semibold">Pending:</span> {stats.pending}
                                </p>
                                <p className="text-lg">
                                    <span className="font-semibold">Completed:</span> {stats.completed}
                                </p>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold mb-2">By Priority:</h3>
                                    <p>
                                        <span className="font-semibold">Low:</span> {stats.byPriority.low}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Medium:</span> {stats.byPriority.medium}
                                    </p>
                                    <p>
                                        <span className="font-semibold">High:</span> {stats.byPriority.high}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* lists */}
            {viewMode === "lists" && (
                <div className="mt-6 text-center text-gray-700">
                    <p className="text-lg mb-4">
                        Here is a list of your tasks. Use the filters above to refine the list.
                    </p>
                    {isLoading ? (
                        <p>Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p>No tasks available.</p>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className="border-b py-2">
                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                <p className="text-gray-600">{task.description}</p>
                                <p className="text-sm text-gray-500">
                                    Priority: {task.priority} | Status: {task.status} | Created At: {task.createdAt}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}


            {/* charts */}
            {viewMode === "charts" && (
                <div className="flex flex-col md:flex-row justify-center gap-8 mt-6">
                    {/* Pie Chart */}
                    <PieChart width={300} height={300}>
                        <Pie
                            data={[
                                { name: "Low", value: stats.byPriority.low },
                                { name: "Medium", value: stats.byPriority.medium },
                                { name: "High", value: stats.byPriority.high }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            <Cell fill="#82ca9d" />
                            <Cell fill="#8884d8" />
                            <Cell fill="#ff8042" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>

                    {/* Bar Chart */}
                    <BarChart width={300} height={300} data={[
                        { name: "Pending", value: stats.pending },
                        { name: "Completed", value: stats.completed }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </div>
            )}

        </div>
    );
};