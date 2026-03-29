import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, MessageCircle, Star, Zap, ArrowRight } from 'lucide-react';

const tasks = [
  {
    id: 1,
    title: "Help with React.js debugging",
    description: "Need assistance fixing a component state issue in my personal project. Looking for someone with React experience to pair program for 30 minutes.",
    author: "Alex Thompson",
    timeAgo: "2 hours ago",
    points: 50,
    category: "Tech Help",
    urgent: false,
    responses: 3,
    skillLevel: "Intermediate"
  },
  {
    id: 2,
    title: "Teach me basic guitar chords",
    description: "Complete beginner looking for someone to show me the fundamentals of guitar playing. Have my own guitar, just need guidance!",
    author: "Lisa Park",
    timeAgo: "4 hours ago",
    points: 75,
    category: "Music",
    urgent: true,
    responses: 7,
    skillLevel: "Beginner"
  },
  {
    id: 3,
    title: "Garden design consultation",
    description: "Planning a vegetable garden in my backyard and need expert advice on layout, soil preparation, and plant selection for our climate.",
    author: "Robert Kim",
    timeAgo: "6 hours ago",
    points: 100,
    category: "Gardening",
    urgent: false,
    responses: 2,
    skillLevel: "Expert"
  },
  {
    id: 4,
    title: "Spanish conversation practice",
    description: "Looking for native speaker to practice conversational Spanish. Focus on everyday situations and improving fluency.",
    author: "Maria Garcia",
    timeAgo: "8 hours ago",
    points: 60,
    category: "Language",
    urgent: false,
    responses: 5,
    skillLevel: "Intermediate"
  }
];

const TaskFeed = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <MessageCircle className="w-4 h-4" />
            Live Community Feed
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See What Your Community Needs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse real tasks from your neighbors and earn points by lending a hand.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            { value: '24', label: 'Active Tasks', color: 'text-green-600' },
            { value: '156', label: 'Skills Shared', color: 'text-teal-600' },
            { value: '89%', label: 'Success Rate', color: 'text-green-600' },
            { value: '2.1K', label: 'Points Earned', color: 'text-teal-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 p-5 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 flex-wrap mb-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      {task.title}
                    </h3>
                    {task.urgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                        <Zap className="h-3 w-3" />
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">{task.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-700">{task.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {task.timeAgo}
                    </div>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {task.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="text-xs">{task.skillLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end gap-4 shrink-0">
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {task.points}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">points</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {task.responses} responses
                    </div>
                  </div>

                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                  >
                    Help Out
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold transition-all duration-200"
          >
            View All Tasks
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Post a Task
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            <span className="font-semibold text-green-600">Join 10,000+ community members</span> helping each other grow.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TaskFeed;