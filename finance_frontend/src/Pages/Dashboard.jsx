import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../Config";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [categoryData, setCategoryData] = useState({});
  const [totalExpense, setTotalExpense] = useState(0);

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
    fetchCurrentMonthBudget();
  }, []);

  // ⭐ Fetch CURRENT MONTH Budget
  const fetchCurrentMonthBudget = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/budget/current`, {
        headers: { Authorization: "Bearer " + token }
      });

      setBudgetStatus({
        totalBudget: response.data.totalBudget,
        totalSpent: response.data.totalSpent,
        remaining: response.data.remaining
      });

    } catch (err) {
      console.error("Budget Status Error:", err);
    }
  };

  // ⭐ Fetch Category Wise Expense
  const fetchCategorySummary = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/category-summary`,
        { headers: { Authorization: "Bearer " + token } }
      );

      const formatted = {};
      response.data.forEach(([category, amount]) => {
        formatted[category] = amount;
      });

      setCategoryData(formatted);

    } catch (err) {
      console.error("Category Summary Error:", err);
    }
  };

  // ⭐ Fetch Total Expense
  const fetchTotalExpense = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/total-expense`,
        { headers: { Authorization: "Bearer " + token } }
      );

      setTotalExpense(response.data);

    } catch (err) {
      console.error("Total Expense Error:", err);
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

      {/* ⭐ Current Month Budget */}
      <div style={styles.card}>
        <h2 style={{ color: "#4e73df" }}>Current Month Budget</h2>
        <p><strong>Total Budget:</strong> ₹ {budgetStatus.totalBudget}</p>
        <p><strong>Spent:</strong> ₹ {budgetStatus.totalSpent}</p>
        <p><strong>Remaining:</strong> ₹ {budgetStatus.remaining}</p>
      </div>

      {/* ⭐ Total Expense */}
      <div style={styles.card}>
        <h2>Total Expense</h2>
        <p style={styles.total}>₹ {totalExpense.toFixed(2)}</p>
      </div>

      {/* ⭐ Category Pie Chart */}
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

// ------------------- Styles -------------------
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
