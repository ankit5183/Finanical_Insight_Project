import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// ⭐ BACKEND URL (Works on Render + Localhost)
const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [categoryData, setCategoryData] = useState({});
  const [totalExpense, setTotalExpense] = useState(0);

  // ⭐ Current Month Budget Data
  const [budgetStatus, setBudgetStatus] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetchCategorySummary();
    fetchTotalExpense();
    fetchCurrentMonthBudget();  // ⭐ Correct API call
  }, []);

  // ⭐ Fetch CURRENT MONTH Budget Status
  const fetchCurrentMonthBudget = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/budget/current`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      if (!response.ok) throw new Error("Failed to load budget");

      const data = await response.json();

      setBudgetStatus({
        totalBudget: data.totalBudget,
        totalSpent: data.totalSpent,
        remaining: data.remaining
      });

    } catch (error) {
      console.error("Budget Status Error:", error);
    }
  };

  // ⭐ Fetch Category Summary
  const fetchCategorySummary = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/dashboard/category-summary`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const formatted = {};
      data.forEach(([category, amount]) => {
        formatted[category] = amount;
      });

      setCategoryData(formatted);

    } catch (error) {
      console.error("Category Summary Error:", error);
    }
  };

  // ⭐ Total Expense
  const fetchTotalExpense = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/dashboard/total-expense`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      if (!response.ok) throw new Error("Failed");

      const total = await response.json();
      setTotalExpense(total);

    } catch (error) {
      console.error("Total Expense Error:", error);
    }
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#e74a3b",
          "#858796"
        ]
      }
    ]
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {/* ⭐ Current Month Budget Card */}
      <div style={styles.card}>
        <h2 style={{ color: "#4e73df" }}>Current Month Budget</h2>
        <p><strong>Total Budget:</strong> ₹ {budgetStatus.totalBudget}</p>
        <p><strong>Spent:</strong> ₹ {budgetStatus.totalSpent}</p>
        <p><strong>Remaining:</strong> ₹ {budgetStatus.remaining}</p>
      </div>

      {/* Total Expense */}
      <div style={styles.card}>
        <h2>Total Expense</h2>
        <p style={styles.total}>₹ {totalExpense.toFixed(2)}</p>
      </div>

      {/* Category Pie Chart */}
      <div style={styles.card}>
        <h2>Category Wise Expense</h2>
        {Object.keys(categoryData).length > 0 ? (
          <Pie data={pieData} />
        ) : (
          <p>No Data Available</p>
        )}
      </div>

    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: "40px",
    background: "#f8f9fc",
    minHeight: "100vh",
    marginLeft: "260px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    textAlign: "center",
    color: "#4e73df",
  },
  card: {
    background: "white",
    padding: "25px",
    marginBottom: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  total: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#1cc88a",
  }
};

export default Dashboard;
