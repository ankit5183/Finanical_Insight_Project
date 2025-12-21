import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../Config";

function BudgetPage() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  /* -------------------- SET CURRENT DATE ON LOAD -------------------- */
  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  }, []);

  /* -------------------- FETCH BUDGET STATUS (MANUAL SEARCH) -------------------- */
  const handleSearch = async () => {
    if (!year || !month) {
      setMessage("⚠️ Please enter both Year and Month");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/budget/status`, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the states with found data or defaults
      setBudgetAmount(response.data.budgetAmount || "");
      setMonthlyExpenses(response.data.spent || 0);
      setMessage("🔍 Data fetched for " + month + "/" + year);
    } catch (error) {
      console.error("Search Error:", error);
      setMessage("❌ Could not find data for this period");
    }
  };

  /* -------------------- SAVE / UPDATE / DELETE ACTIONS -------------------- */
  const saveBudget = async (e) => {
    e.preventDefault();
    const payload = { year: Number(year), month: Number(month), amount: Number(budgetAmount) };
    try {
      await axios.post(`${API_URL}/api/budget/set`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Budget Saved Successfully");
      handleSearch(); // Refresh numbers
    } catch (error) { setMessage("❌ Error Saving Budget"); }
  };

  const updateBudget = async () => {
    const payload = { year: Number(year), month: Number(month), amount: Number(budgetAmount) };
    try {
      await axios.put(`${API_URL}/api/budget/update`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Budget Updated Successfully");
      handleSearch();
    } catch (error) { setMessage("❌ Update Failed"); }
  };

  const deleteBudget = async () => {
    try {
      await axios.delete(`${API_URL}/api/budget/delete`, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Budget Deleted");
      setBudgetAmount("");
      setMonthlyExpenses(0);
    } catch (error) { setMessage("❌ Delete Failed"); }
  };

  /* -------------------- CALCULATIONS -------------------- */
  const budgetVal = Number(budgetAmount) || 0;
  const spentVal = Number(monthlyExpenses) || 0;
  const remaining = budgetVal - spentVal;
  const exceeded = budgetVal > 0 && remaining < 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Monthly Budget Planner</h2>

      <div style={styles.form}>
        {/* Step 1: Search Section */}
        <div style={styles.row}>
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ ...styles.input, flex: 1 }}
          />
          <input
            type="number"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ ...styles.input, flex: 1 }}
          />
        </div>

        <button type="button" onClick={handleSearch} style={styles.searchButton}>
          🔍 Check Budget & Expenses
        </button>

        <hr style={styles.divider} />

        {/* Step 2: Management Section */}
        <label style={styles.label}>Set/Edit Budget Amount:</label>
        <input
          type="number"
          placeholder="Budget Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttonGroup}>
          <button onClick={saveBudget} style={styles.saveBtn}>Save</button>
          <button onClick={updateBudget} style={styles.editBtn}>Update</button>
          <button onClick={deleteBudget} style={styles.deleteBtn}>Delete</button>
        </div>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.summaryBox}>
        <h3>Summary for {month}/{year}</h3>
        <p><strong>Total Budget:</strong> ₹{budgetVal}</p>
        <p><strong>Spent:</strong> ₹{spentVal}</p>
        <p>
          <strong>Remaining:</strong>{" "}
          <span style={{ color: exceeded ? "red" : "green", fontWeight: "bold" }}>
            ₹{remaining}
          </span>
        </p>
        {exceeded && <p style={styles.exceedText}>⚠️ Budget Exceeded!</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "25px", background: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#4e73df", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  row: { display: "flex", gap: "10px" },
  input: { padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" },
  label: { fontSize: "14px", fontWeight: "bold", color: "#555" },
  divider: { margin: "10px 0", border: "0", borderTop: "1px solid #eee" },
  searchButton: { padding: "12px", background: "#4e73df", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  buttonGroup: { display: "flex", gap: "10px" },
  saveBtn: { flex: 1, padding: "12px", background: "#1cc88a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  editBtn: { flex: 1, padding: "12px", background: "#f6c23e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { flex: 1, padding: "12px", background: "#e74a3b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  message: { marginTop: "12px", textAlign: "center", fontWeight: "bold", color: "#4e73df" },
  summaryBox: { marginTop: "25px", padding: "15px", background: "#f8f9fc", borderRadius: "6px", borderLeft: "5px solid #4e73df" },
  exceedText: { color: "red", fontWeight: "bold", marginTop: "8px" },
};

export default BudgetPage;
