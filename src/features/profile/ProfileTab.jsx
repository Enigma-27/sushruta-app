import React, { useState, useRef } from 'react';

const ProfileTab = ({ data, refreshData, userRole = 'senior' }) => {
  // 1. NORMALIZE ROLE
  const currentRole = (userRole || 'senior').toLowerCase();
  const isSenior = currentRole === 'senior' || currentRole === 'patient';
  const isCaretakerOrDoctor = currentRole === 'caretaker' || currentRole === 'doctor';

  // 2. STATE MANAGEMENT
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(data?.user || { name: "User", age: 65 });
  const fileInputRef = useRef(null);

  // --- NEW: CONNECTION LIST STATE ---
  const [connections, setConnections] = useState([]); // Stores list of connected users
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [newConn, setNewConn] = useState({ name: '', role: 'Caretaker', phone: '', password: '' }); // Form Data

  // 3. GENERATE DYNAMIC ID (Simulated)
  const [sushrutaId] = useState(() => {
    const prefix = formData.age >= 60 ? "SNR" : "SH";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  });

  // 4. VOICE FEEDBACK ENGINE
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 1;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleChange = (e, field, sub) => {
    if (sub) {
      const parent = formData[field] || {};
      setFormData({ ...formData, [field]: { ...parent, [sub]: e.target.value } });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const saveProfile = () => {
    speak("Saving changes to your secure profile.");
    if (refreshData) refreshData({ ...data, user: formData });
    setEditMode(false);
    alert("Profile Updated!");
  };

  // --- HANDLE ADD CONNECTION ---
  const handleAddConnection = () => {
    // Validation
    if (!newConn.name || !newConn.phone || !newConn.password) {
      alert("Please fill in Name, Mobile, and Password.");
      return;
    }

    speak(`Adding ${newConn.name} to your connections.`);
    
    // Simulate Processing
    setTimeout(() => {
        const newEntry = {
            id: Date.now(),
            name: newConn.name,
            role: newConn.role,
            phone: newConn.phone,
            initial: newConn.name.charAt(0).toUpperCase()
        };

        setConnections([...connections, newEntry]);
        setNewConn({ name: '', role: 'Caretaker', phone: '', password: '' }); // Reset Form
        setIsModalOpen(false); // Close Modal
        alert("Connection Established Successfully!");
    }, 800);
  };

  const removeConnection = (id) => {
      if(confirm("Remove this person from your connections?")) {
          setConnections(connections.filter(c => c.id !== id));
      }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in h-full overflow-y-auto pb-24 relative">
      
      {/* --- FIX: RENDER MODAL DIRECTLY HERE (Prevents cursor focus loss) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
              <div className="bg-slate-900 p-6 flex justify-between items-center">
                  <h3 className="text-white font-bold text-xl flex items-center gap-2">
                      <i className="ph-fill ph-link"></i> Link New Connection
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                      <i className="ph-bold ph-x text-xl"></i>
                  </button>
              </div>
              
              <div className="p-6 space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                      <input 
                          type="text" 
                          placeholder="e.g. Dr. Sharma" 
                          className="w-full border rounded-lg p-3 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none"
                          value={newConn.name}
                          onChange={e => setNewConn({...newConn, name: e.target.value})}
                      />
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                      <select 
                          className="w-full border rounded-lg p-3 bg-white text-slate-700 outline-none"
                          value={newConn.role}
                          onChange={e => setNewConn({...newConn, role: e.target.value})}
                      >
                          <option value="Caretaker">Caretaker</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Family Member">Family Member</option>
                          <option value="Guardian">Guardian</option>
                      </select>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                      <input 
                          type="tel" 
                          placeholder="10-digit number" 
                          className="w-full border rounded-lg p-3 font-mono text-slate-700 outline-none"
                          value={newConn.phone}
                          onChange={e => setNewConn({...newConn, phone: e.target.value})}
                      />
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Secure Password</label>
                      <input 
                          type="password" 
                          placeholder="******" 
                          className="w-full border rounded-lg p-3 font-mono text-slate-700 outline-none"
                          value={newConn.password}
                          onChange={e => setNewConn({...newConn, password: e.target.value})}
                      />
                  </div>

                  <button 
                      onClick={handleAddConnection}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 mt-2 transition active:scale-95"
                  >
                      Establish Connection
                  </button>
              </div>
          </div>
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
            <i className="ph-fill ph-user-circle text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isSenior ? "My Profile" : "Senior Profile View"}
          </h1>
        </div>

        {/* Edit button ONLY for Senior */}
        {isSenior && (
          <button 
            onClick={() => { if(editMode) saveProfile(); else { speak("Edit mode active"); setEditMode(true); } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow transition hover:bg-blue-700"
          >
            {editMode ? 'Save' : 'Edit'}
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 1. BASIC DETAILS CARD */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-teal-500">
          <h3 className="font-bold text-teal-800 border-b pb-4 mb-6 flex items-center gap-2 text-lg">
            <i className="ph-fill ph-identification-card text-2xl"></i> 1. Basic Details
          </h3>

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4 cursor-pointer" onClick={() => editMode && fileInputRef.current.click()}>
              <img src={formData.photo || `https://ui-avatars.com/api/?name=${formData.name}`} className="w-full h-full rounded-full object-cover border-4 border-teal-50 shadow-md" alt="User Profile" />
              {editMode && (
                <div className="overlay absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-2xl">
                  <i className="ph-bold ph-camera"></i>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                if(f){ const r=new FileReader(); r.onloadend=()=>setFormData({...formData, photo:r.result}); r.readAsDataURL(f); }
              }} />
            </div>
            
            <div className="bg-slate-100 px-4 py-1 rounded-lg border border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-500 mr-2">Sushruta ID:</span>
              <span className="font-mono font-bold text-teal-700">{sushrutaId}</span>
            </div>
            {!editMode && <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="form-label">Full Name</label><input disabled={!editMode} value={formData.name} onChange={(e)=>handleChange(e,'name')} className="form-input font-semibold" /></div>
            <div><label className="form-label">Phone Number</label><input disabled={!editMode} value={formData.phone} onChange={(e)=>handleChange(e,'phone')} className="form-input" /></div>
            <div><label className="form-label">Date of Birth</label><input type="date" disabled={!editMode} value={formData.dob} onChange={(e)=>handleChange(e,'dob')} className="form-input" /></div>
            <div><label className="form-label">Language</label><select disabled={!editMode} value={formData.language} onChange={(e)=>handleChange(e,'language')} className="form-input"><option>Hindi</option><option>English</option><option>Marathi</option></select></div>
            <div className="md:col-span-2"><label className="form-label">Address</label><textarea disabled={!editMode} value={formData.address} onChange={(e)=>handleChange(e,'address')} className="form-input" rows="2"></textarea></div>
          </div>
        </div>

        {/* --- 2. CARETAKER / DOCTOR BLOCK --- */}
        {isCaretakerOrDoctor && (
          <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-md">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-lg">
              <i className="ph-fill ph-bell-ringing text-indigo-600"></i> Action Required
            </h3>
            <div className="bg-white p-5 rounded-xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {formData.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">Connection Request from {formData.name}</p>
                  <p className="text-sm text-slate-500 italic">"Allow access to medical history"</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">Accept</button>
                <button className="bg-white border border-red-200 text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-50">Deny</button>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. SENIOR PRIVATE SECTIONS --- */}
        {isSenior && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-red-500">
              <h3 className="font-bold text-red-800 border-b pb-4 mb-6 flex items-center gap-2 text-lg"><i className="ph-fill ph-ambulance text-2xl"></i> 2. Emergency Details</h3>
              <div className="p-5 bg-red-50 rounded-xl border border-red-100 mb-4 text-left">
                <p className="text-xs font-bold text-red-700 uppercase mb-3">Primary Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="form-label text-red-700">Name</label><input disabled={!editMode} value={formData.emergencyPrimary?.name || ''} className="form-input border-red-200 bg-white" /></div>
                  <div><label className="form-label text-red-700">Phone</label><input disabled={!editMode} value={formData.emergencyPrimary?.contact || ''} className="form-input border-red-200 bg-white" /></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div><label className="form-label">Hospital</label><input disabled={!editMode} value={formData.hospitalPref} className="form-input" /></div>
                <div><label className="form-label text-red-600">Allergies</label><input disabled={!editMode} value={formData.allergies} className="form-input border-red-100 text-red-600 bg-red-50 font-bold" /></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-blue-500 text-left">
              <h3 className="font-bold text-blue-800 border-b pb-4 mb-6 flex items-center gap-2 text-lg"><i className="ph-fill ph-heartbeat text-2xl"></i> 3. Medical History</h3>
              <div className="grid gap-6">
                <div><label className="form-label">Chronic Conditions</label><textarea disabled={!editMode} value={formData.chronicConditions} className="form-input bg-blue-50/50" rows="3"></textarea></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="form-label">Recent Surgeries</label><input disabled={!editMode} value={formData.surgeries} className="form-input" /></div>
                  <div><label className="form-label">Ongoing Treatments</label><input disabled={!editMode} value={formData.treatments} className="form-input" /></div>
                </div>
              </div>
            </div>

            {/* --- UPDATED: CONNECTION LIST SECTION --- */}
            <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                <div className="text-left">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <i className="ph-fill ph-users-three text-blue-400"></i> My Care Team
                  </h2>
                  <p className="text-slate-400 text-sm">Manage who can view your health records.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg flex items-center gap-2 active:scale-95"
                >
                  <i className="ph-bold ph-plus"></i> Add Connection
                </button>
              </div>

              {/* LIST OF CONNECTIONS */}
              {connections.length === 0 ? (
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 border-dashed">
                  <p className="text-slate-500 text-sm">No active connections. Click "Add Connection" to start.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connections.map(user => (
                    <div key={user.id} className="bg-white/10 p-4 rounded-xl border border-white/20 flex items-center justify-between gap-4 animate-slide-up hover:bg-white/15 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                          {user.initial}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{user.name}</p>
                          <span className="text-[10px] uppercase tracking-wider bg-blue-500/30 border border-blue-400/30 px-2 py-0.5 rounded text-blue-100 font-bold inline-block">
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeConnection(user.id)}
                        className="text-slate-400 hover:text-red-400 p-2 transition"
                        title="Remove Connection"
                      >
                        <i className="ph-bold ph-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;