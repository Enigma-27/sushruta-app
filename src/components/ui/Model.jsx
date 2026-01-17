import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // If the modal is not open, render nothing
  if (!isOpen) return null;

  return (
    // 1. Overlay: Fixed, full screen, semi-transparent black background with blur
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      
      {/* 2. Modal Card: White container that slides up */}
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative animate-slide-up shadow-2xl">
        
        {/* Header: Optional Title and Close Button */}
        <div className="flex justify-between items-center mb-4">
          {title ? (
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          ) : (
            /* Spacer to keep close button on the right if no title */
            <span></span> 
          )}
          
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            <i className="ph-bold ph-x text-xl"></i>
          </button>
        </div>

        {/* 3. Content: This is where specific forms/charts will be injected */}
        <div>
            {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;