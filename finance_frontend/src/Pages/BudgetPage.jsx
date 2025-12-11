import React, { useState, useEffect } from "react";

function BudgetPage() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  // ----------------------------------------------------------
  // Fetch expense + budget whenever year or month changes
  // ----------------------------------------------------------
  useEffect(() => {
    if (year && month) {
      fetchMonthlyExpense();
      fetchBudgetStatus();
    }
  }, [year, month]);

  // ----------------------------------------------------------
  // Fetch monthly expenses
  // ----------------------------------------------------------
  const fetchMonthlyExpense = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/expense/monthly?year=${year}&month=${month}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      if (!response.ok) return;

      const data = await response.json();
      const total = data.reduce((sum, e) => sum + e.amount, 0);
      setMonthlyExpenses(total);

    } catch (error) {
      console.error("Expense Error:", error);
    }
  };

  // ----------------------------------------------------------
  // Fetch budget status
  // ----------------------------------------------------------
  const fetchBudgetStatus = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/budget/status?year=${year}&month=${month}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      if (!response.ok) return;

      const result = await response.json();

      setBudgetAmount(result.budgetAmount || "");
      setMonthlyExpenses(result.spent || 0);

    } catch (error) {
      console.error("Budget Status Error:", error);
    }
  };

  // ----------------------------------------------------------
  // Save new budget
  // ----------------------------------------------------------
  const saveBudget = async (e) => {
    e.preventDefault();

    const payload = {
      year: parseInt(year),
      month: parseInt(month),
      amount: parseFloat(budgetAmount),
    };

    try {
      const response = await fetch(`${API_URL}/api/budget/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();

      setMessage("Budget Saved Successfully!");
      fetchBudgetStatus();

    } catch (error) {
      setMessage("Error Saving Budget");
    }
  };

  // ----------------------------------------------------------
  // Update budget
  // ----------------------------------------------------------
  const updateBudget = async () => {
    const payload = {
      year: parseInt(year),
      month: parseInt(month),
      amount: parseFloat(budgetAmount),
    };

    try {
      const response = await fetch(`${API_URL}/api/budget/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      setMessage(response.ok ? "Updated Successfully!" : "Update Failed");

      if (response.ok) fetchBudgetStatus();

    } catch (error) {
      setMessage("Update Failed");
    }
  };

  // ----------------------------------------------------------
  // Delete budget
  // ----------------------------------------------------------
  const deleteBudget = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/budget/delete?year=${year}&month=${month}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + token } }
      );

      if (response.ok) {
        setMessage("Budget Deleted!");
        setBudgetAmount("");
        setMonthlyExpenses(0);
      } else {
        setMessage("Delete Failed!");
      }

    } catch (error) {
      setMessage("Delete Failed!");
    }
  };

  const remaining = budgetAmount - monthlyExpenses;
  const exceeded = remaining < 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Monthly Budget Planner</h2>

      <form onSubmit={saveBudget} style={styles.form}>

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Budget Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Save Budget</button>

        <button
          type="button"
          style={{ ...styles.button, background: "#f6c23e" }}
          onClick={updateBudget}
        >
          Edit Budget
        </button>

        <button
          type="button"
          style={{ ...styles.button, background: "#e74a3b" }}
          onClick={deleteBudget}
        >
          Delete Budget
        </button>

      </form>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.summaryBox}>
        <h3>Monthly Summary</h3>
        <p><strong>Spent:</strong> ₹{monthlyExpenses}</p>
        <p>
          <strong>Remaining:</strong>{" "}
          <span style={{ color: exceeded ? "red" : "green" }}>
            ₹{remaining}
          </span>
        </p>

        {exceeded && <p style={styles.exceedText}>⚠️ Budget Exceeded!</p>}
      </div>
    </div>
  );
}

export default BudgetPage;

// ----------------------------------------------------------
// STYLES
// ----------------------------------------------------------
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "25px",
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
    background: "#36b9cc",
    color: "white",
    borderRadius: "6px",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    color: "#1cc88a",
    fontWeight: "bold",
  },
  summaryBox: {
    marginTop: "25px",
    padding: "15px",
    background: "#f8f9fc",
    borderRadius: "6px",
  },
  exceedText: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
};
