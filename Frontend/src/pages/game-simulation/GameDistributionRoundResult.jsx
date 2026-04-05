import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRoundResult = () => {
  const navigate = useNavigate();

  // --- Data from previous screens (localStorage) ---

  // Screen 7 – Inventory
  const [inventory] = useState(() => {
    const saved = localStorage.getItem("gameDistributionInventory");
    if (saved) return JSON.parse(saved);
    return {
      milk: { name: "Tedbury Milk Chocolate", qty: 0 },
      dark: { name: "Tedbury Dark Chocolate", qty: 0 },
      wafer: { name: "Tedbury Wafer Chocolate", qty: 0 },
      gift: { name: "Tedbury Gift Packs", qty: 0 }
    };
  });

  const totalInventoryUnits =
    inventory.milk.qty + inventory.dark.qty + inventory.wafer.qty + inventory.gift.qty;

  // Screen 8 – Trade Scheme
  const quantityDiscount = parseFloat(localStorage.getItem("gameDistributionQuantityDiscount") || "0");
  const retailDisplay = parseFloat(localStorage.getItem("gameDistributionRetailDisplay") || "0");
  const totalSchemePercent = quantityDiscount + retailDisplay;

  // Screen 10 – Sales Team
  const salesTeamAvailable = parseInt(localStorage.getItem("gameDistributionSalesTeam") || "5", 10);
  const retailersToVisit = parseInt(localStorage.getItem("gameDistributionRetailersToVisit") || "0", 10);
  const newRetailerEffort = parseInt(localStorage.getItem("gameDistributionNewRetailerEffort") || "0", 10);
  const effortLabels = ["Low", "Medium", "High"];

  // Screen 11 – Supply Discipline
  const orderFulfilment = parseInt(localStorage.getItem("gameDistributionOrderFulfilment") || "0", 10);
  const priorityAllocation = parseInt(localStorage.getItem("gameDistributionPriorityAllocation") || "0", 10);
  const allocationLabels = ["Top Retailers", "High Volume Retailers", "All Retailers"];

  // --- Round 1 Inputs (given as input for Round 1 by admin/config) ---
  // Monthly sales units and selling prices per product
  const monthlySales = {
    milk: { units: 15000, sellingPrice: 120 },
    dark: { units: 5000, sellingPrice: 180 },
    wafer: { units: 8000, sellingPrice: 100 },
    gift: { units: 500, sellingPrice: 600 }
  };

  // Distributor Margin % (given as input for Round 1)
  const distributorMarginPercent = 8;

  // Retailer Payment (given as input for Round 1)
  const retailerPayment = 2000000;

  // --- Calculations ---

  const productRows = [
    { key: "milk", label: "Tedbury Milk Chocolate" },
    { key: "dark", label: "Tedbury Dark Chocolate" },
    { key: "wafer", label: "Tedbury Wafer Chocolate" },
    { key: "gift", label: "Tedbury Gift Packs" }
  ];

  const salesValues = productRows.map(p => ({
    ...p,
    units: monthlySales[p.key].units,
    sellingPrice: monthlySales[p.key].sellingPrice,
    value: monthlySales[p.key].units * monthlySales[p.key].sellingPrice
  }));

  // Total Sales = sum of all product values
  const totalSales = salesValues.reduce((sum, p) => sum + p.value, 0);

  // Distributor Rupee Gross Margin = Total Sales × Distributor Margin %
  const distributorRupeeGrossMargin = totalSales * (distributorMarginPercent / 100);

  // Total Outstanding = Total Sales − Retailer Payment
  const totalOutstanding = totalSales - retailerPayment;

  // Retailer Credit Days = Total Outstanding / (Total Sales / 30)
  const retailerCreditDays = totalSales > 0 ? totalOutstanding / (totalSales / 30) : 0;

  // Total Inventory = From Screen 7 inventory − (Total Sales / (1 + Distributor Margin))
  const totalInventoryRemaining = totalInventoryUnits - Math.round(totalSales / (1 + distributorMarginPercent / 100));

  // Total Trade Scheme Spend = (Total Scheme % from Screen 8) × Total Sales
  const totalTradeSchemeSpend = (totalSchemePercent / 100) * totalSales;

  // Total Coverage = From Screen 10: Total Manpower × 210
  const totalCoverage = salesTeamAvailable * 210;

  // New Outlets Opened = from Screen 10 effort level
  const newOutletsOpened = newRetailerEffort === 0 ? 2 : newRetailerEffort === 1 ? 5 : 10;

  // Total Manpower = from Screen 10
  const totalManpower = salesTeamAvailable;

  // Manpower Cost = Total Manpower × 20,000
  const manpowerCost = totalManpower * 20000;

  // Delivery & Warehouse Cost = ₹1,00,000 (fixed)
  const deliveryWarehouseCost = 100000;

  // Distributor ROI = Distributor Rupee Gross Margin / (Inventory + Outstanding + ₹25,00,000)
  const roiDenominator = Math.abs(totalInventoryRemaining) + totalOutstanding + 2500000;
  const distributorROI = roiDenominator > 0 ? distributorRupeeGrossMargin / roiDenominator : 0;

  // Retailer Satisfaction = from Screen 11 (Order Fulfilment Rate)
  const getRetailerSatisfaction = () => {
    if (orderFulfilment >= 80) return "High";
    if (orderFulfilment >= 50) return "Medium";
    return "Low";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExit = () => {
    if (window.confirm("Round 1 is complete. Return to game menu?")) {
      localStorage.removeItem("gameDistributionCash");
      localStorage.removeItem("gameDistributionInventory");
      localStorage.removeItem("gameDistributionStep");
      navigate("/game-simulation");
    }
  };

  const handleBack = () => {
    navigate("/game-distribution/supply-discipline");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      
      {/* Main Game Container */}
      <div className="w-full max-w-5xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>

        {/* Header */}
        <div className="text-center pt-8 pb-4 border-b-4 border-yellow-200/50">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm">
            Round 1 – Stable Market
          </h1>
        </div>

        {/* Content Area */}
        <div className="p-8 sm:p-10">

          {/* Market Conditions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { label: "Consumer Demand", value: "Moderate", color: "text-blue-700" },
              { label: "Competitor Activity", value: "Normal", color: "text-blue-700" },
              { label: "Season", value: "Regular Business Period", color: "text-amber-600" },
              { label: "Retailer Sentiment", value: "Neutral", color: "text-gray-600" },
              { label: "Supply Situation", value: "Stable", color: "text-emerald-700" }
            ].map(item => (
              <div key={item.label} className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 text-center">
                <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Monthly Sales Table */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400">
              Monthly Sales
            </h2>
            <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-yellow-200 bg-yellow-100">
                    <th className="px-5 py-3 text-gray-700 font-bold">Product</th>
                    <th className="px-5 py-3 text-gray-700 font-bold text-right">Units</th>
                    <th className="px-5 py-3 text-gray-700 font-bold text-right">Selling Price</th>
                    <th className="px-5 py-3 text-gray-700 font-bold text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {salesValues.map(p => (
                    <tr key={p.key} className="border-b border-yellow-100">
                      <td className="px-5 py-3 font-medium text-gray-800">{p.label}</td>
                      <td className="px-5 py-3 text-right text-emerald-700 font-bold">{p.units.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3 text-right text-gray-600">{formatCurrency(p.sellingPrice)}</td>
                      <td className="px-5 py-3 text-right font-bold text-gray-800">{formatCurrency(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                    <td className="px-5 py-3 font-extrabold text-gray-900 text-lg" colSpan={3}>Total Sales</td>
                    <td className="px-5 py-3 text-right font-extrabold text-emerald-700 text-lg">{formatCurrency(totalSales)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400">
              Financial Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Distributor Margin", value: `${distributorMarginPercent}%` },
                { label: "Distributor Rupee Gross Margin", value: formatCurrency(distributorRupeeGrossMargin) },
                { label: "Retailer Payment", value: formatCurrency(retailerPayment) },
                { label: "Total Outstanding", value: formatCurrency(totalOutstanding) },
                { label: "Retailer Credit Days", value: `${retailerCreditDays.toFixed(1)} Days` },
                { label: "Total Inventory", value: `${totalInventoryRemaining.toLocaleString('en-IN')} Units` },
                { label: "Total Trade Scheme Spend", value: formatCurrency(totalTradeSchemeSpend) },
              ].map(item => (
                <div key={item.label} className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-emerald-700 font-extrabold text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400">
              Operational Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Total Coverage", value: `${totalCoverage} Retailers` },
                { label: "New Outlets Opened", value: `${newOutletsOpened}` },
                { label: "Total Manpower", value: `${totalManpower}` },
                { label: "Manpower Cost", value: formatCurrency(manpowerCost) },
                { label: "Delivery & Warehouse Cost", value: formatCurrency(deliveryWarehouseCost) },
              ].map(item => (
                <div key={item.label} className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-emerald-700 font-extrabold text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Results */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Distributor ROI */}
              <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-300 text-center shadow-sm">
                <p className="text-gray-600 font-medium text-sm mb-1">Distributor ROI</p>
                <p className="text-5xl font-extrabold text-emerald-700">
                  {(distributorROI * 100).toFixed(2)}%
                </p>
                <p className="text-gray-500 text-xs mt-2 italic">
                  Gross Margin / (Inventory + Outstanding + ₹25,00,000)
                </p>
              </div>

              {/* Retailer Satisfaction */}
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-300 text-center shadow-sm">
                <p className="text-gray-600 font-medium text-sm mb-1">Retailer Satisfaction</p>
                <p className={`text-5xl font-extrabold ${
                  getRetailerSatisfaction() === 'High' ? 'text-emerald-700' :
                  getRetailerSatisfaction() === 'Medium' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {getRetailerSatisfaction()}
                </p>
                <p className="text-gray-500 text-xs mt-2 italic">
                  Based on Supply Discipline (Order Fulfilment: {orderFulfilment}%)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="mt-10 flex justify-between items-center max-w-2xl mx-auto px-4">
            <button 
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] hover:shadow-[0_2px_0_rgb(75,85,99)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl"
            >
              [ Back ]
            </button>

            <button 
              onClick={handleExit}
              className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-12 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] hover:shadow-[0_3px_0_rgb(21,128,61)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all text-2xl transform scale-110 tracking-widest"
            >
              [ Finish Round 1 ]
            </button>
          </div>

        </div>

        {/* Footer Info Strip */}
        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-center items-center text-lg font-bold text-gray-800">
          <span>Round: <span className="text-emerald-700">1</span> of 7</span>
        </div>

      </div>
    </div>
  );
};

export default GameDistributionRoundResult;
