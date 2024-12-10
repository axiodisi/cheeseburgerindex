import { NextResponse } from "next/server";
import { getIngredientPrices } from "@/services/priceService";

export async function GET() {
  try {
    const prices = await getIngredientPrices();
    return NextResponse.json(prices);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
