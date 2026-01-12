import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ResetPasswordComponent.scss";

const ResetPasswordComponent = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleReset = async (e) => {
    e.preventDefault();
    const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!passwordRule.test(password)) {
      return setStatus({
        type: "error",
        message: "密碼須包含英文字母與數字，且至少 6 位",
      });
    }

    if (password !== confirmPassword) {
      return setStatus({ type: "error", message: "兩次輸入的密碼不一致" });
    }

    try {
      await axios.post(
        `https://maybeige-api.onrender.com/api/user/reset-password/${token}`,
        {
          password: password,
        }
      );
      alert("密碼重設成功，請重新登入");
      navigate("/login");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "連結已失效或過期",
      });
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-container">
        <h2 className="form-title">重設密碼</h2>
        <p className="form-subtitle">請輸入包含英文與數字的新密碼</p>

        <form onSubmit={handleReset}>
          <div className="input-group">
            <input
              type="password"
              placeholder="新密碼 (New Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="確認新密碼 (Confirm Password)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            更新密碼
          </button>
        </form>

        {status.message && (
          <div className={`status-msg ${status.type}`}>{status.message}</div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
