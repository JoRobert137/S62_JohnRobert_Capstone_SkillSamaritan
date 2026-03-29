import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  Search,
  Tag,
  User,
  Inbox,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../services/api";
import toast from "react-hot-toast";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import { getTaskStatusMeta } from "../utils/taskStatus";

const TaskFeedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getAllTasks();
      const fetchedTasks = Array.isArray(response.data) ? response.data : [];
      setTasks(fetchedTasks);
    } catch (error) {
      setTasks([]);
      toast.error(error?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();

    const nextTasks = [...tasks]
      .filter((task) => {
        const title = task.title?.toLowerCase() || "";
        const description = task.description?.toLowerCase() || "";
        const skills = Array.isArray(task.skillsRequired)
          ? task.skillsRequired.join(" ").toLowerCase()
          : "";

        const matchesSearch =
          query.length === 0 ||
          title.includes(query) ||
          description.includes(query) ||
          skills.includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "in-progress" &&
            (task.status === "accepted" || task.status === "pending_verification")) ||
          (statusFilter !== "in-progress" && task.status === statusFilter);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOption === "highest") {
          return (b.points || 0) - (a.points || 0);
        }

        if (sortOption === "lowest") {
          return (a.points || 0) - (b.points || 0);
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    setFilteredTasks(nextTasks);
  }, [tasks, searchTerm, statusFilter, sortOption]);

  const handleAcceptTask = async (taskId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    setActiveTaskId(taskId);
    try {
      await taskAPI.acceptTask(taskId);
      toast.success("Task accepted successfully!");
      await fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to accept task.");
    } finally {
      setActionLoading(false);
      setActiveTaskId(null);
    }
  };

  const handleCompleteTask = async (taskId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    setActiveTaskId(taskId);
    try {
      await taskAPI.completeTask(taskId);
      toast.success("Task marked as completed. Waiting for creator confirmation.");
      await fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to complete task.");
    } finally {
      setActionLoading(false);
      setActiveTaskId(null);
    }
  };

  const handleConfirmTask = async (taskId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    setActiveTaskId(taskId);
    try {
      await taskAPI.confirmTask(taskId);
      toast.success("Completion confirmed. Points transferred.");
      await fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to confirm completion.");
    } finally {
      setActionLoading(false);
      setActiveTaskId(null);
    }
  };

  const currentUserId = user?._id || user?.id;

  const isTaskCreator = (task) => {
    const creatorId = task.createdBy?._id || task.createdBy;
    if (!currentUserId || !creatorId) {
      return false;
    }

    return currentUserId === creatorId;
  };

  const isTaskHelper = (task) => {
    const helperId = task.acceptedBy?._id || task.acceptedBy;
    if (!currentUserId || !helperId) {
      return false;
    }

    return currentUserId === helperId;
  };

  const totalTasks = tasks.length;
  const openTasks = tasks.filter((task) => task.status === "open").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-green-50 via-white to-teal-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Task Feed</h1>
              <p className="text-gray-600">Find tasks to help your community and earn points.</p>
            </div>

            <button
              onClick={() => navigate("/create-task")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Create Task
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search tasks by title, skill, or description"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending_verification">Awaiting Confirmation</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                >
                  <option value="highest">Highest Points</option>
                  <option value="lowest">Lowest Points</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalTasks}</p>
            </div>
            <div className="bg-white border border-green-100 rounded-xl p-4 text-center shadow-sm">
              <p className="text-sm text-green-700">Open Tasks</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{openTasks}</p>
            </div>
            <div className="bg-white border border-blue-100 rounded-xl p-4 text-center shadow-sm">
              <p className="text-sm text-blue-700">Completed Tasks</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{completedTasks}</p>
            </div>
          </div>

          {loading && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SkeletonCard variant="stat" />
                <SkeletonCard variant="stat" />
                <SkeletonCard variant="stat" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonCard variant="task" count={3} />
                <SkeletonCard variant="task" count={3} />
              </div>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <EmptyState
              icon={<Inbox className="h-5 w-5" />}
              title="No tasks available"
              description="No tasks matched your filters. Try changing search or create a new task."
              actionLabel="Create Task"
              onAction={() => navigate("/create-task")}
            />
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => {
                const status = getTaskStatusMeta(task.status);
                const skills = Array.isArray(task.skillsRequired) ? task.skillsRequired : [];
                const isBusy = actionLoading && activeTaskId === task._id;

                return (
                  <article
                    key={task._id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.badgeClass}`}>
                        {status.label}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-5 line-clamp-3">{task.description}</p>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Skills</p>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <span
                              key={`${task._id}-skill-${index}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                            >
                              <Tag className="h-3 w-3" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No specific skills required</p>
                      )}
                    </div>

                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                      <p className="inline-flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        Posted by: <span className="font-medium text-gray-800">{task.createdBy?.name || "Community Member"}</span>
                      </p>
                      <p className="inline-flex items-center gap-2 text-base">
                        Reward:
                        <span className="font-bold text-yellow-700">⭐ {task.points || 0} Points</span>
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Created: <span className="font-medium text-gray-800">{new Date(task.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/tasks/${task._id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      {task.status === "open" && !isTaskCreator(task) && (
                        <button
                          onClick={() => handleAcceptTask(task._id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 font-medium transition-colors"
                        >
                          {isBusy ? "Updating..." : "Accept Task"}
                        </button>
                      )}

                      {task.status === "open" && isTaskCreator(task) && (
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 font-medium">
                          You created this task
                        </span>
                      )}

                      {task.status === "accepted" && isTaskHelper(task) && (
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-medium transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {isBusy ? "Updating..." : "Mark as Completed"}
                        </button>
                      )}

                      {task.status === "pending_verification" && isTaskCreator(task) && (
                        <button
                          onClick={() => handleConfirmTask(task._id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {isBusy ? "Confirming..." : "Confirm Completion"}
                        </button>
                      )}

                      {task.status === "accepted" && !isTaskHelper(task) && (
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">
                          In Progress
                        </span>
                      )}

                      {task.status === "pending_verification" && !isTaskCreator(task) && (
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-medium">
                          Waiting for creator confirmation
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TaskFeedPage;
