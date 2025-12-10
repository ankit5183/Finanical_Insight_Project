import React, { useState } from "react";

function CSVUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadCSV = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8080/api/csv/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (response.ok) {
      setMessage("CSV uploaded successfully!");
      setFile(null);
    } else {
      setMessage("Failed to upload CSV");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Expense CSV</h2>

      <form onSubmit={uploadCSV} style={styles.form}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Upload CSV
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default CSVUpload;

// ---------------------- STYLES ----------------------
const styles = {
  container: {
    maxWidth: "450px",
    margin: "50px auto",
    padding: "30px",
    background: "white",
    borderRadius: "8px",
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
    gap: "15px",
  },
  input: {
    padding: "12px",
    background: "#f1f1f1",
    borderRadius: "6px",
  },
  button: {
    padding: "12px",
    background: "#1cc88a",
    color: "white",
    fontSize: "18px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#1cc88a",
  },
};
