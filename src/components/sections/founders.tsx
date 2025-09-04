import Image from 'next/image'

export default function FoundersSection() {
  return (
    <section className="section-light-background min-h-screen py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Sonaal's Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1e736df1-bc8d-4bc8-be88-1a2e5df42f7d-limitlessconcepts-xyz/assets/images/64d6d5037d2158fe07fb8851_Screen Shot 2023-08-11 at 8.40.27 PM-29.png"
                alt="Sonaal"
                width={400}
                height={400}
                className="rounded-lg w-full max-w-sm mx-auto lg:mx-0"
              />
            </div>
            <div className="text-left">
              <p className="text-lg leading-relaxed mb-4">
                Hi -- I'm Sonaal, I am the creator of <a href="https://www.instagram.com/golimitlesss/" className="text-blue-600 hover:underline">GoLimitlesss</a> - which focuses on visualizing the world's wisdom. The goal is to share knowledge, learnings and core concepts in their simplest visual form.
              </p>
              <p className="text-lg leading-relaxed">
                Today, I'm a co-founder at NFN Labs as well as Kabadiwalla Connect where I lead product design.
              </p>
            </div>
          </div>

          {/* Aaron's Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1e736df1-bc8d-4bc8-be88-1a2e5df42f7d-limitlessconcepts-xyz/assets/images/64d6a2dc517410d771a9f63d_ad2-30.png"
                alt="Aaron"
                width={400}
                height={400}
                className="rounded-lg w-full max-w-sm mx-auto lg:mx-0"
              />
            </div>
            <div className="text-left">
              <p className="text-lg leading-relaxed mb-4">
                Hi -- I'm Aaron, an ex-music video producer, turned finance guy. I've closed 8-figure deals and built portfolios by bridging the gap between the 'creative' and the 'quantitative'.
              </p>
              <p className="text-lg leading-relaxed">
                Today, I am a partner at Cedar Lane Capital and do financial consulting for some of the world's biggest celebrities. I have felt first-hand the career-changing power of gaining financial acumen (without a business degree).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}