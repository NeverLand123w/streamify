import React, { createContext, useState, useContext, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
// You'll need axios for backend communication: npm install axios
// import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const login = async (credentialResponse) => {
    console.log("LOGIN: Token received from Google. In a real app, send this to backend for verification.");
    
    // ===== REAL APP LOGIC (replace mock logic below) =====
    // try {
    //   const response = await axios.post('/api/auth/google', { token: credentialResponse.credential });
    //   const userData = response.data.user; // User profile from your database
    //   setUser(userData);
    //   localStorage.setItem('user_profile', JSON.stringify(userData));
    // } catch (error) {
    //   console.error("Backend authentication failed:", error);
    //   logout();
    // }
    
    // ===== MOCK LOGIC for demonstration =====
    const { jwtDecode } = await import('jwt-decode'); // Lazy load for mock
    const decoded = jwtDecode(credentialResponse.credential);
    // Create a mock user object similar to what our backend would return
    const mockUserData = {
      _id: decoded.sub, // Use googleId as the mock DB ID
      googleId: decoded.sub,
      email: decoded.email,
      channelName: decoded.name,
      profilePicture: decoded.picture,
      themePreference: 'light' // Default theme for new mock user
    };
    setUser(mockUserData);
    localStorage.setItem('user_profile', JSON.stringify(mockUserData));
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user_profile');
    // Optional: await axios.post('/api/auth/logout');
    console.log("LOGOUT: User logged out.");
  };

  const value = { user, setUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};