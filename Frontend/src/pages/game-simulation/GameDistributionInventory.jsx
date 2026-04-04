import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GameDistributionInventory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get('stage');
  
  // Initialize state from localStorage or defaults
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

  // Track which product we are currently buying in the sequence
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem("gameDistributionStep");
    return saved !== null ? parseInt(saved, 10) : 1; // Step 1 is Milk
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("gameDistributionCash", cash.toString());
    localStorage.setItem("gameDistributionInventory", JSON.stringify(inventory));
    localStorage.setItem("gameDistributionStep", currentStep.toString());
  }, [cash, inventory, currentStep]);

  // Track which products have been bought on this screen
  const [bought, setBought] = useState({ milk: false, dark: false, wafer: false, gift: false });

  // Contribution percentages (backend logic, not shown on UI)
  const contributions = { milk: 0.40, dark: 0.30, wafer: 0.20, gift: 0.10 };
  const INITIAL_CASH = 5000000; // ₹50,00,000

  const handleBuy = (productId) => {
    if (bought[productId]) return; // Already bought
    const deduction = Math.round(INITIAL_CASH * contributions[productId]);
    if (deduction > cash) {
      alert("Not enough cash available!");
      return;
    }
    // Calculate units based on unit price
    const unitPrice = inventory[productId].price;
    const unitsBought = Math.floor(deduction / unitPrice);

    setCash(prev => prev - deduction);
    setInventory(prev => ({
      ...prev,
      [productId]: { ...prev[productId], qty: prev[productId].qty + unitsBought }
    }));
    setBought(prev => ({ ...prev, [productId]: true }));
  };

  const handleOK = () => {
    if (stage === '3a') {
      navigate("/game-distribution/acquisition?product=wafer");
    } else if (stage === '4a') {
      navigate("/game-distribution/acquisition?product=gift");
    } else if (stage === '5a') {
      navigate("/game-distribution/acquisition?product=dark");
    } else if (stage === '6a' || stage === '7') {
      navigate("/game-distribution/trade-scheme");
    } else {
      // Navigate strictly to the first acquisition screen in the sequence (Milk Chocolate)
      navigate("/game-distribution/acquisition?product=milk");
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the market?")) {
      navigate("/simulation");
    }
  };

  const handleHelp = () => {
    alert("Buy inventory based on expected market demand. Milk chocolate sells fast but has lower margins. Gift packs have high margins but sell slower. Manage your ₹50,00,000 wisely!");
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
        
        {/* Screen Indicator */}
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs shadow-sm">
            Screen {stage ? stage : '2'}
          </span>
        </div>

        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm">
            Inventory/Purchasing
          </h1>
        </div>

        {/* Content Area */}
        <div className="p-8 sm:p-12">
          
          {/* Context & Guidelines */}
          <div className="bg-white border-4 border-yellow-300 rounded-xl p-6 sm:p-8 mb-10 shadow-sm max-w-4xl mx-auto space-y-6">
            <div className="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed">
              <span className="font-bold text-emerald-800">As Sunshine Agency</span>, you have <span className="font-bold text-emerald-700">₹50,00,000</span> to build your opening stock for Tedbury Chocolates. Sunshine also invests <span className="font-bold text-red-600">₹20,00,000</span> on Warehouse, Delivery Vehicles etc.
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-amber-500 p-4">
              <h3 className="font-bold text-amber-800 text-xl flex items-center mb-2">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Buying Guidelines:
              </h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                Choose how much inventory to purchase across products. High-demand SKUs sell faster but may offer lower margins. Premium products give better margins but move slower. Overstocking can lock your capital, while understocking can lead to missed sales.
              </p>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              You have {formatCurrency(cash)} and:
            </h2>
          </div>

          {/* Flexible Grid for Items and Buttons */}
          <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6">
            
            {/* Milk Chocolate */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1">
                <span className="text-2xl font-bold text-gray-800">
                  {inventory.milk.qty} Units – {inventory.milk.name}
                </span>
              </div>
              <button 
                onClick={() => handleBuy('milk')}
                disabled={bought.milk}
                className={`font-bold py-3 px-6 rounded-xl border transition-all text-lg min-w-[220px]
                  ${bought.milk 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-default' 
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] cursor-pointer'}`}
              >
                {bought.milk ? '✓ Bought Milk Chocolate' : 'Buy Milk Chocolate'}
              </button>
            </div>

            {/* Dark Chocolate */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1">
                <span className="text-2xl font-bold text-gray-800">
                  {inventory.dark.qty} Units – {inventory.dark.name}
                </span>
              </div>
              <button 
                onClick={() => handleBuy('dark')}
                disabled={bought.dark}
                className={`font-bold py-3 px-6 rounded-xl border transition-all text-lg min-w-[220px]
                  ${bought.dark 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-default' 
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] cursor-pointer'}`}
              >
                {bought.dark ? '✓ Bought Dark Chocolate' : 'Buy Dark Chocolate'}
              </button>
            </div>

            {/* Wafer Chocolate */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1">
                <span className="text-2xl font-bold text-gray-800">
                  {inventory.wafer.qty} Units – {inventory.wafer.name}
                </span>
              </div>
              <button 
                onClick={() => handleBuy('wafer')}
                disabled={bought.wafer}
                className={`font-bold py-3 px-6 rounded-xl border transition-all text-lg min-w-[220px]
                  ${bought.wafer 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-default' 
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] cursor-pointer'}`}
              >
                {bought.wafer ? '✓ Bought Wafer Chocolate' : 'Buy Wafer Chocolate'}
              </button>
            </div>

            {/* Gift Packs */}
            <div className="flex w-full items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1">
                <span className="text-2xl font-bold text-gray-800">
                  {inventory.gift.qty} Units – {inventory.gift.name}
                </span>
              </div>
              <button 
                onClick={() => handleBuy('gift')}
                disabled={bought.gift}
                className={`font-bold py-3 px-6 rounded-xl border transition-all text-lg min-w-[220px]
                  ${bought.gift 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-default' 
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] cursor-pointer'}`}
              >
                {bought.gift ? '✓ Bought Gift Packs' : 'Buy Gift Packs'}
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
            <span>Market Temperature: {stage === '3a' ? 'Comfortable' : 'Normal'}</span>
            <span>Market Condition: Regular</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameDistributionInventory;
