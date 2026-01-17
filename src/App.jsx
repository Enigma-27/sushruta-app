import React, { useState, useEffect } from 'react';

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
import Loader from './components/ui/Loader';
import Toast from './components/ui/Toast';

// --- STYLES ---
import './styles/index.css';
import './styles/animations.css';

const App = () => {
  // --- GLOBAL STATE ---
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // --- UI STATE ---
  const [sideOpen, setSideOpen] = useState(false);  // Mobile Sidebar
  const [rightOpen, setRightOpen] = useState(false); // Schedule Panel

  // --- INITIAL LOAD ---
  useEffect(() => {
    // 1. Simulate fetching data from backend
    const loadData = () => {
      const dbData = MockBackend.getData();
      if (dbData) {
        setData(dbData);
      } else {
        // If DB is empty/corrupt, re-init it
        MockBackend.initDB();
        setData(MockBackend.getData());
      }
      setLoading(false);
    };

    // Artificial delay for splash screen feel
    setTimeout(loadData, 1000);
  }, []);

  // --- ACTIONS ---

  // 1. Refresh Data (Passed to children to trigger re-renders after updates)
  const refreshData = () => {
    const updated = MockBackend.getData();
    setData(updated);
  };

  // 2. Login Handler
  const handleLogin = (loggedInUser) => {
    AuthService.login(loggedInUser);
    
    // If the logged-in user is NOT the generic 'user' in DB, update DB user profile
    // This allows syncing the login form data to the main dashboard
    MockBackend.saveUser(loggedInUser);
    
    setUser(loggedInUser);
    refreshData();
  };

  // 3. Logout Handler
  const handleLogout = () => {
    if(confirm("Are you sure you want to logout?")) {
      AuthService.logout();
      setUser(null);
      setActiveTab('home');
    }
  };

  // 4. Reminder Actions (For Right Panel)
  const addReminder = (text, time, day) => {
    const newRem = { id: Date.now(), text, time, day: parseInt(day), completed: false, notified: false };
    const newData = { ...data, reminders: [...data.reminders, newRem] };
    MockBackend.updateData(newData);
    refreshData();
  };

  const deleteReminder = (id) => {
    const newData = { ...data, reminders: data.reminders.filter(r => r.id !== id) };
    MockBackend.updateData(newData);
    refreshData();
  };

  // --- CONTENT SWITCHER ---
  const renderContent = () => {
    if (!data) return <div className="p-10 text-center text-slate-400">Error loading data.</div>;

    switch (activeTab) {
      case 'home': 
        return <DashboardContent data={data} refreshData={refreshData} user={user} setTab={setActiveTab} />;
      case 'meds': 
        return <MedicineTab data={data} refreshData={refreshData} userRole={user.role} />;
      case 'profile': 
        return <ProfileTab data={data} refreshData={refreshData} userRole={user.role} />;
      case 'insurance': 
        return <InsuranceTab data={data} refreshData={refreshData} />;
      case 'reports': 
        return <ReportsTab data={data} refreshData={refreshData} />;
      case 'gps': 
        return <GPSModule />;
      case 'wellness': 
        return <WellnessTab data={data} refreshData={refreshData} userRole={user.role} />;
      case 'joy': 
        return <EmotionalWellnessTab data={data} refreshData={refreshData} userRole={user.role} />;
      case 'appointments': 
        return <AppointmentsTab data={data} user={user} refreshData={refreshData} />;
      case 'gov': 
        return <GovernmentSchemesTab />;
      case 'assistant': 
        return <AiAssistantTab />;
      case 'shop': 
        return <MedicineShopTab />;
      default: 
        return <DashboardContent data={data} refreshData={refreshData} user={user} />;
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
    return <AuthContainer onLogin={handleLogin} />;
  }

  // --- RENDER: MAIN APP LAYOUT ---
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      
      {/* 1. LEFT SIDEBAR (Navigation) */}
      <Sidebar 
        activeTab={activeTab} 
        setTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user}
        isOpen={sideOpen}
        closeMenu={() => setSideOpen(false)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header (Hamburger) */}
        <Header 
          setSideOpen={setSideOpen} 
          setRightOpen={setRightOpen} 
        />

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