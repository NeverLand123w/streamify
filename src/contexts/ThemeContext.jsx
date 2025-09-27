import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
// import axios from 'axios';

const ThemeContext = createContext(null);

// MOCK API for demonstration. Replace with actual axios calls.
const fakeUserPreferencesAPI = {
  fetchTheme: async (userId) => {
    console.log(`FETCHING theme for user: ${userId}`);
    return localStorage.getItem(`theme_${userId}`) || 'light';
  },
  saveTheme: async (userId, theme) => {
    console.log(`SAVING theme for user: ${userId} -> ${theme}`);
    localStorage.setItem(`theme_${userId}`, theme);
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    const loadUserTheme = async () => {
      if (user) {
        // ===> REAL API CALL (READ): await axios.get('/api/user/preferences');
        const savedTheme = await fakeUserPreferencesAPI.fetchTheme(user._id);
        setTheme(savedTheme);
      } else {
        setTheme('light');
      }
    };
    loadUserTheme();
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (user) {
      // ===> REAL API CALL (WRITE): await axios.post('/api/user/preferences', { theme: newTheme });
      await fakeUserPreferencesAPI.saveTheme(user._id, newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};