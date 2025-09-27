import React from 'react';

const Upload = () => {

  const handleUpload = (e) => {
    e.preventDefault();
    alert('Upload functionality would be handled here. This would involve sending the file and metadata to your backend server.');
  }

  return (
    <div>
      <h2>Upload a New Video</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: 'auto' }}>
        <div>
          <label htmlFor="videoFile">Video File:</label>
          <input type="file" id="videoFile" required accept="video/*" style={{ width: '100%', padding: '8px', background: 'var(--card-bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px' }}/>
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" required placeholder="My Awesome Video" style={{ width: '100%', padding: '8px', background: 'var(--card-bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px' }}/>
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" rows="5" placeholder="Tell viewers about your video" style={{ width: '100%', padding: '8px', background: 'var(--card-bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'inherit' }}></textarea>
        </div>
        <button type="submit" style={{ alignSelf: 'flex-start' }}>Process & Upload</button>
      </form>
    </div>
  );
};

export default Upload;