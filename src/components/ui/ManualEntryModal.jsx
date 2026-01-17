import React, { useState } from 'react';

const ManualEntryModal = ({ metric, onClose, onSave }) => {
  // State for different types of inputs
  const [val, setVal] = useState('');
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [hrs, setHrs] = useState('');
  const [mins, setMins] = useState('');

  // Determine the type of metric being edited
  const isBP = metric.includes('Blood Pressure') || metric === 'BP';
  const isSleep = metric.includes('Sleep');
  const isSteps = metric.includes('Steps');
  const isHeart = metric.includes('Heart');

  // Logic to package the data correctly before saving
  const handleSave = () => {
    if (isBP) {
      if (sys && dia) onSave(`${sys}/${dia}`);
    } else if (isSleep) {
      if (hrs && mins) {
        // Sleep needs both a display string and a numeric value for graphs
        onSave({ 
          display: `${hrs}h ${mins}m`, 
          value: parseFloat(hrs) + parseFloat(mins) / 60 
        });
      }
    } else {
      // Standard numeric inputs (Steps, Heart Rate)
      onSave(val);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative animate-slide-up shadow-2xl">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <i className="ph-bold ph-x text-xl"></i>
        </button>

        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            {/* Dynamic Icon based on metric type */}
            <i className={`text-2xl ph-fill ${isSteps ? 'ph-sneaker-move' : isHeart ? 'ph-heartbeat' : isBP ? 'ph-drop' : 'ph-moon-stars'}`}></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Update {metric}</h3>
          <p className="text-slate-400 text-sm">Enter your latest reading</p>
        </div>

        {/* Dynamic Input Fields */}
        <div className="mb-6">
          {isBP ? (
            // Blood Pressure Input (SYS/DIA)
            <div className="flex items-center gap-2 justify-center">
              <div className="relative">
                <input type="number" placeholder="120" value={sys} onChange={e => setSys(e.target.value)} className="w-20 p-3 text-center text-xl font-bold bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 no-spinner" />
                <span className="block text-xs text-slate-400 text-center mt-1">SYS</span>
              </div>
              <span className="text-2xl text-slate-300">/</span>
              <div className="relative">
                <input type="number" placeholder="80" value={dia} onChange={e => setDia(e.target.value)} className="w-20 p-3 text-center text-xl font-bold bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 no-spinner" />
                <span className="block text-xs text-slate-400 text-center mt-1">DIA</span>
              </div>
              <span className="text-sm font-bold text-slate-500 ml-2">mmHg</span>
            </div>
          ) : isSleep ? (
            // Sleep Input (Hours & Minutes)
            <div className="flex items-center gap-3 justify-center">
              <div className="relative">
                <input type="number" placeholder="7" value={hrs} onChange={e => setHrs(e.target.value)} className="w-20 p-3 text-center text-xl font-bold bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 no-spinner" />
                <span className="absolute top-3.5 right-2 text-xs text-slate-400 font-bold">hr</span>
              </div>
              <div className="relative">
                <input type="number" placeholder="30" value={mins} onChange={e => setMins(e.target.value)} className="w-20 p-3 text-center text-xl font-bold bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 no-spinner" />
                <span className="absolute top-3.5 right-2 text-xs text-slate-400 font-bold">min</span>
              </div>
            </div>
          ) : (
            // Standard Single Value Input (Steps/Heart Rate)
            <div className="relative">
              <input
                type="number"
                autoFocus
                className="w-full p-4 text-center text-2xl font-bold bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 no-spinner"
                placeholder="0"
                value={val}
                onChange={(e) => setVal(e.target.value)}
              />
              <span className="absolute top-5 right-4 text-sm font-bold text-slate-400 uppercase">{isSteps ? 'steps' : 'bpm'}</span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-200 transition-all active:scale-95">
          Update Data
        </button>
      </div>
    </div>
  );
};

export default ManualEntryModal;