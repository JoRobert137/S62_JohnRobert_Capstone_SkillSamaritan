import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-600 via-green-500 to-teal-500 text-white py-24 sm:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-400/5 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8 text-sm font-medium border border-white/20">
          <Sparkles className="w-4 h-4" />
          <span>Join 10,000+ community members sharing skills</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Share Skills,
          <br />
          <span className="text-green-100">Build Community</span>
        </h1>

        <p className="text-lg sm:text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with neighbors, learn new skills, and help others grow.
          Earn points for every act of kindness in our skill-sharing community.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link
            to="/signup"
            className="group inline-flex items-center justify-center gap-2 bg-white text-green-600 font-semibold px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-green-200" />
              <span className="text-2xl sm:text-3xl font-bold">10K+</span>
            </div>
            <p className="text-xs sm:text-sm text-green-200">Members</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-green-200" />
              <span className="text-2xl sm:text-3xl font-bold">50K+</span>
            </div>
            <p className="text-xs sm:text-sm text-green-200">Skills Shared</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-green-200" />
              <span className="text-2xl sm:text-3xl font-bold">98%</span>
            </div>
            <p className="text-xs sm:text-sm text-green-200">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;