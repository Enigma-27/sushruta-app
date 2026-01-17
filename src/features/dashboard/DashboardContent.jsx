import React, { useState, useEffect } from 'react';
import VitalsCard from './VitalsCard';
import SosButton from './SosButton';
import ManualEntryModal from '../../components/ui/ManualEntryModal';
import NotificationAlert from '../../components/ui/NotificationAlert';
import ChartModal from '../../components/charts/ChartModal';
import HealthScoreRing from '../../components/charts/HealthScoreRing'; 
import { MockBackend } from '../../services/mockBackend';

// --- NEW COMPONENT: HEALTH SCORE CARD ---
const HealthScoreCard = ({ data, refreshData, onShowHistory, setLiveScore, userRole }) => {
    const [score, setScore] = useState(0);
    const [breakdown, setBreakdown] = useState({});
    
    // Role Logic for Score Card
    const role = (userRole || '').toLowerCase();
    const isDoctor = role === 'doctor';

    // THE CORE SCORE ALGORITHM
    useEffect(() => {
        let tempScore = 0;
        let log = {};

        // 1. Medicine Adherence (30 Points)
        const dailyMeds = data.meds.filter(m => m.category === 'Daily Routine');
        if (dailyMeds.length > 0) {
            const taken = dailyMeds.filter(m => m.taken).length;
            const medScore = (taken / dailyMeds.length) * 30;
            tempScore += medScore;
            log.meds = { val: `${taken}/${dailyMeds.length}`, pts: medScore.toFixed(0) };
        } else {
            tempScore += 30;
            log.meds = { val: "N/A", pts: 30 };
        }

        // 2. Blood Pressure (20 Points)
        const [sys, dia] = data.vitals.bp.split('/').map(Number);
        let bpPoints = 20;
        if (sys > 140 || dia > 90) bpPoints = 5; 
        else if (sys > 130 || dia > 80) bpPoints = 10;
        else if (sys > 120) bpPoints = 15;
        tempScore += bpPoints;
        log.bp = { val: data.vitals.bp, pts: bpPoints };

        // 3. Heart Rate (10 Points)
        const hr = data.vitals.heartRate;
        let hrPoints = (hr >= 60 && hr <= 100) ? 10 : 5;
        tempScore += hrPoints;
        log.hr = { val: hr, pts: hrPoints };

        // 4. Sleep (15 Points)
        let sleepVal = (typeof data.vitals.sleep === 'object') ? data.vitals.sleep.value : parseFloat(data.vitals.sleep) || 0;
        let sleepPoints = (sleepVal >= 7) ? 15 : (sleepVal >= 5 ? 8 : 2);
        tempScore += sleepPoints;
        log.sleep = { val: sleepVal.toFixed(1) + 'h', pts: sleepPoints };

        // 5. Steps (15 Points)
        const steps = data.vitals.steps;
        let stepPoints = (steps > 5000) ? 15 : (steps > 2000 ? 8 : 2);
        tempScore += stepPoints;
        log.steps = { val: steps, pts: stepPoints };

        // 6. Exercise (10 Points)
        if (data.vitals.exercise) {
            tempScore += 10;
            log.ex = { val: "Yes", pts: 10 };
        } else {
            log.ex = { val: "No", pts: 0 };
        }

        const finalScore = Math.round(tempScore);
        setScore(finalScore);
        setBreakdown(log);
        if (setLiveScore) setLiveScore(finalScore);
    }, [data]);

    const toggleExercise = () => {
        const newData = {...data};
        newData.vitals.exercise = !newData.vitals.exercise;
        MockBackend.updateData(newData);
        refreshData();
    };

    const vitalsTotal = (parseInt(breakdown.bp?.pts||0) + parseInt(breakdown.hr?.pts||0));
    const sleepActivityTotal = (parseInt(breakdown.sleep?.pts||0) + parseInt(breakdown.steps?.pts||0));

    return (
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden relative p-6 border border-slate-100">
            
            {/* Background Decoration */}
            <div className="absolute -top-5 -right-5 w-36 h-36 opacity-5 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-blue-900">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
            </div>

            {/* Header */}
            <div className="mb-6 relative z-10">
                <div className="text-xl text-blue-900 font-bold flex flex-col gap-1">
                    Daily Health Score
                    <span className="text-sm text-slate-500 font-normal">As per WHO</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                
                {/* Left: Circular UI with /100 label */}
                <div 
                    className="flex-none flex flex-col items-center justify-center w-40 cursor-pointer group"
                    onClick={onShowHistory}
                    title="Click to view Score History"
                >
                    <svg viewBox="0 0 36 36" className="circular-chart transition transform group-hover:scale-105">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path 
                            className="circle" 
                            stroke={score < 50 ? '#ef4444' : score < 80 ? '#f59e0b' : '#10b981'} 
                            strokeDasharray={`${score}, 100`} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                        <text x="18" y="19" className="percentage">{score}</text>
                        <text x="18" y="24" className="text-[3px] font-medium fill-slate-400" textAnchor="middle">/ 100</text>
                    </svg>

                    <div className="-mt-4 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm z-20 flex items-center gap-1 group-hover:bg-emerald-100 transition">
                        DAILY SCORE <i className="ph-bold ph-chart-line-up"></i>
                    </div>
                </div>

                {/* Right: Metrics Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    {/* Meds */}
                    <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center transition hover:-translate-y-1 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200">
                        <div>
                            <h4 className="text-xs text-slate-500 mb-1">Meds Taken</h4>
                            <div className="text-base font-bold text-emerald-500">{breakdown.meds?.pts || 0}/30</div>
                        </div>
                    </div>

                    {/* Vitals */}
                    <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center transition hover:-translate-y-1 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200">
                        <div>
                            <h4 className="text-xs text-slate-500 mb-1">Vitals (BP/HR)</h4>
                            <div className="text-base font-bold text-blue-500">{vitalsTotal}/30</div>
                        </div>
                    </div>

                    {/* Sleep */}
                    <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center transition hover:-translate-y-1 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200">
                        <div>
                            <h4 className="text-xs text-slate-500 mb-1">Sleep & Activity</h4>
                            <div className="text-base font-bold text-purple-500">{sleepActivityTotal}/30</div>
                        </div>
                    </div>

                    {/* Exercise */}
                    <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center transition hover:-translate-y-1 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200">
                        <div>
                            <h4 className="text-xs text-slate-500 mb-1">Exercise</h4>
                            <div className="text-base font-bold text-orange-500">{breakdown.ex?.pts || 0}/10</div>
                        </div>
                    </div>
                </div>
            </div>
                 
            {/* Footer Banner - HIDDEN FOR DOCTOR */}
            {!isDoctor && (
                <div 
                    onClick={toggleExercise} 
                    className={`mt-6 rounded-lg p-3 text-center text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition select-none 
                        ${data.vitals.exercise ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                    `}
                >
                    <i className={`ph-fill ${data.vitals.exercise ? 'ph-check-circle' : 'ph-circle'}`}></i>
                    {data.vitals.exercise ? 'Exercise Recorded' : 'Mark Exercise as Done'}
                </div>
            )}
        </div>
    );
};

const DashboardContent = ({ data, refreshData, user, setTab }) => {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [sosStep, setSosStep] = useState(0);
  const [editingMetric, setEditingMetric] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  
  // Role Logic
  const userRole = user?.role?.toLowerCase() || 'senior';
  const isDoctor = userRole === 'doctor';
  const isCareTeam = ['doctor', 'caretaker'].includes(userRole);

  // Live Data State
  const [liveSteps, setLiveSteps] = useState(data.vitals.steps);
  const [liveHeart, setLiveHeart] = useState(data.vitals.heartRate);
  const [liveBP, setLiveBP] = useState(data.vitals.bp);
  const [liveSleep, setLiveSleep] = useState(data.vitals.sleep);

  // 1. Sync State on Data Change
  useEffect(() => {
    setLiveSteps(data.vitals.steps);
    setLiveHeart(data.vitals.heartRate);
    setLiveBP(data.vitals.bp);
    setLiveSleep(data.vitals.sleep);
  }, [data]);

  // 2. Mock Alert Logic
  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; 
        const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
        const found = data.reminders.find(r => r.day === now.getDate() && r.time === formattedTime && !r.completed && !r.notified);
        if (found) setActiveAlert(found);
    }, 5000); 
    return () => clearInterval(interval);
  }, [data]);

  // 3. Live Watch Simulation
  useEffect(() => {
    let interval;
    if(connected) {
        interval = setInterval(() => {
            setLiveSteps(prev => {
                const newVal = Number(prev) + Math.floor(Math.random() * 3);
                // Update DB implicitly for persistence
                const current = MockBackend.getData();
                current.vitals.steps = newVal;
                MockBackend.updateData(current);
                return newVal;
            });
            setLiveHeart(() => 70 + Math.floor(Math.random() * 5));
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [connected]);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => { setConnected(true); setSyncing(false); refreshData(); }, 1500);
  };

  const handleSOS = () => {
    if (sosStep === 0) { 
        setSosStep(1); 
        setTimeout(() => setSosStep(0), 3000); 
    } else { 
        alert(`🚨 SOS ALERT SENT TO ALL CONTACTS!`);
        setSosStep(0); 
    }
  };

  const handleSaveManual = (val) => {
    if(val && editingMetric) {
        const newData = {...data};
        let key = '';
        let finalVal = val;
        let graphVal = parseInt(val, 10); 

        if(editingMetric.includes('Steps')) key = 'steps';
        else if(editingMetric.includes('BP')) { key = 'bp'; graphVal = parseInt(val.split('/')[0]); finalVal = val; }
        else if(editingMetric.includes('Sleep')) { key = 'sleep'; finalVal = val.display; graphVal = val.value; }
        else if(editingMetric.includes('Heart')) key = 'heartRate';

        if(key) {
            if(key === 'heartRate') newData.vitals.heartRate = graphVal;
            else if(key === 'steps') newData.vitals.steps = graphVal;
            else newData.vitals[key] = finalVal;
            
            MockBackend.updateData(newData);
            refreshData();
        }
        setEditingMetric(null);
    }
  };

  const completeReminder = () => {
    if(!activeAlert) return;
    const newReminders = data.reminders.map(r => r.id === activeAlert.id ? { ...r, completed: true } : r);
    MockBackend.updateData({ ...data, reminders: newReminders });
    refreshData();
    setActiveAlert(null);
  };

  // Helper to get historic array for charts
  const getHistoryArray = (metric) => {
    if (metric === 'Steps') return data.history.steps;
    if (metric === 'Heart Rate') return data.history.heart;
    if (metric === 'BP') return data.history.bp;
    if (metric === 'Sleep') return data.history.sleep;
    return [];
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
      {/* Modals */}
      {editingMetric && <ManualEntryModal metric={editingMetric} onClose={() => setEditingMetric(null)} onSave={handleSaveManual} />}
      {activeAlert && <NotificationAlert reminder={activeAlert} onComplete={completeReminder} onClose={() => setActiveAlert(null)} />}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Namaste, {user.name.split(' ')[0]} 🙏</h1>
          <p className="text-sm md:text-base text-slate-500">Here's your health summary.</p>
        </div>
        
        {/* Connect Watch Button */}
        {!isCareTeam && (
          <button 
            onClick={handleSync} 
            className={`shrink-0 flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-2.5 rounded-full font-bold shadow-md transition-all ${connected ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700'} ${syncing ? 'animate-pulse' : ''}`}
          >
            <i className={`ph-bold ${connected ? 'ph-bluetooth-connected' : 'ph-bluetooth'} text-xl`}></i> 
            <span className="hidden md:inline">{syncing ? 'Syncing...' : connected ? 'Live Sync On' : 'Connect Watch'}</span>
          </button>
        )}
      </div>

      {/* SOS Button Component */}
      <SosButton isCareTeam={isCareTeam} sosStep={sosStep} handleSOS={handleSOS} user={user} />

      {/* --- ADDED HEALTH SCORE CARD HERE --- */}
      <HealthScoreCard 
        data={data} 
        refreshData={refreshData} 
        userRole={userRole} 
        onShowHistory={() => setSelectedMetric('Health Score')} // Simple handler
      />

      {/* Grid of Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VitalsCard 
          title="Daily Steps" value={liveSteps} subtitle="Daily Steps" icon="ph-sneaker-move" color="teal" 
          progress={(liveSteps / data.vitals.target) * 100}
          onClick={() => setSelectedMetric('Steps')}
          onAddClick={() => setEditingMetric('Daily Steps')}
          isDoctor={isDoctor}
        />
        <VitalsCard 
          title="Heart Rate" value={liveHeart} unit="bpm" subtitle="Heart Rate" icon="ph-heartbeat" color="red"
          onClick={() => setSelectedMetric('Heart Rate')}
          onAddClick={() => setEditingMetric('Heart Rate')}
          isDoctor={isDoctor}
        />
        <VitalsCard 
          title="Blood Pressure" value={liveBP} subtitle="Blood Pressure" icon="ph-drop" color="blue"
          onClick={() => setSelectedMetric('BP')}
          onAddClick={() => setEditingMetric('BP')}
          isDoctor={isDoctor}
        />
        <VitalsCard 
          title="Sleep" 
          value={typeof liveSleep === 'object' ? liveSleep.display : liveSleep} 
          unit={typeof liveSleep !== 'object' ? 'h' : ''}
          subtitle="Sleep Duration" icon="ph-moon-stars" color="purple"
          onClick={() => setSelectedMetric('Sleep')}
          onAddClick={() => setEditingMetric('Sleep Duration')}
          isDoctor={isDoctor}
        />
      </div>

      {/* Chart Modal (If metric selected) */}
      {selectedMetric && (
        <ChartModal 
            type={selectedMetric} 
            history={getHistoryArray(selectedMetric)} 
            currentVal={
                selectedMetric === 'Steps' ? liveSteps : 
                selectedMetric === 'Heart Rate' ? liveHeart : 
                0 // Simplified for brevity
            } 
            close={() => setSelectedMetric(null)} 
        />
      )}
    </div>
  );
};

export default DashboardContent;