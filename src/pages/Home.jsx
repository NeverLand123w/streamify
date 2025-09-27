// File: /src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1rem',
};

/**
 * Home Page
 * 
 * Fetches all videos from our `/api/videos` endpoint on component mount
 * and displays them in a responsive grid.
 */
const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div>
      <h1>Latest Videos</h1>
      <div style={gridStyles}>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;