"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import PriceTrendChart from './priceTrendChart.tsx';

const COLORS = {
    'Ground Beef': '#8D4E41',    // Deep burgundy brown
    'American Cheese': '#FFA726', // Rich orange
    'Lettuce': '#66BB6A',        // Fresh green
    'Tomato': '#E53935',         // Bright red
    'Hamburger Bun': '#FFAB91',   // Warm peach
    'Labor': '#5C6BC0',          // Deep blue
    'Supply Chain Fuel': '#455A64', // Blue gray
    'Cooking Energy': '#EC407A'    // Berry pink
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-600 via-amber-500 to-amber-600">
                <div className="w-full animate-pulse">
                    <div className="h-48 bg-red-700/30 rounded-2xl mb-4"></div>
                    <div className="h-96 bg-red-700/30 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-600 via-amber-500 to-amber-600">
                <div className="w-full">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                        <p className="text-red-700 text-lg">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const validIngredients = ingredients.filter(item => item.servingCost != null);
    const totalCost = validIngredients.reduce((sum, item) => sum + item.servingCost, 0);
    const ingredientsWithPercentages = validIngredients.map(item => ({
        ...item,
        percentage: ((item.servingCost / totalCost) * 100).toFixed(1)
    }));
    const sortedIngredients = ingredientsWithPercentages.sort((a, b) => b.servingCost - a.servingCost);
    const operationalCosts = sortedIngredients.filter(item =>
        ['Supply Chain Fuel', 'Labor', 'Cooking Energy'].includes(item.name)
    );
    const ingredientCosts = sortedIngredients.filter(item =>
        !['Supply Chain Fuel', 'Labor', 'Cooking Energy'].includes(item.name)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
            {/* Hero Section */}
            <div className="w-full text-center pt-8 pb-6 md:pt-12 md:pb-8">
                <div className="text-7xl md:text-8xl mb-4 animate-bounce">🍔</div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
                    The Cheeseburger Index
                </h1>
                <p className="text-white/90 text-xl md:text-2xl px-4">
                    The Real Price of Happiness in a Bun
                </p>
            </div>

            <div className="w-full px-2 md:p-8 space-y-4 md:space-y-8">
                {/* Price Container */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-900/5 to-transparent p-6 md:p-12">
                        <div className="flex justify-center">
                            <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6 inline-flex flex-col items-center">
                                <div className="text-5xl md:text-6xl font-bold text-orange-900">${totalCost.toFixed(2)}</div>
                                <div className="text-lg md:text-xl text-stone-600">Today&apos;s Burger Cost</div>
                            </div>
                        </div>
                        <div className="text-center mt-6">
                            <p className="text-stone-600 font-medium text-lg">
                                Prices fresh from the Federal Reserve&apos;s grill
                            </p>
                        </div>
                    </div>
                </div>

                {/* Costs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                        <div className="p-4 md:p-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4 md:mb-6">Daily Operations</h2>
                            <div className="space-y-3 md:space-y-4">
                                {operationalCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-3 md:p-4 bg-white rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-stone-700 text-lg md:text-xl">{item.name}</span>
                                        </div>
                                        <span className="font-medium text-stone-700 text-lg md:text-xl">${item.servingCost.toFixed(3)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                        <div className="p-4 md:p-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4 md:mb-6">Today&apos;s Ingredients</h2>
                            <div className="space-y-3 md:space-y-4">
                                {ingredientCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-3 md:p-4 bg-white rounded-xl border border-stone-200 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-stone-700 text-lg md:text-xl">{item.name}</span>
                                        </div>
                                        <span className="font-medium text-stone-700 text-lg md:text-xl">${item.servingCost.toFixed(3)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 w-full overflow-hidden">
                    <div className="w-full h-[500px] md:h-[650px]">
                        <PriceTrendChart />
                    </div>
                </div>

                <div className="flex justify-center pt-6 md:pt-8 pb-8">
                    <Link
                        href="/cheezburgz"
                        className="group relative inline-flex items-center gap-2 bg-white text-red-900 px-6 py-4 md:px-8 rounded-xl font-semibold transition-all duration-200 text-lg md:text-xl shadow-lg hover:shadow-xl hover:bg-orange-50"
                    >
                        Learn about Cheezburgz Token
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheeseburgerDashboard;