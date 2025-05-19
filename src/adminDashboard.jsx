import React, { useState, useEffect } from 'react';


const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

 
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
    setFiles(storedFiles);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setStatusMessage('');
    } else {
      setStatusMessage('Please select a CSV file');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const updatedFiles = files.filter(f => f.filename !== selectedFile.name);
      const newFile = {
        id: Date.now(),
        filename: selectedFile.name,
        date: new Date().toLocaleString(),
        size: (selectedFile.size / 1024).toFixed(2) + ' KB',
        version: files.find(f => f.filename === selectedFile.name) 
                ? files.find(f => f.filename === selectedFile.name).version + 1 
                : 1,
        fileData: selectedFile 
      };
      
      const newFiles = [...updatedFiles, newFile];
      setFiles(newFiles);
      localStorage.setItem('files', JSON.stringify(newFiles));
      setStatusMessage(`File ${updatedFiles.length < files.length ? 'updated' : 'uploaded'} successfully!`);
      setSelectedFile(null);
    }
  };

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container admin">
      <div className="dashboard-box">
        <h2>Admin File Management</h2>
        
        <div className="admin-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
              {selectedFile && files.some(f => f.filename === selectedFile.name) 
                ? 'Update File' 
                : 'Upload File'}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('success') ? 'success' : 'error'}`}>
            {statusMessage}
          </div>
        )}

        <div className="files-table">
          <h3>Managed Files</h3>
          
          {files.length === 0 ? (
            <p className="no-files">No files available</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Last Updated</th>
                  <th>File Size</th>
                  <th>Version</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.filename}</td>
                    <td>{file.date}</td>
                    <td>{file.size}</td>
                    <td>v{file.version}</td>
                    <td>
                      <div className="action-buttons">
                        <label className="update-file">
                          <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => {
                              if(e.target.files[0]) {
                                setSelectedFile(e.target.files[0]);
                                handleUpload();
                              }
                            }}
                          />
                          <span>Update</span>
                        </label>
                      </div>
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

export default AdminDashboard;