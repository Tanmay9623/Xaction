import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound7SupplyDiscipline = () => {
  const navigate = useNavigate();

  // Round 7: Supply Discipline
  const [orderFulfilmentRate, setOrderFulfilmentRate] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR7OrderFulfilment");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });

  const [deliveryFrequency, setDeliveryFrequency] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR7DeliveryFrequency");
    return saved !== null ? parseInt(saved, 10) : 7;
  });

  const [priorityAllocation, setPriorityAllocation] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR7PriorityAllocation");
    return saved !== null ? parseInt(saved, 10) : 2; 
  }); 

  // Mandatory static 20% stock buffer for Round 7
  const stockBufferLevel = 20;

  const allocationLabels = ["Top Retailers", "High Volume Retailers", "All Retailers"];

  useEffect(() => {
    localStorage.setItem("gameDistributionR7OrderFulfilment", orderFulfilmentRate.toString());
    localStorage.setItem("gameDistributionR7DeliveryFrequency", deliveryFrequency.toString());
    localStorage.setItem("gameDistributionR7PriorityAllocation", priorityAllocation.toString());
    localStorage.setItem("gameDistributionR7StockBuffer", stockBufferLevel.toString());
  }, [orderFulfilmentRate, deliveryFrequency, priorityAllocation]);

  const handleOK = () => {
    navigate("/game-distribution/round7-result");
  };

  const handleBack = () => {
    navigate("/game-distribution/round7-sales-team");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      navigate("/game-simulation");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full max-w-2xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        <div className="bg-emerald-700 text-emerald-50 px-4 py-2 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>

        <div className="text-center py-6">
          <h1 className="text-3xl font-black text-red-600 tracking-tighter uppercase px-4 italic underline decoration-yellow-300">
            Round 7 – Supply Discipline
          </h1>
        </div>

        <div className="px-8 pb-10 space-y-6">
          <div className="text-center">
            <p className="text-[11px] text-gray-700 font-black uppercase tracking-tighter italic">
              Maintain order fulfillment to deplete excess inventory.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm relative text-center">
              <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-tighter italic">Order Fulfilment Rate:</h3>
              <div className="flex items-center justify-center space-x-6">
                <button onClick={() => setOrderFulfilmentRate(prev => Math.max(0, prev - 1))} className="bg-red-50 hover:bg-red-100 text-red-400 font-black w-8 h-8 rounded-full border border-red-200 text-xl flex items-center justify-center transition-all active:scale-90">−</button>
                <span className="text-3xl font-black text-emerald-700 min-w-[60px] text-center italic">{orderFulfilmentRate}%</span>
                <button onClick={() => setOrderFulfilmentRate(prev => Math.min(100, prev + 1))} className="bg-green-50 hover:bg-green-100 text-green-400 font-black w-8 h-8 rounded-full border border-green-200 text-xl flex items-center justify-center transition-all active:scale-90">+</button>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm relative text-center">
              <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-tighter italic">Delivery Frequency:</h3>
              <div className="flex items-center justify-center space-x-6">
                <button onClick={() => setDeliveryFrequency(prev => Math.max(1, prev - 1))} className="bg-red-50 hover:bg-red-100 text-red-400 font-black w-8 h-8 rounded-full border border-red-200 text-xl flex items-center justify-center transition-all active:scale-90">−</button>
                <span className="text-3xl font-black text-emerald-700 min-w-[60px] text-center italic">{deliveryFrequency}</span>
                <button onClick={() => setDeliveryFrequency(prev => prev + 1)} className="bg-green-50 hover:bg-green-100 text-green-400 font-black w-8 h-8 rounded-full border border-green-200 text-xl flex items-center justify-center transition-all active:scale-90">+</button>
                <span className="text-[10px] text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 font-black uppercase tracking-widest">Days</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-tighter italic">Priority Allocation:</h3>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-6 mb-3">
                  <button onClick={() => setPriorityAllocation(prev => Math.max(0, prev - 1))} className="bg-red-50 hover:bg-red-100 text-red-400 font-black w-10 h-10 rounded-full border border-red-200 text-2xl flex items-center justify-center">−</button>
                  <span className="text-2xl font-black text-emerald-700 min-w-[150px] text-center italic">{allocationLabels[priorityAllocation]}</span>
                  <button onClick={() => setPriorityAllocation(prev => Math.min(2, prev + 1))} className="bg-green-50 hover:bg-green-100 text-green-400 font-black w-10 h-10 rounded-full border border-green-200 text-2xl flex items-center justify-center">+</button>
                </div>
                <div className="flex justify-center space-x-2">
                  {allocationLabels.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setPriorityAllocation(idx)}
                      className={`px-4 py-1 rounded-full text-[9px] font-black border transition-all uppercase tracking-tighter
                        ${priorityAllocation === idx ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-yellow-50 text-gray-400 border-yellow-300'}
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-2xl border-4 border-red-400 shadow-md relative text-center">
              <h3 className="text-md font-bold text-red-600 mb-2 uppercase tracking-tighter italic underline decoration-yellow-400">Stock Buffer Level:</h3>
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-emerald-700 italic tracking-tighter">{stockBufferLevel}%</span>
                <span className="text-[10px] text-red-500 font-black uppercase mt-1 tracking-widest italic underline">Mandatory Year-End Minimum</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 pt-4">
            <button onClick={handleExit} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md text-xs uppercase tracking-tighter">[ Exit Market ]</button>
            <button onClick={handleOK} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-16 rounded-xl shadow-lg text-2xl tracking-tighter uppercase">[ OK ]</button>
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-md text-xs uppercase tracking-tighter">[ Back ]</button>
          </div>
        </div>

        <div className="bg-yellow-200/50 border-t-2 border-yellow-300 px-6 py-3 flex justify-center items-center text-[10px] font-bold text-gray-800 uppercase italic">
          <span>Round: 7 of 7</span>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound7SupplyDiscipline;
