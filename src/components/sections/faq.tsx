"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  number: string
}

const faqItems: FAQItem[] = [
  {
    id: "time-required",
    question: "How much time does Limitless Concepts require?",
    answer: "A: Limitless Concepts is engineered to require as little time as possible from you. It is built to quickly give you the foundational knowledge and then referred back to for the technical details. This means that you can spend as much or as little time with Limitless Concepts and it will still be useful.",
    number: "1/3"
  },
  {
    id: "target-audience",
    question: "Is Limitless Concepts for entrepreneurs? Or for employees?",
    answer: "A: Limitless Concepts is designed for anyone who wants to level up their technical business knowledge. The concepts inside of it apply to any business regardless of stage, type, or industry.‍",
    number: "2/3"
  },
  {
    id: "satisfaction",
    question: "What if I am not satisfied?",
    answer: "A: We are not happy if you are not 100% happy. We are motivated to help people level up their careers. If for any reason Limitless Concepts misses the mark within your first two weeks of ownership, you are entitled to a full refund as per the money-back guarantee.‍",
    number: "3/3"
  }
]

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            FAQ: Have any questions?
          </h2>
          <p className="text-gray-400 text-lg">
            Either reach out to us by{' '}
            <a href="mailto:aaron@limitlessconcepts.xyz?subject=Limitless%20Concepts%20Inquiry" className="underline hover:text-white transition-colors">
              email
            </a>{' '}
            -- or see the FAQ below:
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.id} className="section-faq-card overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-black">
                      {item.question}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">
                    {item.number}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      openItem === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              
              {openItem === item.id && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}