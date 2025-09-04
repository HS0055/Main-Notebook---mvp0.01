"use client";

import { motion } from "motion/react";
import { Play, BarChart3, FileSpreadsheet } from "lucide-react";

export default function ContentPreview() {
  const contentTypes = [
    {
      icon: BarChart3,
      title: "Simple Visuals",
      description: "Complex business concepts broken down into clear, easy-to-understand diagrams and infographics",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      icon: Play,
      title: "Quick Explainer Videos",
      description: "Short, engaging video lessons that explain key concepts in 5-10 minutes",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop"
    },
    {
      icon: FileSpreadsheet,
      title: "Interactive Spreadsheets",
      description: "Hands-on tools and templates you can use to apply what you've learned in your business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Learn through multiple formats
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We know everyone learns differently. That's why we present each concept 
            through visuals, videos, and interactive tools.
          </p>
        </motion.div>

        {/* Content Types Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {contentTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-[#00D563]/30">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-[#00D563] rounded-lg flex items-center justify-center">
                      <type.icon className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00D563] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00D563]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            See All Content Types
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}