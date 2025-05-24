import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(null);
  const [loading,setLoading]=useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserFiles,setSelectedUserFiles]=useState([])

  const navigate = useNavigate();

  useEffect(() => {
    if (uploadingFile) {
      document.getElementById('file-upload').click();
    }
  }, [uploadingFile]);

  useEffect(() => {
    getUsers();
  }, [currentPage, itemsPerPage]);

  const getUsers = async () => {
    try {
        const response = await axios.get(
            `https://csvbackend.vercel.app/api/admin/getUsers?page=${currentPage}&limit=${itemsPerPage}`
        );
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.totalUsers);
    } catch (error) {
        toast.error("Error fetching users", { containerId: "admindashboard" });
    }
};
 

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
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
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1); 
        }}
      >
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
      </select>
      <span>Total users: {totalUsers}</span>
    </div>
  );

  const UserModal = () => (
    <div className="modal">
      <div className="modal-content">
       {loading?<div class="loader"></div>:<>
        <h3>User Details</h3>
        <div className="user-details">
          <p><strong>Email:</strong> {selectedUser?.email}</p>
          <p><strong>Account Created:</strong> {new Date(selectedUser?.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="user-files">
          <h4>Files</h4>
          {selectedUserFiles.length === 0 ? (
            <p>No files found for this user.</p>
          ) : (
            selectedUserFiles.map(file => (
              <div key={file._id} className="file-row">
                <span className="file-name">{file.file}</span>
                <div className="file-actions">
                  <button 
                    onClick={() => handleDownloadFile(file)}
                    className="download-btn"
                  >
                    Download 
                  </button>
                  <button 
                    onClick={() => handleUploadClick(file)}
                    className="upload-btn"
                  >
                    Upload 
                  </button>
                  <button 
                    onClick={() => handleSendVerification(file)}
                    className="verify-btn"
                  >
                    Send Code
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
  
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          id="file-upload"
          style={{ display: 'none' }}
        />
  
        <button 
          onClick={() => setShowUserModal(false)}
          className="close-modal"
        >
          Close
        </button>
       </>}
      </div>
    </div>
  );
  const filteredUsers = users.filter(user =>
    user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );


  const getUserFiles=async(user)=>{
try{
  setSelectedUser(user);
  setShowUserModal(true);
let response=await axios.get(`https://csvbackend.vercel.app/api/admin/getUserFiles/${user._id}`)
console.log(response.data)
setSelectedUserFiles(response.data.files)
}catch(e){
  
}
  }

  const handleUploadClick = (file) => {
    setUploadingFile(file);
  };
  


  const handleDownloadFile = async (file) => {
    try {

      const response = await fetch(`https://csvbackend.vercel.app/files/${file?.file}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.file;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("File downloaded sucessfully",{containerId:"admindashboard"})
      }
    } catch (error) {
      if(error?.response?.data?.error){
        toast.error(error?.response?.data?.error,{containerId:"admindashboard"})
      }else{
        toast.error("Error uploading file",{containerId:"admindashboard"})
      }
      setStatusMessage('Download failed: ' + error.message);
    }
  };


  

  const handleFileUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file || !uploadingFile) { // Add null check for uploadingFile
      setLoading(false);
      return;
    }
  
    // Reset input value to allow same file re-uploads
    event.target.value = '';
  
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      try {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await axios.put(
          `https://csvbackend.vercel.app/api/admin/files/${uploadingFile._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
          }
        );
  
        toast.success("File uploaded successfully", { containerId: "admindashboard" });
        await getUserFiles(selectedUser);
      } catch (error) {
        toast.error("Error uploading file", { containerId: "admindashboard" });
      }
    } else {
      toast.error("Please select a CSV file");
    }
    setLoading(false);
    setUploadingFile(null);
  };



  const handleSendVerification = async (file) => {
    try {
      await axios.post(
        `https://csvbackend.vercel.app/api/admin/sendCode/${file._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
     
      toast.success("Verification code sent to user",{containerId:'admindashboard'});

    } catch (error) {
      console.log(error)
      toast.error("Failed to send verification code",{containerId:"admindashboard"});
    }
  };
  return (
    <>
      <ToastContainer containerId={"admindashboard"} />
      <div className="navbar">
        <div className="navbar-left">
          <img style={{ width: '5rem' }} id="logo" src="/logo.jpg" alt="Enrichify Logo" />
          <h2>User Management Dashboard</h2>
        </div>
        <button className="signout-button" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="dashboard-container admin">
        <div className="dashboard-box">
      

          {statusMessage && (
            <div className={`status-message ${statusMessage.includes('success') ? 'success' : 'error'}`}>
              {statusMessage}
            </div>
          )}

          <div className="users-table">
            <h3>Registered Users</h3>
            
            {users.length === 0 ? (
              <p className="no-users">No users found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Account Created</th>
                   
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => {
                           getUserFiles(user)
                          }}>
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {users.length > 0 && <PaginationControls />}
          </div>
        </div>
      </div>

      {showUserModal && <div className="modal-overlay" />}
      {showUserModal && <UserModal />}
    </>
  );
};

export default AdminDashboard;