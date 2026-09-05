import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/ui/LanguageSelector';

const Sidebar = ({ activeTab, setTab, onLogout, user, isOpen, closeMenu, serverStatus }) => {
  const { t } = useLanguage();
  const LOGO_SRC = "https://image2url.com/images/1765805243191-d5f3a19d-770b-41d8-94c1-33d7216f45f0.png";

  // Mobile vs Desktop Classes
  const classes = isOpen
    ? "absolute inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-2xl transform translate-x-0 transition-transform duration-300"
    : "absolute inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-xl transform -translate-x-full transition-transform duration-300 md:static md:translate-x-0";

  // Navigation Items Config with dynamic translations
  const navItems = [
    { id: 'home', icon: 'ph-squares-four', label: t('navDashboard') },
    { id: 'assistant', icon: 'ph-robot', label: t('navAssistant') },
    { id: 'gps', icon: 'ph-map-pin', label: t('navGPS') },
    { id: 'meds', icon: 'ph-pill', label: t('navMeds') },
    { id: 'wellness', icon: 'ph-plant', label: t('navWellness') },
    { id: 'joy', icon: 'ph-heart', label: t('navJoy') },
    { id: 'reports', icon: 'ph-chart-bar', label: t('navReports') },
    { id: 'appointments', icon: 'ph-stethoscope', label: user?.role === 'doctor' ? t('navPatientRequests') : t('navAppointments') },
    { id: 'insurance', icon: 'ph-shield-check', label: t('navInsurance') },
    { id: 'shop', icon: 'ph-shopping-cart', label: t('navShop') },
    { id: 'gov', icon: 'ph-bank', label: t('navGov') },
    { id: 'profile', icon: 'ph-user-circle', label: t('navProfile') }
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
        <div className="p-5 border-b flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xl tracking-tight">
              <img src={LOGO_SRC} alt="Logo" className="w-9 h-9 rounded-full object-cover" />
              SUSHRUTA
            </div>
            <button onClick={closeMenu} className="md:hidden text-slate-400">
              <i className="ph-bold ph-x text-xl"></i>
            </button>
          </div>
          {serverStatus && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <span className={`w-2 h-2 rounded-full ${serverStatus.online ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              {serverStatus.online ? 'Cloud Synchronized' : 'Local Storage Mode'}
            </div>
          )}
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

        {/* Language Selection Section */}
        <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">भाषा / Lang:</span>
          <LanguageSelector />
        </div>

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