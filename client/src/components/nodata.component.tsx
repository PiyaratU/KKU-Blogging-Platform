import { LuNewspaper } from "react-icons/lu";
import type { NoDataMessageProps } from "../types/ui";

/** ข้อความเมื่อไม่มีข้อมูล — แบบเต็ม (ไอคอน + คำอธิบาย + ปุ่ม) หรือแบบเล็กสำหรับแถบข้าง */
const NoDataMessage: React.FC<NoDataMessageProps> = ({ message, hint, action, compact = false }) => {
  if (compact) {
    return <p className="tw:m-0 tw:py-2 tw:text-sm tw:text-muted">{message}</p>;
  }

  return (
    <div className="tw:mt-4 tw:flex tw:flex-col tw:items-center tw:rounded-2xl tw:border tw:border-dashed tw:border-violet-200 tw:bg-violet-50/40 tw:px-6 tw:py-16 tw:text-center">
      <span className="tw:flex tw:size-14 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-white tw:text-violet-400 tw:shadow-sm">
        <LuNewspaper className="tw:size-7" />
      </span>
      <p className="tw:mt-4 tw:mb-0 tw:text-base tw:font-semibold tw:text-ink">{message}</p>
      {hint && <p className="tw:mt-1 tw:mb-0 tw:max-w-sm tw:text-sm tw:text-muted">{hint}</p>}
      {action && <div className="tw:mt-5">{action}</div>}
    </div>
  );
};

export default NoDataMessage;
