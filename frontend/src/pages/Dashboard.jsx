import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  Coins, 
  TrendingUp, 
  User,
  Award,
  BookmarkCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    createdTasks: [],
    acceptedTasks: [],
    completedCount: 0,
    totalPoints: user?.points || 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const res = await taskAPI.getAllTasks();

        const allTasks = res.data;
        const userId = user._id || user.id;

        // Filter tasks created by user
        const created = allTasks.filter(task => 
          task.createdBy?._id === userId || task.createdBy === userId
        );

        // Filter tasks accepted by user
        const accepted = allTasks.filter(task => 
          task.acceptedBy?._id === userId || task.acceptedBy === userId
        );

        // Count completed tasks
        const completed = accepted.filter(task => task.status === 'completed').length;

        setStats({
          createdTasks: created.slice(0, 5),
          acceptedTasks: accepted.slice(0, 5),
          completedCount: completed,
          totalPoints: user?.points || 0
        });
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [token, user]);

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          {React.createElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
      </div>
    </div>
  );

  const TaskCard = ({ task, type }) => (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{task.title}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${
          task.status === 'completed' ? 'bg-green-100 text-green-700' :
          task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {task.status || 'open'}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Coins className="w-3 h-3" />
          <span>{task.points} pts</span>
        </div>
        {type === 'created' && task.acceptedBy && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Accepted</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">Here's what's happening with your tasks</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={Coins} 
              label="Total Points" 
              value={stats.totalPoints}
              color="bg-gradient-to-br from-green-500 to-teal-600"
            />
            <StatCard 
              icon={Clock} 
              label="Tasks Created" 
              value={stats.createdTasks.length}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard 
              icon={BookmarkCheck} 
              label="Tasks Accepted" 
              value={stats.acceptedTasks.length}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard 
              icon={CheckCircle} 
              label="Completed" 
              value={stats.completedCount}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => navigate('/create-task')}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Plus className="w-6 h-6" />
              <span className="text-lg font-semibold">Create New Task</span>
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-lg font-semibold">Browse All Tasks</span>
            </button>
          </div>

          {/* Tasks Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Created Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  My Created Tasks
                </h2>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All
                </button>
              </div>
              
              {stats.createdTasks.length > 0 ? (
                <div className="space-y-3">
                  {stats.createdTasks.map(task => (
                    <TaskCard key={task._id} task={task} type="created" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No tasks created yet</p>
                  <button
                    onClick={() => navigate('/create-task')}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Create your first task
                  </button>
                </div>
              )}
            </div>

            {/* My Accepted Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  My Accepted Tasks
                </h2>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All
                </button>
              </div>
              
              {stats.acceptedTasks.length > 0 ? (
                <div className="space-y-3">
                  {stats.acceptedTasks.map(task => (
                    <TaskCard key={task._id} task={task} type="accepted" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No tasks accepted yet</p>
                  <button
                    onClick={() => navigate('/tasks')}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Browse available tasks
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
