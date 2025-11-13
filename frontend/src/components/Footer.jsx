import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Star, MessageCircle } from 'lucide-react';

const Button = ({ className = '', children, ...props }) => (
  <button
    {...props}
    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${className}`}
  >
    {children}
  </button>
);

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
                SkillSamaritan
              </h3>
            </div>
            <p className="text-green-100 mb-6 max-w-md text-lg leading-relaxed">
              Building stronger communities through skill sharing and collaboration. 
              Join thousands of neighbors helping neighbors grow and learn together.
            </p>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-green-200">
                <Users className="h-5 w-5" />
                <span className="font-semibold">10K+ Members</span>
              </div>
              <div className="flex items-center gap-2 text-green-200">
                <Star className="h-5 w-5" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              Community
            </h4>
            <ul className="space-y-4 text-green-100">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Browse Skills
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Find Helpers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-400" />
              Support
            </h4>
            <ul className="space-y-4 text-green-100">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-2xl shadow-xl">
              <h4 className="font-bold text-xl mb-3 text-white">Ready to get started?</h4>
              <p className="text-green-50 mb-4">
                Join our community today and start sharing your skills or learning from others.
              </p>
              <Link to="/signup">
                <Button className="w-full bg-white text-green-700 hover:bg-green-50 hover:text-green-900 shadow-lg hover:shadow-xl">
                  Join Our Community
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-green-200 mb-4 lg:mb-0">
            <span>© 2024 SkillSamaritan. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 text-red-400 fill-current" /> for community.
            </span>
          </div>
          <div className="flex space-x-6 text-green-200">
            <a href="#" className="hover:text-white transition-colors duration-200 hover:scale-110 transform">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200 hover:scale-110 transform">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200 hover:scale-110 transform">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;