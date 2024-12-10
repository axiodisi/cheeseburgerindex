import Link from "next/link";

export default function CheezburgzPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold mb-6">Cheezburgz Token 🍔</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Welcome to Cheezburgz</h2>
          <p className="text-gray-700 leading-relaxed">
            The first token that lets you trade the taste of a cheeseburger!
            While we track the real Cheeseburger Price Index just for fun,
            Cheezburgz is all about bringing fast food to fast gains on
            pump.fun.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            How to Get Your Cheezburgz
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Trade on pump.fun</h3>
              <p className="text-gray-700">
                Get your Cheezburgz while they're hot! Available exclusively on
                pump.fun. Buy early before the price catches up to a real
                cheeseburger!
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Watch It Sizzle</h3>
              <p className="text-gray-700">
                Track your gains alongside our Cheeseburger Price Index. Will
                Cheezburgz pump higher than beef prices? Only one way to find
                out!
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Join the Menu</h3>
              <p className="text-gray-700">
                Be part of the tastiest community in crypto. Where meme meets
                meal, and every trade comes with extra cheese! 🧀
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          ← Back to Price Index
        </Link>
      </div>
    </div>
  );
}
