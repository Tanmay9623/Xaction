import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GameDistributionAcquisition = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productKey = searchParams.get("product") || "milk";
  const stage = searchParams.get("stage") || "";
  
  // Initialize state from localStorage
  const [cash, setCash] = useState(() => {
    const saved = localStorage.getItem("gameDistributionCash");
    return saved !== null ? parseInt(saved, 10) : 5000000;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("gameDistributionInventory");
    if (saved) return JSON.parse(saved);
    return {
      milk: { name: "Tedbury Milk Chocolate", qty: 0 },
      dark: { name: "Tedbury Dark Chocolate", qty: 0 },
      wafer: { name: "Tedbury Wafer Chocolate", qty: 0 },
      gift: { name: "Tedbury Gift Packs", qty: 0 }
    };
  });

  // Calculate product-specific pricing options
  // Default to Milk Chocolate pricing from the prompt
  const getProductOptions = (key) => {
    const options = {
      milk: [
        { qty: 10000, price: 500000, displayPrice: "₹ 500,000" },
        { qty: 20000, price: 850000, displayPrice: "₹ 850,000" },
        { qty: 30000, price: 1200000, displayPrice: "₹ 12,00,000" }
      ],
      dark: [
        { qty: 7000, price: 500000, displayPrice: "₹ 500,000" },
        { qty: 14000, price: 900000, displayPrice: "₹ 900,000" },
        { qty: 21000, price: 1300000, displayPrice: "₹ 13,00,000" }
      ],
      wafer: [
        { qty: 10000, price: 300000, displayPrice: "₹ 300,000" },
        { qty: 20000, price: 450000, displayPrice: "₹ 450,000" },
        { qty: 30000, price: 700000, displayPrice: "₹ 700,000" }
      ],
      gift: [
        { qty: 1000, price: 200000, displayPrice: "₹ 200,000" },
        { qty: 2000, price: 350000, displayPrice: "₹ 350,000" },
        { qty: 3000, price: 500000, displayPrice: "₹ 500,000" }
      ]
    };
    return options[key] || options.milk;
  };

  const currentProduct = inventory[productKey];
  const purchaseOptions = getProductOptions(productKey);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("gameDistributionCash", cash.toString());
    localStorage.setItem("gameDistributionInventory", JSON.stringify(inventory));
  }, [cash, inventory]);

  const handleBuy = (option) => {
    if (cash >= option.price) {
      setCash(prev => prev - option.price);
      setInventory(prev => ({
        ...prev,
        [productKey]: {
          ...prev[productKey],
          qty: prev[productKey].qty + option.qty
        }
      }));
    } else {
      alert("Not enough cash!");
    }
  };

  const handleOK = () => {
    // Always return to the inventory hub (Screen 2)
    navigate("/game-distribution/inventory");
  };

  const handleBack = () => {
    // Go back to the inventory hub (Screen 2)
    navigate("/game-distribution/inventory");
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
        
        <div className="bg-emerald-700 text-emerald-50 px-6 py-3 flex justify-between items-center text-sm font-bold tracking-widest uppercase border-b-4 border-emerald-800">
          <span>Game Simulation</span>
        </div>

        {/* Header */}
        <div className="text-center pt-8 pb-4 border-b-4 border-yellow-200/50">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wider uppercase drop-shadow-sm">
            Acquisition: {currentProduct?.name.replace('Tedbury ', '')}
          </h1>
        </div>

        {/* Content Area */}
        <div className="p-8 sm:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              You currently have <span className="text-emerald-700">{currentProduct?.qty}</span> Units of {currentProduct?.name.replace('Tedbury ', '')} and <span className="text-emerald-700 font-extrabold">{formatCurrency(cash)}</span> Cash Available
            </h2>
          </div>

          <p className="text-xl font-bold text-gray-700 text-center mb-6 underline decoration-yellow-400">You can buy:</p>

          {/* Pricing Tiers Grid */}
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
            
            {purchaseOptions.map((option, index) => (
              <div key={index} className="flex w-full items-center justify-between bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-sm hover:border-emerald-400 transition-all">
                <div className="text-xl font-bold text-gray-800">
                  {option.qty} Units of {currentProduct?.name} for <span className="text-gray-600 text-lg font-medium">{option.displayPrice || formatCurrency(option.price)}</span>
                </div>
                
                <button 
                  onClick={() => handleBuy(option)}
                  disabled={cash < option.price}
                  className={`font-bold py-3 px-8 rounded-xl border-b-4 transition-all text-xl shadow-md min-w-[140px]
                    ${cash >= option.price 
                      ? 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300 hover:border-emerald-400 active:border-b-0 active:translate-y-[4px]' 
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                >
                  [ Buy It! ]
                </button>
              </div>
            ))}

          </div>

          {/* Action Buttons Row */}
          <div className="mt-16 flex justify-between items-center max-w-2xl mx-auto px-4">
            <button 
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] hover:shadow-[0_2px_0_rgb(75,85,99)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-xl"
            >
              [ Back ]
            </button>

            <button 
              onClick={handleOK}
              className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-16 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] hover:shadow-[0_3px_0_rgb(21,128,61)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all text-4xl transform scale-110 tracking-widest"
            >
              [ OK ]
            </button>
          </div>

        </div>

        {/* Footer Info Strip */}
        <div className="bg-yellow-100 border-t-4 border-yellow-300 px-8 py-5 flex justify-between items-center text-lg font-bold text-gray-800">
          <div className="flex flex-col space-y-1">
            <span>Round: <span className="text-emerald-700">1</span> of 7</span>
            <span>Cash Available: <span className="text-emerald-700">{formatCurrency(cash)}</span></span>
          </div>
          <div className="flex flex-col text-right space-y-1">
            <span>Market Demand: <span className="text-blue-700">{productKey !== 'milk' ? 'Regular' : 'Normal'}</span></span>
            <span>Season: <span className="text-amber-600">{productKey !== 'milk' ? 'Normal' : 'Regular'}</span></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameDistributionAcquisition;
