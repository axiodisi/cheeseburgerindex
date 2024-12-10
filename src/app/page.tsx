import Link from "next/link";

const HomePage = () => {
  // Simulated ingredient prices in USD
  const ingredientPrices = {
    beef: 1.5,
    cheese: 0.5,
    lettuce: 0.3,
    bun: 0.4,
  };

  const cheeseburgerCost = (
    ingredientPrices.beef +
    ingredientPrices.cheese +
    ingredientPrices.lettuce +
    ingredientPrices.bun
  ).toFixed(2);

  return (
    <div>
      <h1>Cheeseburger Price Index</h1>
      <p>Real-time price based on ingredient costs.</p>
      <p>
        <strong>Cost of one cheeseburger:</strong> ${cheeseburgerCost}
      </p>

      {/* Link to the Cheezburgz token page */}
      <p>
        <Link href="/cheezburgz">Learn more about Cheezburgz token</Link>
      </p>
    </div>
  );
};

export default HomePage;
