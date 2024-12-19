import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3000";
  // Function to handle form submission
  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("role", response.data.user.role);

      navigate("/home");
    }
    catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      }
      else {
        setError("An error occurred");
      }
    };
  };
 
  // Function to handle Google login
  const handleGoogleLogin = () => {
    try{
      window.location.href = `${BASE_URL}/api/auth/google`;
    } 
    catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      }
      else {
        setError("An error occurred");
      }
    };
    
  }
  return (
    <div className="login-container">
      <h3>Log In</h3>
      <p>
        Log in to your Flipit account.
      </p>
      <button className="google-login-btn" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      <div className="divider">
        <span>OR</span>
      </div>
      <form>
        <label htmlFor="email">Username</label>
        <input type="text"
         id="username"
         placeholder="Enter your username"
         value={username} onChange={(e) => setUsername(e.target.value)} 
         required />

        <label htmlFor="password">Password</label>
        <input type="password"
         id="password"
         placeholder="Enter your password"
         value={password} onChange={(e) => setPassword(e.target.value)}
         required />

        <div className="form-options">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <Link to = "/forgot-password">Forgot your Password?</Link>
        </div>

        <button type="submit" className="login-btn" onClick={handleSubmit}>Log In</button>
      </form>

      <p className="signup-link">
        Don’t have an account? <Link to="/register">Sign up now</Link>.
      </p>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;