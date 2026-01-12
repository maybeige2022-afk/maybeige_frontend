import React from "react";
import "../styles/FooterComponent.scss";

function FooterComponent() {
  return (
    <footer className="footer-section">
      <div className="contact-us">
        <h2 className="footer-title">CONTACT US</h2>

        <div className="social-links">
          <a
            href="https://liff.line.me/1645278921-kWRPP32q/?accountId=418ykrli"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Line"
          >
            <i className="fa-brands fa-line"></i>
          </a>
          <a
            href="https://www.instagram.com/maybeige.co/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-square-instagram"></i>
          </a>
        </div>

        <div className="email-text">Email: maybeige2022@gmail.com</div>
      </div>

      <div className="copyright-bar">
        ©MAYBEIGE All Rights Reserved. Designed by Trinity Cheng.
      </div>
    </footer>
  );
}

export default FooterComponent;
