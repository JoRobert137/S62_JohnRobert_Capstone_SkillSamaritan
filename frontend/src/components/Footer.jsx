import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ className = '', children, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h3 className="text-2xl font-display font-bold">SkillSamaritan</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Building stronger communities through skill sharing and collaboration. 
              Join thousands of neighbors helping neighbors grow and learn together.
            </p>
            <div className="bg-green-500 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Ready to get started?</h4>
              <a href='/signup'>
                <Button className="bg-white text-green-700 hover:bg-green-100 hover:text-green-900 transition-all duration-300 ease-in-out transform shadow-md hover:shadow-lg">
                Join Our Community
              </Button>
              </a>

            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Community</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Browse Skills</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Helpers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 SkillSamaritan. All rights reserved. Built with ❤️ for community.
          </p>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
