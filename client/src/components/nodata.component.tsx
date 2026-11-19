import type { NoDataMessageProps } from "../types/ui";

/** ข้อความเมื่อไม่มีข้อมูล */
const NoDataMessage: React.FC<NoDataMessageProps> = ({ message }) => (
  <div className="tw:mt-4 tw:rounded-2xl tw:bg-surface tw:px-6 tw:py-12 tw:text-center tw:text-sm tw:text-muted">{message}</div>
);

export default NoDataMessage;
