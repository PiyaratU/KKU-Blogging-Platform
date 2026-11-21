import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { Button } from "../ui/Button";

type PagerProps = {
  page: number;
  hasMore: boolean;
  loading?: boolean;
  onChange: (page: number) => void;
};

/** ปุ่ม "ก่อนหน้า / ถัดไป" ใต้รายการบล็อก — ซ่อนเมื่อมีหน้าเดียว */
const Pager = ({ page, hasMore, loading, onChange }: PagerProps) => {
  if (page <= 1 && !hasMore) return null;
  return (
    <nav aria-label="เปลี่ยนหน้า" className="tw:mt-6 tw:flex tw:items-center tw:justify-between tw:gap-4 tw:border-t tw:border-line tw:pt-8">
      <Button variant="secondary" disabled={page <= 1 || loading} onClick={() => onChange(page - 1)}>
        <IoArrowBack className="tw:size-4" />
        ก่อนหน้า
      </Button>
      <span className="tw:text-sm tw:text-muted">หน้า {page}</span>
      <Button variant="secondary" disabled={!hasMore || loading} onClick={() => onChange(page + 1)}>
        ถัดไป
        <IoArrowForward className="tw:size-4" />
      </Button>
    </nav>
  );
};

export default Pager;
