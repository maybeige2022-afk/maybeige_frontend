import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.scss";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("全部");

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

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm);

    const matchesStatus =
      filterStatus === "全部" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("JWT ")
        ? token.replace("JWT ", "Bearer ")
        : token?.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      await axios.patch(
        `https://maybeige-api.onrender.com/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: formattedToken } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("更新訂單狀態失敗:", err);
      alert("更新失敗，請確認網路或管理員權限");
    }
  };

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

      <div className="admin-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜尋訂單編號、姓名或電話..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="全部">所有狀態</option>
            <option value="處理中">處理中</option>
            <option value="運送中">運送中</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
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
              <th>狀態更新</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
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
                  <select
                    className={`status-select ${order.status}`}
                    value={order.status || "處理中"}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="處理中">處理中</option>
                    <option value="運送中">運送中</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                  </select>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="no-results">
                  找不到符合搜尋條件的訂單
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
