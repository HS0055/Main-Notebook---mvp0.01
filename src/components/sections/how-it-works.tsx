import React from 'react';

export default function HowItWorksSection() {
  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            How does Limitless Concepts work?
          </h2>
          <a 
            href="#pricing" 
            className="inline-flex items-center bg-[#00D563] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#00B553] transition-colors"
          >
            Get access to Limitless Concepts, for life.
          </a>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-bold">
                1
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xl lg:text-2xl leading-relaxed">
                Dive into the <strong>short videos</strong> in the modules that are{' '}
                <strong>most applicable to you</strong>. Or, go through the whole thing. 
                Limitless Concepts can be used as a whole, or in parts.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-bold">
                2
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xl lg:text-2xl leading-relaxed">
                Put the tools and knowledge to use across your business life using the 
                interactive spreadsheet. Practical reinforcement is key. 🔑
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-bold">
                3
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xl lg:text-2xl leading-relaxed">
                Limitless Concepts is <strong>your</strong> tool forever, so make notes 
                and refer back as concepts re-emerge in the future.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-bold">
                4
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  PUT A CFO IN YOUR BACK POCKET
                </h3>
              </div>
              <div className="flex items-start gap-4">
                <img 
                  src="https://cdn.prod.website-files.com/64d6a2dc517410d771a9f625/64d6a2dc517410d771a9f648_Screen%20Shot%202022-11-29%20at%208.20.49%20PM.png"
                  alt="Document icon"
                  className="w-12 h-12 flex-shrink-0"
                />
                <p className="text-xl lg:text-2xl leading-relaxed">
                  Limitless Concepts is <strong>your</strong> tool forever, so make notes 
                  and refer back as concepts re-emerge in the future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}