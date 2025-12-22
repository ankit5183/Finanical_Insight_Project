import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../Config";

function MonthlyExpense() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMonthlyExpenses = async (e) => {
    e.preventDefault();

    const url = `${API_URL}/api/expense/monthly?year=${year}&month=${month}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: "Bearer " + token },
      });

      const data = response.data;
      setExpenses(data);
      setSelectedIds([]);
      setMessage("");

      const totalAmount = data.reduce((sum, exp) => sum + exp.amount, 0);
      setTotal(totalAmount);

    } catch (error) {
      setMessage("Error fetching monthly expenses");
    }
  };

  /* ---------------- DELETE HANDLERS ---------------- */

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = (e) => {
    setSelectedIds(
      e.target.checked ? expenses.map((exp) => exp.id) : []
    );
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Select at least one expense");
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/expense/delete-multiple`, {
        headers: { Authorization: "Bearer " + token },
        data: selectedIds,
      });

      const remaining = expenses.filter(
        (exp) => !selectedIds.includes(exp.id)
      );

      setExpenses(remaining);
      setSelectedIds([]);

      const newTotal = remaining.reduce((sum, exp) => sum + exp.amount, 0);
      setTotal(newTotal);

    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Monthly Expense Report</h2>

      <form onSubmit={fetchMonthlyExpenses} style={styles.form}>
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

        <button type="submit" style={styles.button}>
          Get Monthly Expenses
        </button>
      </form>

      {message && <p style={styles.error}>{message}</p>}

      <h3 style={styles.total}>Total Monthly Expense: ₹{total}</h3>

      {/* SELECT ALL + DELETE */}
      {expenses.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={selectedIds.length === expenses.length}
            onChange={selectAll}
          />{" "}
          Select All

          <button
            onClick={deleteSelected}
            style={{ ...styles.button, background: "#e74a3b", marginLeft: "15px" }}
          >
            Delete Selected
          </button>
        </div>
      )}

      <div style={styles.list}>
        {expenses.length > 0 ? (
          expenses.map((exp) => (
            <div key={exp.id} style={styles.card}>
              <input
                type="checkbox"
                checked={selectedIds.includes(exp.id)}
                onChange={() => toggleSelect(exp.id)}
              />
              <p><strong>Date:</strong> {exp.date}</p>
              <p><strong>Category:</strong> {exp.category}</p>
              <p><strong>Amount:</strong> ₹{exp.amount}</p>
            </div>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}

export default MonthlyExpense;


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
  },
  list: {
    marginTop: "20px",
  },
  card: {
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "6px",
    background: "#f8f9fc",
  },
  total: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1cc88a",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "10px",
  },
};

