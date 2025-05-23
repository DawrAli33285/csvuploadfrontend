import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [paymentAmount] = useState('5.00');

  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [totalPages, setTotalPages] = useState(1);
const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    } else {
      fetchFiles();
    }
  }, [navigate]);

  const handleDownloadClick = (file) => {

    setSelectedFileName(file?.file);
    setSelectedFileObj(file);
    setShowDownloadModal(true);
  };

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newDigits = [...codeDigits];
      newDigits[index] = value;
      setCodeDigits(newDigits);
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(
        `http://18.118.206.148:5000/api/files?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setFiles(data.files);
      setTotalPages(data.totalPages);
      setTotalFiles(data.totalFiles);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const PaginationControls = () => (
    <div className="pagination-controls">
      <button 
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      <span>Page {currentPage} of {totalPages}</span>
      
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      
      <select 
        value={itemsPerPage} 
        onChange={(e) => setItemsPerPage(Number(e.target.value))}
      >
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
      </select>
      
      <span>Total files: {totalFiles}</span>
    </div>
  );
  const handleDownloadConfirm = async () => {
    if (codeDigits.some(digit => digit === '')) {
      toast.error('Please enter complete 4-digit code', { containerId: "userDashboard" });
      return;
    }

    try {
      const code = codeDigits.join('');
      const response = await fetch(`http://18.118.206.148:5000/api/files/${selectedFileObj._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (data.codeMatch) {
        const downloadResponse = await fetch(`http://18.118.206.148:5000/files/${selectedFileName}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = selectedFileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success("File downloaded successfully", { containerId: "userDashboard" });
          setShowDownloadModal(false);
      setCodeDigits(['', '', '', '']);
        }
      } else {
        toast.error(data.message || "Invalid access code", { containerId: "userDashboard" });
      }

   
    } catch (error) {
      toast.error("Error downloading file", { containerId: "userDashboard" });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setStatusMessage('');
    } else {
      setStatusMessage('Please select a CSV file');
    }
  };

  const handleUpload = async () => {
    try {
      let formData = new FormData();
      formData.append('file', selectedFile);
      const response = await fetch('http://18.118.206.148:5000/api/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage('File uploaded successfully!');
        // window.location.reload(true)
      } else {
        // window.location.reload(true)
        setStatusMessage('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
  
      setStatusMessage('Upload failed: ' + error.message);
    }
  };


  useEffect(() => {
    
      fetchFiles();
    
  }, [navigate, currentPage, itemsPerPage]); 

  return (
    <>
      <ToastContainer containerId={"userDashboard"} />
      {showDownloadModal && (
        <div className="modal-overlay">
          <div className="download-modal">
            <div className="modal-header">
              <h3>Confirm Download</h3>
              <button
                className="close-button"
                onClick={() => setShowDownloadModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-content">
              <div className="file-info">
                <span>File: {selectedFileName.slice(0, 20)}</span>
                <span>Amount: ${paymentAmount}</span>
              </div>
              <div className="code-inputs">
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="number"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        document.getElementById(`code-input-${index - 1}`).focus();
                      }
                    }}
                  />
                ))}
              </div>
              <button
                className="confirm-download-button"
                onClick={handleDownloadConfirm}
                disabled={codeDigits.some(digit => digit === '')}
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
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
                    <th>File User</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {files?.map((file) => (
                    <tr key={file.id}>
                      <td>{file?.file?.slice(0, 20)}...</td>
                      <td>{
                        file?.createdAt
                          ? new Date(file.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                            day: '2-digit'
                          })
                          : 'Date not available'
                      }
                      </td>
                      <td>{file?.user?.email}</td>
                      <td>
                        {file?.payed?<button
                          onClick={() => handleDownloadClick(file)}
                          className="download-button"
                        >
                          Download
                        </button>:'Pay to download'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {files.length > 0 && <PaginationControls />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;