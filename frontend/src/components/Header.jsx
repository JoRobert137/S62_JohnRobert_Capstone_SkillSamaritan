import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, User, Sparkles, LogOut, ClipboardList, BookOpen, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GUEST_NAV_LINKS = [
  { label: 'Home', to: '/', end: true },
  { label: 'About', to: '/', end: true },
  { label: 'Contact', to: '/contact' },
];

const AUTH_NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Browse Tasks', to: '/tasks' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Contact', to: '/contact' },
];

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = isAuthenticated ? AUTH_NAV_LINKS : GUEST_NAV_LINKS;

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const handleDropdownNav = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Logo — add left margin on mobile when sidebar toggle is visible */}
          <div className={`flex items-center min-w-0 ${isAuthenticated ? 'pl-12 lg:pl-0' : ''}`}>
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-700 bg-clip-text text-transparent hidden sm:block">
                SkillSamaritan
              </span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, to, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `pb-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-green-600 border-green-500'
                      : 'text-gray-600 border-transparent hover:text-green-600 hover:border-green-200'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Auth actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notification bell */}
                <button
                  className="relative p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors duration-150"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {/* Points badge — desktop */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700">
                  <span className="text-xs font-semibold">⭐ {user?.points ?? 0} pts</span>
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-green-50 transition-colors duration-150 group"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center ring-2 ring-green-200 group-hover:ring-green-400 transition-all duration-150">
                      <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right transition-all duration-150 ${
                      dropdownOpen
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email || ''}
                      </p>
                      <p className="text-xs text-yellow-600 font-medium mt-1">
                        ⭐ {user?.points ?? 0} Points
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleDropdownNav('/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                      >
                        <ClipboardList className="w-4 h-4 shrink-0" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleDropdownNav('/profile')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                      >
                        <User className="w-4 h-4 shrink-0" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleDropdownNav('/settings')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                      >
                        <Settings className="w-4 h-4 shrink-0" />
                        Settings
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Join Community
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;