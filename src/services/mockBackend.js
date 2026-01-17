export const MockBackend = {
  // Unique Key for the main application state
  DB_KEY: 'sushruta_db_v_final_reset', 

  // Initialize DB with Seed Data
  initDB: () => {
      try {
          const now = new Date();
          const todayStr = now.toDateString(); 
          let data = null;

          // 1. Try to load existing data
          try {
              const raw = localStorage.getItem(MockBackend.DB_KEY);
              if (raw) data = JSON.parse(raw);
          } catch (e) {
              localStorage.removeItem(MockBackend.DB_KEY);
          }

          // 2. If no data exists, create Seed Data
          if (!data) {
              data = {
                  lastLogin: todayStr,
                  user: { 
                      name: '', phone: '', pin: '', dob: '', gender: '', address: '', language: '', photo: '', 
                      emergencyPrimary: { name: '', contact: '', relation: 'Guardian' }, 
                      caretaker: { name: '', contact: '' },
                      doctor: { name: '', contact: '' },
                      emergencySecondary: {}, hospitalPref: '', bloodGroup: '', allergies: '', chronicConditions: '', history: '', surgeries: '', treatments: '' 
                  },
                  meds: [
                      { id: 1, name: "Metformin", type: "Tablet", category: "Daily Routine", dose: "500mg", qty: "1 Tab", stock: 15, expiry: "Dec 2025", schedule: "Morning", instructions: "After Breakfast", taken: false },
                      { id: 2, name: "Amlodipine", type: "Tablet", category: "Daily Routine", dose: "5mg", qty: "1 Tab", stock: 10, expiry: "Jan 2026", schedule: "Night", instructions: "Before Sleep", taken: false },
                  ],
                  vitals: { steps: 120, target: 5000, bp: "120/80", heartRate: 72, sleep: "6.5", exercise: false }, 
                  history: {
                      dates: [], 
                      steps: [3200, 4500, 2800, 5100, 4200, 3800], 
                      heart: [72, 75, 68, 74, 71, 70],
                      bp: [122, 118, 125, 120, 119, 121],
                      sleep: [6.5, 7.0, 5.5, 8.0, 6.2, 7.1],
                      score: [0, 0, 0, 0, 0, 86] 
                  },
                  reports: [], 
                  reminders: [],
                  appointments: [],
                  wellnessLogs: [],
                  customVideos: {} 
              };
              
              // Water Reminders Generation
              const start = 7; const end = 23;
              for (let h = start; h <= end; h++) {
                  const ampm = h >= 12 ? 'PM' : 'AM';
                  const hour = h % 12 || 12;
                  const timeStr = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
                  data.reminders.push({ id: `water-${h}-${Date.now()}`, text: "Drink Water", time: timeStr, day: now.getDate(), completed: false });
              }
              
              // 3. EMERGENCY SAVE: If full, clear EVERYTHING and try again
              try {
                  localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(data));
              } catch (e) {
                  console.warn("Storage Full! Performing Hard Reset...");
                  localStorage.clear(); 
                  try {
                      localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(data));
                      alert("Database Reset Successfully (Old clutter removed).");
                  } catch(err2) {
                      alert("Critical Error: Browser storage is completely locked.");
                  }
              }
          } 
          else {
              // Daily Reset Logic (New Day = Reset Steps/Meds)
              if (data.lastLogin !== todayStr) {
                  data.history.steps.shift(); data.history.steps.push(data.vitals.steps || 0);
                  data.history.heart.shift(); data.history.heart.push(data.vitals.heartRate || 70);
                  data.history.sleep.shift(); data.history.sleep.push(parseFloat(data.vitals.sleep) || 0);
                  
                  data.vitals.steps = 0; data.vitals.sleep = "0"; data.vitals.exercise = false;
                  
                  // Reset Water Reminders for Today
                  data.reminders = data.reminders.filter(r => r.text !== "Drink Water"); 
                  const start = 7; const end = 23;
                  for (let h = start; h <= end; h++) {
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const hour = h % 12 || 12;
                      const timeStr = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
                      data.reminders.push({ id: `water-${h}-${Date.now()}`, text: "Drink Water", time: timeStr, day: now.getDate(), completed: false });
                  }
                  
                  // Reset Meds Taken Status
                  data.meds = data.meds.map(m => ({...m, taken: false}));
                  
                  data.lastLogin = todayStr;
                  MockBackend.updateData(data);
              }
          }
      } catch (err) {
          console.error("InitDB Error:", err);
      }
  },

  // Get Data Helper
  getData: () => {
      try { return JSON.parse(localStorage.getItem(MockBackend.DB_KEY)); } catch (e) { return null; }
  },

  // Save User Profile Helper
  saveUser: (user) => {
      const data = MockBackend.getData();
      if(data) {
          data.user = { ...data.user, ...user };
          MockBackend.updateData(data);
      }
  },

  // Main Update Function
  updateData: (newData) => {
      try {
          localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(newData));
          return true;
      } catch (e) {
          alert("⚠️ STORAGE FULL! Please delete some Custom Videos or Reports.");
          return false;
      }
  },

  // Utility: Check Size
  getStorageSize: () => {
      let total = 0;
      for (let x in localStorage) {
          if (localStorage.hasOwnProperty(x)) {
              total += ((localStorage[x].length * 2) / 1024 / 1024);
          }
      }
      return total.toFixed(2);
  }
};

// Auto-init on import
MockBackend.initDB();