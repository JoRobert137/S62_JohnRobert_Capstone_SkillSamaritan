import React, { useEffect, useState } from "react";
import {
  Award,
  CheckCircle,
  Clock,
  Filter,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-green-100 text-green-800",
    outline: "border border-gray-300 text-gray-600",
    destructive: "bg-red-100 text-red-700",
    urgent: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Button = ({ children, variant = "solid", className = "", ...props }) => {
  const variants = {
    solid:
      "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300",
    outline:
      "border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300",
    secondary:
      "bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300",
  };

  return (
    <button
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const TaskFeedPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.getAllTasks();
      setTasks(res.data || []);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAccept = async (taskId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(taskId);
    try {
      await taskAPI.acceptTask(taskId);
      alert("Task accepted successfully!");
      await fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Error accepting task");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (taskId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(taskId);
    try {
      await taskAPI.completeTask(taskId);
      alert("Task marked as complete!");
      await fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Error completing task");
    } finally {
      setActionLoading(null);
    }
  };

  const isTaskCreator = (task) => {
    if (!user) return false;
    const userId = user._id || user.id;
    const creatorId = task.createdBy?._id || task.createdBy;
    return userId === creatorId;
  };

  const isTaskAcceptor = (task) => {
    if (!user || !task.acceptedBy) return false;
    const userId = user._id || user.id;
    const acceptorId = task.acceptedBy?._id || task.acceptedBy;
    return userId === acceptorId;
  };

  const renderTaskActions = (task) => {
    const isLoading = actionLoading === task._id;

    if (task.status === "open") {
      if (isTaskCreator(task)) {
        return (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-gray-600 font-semibold text-sm">Your Task</p>
            <p className="text-xs text-gray-500 mt-1">Waiting for helper</p>
          </div>
        );
      }

      return (
        <Button
          onClick={() => handleAccept(task._id)}
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Accepting...
            </div>
          ) : (
            "Accept Task"
          )}
        </Button>
      );
    }

    if (task.status === "accepted") {
      if (isTaskAcceptor(task)) {
        return (
          <Button
            onClick={() => handleComplete(task._id)}
            disabled={isLoading}
            variant="secondary"
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Completing...
              </div>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
        );
      }

      if (isTaskCreator(task)) {
        return (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-yellow-700 font-semibold text-sm">In Progress</p>
            <p className="text-xs text-gray-600 mt-1">By {task.acceptedBy?.name || "helper"}</p>
          </div>
        );
      }

      return (
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-yellow-700 font-semibold">In Progress</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
          <Star className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-blue-700 font-semibold">Completed</p>
      </div>
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const title = task.title?.toLowerCase() || "";
    const description = task.description?.toLowerCase() || "";
    const skills = Array.isArray(task.skillsRequired) ? task.skillsRequired : [];

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase()) ||
      skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: "OPEN", color: "bg-green-100 text-green-700 border border-green-200" },
      accepted: {
        label: "IN PROGRESS",
        color: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      },
      completed: {
        label: "COMPLETED",
        color: "bg-blue-100 text-blue-700 border border-blue-200",
      },
    };

    const config = statusConfig[status] || statusConfig.open;
    return (
      <Badge variant="default" className={`${config.color} border`}>
        {config.label}
      </Badge>
    );
  };

  const getSkillBadge = (skill, index) => (
    <span
      key={`${skill}-${index}`}
      className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200"
    >
      {skill}
    </span>
  );

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Community Task Feed</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover tasks from your neighbors and earn points by helping out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{tasks.length}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-teal-600">
                {tasks.filter((t) => t.status === "open").length}
              </div>
              <div className="text-sm text-gray-600">Open Tasks</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter((t) => t.status === "accepted").length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Tasks</label>
                    <div className="relative">
                      <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search title, description, skill"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                    <div className="relative">
                      <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="accepted">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/create-task")}
                  className="w-full md:w-auto bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Post a Task
                </button>
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="text-center py-16">
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Loading community tasks...</span>
              </div>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters to see more tasks."
                    : "Be the first to post a task and help build the community!"}
                </p>
                <button
                  onClick={() => navigate("/create-task")}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Create First Task
                </button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {filteredTasks.map((task) => (
              <Card key={task._id} className="hover:border-green-200 transition-all duration-300 group">
                <CardContent>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3
                            className="font-bold text-2xl text-gray-900 group-hover:text-green-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/tasks/${task._id}`)}
                          >
                            {task.title}
                          </h3>
                          {getStatusBadge(task.status)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">{task.description}</p>

                      {Array.isArray(task.skillsRequired) && task.skillsRequired.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Skills Required</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {task.skillsRequired.map((skill, index) => getSkillBadge(skill, index))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-6 text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-green-500" />
                          <span className="font-medium">{task.createdBy?.name || "Community Member"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-green-500" />
                          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">{task.points} points available</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-1">{task.points}</div>
                        <div className="text-sm text-gray-500 font-medium">POINTS</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                          <MessageCircle className="h-4 w-4" />
                          {task.responses || 0} responses
                        </div>
                      </div>

                      {renderTaskActions(task)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!loading && filteredTasks.length > 0 && (
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
              <Button onClick={() => navigate("/create-task")} variant="secondary" className="px-8">
                Post Your Own Task
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TaskFeedPage;