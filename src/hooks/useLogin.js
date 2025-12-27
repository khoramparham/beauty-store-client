import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const { login, authError, clearAuthError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      clearAuthError();

      const result = await login(phone, password, rememberMe);

      return result;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "خطای ناشناخته رخ داد",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error: authError,
    clearError: clearAuthError,
  };
};
