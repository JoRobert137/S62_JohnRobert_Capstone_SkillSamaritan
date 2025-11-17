import React from 'react';
import { User, Star, TrendingUp } from 'lucide-react';

const stats = [
  { icon: <User />, value: '2,500+', label: 'Active Helpers' },
  { icon: <Star />, value: '15,000+', label: 'Skills Shared' },
  { icon: <TrendingUp />, value: '98%', label: 'Satisfaction Rate' },
];

const StatsSection = () => {
  return (
    <section className="bg-green-100 py-16">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-center mb-4 text-green-500">
              {stat.icon}
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
