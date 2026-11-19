import { Button } from "./ui/Button";
import type { LoadmoreProps } from "../types/ui";

/** ปุ่ม "โหลดเพิ่มเติม" — แสดงเมื่อยังมีข้อมูลที่ยังไม่ได้โหลด */
const LoadMoreDataBtn: React.FC<LoadmoreProps> = ({ state, fetchDataFun, additionalParam }) => {
  const hasMore =
    state !== null && Array.isArray(state?.result) && state.totalDocs > state.result.length && state.page;
  if (!hasMore) return null;

  return (
    <div className="tw:flex tw:justify-center tw:py-6">
      <Button variant="secondary" onClick={() => fetchDataFun({ ...additionalParam, page: state.page + 1 })}>
        โหลดเพิ่มเติม
      </Button>
    </div>
  );
};

export default LoadMoreDataBtn;
