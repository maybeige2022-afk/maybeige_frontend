import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "../styles/HomeComponent.scss";
import ProductPopup from "./ProductPopup";

import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import rightImage from "../assets/images/首頁圖文.jpg";

function HomeComponent({ products, addToCart }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const latestProducts = products.slice(0, 8);

  // 🚀 保留名稱順序，用來篩選 TOP 5
  const topNames = ["暖霞落日", "咖啡午後", "莫內花園", "粉霧芭蕾", "柔光假日"];

  // 🚀 修改：直接從 products 抓取完整資料，包含後端的 tags 與 effect
  const bestSellers = React.useMemo(() => {
    return topNames
      .map((name) => products.find((p) => p.name === name))
      .filter(Boolean);
  }, [products, topNames]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.1 }
    );
    const items = document.querySelectorAll(".best-item-wrapper");
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [bestSellers]);

  const handleAddBtnClick = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleConfirmAdd = (product, style, size) => {
    addToCart(product, size, style);
    setShowPopup(false);
    setSelectedProduct(null);
  };

  return (
    <div className="homepage-content">
      <ProductPopup
        show={showPopup}
        product={selectedProduct}
        onClose={() => {
          setShowPopup(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmAdd}
      />

      <section className="banner-section">
        <div className="swiper-container">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            speed={800}
          >
            {[banner1, banner2, banner3].map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={`Banner${i}`} className="full-img" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="promo-image-container">
          <img src={rightImage} alt="Promotion" className="full-img" />
        </div>
      </section>

      {/* 最新商品 */}
      <section className="product-section">
        <h2 className="section-title">最 新 商 品</h2>
        <div className="product-grid">
          {latestProducts.map((item) => (
            <div key={item._id} className="product-card">
              <div className="img-wrapper">
                <img src={item.img} alt={item.name} className="full-img" />

                <button
                  className="add-btn"
                  onClick={() => handleAddBtnClick(item)}
                >
                  加入購物車
                </button>
              </div>

              <div className="product-info">
                <div className="name">{item.name}</div>
                <div className="price">
                  {item.salePrice && item.salePrice < item.price ? (
                    <div className="sale-price-wrapper">
                      <span className="old-price">NT${item.price}</span>
                      <span className="new-price">NT${item.salePrice}</span>
                    </div>
                  ) : (
                    <span>NT${item.price}</span>
                  )}
                </div>
                <div className="cart-btn-wrapper">
                  <button
                    className="cart-icon-btn"
                    onClick={() => handleAddBtnClick(item)}
                    aria-label="Add to cart"
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="btn-container">
          <button className="view-more-btn">
            <Link to="/all">VIEW MORE ⥅</Link>
          </button>
        </div>
      </section>

      {/* 熱銷 TOP 5 */}
      <section className="best-seller-section">
        <h2 className="section-title">熱 銷 T O P 5</h2>
        <div className="best-list">
          {bestSellers.map((item, index) => {
            const isEven = (index + 1) % 2 === 0;
            return (
              <div
                key={item._id}
                className={`best-item-wrapper ${
                  isEven ? "slide-right" : "slide-left"
                }`}
              >
                {!isEven ? (
                  <>
                    <div className="img-box">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="info-card">
                      <div className="rank">TOP 0{index + 1}</div>
                      <div className="name">{item.name}</div>
                      <div className="decorator">ﻌﻌﻌ</div>

                      {/* 🚀 直接帶入後端資料 */}
                      <div className="tags">
                        {item.tags} ｜ {item.effect}
                      </div>

                      <div className="price">
                        {item.salePrice && item.salePrice < item.price ? (
                          <div className="sale-price-wrapper">
                            <span className="old-price">NT${item.price}</span>
                            <span className="new-price">
                              NT${item.salePrice}
                            </span>
                          </div>
                        ) : (
                          <span>NT${item.price}</span>
                        )}
                      </div>
                      <div className="center-btn-wrapper">
                        <button
                          className="add-btn-static"
                          onClick={() => handleAddBtnClick(item)}
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-card">
                      <div className="rank">TOP 0{index + 1}</div>
                      <div className="name">{item.name}</div>
                      <div className="decorator">ﻌﻌﻌ</div>

                      {/* 🚀 直接帶入後端資料 */}
                      <div className="tags">
                        {item.tags} ｜ {item.effect}
                      </div>

                      <div className="price">NT${item.price}</div>
                      <div className="center-btn-wrapper">
                        <button
                          className="add-btn-static"
                          onClick={() => handleAddBtnClick(item)}
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                    <div className="img-box">
                      <img src={item.img} alt={item.name} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomeComponent;
