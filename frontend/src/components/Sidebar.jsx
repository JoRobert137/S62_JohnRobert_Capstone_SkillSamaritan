import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Clock3,
  LayoutDashboard,
  ListChecks,
  Menu,
  Plus,
  Settings,
  Trophy,
  User,
  X,
  CircleDollarSign,
} from 'lucide-react';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'feed', label: 'Task Feed', icon: ListChecks, path: '/tasks' },
  { key: 'create', label: 'Create Task', icon: Plus, path: '/create-task' },
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  { key: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Toggle button — visible on mobile when sidebar is closed */}
      <button
        type="button"
        onClick={onToggle}
        className="fixed top-[1.15rem] left-4 z-[60] lg:hidden p-2 rounded-xl bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 border-r border-green-100 bg-white px-4 py-6 flex flex-col transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-10 lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo area */}
        <div className="mb-8 px-2 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-700 bg-clip-text text-transparent">
              SkillSamaritan
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">Community task exchange</p>
          </div>
          {/* Close button for mobile, inside the sidebar */}
          <button
            type="button"
            onClick={onToggle}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {sidebarItems.map(({ key, label, icon: Icon, path }) => {
            const isActive = location.pathname === path ||
              (path !== '/' && location.pathname.startsWith(path));
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleNavigate(path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-50 to-teal-50 text-green-700 border border-green-200 shadow-sm'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-green-600' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Points card at bottom */}
        <div className="mt-4 rounded-xl border border-green-100 bg-gradient-to-b from-green-50 to-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <CircleDollarSign className="h-4 w-4 text-yellow-500" />
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Your Balance</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{user?.points ?? 0} pts</p>
          <p className="text-xs text-gray-500 mt-1">Earned: {user?.earnedPoints ?? 0} pts</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
