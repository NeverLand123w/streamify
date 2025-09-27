import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';

const Upload = () => {
  const inputFileRef = useRef(null);
  const [error, setError] = useState(null);
  const [blobResult, setBlobResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = inputFileRef.current?.files?.[0];
    if (!file) return;

    setError(null);
    setBlobResult(null);
    setIsUploading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setBlobResult(newBlob);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3>Final Upload Test</h3>
      <form onSubmit={handleSubmit}>
        <input ref={inputFileRef} type="file" required disabled={isUploading} />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {blobResult && <video src={blobResult.url} width="300" controls />}
    </div>
  );
};
export default Upload;