import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Lock, Eye, EyeOff, LogIn, X, AlertCircle } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading, error, clearError } = useLogin();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // پاک کردن خطاها هنگام تایپ
    if (validationError) setValidationError("");
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const phoneDigits = formData.phone.replace(/\D/g, "");

    if (!phoneDigits) {
      setValidationError("لطفاً شماره تلفن را وارد کنید");
      return false;
    }

    if (phoneDigits.length < 10) {
      setValidationError("شماره تلفن باید حداقل ۱۰ رقم باشد");
      return false;
    }

    if (!formData.password) {
      setValidationError("لطفاً رمز عبور را وارد کنید");
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی فرم
    if (!validateForm()) {
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    const result = await handleLogin(phoneDigits, formData.password, rememberMe);

    if (result.success) {
      navigate("/", { replace: true });
    }
  };

  // پاک کردن خطاها
  const clearErrors = () => {
    setValidationError("");
    clearError();
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>ورود به حساب</h1>
          <p className={styles.subtitle}>شماره تلفن و رمز عبور خود را وارد کنید</p>
        </div>

        {/* نمایش خطاهای اعتبارسنجی و API */}
        {(validationError || error) && (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage}>
              <AlertCircle className={styles.errorIcon} size={18} />
              <span>{validationError || error}</span>
              <button
                type="button"
                className={styles.errorCloseButton}
                onClick={clearErrors}
                aria-label="بستن پیغام خطا"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="phone">
                شماره تلفن
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  placeholder="09123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  dir="rtl"
                  maxLength="13"
                  aria-invalid={!!validationError}
                  aria-describedby={validationError ? "phone-error" : undefined}
                />
                <Phone className={styles.inputIcon} size={18} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">
                رمز عبور
              </label>
              <div className={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={styles.input}
                  placeholder="رمز عبور"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  dir="rtl"
                  aria-invalid={!!validationError}
                  aria-describedby={validationError ? "password-error" : undefined}
                />
                <Lock className={styles.inputIcon} size={18} />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.options}>
              <div
                className={styles.rememberMe}
                onClick={() => !isLoading && setRememberMe(!rememberMe)}
                role="checkbox"
                aria-checked={rememberMe}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    !isLoading && setRememberMe(!rememberMe);
                  }
                }}
              >
                <div
                  className={`${styles.checkbox} ${rememberMe ? styles.checked : ""}`}
                  aria-hidden="true"
                />
                <span className={styles.checkboxLabel}>مرا به خاطر بسپار</span>
              </div>

              <button
                type="button"
                className={styles.forgotPassword}
                onClick={() => navigate("/forgot-password")}
                disabled={isLoading}
              >
                فراموشی رمز
              </button>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className={styles.loader} />
                  در حال ورود...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  ورود
                </>
              )}
            </button>
          </form>

          <div className={styles.register}>
            <span>حساب کاربری ندارید؟ </span>
            <button
              type="button"
              className={styles.registerLink}
              onClick={() => navigate("/register")}
              disabled={isLoading}
            >
              ثبت‌نام کنید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
