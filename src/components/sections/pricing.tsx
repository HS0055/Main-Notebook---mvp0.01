"use client";

import { motion } from "motion/react";
import { Check, Star, Shield, CreditCard } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Limitless Concepts",
      price: 37,
      originalPrice: 97,
      badge: "Early Bird",
      badgeColor: "bg-[#00D563]",
      description: "Perfect for entrepreneurs and business owners who want to build confidence with essential business knowledge",
      features: [
        "40+ Visual Business Lessons",
        "Quick 5-10 Minute Videos", 
        "Interactive Spreadsheet Templates",
        "Key Insights from 20+ Business Books",
        "Finance Fundamentals Made Simple",
        "Decision-Making Frameworks",
        "Lifetime Access",
        "Mobile & Desktop Learning",
      ],
      paymentOptions: [
        "One-time payment",
        "30-day money-back guarantee",
        "Instant access after purchase"
      ],
      cta: "Get Early-bird Access",
      popular: true
    },
    {
      name: "Hands-on Bootcamp",
      price: 2000,
      description: "Intensive 8-week program with personalized coaching and live sessions for serious entrepreneurs",
      features: [
        "Everything in Limitless Concepts",
        "8-Week Live Bootcamp",
        "1-on-1 Coaching Sessions",
        "Group Mastermind Access",
        "Custom Business Analysis",
        "Direct Access to Founders",
        "Weekly Q&A Calls",
        "Certificate of Completion"
      ],
      paymentOptions: [
        "Payment plan available",
        "Limited to 20 students per cohort", 
        "Next cohort starts March 2024"
      ],
      cta: "Apply for Bootcamp",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Choose your learning path
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start building business confidence today with our comprehensive courses
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative bg-gray-900 rounded-2xl border-2 ${
                plan.popular 
                  ? 'border-[#00D563] shadow-[#00D563]/20 shadow-2xl' 
                  : 'border-gray-800'
              } overflow-hidden`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-[#00D563] text-black px-6 py-2 rounded-full font-bold text-sm">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  {plan.badge && (
                    <div className={`inline-block ${plan.badgeColor} text-black px-3 py-1 rounded-full font-bold text-sm mb-4`}>
                      {plan.badge}
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-2xl text-gray-500 line-through">
                        ${plan.originalPrice}
                      </span>
                    )}
                  </div>

                  {plan.originalPrice && (
                    <p className="text-[#00D563] font-semibold">
                      Save ${plan.originalPrice - plan.price}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + featureIndex * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0">
                        <Check className="w-5 h-5 text-[#00D563]" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Payment Options */}
                <div className="border-t border-gray-800 pt-6 mb-8">
                  <div className="space-y-2">
                    {plan.paymentOptions.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-[#00D563] rounded-full"></div>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                    plan.popular
                      ? 'bg-[#00D563] text-black hover:bg-[#00D563]/90'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {plan.cta}
                </motion.button>

                {/* Security Badges */}
                {index === 0 && (
                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CreditCard className="w-4 h-4" />
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mt-16"
        >
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#FFA500] fill-current" />
            ))}
          </div>
          <p className="text-gray-400">
            Join 650+ entrepreneurs who've transformed their business confidence
          </p>
        </motion.div>
      </div>
    </section>
  );
}