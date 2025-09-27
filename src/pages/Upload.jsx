// File: /src/pages/Upload.jsx
import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';

const Upload = () => {
  const inputFileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [blobResult, setBlobResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = inputFileRef.current?.files?.[0];

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setError(null);
    setBlobResult(null);
    setIsUploading(true);

    try {
      // This function handles the entire two-step process:
      // 1. Fetches the signed URL from your `/api/upload` endpoint.
      // 2. Uses that URL to upload the file directly to Vercel Blob storage.
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload', // Points to our simplified backend
      });

      // If we get here, the upload was successful!
      setBlobResult(newBlob);
      
      // TODO: Now that the upload is complete, save the `newBlob.url`
      // to your database in a separate step here.
      // Example:
      // await fetch('/api/save-video-url', { method: 'POST', body: JSON.stringify({ url: newBlob.url }) });

    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>Upload a New Video (Final Version)</h2>
      <form onSubmit={handleSubmit}>
        <input ref={inputFileRef} type="file" required accept="video/*" disabled={isUploading} />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}
      
      {blobResult && (
        <div style={{ marginTop: '2rem' }}>
          <h3>✅ Upload Successful!</h3>
          <video controls width="100%" src={blobResult.url}></video>
          <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>URL: {blobResult.url}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;