import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "./Pages/WelcomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Sidebar from "./components/Sidebar";
import AddExpense from "./Pages/AddExpense";
import WeeklyExpense from "./Pages/WeeklyExpense";
import MonthlyExpense from "./Pages/MonthlyExpense";
import BudgetPage from "./Pages/BudgetPage";
import CSVUpload from "./Pages/CSVUpload";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Visible without Sidebar */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Visible only with Sidebar */}
         <Route
                  path="/dashboard"
                  element={
                    <div style={{ display: "flex" }}>
                      <Sidebar />
                      <Dashboard />
                    </div>
                  }
                />
        <Route
          path="/add-expense"
          element={<ProtectedLayout><AddExpense /></ProtectedLayout>}
        />
        <Route
          path="/weekly-expense"
          element={<ProtectedLayout><WeeklyExpense /></ProtectedLayout>}
        />
        <Route
          path="/monthly-expense"
          element={<ProtectedLayout><MonthlyExpense /></ProtectedLayout>}
        />
        <Route
          path="/budget"
          element={<ProtectedLayout><BudgetPage /></ProtectedLayout>}
        />
        <Route
          path="/upload-csv"
          element={<ProtectedLayout><CSVUpload /></ProtectedLayout>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
