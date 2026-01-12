import React from "react";

function ToastComponent({ show, message }) {
  // 如果 show 是 false，就不渲染任何東西
  if (!show) return null;

  return (
    <div
      style={{
        // 定位與層級
        position: "fixed",
        top: "10%", // 距離底部 10% 的位置
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000, // 確保在所有元件最上方

        // 樣式與顏色
        backgroundColor: "#626060", // 你的深灰色
        color: "#d9d9d9", // 你的淺灰色
        padding: "12px 28px",
        borderRadius: "50px", // 膠囊形狀

        // 文字與視覺效果
        fontSize: "15px",
        letterSpacing: "1px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)", // 增加浮空感
        whiteSpace: "nowrap", // 避免文字換行
        textAlign: "center",

        // 動畫
        animation: "toastFadeIn 0.3s ease-out",
        pointerEvents: "none", // 點擊可以穿透它，不會擋到後面的按鈕
      }}
    >
      {message}

      {/* 內嵌動畫定義 */}
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
