import React, { useState } from 'react';
import LoginView from './LoginView';
import RoleSelection from './RoleSelection';
import SignupForm from './SignupForm';
import OtpVerification from './OtpVerification';
import Toast from '../../components/ui/Toast';
import { DB } from '../../services/database'; // We will create this in the next step

const AuthContainer = ({ onLogin }) => {
  // State for managing the active view
  const [view, setView] = useState('login'); // 'login', 'role-select', 'signup-form', 'otp'
  const [role, setRole] = useState('senior'); // 'senior', 'caretaker', 'doctor'
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // Local toast state for Auth screen
  const [otp, setOtp] = useState('');
  const [genOtp, setGenOtp] = useState(null);

  // Images
  const AUTH_BG_IMAGE = "https://image2url.com/images/1765813364304-04cd83c9-8e5b-410b-a5d0-f4d31263c553.jpg";
  const LOGO_SRC = "https://image2url.com/images/1765805243191-d5f3a19d-770b-41d8-94c1-33d7216f45f0.png";

  const showToast = (msg, type) => {
    setToast({ msg, type });
    // Toast component handles self-closing, but we clear state here too
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat animate-fade-in"
      style={{
        backgroundImage: `url('${AUTH_BG_IMAGE}')`,
        backgroundColor: 'rgba(0,0,0,0.4)',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Toast Notification */}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] glass-card">

        {/* LEFT SIDE: Visuals & Branding */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-900 to-blue-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="z-10 text-center md:text-left">
            <div className="logo-container mb-6 flex justify-center">
              <img
                src={LOGO_SRC}
                alt="Sushruta Logo"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white/20 bg-white shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-4xl border-4 border-white/20 shadow-lg">S</div>';
                }}
              />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-center">SUSHRUTA</h1>
            <p className="text-blue-100 font-light tracking-wide text-center">Ancient Wisdom, Modern Care.</p>
          </div>

          <div className="z-10 mt-8 space-y-4 hidden md:block">
            <div className="flex items-center gap-3">
              <i className="ph-fill ph-shield-check text-2xl text-yellow-400"></i>
              <span className="text-sm opacity-90">Secure Health Data</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="ph-fill ph-heartbeat text-2xl text-yellow-400"></i>
              <span className="text-sm opacity-90">Real-time Vitals Monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="ph-fill ph-users-three text-2xl text-yellow-400"></i>
              <span className="text-sm opacity-90">Community & Doctor Connect</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Dynamic View Switching */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">

          {view === 'login' && (
            <LoginView
              onLogin={onLogin}
              setLoading={setLoading}
              loading={loading}
              showToast={showToast}
              setView={setView}
              handleInputChange={handleInputChange}
              formData={formData}
              DB={DB}
            />
          )}

          {view === 'role-select' && (
            <RoleSelection
              setView={setView}
              setRole={setRole}
            />
          )}

          {view === 'signup-form' && (
            <SignupForm
              role={role}
              setView={setView}
              handleInputChange={handleInputChange}
              loading={loading}
              setLoading={setLoading}
              showToast={showToast}
              formData={formData}
              setGenOtp={setGenOtp}
            />
          )}

          {view === 'otp' && (
            <OtpVerification
              otp={otp}
              setOtp={setOtp}
              genOtp={genOtp}
              formData={formData}
              role={role}
              DB={DB}
              showToast={showToast}
              setView={setView}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthContainer;