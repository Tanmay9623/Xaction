import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound5Result = () => {
  const navigate = useNavigate();

  // --- Round 5 Inventory ---
  const [inventory] = useState(() => {
    const saved = localStorage.getItem("gameDistributionRound5Inventory");
    if (saved) return JSON.parse(saved);
    return {
      milk: { name: "Tedbury Milk Chocolate", qty: 0 },
      dark: { name: "Tedbury Dark Chocolate", qty: 0 },
      wafer: { name: "Tedbury Wafer Chocolate", qty: 0 },
      gift: { name: "Tedbury Gift Packs", qty: 0 }
    };
  });

  // --- Round 4 Data (for Cash flow) ---
  const r4NetPaymentReceived = parseInt(localStorage.getItem("gameDistributionR4NetPaymentReceived") || "0", 10);
  const r4TradeSchemeSpend = parseInt(localStorage.getItem("gameDistributionR4TradeSchemeSpend") || "0", 10);
  const currentCash = parseInt(localStorage.getItem("gameDistributionCash") || "5000000", 10);

  // --- Round 5 User Decisions ---
  const retailersToVisit = parseInt(localStorage.getItem("gameDistributionR5RetailersToVisit") || "250", 10);
  const earlyPaymentDiscount = parseFloat(localStorage.getItem("gameDistributionR5EarlyPaymentDiscount") || "0");
  const creditDays = parseInt(localStorage.getItem("gameDistributionR5CreditDays") || "0", 10);
  const orderFulfilment = parseInt(localStorage.getItem("gameDistributionR5OrderFulfilment") || "0", 10);
  const deliveryFrequency = parseInt(localStorage.getItem("gameDistributionR5DeliveryFrequency") || "7", 10);
  const schemePushIntensity = parseInt(localStorage.getItem("gameDistributionR5SchemePushIntensity") || "0", 10);
  const maxCreditLimit = parseInt(localStorage.getItem("gameDistributionR5MaxCreditLimit") || "0", 10);

  // --- Calculations (High demand in R5) ---
  const milkTotalStock = inventory.milk.qty;
  const darkTotalStock = inventory.dark.qty;
  const waferTotalStock = inventory.wafer.qty;
  const giftTotalStock = inventory.gift.qty;

  // Sales Quantity (R5 Specific): Milk 85%, Dark 50%, Wafer 60%, Gift 70%
  const salesUnits = {
    milk: Math.round(0.85 * milkTotalStock),
    dark: Math.round(0.50 * darkTotalStock),
    wafer: Math.round(0.60 * waferTotalStock),
    gift: Math.round(0.70 * giftTotalStock)
  };

  const sellingPrices = { milk: 54, dark: 77, wafer: 32.4, gift: 216 };
  const costPrices = { milk: 40, dark: 62, wafer: 23.3, gift: 167 };

  const productRows = [
    { key: "milk", label: "Tedbury Milk Chocolate" },
    { key: "dark", label: "Tedbury Dark Chocolate" },
    { key: "wafer", label: "Tedbury Wafer Chocolate" },
    { key: "gift", label: "Tedbury Gift Packs" }
  ];

  const salesValues = productRows.map(p => {
    const units = salesUnits[p.key];
    const sellingPrice = sellingPrices[p.key];
    const value = units * sellingPrice;
    return { ...p, units, sellingPrice, value: Math.round(value) };
  });

  const totalSales = salesValues.reduce((sum, p) => sum + p.value, 0);

  const closingStockValues = productRows.map(p => {
    const closingUnits = Math.max(0, (p.key === 'milk' ? milkTotalStock : p.key === 'dark' ? darkTotalStock : p.key === 'wafer' ? waferTotalStock : giftTotalStock) - salesUnits[p.key]);
    const closingValue = closingUnits * costPrices[p.key];
    return { closingUnits, closingValue };
  });

  const totalClosingStockValue = closingStockValues.reduce((sum, v) => sum + v.closingValue, 0);

  const marginPercent = 8 - earlyPaymentDiscount;
  const grossMargin = marginPercent > 0 ? totalSales - (totalSales / (1 + marginPercent / 100)) : 0;
  const netMargin = grossMargin * (1 - (earlyPaymentDiscount / 100) * (1 - creditDays / 30));
  const retailerOutstanding = (creditDays * totalSales) / 30;
  const netPaymentReceived = totalSales - retailerOutstanding;
  const cashInHand = currentCash + r4NetPaymentReceived - r4TradeSchemeSpend;

  const quantityDiscount = parseInt(localStorage.getItem("gameDistributionR5QuantityDiscount") || "0", 10);
  const retailDisplay = parseInt(localStorage.getItem("gameDistributionR5RetailDisplay") || "0", 10);
  const totalSchemePercent = quantityDiscount + retailDisplay;
  const totalTradeSchemeSpend = totalSales - (totalSales / (1 + totalSchemePercent / 100));

  const totalCoverage = 2350; // Updated for R5
  const warehouseCost = 125000;
  const totalManpower = retailersToVisit > 0 ? Math.round(totalCoverage / retailersToVisit) : 0;
  const manpowerCost = totalManpower * 20000;

  const roiDenominator = 2000000 + totalClosingStockValue + retailerOutstanding;
  const distributorROI = roiDenominator > 0
    ? ((netMargin - manpowerCost - warehouseCost) / roiDenominator) * 100
    : 0;

  // Satisfaction weights: Scheme Push 0.3, Order Fulfillment 0.2, Credit Days 0.2, Credit Limit 0.1, Supply Days 0.2
  const schemePushPoints = schemePushIntensity === 2 ? 3 : schemePushIntensity === 1 ? 2 : 1;
  const fulfillmentPoints = orderFulfilment >= 90 ? 3 : orderFulfilment >= 80 ? 2 : 1;
  const creditDaysPoints = creditDays > 30 ? 3 : creditDays >= 20 ? 2 : 1;
  const creditLimitPoints = maxCreditLimit > 30000 ? 3 : maxCreditLimit >= 10000 ? 2 : 1;
  const supplyDaysPoints = deliveryFrequency < 7 ? 3 : deliveryFrequency <= 10 ? 2 : 1;

  const satisfactionScore = (schemePushPoints * 0.3) + (fulfillmentPoints * 0.2) + (creditDaysPoints * 0.2) + (creditLimitPoints * 0.1) + (supplyDaysPoints * 0.2);

  const getRetailerSatisfaction = () => {
    if (satisfactionScore > 2.5) return "High";
    if (satisfactionScore >= 1.5) return "Medium";
    return "Low";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    localStorage.setItem("gameDistributionR5TotalSales", Math.round(totalSales).toString());
    localStorage.setItem("gameDistributionR5RetailerOutstanding", Math.round(retailerOutstanding).toString());
    localStorage.setItem("gameDistributionR5TradeSchemeSpend", Math.round(totalTradeSchemeSpend).toString());
    localStorage.setItem("gameDistributionR5NetPaymentReceived", Math.round(netPaymentReceived).toString());
    localStorage.setItem("gameDistributionR5DistributorROI", distributorROI.toFixed(2));
    localStorage.setItem("gameDistributionR5RetailerSatisfaction", getRetailerSatisfaction());
  }, [totalSales, retailerOutstanding, totalTradeSchemeSpend, netPaymentReceived, distributorROI]);

  const handleProceed = () => {
    // Calculate ending inventory after sales
    const nextRoundInventory = {
      milk: { ...inventory.milk, qty: 0 },
      dark: { ...inventory.dark, qty: 0 },
      wafer: { ...inventory.wafer, qty: 0 },
      gift: { ...inventory.gift, qty: 0 }
    };
    
    // Calculate closing cash: Purchase Remainder ONLY (as requested)
    const closingCash = currentCash;
    
    localStorage.setItem("gameDistributionCash", Math.round(closingCash).toString());
    localStorage.setItem("gameDistributionRound6Inventory", JSON.stringify(nextRoundInventory));
    localStorage.setItem("gameDistributionCurrentRound", "6");
    navigate("/game-distribution/round6-intro");
  };

  const handleBack = () => {
    navigate("/game-distribution/round5-supply-discipline");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>
        <div className="text-center pt-8 pb-4 border-b-4 border-yellow-200/50">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm px-4">
            Round 5 – Competition Stock Out Results
          </h1>
        </div>
        <div className="p-8 sm:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { label: "Tedbury Share", value: "Significant Gain", color: "text-emerald-700" },
              { label: "Tesle Situation", value: "No Supply", color: "text-red-600" },
              { label: "Retailer Demand", value: "Maximum", color: "text-blue-700" },
              { label: "Negotiation Power", value: "High", color: "text-amber-600" },
              { label: "Shelf Space", value: "Captured", color: "text-emerald-600" },
              { label: "Market State", value: "Dominant", color: "text-emerald-700" }
            ].map(item => (
              <div key={item.label} className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 text-center">
                <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400">Monthly Sales</h2>
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

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400">Financial Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Cash in Hand (Opening)", value: formatCurrency(cashInHand) },
                { label: "Net Payment Received", value: formatCurrency(Math.round(netPaymentReceived)) },
                { label: "Distributor Rupee Gross Margin", value: formatCurrency(Math.round(grossMargin)) },
                { label: "Retailer Outstanding", value: formatCurrency(Math.round(retailerOutstanding)) },
                { label: "Total Trade Scheme Spend", value: formatCurrency(Math.round(totalTradeSchemeSpend)) },
              ].map(item => (
                <div key={item.label} className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-emerald-700 font-extrabold text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-300 text-center shadow-sm">
                <p className="text-gray-600 font-medium text-sm mb-1">Distributor ROI</p>
                <p className="text-5xl font-extrabold text-emerald-700">{distributorROI.toFixed(2)}%</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-300 text-center shadow-sm">
                <p className="text-gray-600 font-medium text-sm mb-1">Retailer Satisfaction</p>
                <p className={`text-5xl font-extrabold ${getRetailerSatisfaction() === 'High' ? 'text-emerald-700' : getRetailerSatisfaction() === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>
                  {getRetailerSatisfaction()}
                </p>
                <p className="text-gray-500 text-xs mt-2 italic">Score: {satisfactionScore.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-between items-center max-w-2xl mx-auto px-4">
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] hover:shadow-[0_2px_0_rgb(75,85,99)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl">[ Back ]</button>
            <button onClick={handleProceed} className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-12 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] hover:shadow-[0_3px_0_rgb(21,128,61)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all text-2xl transform scale-110 tracking-widest">[ Proceed ]</button>
          </div>
        </div>
        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-center items-center text-lg font-bold text-gray-800">
          <span>Round: <span className="text-emerald-700">5</span> of 7</span>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound5Result;
