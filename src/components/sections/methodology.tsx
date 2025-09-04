"use client";

import { motion } from "motion/react";
import { X, CheckCircle } from "lucide-react";

export default function MethodologySection() {
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
            We don't explain concepts like this...
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Confusing Way */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 relative">
              {/* X Icon */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-red-400 mb-4">
                Confusing and over-complicated
              </h3>

              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  "The net present value (NPV) is a financial metric that evaluates the profitability 
                  of an investment by calculating the present value of expected future cash flows 
                  minus the initial investment cost, utilizing a discount rate that reflects the 
                  opportunity cost of capital and risk-adjusted required rate of return..."
                </p>

                <div className="bg-red-950/50 p-4 rounded-lg">
                  <p className="text-red-300 font-semibold mb-2">Complex Formula:</p>
                  <p className="text-gray-400 font-mono text-sm">
                    NPV = ∑[CF₍ₜ₎/(1+r)ᵗ] - C₀
                  </p>
                </div>

                <p className="text-gray-400 text-sm italic">
                  Result: Complete confusion and intimidation
                </p>
              </div>
            </div>
          </motion.div>

          {/* Clear Way */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-[#00D563]/10 border-2 border-[#00D563] rounded-2xl p-8 relative">
              {/* Check Icon */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#00D563] rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>

              <h3 className="text-2xl font-bold text-[#00D563] mb-4">
                We explain concepts like this...
              </h3>

              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Think of NPV like this:</strong> You're deciding 
                  whether to invest $1,000 today. Will you get back more than $1,000 in the future? 
                  NPV helps you figure that out by comparing today's money to future money.
                </p>

                <div className="bg-[#00D563]/20 p-4 rounded-lg">
                  <p className="text-[#00D563] font-semibold mb-2">Simple Visual:</p>
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-700 p-3 rounded text-center">
                      <p className="text-white font-bold">Investment</p>
                      <p className="text-red-400">-$1,000</p>
                    </div>
                    <span className="text-white">→</span>
                    <div className="bg-gray-700 p-3 rounded text-center">
                      <p className="text-white font-bold">Returns</p>
                      <p className="text-[#00D563]">+$1,200</p>
                    </div>
                    <span className="text-white">=</span>
                    <div className="bg-[#00D563] p-3 rounded text-center">
                      <p className="text-black font-bold">Good Deal!</p>
                    </div>
                  </div>
                </div>

                <p className="text-[#00D563] text-sm font-semibold">
                  Result: Clear understanding and confidence
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Every concept is taught this way
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Simple, visual, and practical. No jargon, no intimidation, just clear understanding.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00D563] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00D563]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            See More Examples
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}