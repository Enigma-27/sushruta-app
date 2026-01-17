// src/features/shop/MedicineShopTab.jsx
import React from 'react';

const MedicineShopTab = () => {
  const pharmacies = [
    { 
      id: 'tata', 
      name: "Tata 1mg", 
      desc: "Trusted labs & meds", 
      url: "https://www.1mg.com/", 
      icon: "ph-flask", 
      theme: "hover:border-red-400 hover:shadow-red-100",
      bg: "bg-red-50 text-red-600"
    },
    { 
      id: 'apollo', 
      name: "Apollo 24/7", 
      desc: "Express Delivery", 
      url: "https://www.apollopharmacy.in/", 
      icon: "ph-hospital", 
      theme: "hover:border-orange-400 hover:shadow-orange-100",
      bg: "bg-orange-50 text-orange-600"
    },
    { 
      id: 'flipkart', 
      name: "Flipkart Health+", 
      desc: "Best Discounts", 
      url: "https://healthplus.flipkart.com/", 
      icon: "ph-shopping-bag", 
      theme: "hover:border-blue-400 hover:shadow-blue-100",
      bg: "bg-blue-50 text-blue-600"
    },
    { 
      id: 'amazon', 
      name: "Amazon Pharmacy", 
      desc: "Prime Delivery", 
      url: "https://www.amazon.in/gp/browse.html?node=1983518031", 
      icon: "ph-package", 
      theme: "hover:border-cyan-400 hover:shadow-cyan-100",
      bg: "bg-cyan-50 text-cyan-600"
    },
    { 
      id: 'netmeds', 
      name: "Netmeds", 
      desc: "India ki Pharmacy", 
      url: "https://www.netmeds.com/", 
      icon: "ph-pill", 
      theme: "hover:border-teal-400 hover:shadow-teal-100",
      bg: "bg-teal-50 text-teal-600"
    },
    { 
      id: 'pharmeasy', 
      name: "PharmEasy", 
      desc: "Take it Easy", 
      url: "https://pharmeasy.in/", 
      icon: "ph-first-aid", 
      theme: "hover:border-emerald-400 hover:shadow-emerald-100",
      bg: "bg-emerald-50 text-emerald-600"
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <i className="ph-duotone ph-shopping-cart text-blue-600"></i> Medicine Hub
          </h1>
          <p className="text-slate-500">Compare prices & order from trusted sources</p>
        </div>
      </div>

      {/* HERO SECTION: JAN AUSHADHI (GOVT SCHEME) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 text-white shadow-2xl transform transition hover:scale-[1.01] duration-500 group">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500 opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 text-orange-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> Govt. Recommended
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Pradhan Mantri <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">Bhartiya Janaushadhi</span>
            </h2>
            <p className="text-blue-100 mb-8 text-lg opacity-90 max-w-lg">
              Why pay more? Get high-quality generic medicines at <strong>50% to 90% lower prices</strong> than branded alternatives.
            </p>
            <a 
              href="https://janaushadhi.gov.in/near-by-kendra" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-orange-50 transition-all active:scale-95 group-hover:shadow-orange-500/20"
            >
              <span>Find Jan Aushadhi Store</span>
              <i className="ph-bold ph-arrow-right"></i>
            </a>
          </div>

          {/* Right Visual: Price Comparison Graph */}
          <div className="w-full md:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h4 className="text-sm font-bold text-center mb-6 opacity-80 uppercase tracking-widest">Price Comparison</h4>
            <div className="flex justify-center items-end gap-6 h-32">
              <div className="w-16 flex flex-col items-center gap-2 group/bar">
                <span className="text-xs font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity">₹100</span>
                <div className="w-full bg-red-400/80 rounded-t-lg h-24 relative group-hover/bar:bg-red-400 transition-colors"></div>
                <span className="text-[10px] opacity-70">Branded</span>
              </div>
              <div className="w-16 flex flex-col items-center gap-2 group/bar">
                <span className="text-xs font-bold text-green-300 opacity-0 group-hover/bar:opacity-100 transition-opacity">₹10</span>
                <div className="w-full bg-green-400 rounded-t-lg h-6 relative animate-bounce">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    Save 90%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-200">Generic</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* PRIVATE PHARMACIES GRID */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className="ph-fill ph-storefront text-slate-400"></i> Other Trusted Pharmacies
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pharmacies.map((shop) => (
            <a 
              key={shop.id} 
              href={shop.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 group flex items-center gap-4 hover:-translate-y-1 ${shop.theme}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${shop.bg}`}>
                <i className={`ph-fill ${shop.icon}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 truncate">{shop.name}</h4>
                  <i className="ph-bold ph-arrow-up-right text-slate-300 group-hover:text-slate-600 transition-colors"></i>
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate">{shop.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Safety Note */}
      <div className="text-center text-xs text-slate-400 mt-8">
        Disclaimer: Sushruta is an aggregator. Purchases are processed by third-party websites.
      </div>

    </div>
  );
};

export default MedicineShopTab;