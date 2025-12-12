import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();

        // Save JWT Token
        localStorage.setItem("token", data.token);

        // Redirect to Dashboard
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid email or password!");
      }
    } catch (error) {
      setErrorMessage("Server Error! Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>

      <form style={styles.form} onSubmit={handleLogin}>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          value={loginData.email}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          required
        />

        <button style={styles.button} type="submit">
          Login
        </button>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </form>

      <p style={styles.bottomText}>
        Don’t have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/register")}>
          Register
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #4e73df, #1cc88a)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  form: {
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
  },
  button: {
    padding: "12px",
    background: "white",
    color: "#4e73df",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "#ffcccc",
    marginTop: "10px",
    fontWeight: "bold",
  },
  bottomText: {
    marginTop: "15px",
  },
  link: {
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
