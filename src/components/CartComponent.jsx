import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CartComponent.scss";

function CartComponent({
  cartItems = [],
  removeFromCart,
  updateQuantity,
  setToast,
}) {
  const navigate = useNavigate();
  const isEmpty = cartItems.length === 0;
  const totalItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const activePrice = item.salePrice || item.price;

      const priceValue =
        typeof activePrice === "string"
          ? parseInt(activePrice.replace(/[^\d]/g, ""), 10)
          : activePrice;

      return total + priceValue * item.quantity;
    }, 0);
  };

  const handleCheckoutClick = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/checkout");
    } else {
      if (setToast) {
        setToast({ show: true, message: "請先登入會員，即可進行結帳流程喔！" });
        setTimeout(() => {
          setToast({ show: false, message: "" });
          navigate("/login");
        }, 2000);
      } else {
        alert("請先登入會員，即可進行結帳流程喔！");
        navigate("/login");
      }
    }
  };

  return (
    <div className="cart-page">
      {!isEmpty ? (
        <div className="cart-container">
          <div className="cart-header">
            <span className="header-name">商品名稱</span>
            <span className="header-spec">規格</span>
            <span className="header-qty">數量</span>
            <span className="header-subtotal">小計</span>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => {
              const currentId = item.cartId || item.id || item._id;

              const activePrice = item.salePrice || item.price;

              const itemPrice =
                typeof activePrice === "string"
                  ? parseInt(activePrice.replace(/[^\d]/g, ""), 10)
                  : activePrice;

              return (
                <div key={currentId} className="cart-item-row">
                  <div className="product-info">
                    <img src={item.img} alt={item.name} />
                    <div className="text">
                      <p className="name">{item.name}</p>
                      <p className="tags">{item.tags}</p>
                    </div>
                  </div>
                  <div className="spec">
                    {item.style} - {item.size}cm
                  </div>

                  <div className="qty-control">
                    <div className="qty-inner-group">
                      <button onClick={() => updateQuantity(currentId, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(currentId, 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="subtotal">
                    NT$
                    {(itemPrice * item.quantity).toLocaleString()}
                    <i
                      className="fa-regular fa-trash-can delete-icon"
                      onClick={() => removeFromCart(currentId)}
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <p className="summary-text">
              購物車總計（共 {totalItemsCount} 件商品）
            </p>
            <h3 className="total-price">
              NT${calculateTotal().toLocaleString()}
            </h3>
          </div>

          <div className="cart-actions">
            <Link to="/all" className="go-shopping-btn">
              繼 續 購 物
            </Link>
            <button className="go-shopping-btn" onClick={handleCheckoutClick}>
              前 往 結 帳
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart-container">
          <div className="cart-icon">
            <i className="fa-solid fa-cart-arrow-down"></i>
          </div>
          <h2 className="empty-title">購物車尚未加入商品，請繼續選購</h2>
          <Link to="/all" className="go-shopping-btn">
            前 往 購 買
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartComponent;
