import { createContext, useContext, useState, useEffect } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // ✅ get JWT from storage
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // ✅ add header if token exists
    };
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      console.log('Fetch tasks response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Fetch tasks error:', errorText);
        throw new Error(`Failed to fetch tasks: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      alert('Failed to fetch tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when provider mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title, description, priority) => {
    try {
      console.log('Adding task:', { title, description, priority });
      
      const taskData = {
        title: title.trim(),
        description: description ? description.trim() : "",
        priority: priority || "medium"
      };
      
      console.log('Sending task data:', taskData);
      
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      
      console.log('Add task response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Add task error response:', errorText);
        throw new Error(`Failed to add task: ${res.status} ${errorText}`);
      }
      
      const newTask = await res.json();
      console.log('New task created:', newTask);
      
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const updateTask = async (id, title, description, priority, status) => {
    try {
      console.log('Updating task:', { id, title, description, priority, status });
      
      const taskData = {
        title: title.trim(),
        description: description ? description.trim() : "",
        priority: priority || "medium"
      };
      
      // Only include status if it's provided
      if (status) {
        taskData.status = status;
      }
      
      console.log('Sending update data:', taskData);
      
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      
      console.log('Update task response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Update task error response:', errorText);
        throw new Error(`Failed to update task: ${res.status} ${errorText}`);
      }
      
      const updated = await res.json();
      console.log('Task updated:', updated);
      
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return updated;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      console.log('Deleting task:', id);
      
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      console.log('Delete task response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete task error response:', errorText);
        throw new Error(`Failed to delete task: ${res.status} ${errorText}`);
      }
      
      console.log('Task deleted successfully');
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        fetchTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};