// File: /src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Simple styling, can be moved to a CSS file
const cardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
};
const videoStyles = {
  width: '100%',
  height: '180px',
  backgroundColor: '#000',
};
const detailsStyles = {
  padding: '12px',
};
const titleStyles = {
  margin: '0 0 8px 0',
  fontSize: '1rem',
};
const channelStyles = {
  margin: '0',
  fontSize: '0.875rem',
  color: '#555',
};

/**
 * VideoCard Component
 * 
 * A reusable UI component to display a single video's thumbnail,
 * title, and channel information. It links to a future "watch" page.
 * 
 * @param {object} video - The video object from our database.
 */
const VideoCard = ({ video }) => {
  return (
    <Link to={`/watch/${video.id}`} style={cardStyles}>
      <video
        style={videoStyles}
        src={video.url}
        muted
        preload="metadata"
        // This trick gets the thumbnail at the 1-second mark
        onLoadedMetadata={(e) => (e.target.currentTime = 1)}
      ></video>
      <div style={detailsStyles}>
        <h3 style={titleStyles}>{video.title}</h3>
        {/* We also link to the user's channel page */}
        <Link to={`/channel/${video.uploader.id}`} style={channelStyles}>
            <p>{video.uploader.channelName}</p>
        </Link>
      </div>
    </Link>
  );
};

export default VideoCard;