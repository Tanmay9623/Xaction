import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound6CreditControl = () => {
  const navigate = useNavigate();

  // Round 6: Credit Control
  const [creditDays, setCreditDays] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR6CreditDays");
    return saved !== null ? parseInt(saved, 10) : 15;
  });

  const [maxCreditLimit, setMaxCreditLimit] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR6MaxCreditLimit");
    return saved !== null ? parseInt(saved, 10) : 50000;
  });

  const [creditEnforcement, setCreditEnforcement] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR6CreditEnforcement");
    return saved !== null ? parseInt(saved, 10) : 1;
  }); 

  const [earlyPaymentDiscount, setEarlyPaymentDiscount] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR6EarlyPaymentDiscount");
    return saved !== null ? parseFloat(saved) : 0;
  });

  const enforcementLabels = ["Liberal", "Moderate", "Strict"];

  useEffect(() => {
    localStorage.setItem("gameDistributionR6CreditDays", creditDays.toString());
    localStorage.setItem("gameDistributionR6MaxCreditLimit", maxCreditLimit.toString());
    localStorage.setItem("gameDistributionR6CreditEnforcement", creditEnforcement.toString());
    localStorage.setItem("gameDistributionR6EarlyPaymentDiscount", earlyPaymentDiscount.toString());
  }, [creditDays, maxCreditLimit, creditEnforcement, earlyPaymentDiscount]);

  const handleOK = () => {
    navigate("/game-distribution/round6-sales-team");
  };

  const handleBack = () => {
    navigate("/game-distribution/round6-trade-scheme");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      navigate("/game-simulation");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        <div className="bg-emerald-700 text-emerald-50 px-4 py-2 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>

        <div className="text-center py-6">
          <h1 className="text-3xl font-black text-red-600 tracking-tighter uppercase px-4">
            Round 6 – Credit Control
          </h1>
        </div>

        <div className="px-8 pb-10 space-y-6">
          <div className="text-center">
            <p className="text-[11px] text-gray-700 font-medium">
              Maintain financial discipline. Retailers may demand more credit if you don't match Tesle's schemes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm relative">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Credit Days:</h3>
              <div className="flex items-center justify-center space-x-6">
                <button onClick={() => setCreditDays(prev => Math.max(0, prev - 1))} className="bg-red-50 hover:bg-red-100 text-red-400 font-bold w-8 h-8 rounded-full border border-red-200 text-xl flex items-center justify-center">−</button>
                <span className="text-3xl font-black text-emerald-700 min-w-[60px] text-center">{creditDays}</span>
                <button onClick={() => setCreditDays(prev => prev + 1)} className="bg-green-50 hover:bg-green-100 text-green-400 font-bold w-8 h-8 rounded-full border border-green-200 text-xl flex items-center justify-center">+</button>
                <span className="text-[10px] text-gray-500 absolute right-4 top-1/2 -translate-y-1/2">Days</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm relative">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Max Credit Limit:</h3>
              <div className="flex items-center justify-center space-x-4">
                <button onClick={() => setMaxCreditLimit(prev => Math.max(0, prev - 5000))} className="bg-red-50 hover:bg-red-100 text-red-400 font-bold w-8 h-8 rounded-full border border-red-200 text-xl flex items-center justify-center">−</button>
                <span className="text-2xl font-black text-emerald-700 min-w-[120px] text-center">₹{maxCreditLimit.toLocaleString('en-IN')}</span>
                <button onClick={() => setMaxCreditLimit(prev => prev + 5000)} className="bg-green-50 hover:bg-green-100 text-green-400 font-bold w-8 h-8 rounded-full border border-green-200 text-xl flex items-center justify-center">+</button>
                <span className="text-[10px] text-gray-500 absolute right-4 top-1/2 -translate-y-1/2">Amount</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Credit Enforcement:</h3>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-6 mb-3">
                  <button onClick={() => setCreditEnforcement(prev => Math.max(0, prev - 1))} className="bg-red-50 hover:bg-red-100 text-red-400 font-bold w-10 h-10 rounded-full border border-red-200 text-2xl flex items-center justify-center">−</button>
                  <span className="text-3xl font-black text-emerald-700 min-w-[150px] text-center">{enforcementLabels[creditEnforcement]}</span>
                  <button onClick={() => setCreditEnforcement(prev => Math.min(2, prev + 1))} className="bg-green-50 hover:bg-green-100 text-green-400 font-bold w-10 h-10 rounded-full border border-green-200 text-2xl flex items-center justify-center">+</button>
                  <span className="text-[10px] text-gray-500">Level</span>
                </div>
                <div className="flex justify-center space-x-3">
                  {enforcementLabels.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setCreditEnforcement(idx)}
                      className={`px-6 py-1 rounded-full text-[10px] font-bold border transition-all
                        ${creditEnforcement === idx
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                          : 'bg-yellow-50 text-gray-400 border-yellow-300'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm relative">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Early Payment Discount:</h3>
              <div className="flex items-center justify-center space-x-6">
                <button onClick={() => setEarlyPaymentDiscount(prev => Math.max(0, prev - 0.5))} className="bg-red-50 hover:bg-red-100 text-red-400 font-bold w-8 h-8 rounded-full border border-red-200 text-xl flex items-center justify-center">−</button>
                <span className="text-3xl font-black text-emerald-700 min-w-[60px] text-center">{earlyPaymentDiscount}%</span>
                <button onClick={() => setEarlyPaymentDiscount(prev => Math.min(5, prev + 0.5))} className="bg-green-50 hover:bg-green-100 text-green-400 font-bold w-8 h-8 rounded-full border border-green-200 text-xl flex items-center justify-center">+</button>
                <span className="text-[10px] text-gray-500 absolute right-4 top-1/2 -translate-y-1/2">Percent</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 pt-4">
            <button onClick={handleExit} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md text-xs">[ Exit Market ]</button>
            <button onClick={handleOK} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-16 rounded-xl shadow-lg text-2xl tracking-tighter">[ OK ]</button>
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-md text-xs">[ Back ]</button>
          </div>
        </div>

        <div className="bg-yellow-200/50 border-t-2 border-yellow-300 px-6 py-3 flex justify-center items-center text-[10px] font-bold text-gray-800 uppercase">
          <span>Round: 6 of 7</span>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound6CreditControl;
