"use client";
import Link from "next/link";

export default function CheezburgzPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center pt-20 pb-16 px-4">
        {/* Emoji with larger size */}
        <div className="text-8xl mb-6 animate-bounce">🍔</div>
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Cheezburgz Token
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          The first token that lets you trade the taste of a cheeseburger!
        </p>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Trade on pump.fun</h2>
            <p className="text-gray-700">
              Get your Cheezburgz while they&apos;re hot! Available exclusively
              on pump.fun. Buy early before the price catches up to a real
              cheeseburger!
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Watch It Sizzle</h2>
            <p className="text-gray-700">
              Track your gains alongside our Cheeseburger Price Index. Will
              Cheezburgz pump higher than beef prices? Only one way to find out!
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Join the Menu</h2>
            <p className="text-gray-700">
              Be part of the tastiest community in crypto. Where meme meets
              meal, and every trade comes with extra cheese! 🧀
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            ← Back to Price Index
          </Link>
        </div>
      </div>
    </div>
  );
}
