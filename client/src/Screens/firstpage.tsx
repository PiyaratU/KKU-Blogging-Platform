import React, { useState } from "react";
import "../misc/firstpage.css";
import logoKKU from "../pic/logo-head.jpg";
import { motion } from "framer-motion";
import heroImage from "../pic/hero-image.jpg"; // 📌 นำเข้ารูปภาพ
import { IoMdHelpCircle } from "react-icons/io";
import type { SplitTextProps } from "../types/ui";
// กำหนดประเภทให้กับ props ของ SplitText
const SplitText: React.FC<SplitTextProps> = ({ text }) => {
  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="split-char"
          initial={{ y: 50, opacity: 0 }} // เริ่มจากข้างล่าง
          animate={{
            y: [0, -10, 0], // เด้งขึ้นลง
            x: [-5, 5, -5], // สั่นซ้าย-ขวา
            opacity: 1,
          }}
          transition={{
            delay: index * 0.07, // ทำให้แต่ละตัวอักษรแสดงทีละตัว
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.2, // ความเร็วต่อรอบ
            repeat: Infinity, // ทำให้ขยับไปเรื่อยๆ
            repeatType: "reverse", // สลับทิศทาง
          }}
          style={{ display: "inline" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const FirstPage = () => {
  const [isTextVisible, setTextVisible] = useState(false);

  const handleClick = () => {
    setTextVisible(true); // เปลี่ยนสถานะให้ข้อความแสดง
  };

  return (
    <div className="container">
      <nav className="navbar">
        <nav className="navbar">
          <img
            src={logoKKU}
            className="logo" /* ใช้ className เพื่อควบคุมขนาด */
            style={{ objectFit: "contain", userSelect: "none" }}
            alt="Logo"
          />
        </nav>
        <nav>
          <a href="/helpcentre" style={{fontSize:"20px"}}><IoMdHelpCircle/></a>
        </nav>
      </nav>

      <div className="main-content">
        <div className="text-container">
          <p>ยินดีต้อนรับสู่</p>

          {/* ข้อความเด้งขึ้นทีละตัวและขยับไปเรื่อยๆ */}
          <h1 className={`main-title ${isTextVisible ? "show" : ""}`}>
            <SplitText text="KKU Blogging Platform" />
          </h1>

          <p className={`subtitle ${isTextVisible ? "show" : ""}`}>
            พื้นที่แห่งการแบ่งปันความรู้และประสบการณ์สำหรับชาวมหาวิทยาลัยขอนแก่น!
            ไม่ว่าคุณจะเป็นนักศึกษา คณาจารย์ หรือผู้สนใจทั่วไป
            ที่นี่คือสถานที่ที่คุณสามารถแสดงความคิดสร้างสรรค์ แบ่งปันไอเดีย
            และแลกเปลี่ยนความรู้ในหลากหลายหัวข้อ ตั้งแต่การศึกษา เทคโนโลยี
            การวิจัย ไปจนถึงเรื่องราวจากชีวิตประจำวัน
          </p>
          <button className="btn-primary">
            <a href="/homepage">เข้าสู่เว็บไซต์</a>
          </button>
        </div>

        {/* รูปฝั่งขวา */}
        <div className="image-container">
          <img src={heroImage} alt="Hero" className="hero-image" />
        </div>
      </div>

      <footer className="footer">
        <nav className="footer-menu">
          <p></p>
        </nav>
      </footer>
    </div>
  );
};

export default FirstPage;
