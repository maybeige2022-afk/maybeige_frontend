import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/CheckoutComponent.scss";

function CheckoutComponent({ cartItems = [], setToast, clearCart }) {
  const navigate = useNavigate();
  const currentEmail = localStorage.getItem("current_user_email") || "";
  const allUsers = JSON.parse(localStorage.getItem("all_users") || "{}");
  const currentUserData = allUsers[currentEmail] || {};

  const [paymentMethod, setPaymentMethod] = useState("信用卡支付");
  const [isAgreed, setIsAgreed] = useState(false);
  const [recipientName, setRecipientName] = useState(
    currentUserData.name || ""
  );
  const [recipientPhone, setRecipientPhone] = useState(
    currentUserData.phone || ""
  );
  const [recipientEmail, setRecipientEmail] = useState(currentEmail);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const productTotal = cartItems.reduce((acc, item) => {
    const activePrice = item.salePrice || item.price;
    const numPrice =
      typeof activePrice === "string"
        ? parseInt(activePrice.replace(/[^\d]/g, ""), 10)
        : activePrice;
    return acc + numPrice * item.quantity;
  }, 0);

  const shippingFee = productTotal >= 1500 ? 0 : 70;
  const finalTotal = Math.max(0, productTotal + shippingFee - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setToast({ show: true, message: "請正確輸入電子折價券代碼" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let finalToken = token;
      if (token && token.startsWith("JWT ")) {
        finalToken = token.replace("JWT ", "Bearer ");
      } else if (token && !token.startsWith("Bearer ")) {
        finalToken = `Bearer ${token}`;
      }

      const response = await axios.post(
        "https://maybeige-api.onrender.com/api/user/validate-coupon",
        { couponCode: couponCode.trim() },
        { headers: { Authorization: finalToken } }
      );

      if (response.data.success) {
        setDiscount(response.data.discount);
        setToast({ show: true, message: response.data.message });
      }
    } catch (err) {
      setDiscount(0);
      const errorMsg =
        err.response?.status === 401
          ? "請先登入後再領取折扣喔！"
          : err.response?.data?.message || "代碼錯誤，請檢查代碼是否正確";
      setToast({ show: true, message: errorMsg });
    } finally {
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    }
  };

  const handlePayment = async () => {
    if (
      !recipientName.trim() ||
      !recipientPhone.trim() ||
      !recipientEmail.trim()
    ) {
      alert("請完整填寫收件人姓名、電話與信箱資訊喔！");
      return;
    }
    if (!isAgreed) {
      alert("請先閱讀並勾選「我已閱讀並同意網站的條款與條件」才能進行結帳喔！");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      let finalToken = token;
      if (token && token.startsWith("JWT ")) {
        finalToken = token.replace("JWT ", "Bearer ");
      } else if (token && !token.startsWith("Bearer ")) {
        finalToken = `Bearer ${token}`;
      }

      const orderData = {
        products: cartItems.map((item) => {
          const activePrice = item.salePrice || item.price;
          const finalPrice =
            typeof activePrice === "string"
              ? parseInt(activePrice.replace(/[^\d]/g, ""), 10)
              : activePrice;

          return {
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: finalPrice,
            size: item.size,
            style: item.style,
            img: item.img,
          };
        }),
        totalPrice: finalTotal,
        shippingFee: shippingFee,
        discount: discount,
        couponCode: discount > 0 ? couponCode.trim() : null,
        paymentMethod: paymentMethod,
        recipient: {
          name: recipientName,
          phone: recipientPhone,
          email: recipientEmail,
        },

        invoice: {
          type: invoiceType,
          carrier: carrierType === "紙本發票" ? "紙本" : carrierId,
          vatNumber: invoiceType === "法人發票" ? vatNumber : null,
          donationCode: invoiceType === "捐贈發票" ? donationCode : null,
        },
        status: "處理中",
      };

      const response = await axios.post(
        "https://maybeige-api.onrender.com/api/orders",
        orderData,
        { headers: { Authorization: finalToken } }
      );

      if (response.status === 200 || response.status === 201) {
        setToast({ show: true, message: "付款成功！即將為您導向會員中心" });
        setTimeout(() => {
          setToast({ show: false, message: "" });
          if (typeof clearCart === "function") clearCart();
          navigate("/account");
        }, 2000);
      }
    } catch (err) {
      console.error("結帳失敗:", err);
      const errorMsg =
        err.response?.data?.message || "結帳失敗，請確認是否已登入。";
      setToast({ show: true, message: errorMsg });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [invoiceType, setInvoiceType] = useState("個人發票");
  const [carrierType, setCarrierType] = useState("會員載具");
  const [carrierId, setCarrierId] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [donationCode, setDonationCode] = useState("919");

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <section className="checkout-section">
          <div className="section-title-bar product-header">
            <span className="col-prod">商品名稱</span>
            <span className="col-spec">規格</span>
            <span className="col-qty">數量</span>
            <span className="col-sub">小計</span>
          </div>

          <div className="product-list-body">
            {cartItems.map((item, index) => {
              const activePrice = item.salePrice || item.price;
              const itemNumPrice =
                typeof activePrice === "string"
                  ? parseInt(activePrice.replace(/[^\d]/g, ""), 10)
                  : activePrice;

              return (
                <div className="product-item-row" key={`${item._id}-${index}`}>
                  <div className="col-prod prod-info">
                    <img src={item.img} alt={item.name} />
                    <p>{item.name}</p>
                  </div>
                  <div className="col-spec">
                    {item.style} - {item.size}cm
                  </div>
                  <div className="col-qty">{item.quantity}</div>
                  <div className="col-sub">
                    NT${(itemNumPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="discount-section">
            <div className="coupon-row">
              <div className="credit-display">
                購物金：<span>{discount}</span> 元
              </div>
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="輸入電子折價券"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="cream-btn" onClick={handleApplyCoupon}>
                  使 用 折 價 券
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="checkout-section">
          <div className="section-title-bar2">運 送 方 式</div>
          <div className="shipping-box">
            <p>
              7-11 店到店 (收件人請填寫本名)：
              {shippingFee === 0 ? (
                <strong className="shipping-free">NT$0 (達1500免運標準)</strong>
              ) : (
                <strong className="shipping-standard">
                  NT$70 (未滿1500免運)
                </strong>
              )}
            </p>
            {shippingFee > 0 && (
              <p className="free-shipping-hint">
                ※ 再買 NT${(1500 - productTotal).toLocaleString()}{" "}
                即可享免運優惠！
              </p>
            )}
            <button className="cream-btn">選 擇 超 商 門 市</button>
          </div>
        </section>

        <section className="payment-summary">
          <p className="summary-title">
            購 物 車 總 計 ( 共 {totalItemsCount} 件 商 品 )
          </p>
          <div className="summary-details-container">
            <div className="summary-detail-row">
              <span>商品小計</span>
              <span>NT${productTotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="summary-detail-row">
                <span>購物金折抵</span>
                <span>- NT${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-detail-row">
              <span>運費</span>
              <span>{shippingFee === 0 ? "免運" : `NT$${shippingFee}`}</span>
            </div>
          </div>
          <div className="total-amount">NT${finalTotal.toLocaleString()}</div>
          <div className="payment-options">
            {["信用卡支付", "ATM 轉帳", "LINE Pay"].map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  name="pay"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span></span> {method}
              </label>
            ))}
          </div>
        </section>

        <section className="checkout-section">
          <div className="section-title-bar2">基 本 資 料</div>
          <div className="form-content">
            <div className="input-field">
              <label>收件人姓名 *</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="必填"
              />
            </div>
            <div className="input-field">
              <label>收件人電話 *</label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="必填"
              />
            </div>
            <div className="input-field">
              <label>收件人信箱 *</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="必填"
              />
            </div>

            <div className="input-field">
              <label>發票開立 ( 選填 )</label>
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
              >
                <option value="個人發票">雲端發票 (個人)</option>
                <option value="法人發票">三聯式發票 (公司統編)</option>
                <option value="捐贈發票">捐贈發票</option>
              </select>
            </div>

            {invoiceType === "個人發票" && (
              <>
                <div className="input-field">
                  <label>載具類型 ( 選填 )</label>
                  <select
                    value={carrierType}
                    onChange={(e) => setCarrierType(e.target.value)}
                  >
                    <option value="紙本發票">索取紙本發票</option>
                    <option value="手機載具">手機條碼載具</option>
                    <option value="自然人憑證">自然人憑證</option>
                  </select>
                </div>
                {(carrierType === "手機載具" ||
                  carrierType === "自然人憑證") && (
                  <div className="input-field">
                    <label>
                      {carrierType === "手機載具" ? "手機條碼 *" : "憑證編號 *"}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        carrierType === "手機條碼" ? "/ABC1234" : "請輸入編號"
                      }
                      value={carrierId}
                      onChange={(e) => setCarrierId(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {invoiceType === "法人發票" && (
              <div className="input-field">
                <label>統一編號 *</label>
                <input
                  type="text"
                  placeholder="請輸入 8 位數字統編"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                />
              </div>
            )}

            {invoiceType === "捐贈發票" && (
              <div className="input-field">
                <label>捐贈對象 *</label>
                <select
                  value={donationCode}
                  onChange={(e) => setDonationCode(e.target.value)}
                >
                  <option value="1772">台灣動物緊急救援小組 (1772)</option>
                  <option value="90001">台灣防止虐待動物協會 (90001)</option>
                  <option value="88432">台灣動物保護協會 (99588)</option>
                  <option value="5261">台灣動物路殺觀察網 (5261)</option>
                  <option value="919">創世基金會 (919)</option>
                  <option value="888">家扶基金會 (888)</option>
                  <option value="0417">伊甸基金會 (0417)</option>
                  <option value="135">陽光基金會 (135)</option>
                  <option value="520">心路基金會 (520)</option>
                  <option value="195">喜憨兒基金會 (195)</option>
                </select>
                <span className="helper-text">
                  ※ 發票中獎將自動捐贈予該單位
                </span>
              </div>
            )}
            <div className="input-field textarea-field">
              <label>訂單備註 ( 選填 )</label>
              <textarea
                rows="5"
                placeholder="例如：手圍想要鬆一點..."
              ></textarea>
            </div>
          </div>
        </section>

        <div className="final-step">
          <p className="privacy-policy">
            我們會使用您的個人資料來處理您的訂單，支援您在本網站中的使用體驗
          </p>
          <label className="agree-terms">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            />{" "}
            我已閱讀並同意網站的{" "}
            <Link to="/about" className="shipping-notice-link">
              購物須知
            </Link>{" "}
            *
          </label>
          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? "處理中..." : `使 用 ${paymentMethod} 付 款`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutComponent;
