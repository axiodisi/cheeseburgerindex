import React, { useState, useEffect } from "react";

interface PriceDataPoint {
  date: string;
  totalCost: number;
}

const PriceTrendChart: React.FC = () => {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<"3M" | "6M" | "1Y">("1Y");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="w-full h-96 flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="w-full h-96 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!data?.length) return null;

  const maxPrice = Math.max(...data.map((d) => d.totalCost));
  const minPrice = Math.min(...data.map((d) => d.totalCost));
  const priceRange = maxPrice - minPrice;
  const yMax = maxPrice + priceRange * 0.1;
  const yMin = Math.max(0, minPrice - priceRange * 0.1);

  return (
    <div className="w-full px-4 pb-8 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Price Analysis</h3>
          <p className="text-slate-500">Historical burger cost trends</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as "3M" | "6M" | "1Y")}
          className="px-4 py-2 border rounded"
        >
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
        </select>
      </div>

      <div className="aspect-[2/1] w-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines and Y-axis labels */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = 400 * (i / 4) + 50;
            const price = yMax - ((yMax - yMin) * i) / 4;
            return (
              <g key={i}>
                <line
                  x1="100"
                  y1={y}
                  x2="900"
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text
                  x="90"
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs fill-slate-600"
                >
                  ${price.toFixed(2)}
                </text>
                {/* Right side labels */}
                <text
                  x="910"
                  y={y}
                  textAnchor="start"
                  alignmentBaseline="middle"
                  className="text-xs fill-slate-600"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Line chart */}
          <path
            d={data
              .map((d, i) => {
                const x = 100 + (800 * i) / (data.length - 1);
                const y = 450 - ((d.totalCost - yMin) / (yMax - yMin)) * 400;
                return `${i === 0 ? "M" : "L"} ${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
          />

          {/* Area fill */}
          <path
            d={`
              ${data
                .map((d, i) => {
                  const x = 100 + (800 * i) / (data.length - 1);
                  const y = 450 - ((d.totalCost - yMin) / (yMax - yMin)) * 400;
                  return `${i === 0 ? "M" : "L"} ${x},${y}`;
                })
                .join(" ")}
              L 900,450 L 100,450 Z
            `}
            fill="url(#gradient)"
            opacity="0.2"
          />

          {/* X-axis dates */}
          {data
            .filter((_, i) => i % 3 === 0)
            .map((d, i, filtered) => {
              const x = 100 + (800 * i) / (filtered.length - 1);
              return (
                <text
                  key={i}
                  x={x}
                  y="480"
                  textAnchor="middle"
                  className="text-xs fill-slate-600"
                >
                  {new Date(d.date).toLocaleDateString(undefined, {
                    month: "short",
                    year: "2-digit",
                  })}
                </text>
              );
            })}

          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default PriceTrendChart;
