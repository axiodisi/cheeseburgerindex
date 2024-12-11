"use client";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import PriceTrendChart from './priceTrendChart.tsx';

const COLORS = {
    'Ground Beef': '#8D4E41',
    'American Cheese': '#FFA726',
    'Lettuce': '#66BB6A',
    'Tomato': '#E53935',
    'Hamburger Bun': '#F59E0B',
    'Labor': '#5C6BC0',
    'Supply Chain Fuel': '#455A64',
    'Cooking Energy': '#EC407A'
};

const CheeseburgerDashboard = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPrices() {
            try {
                const response = await fetch('/api/prices');
                if (!response.ok) throw new Error('Failed to fetch prices');
                const data = await response.json();
                setIngredients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPrices();
    }, []);

    if (loading) return <div className="animate-pulse h-48 bg-red-700/30 rounded-2xl"></div>;
    if (error) return <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"><p className="text-red-700 text-lg">Error: {error}</p></div>;

    const validIngredients = ingredients.filter(item => item.servingCost != null);
    const totalCost = validIngredients.reduce((sum, item) => sum + item.servingCost, 0);
    const ingredientsWithPercentages = validIngredients.map(item => ({
        ...item,
        percentage: ((item.servingCost / totalCost) * 100).toFixed(1)
    }));
    const sortedIngredients = ingredientsWithPercentages.sort((a, b) => b.servingCost - a.servingCost);
    const operationalCosts = sortedIngredients.filter(item => ['Supply Chain Fuel', 'Labor', 'Cooking Energy'].includes(item.name));
    const ingredientCosts = sortedIngredients.filter(item => !['Supply Chain Fuel', 'Labor', 'Cooking Energy'].includes(item.name));

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="text-center mb-8">
                <div className="text-7xl md:text-8xl mb-4 animate-bounce">🍔</div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">The Cheeseburger Index</h1>
                <p className="text-white/90 text-xl md:text-2xl">The Real Price of Happiness in a Bun</p>
            </div>

            {/* Content Grid */}
            <div className="grid gap-8">
                {/* Price Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                    <div className="flex justify-center">
                        <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6 inline-flex flex-col items-center">
                            <div className="text-5xl md:text-6xl font-bold text-orange-900">${totalCost.toFixed(2)}</div>
                            <div className="text-lg md:text-xl text-stone-600">Today&apos;s Burger Cost</div>
                        </div>
                    </div>
                </div>

                {/* Costs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Operations Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">Daily Operations</h2>
                        <div className="space-y-4">
                            {operationalCosts.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                        <span className="font-medium text-stone-700 text-xl">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-stone-700 text-xl">${item.servingCost.toFixed(3)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ingredients Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">Today&apos;s Ingredients</h2>
                        <div className="space-y-4">
                            {ingredientCosts.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                        <span className="font-medium text-stone-700 text-xl">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-stone-700 text-xl">${item.servingCost.toFixed(3)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="w-full h-[400px] md:h-[450px] lg:h-[600px]">
                        <PriceTrendChart />
                    </div>
                </div>
                {/* Button Section */}
                <div className="flex justify-center py-6">
                    <Link
                        href="/cheezburgz"
                        className="group inline-flex items-center gap-2 bg-white text-red-900 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all text-xl shadow-lg hover:shadow-xl"
                    >
                        Learn about Cheezburgz Token
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default CheeseburgerDashboard;