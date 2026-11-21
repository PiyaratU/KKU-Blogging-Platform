import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import { cn } from "./cn";

export type BreadcrumbItem = {
  label: string;
  /** ไม่ใส่ = หน้าปัจจุบัน (ไม่เป็นลิงก์) */
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** ลิงก์ "หน้าแรก" ข้างหน้าสุด — หน้าที่ยังไม่ล็อกอินใช้ "/" */
  homeTo?: string;
  /** ระยะห่าง / ความกว้าง — ไม่ใส่ = เว้นด้านล่าง (tw:mb-4) */
  className?: string;
};

/** แถบบอกตำแหน่งหน้า: หน้าแรก › หมวด › หน้าปัจจุบัน — ใช้แทนปุ่มย้อนกลับ */
const Breadcrumb = ({ items, homeTo = "/homepage", className = "tw:mb-4" }: BreadcrumbProps) => {
  const trail: BreadcrumbItem[] = [{ label: "หน้าแรก", to: homeTo }, ...items];

  return (
    <nav aria-label="breadcrumb" className={cn("tw:min-w-0 tw:text-sm", className)}>
      <ol className="tw:m-0 tw:flex tw:min-w-0 tw:flex-wrap tw:items-center tw:gap-1 tw:p-0 tw:list-none">
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="tw:flex tw:min-w-0 tw:items-center tw:gap-1">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="tw:text-muted tw:no-underline tw:transition tw:hover:text-primary-strong tw:hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "tw:truncate",
                    isLast ? "tw:max-w-[16rem] tw:font-medium tw:text-ink tw:sm:max-w-md" : "tw:text-muted"
                  )}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <IoChevronForward aria-hidden className="tw:shrink-0 tw:text-muted" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
