import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  // In a real app, fetch creator-specific data like videos, stats, etc.

  return (
    <div>
      <h2>Creator Dashboard</h2>
      {user && (
        <div>
          <h3>Welcome back, {user.channelName}!</h3>
          <p>This is your control center. From here you can manage your videos, view analytics, and customize your channel.</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
             <Link to="/upload">
                <button>Upload New Video</button>
             </Link>
             <Link to={`/channel/${user._id}`}>
                <button>View Your Channel</button>
             </Link>
          </div>
          <div style={{ marginTop: '2rem', border: '2px dashed var(--border-color)', padding: '2rem', borderRadius: '8px', color: 'var(--text-color-muted)' }}>
            <h4>Your Videos & Analytics</h4>
            <p>A list of your uploaded videos and performance stats will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;