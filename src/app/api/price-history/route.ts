// src/app/api/price-history/route.ts

import { NextResponse } from "next/server";
import { getPriceTrends } from "@/services/priceService";
import {
  getCachedHistoricalPrices,
  setCachedHistoricalPrices,
} from "@/services/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months") || "6");
    const timeRange = `${months}M`;

    // Check cache first
    const cachedPrices = getCachedHistoricalPrices(timeRange);
    if (cachedPrices) {
      return NextResponse.json(cachedPrices);
    }

    // If no cache, fetch fresh data
    const trends = await getPriceTrends(months);

    // Store in cache
    setCachedHistoricalPrices(timeRange, trends);

    return NextResponse.json(trends);
  } catch (error) {
    console.error("Failed to fetch price history:", error);
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
