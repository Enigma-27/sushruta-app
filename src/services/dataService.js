import * as api from './api';
import { MockBackend } from './mockBackend';

let backendOnline = false;
let dbStatus = 'disconnected';
let listeners = [];

const notifyListeners = () => {
  listeners.forEach((cb) => {
    try { cb({ online: backendOnline, database: dbStatus }); } catch (e) {}
  });
};

export const DataService = {
  // Subscribe to connectivity status
  subscribeStatus: (callback) => {
    listeners.push(callback);
    callback({ online: backendOnline, database: dbStatus });
    return () => {
      listeners = listeners.filter(cb => cb !== callback);
    };
  },

  // Check connection to Express backend
  checkHealth: async () => {
    try {
      const health = await api.checkBackendHealth();
      backendOnline = health.online;
      dbStatus = health.database;
      notifyListeners();
      return health;
    } catch (e) {
      backendOnline = false;
      dbStatus = 'disconnected';
      notifyListeners();
      return { online: false, database: 'disconnected' };
    }
  },

  isOnline: () => backendOnline,

  // --- LOAD APP DATA ---
  loadData: async () => {
    // 1. Always start with cached/local data for instantaneous UI load
    let current = MockBackend.getData();
    if (!current) {
      MockBackend.initDB();
      current = MockBackend.getData();
    }

    // 2. Try fetching from real backend if token exists
    const token = api.getToken();
    if (token) {
      try {
        const health = await DataService.checkHealth();
        if (health.online) {
          // Parallel fetch from all endpoints
          const [medsRes, apptsRes, remsRes, recsRes, wellnessRes] = await Promise.allSettled([
            api.fetchMedicines(),
            api.fetchAppointments(),
            api.fetchReminders(),
            api.fetchRecords(),
            api.fetchWellnessLogs(),
          ]);

          if (medsRes.status === 'fulfilled' && Array.isArray(medsRes.value)) {
            // Map MongoDB _id to id if needed
            current.meds = medsRes.value.map(m => ({ ...m, id: m._id || m.id }));
          }

          if (apptsRes.status === 'fulfilled' && Array.isArray(apptsRes.value)) {
            current.appointments = apptsRes.value.map(a => ({ ...a, id: a._id || a.id }));
          }

          if (remsRes.status === 'fulfilled' && Array.isArray(remsRes.value) && remsRes.value.length > 0) {
            // Keep water reminders while adding cloud reminders
            const waterReminders = (current.reminders || []).filter(r => r.text === "Drink Water");
            const cloudReminders = remsRes.value.map(r => ({ ...r, id: r._id || r.id }));
            current.reminders = [...cloudReminders, ...waterReminders];
          }

          if (recsRes.status === 'fulfilled' && Array.isArray(recsRes.value)) {
            const reports = [];
            const insurance = [];
            recsRes.value.forEach(rec => {
              const item = { ...rec, id: rec._id || rec.id };
              if (rec.category === 'insurance') insurance.push(item);
              else reports.push(item);
            });
            current.reports = reports;
            current.insuranceDocs = insurance;
          }

          if (wellnessRes.status === 'fulfilled' && Array.isArray(wellnessRes.value)) {
            current.wellnessLogs = wellnessRes.value.map(w => ({ ...w, id: w._id || w.id }));
          }

          MockBackend.updateData(current);
        }
      } catch (err) {
        console.warn("Backend sync notice (using local store):", err.message);
      }
    }

    return current;
  },

  // --- USER PROFILE ---
  saveUser: async (user) => {
    MockBackend.saveUser(user);
    if (backendOnline && api.getToken()) {
      try {
        await api.updateUserProfile({
          name: user.name,
          phone: user.phone,
          address: user.address,
          bloodGroup: user.bloodGroup,
          dob: user.dob,
          emergencyPrimary: user.emergencyPrimary
        });
      } catch (e) {
        console.warn("Could not sync user profile to cloud:", e.message);
      }
    }
  },

  // --- VITALS ---
  updateVitals: async (vitals) => {
    const current = MockBackend.getData();
    if (current) {
      current.vitals = { ...current.vitals, ...vitals };
      MockBackend.updateData(current);
    }
    if (backendOnline && api.getToken()) {
      try {
        await api.updateVitals(vitals);
      } catch (e) {
        console.warn("Could not sync vitals to cloud:", e.message);
      }
    }
  },

  // --- MEDICINES ---
  addMedicine: async (med) => {
    const current = MockBackend.getData();
    let savedMed = { ...med, id: med.id || Date.now() };

    if (backendOnline && api.getToken()) {
      try {
        const cloudMed = await api.addMedicine(med);
        if (cloudMed && cloudMed._id) {
          savedMed = { ...cloudMed, id: cloudMed._id };
        }
      } catch (e) {
        console.warn("Could not post medicine to cloud, saved locally:", e.message);
      }
    }

    current.meds = [...(current.meds || []), savedMed];
    MockBackend.updateData(current);
    return savedMed;
  },

  updateMedicine: async (id, updates) => {
    const current = MockBackend.getData();
    current.meds = (current.meds || []).map(m => m.id === id ? { ...m, ...updates } : m);
    MockBackend.updateData(current);

    if (backendOnline && api.getToken()) {
      try {
        await api.updateMedicine(id, updates);
      } catch (e) {
        console.warn("Could not update medicine on cloud:", e.message);
      }
    }
  },

  deleteMedicine: async (id) => {
    const current = MockBackend.getData();
    current.meds = (current.meds || []).filter(m => m.id !== id);
    MockBackend.updateData(current);

    if (backendOnline && api.getToken()) {
      try {
        await api.deleteMedicine(id);
      } catch (e) {
        console.warn("Could not delete medicine on cloud:", e.message);
      }
    }
  },

  // --- APPOINTMENTS ---
  bookAppointment: async (appt) => {
    const current = MockBackend.getData();
    let savedAppt = { ...appt, id: appt.id || Date.now() };

    if (backendOnline && api.getToken()) {
      try {
        const cloudAppt = await api.bookAppointment({
          doctorName: appt.doctorName,
          specialization: appt.specialization,
          date: appt.date,
          time: appt.time,
          reason: appt.reason
        });
        if (cloudAppt && cloudAppt._id) {
          savedAppt = { ...cloudAppt, id: cloudAppt._id };
        }
      } catch (e) {
        console.warn("Could not book appointment on cloud, saved locally:", e.message);
      }
    }

    current.appointments = [...(current.appointments || []), savedAppt];
    MockBackend.updateData(current);
    return savedAppt;
  },

  updateAppointment: async (id, status) => {
    const current = MockBackend.getData();
    current.appointments = (current.appointments || []).map(a => a.id === id ? { ...a, status } : a);
    MockBackend.updateData(current);

    if (backendOnline && api.getToken()) {
      try {
        await api.updateAppointment(id, { status });
      } catch (e) {
        console.warn("Could not update appointment on cloud:", e.message);
      }
    }
  },

  // --- REMINDERS ---
  addReminder: async (rem) => {
    const current = MockBackend.getData();
    let savedRem = { ...rem, id: rem.id || Date.now() };

    if (backendOnline && api.getToken() && rem.text !== "Drink Water") {
      try {
        const cloudRem = await api.addReminder({
          text: rem.text,
          time: rem.time,
          day: parseInt(rem.day)
        });
        if (cloudRem && cloudRem._id) {
          savedRem = { ...cloudRem, id: cloudRem._id };
        }
      } catch (e) {
        console.warn("Could not add reminder to cloud:", e.message);
      }
    }

    current.reminders = [...(current.reminders || []), savedRem];
    MockBackend.updateData(current);
    return savedRem;
  },

  deleteReminder: async (id) => {
    const current = MockBackend.getData();
    current.reminders = (current.reminders || []).filter(r => r.id !== id);
    MockBackend.updateData(current);

    if (backendOnline && api.getToken() && typeof id === 'string' && id.length === 24) {
      try {
        await api.deleteReminder(id);
      } catch (e) {
        console.warn("Could not delete reminder on cloud:", e.message);
      }
    }
  },

  // --- RECORDS (Reports & Insurance) ---
  addRecord: async (rec) => {
    const current = MockBackend.getData();
    let savedRec = { ...rec, id: rec.id || Date.now() };

    if (backendOnline && api.getToken()) {
      try {
        const cloudRec = await api.addRecord({
          category: rec.category, // 'report' or 'insurance'
          name: rec.name,
          doctor: rec.doctor || 'Self Upload',
          date: rec.date,
          type: rec.type,
          content: rec.content
        });
        if (cloudRec && cloudRec._id) {
          savedRec = { ...cloudRec, id: cloudRec._id };
        }
      } catch (e) {
        console.warn("Could not upload record to cloud, stored locally:", e.message);
      }
    }

    if (rec.category === 'insurance') {
      current.insuranceDocs = [savedRec, ...(current.insuranceDocs || [])];
    } else {
      current.reports = [savedRec, ...(current.reports || [])];
    }
    MockBackend.updateData(current);
    return savedRec;
  },

  deleteRecord: async (id, category) => {
    const current = MockBackend.getData();
    if (category === 'insurance') {
      current.insuranceDocs = (current.insuranceDocs || []).filter(r => r.id !== id);
    } else {
      current.reports = (current.reports || []).filter(r => r.id !== id);
    }
    MockBackend.updateData(current);

    if (backendOnline && api.getToken() && typeof id === 'string' && id.length === 24) {
      try {
        await api.deleteRecord(id);
      } catch (e) {
        console.warn("Could not delete record on cloud:", e.message);
      }
    }
  },

  // --- WELLNESS LOGS ---
  addWellnessLog: async (log) => {
    const current = MockBackend.getData();
    let savedLog = { ...log, id: log.id || Date.now() };

    if (backendOnline && api.getToken()) {
      try {
        const cloudLog = await api.addWellnessLog(log);
        if (cloudLog && cloudLog._id) {
          savedLog = { ...cloudLog, id: cloudLog._id };
        }
      } catch (e) {
        console.warn("Could not save wellness log on cloud:", e.message);
      }
    }

    current.wellnessLogs = [savedLog, ...(current.wellnessLogs || [])];
    MockBackend.updateData(current);
    return savedLog;
  }
};
