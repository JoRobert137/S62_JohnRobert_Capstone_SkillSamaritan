import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Search, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-700 bg-clip-text text-transparent">
                SkillSamaritan
              </h1>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">Learn & Grow Together</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group">
              Browse Skills
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group">
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          <div className="lg:hidden flex-1 max-w-xs mx-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">

            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-lg hover:bg-green-50 transition-colors duration-200 group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <button className="p-2 rounded-lg hover:bg-green-50 transition-colors duration-200 group">
                <User className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
              </button>
            </div>

            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-2.5 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Join Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;