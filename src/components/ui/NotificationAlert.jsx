import React from 'react';

const NotificationAlert = ({ reminder, onComplete, onClose }) => {
  // If there is no active reminder passed prop, render nothing
  if (!reminder) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      
      {/* Alert Card */}
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative animate-slide-up shadow-2xl border-t-8 border-blue-500 text-center">
        
        {/* Animated Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
          <i className="ph-fill ph-alarm text-3xl animate-bounce"></i>
        </div>

        {/* Text Content */}
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Time for {reminder.text}!</h3>
        <p className="text-slate-500 mb-6">It's {reminder.time}. Have you completed this task?</p>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={onComplete}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="ph-bold ph-check"></i> Yes, Mark Complete
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Snooze / Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationAlert;