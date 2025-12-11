import React, { useState } from "react";


function AddExpense() {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Correct Render backend URL
  const API_URL = process.env.REACT_APP_API_URL;

  const handleAddExpense = async (e) => {
    e.preventDefault();

    // Convert yyyy-mm-dd → dd-MM-yyyy
    const formatToDDMMYYYY = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const expense = {
      amount: parseFloat(amount),
      title: title,
      category: category,
      date: formatToDDMMYYYY(date),
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/expense/add`,
        expense,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setMessage("Expense added successfully!");
      setAmount("");
      setTitle("");
      setCategory("");
      setDate("");

    } catch (error) {
      console.error("Expense Add Error:", error);
      setMessage("Failed to add expense! Check console logs.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Expense</h2>

      <form onSubmit={handleAddExpense} style={styles.form}>
        
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Expense
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default AddExpense;

// -------------------- STYLES --------------------

const styles = {
  container: {
    maxWidth: "450px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#4e73df",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    background: "#1cc88a",
    color: "white",
    fontSize: "18px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#1cc88a",
  },
};
