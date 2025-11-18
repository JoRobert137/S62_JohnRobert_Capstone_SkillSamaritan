/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Clock, Coins, Tags, CheckCircle, CircleAlert } from "lucide-react";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`https://s62-johnrobert-capstone-skillsamaritan.onrender.com/api/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        setMessage("Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading task...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Task not found
      </div>
    );
  }

  const isCreator = token && task.createdBy?._id === JSON.parse(atob(token.split('.')[1])).id;
  const isAcceptedByUser = task.acceptedBy?._id === JSON.parse(atob(token.split('.')[1])).id;

  const handleAccept = async () => {
    try {
      await axios.put(
        `https://s62-johnrobert-capstone-skillsamaritan.onrender.com/api/tasks/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Task accepted successfully!");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to accept task");
    }
  };

  const handleComplete = async () => {
    try {
      await axios.put(
        `https://s62-johnrobert-capstone-skillsamaritan.onrender.com/api/tasks/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Task marked as completed!");
      setTimeout(() => navigate("/tasks"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to complete task");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-5 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">

        {message && (
          <div className="mb-4 p-4 text-center bg-green-100 text-green-700 border border-green-300 rounded-lg">
            {message}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>

        <div className="flex items-center gap-3 text-gray-600 mb-6">
          <User className="w-5 h-5 text-green-600" />
          <span className="font-medium">
            Posted by: {task.createdBy?.name}
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">{task.description}</p>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Tags className="h-4 w-4 text-green-600" />
            Skills Required:
          </h3>
          <div className="flex gap-2 flex-wrap mt-2">
            {task.skillsRequired.length > 0 ? (
              task.skillsRequired.map((s, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No skills specified</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-semibold text-green-600">
            {task.points} Points
          </span>
        </div>

        <div className="mb-6">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              task.status === "open"
                ? "bg-green-100 text-green-700"
                : task.status === "accepted"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            Status: {task.status.toUpperCase()}
          </span>
        </div>

        <div className="mt-6 space-y-3">

          {!isCreator && task.status === "open" && (
            <button
              onClick={handleAccept}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Accept Task
            </button>
          )}

          {isAcceptedByUser && task.status === "accepted" && (
            <button
              onClick={handleComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Mark as Completed
            </button>
          )}

          {isCreator && (
            <p className="text-center text-gray-500 text-sm">
              You created this task.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TaskDetail;
