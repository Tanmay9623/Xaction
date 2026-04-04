import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDistributionPricing = () => {
  const navigate = useNavigate();
  
  // Initialize state from localStorage (pulling what they bought on the first screen)
  const [cash, setCash] = useState(() => {
    const saved = localStorage.getItem("gameDistributionCash");
    return saved !== null ? parseInt(saved, 10) : 5000000;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("gameDistributionInventory");
    if (saved) return JSON.parse(saved);
    return {
      milk: { name: "Tedbury Milk Chocolate", price: 100, qty: 0 },
      dark: { name: "Tedbury Dark Chocolate", price: 150, qty: 0 },
      wafer: { name: "Tedbury Wafer Chocolate", price: 80, qty: 0 },
      gift: { name: "Tedbury Gift Packs", price: 500, qty: 0 }
    };
  });

  // Save back to localStorage if they buy more stuff here
  useEffect(() => {
    localStorage.setItem("gameDistributionCash", cash.toString());
    localStorage.setItem("gameDistributionInventory", JSON.stringify(inventory));
  }, [cash, inventory]);

  const handleBuy = (productId) => {
    const product = inventory[productId];
    
    // Batch size of 100 units
    const batchSize = 100;
    const cost = product.price * batchSize;

    if (cash >= cost) {
      setCash(prev => prev - cost);
      setInventory(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          qty: prev[productId].qty + batchSize
        }
      }));
    } else {
      alert("Not enough cash!");
    }
  };

  const handleOK = () => {
    // End of round 1 purchasing flow
    alert("Simulation Purchasing Complete. Game rounds logic structure would continue here.");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the market?")) {
      navigate("/simulation");
    }
  };

  const handleHelp = () => {
    alert("This is your second chance to buy inventory. If you already bought enough on the previous screen, just click OK to proceed to the simulation.");
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
      
      {/* Main Game Container */}
      <div className="w-full max-w-4xl bg-yellow-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-200">
        
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm">
            Inventory/Purchasing
          </h1>
        </div>

        {/* Content Area */}
        <div className="p-8 sm:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              You have {formatCurrency(cash)} Cash Available and:
            </h2>
          </div>

          {/* Flexible Grid for Items and Buttons */}
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
            
            {/* Milk Chocolate */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-gray-800 w-1/2">
                {inventory.milk.qty} Units - {inventory.milk.name}
              </div>
              <button 
                onClick={() => handleBuy('milk')}
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-xl border border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl min-w-[240px]"
              >
                Buy More Milk Chocolate
              </button>
            </div>

            {/* Dark Chocolate */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-gray-800 w-1/2">
                {inventory.dark.qty} Units - {inventory.dark.name}
              </div>
              <button 
                onClick={() => handleBuy('dark')}
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-xl border border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl min-w-[240px]"
              >
                Buy More Dark Chocolate
              </button>
            </div>

            {/* Wafer Chocolate */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-gray-800 w-1/2">
                {inventory.wafer.qty} Units - {inventory.wafer.name}
              </div>
              <button 
                onClick={() => handleBuy('wafer')}
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-xl border border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl min-w-[240px]"
              >
                Buy More Wafer Chocolate
              </button>
            </div>

            {/* Gift Packs */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-gray-800 w-1/2">
                {inventory.gift.qty} Units - {inventory.gift.name}
              </div>
              <button 
                onClick={() => handleBuy('gift')}
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-xl border border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl min-w-[240px]"
              >
                Buy More Gift Packs
              </button>
            </div>

          </div>

          {/* Action Buttons Row */}
          <div className="mt-16 flex justify-between items-center max-w-3xl mx-auto">
            <button 
              onClick={handleExit}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(153,27,27)] hover:shadow-[0_2px_0_rgb(153,27,27)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl"
            >
              Exit Market
            </button>

            <button 
              onClick={handleOK}
              className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-16 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] hover:shadow-[0_3px_0_rgb(21,128,61)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all text-4xl transform scale-110"
            >
              OK
            </button>

            <button 
              onClick={handleHelp}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_rgb(194,65,12)] hover:shadow-[0_2px_0_rgb(194,65,12)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl"
            >
              Help!
            </button>
          </div>

        </div>

        {/* Footer Info Strip */}
        <div className="bg-yellow-100 border-t-2 border-yellow-300 px-8 py-4 flex justify-between items-center text-lg font-bold text-gray-800">
          <div className="flex flex-col">
            <span>Round: 1 of 7</span>
            <span>Cash Available: {formatCurrency(cash)}</span>
          </div>
          <div className="flex flex-col text-right">
            <span>Market Temperature: Comfortable</span>
            <span>Market Condition: Regular</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameDistributionPricing;
