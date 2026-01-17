import React from 'react';

const SosButton = ({ isCareTeam, sosStep, handleSOS, user }) => {
  // 1. Caretaker/Doctor View: Show Green Status Card
  if (isCareTeam) {
    return (
      <div className="p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm border border-slate-200 bg-white mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full shadow-sm shrink-0">
            <i className="ph-fill ph-shield-check text-3xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 leading-tight">Patient Safety Status</h3>
            <p className="text-slate-500 text-sm">
              Currently monitoring <span className="font-bold text-slate-700">{user.name || 'Senior'}</span>. No active alerts.
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wider">
            Last Update: Just now
          </span>
        </div>
      </div>
    );
  }

  // 2. Senior View: Red Panic Button
  return (
    <div className={`p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-lg transition-all duration-300 bg-gradient-to-r from-red-500 to-red-700 text-white animate-pulse-slow mb-6`}>
      <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
        <div className="bg-white text-red-600 p-3 rounded-full shadow-lg shrink-0">
          <i className="ph-fill ph-siren text-3xl"></i>
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">
            {sosStep === 1 ? 'CONFIRM EMERGENCY?' : 'SOS EMERGENCY'}
          </h3>
          <p className="text-white/80 text-sm">
            {sosStep === 1 ? 'Tap again immediately to alert contacts' : `Press in case of immediate assistance`}
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleSOS} 
        className={`w-full md:w-auto ${sosStep === 1 ? 'bg-white text-red-700 animate-bounce' : 'bg-white text-red-600'} px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-50 transition uppercase tracking-wider`}
      >
        {sosStep === 1 ? 'YES, ALERT!' : 'ALERT'}
      </button>
    </div>
  );
};

export default SosButton;