import { Button } from "@mui/material";
import React from "react";

const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Dashboard</h1>
      <Button variant="contained" color="primary" href="/kyc">
        Complete KYC
      </Button>
    </div>
  );
};

export default Dashboard;
