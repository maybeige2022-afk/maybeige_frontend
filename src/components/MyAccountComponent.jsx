import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MyAccountComponent.scss";

function MyAccountComponent({ onLogout, setToast }) {
  const [userInfo, setUserInfo] = useState({ email: "", name: "", phone: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("JWT ")
          ? token.replace("JWT ", "Bearer ")
          : token?.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

        const [userRes, orderRes] = await Promise.all([
          axios.get("https://maybeige-api.onrender.com/api/user/profile", {
            headers: { Authorization: formattedToken },
          }),
          axios.get("https://maybeige-api.onrender.com/api/orders/my-orders", {
            headers: { Authorization: formattedToken },
          }),
        ]);

        setUserInfo({
          email: userRes.data.email,
          name: userRes.data.username || "",
          phone: userRes.data.phone || "",
        });

        setOrders(orderRes.data);
      } catch (error) {
        console.error("資料讀取失敗", error);
        if (setToast) setToast({ show: true, message: "資料讀取失敗" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setToast]);

  const handleUpdate = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.replace("JWT ", "Bearer ");
      const response = await axios.patch(
        "https://maybeige-api.onrender.com/api/user/update-info",
        { username: userInfo.name, phone: userInfo.phone },
        { headers: { Authorization: formattedToken } }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: type === "name" ? "姓名已成功變更" : "電話已成功變更",
        });
        const currentEmail = localStorage.getItem("current_user_email");
        const allUsers = JSON.parse(localStorage.getItem("all_users") || "{}");
        allUsers[currentEmail] = { ...userInfo };
        localStorage.setItem("all_users", JSON.stringify(allUsers));
      }
    } catch (error) {
      setToast({ show: true, message: "變更失敗" });
    } finally {
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    }
  };

  return (
    <div className="my-account-page">
      <div className="account-container">
        <div className="page-header">會 員 中 心</div>

        <section className="info-section">
          <div className="section-title">會 員 資 訊</div>
          <div className="info-content">
            <div className="info-row">
              <label>電子郵件</label>
              <span className="email-text">{userInfo.email}</span>
            </div>
            <div className="info-row">
              <label>姓名</label>
              <div className="input-with-btn">
                <input
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                />
                <button
                  className="change-btn"
                  onClick={() => handleUpdate("name")}
                >
                  變 更
                </button>
              </div>
            </div>
            <div className="info-row">
              <label>電話</label>
              <div className="input-with-btn">
                <input
                  value={
                    userInfo.phone === "00000000" || !userInfo.phone
                      ? ""
                      : userInfo.phone
                  }
                  placeholder="尚未設定"
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, phone: e.target.value })
                  }
                />
                <button
                  className="change-btn"
                  onClick={() => handleUpdate("phone")}
                >
                  變 更
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="order-section">
          <div className="section-title">訂 單 查 詢</div>
          <div className="order-table-container">
            {loading ? (
              <p className="loading-text">讀取中...</p>
            ) : (
              <table className="order-table">
                <thead>
                  <tr>
                    <th>訂單編號</th>
                    <th>日期</th>
                    <th>狀態</th>
                    <th>總計</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order.orderId?.slice(-6)}</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>{order.status}</td>
                      <td>NT${order.total?.toLocaleString()}</td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => setSelectedOrder(order)}
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="no-data">
                        目前尚無訂單紀錄
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <button className="logout-footer-btn" onClick={onLogout}>
          登 出
        </button>
      </div>

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-x" onClick={() => setSelectedOrder(null)}>
              ×
            </button>
            <h3>訂 單 詳 情</h3>
            <p className="order-id-sub">#{selectedOrder.orderId?.slice(-6)}</p>

            <div className="modal-body">
              <div className="detail-group">
                <p>
                  <strong>收件人：</strong>
                  {selectedOrder.customer?.name}
                </p>
                <p>
                  <strong>電話：</strong>
                  {selectedOrder.customer?.phone}
                </p>
                <p>
                  <strong>付款方式：</strong>
                  {selectedOrder.paymentMethod}
                </p>
              </div>

              <div className="modal-divider"></div>

              <div className="items-list">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="item-detail">
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-spec">
                        {item.style} / {item.size}cm
                      </div>
                    </div>
                    <div className="item-price-qty">
                      <span>x{item.quantity}</span>
                      <span>NT${item.price?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-divider"></div>

              <div className="price-summary">
                <p>
                  運費：
                  <span>
                    NT${(selectedOrder.shippingFee || 0).toLocaleString()}
                  </span>
                </p>
                <p>
                  折抵：
                  <span>
                    - NT${(selectedOrder.discount || 0).toLocaleString()}
                  </span>
                </p>
                <p className="final-total">
                  總計：NT${selectedOrder.total?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAccountComponent;
