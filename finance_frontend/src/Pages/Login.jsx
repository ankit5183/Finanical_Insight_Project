import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Config";

function Login() {
  const navigate = useNavigate();

  // ✅ Log API URL on component load
  console.log("LOGIN API_URL:", API_URL);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ Log request payload and endpoint
    console.log("Login formData:", loginData);
    console.log("POST URL:", `${API_URL}/api/users/login`);

    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        loginData
      );

      // ✅ Log backend response
      console.log("Login response:", response.data);

      // Save JWT Token
      localStorage.setItem("token", response.data.token);
      console.log("JWT stored in localStorage");

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      // ✅ Detailed error logging
      console.error("Login error:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Status code:", error?.response?.status);

      setErrorMessage("Invalid email or password!");
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

// ------------------ Styles ------------------
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
