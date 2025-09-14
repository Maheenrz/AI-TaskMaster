import TaskStats from "../components/tasks/TaskStats";
import { useTasks } from "../context/TasksProvider"; // ✅ use the hook

export default function Home() {
  const { tasks } = useTasks(); // ✅ cleaner

  return (
    <div className="min-h-screen w-full bg-gray-100 mt-16 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow p-6">
            <TaskStats tasks={tasks} />
          </div>
          <div className="col-span-1 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 mb-2">Welcome back!</span>
            <span className="text-lg font-semibold">Here's your task overview.</span>
          </div>
        </div>
        {/* More dashboard widgets/components can go here */}
      </div>
    </div>
  );
}
