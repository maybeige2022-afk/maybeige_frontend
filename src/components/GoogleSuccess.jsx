import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const role = params.get("role");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("current_user_email", email);

      const userObj = { email, role: role || "customer" };
      localStorage.setItem("user", JSON.stringify(userObj));

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
      <h2 style={{ marginBottom: "1rem" }}>登入驗證中...</h2>
      <p style={{ color: "#d9d9d9" }}>請稍候，即將為您導向會員中心</p>
    </div>
  );
};

export default GoogleSuccess;
