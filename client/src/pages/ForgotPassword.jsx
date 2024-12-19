import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3000";

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
        email,
      });
      console.log(response.data);
      
      //Store email in session storage
      sessionStorage.setItem("email", email);
      
      // redirect to reset password page
      navigate(`/reset-password?email=${email}`);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="forgot-password-container">
      <div className="card">
        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password:</p>
        <form>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <button type="submit" onClick={handleSubmit}>
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
