import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { API_URL } from "../Config";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [categoryData, setCategoryData] = useState({});
  const [totalExpense, setTotalExpense] = useState(0);

  const [budgetStatus, setBudgetStatus] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
  });

  const [hasBudget, setHasBudget] = useState(false);
  const token = localStorage.getItem("token");

  /* -------------------- INITIAL LOAD -------------------- */
  useEffect(() => {
    if (!token) return;
    fetchCategorySummary();
    fetchTotalExpense();
    fetchCurrentMonthBudget();
  }, [token]);

  /* -------------------- CURRENT MONTH BUDGET -------------------- */
  const fetchCurrentMonthBudget = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/budget/current`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const totalBudget = Number(response.data.totalBudget || 0);
      const totalSpent = Number(response.data.totalSpent || 0);
      const remaining = Number(response.data.remaining || 0);

      // 🔥 If no budget exists, we force the values to 0 for display
      if (totalBudget === 0) {
        setBudgetStatus({ totalBudget: 0, totalSpent: 0, remaining: 0 });
        setHasBudget(false);
      } else {
        setBudgetStatus({ totalBudget, totalSpent, remaining });
        setHasBudget(true);
      }

    } catch (error) {
      console.error("Current Budget Error:", error);
    }
  };

  /* -------------------- CATEGORY SUMMARY -------------------- */
  const fetchCategorySummary = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/category-summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const formatted = {};
      response.data.forEach(([category, amount]) => { formatted[category] = amount; });
      setCategoryData(formatted);
    } catch (error) { console.error("Category Summary Error:", error); }
  };

  /* -------------------- TOTAL EXPENSE -------------------- */
  const fetchTotalExpense = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/total-expense`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalExpense(Number(response.data || 0));
    } catch (error) { console.error("Total Expense Error:", error); }
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#858796"],
    }],
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {/* ⭐ CURRENT MONTH BUDGET - Conditional Display */}
      <div style={styles.card}>
        <h2 style={{ color: "#4e73df" }}>Current Month Budget</h2>
        
        <p><strong>Total Budget:</strong> ₹ {budgetStatus.totalBudget}</p>
        
        {/* Only show actual Spent and Remaining if budget is set, otherwise show 0 */}
        <p><strong>Spent:</strong> ₹ {hasBudget ? budgetStatus.totalSpent : 0}</p>
        <p>
          <strong>Remaining:</strong>{" "}
          <span style={{ color: budgetStatus.remaining < 0 ? "red" : "green" }}>
            ₹ {hasBudget ? budgetStatus.remaining : 0}
          </span>
        </p>

        {/* ⚠️ INFO MESSAGE */}
        {!hasBudget && (
          <p style={{ color: "#e74a3b", marginTop: "10px", fontWeight: "bold" }}>
            ⚠️ Budget is not set for the current month
          </p>
        )}
      </div>

      {/* TOTAL EXPENSE */}
      <div style={styles.card}>
        <h2>Total Expense</h2>
        <p style={styles.total}>₹ {totalExpense.toFixed(2)}</p>
      </div>

      {/* CATEGORY PIE */}
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

const styles = {
  container: { padding: "40px", background: "#f8f9fc", minHeight: "100vh", marginLeft: "260px" },
  title: { fontSize: "2.5rem", marginBottom: "20px", textAlign: "center", color: "#4e73df" },
  card: { background: "white", padding: "25px", marginBottom: "30px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  total: { fontSize: "2rem", fontWeight: "bold", marginTop: "10px", color: "#1cc88a" },
};

export default Dashboard;
