import React from "react";

function ToastComponent({ show, message }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,

        backgroundColor: "#626060",
        color: "#d9d9d9",
        padding: "12px 28px",
        borderRadius: "50px",

        fontSize: "15px",
        letterSpacing: "1px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
        textAlign: "center",

        animation: "toastFadeIn 0.3s ease-out",
        pointerEvents: "none",
      }}
    >
      {message}

      <style>
        {`
          @keyframes toastFadeIn {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}
      </style>
    </div>
  );
}

export default ToastComponent;
