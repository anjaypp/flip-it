import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    // Retrieve email from sessionStorage or query string
    const emailFromURL = new URLSearchParams(window.location.search).get("email");
    const emailFromStorage = sessionStorage.getItem("email");
    const emailToUse = emailFromURL || emailFromStorage;

    if (emailToUse) {
      setEmail(emailToUse);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
        email,
        resetOTP,
        newPassword,
      });
      setResponseMessage(response.data.message);
    } catch (err) {
      console.error(err);
      setResponseMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Reset Password</h2>
        <form id="reset-password-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly
          />

          <label htmlFor="resetOTP">OTP</label>
          <input
            type="text"
            id="resetOTP"
            name="resetOTP"
            placeholder="Enter OTP"
            value={resetOTP}
            onChange={(e) => setResetOTP(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit">Reset Password</button>
        </form>
        <p id="response-message">{responseMessage}</p>
      </div>
    </div>
  );
};

export default ResetPassword;
