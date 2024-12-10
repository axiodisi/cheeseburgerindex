import { NextResponse } from "next/server";
import { getIngredientPrices } from "@/services/priceService";
import { getCachedPrices, setCachedPrices } from "@/services/cache";
import { IngredientPrice } from "@/types/ingredients";

export async function GET() {
  try {
    // Check cache first
    const cachedPrices: IngredientPrice[] | null = getCachedPrices();
    if (cachedPrices) {
      return NextResponse.json(cachedPrices);
    }

    // If no cache, fetch fresh prices
    const prices: IngredientPrice[] = await getIngredientPrices();

    // Store in cache
    setCachedPrices(prices);

    return NextResponse.json(prices);
  } catch (error) {
    console.error("Failed to fetch ingredient prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredient prices" },
      { status: 500 }
    );
  }
}
