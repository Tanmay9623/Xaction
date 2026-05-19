import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveFinalResult } from './dbUtils';

const GameDistributionRound7Result = () => {
  const navigate = useNavigate();

  // --- Round 7 Inventory + Opening Stock ---
  const [inventory] = useState(() => {
    const savedPurchases = localStorage.getItem("gameDistributionRound7Inventory");
    const savedOpening = localStorage.getItem("gameDistributionR7OpeningStock");
    
    const purchases = savedPurchases ? JSON.parse(savedPurchases) : null;
    const opening = savedOpening ? JSON.parse(savedOpening) : null;
    
    return {
      milk: { name: "Tedbury Milk Chocolate", qty: (purchases?.milk?.qty || 0) },
      dark: { name: "Tedbury Dark Chocolate", qty: (purchases?.dark?.qty || 0) },
      wafer: { name: "Tedbury Wafer Chocolate", qty: (purchases?.wafer?.qty || 0) },
      gift: { name: "Tedbury Gift Packs", qty: (purchases?.gift?.qty || 0) }
    };
  });

  // --- Round 6 Data ---
  const r6NetPaymentReceived = parseInt(localStorage.getItem("gameDistributionR6NetPaymentReceived") || "0", 10);
  const r6TradeSchemeSpend = parseInt(localStorage.getItem("gameDistributionR6TradeSchemeSpend") || "0", 10);
  const currentCash = parseInt(localStorage.getItem("gameDistributionCash") || "5000000", 10);

  // --- Round 7 User Decisions ---
  const retailersToVisit = parseInt(localStorage.getItem("gameDistributionR7RetailersToVisit") || "250", 10);
  const earlyPaymentDiscount = parseFloat(localStorage.getItem("gameDistributionR7EarlyPaymentDiscount") || "0");
  const creditDays = parseInt(localStorage.getItem("gameDistributionR7CreditDays") || "0", 10);
  const orderFulfilment = parseInt(localStorage.getItem("gameDistributionR7OrderFulfilment") || "0", 10);
  const deliveryFrequency = parseInt(localStorage.getItem("gameDistributionR7DeliveryFrequency") || "7", 10);
  const schemePushIntensity = parseInt(localStorage.getItem("gameDistributionR7SchemePushIntensity") || "0", 10);
  const maxCreditLimit = parseInt(localStorage.getItem("gameDistributionR7MaxCreditLimit") || "0", 10);

  // --- Calculations (R7 Sales % from Spreadsheet) ---
  // Milk 60%, Dark 40%, Wafer 50%, Gift Packs 60%
  const milkTotalStock = inventory.milk.qty;
  const darkTotalStock = inventory.dark.qty;
  const waferTotalStock = inventory.wafer.qty;
  const giftTotalStock = inventory.gift.qty;

  const salesUnits = {
    milk: Math.round(0.60 * milkTotalStock),
    dark: Math.round(0.40 * darkTotalStock),
    wafer: Math.round(0.50 * waferTotalStock),
    gift: Math.round(0.60 * giftTotalStock)
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

  // Round 7 Margin: 8% - Early Payment Discount
  const marginPercent = 8 - earlyPaymentDiscount;
  const grossMargin = marginPercent > 0 ? totalSales - (totalSales / (1 + marginPercent / 100)) : 0;

  const netMargin = grossMargin * (1 - (earlyPaymentDiscount / 100) * (1 - creditDays / 30));

  const retailerOutstanding = (creditDays * totalSales) / 30;
  const netPaymentReceived = totalSales - retailerOutstanding;
  const cashInHand = currentCash + r6NetPaymentReceived - r6TradeSchemeSpend;

  const totalCoverage = 2050;
  const warehouseCost = 125000;
  const totalManpower = retailersToVisit > 0 ? Math.round(totalCoverage / retailersToVisit) : 0;
  const manpowerCost = totalManpower * 20000;

  // ROI Formula: (Net Gross Margin - Manpower - Delivery & Warehouse) / (20,00,000 + Net Inventory + Retailer Outstanding) * 100
  const roiDenominator = 2000000 + totalClosingStockValue + retailerOutstanding;
  const distributorROI = roiDenominator > 0
    ? ((netMargin - manpowerCost - warehouseCost) / roiDenominator) * 100
    : 0;

  // Satisfaction Score
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
    localStorage.setItem("gameDistributionR7TotalSales", Math.round(totalSales).toString());
    localStorage.setItem("gameDistributionR7RetailerOutstanding", Math.round(retailerOutstanding).toString());
    localStorage.setItem("gameDistributionR7NetPaymentReceived", Math.round(netPaymentReceived).toString());
    localStorage.setItem("gameDistributionR7DistributorROI", distributorROI.toFixed(2));
    localStorage.setItem("gameDistributionR7RetailerSatisfaction", getRetailerSatisfaction());
  }, [totalSales, retailerOutstanding, netPaymentReceived, distributorROI]);

  const handleFinish = async () => {
    // Ensure we use a stable ID (userEmail is used for the testgame45 bypass)
    const userId = localStorage.getItem("userId") || localStorage.getItem("userEmail") || "Guest_" + Date.now();
    const userName = localStorage.getItem("userName") || "Guest User";

    const finalResults = {
      total_score: Math.round(totalSales),
      distributor_roi: parseFloat(distributorROI.toFixed(2)),
      market_share: 95, // From your target status logic
      retailer_satisfaction: parseFloat(satisfactionScore.toFixed(2)),
      cash_flow_health: currentCash > 0 ? "Healthy" : "Critical",
      user_name: userName,
      final_state_data: {
        inventory,
        cashInHand,
        totalSales,
        satisfaction: getRetailerSatisfaction()
      }
    };

    const { success, error, alreadyExists } = await saveFinalResult(userId, finalResults);

    if (success) {
      if (alreadyExists) {
        alert("Results already submitted previously. Returning to dashboard.");
      } else {
        alert("Congratulations! Your game results have been saved.");
      }
    } else {
      console.error("Supabase Save Error:", error);
      alert("Game completed! Note: There was an issue saving results to the cloud database.");
    }

    navigate("/game-simulation");
  };

  const handleBack = () => {
    navigate("/game-distribution/round7-supply-discipline");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full max-w-5xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>
        <div className="text-center pt-8 pb-4 border-b-4 border-yellow-200/50">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm px-4 italic underline decoration-yellow-400">
            Round 7 – Final Results
          </h1>
        </div>
        <div className="p-8 sm:p-10">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
            {[
              { label: "Final Margin", value: `${marginPercent.toFixed(1)}%`, color: "text-emerald-700" },
              { label: "Target Status", value: "95% YTD", color: "text-blue-700" },
              { label: "Forced Push", value: "+20% Primary", color: "text-red-600" },
              { label: "Final Push", value: getRetailerSatisfaction(), color: "text-amber-600" }
            ].map(item => (
              <div key={item.label} className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 text-center">
                <p className="text-xs text-gray-500 font-black uppercase tracking-tighter mb-1">{item.label}</p>
                <p className={`text-xl font-black italic underline decoration-yellow-300 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800 mb-4 text-center italic uppercase underline decoration-yellow-400">Year-End Sales Performance</h2>
            <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 overflow-hidden shadow-inner">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-yellow-200 bg-yellow-100 uppercase text-xs">
                    <th className="px-5 py-3 text-gray-700 font-black italic">Product Line</th>
                    <th className="px-5 py-3 text-gray-700 font-black text-right italic">Units Moved</th>
                    <th className="px-5 py-3 text-gray-700 font-black text-right italic">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {salesValues.map(p => (
                    <tr key={p.key} className="border-b border-yellow-100 hover:bg-yellow-100/50 transition-colors">
                      <td className="px-5 py-3 font-bold text-gray-800 uppercase text-sm tracking-tighter">{p.label}</td>
                      <td className="px-5 py-3 text-right text-emerald-700 font-black italic text-lg">{p.units.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3 text-right font-black text-gray-800 text-lg">{formatCurrency(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-4 border-emerald-200">
                    <td className="px-5 py-3 font-black text-gray-900 text-2xl italic uppercase underline tracking-widest" colSpan={2}>Grand Total Sales</td>
                    <td className="px-5 py-3 text-right font-black text-emerald-700 text-3xl italic tracking-tighter">{formatCurrency(totalSales)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mb-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Opening Cash", value: formatCurrency(cashInHand) },
                { label: "Primary Push Investment", value: formatCurrency(totalClosingStockValue) },
                { label: "Net Secondary Sales", value: formatCurrency(Math.round(netPaymentReceived)) },
                { label: "Annual Net Margin", value: formatCurrency(Math.round(grossMargin)) },
              ].map(item => (
                <div key={item.label} className="bg-yellow-50 p-6 rounded-2xl border-4 border-yellow-200 flex justify-between items-center shadow-md">
                  <span className="text-gray-700 font-black text-sm uppercase tracking-tighter italic">{item.label}</span>
                  <span className="text-emerald-700 font-black text-3xl italic underline decoration-yellow-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* ROI Box */}
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border-[10px] border-emerald-500 text-center shadow-[0_20px_50px_-12px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 ring-4 ring-emerald-100 ring-offset-2">
                <p className="text-emerald-600 font-black text-sm mb-3 uppercase tracking-[0.2em] underline decoration-yellow-400 decoration-4">Final ROI</p>
                <p className="text-7xl font-black text-emerald-900 italic tracking-tighter drop-shadow-lg">{distributorROI.toFixed(2)}%</p>
              </div>

              {/* Push Rating Box */}
              <div className="bg-amber-50 p-8 rounded-[2.5rem] border-[10px] border-amber-500 text-center shadow-[0_20px_50px_-12px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 ring-4 ring-amber-100 ring-offset-2">
                <p className="text-amber-600 font-black text-sm mb-3 uppercase tracking-[0.2em] underline decoration-yellow-400 decoration-4">Final Push Rating</p>
                <p className={`text-7xl font-black italic tracking-tighter drop-shadow-lg ${getRetailerSatisfaction() === 'High' ? 'text-emerald-700' : getRetailerSatisfaction() === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>
                  {getRetailerSatisfaction()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center max-w-2xl mx-auto px-4">
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] text-xl uppercase tracking-tighter">[ Back ]</button>
            <button onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 px-16 rounded-2xl shadow-[0_8px_0_rgb(5,150,105)] text-3xl tracking-widest uppercase transform scale-110 hover:scale-115 transition-transform">[ Exit Game ]</button>
          </div>
        </div>
        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-center items-center text-lg font-bold text-gray-800 uppercase italic">
          <span>Simulation Complete - Business Year Closed</span>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound7Result;
