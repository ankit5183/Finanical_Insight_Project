import React, { useState } from "react";


function CSVUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

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

    try {
      const response = await axios.post(
        `${API_URL}/api/csv/upload`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("CSV uploaded successfully!");
      setFile(null);

    } catch (error) {
      console.error("CSV Upload Error:", error);
      setMessage("Failed to upload CSV!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Expense CSV</h2>

      <form onSubmit={uploadCSV} style={styles.form}>
        <input type="file" accept=".csv" onChange={handleFileChange} />

        <button type="submit">Upload CSV</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CSVUpload;
