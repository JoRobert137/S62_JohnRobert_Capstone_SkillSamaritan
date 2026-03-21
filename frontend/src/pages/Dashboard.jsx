import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import {
  Bell,
  CheckCircle,
  CircleDollarSign,
  Clock3,
  Crown,
  LayoutDashboard,
  ListChecks,
  Medal,
  Plus,
  Search,
  Settings,
  Trophy,
  User,
  Users,
  Inbox,
} from 'lucide-react';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'feed', label: 'Task Feed', icon: ListChecks, path: '/tasks' },
  { key: 'myTasks', label: 'My Tasks', icon: Clock3, path: '/tasks' },
  { key: 'create', label: 'Create Task', icon: Plus, path: '/create-task' },
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  { key: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const getStatusClasses = (status) => {
  if (status === 'completed') {
    return 'bg-green-100 text-green-700 border border-green-200';
  }
  if (status === 'accepted') {
    return 'bg-teal-100 text-teal-700 border border-teal-200';
  }
  return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="rounded-xl bg-green-50 p-3">
        {React.createElement(Icon, { className: `h-5 w-5 ${accent}` })}
      </div>
    </div>
  </div>
);

const TaskCard = ({ task, rightMeta, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="w-full rounded-2xl border border-green-100 bg-white p-4 text-left shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-xl"
  >
    <div className="mb-2 flex items-start justify-between gap-3">
      <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">{task.title}</h4>
      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(task.status)}`}>
        {task.status || 'open'}
      </span>
    </div>
    <p className="line-clamp-2 text-xs text-gray-600">{task.description || 'No description provided.'}</p>
    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center gap-1.5">
        <CircleDollarSign className="h-3.5 w-3.5 text-yellow-500" />
        <span>{task.points || 0} pts</span>
      </div>
      <span className="text-gray-500">{rightMeta}</span>
    </div>
  </button>
);

const LeaderboardItem = ({ rank, user: boardUser }) => (
  <li className="flex items-center justify-between rounded-2xl border border-green-100 bg-white px-3 py-2.5 shadow-lg transition-colors duration-300 hover:border-green-200 hover:shadow-xl">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
        {boardUser.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{boardUser.name}</p>
        <p className="text-xs text-gray-500">Rank #{rank}</p>
      </div>
    </div>
    <div className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
      <Crown className="h-4 w-4" />
      <span>{boardUser.points} pts</span>
    </div>
  </li>
);

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    createdTasks: [],
    acceptedTasks: [],
    completedCount: 0,
    totalPoints: user?.pointsBalance || user?.points || 0,
    activeTasks: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksResponse, leaderboardResponse] = await Promise.all([
          taskAPI.getAllTasks(),
          userAPI.getLeaderboard(),
        ]);

        const allTasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : [];
        const leaderboard = Array.isArray(leaderboardResponse.data)
          ? leaderboardResponse.data
          : [];
        const userId = user?._id || user?.id;

        const created = allTasks.filter(
          (task) => task.createdBy?._id === userId || task.createdBy === userId
        );

        const accepted = allTasks.filter(
          (task) => task.acceptedBy?._id === userId || task.acceptedBy === userId
        );

        const completed = accepted.filter((task) => task.status === 'completed').length;

        setStats({
          createdTasks: created.slice(0, 5),
          acceptedTasks: accepted.slice(0, 5),
          completedCount: completed,
          totalPoints: user?.pointsBalance || user?.points || 0,
          activeTasks: created.filter((task) => task.status !== 'completed').length,
        });

        setLeaderboardUsers(leaderboard.slice(0, 5));
      } catch (err) {
        console.error('Error fetching tasks:', err);
        toast.error(err?.response?.data?.message || 'Failed to load dashboard data.');
        setLeaderboardUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const filteredCreatedTasks = useMemo(
    () =>
      stats.createdTasks.filter((task) =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [stats.createdTasks, searchQuery]
  );

  const filteredAcceptedTasks = useMemo(
    () =>
      stats.acceptedTasks.filter((task) =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [stats.acceptedTasks, searchQuery]
  );

  const activityFeed = useMemo(() => {
    const items = [];

    stats.acceptedTasks
      .filter((task) => task.status === 'completed')
      .slice(0, 2)
      .forEach((task) => {
        items.push({
          id: `done-${task._id}`,
          text: `${user?.name || 'A helper'} completed ${task.createdBy?.name || 'a'} task`,
          when: 'Recently',
        });
      });

    stats.createdTasks.slice(0, 2).forEach((task) => {
      items.push({
        id: `new-${task._id}`,
        text: `${user?.name || 'Someone'} created a new task: ${task.title}`,
        when: 'Today',
      });
    });

    if (stats.completedCount > 0) {
      items.push({
        id: 'points-earned',
        text: `${user?.name || 'You'} earned ${stats.completedCount * 10} points`,
        when: 'This week',
      });
    }

    return items.slice(0, 5);
  }, [stats, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-6 rounded-2xl border border-green-100 bg-white p-5 shadow-lg">
            <div className="mb-3 h-7 w-1/3 animate-pulse rounded bg-green-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-green-100" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`stat-skeleton-${index}`} className="rounded-2xl border border-green-100 bg-white p-5 shadow-lg">
                <div className="mb-3 h-3 w-20 animate-pulse rounded bg-green-100" />
                <div className="mb-4 h-7 w-14 animate-pulse rounded bg-green-100" />
                <div className="h-10 w-10 animate-pulse rounded-xl bg-green-100" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {Array.from({ length: 2 }).map((_, colIndex) => (
              <div key={`task-col-skeleton-${colIndex}`} className="space-y-3">
                {Array.from({ length: 3 }).map((__, rowIndex) => (
                  <div key={`task-skeleton-${colIndex}-${rowIndex}`} className="rounded-2xl border border-green-100 bg-white p-4 shadow-lg">
                    <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-green-100" />
                    <div className="mb-2 h-3 w-full animate-pulse rounded bg-green-100" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-green-100" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`feed-skeleton-${index}`} className="rounded-2xl border border-green-100 bg-white p-4 shadow-lg">
                <div className="mb-2 h-3 w-2/3 animate-pulse rounded bg-green-100" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-green-100" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 text-gray-600">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
            <span className="text-sm font-medium">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-green-100 bg-white px-4 py-6 lg:flex lg:flex-col">
          <div className="mb-10 px-2">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">SkillSamaritan</h1>
            <p className="mt-1 text-xs text-gray-500">Community task exchange</p>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map(({ key, label, icon: Icon, path }) => {
              const isActive = key === 'dashboard';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  {React.createElement(Icon, { className: 'h-4 w-4' })}
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-green-100 bg-white p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Your balance</p>
            <p className="mt-2 text-2xl font-semibold text-green-700">{stats.totalPoints} pts</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-green-100 bg-white px-4 py-4 shadow-sm md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 lg:hidden">
                <h1 className="text-lg font-semibold tracking-tight text-gray-900">SkillSamaritan</h1>
              </div>

              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tasks"
                  className="w-full rounded-xl border border-green-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-green-100 bg-white p-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-700"
                >
                  <Bell className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl border border-green-100 bg-white px-2.5 py-1.5 text-sm text-gray-700"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block">{user?.name || 'User'}</span>
                  </button>

                  {menuOpen ? (
                    <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-green-100 bg-white text-sm shadow-lg">
                      <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-green-50"
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/tasks')}
                        className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-green-50"
                      >
                        My Tasks
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {sidebarItems.map(({ key, label, icon: Icon, path }) => (
                <button
                  key={`mobile-${key}`}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
                    key === 'dashboard'
                      ? 'border-green-200 bg-green-100 text-green-700'
                      : 'border-green-100 bg-white text-gray-700'
                  }`}
                >
                  {React.createElement(Icon, { className: 'h-3.5 w-3.5' })}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </header>

          <section className="px-4 py-6 md:px-6">
            <div className="mb-6 rounded-2xl border border-green-100 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-xl">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Welcome back, {user?.name || 'Friend'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">Your action hub for active tasks, quick actions, and community momentum.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={CircleDollarSign} label="Total Points" value={stats.totalPoints} accent="text-green-600" />
              <StatCard icon={Plus} label="Tasks Created" value={stats.createdTasks.length} accent="text-teal-600" />
              <StatCard icon={CheckCircle} label="Tasks Completed" value={stats.completedCount} accent="text-yellow-500" />
              <StatCard icon={Clock3} label="Active Tasks" value={stats.activeTasks} accent="text-green-600" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-lg transition-all duration-300 hover:border-green-200 hover:shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Recent Tasks Created</h3>
                  <button type="button" onClick={() => navigate('/tasks')} className="text-xs text-green-700 hover:text-green-800">View all</button>
                </div>
                <div className="space-y-3">
                  {filteredCreatedTasks.length > 0 ? (
                    filteredCreatedTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        rightMeta={task.acceptedBy ? 'Accepted' : 'Awaiting helper'}
                        onOpen={() => navigate(`/tasks/${task._id}`)}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={<Inbox className="h-5 w-5 text-green-600" />}
                      title="No tasks yet"
                      description="Create your first task and start helping the community."
                      actionLabel="Create Task"
                      onAction={() => navigate('/create-task')}
                      className="bg-white border border-green-100 shadow-lg [&>div]:bg-green-50 [&>div]:text-green-600 [&>h3]:text-gray-900 [&>p]:text-gray-600 [&>button]:bg-gradient-to-r [&>button]:from-green-500 [&>button]:to-teal-600 [&>button]:text-white [&>button]:border-0 [&>button]:hover:from-green-600 [&>button]:hover:to-teal-700"
                    />
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-lg transition-all duration-300 hover:border-green-200 hover:shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Tasks You&apos;ve Accepted</h3>
                  <button type="button" onClick={() => navigate('/tasks')} className="text-xs text-green-700 hover:text-green-800">View all</button>
                </div>
                <div className="space-y-3">
                  {filteredAcceptedTasks.length > 0 ? (
                    filteredAcceptedTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        rightMeta={`Creator: ${task.createdBy?.name || 'Unknown'}`}
                        onOpen={() => navigate(`/tasks/${task._id}`)}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={<Inbox className="h-5 w-5 text-green-600" />}
                      title="No accepted tasks"
                      description="Browse available tasks and accept one to start earning points."
                      actionLabel="Browse Tasks"
                      onAction={() => navigate('/tasks')}
                      className="bg-white border border-green-100 shadow-lg [&>div]:bg-green-50 [&>div]:text-green-600 [&>h3]:text-gray-900 [&>p]:text-gray-600 [&>button]:bg-gradient-to-r [&>button]:from-green-500 [&>button]:to-teal-600 [&>button]:text-white [&>button]:border-0 [&>button]:hover:from-green-600 [&>button]:hover:to-teal-700"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-green-100 bg-white p-5 shadow-lg transition-all duration-300 hover:border-green-200 hover:shadow-xl">
              <h3 className="mb-4 text-base font-semibold text-gray-900">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => navigate('/create-task')}
                  className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-green-600 hover:to-teal-700 hover:shadow-lg"
                >
                  Create New Task
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/tasks')}
                  className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-green-600 hover:to-teal-700 hover:shadow-lg"
                >
                  Browse Tasks
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/leaderboard')}
                  className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-green-600 hover:to-teal-700 hover:shadow-lg"
                >
                  View Leaderboard
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-lg transition-all duration-300 hover:border-green-200 hover:shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Users className="h-4 w-4 text-teal-600" />
                  Community Activity Feed
                </h3>

                <ul className="space-y-2.5">
                  {activityFeed.length > 0 ? (
                    activityFeed.map((activity) => (
                      <li
                        key={activity.id}
                        className="rounded-xl border border-green-100 bg-white px-3 py-2.5 transition-colors hover:border-green-200"
                      >
                        <p className="text-sm text-gray-800">{activity.text}</p>
                        <p className="mt-1 text-xs text-gray-500">{activity.when}</p>
                      </li>
                    ))
                  ) : (
                    <li>
                      <EmptyState
                        icon={<Users className="h-5 w-5 text-teal-600" />}
                        title="No activity yet"
                        description="Community activity will appear here once members start completing tasks."
                        className="bg-white border border-green-100 shadow-lg [&>div]:bg-green-50 [&>div]:text-green-600 [&>h3]:text-gray-900 [&>p]:text-gray-600"
                      />
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-lg transition-all duration-300 hover:border-green-200 hover:shadow-xl">
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Medal className="h-4 w-4 text-yellow-500" />
                  Leaderboard Preview
                </h3>
                <ol className="space-y-2.5">
                  {leaderboardUsers.length > 0 ? (
                    leaderboardUsers.map((boardUser, index) => (
                      <LeaderboardItem key={`${boardUser.name}-${index}`} rank={index + 1} user={boardUser} />
                    ))
                  ) : (
                    <li>
                      <EmptyState
                        icon={<Medal className="h-5 w-5 text-yellow-500" />}
                        title="No leaderboard data"
                        description="Leaderboard rankings will appear after users start earning points."
                        className="bg-white border border-green-100 shadow-lg [&>div]:bg-green-50 [&>div]:text-green-600 [&>h3]:text-gray-900 [&>p]:text-gray-600"
                      />
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
