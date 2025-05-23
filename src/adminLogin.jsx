import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://18.118.206.148:5000/api/admin/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Admin login failed');
      }

      localStorage.setItem('adminToken', data.token);
      navigate('/admindashboard');

    } catch (error) {
      toast.error(error.toString(), { 
        containerId: 'adminLogin',
        className: 'admin-toast'
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <>
      <ToastContainer 
        containerId="adminLogin"
        enableMultiContainer
        className="admin-toast-container"
      />
      
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <h2>Admin Portal</h2>
            <p>Restricted Access - Authorized Personnel Only</p>
            <div className="admin-badge">⚙️</div>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Admin ID</label>
              <input
                type="email"
                id="email"
                placeholder="Enter admin email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Security Key</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter security key"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="toggle-password admin-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-signin-button">
              Authenticate
            </button>
          </form>

          <div className="admin-note">
            <p>Contact system administrator for access issues</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;