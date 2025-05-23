import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { ToastContainer,toast } from 'react-toastify';
const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
 
  useEffect(() => {
   getFiles();
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
      const updatedFiles = files?.filter(f => f.file !== selectedFile.name);
      const newFile = {
        id: Date.now(),
        file: selectedFile.name,
        date: new Date().toLocaleString(),
        size: (selectedFile.size / 1024).toFixed(2) + ' KB',
        version: files.find(f => f.file === selectedFile.name) 
                ? files.find(f => f.file === selectedFile.name).version + 1 
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
    file?.file?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );


  const getFiles = async () => {
    try {
      let response = await axios.get(
        `https://csvbackend.vercel.app/api/admin/get-files?page=${currentPage}&limit=${itemsPerPage}`
      );
      
      setFiles(response.data.files);
      setTotalPages(response.data.totalPages);
      setTotalFiles(response.data.totalFiles);
    } catch (e) {
      toast.error("Error fetching files", { containerId: "admindashboard" });
    }
  }


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
      
      <span>Total files: {totalFiles}</span>
    </div>
  );


  useEffect(() => {
    getFiles();
  }, [currentPage, itemsPerPage])

  const handleDownload = async (file) => {
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


const enrichifyData=async(file)=>{
  console.log(file)
  try{
let response=await axios.get(`https://csvbackend.vercel.app/api/admin/enrichifyData/${file.file}/${file._id}`)
console.log(response)
toast.success("Data enrichified sucessfully",{containerId:"admindashboard"})
  }catch(e){

  }
}

  return (
    <>
<ToastContainer containerId={"admindashboard"}/>

    <div className="dashboard-container admin">
      <div className="dashboard-box">
      <div style={{display:'flex',gap:'2rem'}}>
        <img style={{width:'5rem'}} id="logo" src="/logo.jpg"/>
        <h2>Admin File Management</h2>
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
                  <th>User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.file}</td>
                    <td>{file.updatedAt?new Date(file?.updatedAt)?.toLocaleDateString('en-us',{
                      day:'2-digit',
                      year:'2-digit',
                      month:'long'
                    }):''}</td>
                    <td>{file?.user?.email}</td>
                    <td>
                      <div className="action-buttons">
                        <label className="update-file">
                          
                          <span onClick={()=>handleDownload(file)}>Download</span>
                        </label>
                      </div>

                      
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

export default AdminDashboard;