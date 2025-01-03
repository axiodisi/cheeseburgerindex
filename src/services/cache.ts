import { IngredientPrice, HistoricalPrice } from "../types/ingredients";

interface CacheData {
  currentPrices?: IngredientPrice[];
  historicalPrices?: {
    [timeRange: string]: HistoricalPrice[];
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
// Add this to @/services/cache.ts
export function setCachedPrices(prices: IngredientPrice[]): void {
  priceCache = {
    ...priceCache,
    currentPrices: prices,
    timestamp: Date.now(),
  };
}

export function getCachedHistoricalPrices(
  timeRange: string
): HistoricalPrice[] | null {
  if (!priceCache.historicalPrices?.[timeRange]) return null;
  if (Date.now() - priceCache.timestamp > CACHE_DURATION) return null;
  return priceCache.historicalPrices[timeRange];
}

export function setCachedHistoricalPrices(
  timeRange: string,
  prices: HistoricalPrice[]
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
