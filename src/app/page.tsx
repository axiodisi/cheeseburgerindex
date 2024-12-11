import CheeseburgerDashboard from "@/components/CheeseburgerDashboard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5E1914] via-[#4A0F0C] to-[#5E1914] py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <CheeseburgerDashboard />
      </div>
    </div>
  );
}
