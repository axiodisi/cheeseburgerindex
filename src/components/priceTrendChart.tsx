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
  const [timeRange, setTimeRange] = useState<"3M" | "6M" | "1Y">("1Y");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1300, height: 650 });
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

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth > 768 ? 1300 : window.innerWidth - 16,
        height: window.innerWidth > 768 ? 650 : window.innerWidth,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[650px] flex items-center justify-center">
        <p>Loading price history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[650px] flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  const actualWidth = dimensions.width;
  const actualHeight = dimensions.height;
  const MARGIN = { top: 40, right: 80, bottom: 60, left: 60 };
  const chartWidth = actualWidth - MARGIN.left - MARGIN.right;
  const chartHeight = actualHeight - MARGIN.top - MARGIN.bottom;

  const maxPrice = Math.max(...data.map((d) => d.totalCost));
  const minPrice = Math.min(...data.map((d) => d.totalCost));
  const priceRange = maxPrice - minPrice;
  const yMax = maxPrice + priceRange * 0.1;
  const yMin = Math.max(0, minPrice - priceRange * 0.1);

  const points = data
    .map((d, i) => {
      const x = (i * chartWidth) / (data.length - 1) + MARGIN.left;
      const y =
        chartHeight -
        ((d.totalCost - yMin) / (yMax - yMin)) * chartHeight +
        MARGIN.top;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  const areaPath = `${points} L${MARGIN.left + chartWidth},${
    chartHeight + MARGIN.top
  } L${MARGIN.left},${chartHeight + MARGIN.top} Z`;

  const yTicks = Array.from({ length: 6 }, (_, i) => {
    const price = yMin + (i * (yMax - yMin)) / 5;
    return {
      value: price,
      y: chartHeight - (i * chartHeight) / 5 + MARGIN.top,
    };
  });

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - MARGIN.left;

    const index = Math.min(
      Math.max(0, Math.round((mouseX / chartWidth) * (data.length - 1))),
      data.length - 1
    );

    if (index >= 0 && index < data.length) {
      const point = data[index];
      const x = (index * chartWidth) / (data.length - 1) + MARGIN.left;
      const y =
        chartHeight -
        ((point.totalCost - yMin) / (yMax - yMin)) * chartHeight +
        MARGIN.top;

      setTooltip({
        show: true,
        x,
        y,
        data: point,
      });
    }
  };

  return (
    <div className="w-full p-2">
      <div className="w-full h-[70vh]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Price Analysis</h3>
            <p className="text-sm text-slate-500">
              Historical burger cost trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "3M" | "6M" | "1Y")
              }
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
            </select>
          </div>
        </div>

        <div className="relative bg-white rounded-lg shadow-sm p-4 h-[65vh]">
          <svg
            viewBox={`0 0 ${actualWidth} ${actualHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ maxWidth: "100%" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() =>
              setTooltip({ show: false, x: 0, y: 0, data: null })
            }
          >
            {yTicks.map((tick, i) => (
              <line
                key={`grid-${i}`}
                x1={MARGIN.left}
                y1={tick.y}
                x2={actualWidth - MARGIN.right}
                y2={tick.y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            ))}

            <path d={areaPath} fill="url(#gradient)" opacity="0.1" />
            <path d={points} fill="none" stroke="#2563eb" strokeWidth="3" />

            {yTicks.map((tick, i) => (
              <text
                key={`y-${i}`}
                x={actualWidth - MARGIN.right + 10}
                y={tick.y}
                textAnchor="start"
                dominantBaseline="middle"
                className="text-base fill-slate-700"
              >
                ${tick.value.toFixed(2)}
              </text>
            ))}

            {data
              .filter((_, i) => i % Math.ceil(data.length / 8) === 0)
              .map((point, i) => (
                <text
                  key={`x-${i}`}
                  x={
                    MARGIN.left +
                    (i * Math.ceil(data.length / 8) * chartWidth) /
                      (data.length - 1)
                  }
                  y={actualHeight - MARGIN.bottom + 20}
                  textAnchor="middle"
                  className="text-base fill-slate-700"
                  transform={`rotate(-45, ${
                    MARGIN.left +
                    (i * Math.ceil(data.length / 8) * chartWidth) /
                      (data.length - 1)
                  }, ${actualHeight - MARGIN.bottom + 20})`}
                >
                  {formatDate(point.date)}
                </text>
              ))}

            <defs>
              <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            {tooltip.show && tooltip.data && (
              <g>
                <line
                  x1={tooltip.x}
                  y1={MARGIN.top}
                  x2={tooltip.x}
                  y2={actualHeight - MARGIN.bottom}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#2563eb" />
                <rect
                  x={tooltip.x - 50}
                  y={tooltip.y - 40}
                  width="100"
                  height="30"
                  fill="white"
                  stroke="#e2e8f0"
                  rx="4"
                />
                <text
                  x={tooltip.x}
                  y={tooltip.y - 20}
                  textAnchor="middle"
                  className="text-sm font-bold fill-slate-800"
                >
                  ${tooltip.data.totalCost.toFixed(2)}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PriceTrendChart;
