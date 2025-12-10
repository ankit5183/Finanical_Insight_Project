import React from "react";
import Sidebar from "./Sidebar";

const ProtectedLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "230px", width: "100%", padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
