import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";   // <-- IMPORTANT: import CSS file

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="wp-container">
      <div className="wp-card">
        <h1 className="wp-title">Financial Insight</h1>
        <p className="wp-subtitle">
          Track, manage, and visualize your expenses effortlessly.
        </p>

        <div className="wp-buttons">
          <button className="wp-btn wp-login" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="wp-btn wp-register" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
