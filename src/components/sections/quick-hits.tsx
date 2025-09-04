"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const quickHits = [
  {
    id: 1,
    title: "Quick Hit #1:",
    subtitle: "Compound Interest",
    visualComponent: (
      <div className="relative w-full max-w-md mx-auto">
        {/* Compound Interest Visualization */}
        <div className="relative h-64 flex items-end justify-center space-x-1">
          {/* Bar chart representation */}
          {Array.from({ length: 12 }, (_, i) => {
            const height = Math.pow(1.15, i + 1) * 8; // Exponential growth
            return (
              <div
                key={i}
                className="bg-[#00D563] transition-all duration-1000 ease-out flex flex-col items-center justify-end relative"
                style={{ 
                  height: `${Math.min(height, 200)}px`,
                  width: '20px'
                }}
              >
                {/* Dollar signs on top of bars */}
                <div className="text-[#00D563] text-xs font-bold mb-1">$</div>
              </div>
            );
          })}
        </div>
        {/* Curved arrow showing growth */}
        <div className="absolute top-8 left-8 right-8">
          <svg 
            viewBox="0 0 300 100" 
            className="w-full h-20 text-white"
            fill="none"
          >
            <path
              d="M10 80 Q150 20 290 30"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            <polygon
              points="290,26 295,30 290,34 288,30"
              fill="currentColor"
            />
          </svg>
        </div>
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#00D563] rounded-full p-3 shadow-lg hover:scale-110 transition-transform cursor-pointer">
            <Play className="w-6 h-6 text-black fill-current" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Quick Hit #2:",
    subtitle: "Probabilistic Reasoning & Expected Value",
    visualComponent: (
      <div className="relative w-full max-w-md mx-auto">
        {/* Probabilistic visualization */}
        <div className="relative h-64 flex items-center justify-center">
          {/* Decision tree visualization */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-[#00D563] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-black font-bold text-sm">?</span>
              </div>
              <div className="text-sm text-gray-400">Decision Point</div>
            </div>
            
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                  <span className="text-white text-xs">70%</span>
                </div>
                <div className="text-xs text-gray-400">High Probability</div>
                <div className="text-xs text-[#00D563] font-bold">+$1000</div>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                  <span className="text-white text-xs">30%</span>
                </div>
                <div className="text-xs text-gray-400">Low Probability</div>
                <div className="text-xs text-red-400 font-bold">-$500</div>
              </div>
            </div>
            
            <div className="text-center border-t border-gray-600 pt-4">
              <div className="text-sm text-gray-400">Expected Value:</div>
              <div className="text-lg text-[#00D563] font-bold">+$550</div>
            </div>
          </div>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[#00D563] rounded-full p-3 shadow-lg hover:scale-110 transition-transform cursor-pointer pointer-events-auto">
            <Play className="w-6 h-6 text-black fill-current" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Quick Hit #3:",
    subtitle: "Rich people don't work.",
    visualComponent: (
      <div className="relative w-full max-w-md mx-auto">
        {/* Wealth streams visualization */}
        <div className="relative h-64 flex items-center justify-center">
          <div className="space-y-6 w-full">
            {/* Person icon */}
            <div className="text-center">
              <div className="bg-[#00D563] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                <span className="text-black font-bold text-lg">👤</span>
              </div>
              <div className="text-sm text-gray-400">Wealthy Individual</div>
            </div>
            
            {/* Income streams */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="bg-green-600/20 border border-[#00D563] rounded-lg p-3">
                  <div className="text-[#00D563] font-bold text-sm">Rental</div>
                  <div className="text-xs text-gray-400">Properties</div>
                  <div className="text-[#00D563] text-lg font-bold">💰</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-green-600/20 border border-[#00D563] rounded-lg p-3">
                  <div className="text-[#00D563] font-bold text-sm">Stock</div>
                  <div className="text-xs text-gray-400">Dividends</div>
                  <div className="text-[#00D563] text-lg font-bold">📈</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-green-600/20 border border-[#00D563] rounded-lg p-3">
                  <div className="text-[#00D563] font-bold text-sm">Business</div>
                  <div className="text-xs text-gray-400">Ownership</div>
                  <div className="text-[#00D563] text-lg font-bold">🏢</div>
                </div>
              </div>
            </div>
            
            {/* Passive income indicator */}
            <div className="text-center">
              <div className="text-sm text-gray-400">Passive Income Streams</div>
              <div className="text-[#00D563] font-bold">Work Optional</div>
            </div>
          </div>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[#00D563] rounded-full p-3 shadow-lg hover:scale-110 transition-transform cursor-pointer pointer-events-auto">
            <Play className="w-6 h-6 text-black fill-current" />
          </div>
        </div>
      </div>
    )
  }
];

export default function QuickHitsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % quickHits.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + quickHits.length) % quickHits.length);
  };

  const currentHit = quickHits[currentSlide];

  return (
    <section className="bg-black py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slide Content */}
          <div className="text-center py-12">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {currentHit.title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12">
              {currentHit.subtitle}
            </p>
            
            {/* Visual Component */}
            <div className="flex justify-center items-center min-h-[300px]">
              {currentHit.visualComponent}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {quickHits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-[#00D563]' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}