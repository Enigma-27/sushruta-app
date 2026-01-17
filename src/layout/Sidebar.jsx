import React from 'react';

const Sidebar = ({ activeTab, setTab, onLogout, user, isOpen, closeMenu }) => {
  const LOGO_SRC = "https://image2url.com/images/1765805243191-d5f3a19d-770b-41d8-94c1-33d7216f45f0.png";

  // Mobile vs Desktop Classes
  const classes = isOpen
    ? "absolute inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-2xl transform translate-x-0 transition-transform duration-300"
    : "absolute inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-xl transform -translate-x-full transition-transform duration-300 md:static md:translate-x-0";

  // Navigation Items Config
  const navItems = [
    { id: 'home', icon: 'ph-squares-four', label: 'Dashboard' },
    { id: 'assistant', icon: 'ph-robot', label: 'AI Assistant' },
    { id: 'gps', icon: 'ph-map-pin', label: 'Live Location' },
    { id: 'meds', icon: 'ph-pill', label: 'Medicines' },
    { id: 'wellness', icon: 'ph-plant', label: 'Wellness & Diet' },
    { id: 'joy', icon: 'ph-heart', label: 'Emotional Wellbeing' },
    { id: 'reports', icon: 'ph-chart-bar', label: 'Reports' },
    { id: 'appointments', icon: 'ph-stethoscope', label: user?.role === 'doctor' ? 'Patient Requests' : 'Appointments' },
    { id: 'insurance', icon: 'ph-shield-check', label: 'Insurance' },
    { id: 'shop', icon: 'ph-shopping-cart', label: 'Buy Medicines' },
    { id: 'gov', icon: 'ph-bank', label: 'Govt. Schemes' },
    { id: 'profile', icon: 'ph-user-circle', label: 'My Profile' }
  ];

  // Filtering Logic based on User Role
  const filteredNav = navItems.filter(item => {
    // 1. Hide GPS from Seniors (Usually tracked by Caretaker)
    if (user?.role === 'senior' && item.id === 'gps') {
      return false;
    }
    
    // 2. Hide specific tabs from Doctors (They only need clinical info)
    if (user?.role === 'doctor') {
      const hiddenTabs = ['wellness', 'joy', 'insurance', 'shop', 'gov', 'gps'];
      return !hiddenTabs.includes(item.id);
    }
    
    return true;
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div onClick={closeMenu} className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"></div>}
      
      <aside className={classes + " flex flex-col h-full"}>
        {/* Sidebar Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xl tracking-tight">
            <img src={LOGO_SRC} alt="Logo" className="w-10 h-10 rounded-full" />
            SUSHRUTA
          </div>
          <button onClick={closeMenu} className="md:hidden text-slate-400">
            <i className="ph-bold ph-x text-xl"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNav.map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); closeMenu(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <i className={`ph-fill ${item.icon} text-xl`}></i> {item.label}
            </button>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t bg-slate-50 flex items-center gap-3">
          <img 
            src={user?.photo || "https://ui-avatars.com/api/?name=" + user?.name} 
            className="w-10 h-10 rounded-full border border-white shadow-sm object-cover" 
            alt="Profile" 
          />
          <div className="flex-1 cursor-pointer overflow-hidden" onClick={() => { setTab('profile'); closeMenu(); }}>
            <p className="text-sm font-bold text-slate-700 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button onClick={onLogout} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50" title="Logout">
            <i className="ph-bold ph-sign-out text-xl"></i>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;