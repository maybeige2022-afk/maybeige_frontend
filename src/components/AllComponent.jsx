import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductPopup from "./ProductPopup";
import "../styles/AllComponent.scss";

const categories = [
  "全部商品",
  "紅色系",
  "粉色系",
  "橙色系",
  "黃色系",
  "綠色系",
  "藍色系",
  "紫色系",
  "棕色系",
  "白色系",
  "黑色系",
];

const colorMapping = {
  紅色系: ["香檳聖誕", "桂花暖金"],
  粉色系: ["柔光假日", "蜜糖草莓", "莫內花園", "粉霧芭蕾"],
  橙色系: ["鮭魚粉光", "暖霞落日"],
  黃色系: ["香檳聖誕", "桂花暖金", "咖啡午後", "莫內花園"],
  綠色系: ["紫韻森林", "莫內花園"],
  藍色系: ["柔光假日", "靜謐藍月", "夢與藍灣"],
  紫色系: ["紫韻森林"],
  棕色系: ["咖啡午後", "虎皮狗狗"],
  白色系: ["雪白幽靈"],
  黑色系: ["黑色情人"],
};

function AllComponent({ products, addToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("全部商品");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get("search");

  useEffect(() => {
    if (searchKeyword) {
      setActiveCategory("全部商品");
    }
  }, [searchKeyword]);

  const handleOpenPopup = (product) => {
    setSelectedProduct(product);
  };

  const handleConfirm = (product, style, size) => {
    addToCart(product, size, style);
    setSelectedProduct(null);
  };

  const filteredProducts = products?.filter((product) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(keyword);
      const tagsMatch =
        product.tags && product.tags.toLowerCase().includes(keyword);

      return nameMatch || tagsMatch;
    }

    if (activeCategory === "全部商品") return true;
    const allowedNames = colorMapping[activeCategory] || [];
    return allowedNames.includes(product.name);
  });

  return (
    <div className="all-products-page">
      <h1 className="page-title">
        {searchKeyword ? (
          <span className="search-text">搜尋：{searchKeyword}</span>
        ) : (
          "水 晶 手 鏈"
        )}
      </h1>

      <div
        className="mobile-dropdown-btn"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>
          {activeCategory === "全部商品" ? "商品分類" : activeCategory}
        </span>
        <i
          className={`fa-solid fa-chevron-down ${
            isDropdownOpen ? "rotate" : ""
          }`}
        ></i>
      </div>

      <div className={`category-nav ${isDropdownOpen ? "open" : ""}`}>
        {categories.map((cat) => (
          <span
            key={cat}
            className={`category-item ${
              activeCategory === cat && !searchKeyword ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(cat);
              setIsDropdownOpen(false);
              navigate("/all");
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="img-wrapper">
                <img src={product.img} alt={product.name} />
                <button
                  className="add-btn"
                  onClick={() => handleOpenPopup(product)}
                >
                  加入購物車
                </button>
              </div>
              <div className="product-info">
                <p className="name">{product.name}</p>
                <p className="tags">{product.tags}</p>
                {product.salePrice ? (
                  <div className="sale-price-wrapper">
                    <span className="old-price">NT${product.price}</span>
                    <span className="new-price">NT${product.salePrice}</span>
                  </div>
                ) : (
                  <p className="price">
                    {typeof product.price === "number"
                      ? `NT$${product.price}`
                      : product.price}
                  </p>
                )}

                <button
                  className="cart-icon-btn"
                  onClick={() => handleOpenPopup(product)}
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>找不到符合條件的商品唷！</p>
          </div>
        )}
      </div>

      {filteredProducts && filteredProducts.length > 0 && (
        <div className="pagination">
          <span className="page-num active">1</span>
          <span className="page-num">2</span>
          <span className="page-num">3</span>
          <span className="next-btn">&gt;</span>
        </div>
      )}

      <ProductPopup
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default AllComponent;
