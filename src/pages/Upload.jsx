// File: src/pages/Upload.jsx

import React, { useState, useRef } from 'react';

const Upload = () => {
  const inputFileRef = useRef(null); // Ref to access the file input element
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedBlob, setUploadedBlob] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
        setFile(null);
        return;
    }
    
    // Optional: Add a client-side file size check
    const MAX_FILE_SIZE_MB = 500;
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File size cannot exceed ${MAX_FILE_SIZE_MB}MB.`);
        setFile(null);
        return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadedBlob(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadedBlob(null);

    try {
      // The `fetch` API is used to send the file to our serverless function.
      // The filename is passed as a query parameter.
      const response = await fetch(`/api/upload-video?filename=${file.name}`, {
        method: 'POST',
        body: file, // The file object is the body.
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const newBlob = await response.json();
      setUploadedBlob(newBlob);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
      // Clear the file input for the next upload
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
      setFile(null);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>Upload a New Video</h2>
      <p>Powered by Vercel Blob, this uploader supports files up to 500MB.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '2px dashed var(--border-color)', padding: '2rem', borderRadius: '8px' }}>
        <input 
          ref={inputFileRef}
          type="file" 
          required 
          accept="video/*" 
          onChange={handleFileChange} 
        />
        
        <button type="submit" disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      
      {uploadedBlob && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Upload Successful!</h3>
          <p style={{wordBreak: 'break-all'}}>
            File URL: <a href={uploadedBlob.url} target="_blank" rel="noopener noreferrer">{uploadedBlob.url}</a>
          </p>
          <video controls width="100%" preload="metadata" style={{ borderRadius: '8px', marginTop: '1rem' }}>
            <source src={uploadedBlob.url} type={file?.type || 'video/mp4'} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default Upload;