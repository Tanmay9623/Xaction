import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRoundResult = () => {
  const navigate = useNavigate();

  // --- Data from previous screens (localStorage) ---

  // Inventory (from Inventory/Acquisition screens)
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

  // Trade Scheme
  const quantityDiscount = parseFloat(localStorage.getItem("gameDistributionQuantityDiscount") || "0");
  const retailDisplay = parseFloat(localStorage.getItem("gameDistributionRetailDisplay") || "0");
  const totalSchemePercent = quantityDiscount + retailDisplay;

  // Credit Control
  const creditDays = parseInt(localStorage.getItem("gameDistributionCreditDays") || "0", 10);
  const maxCreditLimit = parseInt(localStorage.getItem("gameDistributionMaxCreditLimit") || "0", 10);
  const earlyPaymentDiscount = parseFloat(localStorage.getItem("gameDistributionEarlyPaymentDiscount") || "0");

  // Sales Team
  const retailersToVisit = parseInt(localStorage.getItem("gameDistributionRetailersToVisit") || "0", 10);
  const newRetailerEffort = parseInt(localStorage.getItem("gameDistributionNewRetailerEffort") || "0", 10);
  const schemePushIntensity = parseInt(localStorage.getItem("gameDistributionSchemePushIntensity") || "0", 10);

  // Supply Discipline
  const orderFulfilment = parseInt(localStorage.getItem("gameDistributionOrderFulfilment") || "0", 10);

  // --- Round 1 Inputs (admin/config) ---

  const monthlySales = {
    milk: { units: 10000, sellingPrice: 54, totalSales: 540000 },
    dark: { units: 7000, sellingPrice: 77, totalSales: 540000 },
    wafer: { units: 10000, sellingPrice: 32.4, totalSales: 324000 },
    gift: { units: 1000, sellingPrice: 216, totalSales: 216000 }
  };

  // Cost prices per unit (purchase price from Acquisition screen)
  const costPrices = { milk: 100, dark: 150, wafer: 80, gift: 500 };

  // Distributor Margin % (given by admin)
  const distributorMarginPercent = 8;

  // Total Coverage (given by admin)
  const totalCoverage = 1050;

  // Delivery & Warehouse Cost (given by admin)
  const deliveryWarehouseCost = 100000;

  // --- Calculations ---

  const productRows = [
    { key: "milk", label: "Tedbury Milk Chocolate" },
    { key: "dark", label: "Tedbury Dark Chocolate" },
    { key: "wafer", label: "Tedbury Wafer Chocolate" },
    { key: "gift", label: "Tedbury Gift Packs" }
  ];

  // Monthly Sales Table: Units = Sales - Inventory, Value = Sales/(1+Margin%) - Inventory Value
  const salesValues = productRows.map(p => {
    const salesUnits = monthlySales[p.key].units;
    const sellingPrice = monthlySales[p.key].sellingPrice;
    const invQty = inventory[p.key].qty;
    const costPrice = costPrices[p.key];

    // Units sold = min(inventory purchased, market demand) — can't sell more than you stocked or market wants
    const units = Math.min(invQty, salesUnits);
    // Total Sales from admin data (₹), scaled to actual units sold
    const sales = units * sellingPrice;
    // Value = Units × Selling Price
    const value = units * sellingPrice;

    return {
      ...p,
      units,
      sellingPrice,
      value: Math.round(value)
    };
  });

  // Table total should match the Value column sum in Monthly Sales.
  const monthlySalesTableTotal = salesValues.reduce((sum, p) => sum + p.value, 0);

  // Total Sales (gross) = sum of product-level Total Sales — used in financial formulas
  const totalSales = productRows.reduce(
    (sum, p) => sum + (monthlySales[p.key].totalSales ?? (monthlySales[p.key].units * monthlySales[p.key].sellingPrice)), 0
  );

  // Distributor Rupee Gross Margin = Sales - Sales/(1 + Distributor Margin%)
  const distributorRupeeGrossMargin = totalSales - totalSales / (1 + distributorMarginPercent / 100);

  // Net Distributor Rupee Gross Margin = DRGM - [DRGM × (Early Discount %) × (1 - Credit Days/30)]
  const netDistributorGrossMarginDeduction =
    distributorRupeeGrossMargin * (earlyPaymentDiscount / 100) * (1 - creditDays / 30);
  const netDistributorRupeeGrossMargin = distributorRupeeGrossMargin - netDistributorGrossMarginDeduction;

  // Retailer Outstanding = Credit Days × Sales / 30
  const retailerOutstanding = creditDays * totalSales / 30;

  // Net Payment Received = Sales - Retailer Outstanding
  const netPaymentReceived = totalSales - retailerOutstanding;

  // Total Inventory (units purchased by user)
  const totalInventoryUnits =
    inventory.milk.qty + inventory.dark.qty + inventory.wafer.qty + inventory.gift.qty;

  // Inventory for ROI = actual amount invested from working capital (₹50,00,000 - current cash)
  const openingWorkingCapital = 5000000;
  const currentCash = parseInt(localStorage.getItem("gameDistributionCash") || `${openingWorkingCapital}`, 10);
  const inventoryInvestment = Math.max(0, openingWorkingCapital - currentCash);

  // Total Trade Scheme Spend = Sales - Sales / (1 + Scheme%)
  // Based on Scheme Push Intensity: High = 1%, Low = 2%, Medium = 3%
  let schemePushPercent = 0;
  if (schemePushIntensity === 2) schemePushPercent = 1; // High
  else if (schemePushIntensity === 1) schemePushPercent = 3; // Medium
  else schemePushPercent = 2; // Low

  const totalTradeSchemeSpend = totalSales - totalSales / (1 + schemePushPercent / 100);

  // New Outlets Opened
  const newOutletsOpened = newRetailerEffort === 0 ? 2 : newRetailerEffort === 1 ? 5 : 10;

  // Total Manpower = Coverage / Retailer Visit per Salesperson
  const totalManpower = retailersToVisit > 0
    ? Math.round(totalCoverage / retailersToVisit)
    : 0;

  // Manpower Cost = 20,000 × Total Manpower
  const manpowerCost = totalManpower * 20000;

  // Distributor ROI = (Net DRGM - Manpower Cost - Delivery Cost) / (20,00,000 + Inventory Investment + Retailer Outstanding) × 100
  const roiDenominator = 2000000 + inventoryInvestment + retailerOutstanding;
  const distributorROI = roiDenominator > 0
    ? ((netDistributorRupeeGrossMargin - manpowerCost - deliveryWarehouseCost) / roiDenominator) * 100
    : 0;

  // --- Retailer Satisfaction (weighted scoring) ---

  // Scheme Push: Low(0)=1, Medium(1)=2, High(2)=3 → weight 0.1
  const schemePushScore = (schemePushIntensity + 1) * 0.1;

  // Order Fulfillment: >90%→3, 80-90%→2, <80%→1 → weight 0.3
  const orderFulfilmentPoint = orderFulfilment > 90 ? 3 : orderFulfilment >= 80 ? 2 : 1;
  const orderFulfilmentScore = orderFulfilmentPoint * 0.3;

  // Credit Days: >30→3, 20-30→2, <20→1 → weight 0.5
  const creditDaysPoint = creditDays > 30 ? 3 : creditDays >= 20 ? 2 : 1;
  const creditDaysScore = creditDaysPoint * 0.5;

  // Credit Limit: >30000→3, 10000-30000→2, <10000→1 → weight 0.1
  const creditLimitPoint = maxCreditLimit > 30000 ? 3 : maxCreditLimit >= 10000 ? 2 : 1;
  const creditLimitScore = creditLimitPoint * 0.1;

  const totalSatisfactionScore = schemePushScore + orderFulfilmentScore + creditDaysScore + creditLimitScore;

  const getRetailerSatisfaction = () => {
    if (totalSatisfactionScore > 2.5) return "High";
    if (totalSatisfactionScore >= 1.5) return "Medium";
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

  // Save Round 1 results to localStorage so Round 2 can reference them
  useEffect(() => {
    localStorage.setItem("gameDistributionR1TotalSales", Math.round(monthlySalesTableTotal).toString());
    localStorage.setItem("gameDistributionR1RetailerOutstanding", Math.round(retailerOutstanding).toString());
    localStorage.setItem("gameDistributionR1TradeSchemeSpend", Math.round(totalTradeSchemeSpend).toString());
    localStorage.setItem("gameDistributionR1NetPaymentReceived", Math.round(netPaymentReceived).toString());
    localStorage.setItem("gameDistributionR1DistributorROI", distributorROI.toFixed(2));
    localStorage.setItem("gameDistributionR1RetailerSatisfaction", getRetailerSatisfaction());
  }, [monthlySalesTableTotal, retailerOutstanding, totalTradeSchemeSpend, netPaymentReceived, distributorROI]);

  const handleExit = () => {
    // Calculate ending inventory after sales
    const closingInventory = {
      milk: { ...inventory.milk, qty: inventory.milk.qty - salesValues.find(p => p.key === 'milk').units },
      dark: { ...inventory.dark, qty: inventory.dark.qty - salesValues.find(p => p.key === 'dark').units },
      wafer: { ...inventory.wafer, qty: inventory.wafer.qty - salesValues.find(p => p.key === 'wafer').units },
      gift: { ...inventory.gift, qty: inventory.gift.qty - salesValues.find(p => p.key === 'gift').units }
    };
    localStorage.setItem("gameDistributionRound2Inventory", JSON.stringify(closingInventory));
    // Set current round to 2 before navigating
    localStorage.setItem("gameDistributionCurrentRound", "2");
    navigate("/game-distribution/round2-intro");
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
                    <td className="px-5 py-3 text-right font-extrabold text-emerald-700 text-lg">{formatCurrency(monthlySalesTableTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center underline decoration-yellow-400">
              Financial Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                { label: "Distributor Margin", value: `${distributorMarginPercent}%` },
                { label: "Distributor Rupee Gross Margin", value: formatCurrency(Math.round(distributorRupeeGrossMargin)) },
                { label: "Net Distributor Rupee Gross Margin", value: formatCurrency(Math.round(netDistributorRupeeGrossMargin)) },
                { label: "Retailer Outstanding", value: formatCurrency(Math.round(retailerOutstanding)) },
                { label: "Net Payment Received", value: formatCurrency(Math.round(netPaymentReceived)) },
                { label: "Total Trade Scheme Spend", value: formatCurrency(Math.round(totalTradeSchemeSpend)) },
              ].map(item => (
                <div key={item.label} className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-emerald-700 font-extrabold text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Summary */}
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
                  {distributorROI.toFixed(2)}%
                </p>
                <p className="text-gray-500 text-xs mt-2 italic">
                  (Net Gross Margin − Manpower − Delivery) / (₹20,00,000 + Inventory + Outstanding)
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
                  Score: {totalSatisfactionScore.toFixed(1)} (Scheme: {schemePushScore.toFixed(1)} + Fulfilment: {orderFulfilmentScore.toFixed(1)} + Credit Days: {creditDaysScore.toFixed(1)} + Credit Limit: {creditLimitScore.toFixed(1)})
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
              [ Proceed to Round 2 ]
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
