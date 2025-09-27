// File: /src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // This will hold the user profile from OUR database

  useEffect(() => {
    // Check local storage for a previously logged-in user session
    const storedUser = localStorage.getItem('user_profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const login = async (credentialResponse) => {
    try {
      // 1. Decode the token from Google to get user details
      const decoded = jwtDecode(credentialResponse.credential);

      // 2. Send these details to our own backend API
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with the server.');
      }

      const { user: userDataFromDb } = await response.json();

      // 3. Save the user profile from OUR database into state and local storage
      setUser(userDataFromDb);
      localStorage.setItem('user_profile', JSON.stringify(userDataFromDb));

    } catch (error) {
      console.error("Login process failed:", error);
      logout(); // Clear state if login fails
    }
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user_profile');
  };

  const value = { user, setUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);