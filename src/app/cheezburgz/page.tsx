"use client";
import React from "react";
import Link from "next/link";
import KetchupBottle from "@/components/KetchupBottle";

export default function CheezburgzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5E1914] via-[#4A0F0C] to-[#5E1914]">
      <KetchupBottle />

      <div className="flex flex-col items-center justify-center pt-20 pb-16 px-4">
        <div className="text-8xl mb-6 animate-bounce">🍔</div>
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-white">
          Cheezburgz Token
        </h1>
        <p className="text-lg text-white/80 text-center max-w-2xl">
          The first token that lets you trade the taste of a cheeseburger!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10 hover:border-white/20 transition-all">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Trade on pump.fun
            </h2>
            <p className="text-white/80">
              Get your Cheezburgz while they&apos;re hot! Available exclusively
              on pump.fun. Buy early before the price catches up to a real
              cheeseburger!
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10 hover:border-white/20 transition-all">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Watch It Sizzle
            </h2>
            <p className="text-white/80">
              Track your gains alongside our Cheeseburger Price Index. Will
              Cheezburgz pump higher than beef prices? Only one way to find out!
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10 hover:border-white/20 transition-all">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Join the Menu
            </h2>
            <p className="text-white/80">
              Be part of the tastiest community in crypto. Where meme meets
              meal, and every trade comes with extra cheese! 🧀
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-red-900 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all text-xl shadow-lg hover:shadow-xl"
          >
            ← Back to Price Index
          </Link>
        </div>
      </div>
    </div>
  );
}
