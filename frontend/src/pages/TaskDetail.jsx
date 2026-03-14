/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../services/api";
import { User, Clock, Coins, Tags, CheckCircle, CircleAlert, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await taskAPI.getTaskById(id);
      setTask(res.data);
    } catch (err) {
      setMessage("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    ret>
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <CircleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-xl font-semibold mb-4">Task not found</p>
            <button
              onClick={() => navigate('/tasks')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Back to Tasks
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Check if current user is the task creator
  const isCreator = user && (user._id === task.createdBy?._id || user.id === task.createdBy?._id);
  
  // Check if current user accepted this task
  const isAcceptedByUser = user && task.acceptedBy && 
    (user._id === task.acceptedBy._id || user.id === task.acceptedBy._id);

  const handleAccept = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      await taskAPI.acceptTask(id);
      setMessage("Task accepted successfully!");
      await fetchTask(); // Refresh task data
    } ca    <div className="p-8">
              {/* Status Badge */}
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
                  {task.status === "open" ? "OPEN" : task.status === "accepted" ? "IN PROGRESS" : "COMPLETED"}
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
                  {task.skillsRequired.length > 0 ? (
                    task.skillsRequired.map((s, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills specified</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6">
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate('/login')}
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
                      'Accept This Task'
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

export default TaskDetail;          </div>
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
