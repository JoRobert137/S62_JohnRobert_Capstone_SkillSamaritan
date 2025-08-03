import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Jennifer Adams",
      role: "Community Member",
      content: "SkillSamaritan helped me learn Python programming from a local expert. The point system makes it so rewarding to help others too!",
      rating: 5,
      skill: "Learned: Python Programming"
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      role: "Top Helper",
      content: "Teaching guitar through SkillSamaritan has been incredibly fulfilling. I've made great friends and earned over 3000 points!",
      rating: 5,
      skill: "Teaches: Guitar Lessons"
    },
    {
      id: 3,
      name: "Rachel Kim",
      role: "Community Member",
      content: "The gardening tips I received helped transform my backyard into a beautiful oasis. This community is amazing!",
      rating: 5,
      skill: "Learned: Organic Gardening"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who are making connections and growing together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">

                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-sm text-teal-600 font-medium">{testimonial.skill}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
