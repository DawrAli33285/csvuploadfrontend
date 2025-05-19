import logo from './logo.svg';
import './App.css';
import {useState} from 'react'
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };


  return (
    <div className="login-container">
    <div className="login-box">
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Please sign up to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            required
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
          Sign Up
        </button>
      </form>

      <div className="signup-link">
        Don't have an account? <a href="/">Sign in here</a>
      </div>
    </div>
  </div>
  );
}

export default Register;
