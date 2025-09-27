// File: /src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1rem',
};

/**
 * Dashboard Page
 * 
 * - A protected route, only visible to logged-in users.
 * - Fetches videos specifically for the currently logged-in user
 *   from `/api/videos/[userId]`.
 * - Displays them in a grid and provides an "Upload" button.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch videos if a user is logged in
    if (user?.id) {
      const fetchMyVideos = async () => {
        setLoading(true);
        try {
          // Fetch from the dynamic endpoint using the user's ID
          const response = await fetch(`/api/videos/${user.id}`);
          const data = await response.json();
          setMyVideos(data);
        } catch (error) {
          console.error("Failed to fetch your videos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMyVideos();
    }
  }, [user]); // Re-run this effect if the user object changes

  if (!user) {
    return <div>Please log in to see your dashboard.</div>
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>My Channel Dashboard</h2>
          <Link to="/upload">
              <button>Upload New Video</button>
          </Link>
      </div>

      {loading ? (
        <p>Loading your videos...</p>
      ) : myVideos.length > 0 ? (
        <div style={gridStyles}>
          {myVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p>You haven't uploaded any videos yet. Click "Upload" to get started!</p>
      )}
    </div>
  );
};

export default Dashboard;