import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

const VARIANTS = {
  /** ปุ่มหลัก — ม่วงพาสเทล ตัวหนังสือเข้ม */
  primary: "tw:bg-primary-pastel tw:text-primary-strong tw:hover:bg-primary-pastel-hover",
  /** ปุ่มรอง — ขอบบาง */
  secondary: "tw:border tw:border-line tw:bg-white tw:text-ink tw:hover:bg-surface",
  /** ปุ่มเรียบ — ไม่มีพื้น ใช้ในแถบเมนู */
  ghost: "tw:bg-transparent tw:text-ink-soft tw:hover:bg-surface tw:hover:text-ink",
} as const;

const SIZES = {
  sm: "tw:h-8 tw:px-3 tw:text-sm",
  md: "tw:h-10 tw:px-4 tw:text-sm",
} as const;

type Common = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
};

const classesFor = ({ variant = "primary", size = "md", className }: Omit<Common, "children">) =>
  cn(
    // ซ่อน/แสดงตามขนาดจอ ให้ครอบด้วย <span className="tw:hidden tw:md:inline-flex"> — ใส่ hidden ที่ปุ่มตรง ๆ จะชนกับ inline-flex
    "tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:whitespace-nowrap tw:rounded-full tw:font-medium tw:no-underline",
    "tw:transition-colors tw:disabled:opacity-50 tw:disabled:pointer-events-none tw:cursor-pointer",
    VARIANTS[variant],
    SIZES[size],
    className
  );

/** ปุ่ม — ใช้แทน btn-dark / btn-light / ปุ่มแต่งเองในแต่ละหน้า */
export const Button = ({ variant, size, className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" className={classesFor({ variant, size, className })} {...rest}>
    {children}
  </button>
);

/** ลิงก์ที่หน้าตาเป็นปุ่ม (react-router) */
export const LinkButton = ({ to, variant, size, className, children }: Common & { to: string }) => (
  <Link to={to} className={classesFor({ variant, size, className })}>
    {children}
  </Link>
);
