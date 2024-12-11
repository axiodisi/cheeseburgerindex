"use client";
import React, { useEffect, useState } from 'react';
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
                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                                    Cheeseburger Price Index 🍔
                                </h1>
                                <p className="text-slate-500">
                                    Real-time tracking based on Federal Reserve Economic Data (FRED)
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-4xl font-bold text-slate-800">${totalCost.toFixed(2)}</div>
                                <div className="text-sm text-slate-500">Current Cost</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Costs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Operational Costs */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 bg-gradient-to-b from-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Operational Costs</h2>
                            <div className="space-y-4">
                                {operationalCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-slate-700">{item.name}</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="font-medium text-slate-700">${item.servingCost.toFixed(3)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ingredient Costs */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 bg-gradient-to-b from-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Ingredients</h2>
                            <div className="space-y-4">
                                {ingredientCosts.map((item) => (
                                    <div key={item.name}
                                        className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                                            <span className="font-medium text-slate-700">{item.name}</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="font-medium text-slate-700">${item.servingCost.toFixed(3)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white rounded-2xl shadow-sm w-full overflow-hidden">
                    <div className="w-full">
                        <PriceTrendChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheeseburgerDashboard;