import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("Error: Registration failed!");
      }
    } catch (error) {
      setMessage("Server Error!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>

      <form style={styles.form} onSubmit={handleSubmit}>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button style={styles.button} type="submit">
          Register
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>

      <p style={styles.bottomText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #1cc88a, #4e73df)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
  },
  button: {
    padding: "12px",
    background: "#fff",
    color: "#4e73df",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
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
  }
};

export default Register;
