import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-14 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
                SkillSamaritan
              </h3>
            </div>
            <p className="text-gray-400 mb-5 max-w-sm leading-relaxed text-sm">
              Building stronger communities through skill sharing and collaboration. 
              Join thousands of neighbors helping neighbors grow and learn together.
            </p>
            
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Users className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">10K+ Members</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">4.9 Rating</span>
              </div>
            </div>
          </div>

          {/* Community links */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Community
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to={isAuthenticated ? '/tasks' : '/signup'} className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link to={isAuthenticated ? '/tasks' : '/signup'} className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Find Helpers
                </Link>
              </li>
              <li>
                <Link to={isAuthenticated ? '/leaderboard' : '/signup'} className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA card — different based on auth state */}
          <div className="lg:col-span-2">
            {isAuthenticated ? (
              <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/20 p-6 rounded-2xl">
                <h4 className="font-bold text-lg mb-2 text-green-400">Keep Making an Impact</h4>
                <p className="text-gray-400 mb-4 text-sm">
                  Continue sharing your skills and helping the community grow. Every task completed makes a difference.
                </p>
                <Link
                  to="/create-task"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Post a New Task
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-2xl shadow-xl">
                <h4 className="font-bold text-lg mb-2 text-white">Ready to get started?</h4>
                <p className="text-green-100 mb-4 text-sm">
                  Join our community today and start sharing your skills or learning from others.
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center w-full bg-white text-green-700 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Join Our Community
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>© {new Date().getFullYear()} SkillSamaritan.</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-3.5 w-3.5 text-red-400 fill-current" /> for community.
            </span>
          </div>
          <div className="flex space-x-6 text-gray-500 text-sm">
            <Link to="/" className="hover:text-gray-300 transition-colors duration-200">
              Terms
            </Link>
            <Link to="/" className="hover:text-gray-300 transition-colors duration-200">
              Privacy
            </Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;