import React from 'react';
import { Clock, User, MessageCircle, Star, Zap } from 'lucide-react';

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-green-100 text-green-800',
    outline: 'border border-gray-300 text-gray-600',
    destructive: 'bg-red-100 text-red-700',
    urgent: 'bg-orange-100 text-orange-700'
  };
  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Simple Button component
const Button = ({ children, variant = 'solid', className = '', ...props }) => {
  const variants = {
    solid: 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300',
    outline: 'border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300',
    secondary: 'bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300'
  };
  return (
    <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const TaskFeed = () => {
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

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Task Feed</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what your neighbors need help with and earn points by lending a hand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">24</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-teal-600">156</div>
            <div className="text-sm text-gray-600">Skills Shared</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-teal-600">2.1K</div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
        </div>

        <div className="space-y-6">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:border-green-200 transition-all duration-300">
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-xl text-gray-900 hover:text-green-600 cursor-pointer transition-colors">
                          {task.title}
                        </h3>
                        {task.urgent && (
                          <Badge variant="urgent" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{task.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        {task.timeAgo}
                      </div>
                      <Badge variant="default" className="flex items-center gap-1">
                        {task.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {task.skillLevel}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {task.points}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">points</div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                        <MessageCircle className="h-4 w-4" />
                        {task.responses} responses
                      </div>
                    </div>

                    <Button className="whitespace-nowrap">Help Out</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-x-4">
          <Button variant="outline" className="px-8">View All Tasks</Button>
          <Button variant="secondary" className="px-8">Post a Task</Button>
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