import axios from "axios";
interface FREDObservation {
  date: string;
  value: string;
  realtime_start: string;
  realtime_end: string;
}

interface FREDResponse {
  observations: FREDObservation[];
}

interface priceData {
  date: string;
  [key: string]: number | string;
}

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = "https://api.stlouisfed.org/fred/series/observations";
const LABOR_TIME_PER_BURGER = 6 / 60;
// Energy constant for cooking
const COOKING_ENERGY = 2.4 * (4 / 60); // kWh - 2.4kW grill for 4 minutes

const INGREDIENTS = {
  "Ground Beef": {
    seriesId: "APU0100710211",
    servingWeight: 0.25, // 1/4 pound patty
    servingUnit: "pound",
  },
  "American Cheese": {
    seriesId: "APU0000710211",
    servingWeight: 0.0625, // 1 oz slice = 1/16 pound
    servingUnit: "pound",
  },
  Lettuce: {
    seriesId: "APU0000FL2101",
    servingWeight: 0.1,
    servingUnit: "pound",
  },
  Tomato: {
    seriesId: "APU0000712311",
    servingWeight: 0.1,
    servingUnit: "pound",
  },
  "Hamburger Bun": {
    seriesId: "APU0000702111",
    servingWeight: 1,
    servingUnit: "unit",
  },
};

const ADDITIONAL_METRICS = {
  LABOR_WAGE: "CES7000000003",
  ELECTRICITY: "APU000072610",
};

async function fetchFREDPrice(seriesId: string): Promise<number> {
  const params = {
    series_id: seriesId,
    api_key: FRED_API_KEY,
    file_type: "json",
    sort_order: "desc",
    limit: 1,
  };

  try {
    const response = await axios.get<FREDResponse>(FRED_BASE_URL, { params });
    const latestObservation = response.data.observations[0];
    return parseFloat(latestObservation.value);
  } catch (error) {
    console.error(`Error fetching FRED data for series ${seriesId}:`, error);
    throw error;
  }
}

async function fetchHistoricalFREDPrice(
  seriesId: string,
  months: number
): Promise<{ date: string; value: number }[]> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months - 1);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth());

  const params = {
    series_id: seriesId,
    api_key: FRED_API_KEY,
    file_type: "json",
    sort_order: "asc",
    observation_start: startDate.toISOString().slice(0, 10),
    observation_end: endDate.toISOString().slice(0, 10),
  };

  try {
    const response = await axios.get<FREDResponse>(FRED_BASE_URL, { params });
    return response.data.observations
      .map((obs) => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }))
      .filter((item) => !isNaN(item.value));
  } catch (error) {
    console.error(
      `Error fetching historical FRED data for series ${seriesId}:`,
      error
    );
    throw error;
  }
}

// Original function for current prices (unchanged)
export async function getIngredientPrices() {
  try {
    const ingredientPromises = Object.entries(INGREDIENTS).map(
      async ([name, details]) => {
        const pricePerPound = await fetchFREDPrice(details.seriesId);
        const servingCost = pricePerPound * details.servingWeight;

        return {
          name,
          pricePerPound, // Changed from pricePerUnit
          servingWeight: details.servingWeight,
          servingUnit: details.servingUnit as
            | "pound"
            | "ounce"
            | "tablespoon"
            | "teaspoon",
          servingCost,
          lastUpdated: new Date().toISOString().slice(0, 10),
          source: "FRED", // Added required field
        };
      }
    );

    const [hourlyWage, electricityRate] = await Promise.all([
      fetchFREDPrice(ADDITIONAL_METRICS.LABOR_WAGE),
      fetchFREDPrice(ADDITIONAL_METRICS.ELECTRICITY),
    ]);

    const ingredients = await Promise.all(ingredientPromises);

    return [
      ...ingredients,
      {
        name: "Labor",
        pricePerPound: hourlyWage, // Changed from pricePerUnit
        servingWeight: LABOR_TIME_PER_BURGER,
        servingUnit: "pound" as "pound" | "ounce" | "tablespoon" | "teaspoon",
        servingCost: hourlyWage * LABOR_TIME_PER_BURGER,
        lastUpdated: new Date().toISOString().slice(0, 10),
        source: "FRED", // Added required field
      },
      {
        name: "Cooking Energy",
        pricePerPound: electricityRate, // Changed from pricePerUnit
        servingWeight: COOKING_ENERGY,
        servingUnit: "pound" as "pound" | "ounce" | "tablespoon" | "teaspoon",
        servingCost: COOKING_ENERGY * electricityRate,
        lastUpdated: new Date().toISOString().slice(0, 10),
        source: "FRED", // Added required field
      },
    ];
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
}

// New function for historical price trends
export async function getPriceTrends(months: number = 6): Promise<priceData[]> {
  try {
    // Fetch historical data for ingredients and metrics
    const promises = [
      ...Object.entries(INGREDIENTS).map(async ([name, details]) => {
        const data = await fetchHistoricalFREDPrice(details.seriesId, months);
        return {
          name,
          data,
          servingWeight: details.servingWeight, // Match exact terminology
        };
      }),
      fetchHistoricalFREDPrice(ADDITIONAL_METRICS.LABOR_WAGE, months).then(
        (data) => ({
          name: "Labor",
          data,
          servingWeight: LABOR_TIME_PER_BURGER, // Use same constant as current prices
        })
      ),
      fetchHistoricalFREDPrice(ADDITIONAL_METRICS.ELECTRICITY, months).then(
        (data) => ({
          name: "Cooking Energy",
          data,
          servingWeight: COOKING_ENERGY, // Use same constant as current prices
        })
      ),
    ];

    const results = await Promise.all(promises);
    const dates = new Set(results.flatMap((r) => r.data.map((d) => d.date)));

    // Inside getPriceTrends:
    return Array.from(dates)
      .sort()
      .map((date) => {
        const dataPoint: priceData = { date };
        let totalCost = 0;
        let hasValidData = true; // Flag for checking if data is valid for the date

        // Process each ingredient and metric
        results.forEach(({ name, data, servingWeight }) => {
          const priceData = data.find((d) => d.date === date);
          if (priceData) {
            const cost = priceData.value * servingWeight;
            const safeName = name.replace(/\s+/g, "");
            dataPoint[safeName] = cost;
            totalCost += cost;
          } else {
            hasValidData = false; // Flag as incomplete data
          }
        });

        // If incomplete data is found, skip this data point without returning null
        if (!hasValidData || totalCost === 0) {
          console.log(
            `Skipping date ${date} due to missing or incomplete data`
          );
          return {}; // Return an empty object to skip this entry
        }

        // Add totalCost to ensure it's present and valid
        dataPoint.totalCost = totalCost;

        return dataPoint; // Only return if the data point is valid
      })
      .filter((point): point is priceData => Object.keys(point).length > 0); // Ensure we only return non-empty objects
  } catch (error) {
    console.error("Error fetching price trends:", error);
    throw error;
  }
}
