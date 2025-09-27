import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    login(credentialResponse);
    // No longer navigates, user stays on the current page.
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Streamify</Link>
        <div className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          {user && <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>}
          {user && <NavLink to="/upload" className="nav-link">Upload</NavLink>}
        </div>
        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <div className="user-menu">
              <Link to={`/channel/${user._id}`}>
                <img src={user.profilePicture} alt={user.channelName} className="user-avatar" />
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;