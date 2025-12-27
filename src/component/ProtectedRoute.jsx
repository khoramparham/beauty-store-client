// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>در حال بررسی دسترسی...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // ذخیره مسیر فعلی برای بازگشت بعد از لاگین
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // اگر کاربر لاگین کرده و به صفحه‌ای مثل login می‌رود، به خانه هدایت شود
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
