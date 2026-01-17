import React from 'react';

const OtpVerification = ({ otp, setOtp, genOtp, formData, role, DB, showToast, setView }) => {

  const verifyOtp = (e) => {
    e.preventDefault();
    if (parseInt(otp) === genOtp) {
      // 1. Fetch existing users
      const users = DB.get('users') || [];
      
      // 2. Create new user object with an empty meds array
      const newUser = { ...formData, role: role, meds: [] };
      
      // 3. Save to Local Storage
      users.push(newUser);
      DB.save('users', users);
      
      showToast('Registration Successful!', 'success');
      
      // 4. Redirect to Login Screen
      setView('login');
    } else {
      showToast('Invalid OTP', 'error');
    }
  };

  return (
    <div className="animate-fade-in text-center max-w-sm mx-auto">
      <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
        <i className="ph-fill ph-lock-key-open"></i>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Mobile</h2>
      <p className="text-slate-500 mb-6">Enter the code sent to your mobile</p>
      
      <form onSubmit={verifyOtp}>
        <input
          type="number"
          autoFocus
          className="w-full p-4 text-center text-3xl font-bold tracking-[0.5em] border-2 border-blue-200 rounded-xl focus:border-blue-900 outline-none mb-6"
          onChange={(e) => setOtp(e.target.value)}
          placeholder="0000"
        />
        <button className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition-all active:scale-95">
            Confirm Registration
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;