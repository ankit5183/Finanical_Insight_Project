import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Finance Insight</h2>

      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/add-expense" style={styles.link}>Add Expense</Link>
        <Link to="/weekly-expense" style={styles.link}>Weekly Expense</Link>
        <Link to="/monthly-expense" style={styles.link}>Monthly Expense</Link>
        <Link to="/budget" style={styles.link}>Budget</Link>
        <Link to="/upload-csv" style={styles.link}>CSV Upload</Link>
        <Link to="/login" style={styles.logout}>Logout</Link>
      </nav>
    </div>
  );
}

export default Sidebar;

const styles = {
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#4e73df",
    padding: "20px",
    color: "white",
    position: "fixed",
    left: 0,
    top: 0,
  },
  title: {
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
  logout: {
    marginTop: "30px",
    color: "#f8d7da",
    textDecoration: "none",
    fontSize: "18px",
  },
};
