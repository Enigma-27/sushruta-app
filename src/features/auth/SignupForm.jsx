import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api'; // Import the new API
import { User, Phone, Lock, ChevronRight, Activity } from 'lucide-react';

const SignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'senior' // Default role
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

    try {
      // 2. Prepare data for Backend (exclude confirmPassword)
      const userPayload = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      };

      // 3. Call Real API
      const response = await signup(userPayload);
      
      console.log('Signup Successful:', response);
      
      // 4. Redirect to Dashboard
      navigate('/dashboard');

    } catch (err) {
      // Show backend error (e.g., "User already exists")
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500">Join Sushruta to manage your health</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          {error}
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
            placeholder="Phone Number"
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
              className="w-full pl-3 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-600"
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
            placeholder="Create Password"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          {!loading && <ChevronRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <span 
          onClick={() => navigate('/login')} 
          className="text-blue-600 font-semibold cursor-pointer hover:underline"
        >
          Log in
        </span>
      </div>
    </div>
  );
};

export default SignupForm;