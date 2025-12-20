import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../Config";

function CSVUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Clear message when new file is picked
  };

  const uploadCSV = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Please select a CSV file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/csv/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ " + response.data);
      setFile(null);
      // Reset the file input field manually
      e.target.reset(); 
    } catch (error) {
      console.error("CSV Upload Error:", error);
      const errorMsg = error.response?.data || "Failed to upload CSV!";
      setMessage("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Bulk Expense Upload</h2>
        <p style={styles.subtitle}>Select a .csv file containing your transactions</p>

        <form onSubmit={uploadCSV} style={styles.form}>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={styles.fileInput}
          />
          <button 
            type="submit" 
            disabled={loading} 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
          >
            {loading ? "Processing..." : "Upload & Save Expenses"}
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.messageBox, 
            color: message.includes("✅") ? "#1cc88a" : "#e74a3b"
          }}>
            {message}
          </div>
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
    marginLeft: "260px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  title: { color: "#4e73df", marginBottom: "10px" },
  subtitle: { color: "#858796", marginBottom: "25px", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  fileInput: {
    padding: "10px",
    border: "2px dashed #d1d3e2",
    borderRadius: "8px",
    cursor: "pointer",
  },
  button: {
    padding: "12px",
    background: "#4e73df",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },
  messageBox: {
    marginTop: "20px",
    fontWeight: "bold",
    fontSize: "0.95rem",
  }
};

export default CSVUpload;
