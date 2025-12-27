import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // بررسی وضعیت Auth هنگام لود اولیه
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      // اعتبارسنجی توکن با API
      // اگر API بررسی توکن دارید، اینجا فراخوانی کنید
      const response = await api.get("/auth/verify");

      // در حال حاضر فقط بررسی می‌کنیم که توکن وجود دارد
      const userData = JSON.parse(localStorage.getItem("userData") || "null");

      if (userData) {
        setUser(userData);
        setAuthHeaders(token); // تنظیم هدر Authorization
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout(); // اگر توکن معتبر نیست، خروج می‌دهیم
    } finally {
      setIsLoading(false);
    }
  };

  // تنظیم هدر Authorization برای تمام درخواست‌ها
  const setAuthHeaders = (token) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // حذف هدر Authorization
  const clearAuthHeaders = () => {
    delete api.defaults.headers.common["Authorization"];
  };

  // دریافت توکن از localStorage
  const getAccessToken = () => {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  };

  // دریافت refresh token
  const getRefreshToken = () => {
    return (
      localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")
    );
  };

  // ذخیره توکن‌ها
  const saveTokens = (accessToken, refreshToken, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    } else {
      sessionStorage.setItem("access_token", accessToken);
      sessionStorage.setItem("refresh_token", refreshToken);
    }
    setAuthHeaders(accessToken);
  };

  // ذخیره اطلاعات کاربر
  const saveUserData = (userData, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
    setUser(userData);
  };

  // لاگین با شماره تلفن و رمز عبور
  const login = async (phone, password, rememberMe = false) => {
    try {
      setAuthError(null);

      const response = await api.post("/auth/login", {
        phone,
        password,
      });

      if (!response.success) {
        throw new Error(response.message || "خطا در ورود");
      }

      const { access_token, refresh_token } = response.data;

      // ذخیره توکن‌ها
      saveTokens(access_token, refresh_token, rememberMe);

      // ساخت اطلاعات کاربر پایه
      const userData = {
        phone: phone,
        loggedInAt: new Date().toISOString(),
      };
      saveUserData(userData, rememberMe);

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "خطا در ورود. لطفاً مجدداً تلاش کنید.";

      if (error.response) {
        const serverError = error.response.data;
        errorMessage = serverError.message || "خطای سرور";

        // خطاهای خاص API
        switch (serverError.statusCode) {
          case 400:
            errorMessage = "شماره تلفن یا رمز عبور اشتباه است";
            break;
          case 401:
            errorMessage = "احراز هویت ناموفق بود";
            break;
          case 404:
            errorMessage = "کاربر یافت نشد";
            break;
          case 429:
            errorMessage = "تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید";
            break;
          case 500:
            errorMessage = "خطای سرور. لطفاً بعداً تلاش کنید";
            break;
          default:
            errorMessage = serverError.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "خطای اتصال به سرور. لطفاً اتصال اینترنت را بررسی کنید";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setAuthError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // رفرش توکن
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      if (response.success) {
        const { access_token, refresh_token: newRefreshToken } = response.data;

        // بررسی نوع ذخیره‌سازی (localStorage یا sessionStorage)
        const isPersistent = !!localStorage.getItem("refresh_token");

        saveTokens(access_token, newRefreshToken, isPersistent);
        return access_token;
      } else {
        throw new Error(response.message || "Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  }, []);

  // خروج از حساب
  const logout = () => {
    // درخواست به API برای باطل کردن توکن (اختیاری)
    // try {
    //   const refreshToken = getRefreshToken();
    //   if (refreshToken) {
    //     api.post('/auth/logout', { refresh_token: refreshToken });
    //   }
    // } catch (error) {
    //   console.error('Logout API call failed:', error);
    // }

    // پاک کردن localStorage و sessionStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userData");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("userData");

    // پاک کردن هدر Authorization
    clearAuthHeaders();

    // ریست کردن state
    setUser(null);
    setAuthError(null);
  };

  // Interceptor برای مدیریت توکن منقضی شده
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // اگر خطا 401 بود و توکن منقضی شده، سعی می‌کنیم رفرش کنیم
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // اگر رفرش هم موفق نبود، خروج می‌دهیم
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken]);

  const value = {
    user,
    isLoading,
    authError,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!getAccessToken(),
    getAccessToken,
    clearAuthError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
