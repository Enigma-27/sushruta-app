
import React, { useState, useEffect } from 'react';
import { MockBackend } from '../../services/mockBackend';

const AppointmentsTab = ({ data, user, refreshData }) => {
  const [view, setView] = useState('list'); // 'list' or 'book'
  
  // Form State
  const [formData, setFormData] = useState({
    doctorName: '',
    specialization: 'General Physician',
    date: '',
    time: '',
    reason: ''
  });

  // Time Picker State (HH:MM AM/PM)
  const [timeState, setTimeState] = useState({ hh: '', mm: '', period: 'AM' });

  // Sync Time State to formatted string
  useEffect(() => {
    const { hh, mm, period } = timeState;
    if (hh && mm) {
      let hours = parseInt(hh);
      const minutes = parseInt(mm);
      
      // Basic validation logic
      if (hours > 12) hours = 12;
      if (minutes > 59) setTimeState(prev => ({ ...prev, mm: '59' }));
      
      let hours24 = hours;
      if (period === 'PM' && hours < 12) hours24 += 12;
      if (period === 'AM' && hours === 12) hours24 = 0;
      
      const timeStr = `${hours24.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, time: timeStr }));
    }
  }, [timeState]);

  const appointments = data.appointments || [];

  // --- BOOKING LOGIC ---
  const handleBook = (e) => {
    e.preventDefault();
    if (!formData.time || !timeState.hh || !timeState.mm) return alert("Please enter a valid time.");

    const newAppointment = {
      id: Date.now(),
      patientId: user.phone,
      patientName: user.name,
      ...formData,
      status: 'Pending',
      notified: false
    };

    const currentData = MockBackend.getData();
    const updatedAppointments = [...(currentData.appointments || []), newAppointment];
    MockBackend.updateData({ ...currentData, appointments: updatedAppointments });

    refreshData();
    setView('list');
    
    // Reset Form
    setFormData({ doctorName: '', specialization: 'General Physician', date: '', time: '', reason: '' });
    setTimeState({ hh: '', mm: '', period: 'AM' });
    alert("Appointment Request Sent to Doctor!");
  };

  // --- DOCTOR UPDATE LOGIC ---
  const updateStatus = (id, newStatus) => {
    const currentData = MockBackend.getData();
    const updatedAppointments = currentData.appointments.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    MockBackend.updateData({ ...currentData, appointments: updatedAppointments });
    refreshData();
  };

  // --- RENDER: DOCTOR VIEW ---
  if (user.role === 'doctor') {
    const myAppointments = appointments.filter(app => app.status !== 'Rejected');
    
    return (
      <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
            <p className="text-slate-500">Manage patient appointments</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
            {myAppointments.filter(a => a.status === 'Pending').length} Pending Requests
          </div>
        </div>
        
        <div className="grid gap-4">
          {myAppointments.length === 0 ? (
            <div className="text-center p-10 text-slate-400 bg-white rounded-2xl border border-dashed">No appointments yet.</div>
          ) : (
            myAppointments.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                    {app.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{app.patientName}</h3>
                    <p className="text-sm text-slate-500">{app.reason}</p>
                    <div className="flex gap-2 mt-1 text-xs font-bold">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded"><i className="ph-bold ph-calendar"></i> {app.date}</span>
                      <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded"><i className="ph-bold ph-clock"></i> {app.time}</span>
                    </div>
                  </div>
                </div>
                
                {app.status === 'Pending' ? (
                  <div className="flex gap-3">
                    <button onClick={() => updateStatus(app.id, 'Confirmed')} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md transition">Accept</button>
                    <button onClick={() => updateStatus(app.id, 'Rejected')} className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-bold transition">Reject</button>
                  </div>
                ) : (
                  <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-xl border border-green-200"><i className="ph-bold ph-check-circle"></i> Confirmed</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: USER (SENIOR) VIEW ---
  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
      
      {view === 'list' && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
              <p className="text-slate-500">Track your doctor visits</p>
            </div>
            <button onClick={() => setView('book')} className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition flex items-center gap-2">
              <i className="ph-bold ph-plus"></i> Book New
            </button>
          </div>

          {/* List Section */}
          <div className="space-y-4">
            {appointments.filter(a => a.patientId === user.phone).length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <i className="ph-duotone ph-calendar-x text-4xl text-slate-300 mb-2"></i>
                <p className="text-slate-500">No appointments booked yet.</p>
              </div>
            ) : (
              appointments.filter(a => a.patientId === user.phone).map(app => (
                <div key={app.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${app.status === 'Confirmed' ? 'bg-emerald-500' : app.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                  <div className="pl-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">Dr. {app.doctorName}</h3>
                      <p className="text-sm text-slate-500 mb-2">{app.specialization}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><i className="ph-bold ph-calendar-blank"></i> {app.date}</span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><i className="ph-bold ph-clock"></i> {app.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{app.status}</span>
                      <p className="text-xs text-slate-400 mt-2">ID: #{app.id.toString().slice(-4)}</p>
                    </div>
                  </div>
                  {app.status === 'Confirmed' && (
                    <div className="mt-4 pt-4 border-t text-xs text-slate-500 flex items-center gap-2"><i className="ph-fill ph-bell-ringing text-blue-500"></i> You will be notified 1 hour before.</div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* eSanjeevani Integration Block */}
          <div className="mt-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white shadow-2xl transform transition hover:scale-[1.01] duration-500 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/50 text-purple-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Ministry of Health
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  eSanjeevani <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200">National OPD</span>
                </h2>
                <p className="text-indigo-100 mb-8 text-lg opacity-90 max-w-lg">
                  Cannot visit a clinic? Consult specialist doctors from home via <strong>Video Call for FREE</strong>.
                </p>
                <a href="https://esanjeevani.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-purple-50 transition-all active:scale-95 group-hover:shadow-purple-500/20">
                  <span>Start Free Video Call</span>
                  <i className="ph-bold ph-video-camera"></i>
                </a>
              </div>

              {/* Simple Chart */}
              <div className="w-full md:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <h4 className="text-sm font-bold text-center mb-6 opacity-80 uppercase tracking-widest">Consultation Cost</h4>
                <div className="flex justify-center items-end gap-6 h-32">
                  <div className="w-16 flex flex-col items-center gap-2 group/bar">
                    <span className="text-xs font-bold text-white mb-1">₹500+</span>
                    <div className="w-full bg-red-400/80 rounded-t-lg h-24 relative group-hover/bar:bg-red-400 transition-colors"></div>
                    <span className="text-[10px] opacity-70 text-center">Clinic</span>
                  </div>
                  <div className="w-16 flex flex-col items-center gap-2 group/bar">
                    <span className="text-xs font-bold text-green-300 mb-1">FREE</span>
                    <div className="w-full bg-green-400 rounded-t-lg h-6 relative animate-bounce">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-lg">
                        FREE
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-200 text-center">eSanjeevani</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Booking Form View */}
      {view === 'book' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl animate-slide-up overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Book Appointment</h2>
              <p className="text-blue-200 text-sm">Schedule a visit with your specialist</p>
            </div>
            <button onClick={() => setView('list')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
              <i className="ph-bold ph-x text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleBook} className="p-8 space-y-6">
            
            {/* Specialist Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Choose Specialist</label>
              <div className="relative">
                <i className="ph-fill ph-stethoscope absolute left-4 top-3.5 text-blue-600 text-xl"></i>
                <select
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none font-medium text-slate-700 transition-all"
                  required
                  onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                >
                  <option value="">Select a Doctor...</option>
                  <option value="Sharma">Dr. Sharma (Cardiologist)</option>
                  <option value="Gupta">Dr. Gupta (Orthopedic)</option>
                  <option value="Verma">Dr. Verma (General Physician)</option>
                </select>
                <i className="ph-bold ph-caret-down absolute right-4 top-4 text-slate-400"></i>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                <div className="relative">
                  <i className="ph-fill ph-calendar-blank absolute left-4 top-3.5 text-blue-600 text-xl"></i>
                  <input
                    type="date"
                    className="w-full pl-12 pr-2 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-slate-700"
                    required
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Custom Time Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2 pl-3 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all h-[50px]">
                  <div className="flex items-center gap-1">
                    <input
                      type="number" placeholder="HH" maxLength={2} value={timeState.hh}
                      onChange={e => setTimeState({ ...timeState, hh: e.target.value.slice(0, 2) })}
                      className="w-8 bg-transparent text-center text-lg font-bold text-slate-700 outline-none placeholder:text-slate-300 p-0"
                    />
                    <span className="text-slate-400 font-bold">:</span>
                    <input
                      type="number" placeholder="MM" maxLength={2} value={timeState.mm}
                      onChange={e => setTimeState({ ...timeState, mm: e.target.value.slice(0, 2) })}
                      className="w-8 bg-transparent text-center text-lg font-bold text-slate-700 outline-none placeholder:text-slate-300 p-0"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setTimeState({ ...timeState, period: 'AM' })} className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timeState.period === 'AM' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 bg-white border border-slate-100'}`}>AM</button>
                    <button type="button" onClick={() => setTimeState({ ...timeState, period: 'PM' })} className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timeState.period === 'PM' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 bg-white border border-slate-100'}`}>PM</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</label>
              <div className="relative">
                <i className="ph-fill ph-chat-text absolute left-4 top-4 text-blue-600 text-xl"></i>
                <textarea
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-slate-700"
                  rows="2"
                  placeholder="Symptoms or checkup details..."
                  required
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                ></textarea>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
              <span>Confirm Appointment</span>
              <i className="ph-bold ph-check-circle text-xl"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;