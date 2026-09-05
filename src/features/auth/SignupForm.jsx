import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';
import { User, Phone, Lock, ChevronRight, Activity, ArrowLeft } from 'lucide-react';

const SignupForm = ({ role = 'senior', setView, onLogin, showToast }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State initialized with selected role
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: role || 'senior'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const userPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role
    };

    try {
      // 2. Call Real API
      const response = await signup(userPayload);
      
      if (showToast) showToast('Account created successfully!', 'success');
      
      // 3. Update global App session
      if (onLogin) {
        onLogin(response);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.warn("Backend signup failed:", err.message);
      // Fallback: If backend is not available, allow local registration for demo/offline
      if (err.message.includes('fetch') || err.message.includes('Network') || err.message.includes('failed')) {
        const localUser = {
          _id: 'local_' + Date.now(),
          name: userPayload.name,
          phone: userPayload.phone,
          role: userPayload.role,
          token: 'local_token_' + Date.now()
        };
        localStorage.setItem('user', JSON.stringify(localUser));
        sessionStorage.setItem('activeUser', JSON.stringify(localUser));
        if (showToast) showToast('Account created (Local Mode)', 'success');
        if (onLogin) onLogin(localUser);
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
      {setView && (
        <button 
          onClick={() => setView('role-select')} 
          className="mb-4 text-slate-400 hover:text-blue-900 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Role Selection
        </button>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-sm">Join Sushruta to manage your health</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
          <Activity className="w-4 h-4 mr-2 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="relative">
          <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Phone Input */}
        <div className="relative">
          <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Role Selection Dropdown */}
        <div className="relative">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full pl-3 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 font-medium"
          >
            <option value="senior">Senior Citizen</option>
            <option value="caretaker">Caretaker</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Create Password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          {!loading && <ChevronRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button 
          type="button"
          onClick={() => {
            if (setView) setView('login');
            else navigate('/login');
          }} 
          className="text-blue-600 font-semibold cursor-pointer hover:underline"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default SignupForm;