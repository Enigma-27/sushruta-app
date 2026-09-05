const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from Storage
export const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('activeUser') || 'null');
    return user?.token || null;
  } catch (e) {
    return null;
  }
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('activeUser') || 'null');
  } catch (e) {
    return null;
  }
};

// Helper for Authorization Headers
const getAuthHeaders = () => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// --- HEALTH & STATUS ---
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { online: false, database: 'disconnected' };
    const data = await res.json();
    return { online: true, database: data.database || 'connected' };
  } catch (err) {
    return { online: false, database: 'disconnected' };
  }
};

// --- AUTHENTICATION ---

export const login = async (phone, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  
  localStorage.setItem('user', JSON.stringify(data));
  sessionStorage.setItem('activeUser', JSON.stringify(data));
  return data;
};

export const signup = async (userData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Signup failed');
  
  localStorage.setItem('user', JSON.stringify(data));
  sessionStorage.setItem('activeUser', JSON.stringify(data));
  return data;
};

export const logout = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('activeUser');
};

export const getMe = async () => {
  const response = await fetch(`${API_URL}/auth/me`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch user data');
  return data;
};

// --- USER & VITALS ---

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

export const updateVitals = async (vitalsData) => {
  const response = await fetch(`${API_URL}/users/vitals`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(vitalsData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update vitals');
  return data;
};

// --- MEDICINES ---

export const fetchMedicines = async () => {
  const response = await fetch(`${API_URL}/meds`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch medicines');
  return data;
};

export const addMedicine = async (medData) => {
  const response = await fetch(`${API_URL}/meds`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(medData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to add medicine');
  return data;
};

export const updateMedicine = async (id, medData) => {
  const response = await fetch(`${API_URL}/meds/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(medData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update medicine');
  return data;
};

export const deleteMedicine = async (id) => {
  const response = await fetch(`${API_URL}/meds/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete medicine');
  return data;
};

// --- APPOINTMENTS ---

export const fetchAppointments = async () => {
  const response = await fetch(`${API_URL}/appointments`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch appointments');
  return data;
};

export const bookAppointment = async (apptData) => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(apptData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to book appointment');
  return data;
};

export const updateAppointment = async (id, statusData) => {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(statusData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update appointment');
  return data;
};

// --- WELLNESS ---

export const fetchWellnessLogs = async () => {
  const response = await fetch(`${API_URL}/wellness`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch wellness logs');
  return data;
};

export const addWellnessLog = async (logData) => {
  const response = await fetch(`${API_URL}/wellness`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(logData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to add wellness log');
  return data;
};

// --- REMINDERS ---

export const fetchReminders = async () => {
  const response = await fetch(`${API_URL}/reminders`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch reminders');
  return data;
};

export const addReminder = async (reminderData) => {
  const response = await fetch(`${API_URL}/reminders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reminderData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to add reminder');
  return data;
};

export const deleteReminder = async (id) => {
  const response = await fetch(`${API_URL}/reminders/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete reminder');
  return data;
};

// --- RECORDS (Reports & Insurance) ---

export const fetchRecords = async () => {
  const response = await fetch(`${API_URL}/records`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch records');
  return data;
};

export const addRecord = async (recordData) => {
  const response = await fetch(`${API_URL}/records`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(recordData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to add record');
  return data;
};

export const deleteRecord = async (id) => {
  const response = await fetch(`${API_URL}/records/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete record');
  return data;
};