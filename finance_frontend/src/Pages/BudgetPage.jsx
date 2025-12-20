import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../Config";

function BudgetPage() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Load data whenever year or month changes
  useEffect(() => {
    if (year && month) {
      fetchMonthlyData();
    }
  }, [year, month]);

  const fetchMonthlyData = async () => {
    try {
      await Promise.all([fetchMonthlyExpense(), fetchBudgetStatus()]);
    } catch (error) {
      console.error("Error loading monthly data:", error);
    }
  };

  // 1. Fetch monthly expenses (Changed to GET for standard fetching)
  const fetchMonthlyExpense = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/expense/monthly?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = Array.isArray(response.data) ? response.data : [];
      const total = data.reduce((sum, e) => sum + (e.amount || 0), 0);
      setMonthlyExpenses(total);
    } catch (error) {
      console.error("Monthly Expense Error:", error);
    }
  };

  // 2. Fetch budget status
  const fetchBudgetStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/budget/status?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { budgetAmount, spent } = response.data;
      setBudgetAmount(budgetAmount || 0);
      setMonthlyExpenses(spent || 0);
    } catch (error) {
      console.error("Budget Status Error:", error);
    }
  };

  // 3. Save budget
  const saveBudget = async (e) => {
    e.preventDefault();
    const payload = { year: parseInt(year), month: parseInt(month), amount: parseFloat(budgetAmount) };

    try {
      await axios.post(`${API_URL}/api/budget/set`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Budget Saved Successfully!");
      fetchBudgetStatus();
    } catch (error) {
      setMessage("❌ Error Saving Budget");
    }
  };

  // 4. Update Budget
  const updateBudget = async () => {
    const payload = { year: parseInt(year), month: parseInt(month), amount: parseFloat(budgetAmount) };

    try {
      await axios.put(`${API_URL}/api/budget/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Updated Successfully!");
      fetchBudgetStatus();
    } catch (error) {
      setMessage("❌ Update Failed");
    }
  };

  // 5. Delete Budget
  const deleteBudget = async () => {
    try {
      await axios.delete(`${API_URL}/api/budget/delete?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Budget Deleted!");
      setBudgetAmount(0);
      setMonthlyExpenses(0);
    } catch (error) {
      setMessage("❌ Delete Failed!");
    }
  };

  const remaining = budgetAmount - monthlyExpenses;
  const exceeded = remaining < 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Monthly Budget Planner</h2>

      <form onSubmit={saveBudget} style={styles.form}>
        <div style={styles.row}>
          <input
            type="number"
            placeholder="Year (e.g. 2025)"
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
        </div>

        <input
          type="number"
          placeholder="Budget Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Save Budget</button>

        <div style={styles.buttonGroup}>
          <button type="button" style={{ ...styles.smallButton, background: "#f6c23e" }} onClick={updateBudget}>
            Edit
          </button>
          <button type="button" style={{ ...styles.smallButton, background: "#e74a3b" }} onClick={deleteBudget}>
            Delete
          </button>
        </div>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.summaryBox}>
        <h3 style={{ margin: "0 0 10px 0" }}>Monthly Summary</h3>
        <p><strong>Spent:</strong> ₹{monthlyExpenses.toLocaleString()}</p>
        <p>
          <strong>Remaining:</strong>{" "}
          <span style={{ color: exceeded ? "#e74a3b" : "#1cc88a", fontWeight: "bold" }}>
            ₹{remaining.toLocaleString()}
          </span>
        </p>

        {exceeded && <p style={styles.exceedText}>⚠️ Warning: Budget Exceeded!</p>}
      </div>
    </div>
  );
}

export default BudgetPage;

// -------------------- STYLES --------------------
const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: { textAlign: "center", color: "#4e73df", marginBottom: "25px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  row: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d3e2",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "14px",
    background: "#4e73df",
    color: "white",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  buttonGroup: { display: "flex", gap: "10px" },
  smallButton: {
    flex: 1,
    padding: "10px",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  message: { marginTop: "15px", textAlign: "center", color: "#4e73df", fontWeight: "600" },
  summaryBox: {
    marginTop: "30px",
    padding: "20px",
    background: "#f8f9fc",
    borderRadius: "10px",
    borderLeft: "5px solid #4e73df",
  },
  exceedText: { color: "#e74a3b", fontWeight: "bold", marginTop: "10px", textAlign: "center" },
};
