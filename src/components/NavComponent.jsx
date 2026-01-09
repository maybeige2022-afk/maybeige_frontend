import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/NavComponent.scss";

function NavComponent({ isLoggedIn, setToast }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // RWD
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
      }
    } else {
      setUsername("");
    }
  }, [isLoggedIn]);

  const handleSearchExecute = () => {
    if (!searchTerm.trim()) return;
    navigate(`/all?search=${searchTerm.trim()}`);
    setSearchTerm("");
    setIsDrawerOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchExecute();
    }
  };

  const handleAccountClick = (e) => {
    // RWD
    setIsDrawerOpen(false);

    if (!isLoggedIn) {
      e.preventDefault();
      setToast({ show: true, message: "請先完成登入唷！" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
      navigate("/login");
    }
  };

  // RWD
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <nav className="main-nav">
      <Link to="/" className="logo">
        MAYBEIGE
      </Link>

      {/* RWD */}
      <div className="nav-right-section desktop-only">
        <div className="nav-links">
          <NavLink to="/all">ALL</NavLink>
          <NavLink to="/cart">CART</NavLink>

          {!isLoggedIn && <NavLink to="/login">LOGIN</NavLink>}
          <NavLink to="/account" onClick={handleAccountClick}>
            MY ACCOUNT
          </NavLink>

          <NavLink to="/about">ABOUT US</NavLink>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <i
            className="fa-solid fa-magnifying-glass search-icon"
            onClick={handleSearchExecute}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>

      <div className="mobile-icons">
        <Link to="/account" onClick={handleAccountClick} className="icon-link">
          <i className="fa-regular fa-user"></i>
        </Link>
        <Link to="/cart" className="icon-link">
          <i className="fa-solid fa-bag-shopping"></i>
        </Link>
        <div className="mobile-menu-icon" onClick={() => setIsDrawerOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>

      <div className={`side-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <i className="fa-solid fa-xmark close-btn" onClick={closeDrawer}></i>
        </div>

        <div className="drawer-search">
          <input
            type="text"
            placeholder="搜尋商品"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <i
            className="fa-solid fa-magnifying-glass search-icon"
            onClick={handleSearchExecute}
          ></i>
        </div>

        <div className="drawer-links">
          <NavLink to="/all" onClick={closeDrawer}>
            ALL
          </NavLink>

          {!isLoggedIn && (
            <NavLink to="/login" onClick={closeDrawer}>
              LOGIN
            </NavLink>
          )}

          <NavLink to="/account" onClick={handleAccountClick}>
            MY ACCOUNT
          </NavLink>

          <NavLink to="/about" onClick={closeDrawer}>
            ABOUT US
          </NavLink>
        </div>
      </div>

      {isDrawerOpen && <div className="overlay" onClick={closeDrawer}></div>}
    </nav>
  );
}

export default NavComponent;
