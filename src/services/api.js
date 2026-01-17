const API_URL = 'http://localhost:5000/api';

// Helper to get the token from Local Storage
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.token 
    ? { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' } 
    : { 'Content-Type': 'application/json' };
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
  return data;
};

export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// --- MEDICINES ---

export const fetchMedicines = async () => {
  const response = await fetch(`${API_URL}/meds`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const addMedicine = async (medData) => {
  const response = await fetch(`${API_URL}/meds`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(medData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const deleteMedicine = async (id) => {
  const response = await fetch(`${API_URL}/meds/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// --- APPOINTMENTS ---

export const fetchAppointments = async () => {
  const response = await fetch(`${API_URL}/appointments`, { headers: getAuthHeaders() });
  return await response.json();
};

export const bookAppointment = async (apptData) => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(apptData),
  });
  return await response.json();
};

// --- WELLNESS ---

export const fetchWellnessLogs = async () => {
  const response = await fetch(`${API_URL}/wellness`, { headers: getAuthHeaders() });
  return await response.json();
};

export const addWellnessLog = async (logData) => {
  const response = await fetch(`${API_URL}/wellness`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(logData),
  });
  return await response.json();
};