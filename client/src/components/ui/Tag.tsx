import type { ReactNode } from "react";
import { cn } from "./cn";
import { pastelFor } from "./colors";

type TagProps = {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  /** ใส่ # นำหน้า (ค่าเริ่มต้น) — ปิดเมื่อใช้เป็นปุ่มตัวกรองทั่วไป */
  hash?: boolean;
  /** สีเทาเรียบแทนพาสเทลตามชื่อ — ใช้กับปุ่มตัวกรอง */
  plain?: boolean;
  className?: string;
};

/** แท็กทรงแคปซูล สีพาสเทลตามชื่อแท็ก — มี onClick = ปุ่มเลือกแท็ก, ไม่มี = ป้ายแสดงอย่างเดียว */
const Tag = ({ children, active = false, onClick, hash = true, plain = false, className }: TagProps) => {
  const key = typeof children === "string" ? children : "";
  const classes = cn(
    "tw:inline-flex tw:items-center tw:rounded-full tw:px-3 tw:py-1 tw:text-xs tw:leading-5 tw:whitespace-nowrap",
    active
      ? "tw:bg-primary-pastel tw:font-medium tw:text-primary-strong tw:ring-1 tw:ring-violet-300"
      : plain
        ? "tw:bg-surface tw:text-ink-soft"
        : pastelFor(key),
    onClick && "tw:cursor-pointer tw:border-0 tw:transition tw:hover:brightness-95",
    className
  );
  const label = (
    <>
      {hash && "#"}
      {children}
    </>
  );
  return onClick ? (
    <button type="button" className={classes} onClick={onClick} aria-pressed={active}>
      {label}
    </button>
  ) : (
    <span className={classes}>{label}</span>
  );
};

export default Tag;
