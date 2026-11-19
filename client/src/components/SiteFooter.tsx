import { Link } from "react-router-dom";
import logoKKU from "../pic/logo-head.jpg";

const COLUMNS = [
  {
    title: "เมนู",
    links: [
      { to: "/homepage", label: "หน้าแรก" },
      { to: "/editor", label: "เขียนบล็อก" },
      { to: "/helpcentre", label: "ช่วยเหลือ" },
    ],
  },
  {
    title: "บัญชี",
    links: [
      { to: "/signin", label: "เข้าสู่ระบบ" },
      { to: "/signup", label: "สมัครสมาชิก" },
      { to: "/settings/edit-profile", label: "แก้ไขโปรไฟล์" },
    ],
  },
];

/** ส่วนท้ายเว็บ — โลโก้ คำอธิบาย และลิงก์หลัก */
const SiteFooter = () => (
  <footer className="tw:mt-8 tw:border-t tw:border-line tw:bg-white">
    <div className="tw:mx-auto tw:flex tw:max-w-7xl tw:flex-col tw:gap-10 tw:px-4 tw:py-12 tw:md:flex-row tw:md:justify-between tw:md:px-8">
      <div className="tw:max-w-md">
        <img src={logoKKU} alt="KKU Blogging Platform" className="tw:h-9 tw:w-auto" />
        <p className="tw:mt-4 tw:mb-0 tw:text-sm tw:leading-relaxed tw:text-muted">
          พื้นที่แบ่งปันเรื่องราว ความรู้ และประสบการณ์ของชาวมหาวิทยาลัยขอนแก่น อ่านบล็อกจากเพื่อน ๆ
          แล้วเขียนเรื่องของคุณเองได้ทุกเมื่อ
        </p>
      </div>

      <div className="tw:flex tw:gap-16">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="tw:m-0 tw:text-sm tw:font-semibold tw:text-ink">{col.title}</p>
            <ul className="tw:mt-3 tw:mb-0 tw:list-none tw:space-y-2 tw:p-0">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="tw:text-sm tw:text-muted tw:no-underline tw:transition-colors tw:hover:text-primary-strong">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="tw:border-t tw:border-line tw:py-5 tw:text-center tw:text-xs tw:text-muted">
      © {new Date().getFullYear()} KKU Blogging Platform
    </div>
  </footer>
);

export default SiteFooter;
