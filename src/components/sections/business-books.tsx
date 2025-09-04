"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function BusinessBooksSection() {
  const businessBooks = [
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop"
    },
    {
      title: "Good to Great",
      author: "Jim Collins", 
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop"
    },
    {
      title: "The Mom Test",
      author: "Rob Fitzpatrick",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop"
    },
    {
      title: "Thinking Fast and Slow",
      author: "Daniel Kahneman",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop"
    },
    {
      title: "Zero to One",
      author: "Peter Thiel",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=300&fit=crop"
    },
    {
      title: "The Hard Thing About Hard Things",
      author: "Ben Horowitz",
      cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=300&fit=crop"
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
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto">
            Use concepts from some of the{' '}
            <span className="text-[#00D563]">best business books</span>{' '}
            of all time
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We've distilled the key insights from the books that every entrepreneur should read, 
            presenting them in our signature visual format for faster understanding.
          </p>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
        >
          {businessBooks.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="group text-center"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="mt-3">
                <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-400 text-xs">
                  {book.author}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              title: "Key Takeaways",
              description: "Get the most important insights from each book in visual format"
            },
            {
              title: "Practical Applications",
              description: "Learn how to apply these concepts to your specific business situation"
            },
            {
              title: "Save Time",
              description: "Understand core concepts in minutes instead of hours of reading"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              className="text-center"
            >
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-white text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center bg-[#00D563] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00D563]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Access Book Summaries
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}