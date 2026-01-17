// Key used for session storage (persists on refresh, clears on browser close)
const SESSION_KEY = 'activeUser';

export const AuthService = {
  // Get currently logged in user
  getCurrentUser: () => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  // Log in user (save to session)
  login: (user) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  // Log out user (clear session)
  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!sessionStorage.getItem(SESSION_KEY);
  }
};