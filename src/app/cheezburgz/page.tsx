"use client";
import Link from "next/link";

export default function CheezburgzPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center pt-20 pb-16 px-4">
        <div className="text-8xl mb-6 animate-bounce">🍔</div>
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-[#8B4513] to-[#FF6B6B] bg-clip-text text-transparent">
          Cheezburgz Token
        </h1>
        <p className="text-lg text-[#333333] text-center max-w-2xl">
          The first token that lets you trade the taste of a cheeseburger!
        </p>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-[#FFC107]/10 to-[#FFD54F]/10 rounded-2xl p-8 shadow-sm border border-[#FFC107]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">
              Trade on pump.fun
            </h2>
            <p className="text-[#333333]">
              Get your Cheezburgz while they&apos;re hot! Available exclusively
              on pump.fun. Buy early before the price catches up to a real
              cheeseburger!
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#90EE90]/10 to-[#90EE90]/20 rounded-2xl p-8 shadow-sm border border-[#90EE90]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">
              Watch It Sizzle
            </h2>
            <p className="text-[#333333]">
              Track your gains alongside our Cheeseburger Price Index. Will
              Cheezburgz pump higher than beef prices? Only one way to find out!
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/20 rounded-2xl p-8 shadow-sm border border-[#FF6B6B]/20">
            <h2 className="text-2xl font-bold mb-4 text-[#8B4513]">
              Join the Menu
            </h2>
            <p className="text-[#333333]">
              Be part of the tastiest community in crypto. Where meme meets
              meal, and every trade comes with extra cheese! 🧀
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#8B4513] to-[#FFC107] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg shadow-lg hover:shadow-xl"
          >
            ← Back to Price Index
          </Link>
        </div>
      </div>
    </div>
  );
}
