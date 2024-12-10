import { NextResponse } from "next/server";
import { getIngredientPrices } from "@/services/priceService";

export async function GET() {
    try {
        const prices = await getIngredientPrices();
        return NextResponse.json(prices);
    } catch (error) {
        console.error("Failed to fetch ingredient prices:", error);
        return NextResponse.json(
            { error: "Failed to fetch ingredient prices" },
            { status: 500 }
        );
    }
}