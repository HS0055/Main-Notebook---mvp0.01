"use client";

import { Check } from "lucide-react";

export default function Guarantee() {
  return (
    <section className="py-20 bg-light-gray section-light-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <h4 className="text-sm font-semibold mb-2 text-gray-text uppercase tracking-wider">
          HERE IS OUR PROMISE
        </h4>

        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-black">
          Limitless Concepts will:
        </h2>

        {/* Benefits with green checkmarks */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="w-6 h-6 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black">
              build more business confidence
            </h3>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="w-6 h-6 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black">
              create your solid technical foundation
            </h3>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="w-6 h-6 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-black">
              equip you with actionable decision-making and evaluation tools
            </h3>
          </div>
        </div>

        {/* Descriptive text */}
        <div className="max-w-2xl mx-auto mb-12 space-y-6">
          <p className="text-lg text-black leading-relaxed">
            Whether you are planning a new business, evaluating projects, or making important decisions, Limitless Concepts can help you develop a technical edge.
          </p>

          <p className="text-lg text-black leading-relaxed">
            Every explanation is designed to be{" "}
            <span className="font-semibold">simple, visual, and interactive</span>. This way the knowledge will sink in.
          </p>

          <p className="text-lg text-black leading-relaxed">
            Plus, Limitless Concepts including all of the interactive materials are yours for life.
          </p>

          <p className="text-lg text-black leading-relaxed">
            You can make notes and refer back to relevant concepts when they pop up in the future.
          </p>
        </div>

        {/* CTA Button */}
        <button className="bg-primary-green text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-green/90 transition-colors duration-200">
          Level Up
        </button>
      </div>
    </section>
  );
}