import logo from './logo.svg';
import './App.css';
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://18.118.206.148:5000/api/user/login', {
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
        throw new Error(data.error || 'Login failed');
      }

   
      localStorage.setItem('token', data.token);
      console.log('Login successful, token stored');
      navigate('/dashboard');

    } catch (error) {
      console.log(error)
  
if(error){
  toast.error(error?.toString(),{containerId:'userLogin'})
    
}
    
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
  <ToastContainer limit={1} containerId={"userLogin"}/>
  <div className="login-container">
    <div className="login-box">
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Please sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            required
            value={formData.email}
              onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>


        <button type="submit" className="signin-button">
          Sign In
        </button>
      </form>

      <div className="signup-link">
        Don't have an account? <a href="/register">Sign up here</a>
      </div>
    </div>
  </div>
  </>
  );
}

export default App;
