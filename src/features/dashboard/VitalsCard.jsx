import React from 'react';

const VitalsCard = ({ title, value, unit, subtitle, icon, color, progress, onClick, onAddClick, isDoctor }) => {
  
  // Tailwind Color Maps
  const colors = {
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   bar: 'bg-teal-500' },
    red:    { bg: 'bg-red-50',    text: 'text-red-600',    bar: 'bg-red-500' },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   bar: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
  };

  const theme = colors[color] || colors.blue;

  return (
    <div 
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-md relative group cursor-pointer animate-slide-up" 
      onClick={onClick}
    >
      {/* Quick Add Button (Hidden for Doctors) */}
      {!isDoctor && onAddClick && (
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddClick(); }} 
            className="text-slate-300 hover:text-blue-600 p-1 transition-colors"
          >
            <i className="ph-bold ph-plus-circle text-2xl"></i>
          </button>
        </div>
      )}
      
      {/* Icon Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
          <i className={`ph-fill ${icon} text-2xl`}></i>
        </div>
      </div>
      
      {/* Main Value */}
      <h3 className="text-4xl font-bold text-slate-800">
        {value} <span className="text-lg text-slate-400 font-medium">{unit}</span>
      </h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>
      
      {/* Progress Bar (Optional) */}
      {progress !== undefined && (
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div 
            className={`${theme.bar} h-full rounded-full transition-all duration-1000`} 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default VitalsCard;