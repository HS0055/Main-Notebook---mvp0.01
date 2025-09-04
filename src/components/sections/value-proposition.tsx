"use client";

import { motion } from "motion/react";

export default function ValueProposition() {
  return (
    <section className="py-20 lg:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="text-[#00D563] text-sm font-bold uppercase letter-spacing-wide">
              WITH LIMITLESS CONCEPTS
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 max-w-4xl mx-auto"
          >
            Put visual &{' '}
            <span className="text-[#00D563]">practical business wisdom</span>{' '}
            in your back pocket, for life
          </motion.h2>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              Stop feeling overwhelmed by business jargon and complex financial concepts. 
              Our bite-sized, visual lessons make even the most intimidating topics feel approachable.
            </p>
            
            <p className="text-lg text-gray-400 leading-relaxed">
              Whether you're launching your first startup, scaling an existing business, or just want to 
              understand how money really works, we'll give you the confidence to make smart decisions.
            </p>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {[
              {
                title: "Quick to Learn",
                description: "Each lesson takes just 5-10 minutes to complete"
              },
              {
                title: "Visual First",
                description: "Complex concepts explained through simple diagrams and charts"
              },
              {
                title: "Practical Focus",
                description: "Real-world applications you can use immediately"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-white text-xl font-semibold mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}