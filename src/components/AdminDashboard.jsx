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
          ? token.replace("JWT ", "Bearer ")
          : token?.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

        const response = await axios.get(
          "https://maybeige-api.onrender.com/api/orders/all-orders",
          { headers: { Authorization: formattedToken } }
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

  const renderInvoice = (invoice) => {
    if (!invoice) return <span className="no-invoice">無發票資訊</span>;

    let detailText = "";
    let className = "invoice-tag";

    if (invoice.type === "個人發票") {
      detailText = `載具: ${invoice.carrier || "紙本"}`;
      className += " personal";
    } else if (invoice.type === "法人發票") {
      detailText = `統編: ${invoice.vatNumber}`;
      className += " business";
    } else if (invoice.type === "捐贈發票") {
      detailText = `捐贈碼: ${invoice.donationCode}`;
      className += " donation";
    }

    return (
      <div className="invoice-container">
        <div className="invoice-type">{invoice.type}</div>
        <div className={className}>{detailText}</div>
      </div>
    );
  };

  if (loading) return <div className="admin-status">正在讀取訂單資料...</div>;
  if (error) return <div className="admin-status error">{error}</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>後台訂單管理</h1>
        <p>當前總訂單數：{orders.length} 筆</p>
      </div>

      <div className="order-table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>客戶資訊</th>
              <th>訂單內容</th>
              <th>總金額</th>
              <th>發票資訊</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="order-id-cell">{order.orderId}</td>
                <td>
                  <div className="cust-name">{order.customer?.name}</div>
                  <div className="cust-phone">{order.customer?.phone}</div>
                </td>
                <td>
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item-group">
                      <div className="item-main">
                        {item.name}{" "}
                        <span className="item-qty">x {item.quantity}</span>
                      </div>
                      <div className="item-sub">
                        {item.style} {item.size ? `(${item.size}cm)` : ""}
                      </div>
                    </div>
                  ))}
                </td>
                <td className="order-amount">
                  ${order.total?.toLocaleString()}
                </td>
                <td>{renderInvoice(order.invoice)}</td>
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
