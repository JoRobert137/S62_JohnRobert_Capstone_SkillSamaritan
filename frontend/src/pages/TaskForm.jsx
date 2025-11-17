import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Tags, Coins, FileText, Sparkles } from "lucide-react";

const TaskForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    points: "",
    skillsRequired: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pointsError, setPointsError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "points") {
        if (value !== "" && Number(value) < 20) {
        setPointsError("Minimum 20 points required.");
        } else {
        setPointsError("");
        }
    }

    setForm({ ...form, [name]: value });
    };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const skillsArray = form.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      await axios.post(
        "http://localhost:8080/api/tasks",
        {
          title: form.title,
          description: form.description,
          points: Number(form.points),
          skillsRequired: skillsArray,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Number(form.points) < 20) {
        setMessage("Please enter at least 20 points.");
        setIsLoading(false);
        return;
    }


      setMessage("Task created successfully!");
      setTimeout(() => navigate("/tasks"), 1200);

    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create task.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-green-100">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white">Create a New Task</h2>
          </div>
          <p className="text-green-100">Share what you need help with and reward helpful neighbors</p>
        </div>

        <div className="p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center border ${
              message.includes("success") 
                ? "bg-green-100 text-green-700 border-green-200" 
                : "bg-red-100 text-red-700 border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Pencil className="h-4 w-4 text-green-500" />
                Task Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g., Help me fix a React component bug"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Describe the task in detail... What exactly do you need help with? What should the helper know?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    Reward Points (min: 20)
                </label>

                <div className="relative">
                    <input
                    name="points"
                    type="number"
                    value={form.points}
                    onChange={handleChange}
                    required
                    min="1"
                    max="1000"
                    placeholder="e.g., 50"
                    className={`w-full pl-4 pr-12 py-3 border rounded-lg focus:outline-none
                        focus:ring-2 transition-all duration-200
                        ${pointsError ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"}
                    `}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        POINTS
                    </span>
                    </div>
                </div>

                {pointsError && (
                    <p className="text-sm text-red-600 font-medium">{pointsError}</p>
                )}

                <p className="text-xs text-gray-500">
                    Suggested: 20-50 for small tasks, 50-100 for medium, 100+ for complex
                </p>
                </div>


              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Tags className="h-4 w-4 text-green-500" />
                  Skills Required
                </label>
                <input
                  name="skillsRequired"
                  value={form.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, Gardening, Cooking"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Separate multiple skills with commas</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Task...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Create Task & Share with Community
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Tips for a great task post:
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Be specific about what you need help with</li>
              <li>• Mention any tools or materials required</li>
              <li>• Set appropriate points based on task complexity</li>
              <li>• Include relevant skills to attract the right helpers</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskForm;