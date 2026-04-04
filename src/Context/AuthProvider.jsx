import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import { getData, updateData, addData } from "../Utils/Api/GetDataApi";
import { hashPassword, comparePassword } from "../Utils/BcryptPassword";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const me = async () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));

      if (!storedUser) {
        setAuthenticated(false);
        setLoading(false);
        return null;
      }

      const users = await getData("users");

      const found = users.find(
        (u) => u.email.toLowerCase() === storedUser.email.toLowerCase(),
      );

      if (!found) {
        logout();
        return null;
      }

      const safeUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.roleValue?.toLowerCase(),
        kycStatus: found.kycStatus || null,
      };

      setUser(safeUser);
      setAuthenticated(true);

      return safeUser;
    } catch (err) {
      console.error("Me error:", err);
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await me();
    };
    initialize();
  }, []);

  const login = async (data) => {
    try {
      const users = await getData("users");

      const found = users.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase(),
      );

      if (!found) {
        return { success: false, message: "Invalid email or password" };
      }

      const match = await comparePassword(data.password, found.password);

      if (!match) {
        return { success: false, message: "Invalid email or password" };
      }

      const safeUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.roleValue,
        kycStatus: found.kycStatus || null,
      };

      setUser(safeUser);
      setAuthenticated(true);

      sessionStorage.setItem("user", JSON.stringify(safeUser));

      return { success: true, user: safeUser };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Login failed" };
    }
  };

  const createProfile = async (data) => {
    try {
      const users = await getData("users");

      const exists = users.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase(),
      );

      if (exists) {
        return { success: false, message: "Email already exists" };
      }

      const hashedPassword = await hashPassword(data.password);

      await addData("users", {
        name: data.name,
        email: data.email.toLowerCase(),
        roleValue: "customer",
        password: hashedPassword,
        kycStatus: null,
      });

      return { success: true };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    sessionStorage.removeItem("user");
  };

  const updateProfile = async (data) => {
    try {
      const users = await getData("users");

      const exists = users.find(
        (u) =>
          u.email.toLowerCase() === data.email.toLowerCase() &&
          u.id !== user.id,
      );

      if (exists) {
        return { success: false, message: "Email already exists" };
      }

      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email.toLowerCase(),
      };

      await updateData("users", user.id, updatedUser);

      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      return { success: true };
    } catch (err) {
      return { success: false, message: "Update failed" };
    }
  };
  const updatePassword = async ({ oldPassword, password }) => {
    try {
      const users = await getData("users");

      const found = users.find(
        (u) => u.email.toLowerCase() === user.email.toLowerCase(),
      );

      if (!found) {
        return { success: false, message: "User not found" };
      }

      const match = await comparePassword(oldPassword, found.password);

      if (!match) {
        return { success: false, message: "Current password is incorrect" };
      }

      const hashedPassword = await hashPassword(password);

      await updateData("users", found.id, {
        ...found,
        password: hashedPassword,
      });

      return { success: true, message: "Password updated successfully" };
    } catch (err) {
      console.error("Update password error:", err);
      return { success: false, message: "Update failed" };
    }
  };
  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        authenticated,
        loading,
        updateProfile,
        createProfile,
        updatePassword,
        isAdmin,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
