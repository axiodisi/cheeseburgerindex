import Link from "next/link";
import CheeseburgerDashboard from "@/components/CheeseburgerDashboard";

export default function HomePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <CheeseburgerDashboard />

      <div className="text-center mt-8">
        <Link
          href="/cheezburgz"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Learn more about Cheezburgz token →
        </Link>
      </div>
    </div>
  );
}
