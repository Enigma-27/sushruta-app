import React, { useState, useEffect } from 'react';

const WellnessTab = ({ data, refreshData, userRole = 'caretaker' }) => {
  // 1. NORMALIZE ROLE
  const currentRole = (userRole || 'caretaker').toLowerCase();

  // 2. DOCTOR BLOCKER
  if (currentRole === 'doctor') {
      return null; 
  }

  // --- State ---
  const [activeMeal, setActiveMeal] = useState('Breakfast');
  const [waterGlasses, setWaterGlasses] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [yogaVerified, setYogaVerified] = useState(false); // New state for caretaker verification
  
  const getTodayString = () => new Date().toDateString();

  const emptyDietPlan = {
      Breakfast: { items: "", cal: "0", protein: "0g", fiber: "0g", tip: "" },
      Lunch: { items: "", cal: "0", protein: "0g", fiber: "0g", tip: "" },
      Snack: { items: "", cal: "0", protein: "0g", fiber: "0g", tip: "" },
      Dinner: { items: "", cal: "0", protein: "0g", fiber: "0g", tip: "" },
  };

  const initialData = {
      Breakfast: { items: "Oats with almonds / Veg Idli", cal: "310", protein: "12g", fiber: "8g", tip: "Take with warm water" },
      Lunch: { items: "2 Multigrain Roti, Dal, Spinach, Curd", cal: "460", protein: "18g", fiber: "10g", tip: "Chew slowly for digestion" },
      Snack: { items: "Makhana / Walnuts & Green Tea", cal: "120", protein: "4g", fiber: "3g", tip: "Avoid sugary tea" },
      Dinner: { items: "Moong Dal Khichdi / Papaya Salad", cal: "340", protein: "10g", fiber: "6g", tip: "Eat 2 hours before bed" },
  };

  const [dietPlans, setDietPlans] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(getTodayString());

  useEffect(() => {
      const today = getTodayString();
      if (lastUpdated !== today) {
          setDietPlans(emptyDietPlan);
          setYogaVerified(false); // Reset yoga status on new day
      }
  }, []);

  const totalCalories = Object.values(dietPlans).reduce((acc, meal) => {
      const val = parseInt(meal.cal.replace(/[^0-9]/g, '')) || 0;
      return acc + val;
  }, 0);

  const maxCalories = 1800;
  const caloriePercentage = Math.min((totalCalories / maxCalories) * 100, 100);

  const handleDietChange = (field, value) => {
      setDietPlans(prev => ({
          ...prev,
          [activeMeal]: {
              ...prev[activeMeal],
              [field]: value
          }
      }));
  };

  const saveDiet = () => {
      setIsEditing(false);
      setLastUpdated(getTodayString());
      alert("Diet Plan Updated!");
  };

  const handleCaretakerYogaClick = () => {
      // Open the link
      window.open("https://www.youtube.com/@SubhashYogakro/streams", "_blank");
      // Update UI to show "Done"
      setYogaVerified(true);
  };

  const isPlanPending = lastUpdated !== getTodayString();

  const yogaPoses = [
      { id: 1, name: "Knee Pain Relief", time: "Short", benefit: "Joint Care", icon: "ph-shield-check", color: "bg-blue-50 text-blue-600", link: "https://www.youtube.com/watch?v=FJjvKz0kD7E" },
      { id: 2, name: "Back Pain Asanas", time: "1 min", benefit: "Spine", icon: "ph-backspace", color: "bg-purple-50 text-purple-600", link: "https://www.youtube.com/watch?v=phuS5VLQy8c" },
      { id: 3, name: "Belly Fat Burn", time: "60 min", benefit: "Weight Loss", icon: "ph-fire", color: "bg-orange-50 text-orange-600", link: "https://www.youtube.com/watch?v=ml6cT4AZdqI" },
      { id: 4, name: "Stress Relief Yoga", time: "60 min", benefit: "Mental Calm", icon: "ph-brain", color: "bg-emerald-50 text-emerald-600", link: "https://www.youtube.com/watch?v=v7AYKMP6rOE" },
  ];

  return (
      <div className="p-4 md:p-8 space-y-10 animate-fade-in pb-32 max-w-7xl mx-auto">
          
          {/* Main Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                      <i className="ph-fill ph-leaf text-3xl"></i>
                  </div>
                  <div>
                      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Wellness & Nutrition</h1>
                      <p className="text-slate-500 font-medium italic">Empowering health through movement and balance.</p>
                  </div>
              </div>
          </div>

          {/* --- 1. HERO SECTION: CONDITIONAL RENDER --- */}
          
          {currentRole === 'caretaker' ? (
              // --- A. CARETAKER VIEW: MONITORING CARD ---
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-indigo-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                      <i className="ph-fill ph-person-simple-tai-chi text-9xl text-indigo-900"></i>
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div>
                          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                              <i className="ph-bold ph-eye"></i> Caretaker Monitor
                          </div>
                          <h2 className="text-3xl font-bold text-slate-800 mb-2">Daily Yoga Session</h2>
                          <p className="text-slate-500 max-w-lg">
                              Ensure the senior attends the live yoga session. Click the button below to open the class and mark it as completed for today.
                          </p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-4 min-w-[280px] text-center">
                          {yogaVerified ? (
                              <>
                                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl shadow-sm animate-bounce-short">
                                      <i className="ph-fill ph-check"></i>
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-green-700">Session Verified</h3>
                                      <p className="text-xs text-green-600 font-medium">Recorded just now</p>
                                  </div>
                                  <button 
                                      onClick={handleCaretakerYogaClick}
                                      className="text-xs text-slate-400 hover:text-slate-600 underline"
                                  >
                                      Open Link Again
                                  </button>
                              </>
                          ) : (
                              <>
                                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-sm">
                                      <i className="ph-fill ph-play"></i>
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-slate-700">Pending Today</h3>
                                      <p className="text-xs text-slate-400 font-medium">Not verified yet</p>
                                  </div>
                                  <button 
                                      onClick={handleCaretakerYogaClick}
                                      className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                  >
                                      Open Live Class <i className="ph-bold ph-arrow-right"></i>
                                  </button>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          ) : (
              // --- B. SENIOR VIEW: ORIGINAL HERO CARD ---
              <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-700 to-teal-600 p-8 md:p-12 text-white shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                      <i className="ph-fill ph-youtube-logo text-[12rem]"></i>
                  </div>
                  
                  <div className="relative z-10 grid md:grid-cols-2 items-center gap-8">
                      <div className="space-y-6">
                          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Live Daily Yoga
                          </div>
                          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Subhash Yogakro <br/> Live Classes</h2>
                          <p className="text-blue-50 opacity-90 text-lg max-w-md">Join thousands in 100% Lifetime Free Yoga sessions. Learn authentic yoga for holistic health.</p>
                          
                          <div className="flex flex-wrap gap-4">
                              <a 
                                  href="https://www.youtube.com/@SubhashYogakro/streams" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-50 transition-all hover:scale-105 flex items-center gap-3"
                              >
                                  <i className="ph-fill ph-broadcast text-2xl"></i> Join Live Now
                              </a>
                              <a 
                                  href="https://www.youtube.com/@SubhashYogakro" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-indigo-800/40 backdrop-blur-md border border-white/30 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-800/60 transition flex items-center gap-2"
                              >
                                  <i className="ph-fill ph-users-three"></i> 81K+ Community
                              </a>
                          </div>
                      </div>
                      
                      {/* Schedule Highlight */}
                      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 space-y-4">
                          <h4 className="font-bold flex items-center gap-2"><i className="ph-bold ph-calendar"></i> Daily Timetable</h4>
                          <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                                  <span className="text-sm font-medium">Early Morning</span>
                                  <span className="font-bold text-teal-300">4:30 AM & 5:30 AM</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                                  <span className="text-sm font-medium">Morning Batch</span>
                                  <span className="font-bold text-teal-300">6:30 AM & 7:30 AM</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                                  <span className="text-sm font-medium">Evening Batch</span>
                                  <span className="font-bold text-teal-300">5:00 PM - 7:00 PM</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 2. NUTRITION & DIET PLANNER (Common for Senior & Caretaker) */}
              <div className="lg:col-span-2 space-y-6">
                  <div className={`bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border ${isEditing ? 'border-orange-400 ring-4 ring-orange-50' : 'border-slate-50'} h-full flex flex-col transition-all`}>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                          <div className="space-y-3">
                              <h3 className="font-bold text-2xl text-slate-800 flex items-center gap-3 shrink-0">
                                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><i className="ph-fill ph-bowl-food text-orange-600"></i></div>
                                  Nutrition Guide
                              </h3>
                              
                              {currentRole === 'caretaker' && (
                                  <button 
                                      onClick={() => isEditing ? saveDiet() : setIsEditing(true)}
                                      className={`ml-1 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all w-fit ${
                                          isEditing 
                                          ? 'bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600' 
                                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                      }`}
                                  >
                                      <i className={`ph-bold ${isEditing ? 'ph-check' : 'ph-pencil-simple'}`}></i>
                                      {isEditing ? 'Save Changes' : 'Edit Plan'}
                                  </button>
                              )}
                          </div>
                          
                          <div className="flex gap-1 bg-slate-50 p-1.5 rounded-xl overflow-x-auto max-w-full no-scrollbar self-start md:self-center">
                              {Object.keys(dietPlans).map(meal => (
                                  <button 
                                      key={meal}
                                      onClick={() => setActiveMeal(meal)}
                                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeMeal === meal ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                  >
                                      {meal}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 items-center flex-1">
                          <div className="space-y-6">
                              <div className="p-6 rounded-[2rem] bg-orange-50/50 border border-orange-100/50 min-h-[160px] flex flex-col justify-center">
                                  <label className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 block">
                                      {activeMeal} Items
                                  </label>
                                  
                                  {isEditing ? (
                                      <textarea 
                                          value={dietPlans[activeMeal].items}
                                          onChange={(e) => handleDietChange('items', e.target.value)}
                                          className="w-full bg-white border border-orange-200 rounded-xl p-3 font-bold text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:font-normal text-lg"
                                          rows="2"
                                          placeholder={`Enter items for ${activeMeal}...`}
                                      />
                                  ) : (
                                      <p className={`font-bold text-xl mb-3 ${isPlanPending && !dietPlans[activeMeal].items ? 'text-slate-400 italic' : 'text-orange-900'}`}>
                                          {(isPlanPending && !dietPlans[activeMeal].items) ? "Update pending for today..." : dietPlans[activeMeal].items}
                                      </p>
                                  )}

                                  <div className="flex items-center gap-2 text-orange-600/70 mt-auto pt-2">
                                      <i className="ph-bold ph-info"></i>
                                      {isEditing ? (
                                              <input 
                                              value={dietPlans[activeMeal].tip}
                                              onChange={(e) => handleDietChange('tip', e.target.value)}
                                              className="flex-1 bg-white border border-orange-200 rounded-lg px-2 py-1 text-sm italic font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
                                              placeholder="Add a health tip..."
                                          />
                                      ) : (
                                          <p className="text-sm italic font-medium">
                                              {(isPlanPending && !dietPlans[activeMeal].tip) ? "No tips added yet." : dietPlans[activeMeal].tip}
                                          </p>
                                      )}
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4">
                                  {[
                                      { label: 'Energy', key: 'cal', unit: 'kcal' },
                                      { label: 'Protein', key: 'protein', unit: '' },
                                      { label: 'Fiber', key: 'fiber', unit: '' }
                                  ].map((stat) => (
                                      <div key={stat.key} className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                                          {isEditing ? (
                                              <div className="flex items-center justify-center gap-1 mt-1">
                                                  <input 
                                                      value={dietPlans[activeMeal][stat.key].replace(stat.unit, '').trim()}
                                                      onChange={(e) => handleDietChange(stat.key, e.target.value + (stat.unit ? ' ' + stat.unit : ''))}
                                                      className="w-full bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                                      type="text"
                                                      placeholder="0"
                                                  />
                                              </div>
                                          ) : (
                                              <span className="text-lg font-bold text-slate-700">
                                                  {(isPlanPending && (dietPlans[activeMeal][stat.key] === "0" || dietPlans[activeMeal][stat.key] === "0 kcal")) 
                                                      ? "-" 
                                                      : dietPlans[activeMeal][stat.key]}
                                                  {stat.key === 'cal' && !dietPlans[activeMeal][stat.key].includes('kcal') && !isPlanPending ? 'kcal' : ''}
                                              </span>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="bg-slate-50 rounded-[2rem] p-6 h-full flex flex-col justify-center border border-slate-100">
                              <div className="relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                      <div className="text-xs font-bold inline-block text-orange-600 uppercase tracking-widest">Day Calories</div>
                                      <div className="text-right">
                                          <span className={`text-xs font-bold inline-block ${totalCalories > maxCalories ? 'text-red-500' : 'text-orange-600'}`}>
                                              {totalCalories} / {maxCalories}
                                          </span>
                                      </div>
                                  </div>
                                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-orange-100">
                                      <div 
                                          style={{ width: `${caloriePercentage}%` }} 
                                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${totalCalories > maxCalories ? 'bg-red-500' : 'bg-orange-500'} rounded-full transition-all duration-500`}
                                      ></div>
                                  </div>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                  {totalCalories === 0 
                                      ? "Add meals to calculate energy intake." 
                                      : "Balanced meals support steady energy and digestion."}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 3. HYDRATION MONITOR (Common) */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center justify-between text-center space-y-6 min-h-[400px]">
                  <h3 className="font-bold text-xl text-slate-800">Hydration Monitor</h3>
                  <div className="relative py-4">
                      <div className="w-32 h-48 border-4 border-blue-100 rounded-b-3xl rounded-t-lg relative overflow-hidden bg-slate-50 shadow-inner">
                          <div className="absolute bottom-0 w-full bg-blue-400 transition-all duration-700" style={{ height: `${(waterGlasses / 8) * 100}%` }}>
                              <div className="absolute top-0 w-full h-4 bg-blue-300 opacity-50 -translate-y-2 rounded-full animate-pulse"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-blue-900/20">{waterGlasses * 250}ml</div>
                      </div>
                  </div>
                  <div className="space-y-4 w-full">
                      <div className="flex justify-center gap-4">
                          <button onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))} className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all flex items-center justify-center text-2xl font-bold">-</button>
                          <div className="flex-1 flex items-center justify-center font-bold text-slate-700 bg-blue-50/50 rounded-xl">{waterGlasses} / 8 Glasses</div>
                          <button onClick={() => setWaterGlasses(Math.min(12, waterGlasses + 1))} className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-2xl font-bold">+</button>
                      </div>
                      <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em]">Daily Goal: 2 Liters</p>
                  </div>
              </div>
          </div>

          {/* 4. QUICK EXERCISE LIBRARY (Hidden for Caretaker) */}
          {currentRole !== 'caretaker' && (
              <div>
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center"><i className="ph-fill ph-person-simple-tai-chi text-teal-600"></i></div>
                      Quick Exercise Library
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {yogaPoses.map(pose => (
                          <a key={pose.id} href={pose.link} target="_blank" rel="noopener noreferrer" className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden block">
                              <div className="absolute inset-0 bg-teal-600/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-10 text-white p-6 text-center">
                                  <i className="ph-fill ph-play-circle text-5xl mb-2"></i>
                                  <span className="font-bold text-lg">Watch Guide</span>
                              </div>
                              <div className={`w-14 h-14 ${pose.color} rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-90`}><i className={`ph-fill ${pose.icon}`}></i></div>
                              <h4 className="font-extrabold text-slate-800 text-lg">{pose.name}</h4>
                              <div className="flex flex-wrap gap-2 mt-4">
                                  <span className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500 px-3 py-1 rounded-full flex items-center gap-1"><i className="ph-bold ph-clock"></i> {pose.time}</span>
                                  <span className="text-[10px] font-black uppercase tracking-tighter bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1"><i className="ph-bold ph-sparkles"></i> {pose.benefit}</span>
                              </div>
                          </a>
                      ))}
                  </div>
              </div>
          )}
      </div>
  );
};

export default WellnessTab;