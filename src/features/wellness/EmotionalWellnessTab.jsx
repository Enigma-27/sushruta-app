import React, { useState, useEffect } from 'react';
import { MockBackend } from '../../services/mockBackend';

const EmotionalWellnessTab = ({ data, refreshData, userRole }) => {
  // 1. Role Logic
  const role = (userRole || 'senior').toLowerCase();
  const isDoctor = role === 'doctor';
  const isCaretaker = role === 'caretaker';

  // Doctor Blocker
  if (isDoctor) return null;

  // --- State ---
  const [mood, setMood] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathText, setBreathText] = useState("Tap to Breathe");
  const [breathPhase, setBreathPhase] = useState('idle');
  const [gratitudeInput, setGratitudeInput] = useState("");
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', link: '' });

  const wellnessLogs = data.wellnessLogs || [];

  // --- CARETAKER LOGIC: Mood Stats ---
  const today = new Date().toLocaleDateString();
  
  // Filter logs to find mood entries for today
  const todaysMoods = wellnessLogs
      .filter(l => l.type === 'mood' && l.date === today)
      .sort((a, b) => b.id - a.id); // Newest first

  // Calculate Dominant Mood
  const moodCounts = todaysMoods.reduce((acc, curr) => {
      acc[curr.val] = (acc[curr.val] || 0) + 1;
      return acc;
  }, {});
  
  const dominantMood = Object.keys(moodCounts).length > 0 
      ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b) 
      : "No Data";

  // --- Default Library & Handlers ---
  const defaultLibrary = {
      "Anxious": [{ id: 'def1', title: "Gayatri Mantra", type: "Spiritual", dur: "16 min", link: "https://www.youtube.com/watch?v=fMUZKVLLyQI" }],
      "Low": [{ id: 'def6', title: "Laughter Yoga", type: "Comedy", dur: "8 min", link: "https://www.youtube.com/watch?v=ViTeOl0RBHE" }],
      "Happy": [{ id: 'def8', title: "Old Bollywood Lofi", type: "Music", dur: "16 min", link: "https://www.youtube.com/watch?v=qqMoETAVp7U" }],
      "Okay": [{ id: 'def10', title: "Guided Surya Namaskar", type: "Yoga", dur: "15 min", link: "https://www.youtube.com/watch?v=1I9Jn5pj7sA" }]
  };
  
  const [library, setLibrary] = useState(defaultLibrary);

  // Handlers
  const logMood = (m) => {
      setMood(m); 
      setIsAddingVideo(false);
      const now = new Date();
      const newLog = { 
          id: Date.now(), type: 'mood', val: m, 
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
      };
      // Update Backend
      const currentData = MockBackend.getData();
      MockBackend.updateData({ ...currentData, wellnessLogs: [newLog, ...(currentData.wellnessLogs || [])] });
      refreshData();
  };

  const saveGratitude = () => {
      if(!gratitudeInput.trim()) return;
      const now = new Date();
      const newLog = { 
          id: Date.now(), type: 'gratitude', text: gratitudeInput, 
          date: now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
      };
      const currentData = MockBackend.getData();
      MockBackend.updateData({ ...currentData, wellnessLogs: [newLog, ...(currentData.wellnessLogs || [])] });
      setGratitudeInput(""); 
      refreshData();
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.link) return;
    
    const videoItem = {
      id: Date.now(),
      title: newVideo.title,
      link: newVideo.link,
      type: "Custom",
      dur: "N/A",
      isCustom: true
    };

    setLibrary(prev => ({
      ...prev,
      [mood]: [videoItem, ...(prev[mood] || [])]
    }));

    setNewVideo({ title: '', link: '' });
    setIsAddingVideo(false);
  };

  const deleteVideo = (item, moodCategory, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Remove this video?")) {
        setLibrary(prev => ({
            ...prev,
            [moodCategory]: prev[moodCategory].filter(v => v.id !== item.id)
        }));
    }
  };

  // Breathing Animation Effect
  useEffect(() => {
      let interval;
      if (breathingActive) {
          let phaseCounter = 0;
          const cycle = () => {
              if(phaseCounter === 0) { setBreathText("Inhale..."); setBreathPhase('inhale'); setTimeout(() => { phaseCounter = 1; cycle(); }, 4000); } 
              else if(phaseCounter === 1) { setBreathText("Hold..."); setBreathPhase('hold'); setTimeout(() => { phaseCounter = 2; cycle(); }, 7000); } 
              else { setBreathText("Exhale..."); setBreathPhase('exhale'); setTimeout(() => { phaseCounter = 0; cycle(); }, 8000); }
          };
          cycle();
      } else { setBreathText("Tap to Breathe"); setBreathPhase('idle'); }
      return () => clearTimeout(interval);
  }, [breathingActive]);

  const moods = [
      { icon: "ph-smiley", label: "Happy", color: "from-yellow-300 to-amber-400", shadow: "shadow-yellow-200" },
      { icon: "ph-smiley-meh", label: "Okay", color: "from-blue-300 to-cyan-400", shadow: "shadow-blue-200" },
      { icon: "ph-smiley-sad", label: "Low", color: "from-slate-300 to-gray-400", shadow: "shadow-gray-200" },
      { icon: "ph-lightning", label: "Anxious", color: "from-orange-300 to-red-400", shadow: "shadow-orange-200" },
  ];

  const breathColors = { idle: 'from-sky-400 to-indigo-500', inhale: 'from-cyan-400 to-blue-500', hold: 'from-violet-500 to-purple-600', exhale: 'from-amber-400 to-orange-500' };

  return (
      <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
          <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600"><i className="ph-fill ph-heart"></i></span>
                  Emotional Wellbeing
              </h1>
              <p className="text-slate-500 ml-14">Your sanctuary for mental calm and spiritual joy.</p>
          </div>

          {/* =========================================================
              CARETAKER VIEW: MONITORING DASHBOARD
             ========================================================= */}
          {isCaretaker ? (
              <div className="space-y-8">
                  {/* 1. MOOD MONITOR CARD */}
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-indigo-50">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                              <i className="ph-fill ph-chart-pie-slice"></i>
                          </div>
                          <div>
                              <h3 className="text-2xl font-bold text-slate-800">Senior's Emotional Status</h3>
                              <p className="text-sm text-slate-500 font-medium">Daily summary based on logged interactions</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left: Overall Status Card */}
                          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-indigo-100 shadow-sm min-h-[280px]">
                              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-md mb-6 text-white
                                  ${dominantMood === 'Happy' ? 'bg-amber-400' : dominantMood === 'Anxious' ? 'bg-orange-400' : dominantMood === 'Low' ? 'bg-slate-400' : 'bg-indigo-400'}
                              `}>
                                   <i className={`ph-fill ${dominantMood === 'Happy' ? 'ph-smiley' : dominantMood === 'Anxious' ? 'ph-lightning' : dominantMood === 'Low' ? 'ph-smiley-sad' : 'ph-smiley-meh'}`}></i>
                              </div>
                              <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-1">Overall Mood Today</h4>
                              <div className="text-4xl font-black text-slate-800 mb-3 tracking-tight">
                                  {dominantMood}
                              </div>
                              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-4 py-1.5 rounded-full">
                                  {todaysMoods.length} Check-ins Recorded
                              </span>
                          </div>

                          {/* Right: Detailed Timeline */}
                          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col h-[280px]">
                              <div className="flex justify-between items-center mb-4 shrink-0">
                                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Activity Timeline</h4>
                                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">Today</span>
                              </div>
                              
                              <div className="overflow-y-auto custom-scroll flex-1 pr-2 space-y-3">
                                  {todaysMoods.length > 0 ? (
                                      todaysMoods.map((log) => (
                                          <div key={log.id} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                              <div className="flex items-center gap-3">
                                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-sm
                                                      ${log.val === 'Happy' ? 'bg-amber-400' : log.val === 'Anxious' ? 'bg-orange-400' : log.val === 'Low' ? 'bg-slate-400' : 'bg-blue-400'}
                                                  `}>
                                                      <i className={`ph-fill ${log.val === 'Happy' ? 'ph-smiley' : log.val === 'Anxious' ? 'ph-lightning' : log.val === 'Low' ? 'ph-smiley-sad' : 'ph-smiley-meh'}`}></i>
                                                  </div>
                                                  <div>
                                                      <span className="font-bold text-slate-700 block text-sm leading-tight">{log.val}</span>
                                                      <span className="text-[10px] font-medium text-slate-400">Logged via App</span>
                                                  </div>
                                              </div>
                                              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{log.time}</span>
                                          </div>
                                      ))
                                  ) : (
                                      <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                          <i className="ph-duotone ph-clock text-3xl mb-2"></i>
                                          <p className="text-sm font-medium">No activity recorded yet.</p>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* 2. GRATITUDE JOURNAL (READ ONLY) */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-[2rem] border border-orange-100">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-white text-orange-500 rounded-2xl shadow-sm flex items-center justify-center border border-orange-100 text-2xl"><i className="ph-fill ph-book-open-text"></i></div>
                          <div>
                              <h3 className="font-bold text-2xl text-orange-900">Gratitude Entries</h3>
                              <p className="text-sm text-orange-800/60 font-medium">Read what the senior is thankful for today.</p>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {wellnessLogs.filter(l => l.type === 'gratitude').length === 0 ? (
                              <div className="col-span-3 text-center py-10 opacity-50"><i className="ph-duotone ph-notebook text-4xl mb-2 text-orange-300"></i><p className="text-orange-800">Journal is empty.</p></div>
                          ) : (
                              wellnessLogs.filter(l => l.type === 'gratitude').slice(0, 3).map(l => (
                                  <div key={l.id} className="bg-white p-6 rounded-3xl border border-orange-100/50 shadow-sm relative flex flex-col justify-between min-h-[140px]">
                                      <div>
                                          <i className="ph-fill ph-quotes text-orange-200 text-3xl mb-2 block"></i>
                                          <p className="text-slate-700 text-base font-medium leading-relaxed line-clamp-3">"{l.text}"</p>
                                      </div>
                                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{l.date} • {l.time}</span>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
          ) : (
              // =========================================================
              // SENIOR VIEW: INTERACTIVE TOOLS
              // =========================================================
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* 1. MOOD CHECK-IN */}
                  <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50 flex flex-col h-[520px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-bl-[100px] opacity-20 -z-10"></div>
                      <div className="shrink-0 mb-6">
                          <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                              <i className="ph-fill ph-heartbeat text-rose-500 text-xl"></i> How is your spirit today?
                          </h3>
                          <div className="flex justify-between gap-3">
                              {moods.map((m) => (
                                  <button key={m.label} onClick={() => logMood(m.label)} className="flex flex-col items-center gap-3 group">
                                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg bg-gradient-to-br ${m.color} ${m.shadow} transition-all duration-300 transform ${mood === m.label ? 'scale-110 ring-4 ring-offset-2 ring-blue-100 -translate-y-2' : 'group-hover:-translate-y-1 group-hover:shadow-xl'}`}>
                                          <i className={`ph-fill ${m.icon}`}></i>
                                      </div>
                                      <span className={`text-xs font-bold transition-colors ${mood === m.label ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{m.label}</span>
                                  </button>
                              ))}
                          </div>
                      </div>
                      {mood ? (
                          <div className="flex-1 flex flex-col min-h-0 border-t border-slate-100 pt-6 animate-fade-in">
                              <div className="flex justify-between items-center mb-4 shrink-0">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected for You</h4>
                                  {!isAddingVideo && <button onClick={() => setIsAddingVideo(true)} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition"><i className="ph-bold ph-plus"></i> Add Video</button>}
                              </div>
                              {isAddingVideo && (
                                  <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-blue-100 animate-slide-up shrink-0 shadow-inner">
                                      <input className="w-full p-3 mb-3 rounded-xl border-none shadow-sm text-sm focus:ring-2 focus:ring-blue-200" placeholder="Title" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
                                      <input className="w-full p-3 mb-3 rounded-xl border-none shadow-sm text-sm focus:ring-2 focus:ring-blue-200" placeholder="Paste YouTube Link" value={newVideo.link} onChange={e => setNewVideo({...newVideo, link: e.target.value})} />
                                      <div className="flex gap-2">
                                          <button onClick={handleAddVideo} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-bold">Save</button>
                                          <button onClick={() => setIsAddingVideo(false)} className="px-4 py-2 text-slate-500 text-sm font-bold bg-slate-200 rounded-xl">Cancel</button>
                                      </div>
                                  </div>
                              )}
                              <div className="overflow-y-auto custom-scroll pr-2 flex-1 space-y-3 pb-2">
                                  {(library[mood] || []).map((item, idx) => (
                                      <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full group relative">
                                          <div className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-50 hover:border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 relative z-10 ${item.isCustom ? 'bg-gradient-to-r from-rose-50/50 to-white' : ''}`}>
                                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${item.color || 'bg-blue-50 text-blue-600'} shadow-sm group-hover:scale-110 transition-transform`}>
                                                  <i className={`ph-fill ${item.icon || 'ph-play-circle'}`}></i>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <h5 className="font-bold text-slate-700 text-sm group-hover:text-blue-700 truncate transition-colors">{item.title}</h5>
                                                  <div className="flex items-center gap-2 mt-1">
                                                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{item.type}</span>
                                                      <span className="text-[10px] text-slate-400">{item.dur}</span>
                                                  </div>
                                              </div>
                                              {/* Delete button only for custom items or all items as per requirement */}
                                              <button onClick={(e) => deleteVideo(item, mood, e)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100" title="Remove">
                                                  <i className="ph-bold ph-trash"></i>
                                              </button>
                                              <i className="ph-fill ph-play-circle text-3xl text-slate-200 group-hover:text-blue-500 transition-colors absolute right-4 top-1/2 -translate-y-1/2 opacity-100 group-hover:opacity-0"></i>
                                          </div>
                                      </a>
                                  ))}
                              </div>
                          </div>
                      ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 pb-10"><i className="ph-fill ph-hand-tap text-4xl mb-2 text-slate-300"></i><p className="text-slate-400 font-medium">Select a mood above</p></div>
                      )}
                  </div>

                  {/* 2. BREATHING */}
                  <div className={`rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden h-[520px] transition-all duration-1000 bg-gradient-to-br ${breathColors[breathPhase]}`}>
                      <div className={`w-64 h-64 rounded-full border-8 border-white/20 flex flex-col items-center justify-center mb-10 transition-all duration-[4000ms] ease-in-out relative backdrop-blur-sm bg-white/5 ${breathPhase === 'inhale' || breathPhase === 'hold' ? 'scale-110 border-white/40' : 'scale-90'}`}>
                          <span className="text-4xl font-bold tracking-widest text-white drop-shadow-lg text-center leading-tight">{breathText}</span>
                      </div>
                      <button onClick={() => setBreathingActive(!breathingActive)} className="bg-white text-slate-800 px-12 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 text-lg">
                          {breathingActive ? <><i className="ph-fill ph-stop-circle text-red-500"></i> Stop</> : <><i className="ph-fill ph-play-circle text-green-500"></i> Start Session</>}
                      </button>
                  </div>

                  {/* 3. GRATITUDE JOURNAL (WRITE MODE) */}
                  <div className="lg:col-span-2 bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-[2rem] border border-orange-100">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-white text-orange-500 rounded-2xl shadow-sm flex items-center justify-center border border-orange-100 text-2xl"><i className="ph-fill ph-book-open-text"></i></div>
                          <div><h3 className="font-bold text-2xl text-orange-900">Gratitude Timeline</h3><p className="text-sm text-orange-800/60 font-medium">Capture the good moments.</p></div>
                      </div>
                      <div className="bg-white p-2 pl-6 rounded-2xl shadow-sm border border-orange-100 flex gap-4 mb-10 focus-within:ring-4 focus-within:ring-orange-100 transition-all items-center">
                          <i className="ph-bold ph-pencil-simple text-orange-300 text-xl"></i>
                          <textarea value={gratitudeInput} onChange={e => setGratitudeInput(e.target.value)} placeholder="What made you smile today?" rows="1" className="flex-1 py-4 bg-transparent border-none outline-none text-slate-700 resize-none placeholder:text-slate-400 font-medium text-lg"></textarea>
                          <button onClick={saveGratitude} className="bg-gradient-to-br from-orange-400 to-amber-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition shrink-0"><i className="ph-bold ph-paper-plane-right text-xl"></i></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {wellnessLogs.filter(l => l.type === 'gratitude').slice(0, 3).map(l => (
                              <div key={l.id} className="bg-white p-6 rounded-3xl border border-orange-100/50 shadow-sm flex flex-col justify-between min-h-[140px]">
                                  <div><i className="ph-fill ph-quotes text-orange-200 text-3xl mb-2 block"></i><p className="text-slate-700 font-medium line-clamp-3">{l.text}</p></div>
                                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50"><span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{l.date}</span></div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

export default EmotionalWellnessTab;