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
    'Labor': '#4682B4',          // Blue
    'Supply Chain Fuel': '#464646', // Gray
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
            <div className="min-h-screen bg-amber-100 p-4 md:p-8">
                <div className="w-full animate-pulse">
                    <div className="h-48 bg-amber-200 rounded-2xl mb-8"></div>
                    <div className="h-96 bg-amber-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-amber-100 p-4 md:p-8">
                <div className="w-full">
                    <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-6">
                        <p className="text-red-600">Error: {error}</p>
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
        <div className="min-h-screen bg-amber-100 bg-[url('/checkered-pattern.png')] bg-repeat">
            {/* Hero Section */}
            <div className="w-full text-center pt-12 pb-8 bg-amber-100/90">
                <div className="text-7xl mb-4 animate-bounce">🍔</div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-2">
                    The Cheeseburger Index
                </h1>
                <p className="text-gray-800 text-lg">
                    The Real Price of Happiness in a Bun
                </p>
            </div>

            <div className="w-full p-4 md:p-8 space-y-8">
                {/* Price Container */}
                <div className="bg-amber-50 rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-200/50 to-yellow-200/50 p-8 md:p-12">
                        <div className="flex justify-center">
                            <div className="bg-white rounded-xl shadow-lg border-2 border-amber-300 p-6 inline-flex flex-col items-center">
                                <div className="text-4xl font-bold text-[#8B4513]">${totalCost.toFixed(2)}</div>
                                <div className="text-base text-gray-800">Today&apos;s Burger Cost</div>
                            </div>
                        </div>
                        <div className="text-center mt-6">
                            <p className="text-gray-700 font-medium">
                                Prices fresh from the Federal Reserve&apos;s grill
                            </p>
                        </div>
                    </div>
                </div>

                {/* Costs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Menu Board Style Panels */}
                    <div className="bg-amber-50 rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Daily Operations</h2>
                            <div className="space-y-4">
                                {operationalCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-4 bg-white rounded-xl border-2 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-gray-800 text-lg">{item.name}</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="font-medium text-gray-800 text-lg">${item.servingCost.toFixed(3)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Today&apos;s Ingredients</h2>
                            <div className="space-y-4">
                                {ingredientCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-4 bg-white rounded-xl border-2 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-gray-800 text-lg">{item.name}</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="font-medium text-gray-800 text-lg">${item.servingCost.toFixed(3)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 rounded-2xl shadow-lg border-2 border-amber-200 w-full overflow-hidden">
                    <div className="w-full">
                        <PriceTrendChart />
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link
                        href="/cheezburgz"
                        className="group relative inline-flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#FF8B8B] text-white px-8 py-4 rounded-xl font-semibold transition-colors text-lg shadow-lg hover:shadow-xl border-2 border-red-300"
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