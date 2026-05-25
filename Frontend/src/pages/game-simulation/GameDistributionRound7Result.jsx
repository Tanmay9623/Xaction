import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveFinalResult } from './dbUtils';

const GameDistributionRound7Result = () => {
  const navigate = useNavigate();

  // --- Round 7 Inventory (combined Opening Stock + new R7 purchases) ---
  const [inventory] = useState(() => {
    const savedPurchases = localStorage.getItem("gameDistributionRound7Inventory");
    const savedOpening = localStorage.getItem("gameDistributionR7OpeningStock");
    const purchases = savedPurchases ? JSON.parse(savedPurchases) : null;
    const opening = savedOpening ? JSON.parse(savedOpening) : null;
    return {
      milk: { name: "Tedbury Milk Chocolate", qty: (opening?.milk?.qty || 0) + (purchases?.milk?.qty || 0) },
      dark: { name: "Tedbury Dark Chocolate", qty: (opening?.dark?.qty || 0) + (purchases?.dark?.qty || 0) },
      wafer: { name: "Tedbury Wafer Chocolate", qty: (opening?.wafer?.qty || 0) + (purchases?.wafer?.qty || 0) },
      gift: { name: "Tedbury Gift Packs", qty: (opening?.gift?.qty || 0) + (purchases?.gift?.qty || 0) }
    };
  });

  // Separate reads for Monthly Data table
  const openingStock = (() => {
    const saved = localStorage.getItem("gameDistributionR7OpeningStock");
    return saved ? JSON.parse(saved) : { milk: {qty:0}, dark: {qty:0}, wafer: {qty:0}, gift: {qty:0} };
  })();
  const purchasesOnly = (() => {
    const saved = localStorage.getItem("gameDistributionRound7Inventory");
    return saved ? JSON.parse(saved) : { milk: {qty:0}, dark: {qty:0}, wafer: {qty:0}, gift: {qty:0} };
  })();

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

  // --- Monthly Data rows: Purchase (R7 buys) / Sale (% of OS+Purchase) / Closing ---
  const salesPercentagesR7 = { milk: 60, dark: 40, wafer: 50, gift: 60 };
  const monthlyDataRows = productRows.map(p => {
    const purchaseQty = purchasesOnly[p.key]?.qty || 0;
    const purchaseValue = parseInt(
      localStorage.getItem(`gameDistributionPurchaseAmount_r7_${p.key}`) || '0', 10
    );
    const purchaseUnitPrice = purchaseQty > 0 ? Math.round(purchaseValue / purchaseQty) : 0;

    const osQty = openingStock[p.key]?.qty || 0;
    const combinedQty = osQty + purchaseQty;
    const saleQty = Math.round((salesPercentagesR7[p.key] / 100) * combinedQty);
    const saleUnitPrice = sellingPrices[p.key];
    const saleValue = Math.round(saleQty * saleUnitPrice);

    const closingQty = osQty + purchaseQty - saleQty;
    const closingValue = Math.round(closingQty * purchaseUnitPrice);

    return { ...p, purchaseQty, purchaseUnitPrice, purchaseValue, saleQty, saleUnitPrice, saleValue, closingQty, closingValue };
  });

  const totalPurchaseQty   = monthlyDataRows.reduce((s, r) => s + r.purchaseQty, 0);
  const totalPurchaseValue = monthlyDataRows.reduce((s, r) => s + r.purchaseValue, 0);
  const totalSaleQty       = monthlyDataRows.reduce((s, r) => s + r.saleQty, 0);
  const totalSaleValue     = monthlyDataRows.reduce((s, r) => s + r.saleValue, 0);
  const totalClosingQty    = monthlyDataRows.reduce((s, r) => s + r.closingQty, 0);
  const totalClosingValue  = monthlyDataRows.reduce((s, r) => s + r.closingValue, 0);

  // Round 7 Margin: 8% - Early Payment Discount (per formula sheet)
  const marginPercent = 8 - earlyPaymentDiscount;
  // Gross Margin = Total Sales × margin% (direct percentage as per formula sheet)
  const grossMargin = marginPercent > 0 ? totalSales * (marginPercent / 100) : 0;
  // Net Distributor Rupee Gross Margin = Gross Margin (no additional credit adjustment per formula)
  const netMargin = grossMargin;

  const retailerOutstanding = (creditDays * totalSales) / 30;
  const netPaymentReceived = totalSales - retailerOutstanding;
  const cashInHand = currentCash + r6NetPaymentReceived - r6TradeSchemeSpend;

  const totalCoverage = 2050;
  const warehouseCost = 125000;
  const totalManpower = retailersToVisit > 0 ? Math.round(totalCoverage / retailersToVisit) : 0;
  const manpowerCost = totalManpower * 20000;

  // ROI Formula: (Net Gross Margin - Manpower - Delivery & Warehouse) / (20,00,000 + Net Inventory + Retailer Outstanding) * 100
  const roiDenominator = 2000000 + totalClosingValue + retailerOutstanding;
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

          {/* Monthly Data Table */}
          <div className="mb-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400">Monthly Data</h2>
            <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 overflow-hidden">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr className="bg-yellow-200 border-b-2 border-yellow-300">
                    <th className="px-3 py-2 text-gray-700 font-bold text-left" rowSpan={2}>Product</th>
                    <th className="px-3 py-2 text-blue-800 font-bold border-l-2 border-yellow-300" colSpan={3}>Purchase</th>
                    <th className="px-3 py-2 text-emerald-800 font-bold border-l-2 border-yellow-300" colSpan={3}>Sale</th>
                    <th className="px-3 py-2 text-red-800 font-bold border-l-2 border-yellow-300" colSpan={2}>Closing</th>
                  </tr>
                  <tr className="bg-yellow-100 border-b-2 border-yellow-300 text-xs">
                    <th className="px-3 py-2 text-blue-700 font-semibold border-l-2 border-yellow-300">Quantity</th>
                    <th className="px-3 py-2 text-blue-700 font-semibold">Unit Price</th>
                    <th className="px-3 py-2 text-blue-700 font-semibold">Value</th>
                    <th className="px-3 py-2 text-emerald-700 font-semibold border-l-2 border-yellow-300">Quantity</th>
                    <th className="px-3 py-2 text-emerald-700 font-semibold">Unit Price</th>
                    <th className="px-3 py-2 text-emerald-700 font-semibold">Value</th>
                    <th className="px-3 py-2 text-red-700 font-semibold border-l-2 border-yellow-300">Quantity</th>
                    <th className="px-3 py-2 text-red-700 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyDataRows.map(r => (
                    <tr key={r.key} className="border-b border-yellow-100 hover:bg-yellow-100/50">
                      <td className="px-3 py-2 font-medium text-gray-800 text-left">{r.label}</td>
                      <td className="px-3 py-2 text-blue-700 font-bold border-l-2 border-yellow-200">{r.purchaseQty.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-blue-600">{r.purchaseQty > 0 ? formatCurrency(r.purchaseUnitPrice) : '—'}</td>
                      <td className="px-3 py-2 text-blue-700 font-bold">{formatCurrency(r.purchaseValue)}</td>
                      <td className="px-3 py-2 text-emerald-700 font-bold border-l-2 border-yellow-200">{r.saleQty.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-emerald-600">{formatCurrency(r.saleUnitPrice)}</td>
                      <td className="px-3 py-2 text-emerald-700 font-bold">{formatCurrency(r.saleValue)}</td>
                      <td className="px-3 py-2 text-red-700 font-bold border-l-2 border-yellow-200">{r.closingQty.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-red-700 font-bold">{formatCurrency(r.closingValue)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-yellow-200 border-t-2 border-yellow-400 font-extrabold text-gray-900">
                    <td className="px-3 py-2 text-left">Total</td>
                    <td className="px-3 py-2 text-blue-800 border-l-2 border-yellow-300">{totalPurchaseQty.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2 text-blue-800">{formatCurrency(totalPurchaseValue)}</td>
                    <td className="px-3 py-2 text-emerald-800 border-l-2 border-yellow-300">{totalSaleQty.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2 text-emerald-800">{formatCurrency(totalSaleValue)}</td>
                    <td className="px-3 py-2 text-red-800 border-l-2 border-yellow-300">{totalClosingQty.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-red-800">{formatCurrency(totalClosingValue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mb-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Opening Cash", value: formatCurrency(cashInHand) },
                { label: "Primary Push Investment", value: formatCurrency(totalClosingValue) },
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
