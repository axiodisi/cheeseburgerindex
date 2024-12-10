export interface IngredientPrice {
  name: string;
  pricePerPound: number;
  servingWeight: number;
  servingUnit: "pound" | "ounce" | "tablespoon" | "teaspoon";
  lastUpdated: string;
  source: string;
}

export interface CheeseburgerIngredient extends IngredientPrice {
  calculatedCost: number;
  percentage: number;
  color: string;
}

// Add new interface for historical prices
export interface HistoricalPrice {
  date: string;
  totalCost?: number;
  GroundBeef?: number;
  AmericanCheese?: number;
  Lettuce?: number;
  Tomato?: number;
  HamburgerBun?: number;
  Labor?: number;
  CookingEnergy?: number;
  [key: string]: number | string | undefined;
}
