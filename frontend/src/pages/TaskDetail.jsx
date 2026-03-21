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
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../services/api";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";

const getStatusMeta = (status) => {
  if (status === "accepted") {
    return {
      label: "IN PROGRESS",
      badgeClass: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    };
  }

  if (status === "completed") {
    return {
      label: "COMPLETED",
      badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
    };
  }

  return {
    label: "OPEN",
    badgeClass: "bg-green-100 text-green-700 border border-green-200",
  };
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const fetchTask = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getTaskById(id);
      setTask(response.data);
      setLoadError("");
    } catch (error) {
      setTask(null);
      const errorMessage = error.response?.data?.message || "Task not found";
      setLoadError(errorMessage);
      toast.error(errorMessage);
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

    const creatorId = task?.createdBy?._id || task?.createdBy;
    const currentUserId = user?._id || user?.id;

    if (creatorId && currentUserId && creatorId === currentUserId) {
      toast.error("You cannot accept your own task");
      return;
    }

    setActionLoading(true);
    try {
      await taskAPI.acceptTask(id);
      toast.success("Task accepted successfully!");
      await fetchTask();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept task");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const currentUserId = user?._id || user?.id;
    const helperId = task?.acceptedBy?._id || task?.acceptedBy;

    if (!currentUserId || !helperId || currentUserId !== helperId) {
      toast.error("Only the helper who accepted this task can complete it");
      return;
    }

    setActionLoading(true);
    try {
      await taskAPI.completeTask(id);
      toast.success("Task completed successfully!");
      await fetchTask();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete task");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!isAuthenticated || !isAdmin) {
      toast.error("Only admin can delete tasks");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    try {
      await taskAPI.deleteTask(id);
      toast.success("Task deleted successfully.");
      navigate("/tasks", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading task...</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Header />
        <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <EmptyState
              icon={<CircleAlert className="w-5 h-5" />}
              title="Task not found"
              description={loadError || "The task may have been removed."}
              actionLabel="Back to Tasks"
              onAction={() => navigate("/tasks")}
            />
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const currentUserId = user?._id || user?.id;
  const creatorId = task.createdBy?._id || task.createdBy;
  const helperId = task.acceptedBy?._id || task.acceptedBy;
  const isCreator = Boolean(currentUserId && creatorId && currentUserId === creatorId);
  const isHelper = Boolean(currentUserId && helperId && currentUserId === helperId);
  const statusMeta = getStatusMeta(task.status);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/tasks")}
            className="mb-6 inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Task Feed
          </button>

          <article className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{task.title}</h1>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${statusMeta.badgeClass}`}>
                    {statusMeta.label}
                  </span>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-right">
                  <p className="text-xs text-yellow-700 font-semibold uppercase tracking-wide">Points Reward</p>
                  <p className="text-2xl font-bold text-yellow-700 inline-flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    {task.points || 0}
                  </p>
                </div>
              </header>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Posted By</p>
                  <p className="font-semibold text-gray-900 inline-flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    {task.createdBy?.name || "Unknown"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Created Date</p>
                  <p className="font-semibold text-gray-900 inline-flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Accepted By</p>
                  <p className="font-semibold text-gray-900">
                    {task.acceptedBy?.name || "Not accepted yet"}
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
              </section>

              <section className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 inline-flex items-center gap-2">
                  <Tags className="w-5 h-5 text-green-600" />
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(task.skillsRequired) && task.skillsRequired.length > 0 ? (
                    task.skillsRequired.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No specific skills required</span>
                  )}
                </div>
              </section>

              <section className="border-t border-gray-200 pt-6">
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                  >
                    Login to Accept Task
                  </button>
                ) : isCreator && task.status === "open" ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 font-semibold">
                    You created this task. Waiting for someone to accept it.
                  </div>
                ) : task.status === "open" ? (
                  <button
                    onClick={handleAccept}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-60"
                  >
                    {actionLoading ? "Accepting..." : "Accept Task"}
                  </button>
                ) : task.status === "accepted" && isHelper ? (
                  <button
                    onClick={handleComplete}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-60"
                  >
                    {actionLoading ? "Completing..." : "Mark Task Completed"}
                  </button>
                ) : task.status === "completed" ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Task Completed
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 font-semibold">
                    <Clock className="w-4 h-4" />
                    Task In Progress
                  </div>
                )}

                {isAuthenticated && isAdmin && (
                  <button
                    onClick={handleDeleteTask}
                    disabled={actionLoading}
                    className="mt-3 w-full sm:ml-3 sm:mt-0 sm:w-auto px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-60"
                  >
                    {actionLoading ? "Deleting..." : "Delete Task (Admin)"}
                  </button>
                )}
              </section>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TaskDetail;
