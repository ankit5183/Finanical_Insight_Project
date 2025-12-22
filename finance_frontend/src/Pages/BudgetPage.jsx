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

  // Set default date on load
  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  }, []);

  // Fetch data only when year and month are both present
  useEffect(() => {
    if (year && month) {
      fetchData();
    }
  }, [year, month]);

  const fetchData = async () => {
    // Run both in parallel for better performance
    await Promise.all([fetchMonthlyExpense(), fetchBudgetStatus()]);
  };

  /* -------------------- FETCH MONTHLY EXPENSE -------------------- */
  const fetchMonthlyExpense = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/expense/monthly`, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      const total = response.data.reduce((sum, e) => sum + e.amount, 0);
      setMonthlyExpenses(total);
    } catch (error) {
      console.error("Expense Error:", error);
    }
  };

  /* -------------------- FETCH BUDGET STATUS -------------------- */
 const fetchBudgetStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/budget/status`, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      const backendBudget = response.data.totalAmount;
      const backendSpent = response.data.spent;

      // Update budgetAmount if it exists in the database
      if (backendBudget !== undefined) {
        setBudgetAmount(backendBudget);
      } else {
        setBudgetAmount(""); // Clear if no budget record exists for this month
      }
      
      // Update monthlyExpenses from the budget status
      if (backendSpent !== undefined) {
        setMonthlyExpenses(backendSpent);
      }
    } catch (error) {
      console.error("Budget Status Error:", error);
      // Reset if the API fails (e.g., 404 No Budget Found)
      setBudgetAmount("");
    }
  };
  /* -------------------- SAVE BUDGET -------------------- */
  const saveBudget = async (e) => {
    e.preventDefault();
    const payload = { year: Number(year), month: Number(month), amount: Number(budgetAmount) };

    try {
      await axios.post(`${API_URL}/api/budget/set`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Budget Saved Successfully!");
      fetchData(); // Refresh everything
    } catch (error) {
      setMessage("❌ Error Saving Budget");
    }
  };

  /* -------------------- UPDATE BUDGET -------------------- */
  const updateBudget = async () => {
    const payload = { year: Number(year), month: Number(month), amount: Number(budgetAmount) };
    try {
      await axios.put(`${API_URL}/api/budget/update`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Updated Successfully!");
      fetchData();
    } catch (error) {
      setMessage("❌ Update Failed");
    }
  };

  /* -------------------- DELETE BUDGET -------------------- */
  const deleteBudget = async () => {
    try {
      await axios.delete(`${API_URL}/api/budget/delete`, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Budget Deleted!");
      setBudgetAmount("");
      // Keep expenses visible even if budget is deleted
    } catch (error) {
      setMessage("❌ Delete Failed!");
    }
  };

  /* -------------------- CALCULATIONS -------------------- */
  const budgetVal = Number(budgetAmount) || 0;
  const spentVal = Number(monthlyExpenses) || 0;
  const remaining = budgetVal - spentVal;
  const exceeded = budgetVal > 0 && remaining < 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Monthly Budget Planner</h2>

      <form onSubmit={saveBudget} style={styles.form}>
        <div style={styles.row}>
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            style={{ ...styles.input, flex: 1 }}
          />
          <input
            type="number"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
            style={{ ...styles.input, flex: 1 }}
          />
        </div>

        <input
          type="number"
          placeholder="Budget Amount (e.g. 6000)"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Save Budget</button>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={{ ...styles.button, background: "#f6c23e", flex: 1 }}
            onClick={updateBudget}
          >
            Edit Budget
          </button>
          <button
            type="button"
            style={{ ...styles.button, background: "#e74a3b", flex: 1 }}
            onClick={deleteBudget}
          >
            Delete Budget
          </button>
        </div>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.summaryBox}>
        <h3>Monthly Summary ({month}/{year})</h3>
        <p><strong>Budget Limit:</strong> ₹{budgetVal}</p>
        <p><strong>Total Spent:</strong> ₹{spentVal}</p>
        <hr />
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

// Ensure buttonGroup is added to your styles
const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "25px", background: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#4e73df", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  row: { display: "flex", gap: "10px" },
  input: { padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" },
  button: { padding: "12px", background: "#36b9cc", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer" },
  buttonGroup: { display: "flex", gap: "10px" },
  message: { marginTop: "12px", textAlign: "center", fontWeight: "bold" },
  summaryBox: { marginTop: "25px", padding: "15px", background: "#f8f9fc", borderRadius: "6px", borderLeft: "5px solid #4e73df" },
  exceedText: { color: "red", fontWeight: "bold", marginTop: "8px" },
};

export default BudgetPage;
