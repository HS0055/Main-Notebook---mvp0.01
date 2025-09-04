"use client";

import { motion } from "motion/react";

export default function CompanyLogos() {
  const companies = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'InnovateLab', logo: 'IL' },
    { name: 'FutureWorks', logo: 'FW' },
    { name: 'ByteStream', logo: 'BS' },
    { name: 'CloudScale', logo: 'CS' },
    { name: 'DataFlow', logo: 'DF' },
    { name: 'NextGen', logo: 'NG' },
    { name: 'SparkTech', logo: 'ST' },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Trusted by innovative companies worldwide
          </p>
        </motion.div>

        {/* Infinite scroll animation */}
        <div className="overflow-hidden">
          <motion.div
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
            className="flex space-x-12"
            style={{ width: 'calc(240px * 16)' }} // Double the logos for seamless loop
          >
            {[...companies, ...companies].map((company, index) => (
              <motion.div
                key={`${company.name}-${index}`}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 flex items-center justify-center w-32 h-16"
              >
                <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{company.logo}</span>
                  </div>
                  <span className="font-semibold text-gray-600 text-sm">{company.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <p className="text-3xl font-bold text-gray-900">500+</p>
            <p className="text-sm text-gray-600">Companies using our platform</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">98%</p>
            <p className="text-sm text-gray-600">Customer satisfaction rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Enterprise support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}