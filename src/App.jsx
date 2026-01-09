import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "./components/ScrollToTop";
import NavComponent from "./components/NavComponent";
import HomeComponent from "./components/HomeComponent";
import AllComponent from "./components/AllComponent";
import CartComponent from "./components/CartComponent";
import LoginComponent from "./components/LoginComponent";
import MyAccountComponent from "./components/MyAccountComponent";
import AboutComponent from "./components/AboutComponent";
import CheckoutComponent from "./components/CheckoutComponent";
import ToastComponent from "./components/ToastComponent";
import FooterComponent from "./components/FooterComponent";
import GoogleSuccess from "./components/GoogleSuccess";
import ResetPasswordComponent from "./components/ResetPasswordComponent";

function App() {
  const [allProducts, setAllProducts] = useState([]);

  const getCartKey = () => {
    const email = localStorage.getItem("current_user_email");
    return email ? `maybeige_cart_${email}` : "maybeige_cart_guest";
  };

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(getCartKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/product");
        setAllProducts(response.data);
      } catch (err) {
        console.error("初始化產品失敗:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey());
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(getCartKey());
  };

  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("current_user_email", user.email);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("current_user_email");
    setToast({ show: true, message: "您已成功登出。" });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const addToCart = (product, selectedSize, selectedStyle) => {
    setCartItems((prev) => {
      const pid = product._id || product.id;
      const uniqueCartId = `${pid}-${selectedSize || "default"}-${
        selectedStyle || "default"
      }`;
      const isExist = prev.find((item) => item.cartId === uniqueCartId);

      if (isExist) {
        return prev.map((item) =>
          item.cartId === uniqueCartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          id: pid,
          quantity: 1,
          cartId: uniqueCartId,
          size: selectedSize,
          style: selectedStyle,
        },
      ];
    });
    setToast({ show: true, message: `已加入購物車：${product.name}` });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  return (
    <div className="App">
      <ScrollToTop />
      <ToastComponent show={toast.show} message={toast.message} />
      <NavComponent
        cartCount={cartItems.length}
        isLoggedIn={isLoggedIn}
        setToast={setToast}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomeComponent addToCart={addToCart} products={allProducts} />
            }
          />
          <Route
            path="/all"
            element={
              <AllComponent addToCart={addToCart} products={allProducts} />
            }
          />
          <Route
            path="/cart"
            element={
              <CartComponent
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                setToast={setToast}
              />
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/account" />
              ) : (
                <LoginComponent onLogin={handleLogin} setToast={setToast} />
              )
            }
          />
          <Route path="google-success" element={<GoogleSuccess />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordComponent />}
          />
          <Route
            path="/account"
            element={
              isLoggedIn ? (
                <MyAccountComponent
                  onLogout={handleLogout}
                  setToast={setToast}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/about" element={<AboutComponent />} />
          <Route
            path="/checkout"
            element={
              <CheckoutComponent
                cartItems={cartItems}
                setToast={setToast}
                clearCart={clearCart}
              />
            }
          />
        </Routes>
      </main>
      <FooterComponent />
    </div>
  );
}

export default App;
