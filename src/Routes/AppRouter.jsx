import { Routes, Route } from "react-router-dom";
import AuthGuard from "./Guards/AuthGuard";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Kyc from "../Pages/Kyc";
import KycStatus from "../Pages/KycStatus";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/kyc"
        element={
          <AuthGuard roles={["customer"]}>
            <Kyc />
          </AuthGuard>
        }
      />
      <Route
        path="/kyc-status"
        element={
          <AuthGuard roles={["customer"]}>
            <KycStatus />
          </AuthGuard>
        }
      />
    </Routes>
  );
};
