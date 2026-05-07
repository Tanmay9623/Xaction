import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound4CreditControl = () => {
  const navigate = useNavigate();

  const [creditDays, setCreditDays] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR4CreditDays");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });
  const [maxCreditLimit, setMaxCreditLimit] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR4MaxCreditLimit");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });
  const [earlyPaymentDiscount, setEarlyPaymentDiscount] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR4EarlyPaymentDiscount");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });
  const [enforcementLevel, setEnforcementLevel] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR4EnforcementLevel");
    const value = saved !== null ? parseInt(saved, 10) : 0;
    return Math.min(2, Math.max(0, Number.isNaN(value) ? 0 : value));
  }); // 0=Low, 1=Medium, 2=High

  const enforcementLabels = ["Low", "Medium", "High"];

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("gameDistributionR4CreditDays", creditDays.toString());
    localStorage.setItem("gameDistributionR4MaxCreditLimit", maxCreditLimit.toString());
    localStorage.setItem("gameDistributionR4EarlyPaymentDiscount", earlyPaymentDiscount.toString());
    localStorage.setItem("gameDistributionR4EnforcementLevel", enforcementLevel.toString());
  }, [creditDays, maxCreditLimit, earlyPaymentDiscount, enforcementLevel]);

  const handleOK = () => {
    navigate("/game-distribution/round4-sales-team");
  };

  const handleBack = () => {
    navigate("/game-distribution/round4-trade-scheme");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the market?")) {
      navigate("/game-simulation");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      
      {/* Main Game Container */}
      <div className="w-full max-w-4xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>

        {/* Header */}
        <div className="text-center pt-8 pb-4 border-b-4 border-yellow-200/50">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm px-4">
            Round 4 – Retailer Credit Control
          </h1>
        </div>

        {/* Content Area */}
        <div className="p-8 sm:p-12">
          
          {/* Description */}
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              In this <span className="font-bold text-red-600">Manpower Shortage</span> phase, managing retailer credit is vital to ensure cash flow isn't locked in outstanding payments while you have limited staff for collections.
            </p>
          </div>

          <div className="text-center mb-10">
            <p className="text-md text-gray-600 italic">
              Balance credit terms to maintain sales without over-extending your financial risk.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
            
            {/* Credit Days */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Credit Days for Retailers:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCreditDays(prev => Math.max(0, prev - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-4xl font-extrabold text-emerald-700 min-w-[100px] text-center">
                    {creditDays}
                  </span>
                  <button
                    onClick={() => setCreditDays(prev => prev + 1)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">Days</p>
              </div>
            </div>

            {/* Maximum Credit Limit per Retailer */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Maximum Credit Limit per Retailer:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setMaxCreditLimit(prev => Math.max(0, prev - 10000))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-3xl font-extrabold text-emerald-700 min-w-[140px] text-center">
                    {formatCurrency(maxCreditLimit)}
                  </span>
                  <button
                    onClick={() => setMaxCreditLimit(prev => prev + 10000)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">Total Outstanding Allowed</p>
              </div>
            </div>

            {/* Early Payment Discount */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Early Payment Discount:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setEarlyPaymentDiscount(prev => Math.max(0, prev - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-4xl font-extrabold text-emerald-700 min-w-[100px] text-center">
                    {earlyPaymentDiscount}%
                  </span>
                  <button
                    onClick={() => setEarlyPaymentDiscount(prev => prev + 1)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">Discount for Payment within 7 Days</p>
              </div>
            </div>

            {/* Strict Payment Enforcement */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Strict Payment Enforcement:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setEnforcementLevel(prev => Math.max(0, prev - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-4xl font-extrabold text-emerald-700 min-w-[100px] text-center">
                    {enforcementLabels[enforcementLevel]}
                  </span>
                  <button
                    onClick={() => setEnforcementLevel(prev => Math.min(2, prev + 1))}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">Level</p>
              </div>
              <div className="flex justify-center space-x-6 mt-3">
                {enforcementLabels.map((label, idx) => (
                  <span
                    key={label}
                    className={`px-4 py-1 rounded-full text-sm font-bold border-2 cursor-pointer transition-all
                      ${enforcementLevel === idx
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                        : 'bg-yellow-100 text-gray-500 border-yellow-300 hover:border-emerald-300'
                      }`}
                    onClick={() => setEnforcementLevel(idx)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons Row */}
          <div className="mt-10 flex flex-wrap justify-between items-center gap-4 max-w-2xl mx-auto px-4">
            <button 
              onClick={handleExit}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(153,27,27)] hover:shadow-[0_2px_0_rgb(153,27,27)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl"
            >
              [ Exit Market ]
            </button>

            <button 
              onClick={handleOK}
              className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-16 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] hover:shadow-[0_3px_0_rgb(21,128,61)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all text-4xl transform scale-110 tracking-widest"
            >
              [ OK ]
            </button>

            <button 
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] hover:shadow-[0_2px_0_rgb(75,85,99)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl"
            >
              [ Back ]
            </button>
          </div>

        </div>

        {/* Footer Info Strip */}
        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-center items-center text-lg font-bold text-gray-800">
          <span>Round: <span className="text-emerald-700">4</span> of 7</span>
        </div>

      </div>
    </div>
  );
};

export default GameDistributionRound4CreditControl;
