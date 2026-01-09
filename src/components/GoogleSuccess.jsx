import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("current_user_email", email);
      navigate("/account");

      window.location.reload();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        color: "#626060",
      }}
    >
      <h2>登入驗證中...</h2>
      <p>請稍候，即將為您導向會員中心</p>
    </div>
  );
};

export default GoogleSuccess;
