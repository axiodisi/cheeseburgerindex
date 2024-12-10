import { IngredientPrice } from "../types/ingredients";

interface CacheData {
  currentPrices?: IngredientPrice[];
  historicalPrices?: {
    [timeRange: string]: any[];
  };
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

let priceCache: CacheData = {
  timestamp: 0,
};

export function getCachedPrices(): IngredientPrice[] | null {
  if (!priceCache.currentPrices) return null;
  if (Date.now() - priceCache.timestamp > CACHE_DURATION) return null;
  return priceCache.currentPrices;
}

export function setCachedPrices(prices: IngredientPrice[]): void {
  priceCache = {
    currentPrices: prices,
    timestamp: Date.now(),
    historicalPrices: priceCache.historicalPrices,
  };
}

export function getCachedHistoricalPrices(timeRange: string): any[] | null {
  if (!priceCache.historicalPrices?.[timeRange]) return null;
  if (Date.now() - priceCache.timestamp > CACHE_DURATION) return null;
  return priceCache.historicalPrices[timeRange];
}

export function setCachedHistoricalPrices(
  timeRange: string,
  prices: any[]
): void {
  priceCache = {
    ...priceCache,
    historicalPrices: {
      ...(priceCache.historicalPrices || {}),
      [timeRange]: prices,
    },
    timestamp: Date.now(),
  };
}
