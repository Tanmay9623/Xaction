import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound5SalesTeam = () => {
  const navigate = useNavigate();

  // Round 5: Competitive Capture
  const [salesTeamAvailable] = useState(() => {
    const saved = localStorage.getItem("gameDistributionSalesTeam");
    const base = saved !== null ? parseInt(saved, 10) : 5;
    return Math.max(1, base - 2);
  });

  // User-adjustable values
  const [retailersToVisit, setRetailersToVisit] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR5RetailersToVisit");
    return saved !== null ? parseInt(saved, 10) : 250;
  });

  const [newRetailerEffort, setNewRetailerEffort] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR5NewRetailerEffort");
    return saved !== null ? parseInt(saved, 10) : 2; // Default High
  }); 

  const [schemePushIntensity, setSchemePushIntensity] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR5SchemePushIntensity");
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  const levelLabels = ["Low", "Medium", "High"];

  const totalCoverage = 2050; 
  const totalManpower = retailersToVisit > 0
    ? Math.round(totalCoverage / retailersToVisit)
    : 0;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("gameDistributionR5RetailersToVisit", retailersToVisit.toString());
    localStorage.setItem("gameDistributionR5NewRetailerEffort", newRetailerEffort.toString());
    localStorage.setItem("gameDistributionR5SchemePushIntensity", schemePushIntensity.toString());
  }, [retailersToVisit, newRetailerEffort, schemePushIntensity]);

  const handleOK = () => {
    navigate("/game-distribution/round5-supply-discipline");
  };

  const handleBack = () => {
    navigate("/game-distribution/round5-credit-control");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the market?")) {
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
          <h1 className="text-3xl font-black text-red-600 tracking-tighter uppercase">
            Round 5 – Sales Team Deployment
          </h1>
        </div>

        <div className="px-8 pb-10 space-y-6">
          <div className="text-center space-y-3">
            <p className="text-[11px] text-gray-700 font-medium">
              In this <span className="font-bold text-red-600">Competition Stock Out</span> phase, your sales team must aggressively convert competitor retailers to Tedbury brands.
            </p>
            <div className="inline-block bg-pink-100 border border-pink-200 rounded-full px-6 py-1">
              <p className="text-red-700 font-bold text-[10px]">
                🚀 Market Opportunity: Tesle's disruption allows for rapid share gain.
              </p>
            </div>
            <p className="text-[10px] text-gray-500 italic">
              Strategic deployment is critical to maximize this rare market opening.
            </p>
          </div>

          <div className="space-y-4">
            {/* Retailers to Visit */}
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm relative">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Retailers to Visit per Salesperson:</h3>
              <div className="flex items-center justify-center space-x-6">
                <span className="text-3xl font-black text-emerald-700">{retailersToVisit}</span>
                <button onClick={() => setRetailersToVisit(prev => prev + 10)} className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-8 h-8 rounded-full border border-green-300 text-lg flex items-center justify-center">+</button>
                <span className="text-[10px] text-gray-500 absolute right-4 top-1/2 -translate-y-1/2">Retailers (Min 100)</span>
              </div>
            </div>

            {/* New Retailer Acquisition Effort (MATCHING SCREENSHOT UI) */}
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2">New Retailer Acquisition Effort:</h3>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-6 mb-3">
                  <button onClick={() => setNewRetailerEffort(prev => Math.max(0, prev - 1))} className="bg-red-50 hover:bg-red-100 text-red-400 font-bold w-10 h-10 rounded-full border border-red-200 text-2xl flex items-center justify-center">−</button>
                  <span className="text-3xl font-black text-emerald-700 min-w-[120px] text-center">{levelLabels[newRetailerEffort]}</span>
                  <button onClick={() => setNewRetailerEffort(prev => Math.min(2, prev + 1))} className="bg-green-50 hover:bg-green-100 text-green-400 font-bold w-10 h-10 rounded-full border border-green-200 text-2xl flex items-center justify-center">+</button>
                  <span className="text-[10px] text-gray-500">Level</span>
                </div>
                <div className="flex justify-center space-x-3">
                  {levelLabels.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setNewRetailerEffort(idx)}
                      className={`px-6 py-1 rounded-full text-[10px] font-bold border transition-all
                        ${newRetailerEffort === idx
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                          : 'bg-yellow-50 text-gray-400 border-yellow-300 hover:border-emerald-200'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheme Push Intensity (MATCHING SCREENSHOT UI) */}
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Scheme Push Intensity:</h3>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-6 mb-3">
                  <button onClick={() => setSchemePushIntensity(prev => Math.max(0, prev - 1))} className="bg-red-50 hover:bg-red-100 text-red-400 font-bold w-10 h-10 rounded-full border border-red-200 text-2xl flex items-center justify-center">−</button>
                  <span className="text-3xl font-black text-emerald-700 min-w-[120px] text-center">{levelLabels[schemePushIntensity]}</span>
                  <button onClick={() => setSchemePushIntensity(prev => Math.min(2, prev + 1))} className="bg-green-50 hover:bg-green-100 text-green-400 font-bold w-10 h-10 rounded-full border border-green-200 text-2xl flex items-center justify-center">+</button>
                  <span className="text-[10px] text-gray-500">Level</span>
                </div>
                <div className="flex justify-center space-x-3">
                  {levelLabels.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setSchemePushIntensity(idx)}
                      className={`px-6 py-1 rounded-full text-[10px] font-bold border transition-all
                        ${schemePushIntensity === idx
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                          : 'bg-yellow-50 text-gray-400 border-yellow-300 hover:border-emerald-200'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 pt-4">
            <button onClick={handleExit} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md text-xs">[ Exit Market ]</button>
            <button onClick={handleOK} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-16 rounded-xl shadow-lg text-2xl tracking-tighter">[ OK ]</button>
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-md text-xs">[ Back ]</button>
          </div>
        </div>

        <div className="bg-yellow-200/50 border-t-2 border-yellow-300 px-6 py-3 flex justify-between items-center text-[10px] font-bold text-gray-800 uppercase">
          <span>Round: 5 of 7<br/>Sales Team: <span className="text-red-600">{salesTeamAvailable} (Attrition)</span></span>
          <span>Total Manpower: {totalManpower}</span>
          <span>Total Coverage: {totalCoverage}</span>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound5SalesTeam;
