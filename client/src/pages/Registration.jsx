import React from "react";
import "./styles/Registration.css";
import { Link } from "react-router-dom";
import axios from "axios";


const Registration = () => {
const [username, setUsername] = React.useState("");
const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");

const BASE_URL = "http://localhost:3000";

const handleRegistration = async (e) => {
  try {
    e.preventDefault();
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      username,
      email,
      password,
    });
    console.log(response.data);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="signup-container">
      <h3>Sign Up</h3>
      <p>
        Create your Flipit account.
      </p>
      <button className="google-login-btn">Sign in with Google</button>
      <div className="divider">
        <span>OR</span>
      </div>
      <form>
        <label htmlFor="email">Email</label>
        <input type="email"
        id="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        required />

        <label htmlFor="screenName"> Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
       

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="signup-btn" onClick={handleRegistration}>Sign Up with Email</button>
      </form>
      <p className="terms">
        By signing up, you agree to the Flipit's{" "}
        <a href="/terms">Terms of Service</a>.
      </p>
      <p className="login-link">
        Already have an account? <Link to="/login">Log in</Link>.
      </p>
    </div>
  );
}

export default Registration;