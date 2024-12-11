"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import PriceTrendChart from './priceTrendChart.tsx';

const COLORS = {
    'Ground Beef': '#8B4513',    // Rich Brown
    'American Cheese': '#FFC107', // Golden Yellow
    'Lettuce': '#90EE90',        // Lettuce Green
    'Tomato': '#FF6B6B',         // Tomato Red
    'Hamburger Bun': '#FFD54F',   // Mustard Yellow
    'Labor': '#333333',          // Charcoal Gray
    'Supply Chain Fuel': '#8B4513', // Rich Brown
    'Cooking Energy': '#FF6B6B'    // Tomato Red
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
            <div className="min-h-screen bg-amber-50 p-4 md:p-8">
                <div className="w-full animate-pulse">
                    <div className="h-48 bg-amber-300/20 rounded-2xl mb-8"></div>
                    <div className="h-96 bg-amber-300/20 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-amber-50 p-4 md:p-8">
                <div className="w-full">
                    <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-6">
                        <p className="text-red-400">Error: {error}</p>
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
        <div className="min-h-screen bg-amber-50">
            {/* Hero Section */}
            <div className="w-full text-center pt-12 pb-8">
                <div className="text-7xl mb-4 animate-bounce">🍔</div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                    The Cheeseburger Index
                </h1>
                <p className="text-gray-800">
                    The Real Price of Happiness in a Bun                </p>
            </div>

            <div className="w-full p-4 md:p-8 space-y-8">
                {/* Price Container */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400/10 to-amber-300/10 p-8 md:p-12">
                        <div className="flex justify-center">
                            <div className="bg-white rounded-xl shadow-sm p-6 inline-flex flex-col items-center">
                                <div className="text-4xl font-bold text-[#8B4513]">${totalCost.toFixed(2)}</div>
                                <div className="text-sm text-gray-800">Current Cost</div>
                            </div>
                        </div>
                        <div className="text-center mt-6">
                            <p className="text-gray-800">
                                Real-time tracking based on Federal Reserve Economic Data (FRED)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Costs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-[#8B4513] mb-6">Operational Costs</h2>
                            <div className="space-y-4">
                                {operationalCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-4 bg-white rounded-xl border border-amber-400/20 hover:border-amber-400/40 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="font-medium text-gray-800">${item.servingCost.toFixed(3)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-[#8B4513] mb-6">Ingredients</h2>
                            <div className="space-y-4">
                                {ingredientCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-4 bg-white rounded-xl border border-amber-400/20 hover:border-amber-400/40 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="font-medium text-gray-800">${item.servingCost.toFixed(3)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm w-full overflow-hidden">
                    <div className="w-full">
                        <PriceTrendChart />
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link
                        href="/cheezburgz"
                        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-red-400 to-amber-400 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg shadow-lg hover:shadow-xl"
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