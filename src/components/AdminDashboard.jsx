import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.scss";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const formattedToken = token?.startsWith("JWT ")
          ? token
          : `JWT ${token}`;

        const response = await axios.get(
          "https://maybeige-api.onrender.com/api/orders/all-orders",
          {
            headers: { Authorization: formattedToken },
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("抓取訂單失敗:", err);
        setError("無法取得訂單資料，請確認管理員權限。");
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  if (loading) return <div className="admin-status">正在讀取訂單資料...</div>;
  if (error) return <div className="admin-status error">{error}</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>MAYBEIGE 後台管理</h1>
        <p>當前總訂單數：{orders.length} 筆</p>
      </div>

      <div className="order-table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>客戶名稱</th>
              <th>電話</th>
              <th>訂單內容</th>
              <th>總金額</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ fontSize: "12px", color: "#999" }}>
                  {order.orderId}
                </td>
                <td>{order.customer?.name}</td>
                <td>{order.customer?.phone}</td>
                <td>
                  {order.items &&
                    order.items.map((item, index) => (
                      <div key={index} className="order-item-detail">
                        {item.name} {item.size ? `(${item.size})` : ""} x{" "}
                        {item.quantity}
                      </div>
                    ))}
                </td>
                <td className="order-amount">${order.total}</td>
                <td>
                  <span className="status-badge">
                    {order.status || "處理中"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
