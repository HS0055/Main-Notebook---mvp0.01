"use client";

import { motion } from "motion/react";
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Gain business confidence with{' '}
              <span className="text-[#00D563]">quick & visual</span>{' '}
              lessons
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed mb-8 max-w-lg"
            >
              Stop feeling intimidated by the technical side of business. Learn the fundamentals that every entrepreneur needs to know.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 bg-[#00D563] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00D563]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Early-bird Access
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-sm text-gray-400">
                Join 650+ creative professionals who've already enrolled
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content - Video Player */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
              >
                {/* Video Player Container */}
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                  {/* Video Thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
                  
                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative z-10 w-20 h-20 bg-[#00D563] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                  </motion.button>

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-1">Course Preview</h3>
                      <p className="text-gray-300 text-sm">See how we break down complex business concepts</p>
                    </div>
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="bg-gray-800 p-4 flex items-center gap-4">
                  <div className="w-8 h-1 bg-[#00D563] rounded-full"></div>
                  <div className="flex-1 h-1 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400 text-sm">2:34</span>
                </div>
              </motion.div>
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 right-10 w-20 h-20 bg-[#00D563]/20 rounded-full opacity-60"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-500/20 rounded-full opacity-60"></div>
              <div className="absolute top-1/2 left-0 w-12 h-12 bg-purple-500/20 rounded-full opacity-60"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}