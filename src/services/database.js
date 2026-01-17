// A simple wrapper around LocalStorage to simulate a database connection
export const DB = {
  // Initialize storage if empty
  init: () => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
  },

  // Save data to a key
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Storage Limit Exceeded", e);
      return false;
    }
  },

  // Retrieve data from a key
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error parsing storage data", e);
      return null;
    }
  },

  // Clear specific key
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  // Clear entire DB (Hard Reset)
  clearAll: () => {
    localStorage.clear();
  }
};

// Auto-initialize on import
DB.init();