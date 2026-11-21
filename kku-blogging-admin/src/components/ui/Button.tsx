import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import { cn } from "./cn";

/**
 * ปุ่มของทั้งเว็บ — มี 4 แบบ 3 ขนาด ใช้ตัวนี้ตัวเดียว (ปุ่ม btn-dark / btn-light / react-bootstrap แบบเก่า
 * ถูกแต่งใน global.css ให้หน้าตาเหมือนกัน) ถ้าจะแก้สีปุ่ม แก้ที่นี่และที่ global.css ส่วน "ปุ่มแบบเก่า"
 */
const VARIANTS = {
  /** ปุ่มหลัก — ม่วงพาสเทล ตัวหนังสือม่วงเข้ม (หน้าละ 1–2 ปุ่ม) */
  primary: "tw:border-transparent tw:bg-primary-pastel tw:text-primary-strong tw:hover:bg-primary-pastel-hover",
  /** ปุ่มรอง — พื้นขาว ขอบบาง */
  secondary: "tw:border-line tw:bg-white tw:text-ink tw:hover:border-primary-pastel tw:hover:bg-primary-soft",
  /** ปุ่มเรียบ — ไม่มีพื้น ไม่มีขอบ (ยกเลิก / เมนู) */
  ghost: "tw:border-transparent tw:bg-transparent tw:text-ink-soft tw:hover:bg-surface tw:hover:text-ink",
  /** ลบ / อันตราย — ชมพูพาสเทล */
  danger: "tw:border-transparent tw:bg-rose-100 tw:text-rose-700 tw:hover:bg-rose-200",
} as const;

const SIZES = {
  sm: "tw:h-9 tw:px-4 tw:text-sm",
  md: "tw:h-10 tw:px-5 tw:text-sm",
  lg: "tw:h-12 tw:px-6 tw:text-base",
} as const;

type Common = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
};

export const buttonClasses = ({ variant = "primary", size = "md", className }: Omit<Common, "children">) =>
  cn(
    // ซ่อน/แสดงตามขนาดจอ ให้ครอบด้วย <span className="tw:hidden tw:md:inline-flex"> — ใส่ hidden ที่ปุ่มตรง ๆ จะชนกับ inline-flex
    // มุมมนเล็กน้อย (8px) — ปุ่มแบบเก่าใน global.css ใช้ค่าเดียวกัน
    "tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:whitespace-nowrap tw:rounded-lg tw:border tw:border-solid tw:font-medium tw:leading-none tw:no-underline",
    "tw:transition-colors tw:cursor-pointer tw:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-primary-pastel tw:focus-visible:ring-offset-2",
    "tw:disabled:opacity-50 tw:disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className
  );

/** ปุ่ม */
export const Button = ({ variant, size, className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" className={buttonClasses({ variant, size, className })} {...rest}>
    {children}
  </button>
);

/** ลิงก์ที่หน้าตาเป็นปุ่ม (react-router) */
export const LinkButton = ({ to, variant, size, className, children }: Common & { to: string }) => (
  <Link to={to} className={buttonClasses({ variant, size, className })}>
    {children}
  </Link>
);

/** ลิงก์ข้อความ "อ่านต่อ →" — ใช้ในการ์ดบล็อกทุกแบบ ให้เหมือนกันทั้งเว็บ */
export const ReadMoreLink = ({ to, children = "อ่านต่อ", className }: { to: string; children?: ReactNode; className?: string }) => (
  <Link
    to={to}
    className={cn(
      "tw:group/read tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-semibold tw:text-primary-strong tw:no-underline tw:transition-colors tw:hover:text-ink",
      className
    )}
  >
    {children}
    <IoArrowForward className="tw:size-4 tw:transition-transform tw:group-hover/read:translate-x-0.5" />
  </Link>
);
