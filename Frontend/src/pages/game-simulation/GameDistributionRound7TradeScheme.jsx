import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound7TradeScheme = () => {
  const navigate = useNavigate();

  const approvedScheme = 5; 

  const [quantityDiscount, setQuantityDiscount] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR7QuantityDiscount");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });
  const [retailDisplayIncentive, setRetailDisplayIncentive] = useState(() => {
    const saved = localStorage.getItem("gameDistributionR7RetailDisplay");
    return saved !== null ? parseInt(saved, 10) || 0 : 0;
  });

  const totalScheme = quantityDiscount + retailDisplayIncentive;
  const remainingScheme = approvedScheme - totalScheme;

  useEffect(() => {
    localStorage.setItem("gameDistributionR7QuantityDiscount", quantityDiscount.toString());
    localStorage.setItem("gameDistributionR7RetailDisplay", retailDisplayIncentive.toString());
  }, [quantityDiscount, retailDisplayIncentive]);

  const handleIncrement = (type) => {
    if (totalScheme < approvedScheme) {
      if (type === "quantity") {
        setQuantityDiscount(prev => prev + 1);
      } else {
        setRetailDisplayIncentive(prev => prev + 1);
      }
    } else {
      alert(`Total scheme cannot exceed ${approvedScheme}% in this round!`);
    }
  };

  const handleDecrement = (type) => {
    if (type === "quantity" && quantityDiscount > 0) {
      setQuantityDiscount(prev => prev - 1);
    } else if (type === "retail" && retailDisplayIncentive > 0) {
      setRetailDisplayIncentive(prev => prev - 1);
    }
  };

  const handleOK = () => {
    navigate("/game-distribution/round7-credit-control");
  };

  const handleBack = () => {
    navigate("/game-distribution/round7-inventory");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      navigate("/game-simulation");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>

        <div className="text-center pt-8 pb-4 border-b-4 border-yellow-200/50">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase px-4">
            Round 7 – Trade Scheme Control
          </h1>
        </div>

        <div className="p-8 sm:p-12">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Focus on liquidating the high primary stock levels by encouraging bulk orders from retailers.
            </p>
          </div>

          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-8">
            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-tighter italic">Quantity Discount:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleDecrement("quantity")} className="bg-red-100 hover:bg-red-200 text-red-700 font-black w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]">−</button>
                  <span className="text-4xl font-black text-emerald-700 min-w-[80px] text-center italic tracking-tighter">{quantityDiscount}%</span>
                  <button onClick={() => handleIncrement("quantity")} className={`font-black w-12 h-12 rounded-xl border-2 text-2xl transition-all active:translate-y-[2px] ${totalScheme < approvedScheme ? 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}>+</button>
                </div>
                <p className="text-gray-600 font-black uppercase text-[10px]">Discount on Bulk Orders</p>
              </div>
            </div>

            <div className="w-full bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-tighter italic">Retail Display Incentive:</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleDecrement("retail")} className="bg-red-100 hover:bg-red-200 text-red-700 font-black w-12 h-12 rounded-xl border-2 border-red-300 text-2xl transition-all active:translate-y-[2px]">−</button>
                  <span className="text-4xl font-black text-emerald-700 min-w-[80px] text-center italic tracking-tighter">{retailDisplayIncentive}%</span>
                  <button onClick={() => handleIncrement("retail")} className={`font-black w-12 h-12 rounded-xl border-2 text-2xl transition-all active:translate-y-[2px] ${totalScheme < approvedScheme ? 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}>+</button>
                </div>
                <p className="text-gray-600 font-black uppercase text-[10px]">Display Support</p>
              </div>
            </div>

            <div className="w-full bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200 text-center">
              <p className="text-lg font-bold text-gray-800 uppercase tracking-tighter">
                Total Scheme Used: <span className="text-emerald-700 font-black">{totalScheme}%</span> / <span className="text-emerald-700 font-black">{approvedScheme}%</span>
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-between items-center gap-4 max-w-2xl mx-auto px-4">
            <button onClick={handleExit} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(153,27,27)] text-xl uppercase tracking-tighter">[ Exit Market ]</button>
            <button onClick={handleOK} className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-16 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] text-4xl transform scale-110 tracking-widest uppercase">[ OK ]</button>
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] text-xl uppercase tracking-tighter">[ Back ]</button>
          </div>
        </div>

        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-between items-center text-lg font-bold text-gray-800 uppercase italic">
          <div className="flex flex-col space-y-1">
            <span>Round: 7 of 7</span>
            <span>Available Scheme: {remainingScheme}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound7TradeScheme;
