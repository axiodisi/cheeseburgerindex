// src/app/api/prices/route.ts
import { NextResponse } from "next/server";
import { fetchIngredientPrices } from "@/services/scraper";

export async function GET() {
  try {
    const prices = await fetchIngredientPrices();
    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
