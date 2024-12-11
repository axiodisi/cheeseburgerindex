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
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    data: null,
  });

  const dimensions = {
    width: 1000,
    height: 595,
    margin: {
      top: 10,
      right: -50,
      bottom: 40,
      left: 50,
    },
  };

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

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p>Loading price history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  const chartWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  const chartHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const maxPrice = Math.max(...data.map((d) => d.totalCost));
  const minPrice = Math.min(...data.map((d) => d.totalCost));
  const priceRange = maxPrice - minPrice;
  const yMax = maxPrice + priceRange * 0.1;
  const yMin = Math.max(0, minPrice - priceRange * 0.1);

  const yTickCount = 6;
  const yTicks = Array.from(
    { length: yTickCount },
    (_, i) => yMin + ((yMax - yMin) * i) / (yTickCount - 1)
  );

  const xTickCount = 6;
  const xTicks = Array.from({ length: xTickCount }, (_, i) => {
    const index = Math.floor((i * (data.length - 1)) / (xTickCount - 1));
    return data[index].date;
  });

  const getX = (index: number) =>
    (index * chartWidth) / (data.length - 1) + dimensions.margin.left;

  const getY = (price: number) =>
    chartHeight -
    ((price - yMin) / (yMax - yMin)) * chartHeight +
    dimensions.margin.top;

  const points = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)},${getY(d.totalCost)}`)
    .join(" ");

  const areaPath = `${points} L${getX(data.length - 1)},${
    chartHeight + dimensions.margin.top
  } L${dimensions.margin.left},${chartHeight + dimensions.margin.top} Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - dimensions.margin.left;

    const index = Math.min(
      Math.max(0, Math.round((mouseX / chartWidth) * (data.length - 1))),
      data.length - 1
    );

    if (index >= 0 && index < data.length) {
      const point = data[index];
      setTooltip({
        show: true,
        x: getX(index),
        y: getY(point.totalCost),
        data: point,
      });
    }
  };

  return (
    <div className="w-full bg-white pt-6">
      <div className="flex justify-between items-center mb-2 px-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Price Analysis</h3>
          <p className="text-sm text-slate-500">
            Historical burger cost trends
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as "3M" | "6M" | "1Y")}
          className="px-4 py-2 border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
          style={{ minWidth: "600px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() =>
            setTooltip({ show: false, x: 0, y: 0, data: null })
          }
        >
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={dimensions.margin.left}
              y1={getY(tick)}
              x2={dimensions.margin.left + chartWidth}
              y2={getY(tick)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          {/* Area and line */}
          <path d={areaPath} fill="url(#gradient)" opacity="0.2" />
          <path
            d={points}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            className="drop-shadow-sm"
          />

          {/* Border lines */}
          <line
            x1={dimensions.margin.left + chartWidth}
            y1={dimensions.margin.top}
            x2={dimensions.margin.left + chartWidth}
            y2={chartHeight + dimensions.margin.top}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1={dimensions.margin.left}
            y1={chartHeight + dimensions.margin.top}
            x2={dimensions.margin.left + chartWidth}
            y2={chartHeight + dimensions.margin.top}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Y-axis ticks and labels on right side */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <text
                x={dimensions.margin.left + chartWidth + 8}
                y={getY(tick)}
                textAnchor="start"
                alignmentBaseline="middle"
                className="text-xs fill-slate-600 font-medium"
              >
                ${tick.toFixed(2)}
              </text>
            </g>
          ))}

          {/* X-axis ticks and labels */}
          {xTicks.map((date) => {
            const index = data.findIndex((d) => d.date === date);
            return (
              <g key={date}>
                <text
                  x={getX(index)}
                  y={chartHeight + dimensions.margin.top + 16}
                  textAnchor="middle"
                  className="text-xs fill-slate-600 font-medium"
                >
                  {new Date(date).toLocaleDateString(undefined, {
                    month: "short",
                    year: "2-digit",
                  })}
                </text>
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip.show && tooltip.data && (
            <g>
              <line
                x1={tooltip.x}
                y1={dimensions.margin.top}
                x2={tooltip.x}
                y2={chartHeight + dimensions.margin.top}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <circle
                cx={tooltip.x}
                cy={tooltip.y}
                r="4"
                fill="#2563eb"
                className="drop-shadow-sm"
              />
              <rect
                x={tooltip.x - 45}
                y={tooltip.y - 35}
                width="90"
                height="25"
                fill="white"
                stroke="#e2e8f0"
                rx="4"
                className="drop-shadow-sm"
              />
              <text
                x={tooltip.x}
                y={tooltip.y - 18}
                textAnchor="middle"
                className="text-xs font-bold fill-slate-800"
              >
                ${tooltip.data.totalCost.toFixed(2)}
              </text>
            </g>
          )}

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
