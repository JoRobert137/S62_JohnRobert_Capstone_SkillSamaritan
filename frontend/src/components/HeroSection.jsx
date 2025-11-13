import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-green-500 to-teal-400 text-white py-20 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Share Skills, Build Community
        </h1>
        <p className="text-xl mb-10">
          Connect with neighbors, learn new skills, and help others grow.
          Earn points for every act of kindness in our skill-sharing community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/login" 
            className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Find Help Now
          </Link>
          <Link 
            to="/signup" 
            className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Offer Your Skills
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;