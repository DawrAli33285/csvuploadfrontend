import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setStatusMessage('');
    } else {
      setStatusMessage('Please select a CSV file');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const newFile = {
        id: Date.now(),
        filename: selectedFile.name,
        date: new Date().toLocaleString(),
        size: (selectedFile.size / 1024).toFixed(2) + ' KB'
      };
      
      setFiles([...files, newFile]);
      setStatusMessage('File uploaded successfully!');
      setSelectedFile(null);
    }
  };

  const handleDownload = (file) => {
    const blob = new Blob([], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2>CSV File Manager</h2>
        
        <div className="upload-section">
          <div className="file-input">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              {selectedFile ? selectedFile.name : 'Choose CSV File'}
            </label>
          </div>
          <button 
            onClick={handleUpload}
            className="upload-button"
            disabled={!selectedFile}
          >
            Upload File
          </button>
        </div>

        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('success') ? 'success' : 'error'}`}>
            {statusMessage}
          </div>
        )}

        <div className="files-table">
          <h3>Uploaded Files</h3>
          
          {files.length === 0 ? (
            <p className="no-files">No files uploaded yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date Uploaded</th>
                  <th>File Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{file.filename}</td>
                    <td>{file.date}</td>
                    <td>{file.size}</td>
                    <td>
                      <button
                        onClick={() => handleDownload(file)}
                        className="download-button"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;