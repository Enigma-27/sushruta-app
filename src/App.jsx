import React, { useState, useEffect, useCallback } from 'react';

// --- LAYOUTS ---
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import RightPanel from './layout/RightPanel';

// --- AUTH ---
import AuthContainer from './features/auth/AuthContainer';

// --- FEATURES ---
import DashboardContent from './features/dashboard/DashboardContent';
import MedicineTab from './features/medicine/MedicineTab';
import ProfileTab from './features/profile/ProfileTab';
import InsuranceTab from './features/records/InsuranceTab';
import ReportsTab from './features/records/ReportsTab';
import GPSModule from './features/gps/GPSModule';
import WellnessTab from './features/wellness/WellnessTab';
import EmotionalWellnessTab from './features/wellness/EmotionalWellnessTab';
import AppointmentsTab from './features/connect/AppointmentsTab';
import GovernmentSchemesTab from './features/resources/GovernmentSchemesTab';
import AiAssistantTab from './features/assistant/AiAssistantTab';
import MedicineShopTab from './features/shop/MedicineShopTab';

// --- SERVICES & UI ---
import { MockBackend } from './services/mockBackend';
import { AuthService } from './services/authService';
import { DataService } from './services/dataService';
import * as api from './services/api';
import Loader from './components/ui/Loader';
import Toast from './components/ui/Toast';

// --- STYLES ---
import './styles/index.css';
import './styles/animations.css';

const App = () => {
  // --- GLOBAL STATE ---
  const [user, setUser] = useState(() => api.getStoredUser() || AuthService.getCurrentUser());
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [serverStatus, setServerStatus] = useState({ online: false, database: 'disconnected' });

  // --- UI STATE ---
  const [sideOpen, setSideOpen] = useState(false);  // Mobile Sidebar
  const [rightOpen, setRightOpen] = useState(false); // Schedule Panel

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // --- INITIAL LOAD & SERVER HEALTH ---
  useEffect(() => {
    const unsub = DataService.subscribeStatus((status) => {
      setServerStatus(status);
    });

    const init = async () => {
      try {
        await DataService.checkHealth();
        const loadedData = await DataService.loadData();
        setData(loadedData);
      } catch (err) {
        console.error("Init load error:", err);
        MockBackend.initDB();
        setData(MockBackend.getData());
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => unsub();
  }, []);

  // --- ACTIONS ---

  // 1. Refresh Data
  const refreshData = async (overrideData) => {
    if (overrideData) {
      MockBackend.updateData(overrideData);
      setData(overrideData);
      return;
    }
    const updated = await DataService.loadData();
    setData(updated);
  };

  // 2. Login Handler
  const handleLogin = async (loggedInUser) => {
    AuthService.login(loggedInUser);
    setUser(loggedInUser);
    await DataService.saveUser(loggedInUser);
    const freshData = await DataService.loadData();
    setData(freshData);
    showToast(`Welcome, ${loggedInUser.name || 'User'}!`, 'success');
  };

  // 3. Logout Handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      api.logout();
      AuthService.logout();
      setUser(null);
      setActiveTab('home');
      showToast("Logged out successfully", "success");
    }
  };

  // 4. Reminder Actions (For Right Panel)
  const addReminder = async (text, time, day) => {
    const newRem = { text, time, day: parseInt(day), completed: false, notified: false };
    await DataService.addReminder(newRem);
    const updated = MockBackend.getData();
    setData(updated);
    showToast("Reminder added!", "success");
  };

  const deleteReminder = async (id) => {
    await DataService.deleteReminder(id);
    const updated = MockBackend.getData();
    setData(updated);
    showToast("Reminder removed", "success");
  };

  // --- CONTENT SWITCHER ---
  const renderContent = () => {
    if (!data) return <div className="p-10 text-center text-slate-400">Error loading health data.</div>;

    const role = user?.role || 'senior';

    switch (activeTab) {
      case 'home': 
        return <DashboardContent data={data} refreshData={refreshData} user={user} setTab={setActiveTab} showToast={showToast} />;
      case 'meds': 
        return <MedicineTab data={data} refreshData={refreshData} userRole={role} showToast={showToast} />;
      case 'profile': 
        return <ProfileTab data={data} refreshData={refreshData} userRole={role} user={user} showToast={showToast} />;
      case 'insurance': 
        return <InsuranceTab data={data} refreshData={refreshData} showToast={showToast} />;
      case 'reports': 
        return <ReportsTab data={data} refreshData={refreshData} showToast={showToast} />;
      case 'gps': 
        return <GPSModule />;
      case 'wellness': 
        return <WellnessTab data={data} refreshData={refreshData} userRole={role} showToast={showToast} />;
      case 'joy': 
        return <EmotionalWellnessTab data={data} refreshData={refreshData} userRole={role} showToast={showToast} />;
      case 'appointments': 
        return <AppointmentsTab data={data} user={user} refreshData={refreshData} showToast={showToast} />;
      case 'gov': 
        return <GovernmentSchemesTab />;
      case 'assistant': 
        return <AiAssistantTab />;
      case 'shop': 
        return <MedicineShopTab />;
      default: 
        return <DashboardContent data={data} refreshData={refreshData} user={user} setTab={setActiveTab} showToast={showToast} />;
    }
  };

  // --- RENDER: LOADING ---
  if (loading) {
    return (
      <div className="h-screen w-screen bg-blue-50 flex flex-col items-center justify-center gap-4">
        <Loader size="lg" color="blue" />
        <p className="text-blue-900 font-bold tracking-widest animate-pulse">STARTING SUSHRUTA...</p>
      </div>
    );
  }

  // --- RENDER: AUTH SCREEN ---
  if (!user) {
    return (
      <>
        <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
        <AuthContainer onLogin={handleLogin} />
      </>
    );
  }

  // --- RENDER: MAIN APP LAYOUT ---
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      
      {/* Toast Notification */}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      {/* 1. LEFT SIDEBAR (Navigation) */}
      <Sidebar 
        activeTab={activeTab} 
        setTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user}
        isOpen={sideOpen}
        closeMenu={() => setSideOpen(false)}
        serverStatus={serverStatus}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header (Hamburger) */}
        <Header 
          setSideOpen={setSideOpen} 
          setRightOpen={setRightOpen} 
        />

        {/* Desktop Connectivity Bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-2 bg-white/70 backdrop-blur-sm border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-semibold text-slate-700">Active User:</span> {user.name || 'User'} ({user.role})
          </div>
          <div className="flex items-center gap-2">
            {serverStatus.online ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Backend Online {serverStatus.database === 'connected' ? '(MongoDB Synced)' : '(Local DB Ready)'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200" title="Backend server offline - running with local browser storage">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Local Offline Mode
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto custom-scroll relative">
           {renderContent()}
        </main>

      </div>

      {/* 3. RIGHT PANEL (Schedule/Reminders) */}
      <RightPanel 
        reminders={data?.reminders} 
        isOpen={rightOpen} 
        closeMenu={() => setRightOpen(false)}
        onAddReminder={addReminder}
        onDeleteReminder={deleteReminder}
      />
      
    </div>
  );
};

export default App;