import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionRound6Inventory = () => {
  const navigate = useNavigate();
  
  // Uses remaining cash from Round 5 / R6 Intro calculation
  const [cash, setCash] = useState(() => {
    const saved = localStorage.getItem("gameDistributionCash");
    return saved !== null ? parseInt(saved, 10) : 5000000;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("gameDistributionRound6Inventory");
    if (saved) return JSON.parse(saved);
    
    // Carry over from R5
    const r5Saved = localStorage.getItem("gameDistributionRound5Inventory");
    if (r5Saved) return JSON.parse(r5Saved);

    return {
      milk: { name: "Tedbury Milk Chocolate", price: 100, qty: 0 },
      dark: { name: "Tedbury Dark Chocolate", price: 150, qty: 0 },
      wafer: { name: "Tedbury Wafer Chocolate", price: 80, qty: 0 },
      gift: { name: "Tedbury Gift Packs", price: 500, qty: 0 }
    };
  });

  useEffect(() => {
    localStorage.setItem("gameDistributionCash", cash.toString());
    localStorage.setItem("gameDistributionRound6Inventory", JSON.stringify(inventory));
  }, [cash, inventory]);

  const handleBuy = (productId) => {
    navigate(`/game-distribution/acquisition?product=${productId}&round=6`);
  };

  const handleOK = () => {
    navigate("/game-distribution/round6-trade-scheme");
  };

  const handleBack = () => {
    navigate("/game-distribution/round6-intro");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      navigate("/simulation");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>

        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm">
            Round 6: Inventory / Purchasing
          </h1>
        </div>

        <div className="p-8 sm:p-12">
          <div className="bg-white border-4 border-yellow-300 rounded-xl p-6 sm:p-8 mb-10 shadow-sm max-w-4xl mx-auto space-y-6">
            <div className="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed text-center">
              Available Capital: <span className="font-bold text-emerald-700">{formatCurrency(cash)}</span>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="font-bold text-blue-800 text-xl flex items-center mb-2">
                Market Reality:
              </h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                Tesle is offering aggressive 7% schemes. Retailers are highly scheme-driven. Ensure you have enough stock to meet the demand if you decide to compete!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6">
            {Object.keys(inventory).map((key) => (
              <div key={key} className="flex w-full items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
                <div className="flex-1">
                  <span className="text-2xl font-bold text-gray-800">{inventory[key].qty} Units – {inventory[key].name}</span>
                </div>
                <button onClick={() => handleBuy(key)} className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-xl border border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-lg min-w-[220px]">
                  Buy {inventory[key].name.replace('Tedbury ', '')}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap justify-between items-center gap-4 max-w-3xl mx-auto">
            <button onClick={handleExit} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(153,27,27)] text-xl">Exit Market</button>
            <button onClick={handleOK} className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-16 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] text-4xl transform scale-110">OK</button>
            <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] text-xl">Back</button>
          </div>
        </div>

        <div className="bg-yellow-100 border-t-2 border-yellow-300 px-8 py-4 flex justify-between items-center text-lg font-bold text-gray-800 uppercase">
          <span>Round: 6 of 7</span>
          <span>Condition: Competition Heavy Scheme</span>
        </div>
      </div>
    </div>
  );
};

export default GameDistributionRound6Inventory;
