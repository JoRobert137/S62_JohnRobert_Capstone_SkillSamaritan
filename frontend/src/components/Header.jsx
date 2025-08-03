import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg"></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SkillSamaritan</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-gray-700">
          <a href="#">Browse Skills</a>
          <a href="#">Leaderboard</a>
          <a href="#">Community</a>
          <a href="#">About</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5" />
          <User className="w-5 h-5" />
          <nav>
            <Link
              to="/signup"
              className="bg-green-500 text-white py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Join Community
            </Link>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;
