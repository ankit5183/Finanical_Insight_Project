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

  /* -------------------- SET CURRENT MONTH ON LOAD -------------------- */
  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  }, []);

  /* -------------------- FETCH BUDGET STATUS -------------------- */
  useEffect(() => {
    if (year && month) {
      fetchBudgetStatus();
    }
  }, [year, month]);

  const fetchBudgetStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/budget/status`,
        {
          params: { year, month },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBudgetAmount(response.data.budgetAmount ?? "");
      setMonthlyExpenses(response.data.spent ?? 0);

    } catch (error) {
      console.error(
        "Budget Status Error:",
        error.response?.status,
        error.response?.data
      );
    }
  };

  /* -------------------- SAVE BUDGET -------------------- */
  const saveBudget = async (e) => {
    e.preventDefault();

    const payload = {
      year: Number(year),
      month: Number(month),
      amount: Number(budgetAmount),
    };

    try {
      await axios.post(`${API_URL}/api/budget/set`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Budget Saved Successfully");
      fetchBudgetStatus();

    } catch (error) {
      setMessage("❌ Error Saving Budget");
    }
  };

  /* -------------------- UPDATE BUDGET -------------------- */
  const updateBudget = async () => {
    const payload = {
      year: Number(year),
      month: Number(month),
      amount: Number(budgetAmount),
    };

    try {
      const response = await axios.put(
        `${API_URL}/api/budget/update`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        response.status === 200
          ? "✅ Budget Updated Successfully"
          : "❌ Update Failed"
      );

      if (response.status === 200) fetchBudgetStatus();

    } catch (error) {
      setMessage("❌ Update Failed");
    }
  };

  /* -------------------- DELETE BUDGET -------------------- */
  const deleteBudget = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/budget/delete`,
        {
          params: { year, month },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setMessage("✅ Budget Deleted");
        setBudgetAmount("");
        setMonthlyExpenses(0);
      } else {
        setMessage("❌ Delete Failed");
      }

    } catch (error) {
      setMessage("❌ Delete Failed");
    }
  };

  /* -------------------- CALCULATIONS -------------------- */
  const remaining =
    Number(budgetAmount || 0) - Number(monthlyExpenses || 0);

  const exceeded = remaining < 0;

  /* -------------------- UI -------------------- */
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

        <button type="submit" style={styles.button}>
          Save Budget
        </button>

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

        <p>
          <strong>Spent:</strong> ₹{monthlyExpenses}
        </p>

        <p>
          <strong>Remaining:</strong>{" "}
          <span style={{ color: exceeded ? "red" : "green" }}>
            ₹{remaining}
          </span>
        </p>

        {exceeded && (
          <p style={styles.exceedText}>⚠️ Budget Exceeded!</p>
        )}
      </div>
    </div>
  );
}

export default BudgetPage;

/* -------------------- STYLES -------------------- */
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
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  },
  message: {
    marginTop: "12px",
    textAlign: "center",
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
    marginTop: "8px",
  },
};
