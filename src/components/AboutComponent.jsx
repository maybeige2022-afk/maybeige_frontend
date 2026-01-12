import React from "react";
import "../styles/AboutComponent.scss";
import infoImg1 from "../assets/images/infoImg1.jpg";
import infoImg2 from "../assets/images/infoImg2.jpg";
import infoImg3 from "../assets/images/infoImg3.jpg";
import notice from "../assets/images/notice.jpg";

function AboutComponent() {
  return (
    <div className="about-page">
      <section className="about-header">
        <h1 className="header-title">購 物 須 知</h1>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="info-item">
            <img src={infoImg1} alt="Tips for Buyers" />
          </div>
          <div className="info-item">
            <img src={infoImg2} alt="Measurement Guide" />
          </div>
          <div className="info-item">
            <img src={infoImg3} alt="Custom Notes" />
          </div>
        </div>
        <div className="info-section2">
          <div className="notice-text-container">
            <h2 className="notice-title">
              <i class="fa-solid fa-gift"></i>關於退換貨 / 整修手鍊{" "}
              <i class="fa-solid fa-gift"></i>
            </h2>
            <div className="notice-list">
              <p>
                𝝑ৎ
                取貨後1個月內手鍊若有非人為損壞，例如：彈力線斷裂、配件鬆脫等情況，可聯繫我們處理，來回運費及維修費不需由買家支付。
              </p>
              <p>𝝑ৎ 賣場提供1次免費換線服務，更換只需支付來回運費.ᐟ.ᐟ.ᐟ</p>
              <p>
                𝝑ৎ
                若非換線需求，想要調整手圍，需酌收更改費用，與闆娘討論後視調整情況報價。
              </p>
              <p>
                𝝑ৎ
                客製化手鍊是依顧客需求所訂製之商品，因此除了商品本身瑕疵外，無法接受退換貨，請謹慎思考後再下單.ᐟ.ᐟ.ᐟ
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutComponent;
