import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  CircleAlert,
  Clock,
  Coins,
  Tags,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTask = useCallback(async () => {
    try {
      const res = await taskAPI.getTaskById(id);
      setTask(res.data);
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load task");
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleAccept = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      await taskAPI.acceptTask(id);
      setMessage("Task accepted successfully!");
      await fetchTask();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to accept task");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      await taskAPI.completeTask(id);
      setMessage("Task marked as completed!");
      await fetchTask();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to complete task");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading task...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <CircleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-xl font-semibold mb-3">Task not found</p>
            {message && <p className="text-gray-600 mb-6">{message}</p>}
            <button
              onClick={() => navigate("/tasks")}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tasks
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const creatorId = task.createdBy?._id || task.createdBy;
  const acceptedById = task.acceptedBy?._id || task.acceptedBy;
  const currentUserId = user?._id || user?.id;

  const isCreator = Boolean(currentUserId && creatorId && currentUserId === creatorId);
  const isAcceptedByUser = Boolean(currentUserId && acceptedById && currentUserId === acceptedById);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/tasks")}
            className="mb-6 inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Task Feed
          </button>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg border ${
                    message.toLowerCase().includes("success") || message.toLowerCase().includes("completed")
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mb-6">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    task.status === "open"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : task.status === "accepted"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {task.status === "open"
                    ? "OPEN"
                    : task.status === "accepted"
                      ? "IN PROGRESS"
                      : "COMPLETED"}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">{task.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posted by</p>
                    <p className="font-semibold text-gray-900">{task.createdBy?.name || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reward</p>
                    <p className="font-semibold text-green-600 text-lg">{task.points} Points</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posted on</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {task.acceptedBy && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Accepted by</p>
                      <p className="font-semibold text-gray-900">{task.acceptedBy.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Tags className="h-5 w-5 text-green-600" />
                  Skills Required
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {Array.isArray(task.skillsRequired) && task.skillsRequired.length > 0 ? (
                    task.skillsRequired.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills specified</span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Login to Accept This Task
                  </button>
                ) : isCreator ? (
                  <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-semibold mb-1">You created this task</p>
                    <p className="text-sm text-gray-500">
                      {task.status === "open" && "Waiting for someone to accept it"}
                      {task.status === "accepted" && `Being worked on by ${task.acceptedBy?.name}`}
                      {task.status === "completed" && "Task has been completed"}
                    </p>
                  </div>
                ) : task.status === "open" ? (
                  <button
                    onClick={handleAccept}
                    disabled={actionLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {actionLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Accepting Task...
                      </div>
                    ) : (
                      "Accept This Task"
                    )}
                  </button>
                ) : isAcceptedByUser && task.status === "accepted" ? (
                  <button
                    onClick={handleComplete}
                    disabled={actionLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Marking as Complete...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Mark as Completed
                      </>
                    )}
                  </button>
                ) : task.status === "accepted" ? (
                  <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-yellow-700 font-semibold mb-1">Task In Progress</p>
                    <p className="text-sm text-gray-600">
                      This task is being worked on by {task.acceptedBy?.name}
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <p className="text-blue-700 font-semibold mb-1">Task Completed</p>
                    <p className="text-sm text-gray-600">This task has been successfully completed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TaskDetail;
