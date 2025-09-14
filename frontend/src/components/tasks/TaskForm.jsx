import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function TaskForm({ mode, task, onClose, addTask, updateTask }) {
  const [errors, setErrors] = useState({ title: "", description: "", priority: "" });
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({ title: false, description: false, priority: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    priority: "medium",
    status: "pending" 
  });
  
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
      setFormData({ 
        title: "", 
        description: "", 
        priority: "medium",
        status: "pending" 
      });
      setTouched({ title: false, description: false, priority: false });
    }
  }, [mode]);

  // load task data when editing
  useEffect(() => {
    if (mode === "edit" && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "pending",
      });
      setTouched({ title: false, description: false, priority: false });
      titleRef.current?.focus();
    }
  }, [mode, task]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (mode === "add") {
        await addTask(formData.title, formData.description, formData.priority);
      } else {
        await updateTask(task._id, formData.title, formData.description, formData.priority, formData.status);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === "add" ? "Add New Task" : "Edit Task"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-[#9CAFAA] hover:bg-[#FBF3D5] rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Task Title *
          </label>
          <input
            ref={titleRef}
            type="text"
            placeholder="Enter task title"
            value={formData.title}
            onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6A99D] focus:border-transparent transition-colors ${
              touched.title && errors.title 
                ? "border-red-400 bg-red-50" 
                : "border-[#D6DAC8] bg-white hover:border-[#D6A99D]"
            }`}
            required
          />
          {touched.title && errors.title && (
            <span className="text-sm text-red-500 mt-1 block">{errors.title}</span>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter task description (optional)"
            value={formData.description}
            onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6A99D] focus:border-transparent transition-colors resize-none ${
              touched.description && errors.description
                ? "border-red-400 bg-red-50"
                : "border-[#D6DAC8] bg-white hover:border-[#D6A99D]"
            }`}
            rows="4"
          />
          {touched.description && errors.description && (
            <span className="text-sm text-red-500 mt-1 block">{errors.description}</span>
          )}
        </div>

        {/* Priority Select */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Priority *
          </label>
          <select
            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6A99D] focus:border-transparent transition-colors ${
              touched.priority && errors.priority
                ? "border-red-400 bg-red-50"
                : "border-[#D6DAC8] bg-white hover:border-[#D6A99D]"
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
            <span className="text-sm text-red-500 mt-1 block">{errors.priority}</span>
          )}
        </div>

        {/* Status Select (only show when editing) */}
        {mode === "edit" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              className="w-full p-3 border border-[#D6DAC8] bg-white hover:border-[#D6A99D] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6A99D] focus:border-transparent transition-colors"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#9CAFAA] text-[#9CAFAA] rounded-xl hover:bg-[#FBF3D5] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1 px-6 py-3 bg-[#D6A99D] text-white rounded-xl font-semibold hover:shadow-lg hover:bg-[#c49488] disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-slate-300 transition-all duration-300"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              mode === "add" ? "Add Task" : "Update Task"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}