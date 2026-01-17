import React from 'react';

const Header = ({ setSideOpen, setRightOpen }) => {
  const LOGO_SRC = "https://image2url.com/images/1766163568484-919924f6-d48d-4888-8754-e489e0c9e000.png";

  return (
    <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20 relative">
      {/* Left: Open Sidebar */}
      <button onClick={() => setSideOpen(true)} className="text-slate-600 p-2">
        <i className="ph-bold ph-list text-2xl"></i>
      </button>

      {/* Center: Logo */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4">
        <span className="font-bold text-blue-900 flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={LOGO_SRC}
              alt="Sushruta Logo"
              className="w-8 h-8 rounded-full object-contain"
            />
          </div>
          <span className="tracking-tight">SUSHRUTA</span>
        </span>
      </div>

      {/* Right: Open Schedule (Calendar) */}
      <button onClick={() => setRightOpen(true)} className="text-slate-600 p-2 relative">
        <i className="ph-bold ph-calendar-blank text-2xl"></i>
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </header>
  );
};

export default Header;