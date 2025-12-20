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
    if (!token) {
      console.warn("No token found, redirecting or stopping fetch.");
      return;
    }

    const loadDashboardData = async () => {
      // Running these in parallel for better performance
      await Promise.all([
        fetchCategorySummary(),
        fetchTotalExpense(),
        fetchCurrentMonthBudget()
      ]);
    };

    loadDashboardData();
  }, [token]);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchCurrentMonthBudget = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/budget/current`, getHeaders());
      setBudgetStatus({
        totalBudget: response.data.totalBudget || 0,
        totalSpent: response.data.totalSpent || 0,
        remaining: response.data.remaining || 0
      });
    } catch (err) {
      console.error("Budget Status Error:", err);
    }
  };

  const fetchCategorySummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/category-summary`, getHeaders());
      const formatted = {};
      // Ensure response.data is an array before iterating
      if (Array.isArray(response.data)) {
        response.data.forEach(([category, amount]) => {
          formatted[category] = amount;
        });
      }
      setCategoryData(formatted);
    } catch (err) {
      console.error("Category Summary Error:", err);
    }
  };

  const fetchTotalExpense = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/total-expense`, getHeaders());
      setTotalExpense(response.data || 0);
    } catch (err) {
      console.error("Total Expense Error:", err);
    }
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#858796"]
      }
    ]
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Financial Insights Dashboard</h1>

      <div style={styles.grid}>
        {/* Current Month Budget Card */}
        <div style={styles.card}>
          <h2 style={{ color: "#4e73df", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Monthly Budget
          </h2>
          <p><strong>Total Budget:</strong> ₹ {budgetStatus.totalBudget.toLocaleString()}</p>
          <p><strong>Spent:</strong> ₹ {budgetStatus.totalSpent.toLocaleString()}</p>
          <p>
            <strong>Remaining:</strong> 
            <span style={{ color: budgetStatus.remaining < 0 ? "red" : "green", marginLeft: "5px" }}>
              ₹ {budgetStatus.remaining.toLocaleString()}
            </span>
          </p>
        </div>

        {/* Total Expense Card */}
        <div style={styles.card}>
          <h2 style={{ color: "#1cc88a", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Total Outflow
          </h2>
          <p style={styles.total}>₹ {(Number(totalExpense) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Category Pie Chart Card */}
      <div style={{ ...styles.card, maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Spending by Category</h2>
        {Object.keys(categoryData).length > 0 ? (
          <Pie data={pieData} options={{ maintainAspectRatio: true }} />
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>No categorical data available for this period.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f8f9fc",
    minHeight: "100vh",
    marginLeft: "260px", // Assumes a sidebar exists
  },
  title: { fontSize: "2.2rem", marginBottom: "30px", textAlign: "left", color: "#333" },
  grid: { display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" },
  card: {
    flex: "1",
    minWidth: "300px",
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  total: { fontSize: "2.2rem", fontWeight: "bold", marginTop: "15px", color: "#1cc88a" }
};

export default Dashboard;
