import React, { useState } from 'react';
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const LoginView = ({ onLogin, setView, loading, setLoading, showToast }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoOption, setShowDemoOption] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowDemoOption(false);
    setLoading(true);

    try {
      const user = await login(phone.trim(), password);
      if (showToast) showToast('Welcome back, ' + (user.name || 'User') + '!', 'success');
      onLogin(user);
      navigate('/');
    } catch (err) {
      console.warn('Login attempt:', err.message);
      setError(err.message || 'Login failed');
      setShowDemoOption(true);
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoRole, name, defaultPhone) => {
    const demoUser = {
      _id: 'demo_' + demoRole,
      name: name,
      phone: defaultPhone,
      role: demoRole,
      token: 'demo_token_' + demoRole,
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    sessionStorage.setItem('activeUser', JSON.stringify(demoUser));
    if (showToast) showToast(`Signed in as ${name} (${demoRole})`, 'success');
    onLogin(demoUser);
    navigate('/');
  };

  return (
    <div className="animate-fade-in max-w-sm mx-auto w-full">
      <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h2>
      <p className="text-slate-500 mb-6 text-sm">Access your health dashboard</p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm text-center border border-red-200">
          <p className="font-medium">{error}</p>
          {showDemoOption && (
            <button
              type="button"
              onClick={() => handleQuickLogin('senior', 'Rohan Sharma', phone || '9876543210')}
              className="mt-2 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Continue in Local Demo Mode
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {/* Phone Input */}
        <div className="relative">
          <i className="ph-bold ph-phone absolute left-3 top-3.5 text-slate-400"></i>
          <input
            name="loginPhone"
            type="tel"
            placeholder="Mobile Number"
            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* PIN/Password Input */}
        <div className="relative">
          <i className="ph-bold ph-lock-key absolute left-3 top-3.5 text-slate-400"></i>
          <input
            name="loginPin"
            type="password"
            placeholder="Password"
            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition flex justify-center cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Quick Demo Access Badges */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs text-center text-slate-400 font-semibold uppercase tracking-wider mb-2">
          One-Click Demo Access
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('senior', 'Rohan Sharma', '9876543210')}
            className="p-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 transition text-center"
          >
            👴 Senior
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('caretaker', 'Priya Sharma', '9876543211')}
            className="p-2 text-xs font-semibold rounded-lg bg-green-50 text-green-800 hover:bg-green-100 transition text-center"
          >
            💚 Caretaker
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('doctor', 'Dr. A. Verma', '9876543212')}
            className="p-2 text-xs font-semibold rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 transition text-center"
          >
            🩺 Doctor
          </button>
        </div>
      </div>

      {/* Switch to Signup */}
      <p className="text-center mt-6 text-slate-500 text-sm">
        New to Sushruta?{' '}
        <button
          onClick={() => setView('role-select')}
          className="text-blue-900 font-bold hover:underline cursor-pointer"
        >
          Create Account
        </button>
      </p>
    </div>
  );
};

export default LoginView;