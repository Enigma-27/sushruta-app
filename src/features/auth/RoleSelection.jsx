import React from 'react';

const RoleSelection = ({ setView, setRole }) => {
  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => setView('login')} 
        className="mb-4 text-slate-400 hover:text-blue-900 flex items-center gap-1 transition-colors"
      >
        <i className="ph-bold ph-arrow-left"></i> Back
      </button>
      
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Choose your Profile</h2>
      
      <div className="grid gap-4">
        {/* Senior Button */}
        <button 
          onClick={() => { setRole('senior'); setView('signup-form'); }} 
          className="group flex items-center p-4 border border-slate-200 rounded-2xl hover:border-blue-900 hover:bg-blue-50 transition-all text-left shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
            <i className="ph-fill ph-user"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">Senior Citizen</h3>
            <p className="text-sm text-slate-500">I want to manage my health & connect.</p>
          </div>
        </button>

        {/* Caretaker Button */}
        <button 
          onClick={() => { setRole('caretaker'); setView('signup-form'); }} 
          className="group flex items-center p-4 border border-slate-200 rounded-2xl hover:border-green-600 hover:bg-green-50 transition-all text-left shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <i className="ph-fill ph-heart text-red-600"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">Caretaker</h3>
            <p className="text-sm text-slate-500">I am looking after a senior member.</p>
          </div>
        </button>

        {/* Doctor Button */}
        <button 
          onClick={() => { setRole('doctor'); setView('signup-form'); }} 
          className="group flex items-center p-4 border border-slate-200 rounded-2xl hover:border-purple-600 hover:bg-purple-50 transition-all text-left shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <i className="ph-fill ph-stethoscope"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">Doctor</h3>
            <p className="text-sm text-slate-500">I am a medical professional.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;