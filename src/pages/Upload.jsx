// File: src/pages/Upload.jsx

import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client'; // The magical client-side helper

const Upload = () => {
  const inputFileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [blobResult, setBlobResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      setError('Please select a file to upload.');
      return;
    }

    const file = inputFileRef.current.files[0];
    if (!file) {
      setError('File not found.');
      return;
    }

    // Reset state before starting
    setError(null);
    setBlobResult(null);
    setIsUploading(true);
    setProgress(0);

    try {
      // The `upload` function handles everything for you:
      // 1. It calls your `/api/upload` endpoint to get the signed URL.
      // 2. It uploads the file directly to Vercel Blob Storage using that URL.
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload', // This must match your backend route
        onUploadProgress: (progressEvent) => {
            // Update the progress state to show a loading bar
            setProgress(progressEvent);
        }
      });

      // After a successful upload, store the result
      setBlobResult(newBlob);

    } catch (error) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      // Reset the uploading state whether it succeeded or failed
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>Upload a New Video</h2>
      <p>This method supports large files by uploading directly to Blob storage.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '2px dashed #ccc', padding: '2rem', borderRadius: '8px' }}>
        <input 
          ref={inputFileRef} 
          type="file" 
          required 
          accept="video/*" 
          disabled={isUploading}
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? `Uploading... ${progress}%` : 'Upload Video'}
        </button>
      </form>

      {isUploading && (
        <progress value={progress} max="100" style={{width: '100%', marginTop: '1rem'}}></progress>
      )}
      
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}
      
      {blobResult && (
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h3>✅ Upload Successful!</h3>
          <p>
            URL: <a href={blobResult.url} target="_blank" rel="noopener noreferrer">{blobResult.pathname}</a>
          </p>
          <video controls width="100%" preload="metadata" style={{ borderRadius: '8px', marginTop: '1rem' }}>
            <source src={blobResult.url} type={blobResult.contentType} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default Upload;