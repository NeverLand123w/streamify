// File: /src/pages/Upload.jsx
import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { useAuth } from '../contexts/AuthContext'; // To get the logged-in user
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError('You must be logged in to upload a video.');
      return;
    }
    const file = inputFileRef.current?.files?.[0];
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        // Pass our metadata to the `onBeforeGenerateToken` function on the server.
        clientPayload: JSON.stringify({
          uploaderId: user.id, // The ID from our own database!
          title: title,
          description: description,
        }),
      });
      // After upload, navigate to the user's dashboard to see the new video.
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Upload a New Video</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isUploading} style={{width: '100%', padding: '8px'}} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isUploading} style={{width: '100%', padding: '8px', minHeight: '100px'}} />
        </div>
        <div>
          <label htmlFor="videoFile">Video File</label>
          <input ref={inputFileRef} id="videoFile" type="file" required accept="video/*" disabled={isUploading} />
        </div>
        <button type="submit" disabled={isUploading} style={{alignSelf: 'flex-start', padding: '10px 20px'}}>
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}
    </div>
  );
};

export default Upload;