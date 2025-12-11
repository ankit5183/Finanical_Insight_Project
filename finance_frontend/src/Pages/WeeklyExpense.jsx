import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function WeeklyExpense() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");

  // Fetch weekly expenses
  const fetchWeeklyExpenses = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Defensive check: Ensure user is authenticated
    if (!token) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    const url = `${API_URL}/api/expense/weekly?year=${year}&month=${month}&day=${day}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json", // Added for clarity, though not strictly needed for GET
        },
      });

      if (!response.ok) {
        // Handle specific HTTP errors (e.g., 404, 403)
        const errorText = response.status === 401 
          ? "Unauthorized: Invalid or expired token." 
          : "Error fetching weekly expenses.";

        setMessage(errorText);
        return;
      }

      const data = await response.json();
      setExpenses(data);
      setMessage("");

      // Calculate total
      const totalAmount = data.reduce((sum, exp) => sum + exp.amount, 0);
      setTotal(totalAmount);

    } catch (err) {
      // This catches network errors (e.g., API_URL is incorrect or server is down)
      setMessage("Server Error! Check API URL and network connection.");
      console.error("Fetch error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Weekly Expense Report</h2>

      <form onSubmit={fetchWeeklyExpenses} style={styles.form}>
        {/* ... (Input fields remain the same) ... */}
        <input
          type="number"
          placeholder="Year (e.g., 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Day (1-31)"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Get Weekly Expenses
        </button>
      </form>

      {message && <p style={styles.error}>{message}</p>}

      <h3 style={styles.total}>Total Weekly Expense: ₹{total}</h3>

      <div style={styles.list}>
        {expenses.length > 0 ? (
          expenses.map((exp) => (
            <div key={exp.id} style={styles.card}>
              <p>
                <strong>Date:</strong> {exp.date}
              </p>
              <p>
                <strong>Category:</strong> {exp.category}
              </p>
              <p>
                <strong>Amount:</strong> ₹{exp.amount}
              </p>
            </div>
          ))
        ) : (
          <p>No data to show</p>
        )}
      </div>
    </div>
  );
}

export default WeeklyExpense;

// ---------------------------- STYLES ----------------------------
const styles = {
  container: {
    maxWidth: "650px",
    margin: "40px auto",
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#4e73df",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    background: "#1cc88a",
    color: "white",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  list: {
    marginTop: "20px",
  },
  card: {
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "6px",
    background: "#f8f9fc",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  total: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1cc88a",
  },
  error: {
    color: "#e74a3b", // Red for errors
    textAlign: "center",
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#fbeaea",
    borderRadius: "4px",
  },
};
