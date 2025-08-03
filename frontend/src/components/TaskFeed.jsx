import React from 'react';
import { Clock, User } from 'lucide-react';

// Simple Card components
const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-xl shadow-md border ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

// Simple Badge component
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-300 text-gray-600',
    destructive: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Simple Button component
const Button = ({ children, variant = 'solid', className = '', ...props }) => {
  const variants = {
    solid: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    secondary: 'bg-green-600 hover:bg-green-700 text-white'
  };
  return (
    <button className={`px-4 py-2 rounded font-semibold ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const TaskFeed = () => {
  const tasks = [
    {
      id: 1,
      title: "Help with React.js debugging",
      description: "Need assistance fixing a component state issue in my personal project.",
      author: "Alex Thompson",
      timeAgo: "2 hours ago",
      points: 50,
      category: "Tech Help",
      urgent: false,
      responses: 3
    },
    {
      id: 2,
      title: "Teach me basic guitar chords",
      description: "Complete beginner looking for someone to show me the fundamentals.",
      author: "Lisa Park",
      timeAgo: "4 hours ago",
      points: 75,
      category: "Music",
      urgent: true,
      responses: 7
    },
    {
      id: 3,
      title: "Garden design consultation",
      description: "Planning a vegetable garden in my backyard and need expert advice.",
      author: "Robert Kim",
      timeAgo: "6 hours ago",
      points: 100,
      category: "Gardening",
      urgent: false,
      responses: 2
    },
    {
      id: 4,
      title: "Spanish conversation practice",
      description: "Looking for native speaker to practice conversational Spanish.",
      author: "Maria Garcia",
      timeAgo: "8 hours ago",
      points: 60,
      category: "Language",
      urgent: false,
      responses: 5
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Community Task Feed</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what your neighbors need help with and earn points by lending a hand.
          </p>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                          {task.title}
                        </h3>
                        {task.urgent && <Badge variant="destructive">Urgent</Badge>}
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {task.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {task.timeAgo}
                        </div>
                        <Badge variant="outline">{task.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="text-center lg:text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {task.points}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {task.responses} responses
                      </div>
                    </div>

                    <Button>Help Out</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="mr-4">View All Tasks</Button>
          <Button variant="secondary">Post a Task</Button>
        </div>
      </div>
    </section>
  );
};

export default TaskFeed;
