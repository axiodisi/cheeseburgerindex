"use client";
import React, { useState, useEffect } from "react";

interface PriceDataPoint {
  date: string;
  totalCost: number;
}

interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  data: PriceDataPoint | null;
}

const PriceTrendChart: React.FC = () => {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<"3M" | "6M" | "1Y">("6M");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    data: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const months = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;
        const response = await fetch(`/api/price-history?months=${months}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  if (loading)
    return (
      <div className="w-full h-[500px] md:h-[700px] flex items-center justify-center bg-slate-50 rounded-lg">
        <p>Loading price history...</p>
      </div>
    );

  if (error)
    return (
      <div className="w-full h-[500px] md:h-[700px] flex items-center justify-center bg-slate-50 rounded-lg">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  if (!data || data.length === 0) return null;

  // Chart dimensions - increased height
  const MARGIN = { top: 40, right: 80, bottom: 60, left: 40 };
  const width = 1200;
  const height = 600;
  const chartWidth = width - MARGIN.left - MARGIN.right;
  const chartHeight = height - MARGIN.top - MARGIN.bottom;

  // Rest of the code remains the same until the return statement

  return (
    <div className="w-full bg-slate-50 p-4 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Price Analysis</h3>
          <p className="text-sm text-slate-500">
            Historical burger cost trends
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as "3M" | "6M" | "1Y")}
          className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
        </select>
      </div>

      <div className="relative w-full h-[500px] md:h-[700px] bg-white rounded-lg shadow-sm p-4">
        {/* Rest of the SVG code remains the same */}
      </div>
    </div>
  );
};

export default PriceTrendChart;
