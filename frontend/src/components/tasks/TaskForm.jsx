import { useState, useEffect, useRef } from "react";

export default function TaskForm({ mode, task, onClose, addTask, updateTask }) {
  const [errors, setErrors] = useState({ title: "", description: "", priority: "" });
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({ title: false, description: false, priority: false });

  const [formData, setFormData] = useState({ title: "", description: "", priority: "medium" });
  const titleRef = useRef(null);

  // validate inputs
  useEffect(() => {
    const newErrors = { title: "", description: "", priority: "" };
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }
    if (formData.description.trim().length > 0 && formData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters long if provided";
    }
    if (!["low", "medium", "high"].includes(formData.priority)) {
      newErrors.priority = "Priority must be low, medium, or high";
    }
    setErrors(newErrors);
    setIsValid(Object.values(newErrors).every((err) => err === ""));
  }, [formData]);

  // reset form when adding
  useEffect(() => {
    if (mode === "add") {
      titleRef.current?.focus();
      setFormData({ title: "", description: "", priority: "medium" });
    }
  }, [mode]);

  // load task data when editing
  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "medium",
      });
      titleRef.current?.focus();
    }
  }, [mode, task]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    if (mode === "add") {
      await addTask(formData.title, formData.description, formData.priority);
    } else {
      await updateTask(task._id, formData.title, formData.description, formData.priority);
    }

    onClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">
          {mode === "add" ? "Add New Task" : "Edit Task"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition"
        >
          ✕
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          ref={titleRef}
          type="text"
          placeholder="Enter title"
          value={formData.title}
          onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.title && errors.title ? "border-red-400" : "border-gray-300"
            }`}
          required
        />
        {touched.title && errors.title && (
          <span className="text-sm text-red-500">{errors.title}</span>
        )}

        <textarea
          placeholder="Enter description"
          value={formData.description}
          onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.description && errors.description
              ? "border-red-400"
              : "border-gray-300"
            }`}
          rows="4"
        />
        {touched.description && errors.description && (
          <span className="text-sm text-red-500">{errors.description}</span>
        )}

        <select
          className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${touched.priority && errors.priority
              ? "border-red-400"
              : "border-gray-300"
            }`}
          value={formData.priority}
          onBlur={() => setTouched((prev) => ({ ...prev, priority: true }))}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {touched.priority && errors.priority && (
          <span className="text-sm text-red-500">{errors.priority}</span>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {mode === "add" ? "Add Task" : "Update Task"}
        </button>
      </form>
    </div>
  );
}
