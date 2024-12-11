"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import PriceTrendChart from './priceTrendChart.tsx';

const COLORS = {
    'Ground Beef': '#8B4513',
    'American Cheese': '#FFA500',
    'Lettuce': '#90EE90',
    'Tomato': '#FF6B6B',
    'Hamburger Bun': '#D4A017',
    'Labor': '#4682B4',
    'Supply Chain Fuel': '#464646',
    'Cooking Energy': '#FF6B6B'
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
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-4 md:p-8">
                <div className="w-full animate-pulse">
                    <div className="h-48 bg-slate-200 rounded-2xl mb-8"></div>
                    <div className="h-96 bg-slate-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-4 md:p-8">
                <div className="w-full">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
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
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            <div className="w-full p-4 md:p-8 space-y-8">
                {/* Hero Section with Emoji */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 md:p-12">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="text-7xl mb-4">🍔</div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                                Cheeseburger Price Index
                            </h1>
                            <p className="text-slate-600">
                                Real-time tracking based on Federal Reserve Economic Data (FRED)
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <div className="bg-white rounded-xl shadow-sm p-6 inline-flex flex-col items-center">
                                <div className="text-4xl font-bold text-slate-800">${totalCost.toFixed(2)}</div>
                                <div className="text-sm text-slate-500">Current Cost</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Costs Grid - keep existing structure but update styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ... existing grid content ... */}
                </div>

                {/* Chart Section */}
                <div className="bg-white rounded-2xl shadow-sm w-full overflow-hidden">
                    <div className="w-full">
                        <PriceTrendChart />
                    </div>
                </div>

                {/* New prominent CTA */}
                <div className="flex justify-center pt-8">
                    <Link
                        href="/cheezburgz"
                        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg shadow-lg hover:shadow-xl"
                    >
                        Learn about Cheezburgz Token
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
