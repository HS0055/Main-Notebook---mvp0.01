"use client";

import { motion } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

export default function FinanceMyths() {
  const myths = [
    {
      myth: "You need a lot of money to start investing",
      reality: "You can start investing with as little as $5-10 through apps like Acorns or M1 Finance",
      explanation: "The biggest barrier to building wealth isn't the amount you start with—it's starting at all. Time in the market beats timing the market."
    },
    {
      myth: "Debt is always bad and should be avoided",
      reality: "Good debt (like mortgages or business loans) can actually help you build wealth faster",
      explanation: "There's a difference between good debt that generates income or appreciates in value, and bad debt that just costs you money."
    },
    {
      myth: "You need to be an expert to understand business finances",
      reality: "Basic financial literacy can be learned by anyone in just a few hours",
      explanation: "Most business financial concepts are actually quite simple once someone explains them in plain English with real examples."
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              The 3 Biggest Finance Myths
            </h2>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            These common misconceptions keep people from taking control of their finances. 
            Let's debunk them once and for all.
          </p>
        </motion.div>

        {/* Myths Grid */}
        <div className="space-y-8">
          {myths.map((mythData, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border-2 border-red-500/30 rounded-2xl p-8"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Myth */}
                <div className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-2">
                        Myth #{index + 1}
                      </h3>
                      <p className="text-xl text-white font-semibold leading-relaxed">
                        "{mythData.myth}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reality */}
                <div className="relative">
                  <div className="bg-[#00D563]/10 border border-[#00D563]/30 rounded-xl p-6">
                    <h4 className="text-[#00D563] font-bold text-sm uppercase tracking-wide mb-3">
                      False:
                    </h4>
                    <p className="text-white font-semibold text-lg mb-4">
                      {mythData.reality}
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      {mythData.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to separate fact from fiction?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our course debunks these myths and dozens more, giving you the real facts 
              you need to make smart financial decisions.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00D563] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00D563]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Learn the Truth
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}