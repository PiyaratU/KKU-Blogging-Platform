import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logoKKU from "../pic/logo-head.jpg";
import { UserContext } from "../App";
import { categoryHref, getTopTags } from "./home/topTags";

type FooterLink = { to: string; label: string };

const linkClass =
  "tw:text-sm tw:text-muted tw:no-underline tw:transition-colors tw:hover:text-primary-strong";

const Column = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <div>
    <p className="tw:m-0 tw:text-sm tw:font-semibold tw:uppercase tw:tracking-wide tw:text-ink">{title}</p>
    <ul className="tw:mt-4 tw:mb-0 tw:list-none tw:space-y-2.5 tw:p-0">
      {links.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className={linkClass}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/** ส่วนท้ายเว็บ — โลโก้ คำอธิบาย และลิงก์ หมวดหมู่ / เมนู / บัญชี */
const SiteFooter = () => {
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const [tags, setTags] = useState<string[]>([]);

  // หมวดหมู่ยอดนิยมจากบล็อกล่าสุด (โหลดครั้งเดียว — footer อยู่ใน layout ที่ไม่ถูกสร้างใหม่ตอนเปลี่ยนหน้า)
  useEffect(() => {
    axios
      .post(`${import.meta.env.REACT_APP_API_ENDPOINT}/posts/latest-blog`, { page: 1 })
      .then(({ data }) => setTags(getTopTags(data.blogs ?? [], 5)))
      .catch(() => setTags([]));
  }, []);

  const menu: FooterLink[] = [
    { to: "/homepage", label: "หน้าแรก" },
    { to: "/editor", label: "เขียนบล็อก" },
    { to: access_token ? "/helpcentre" : "/help-notlogin", label: "ช่วยเหลือ" },
  ];
  const account: FooterLink[] = access_token
    ? [
        { to: "/settings/edit-profile", label: "แก้ไขโปรไฟล์" },
        { to: "/dashboard/blogs", label: "จัดการบล็อก" },
        { to: "/settings/change-password", label: "เปลี่ยนรหัสผ่าน" },
      ]
    : [
        { to: "/signin", label: "เข้าสู่ระบบ" },
        { to: "/signup", label: "สมัครสมาชิก" },
      ];

  return (
    <footer className="tw:mt-8 tw:border-t tw:border-line tw:bg-white">
      <div className="tw:mx-auto tw:grid tw:max-w-7xl tw:gap-10 tw:px-4 tw:py-14 tw:md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] tw:md:px-8">
        <div className="tw:max-w-sm">
          <img src={logoKKU} alt="KKU Blogging Platform" className="tw:h-10 tw:w-auto" />
          <p className="tw:mt-4 tw:mb-0 tw:text-sm tw:leading-relaxed tw:text-muted">
            พื้นที่แบ่งปันเรื่องราว ความรู้ และประสบการณ์ของชาวมหาวิทยาลัยขอนแก่น อ่านบล็อกจากเพื่อน ๆ
            แล้วเขียนเรื่องของคุณเองได้ทุกเมื่อ
          </p>
        </div>

        <div className="tw:grid tw:grid-cols-2 tw:gap-8 tw:sm:grid-cols-3 tw:md:contents">
          {tags.length > 0 && <Column title="หมวดหมู่" links={tags.map((t) => ({ to: categoryHref(t), label: t }))} />}
          <Column title="เมนู" links={menu} />
          <Column title="บัญชี" links={account} />
        </div>
      </div>
      <div className="tw:border-t tw:border-line tw:py-5 tw:text-center tw:text-xs tw:text-muted">
        © {new Date().getFullYear()} KKU Blogging Platform · มหาวิทยาลัยขอนแก่น
      </div>
    </footer>
  );
};

export default SiteFooter;
