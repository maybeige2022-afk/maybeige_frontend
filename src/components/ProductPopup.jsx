import React, { useState, useEffect } from "react";
import "../styles/ProductPopup.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductPopup = ({ product, onClose, onConfirm }) => {
  const [style, setStyle] = useState("滿圈款");
  const [size, setSize] = useState("15");
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    if (product) setActiveImg(product.img);
  }, [product]);

  if (!product) return null;

  const baseImg = product.img.replace(".jpg", "");
  const productImages = [product.img, `${baseImg}-2.jpg`, `${baseImg}-3.jpg`];

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>

          <div className="popup-header">
            <div className="img-swiper-container">
              <Swiper
                modules={[Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="mySwiper"
                onSlideChange={(swiper) =>
                  setActiveImg(productImages[swiper.activeIndex])
                }
              >
                {productImages.map((imgUrl, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="img-click-area"
                      onClick={() => {
                        setActiveImg(imgUrl);
                        setIsZoomed(true);
                      }}
                    >
                      <img src={imgUrl} alt={`${product.name}-${index}`} />
                      <span className="zoom-tip">點擊放大</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <h3>{product.name}</h3>

            {product.tags && <p className="popup-tags">{product.tags}</p>}

            {product.effect && (
              <div className="effect-container">
                {product.effect.split(" · ").map((eff, index) => (
                  <span key={index} className="effect-badge">
                    {eff}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="popup-options">
            <div className="option-row">
              <span className="label-text">款式</span>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="滿圈款">滿圈款 (彈力繩)</option>
                <option value="s扣款">s 扣款</option>
                <option value="龍蝦扣款">龍蝦扣款</option>
                <option value="磁吸扣款">磁吸扣款</option>
              </select>
            </div>
            <div className="option-row">
              <span className="label-text">手圍</span>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                {[13, 14, 15, 16, 17, 18].map((s) => (
                  <option key={s} value={s}>
                    {s} cm
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="add-to-cart-final"
            onClick={() => onConfirm(product, style, size)}
          >
            加 入 購 物 車
          </button>
          <p className="footer-hint">
            𝝑ৎ 想要繩子鬆一點/緊一點可打在備註告知 𝝑ৎ
          </p>
        </div>
      </div>

      {isZoomed && (
        <div
          className="image-lightbox-overlay"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="lightbox-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </button>
            <img src={activeImg} alt="Zoomed" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPopup;
