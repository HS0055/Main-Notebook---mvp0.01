"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Clock, PlayCircle, FileText } from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: {
    title: string;
    type: "video" | "reading" | "exercise";
    duration: string;
  }[];
}

export default function CourseCurriculum() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const modules: Module[] = [
    {
      id: "wealth-accumulation",
      title: "Wealth Accumulation",
      description: "Master the fundamentals of building long-term wealth through smart financial strategies",
      duration: "45 min",
      lessons: [
        { title: "The Psychology of Money", type: "video", duration: "8 min" },
        { title: "Compound Interest Explained", type: "video", duration: "12 min" },
        { title: "Investment Basics", type: "reading", duration: "10 min" },
        { title: "Building Your Investment Portfolio", type: "exercise", duration: "15 min" }
      ]
    },
    {
      id: "fundamentals", 
      title: "Fundamentals",
      description: "Essential business concepts every entrepreneur needs to understand",
      duration: "60 min",
      lessons: [
        { title: "Revenue vs Profit", type: "video", duration: "10 min" },
        { title: "Cash Flow Management", type: "video", duration: "15 min" },
        { title: "Understanding Financial Statements", type: "reading", duration: "20 min" },
        { title: "Creating Your Business Model", type: "exercise", duration: "15 min" }
      ]
    },
    {
      id: "measurement",
      title: "Measurement", 
      description: "Learn what metrics matter and how to track your business success",
      duration: "40 min",
      lessons: [
        { title: "Key Performance Indicators", type: "video", duration: "12 min" },
        { title: "Customer Acquisition Cost", type: "video", duration: "8 min" },
        { title: "Lifetime Value Analysis", type: "reading", duration: "10 min" },
        { title: "Building Your Dashboard", type: "exercise", duration: "10 min" }
      ]
    },
    {
      id: "decision-making",
      title: "Decision-making",
      description: "Frameworks and tools for making better business decisions under uncertainty", 
      duration: "50 min",
      lessons: [
        { title: "Decision-Making Frameworks", type: "video", duration: "15 min" },
        { title: "Risk Assessment", type: "video", duration: "10 min" },
        { title: "Opportunity Cost Analysis", type: "reading", duration: "12 min" },
        { title: "Decision Matrix Exercise", type: "exercise", duration: "13 min" }
      ]
    }
  ];

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const getTypeIcon = (type: "video" | "reading" | "exercise") => {
    switch (type) {
      case "video":
        return PlayCircle;
      case "reading":
        return FileText;
      case "exercise":
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Course Curriculum
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four comprehensive modules designed to build your business confidence 
            from the ground up
          </p>
        </motion.div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900 border-2 border-gray-800 rounded-2xl overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-6 text-left hover:bg-gray-800/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-[#00D563] rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {module.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 ml-16">
                      {module.description}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      {expandedModule === module.id ? (
                        <Minus className="w-5 h-5 text-[#00D563]" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Module Content */}
              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-gray-800"
                  >
                    <div className="p-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-[#00D563] rounded"></div>
                        Lessons in this module
                      </h4>
                      
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const TypeIcon = getTypeIcon(lesson.type);
                          return (
                            <motion.div
                              key={lessonIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: lessonIndex * 0.1 }}
                              className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                            >
                              <TypeIcon className="w-5 h-5 text-[#00D563]" />
                              <div className="flex-1">
                                <p className="text-white font-medium">
                                  {lesson.title}
                                </p>
                                <p className="text-gray-400 text-sm capitalize">
                                  {lesson.type} • {lesson.duration}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00D563] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00D563]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Learning Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}