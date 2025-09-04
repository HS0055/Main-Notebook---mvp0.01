"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: "I went from being intimidated by business financials to actually understanding my cash flow and making strategic decisions. The visual approach made everything click for me.",
      name: "Sarah Kim",
      title: "Founder, Design Studio",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b195?w=80&h=80&fit=crop&crop=face"
    },
    {
      id: 2, 
      content: "These lessons saved me thousands of dollars by helping me understand investment basics and avoiding common pitfalls. The compound interest explanation alone was worth the entire course.",
      name: "Marcus Johnson",
      title: "Tech Entrepreneur",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      id: 3,
      content: "Finally, business concepts explained in a way that makes sense! I love how they break down complex ideas into simple visuals. My confidence in making business decisions has skyrocketed.",
      name: "Lisa Rodriguez", 
      title: "Marketing Agency Owner",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            What our students are saying
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join hundreds of entrepreneurs who've transformed their business confidence
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-[#00D563]/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-10 h-10 text-[#00D563]/40" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FFA500] fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-300 text-lg leading-relaxed mb-8">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#00D563]/30"
                />
                <div>
                  <p className="text-white font-semibold">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-[#FFA500] fill-current" />
              ))}
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              4.97 out of 5 stars
            </p>
            <p className="text-gray-300 mb-6">
              Based on 233 reviews from real students
            </p>
            
            {/* Customer Avatars */}
            <div className="flex items-center justify-center -space-x-3 mb-6">
              {[
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face", 
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1494790108755-2616b612b195?w=40&h=40&fit=crop&crop=face"
              ].map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt="Student"
                  className="w-10 h-10 rounded-full border-3 border-gray-900 object-cover"
                />
              ))}
              <div className="w-10 h-10 bg-[#00D563] rounded-full border-3 border-gray-900 flex items-center justify-center">
                <span className="text-black font-bold text-xs">+228</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00D563] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00D563]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join These Happy Students
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}