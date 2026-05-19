import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound6Result = () => {
  const navigate = useNavigate();

  // --- Round 6 Inventory + Opening Stock ---
  const [inventory] = useState(() => {
    const savedPurchases = localStorage.getItem("gameDistributionRound6Inventory");
    const savedOpening = localStorage.getItem("gameDistributionR6OpeningStock");
    
    const purchases = savedPurchases ? JSON.parse(savedPurchases) : null;
    const opening = savedOpening ? JSON.parse(savedOpening) : null;
    
    return {
      milk: { name: "Tedbury Milk Chocolate", qty: (purchases?.milk?.qty || 0) },
      dark: { name: "Tedbury Dark Chocolate", qty: (purchases?.dark?.qty || 0) },
      wafer: { name: "Tedbury Wafer Chocolate", qty: (purchases?.wafer?.qty || 0) },
      gift: { name: "Tedbury Gift Packs", qty: (purchases?.gift?.qty || 0) }
    };
  });

  // --- Round 5 Data (for Cash flow) ---
  const r5NetPaymentReceived = parseInt(localStorage.getItem("gameDistributionR5NetPaymentReceived") || "0", 10);
  const r5TradeSchemeSpend = parseInt(localStorage.getItem("gameDistributionR5TradeSchemeSpend") || "0", 10);
  const currentCash = parseInt(localStorage.getItem("gameDistributionCash") || "5000000", 10);

  // --- Round 6 User Decisions ---
  const retailersToVisit = parseInt(localStorage.getItem("gameDistributionR6RetailersToVisit") || "250", 10);
  const earlyPaymentDiscount = parseFloat(localStorage.getItem("gameDistributionR6EarlyPaymentDiscount") || "0");
  const creditDays = parseInt(localStorage.getItem("gameDistributionR6CreditDays") || "0", 10);
  const orderFulfilment = parseInt(localStorage.getItem("gameDistributionR6OrderFulfilment") || "0", 10);
  const deliveryFrequency = parseInt(localStorage.getItem("gameDistributionR6DeliveryFrequency") || "7", 10);
  const schemePushIntensity = parseInt(localStorage.getItem("gameDistributionR6SchemePushIntensity") || "0", 10);
  const maxCreditLimit = parseInt(localStorage.getItem("gameDistributionR6MaxCreditLimit") || "0", 10);
  const totalScheme = parseInt(localStorage.getItem("gameDistributionR6TotalScheme") || "5", 10);

  // --- Calculations (R6 Sales % from Screenshot) ---
  // Milk 50%, Dark 30%, Wafer 40%, Gift Packs 40%
  const milkTotalStock = inventory.milk.qty;
  const darkTotalStock = inventory.dark.qty;
  const waferTotalStock = inventory.wafer.qty;
  const giftTotalStock = inventory.gift.qty;

  const salesUnits = {
    milk: Math.round(0.50 * milkTotalStock),
    dark: Math.round(0.30 * darkTotalStock),
    wafer: Math.round(0.40 * waferTotalStock),
    gift: Math.round(0.40 * giftTotalStock)
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

  // Margin calculation: 8% - Early Payment Discount - (Total Scheme - 5%)
  const marginPercent = 8 - earlyPaymentDiscount - Math.max(0, totalScheme - 5);
  const grossMargin = marginPercent > 0 ? totalSales - (totalSales / (1 + marginPercent / 100)) : 0;
  
  // Net Margin after considering Credit terms
  const netMargin = grossMargin * (1 - (earlyPaymentDiscount / 100) * (1 - creditDays / 30));
  
  const retailerOutstanding = (creditDays * totalSales) / 30;
  const netPaymentReceived = totalSales - retailerOutstanding;
  const cashInHand = currentCash + r5NetPaymentReceived - r5TradeSchemeSpend;

  // Trade Scheme Spend (Company reimburses 5%)
  const totalTradeSchemeSpend = totalSales - (totalSales / (1 + totalScheme / 100));

  const totalCoverage = 2050;
  const warehouseCost = 125000;
  const totalManpower = retailersToVisit > 0 ? Math.round(totalCoverage / retailersToVisit) : 0;
  const manpowerCost = totalManpower * 20000;

  // ROI Formula from Screenshot: (Net Gross Margin - Manpower - Delivery & Warehouse) / (20,00,000 + Net Inventory + Retailer Outstanding) * 100
  const roiDenominator = 2000000 + totalClosingStockValue + retailerOutstanding;
  const distributorROI = roiDenominator > 0
    ? ((netMargin - manpowerCost - warehouseCost) / roiDenominator) * 100
    : 0;

  // Satisfaction (Weights from Screenshot)
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
    localStorage.setItem("gameDistributionR6TotalSales", Math.round(totalSales).toString());
    localStorage.setItem("gameDistributionR6RetailerOutstanding", Math.round(retailerOutstanding).toString());
    localStorage.setItem("gameDistributionR6TradeSchemeSpend", Math.round(totalTradeSchemeSpend).toString());
    localStorage.setItem("gameDistributionR6NetPaymentReceived", Math.round(netPaymentReceived).toString());
    localStorage.setItem("gameDistributionR6DistributorROI", distributorROI.toFixed(2));
    localStorage.setItem("gameDistributionR6RetailerSatisfaction", getRetailerSatisfaction());
  }, [totalSales, retailerOutstanding, totalTradeSchemeSpend, netPaymentReceived, distributorROI]);

  const handleProceed = () => {
    // Calculate ending inventory after sales (Carry Forward: Opening Stock + Purchase - Sales)
    const carryForwardInventory = {
      milk: { ...inventory.milk, qty: milkTotalStock - salesUnits.milk },
      dark: { ...inventory.dark, qty: darkTotalStock - salesUnits.dark },
      wafer: { ...inventory.wafer, qty: waferTotalStock - salesUnits.wafer },
      gift: { ...inventory.gift, qty: giftTotalStock - salesUnits.gift }
    };
    const emptyInventory = {
      milk: { ...inventory.milk, qty: 0 },
      dark: { ...inventory.dark, qty: 0 },
      wafer: { ...inventory.wafer, qty: 0 },
      gift: { ...inventory.gift, qty: 0 }
    };
    
    // Calculate closing cash: Purchase Remainder ONLY (as requested)
    const closingCash = currentCash;
    
    localStorage.setItem("gameDistributionCash", Math.round(closingCash).toString());
    localStorage.setItem("gameDistributionR7OpeningStock", JSON.stringify(carryForwardInventory));
    localStorage.setItem("gameDistributionRound7Inventory", JSON.stringify(emptyInventory));
    localStorage.setItem("gameDistributionCurrentRound", "7");
    navigate("/game-distribution/round7-intro");
  };

  const handleBack = () => {
    navigate("/game-distribution/round6-supply-discipline");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>
        <div className="text-center pt-8 pb-4 border-b-4 border-yellow-200/50">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm px-4">
            Round 6 – Result
          </h1>
        </div>
        <div className="p-8 sm:p-10">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
            {[
              { label: "Tedbury Margin", value: `${marginPercent.toFixed(1)}%`, color: "text-emerald-700" },
              { label: "Margin Loss", value: `-${Math.max(0, totalScheme - 5)}%`, color: "text-red-600" },
              { label: "Tesle Scheme", value: "7% Trade", color: "text-blue-700" },
              { label: "Retailer Push", value: getRetailerSatisfaction(), color: "text-amber-600" }
            ].map(item => (
              <div key={item.label} className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 text-center">
                <p className="text-xs text-gray-500 font-medium uppercase">{item.label}</p>
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400 font-black italic">Monthly Sales</h2>
            <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-yellow-200 bg-yellow-100 uppercase text-[10px]">
                    <th className="px-5 py-3 text-gray-700 font-black">Product</th>
                    <th className="px-5 py-3 text-gray-700 font-black text-right">Units Sold</th>
                    <th className="px-5 py-3 text-gray-700 font-black text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {salesValues.map(p => (
                    <tr key={p.key} className="border-b border-yellow-100">
                      <td className="px-5 py-3 font-medium text-gray-800">{p.label}</td>
                      <td className="px-5 py-3 text-right text-emerald-700 font-bold">{p.units.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3 text-right font-bold text-gray-800">{formatCurrency(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                    <td className="px-5 py-3 font-extrabold text-gray-900 text-lg" colSpan={2}>Total Sales</td>
                    <td className="px-5 py-3 text-right font-extrabold text-emerald-700 text-lg">{formatCurrency(totalSales)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mb-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Opening Cash", value: formatCurrency(cashInHand) },
                { label: "Net Payment Received", value: formatCurrency(Math.round(netPaymentReceived)) },
                { label: "Net Gross Margin", value: formatCurrency(Math.round(grossMargin)) },
                { label: "Trade Scheme Spend", value: formatCurrency(Math.round(totalTradeSchemeSpend)) },
              ].map(item => (
                <div key={item.label} className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-xs uppercase tracking-tighter">{item.label}</span>
                  <span className="text-emerald-700 font-black text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-6 rounded-2xl border-4 border-emerald-300 text-center shadow-lg transform hover:scale-105 transition-transform">
                <p className="text-gray-600 font-bold text-xs mb-1 uppercase">Distributor ROI</p>
                <p className="text-5xl font-black text-emerald-700">{distributorROI.toFixed(2)}%</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl border-4 border-amber-300 text-center shadow-lg transform hover:scale-105 transition-transform">
                <p className="text-gray-600 font-bold text-xs mb-1 uppercase">Retailer Satisfaction</p>
                <p className={`text-5xl font-black ${getRetailerSatisfaction() === 'High' ? 'text-emerald-700' : getRetailerSatisfaction() === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>
                   {getRetailerSatisfaction()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-between items-center max-w-2xl mx-auto px-4">
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] text-xl">[ Back ]</button>
            <button onClick={handleProceed} className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-12 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] text-2xl tracking-widest uppercase transform scale-110">[ Proceed ]</button>
          </div>
        </div>
        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-center items-center text-lg font-bold text-gray-800">
          <span>Round: 6 of 7</span>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound6Result;
