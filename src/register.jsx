import {  useNavigate } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://csvbackend.vercel.app/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
toast.success("Registration successful",{containerId:'userRegister'})
      console.log("Registration successful:", data);
      setTimeout(()=>{
        navigate("/dashboard");
      },800)
    } catch (error) {
      if(error){
        toast.error(error?.toString(),{containerId:"userRegister"})
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <>
    <ToastContainer containerId={"userRegister"}/>
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
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
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
                {showPassword ? "Hide" : "Show"}
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
    
    </>
  );
}

export default Register;
