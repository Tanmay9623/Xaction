import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound3SupplyDiscipline = () => {
  const navigate = useNavigate();

  // User-adjustable values — R3-specific keys
  const [orderFulfilmentRate, setOrderFulfilmentRate] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR3OrderFulfilment");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });
  const [deliveryFrequency, setDeliveryFrequency] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR3DeliveryFrequency");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });
  const [priorityAllocation, setPriorityAllocation] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR3PriorityAllocation");
    const value = saved !== null ? parseInt(saved, 10) : 0;
    return Math.min(2, Math.max(0, Number.isNaN(value) ? 0 : value));
  }); // 0=Top Retailers, 1=High Volume Retailers, 2=All Retailers
  const [stockBufferLevel, setStockBufferLevel] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR3StockBuffer");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });

  const allocationLabels = ["Top Retailers", "High Volume Retailers", "All Retailers"];

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("gameDistributionR3OrderFulfilment", orderFulfilmentRate.toString());
    localStorage.setItem("gameDistributionR3DeliveryFrequency", deliveryFrequency.toString());
    localStorage.setItem("gameDistributionR3PriorityAllocation", priorityAllocation.toString());
    localStorage.setItem("gameDistributionR3StockBuffer", stockBufferLevel.toString());
  }, [orderFulfilmentRate, deliveryFrequency, priorityAllocation, stockBufferLevel]);

  const handleOK = () => {
    navigate("/game-distribution/round3-result");
  };

  const handleBack = () => {
    navigate("/game-distribution/round3-sales-team");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the market?")) {
      navigate("/game-simulation");
    }
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
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm">
            Round 3 – Supply Discipline Control
          </h1>
        </div>

        {/* Content Area */}
        <div className="p-8 sm:p-12">
          
          {/* Description */}
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              With <span className="font-bold text-blue-700">1000 new outlets</span> being added, managing supply consistency is crucial.
              Better supply discipline ensures consistent availability across both existing and new outlets, building strong retailer trust and driving repeat orders.
            </p>
          </div>

          <div className="text-center mb-10">
            <p className="text-md text-gray-600 italic">
              Balancing supply across expanded territory requires careful inventory and delivery planning.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
            
            {/* Order Fulfilment Rate */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Order Fulfilment Rate:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setOrderFulfilmentRate(prev => Math.max(0, prev - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-4xl font-extrabold text-emerald-700 min-w-[100px] text-center">
                    {orderFulfilmentRate}%
                  </span>
                  <button
                    onClick={() => setOrderFulfilmentRate(prev => Math.min(100, prev + 1))}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">%</p>
              </div>
              <p className="text-gray-500 text-sm italic mt-2">
                Percentage of retailer orders you aim to fulfil completely across all outlets.
              </p>
            </div>

            {/* Delivery Frequency to Retailers */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Delivery Frequency to Retailers:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setDeliveryFrequency(prev => Math.max(0, prev - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-4xl font-extrabold text-emerald-700 min-w-[100px] text-center">
                    {deliveryFrequency}
                  </span>
                  <button
                    onClick={() => setDeliveryFrequency(prev => prev + 1)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">Days</p>
              </div>
              <p className="text-gray-500 text-sm italic mt-2">
                Number of days between supply cycles. More frequent delivery is needed for new outlets.
              </p>
            </div>

            {/* Priority Supply Allocation */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Priority Supply Allocation:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setPriorityAllocation(prev => Math.max(0, prev - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-3xl font-extrabold text-emerald-700 min-w-[180px] text-center">
                    {allocationLabels[priorityAllocation]}
                  </span>
                  <button
                    onClick={() => setPriorityAllocation(prev => Math.min(2, prev + 1))}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">Category</p>
              </div>
              <div className="flex justify-center space-x-4 mt-3">
                {allocationLabels.map((label, idx) => (
                  <span
                    key={label}
                    className={`px-3 py-1 rounded-full text-sm font-bold border-2 cursor-pointer transition-all
                      ${priorityAllocation === idx
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                        : 'bg-yellow-100 text-gray-500 border-yellow-300 hover:border-emerald-300'
                      }`}
                    onClick={() => setPriorityAllocation(idx)}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-sm italic text-center mt-3">
                Determines which retailers receive priority during limited stock situations.
              </p>
            </div>

            {/* Stock Buffer Level */}
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Stock Buffer Level:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setStockBufferLevel(prev => Math.max(0, prev - 1))}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    −
                  </button>
                  <span className="text-4xl font-extrabold text-emerald-700 min-w-[100px] text-center">
                    {stockBufferLevel}%
                  </span>
                  <button
                    onClick={() => setStockBufferLevel(prev => prev + 1)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold w-12 h-12 rounded-xl border-2 border-green-300 text-2xl transition-all active:translate-y-[2px]"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-600 font-bold text-right text-lg">%</p>
              </div>
              <p className="text-gray-500 text-sm italic mt-2">
                Extra inventory kept to prevent stockouts — especially important with 1000 new outlets.
              </p>
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
        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-between items-center text-lg font-bold text-gray-800">
          <div className="flex flex-col space-y-1">
            <span>Round: <span className="text-emerald-700">3</span> of 7</span>
          </div>
          <div className="flex flex-col text-right space-y-1">
            <span>Market Temperature: <span className="text-blue-700">Expanding</span></span>
            <span>New Outlets Target: <span className="text-amber-600">1000</span></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameDistributionRound3SupplyDiscipline;
