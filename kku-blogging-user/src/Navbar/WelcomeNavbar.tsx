import { NavLink } from "react-router-dom";
import { NAV_HEADER_CLASS, NAV_INNER_CLASS, NavbarLogo, navLinkClass } from "./Navbar";

/**
 * navbar ของหน้ายินดีต้อนรับ (/) — หน้าตาเดียวกับ navbar หลัก (ใช้ class ชุดเดียวกันจาก Navbar.tsx)
 * แต่มีแค่โลโก้ + เมนู "ช่วยเหลือ" (ยังไม่มีค้นหา / เข้าสู่ระบบ)
 */
const WelcomeNavbar = () => (
  <header className={NAV_HEADER_CLASS}>
    <nav className={NAV_INNER_CLASS}>
      <NavbarLogo to="/" />
      {/* เมนูชิดขวาสุด (ตำแหน่งเดียวกับปุ่มเข้าสู่ระบบของ navbar หลัก) */}
      <div className="tw:ml-auto tw:flex tw:items-center tw:gap-1">
        <NavLink to="/help-notlogin" className={navLinkClass}>
          ช่วยเหลือ
        </NavLink>
      </div>
    </nav>
  </header>
);

export default WelcomeNavbar;
