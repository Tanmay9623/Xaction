import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionDecisions = () => {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const [cash, setCash] = useState(() => {
    const saved = localStorage.getItem("gameDistributionCash");
    return saved !== null ? parseInt(saved, 10) : 5000000;
  });

  const [pricing, setPricing] = useState({
    milk: 120,
    dark: 180,
    wafer: 100,
    gift: 600
  });

  const [creditTerms, setCreditTerms] = useState("7 Days");

  const handleNext = () => {
    alert("Round 1 decisions submitted! Simulation logic would proceed to market results here.");
    // In a full implementation, this might navigate to a results screen
  };

  const handleBack = () => {
    navigate("/game-distribution/acquisition?product=gift");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        {/* Screen Indicator */}
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs shadow-sm">Screen 4</span>
        </div>

        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm">
            Market Decisions
          </h1>
          <p className="text-gray-700 font-bold mt-2">Round 1 of 7</p>
        </div>

        <div className="p-8 sm:p-12 space-y-8">
          <div className="bg-white p-6 rounded-xl border-2 border-yellow-300 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Cash Remaining: {formatCurrency(cash)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pricing Decisions */}
            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-300 pb-2">
                Selling Price (Per Unit)
              </h3>
              <div className="space-y-4">
                {Object.entries(pricing).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize font-medium text-gray-700">{key} Chocolate</span>
                    <input 
                      type="number" 
                      value={val}
                      onChange={(e) => setPricing({...pricing, [key]: parseInt(e.target.value)})}
                      className="w-24 p-2 rounded border-2 border-gray-300 focus:border-emerald-500 outline-none font-bold text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Credit & Terms */}
            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-300 pb-2">
                Retailer Credit Terms
              </h3>
              <select 
                value={creditTerms}
                onChange={(e) => setCreditTerms(e.target.value)}
                className="w-full p-3 rounded border-2 border-gray-300 focus:border-emerald-500 outline-none font-bold bg-white"
              >
                <option>Cash Only</option>
                <option>7 Days</option>
                <option>15 Days</option>
                <option>30 Days</option>
              </select>
              <p className="mt-4 text-sm text-gray-600 italic">
                Longer credit terms improve retailer satisfaction but slow down your cash flow.
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="pt-8 flex justify-between items-center">
            <button 
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] hover:shadow-[0_2px_0_rgb(75,85,99)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl"
            >
              Back
            </button>

            <button 
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-16 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] hover:shadow-[0_3px_0_rgb(21,128,61)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all text-4xl transform scale-110"
            >
              OK
            </button>
          </div>
        </div>

        {/* Footer Info Strip */}
        <div className="bg-yellow-100 border-t-2 border-yellow-300 px-8 py-4 flex justify-between items-center text-lg font-bold text-gray-800">
          <div>Market Temperature: Comfortable</div>
          <div>Market Condition: Regular</div>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionDecisions;
