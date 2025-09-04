"use client";

import { motion } from "motion/react";
import { Star, Users } from "lucide-react";

export default function SocialProofSection() {
  const customerAvatars = [
    { id: 1, name: "Sarah J.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1-5c08?w=40&h=40&fit=crop&crop=face" },
    { id: 2, name: "Mike R.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
    { id: 3, name: "Lisa K.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
    { id: 4, name: "David L.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    { id: 5, name: "Emma S.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face" },
  ];

  return (
    <section className="py-16 bg-black border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Star Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-1 mb-4"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Star className="w-6 h-6 text-[#FFA500] fill-current" />
              </motion.div>
            ))}
          </motion.div>

          {/* Rating Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white text-xl font-semibold mb-8"
          >
            4.97 based on 233 reviews
          </motion.p>

          {/* Customer Avatars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            {/* Avatar Stack */}
            <div className="flex -space-x-3">
              {customerAvatars.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="relative"
                >
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-12 h-12 rounded-full border-3 border-[#00D563] object-cover"
                  />
                </motion.div>
              ))}
            </div>

            {/* Users Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.3 }}
              className="w-12 h-12 bg-[#00D563] rounded-full flex items-center justify-center ml-2"
            >
              <Users className="w-6 h-6 text-black" />
            </motion.div>
          </motion.div>

          {/* Happy Customers Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-gray-400 text-lg"
          >
            Join 650+ creative professionals who love our courses
          </motion.p>
        </div>
      </div>
    </section>
  );
}