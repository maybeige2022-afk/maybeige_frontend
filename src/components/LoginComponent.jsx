import React, { useState } from "react";
import "../styles/LoginComponent.scss";
import axios from "axios";

function LoginComponent({ onLogin, setToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (status) => {
    setIsLogin(status);
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  const handleGoogleAction = () => {
    window.location.href = "http://localhost:8080/api/user/google";
  };

  const handleForgotPassword = async () => {
    let targetEmail = email || window.prompt("請輸入您的註冊 Email：");
    if (!targetEmail) return;

    try {
      setToast({ show: true, message: "正在發送重設郵件..." });
      const response = await axios.post(
        "http://localhost:8080/api/user/forgot-password",
        {
          email: targetEmail.toLowerCase().trim(),
        }
      );
      if (response.data.success)
        setToast({ show: true, message: "重設郵件已發送，請檢查信箱。" });
    } catch (err) {
      const msg =
        err.response?.data?.message || "發送失敗，請確認 Email 是否正確";
      setToast({ show: true, message: msg });
    } finally {
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    }
  };

  const handleAuthSubmit = async (e) => {
    if (e) e.preventDefault();

    const userKey = email.toLowerCase().trim();
    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).+$/;

    if (isLogin) {
      if (!userKey || !password) {
        setToast({ show: true, message: "請輸入帳號與密碼" });
        setTimeout(() => setToast({ show: false, message: "" }), 2000);
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:8080/api/user/login",
          {
            email: userKey,
            password: password,
          }
        );
        if (response.data.success) {
          onLogin(response.data.token, response.data.user);
          setToast({ show: true, message: "登入成功，歡迎回來！" });
        }
      } catch (err) {
        setToast({ show: true, message: "帳號或密碼錯誤" });
      }
    } else {
      if (!name.trim()) {
        setToast({ show: true, message: "請輸入完整姓名" });
      } else if (name.trim().length < 2) {
        setToast({ show: true, message: "姓名長度至少需 2 個字" });
      } else if (!userKey) {
        setToast({ show: true, message: "請輸入電子信箱" });
      } else if (!emailRule.test(userKey)) {
        setToast({ show: true, message: "電子信箱請輸入正確格式" });
      } else if (!password) {
        setToast({ show: true, message: "請輸入密碼" });
      } else if (password.length < 6) {
        setToast({ show: true, message: "密碼至少輸入 6 位數" });
      } else if (!passwordRule.test(password)) {
        setToast({ show: true, message: "密碼需包含至少一個英文與數字" });
      } else {
        try {
          await axios.post("http://localhost:8080/api/user/register", {
            username: name,
            email: userKey,
            password: password,
            phone: "",
          });
          setToast({ show: true, message: "歡迎加入！註冊成功，請登入" });
          setIsLogin(true);
        } catch (err) {
          const errorData = err.response?.data;
          const status = err.response?.status;
          const errorString = (
            typeof errorData === "string"
              ? errorData
              : JSON.stringify(errorData || "")
          ).replace(/["'\s]/g, "");

          const isDuplicate =
            status === 409 ||
            errorString.includes("已註冊") ||
            errorString.includes("exists") ||
            errorString.includes("already") ||
            errorString.includes("註冊過");

          if (isDuplicate) {
            setToast({ show: true, message: "電子信箱已被註冊" });
          } else {
            setToast({ show: true, message: "註冊失敗，請稍後再試" });
          }
        }
      }
    }
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  return (
    <div className="login-page">
      <div className="tab-container">
        <span
          className={isLogin ? "tab-item active" : "tab-item"}
          onClick={() => handleTabChange(true)}
        >
          會員登入
        </span>
        <div className="divider-line"></div>
        <span
          className={!isLogin ? "tab-item active" : "tab-item"}
          onClick={() => handleTabChange(false)}
        >
          加入會員
        </span>
      </div>

      <div className="form-container">
        <form onSubmit={handleAuthSubmit} noValidate autoComplete="off">
          <input type="text" style={{ display: "none" }} tabIndex="-1" />
          <input type="password" style={{ display: "none" }} tabIndex="-1" />

          {isLogin ? (
            <div className="login-form">
              <h3 className="form-title">Email 登入</h3>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Adress 帳號"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  onFocus={(e) => (e.target.autoComplete = "email")}
                  required
                />
              </div>
              <div className="input-group password-group">
                <input
                  type="password"
                  placeholder="Password 會員密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  onFocus={(e) => (e.target.autoComplete = "current-password")}
                  required
                />
                <button
                  type="button"
                  className="forgot-pw-btn"
                  onClick={handleForgotPassword}
                >
                  忘記密碼
                </button>
              </div>
              <button type="submit" className="submit-btn">
                LOGIN
              </button>

              <div className="quick-login">
                <div className="or-divider">
                  <span>快速登入</span>
                </div>
                <button
                  className="google-btn"
                  type="button"
                  onClick={handleGoogleAction}
                >
                  <i className="fa-brands fa-google"></i> SIGN IN WITH GOOGLE
                </button>
              </div>
            </div>
          ) : (
            <div className="register-form">
              <h3 className="form-title">註冊新會員</h3>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name 姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Adress 電子信箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Set Password 設定密碼 (至少6位)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  } toggle-eye`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              <button type="submit" className="submit-btn">
                JOIN US
              </button>

              <div className="quick-login">
                <div className="or-divider">
                  <span>快速註冊</span>
                </div>
                <button
                  className="google-btn"
                  type="button"
                  onClick={handleGoogleAction}
                >
                  <i className="fa-brands fa-google"></i> SIGN UP WITH GOOGLE
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginComponent;
