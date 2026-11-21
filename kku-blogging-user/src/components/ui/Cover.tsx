import { useState } from "react";
import { cn } from "./cn";
import { pastelGradientFor } from "./colors";

type CoverProps = {
  src?: string | null;
  /** ใช้เลือกสีพาสเทลเมื่อไม่มีรูป (เช่น id ของบล็อก) */
  seed: string;
  /** ขนาด / สัดส่วน / มุมโค้ง ของกรอบรูป */
  className?: string;
};

/** รูปปกบล็อก — ไม่มีรูปหรือโหลดไม่ได้ แสดงพาสเทลไล่สีอ่อน (สีตามบล็อก) แทน */
const Cover = ({ src, seed, className }: CoverProps) => {
  const [broken, setBroken] = useState(false);
  const box = cn("tw:overflow-hidden tw:bg-surface", className);
  if (!src || broken) {
    return <div aria-hidden="true" className={cn(box, "tw:bg-linear-to-br", pastelGradientFor(seed))} />;
  }
  return (
    <div className={box}>
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
        className="tw:size-full tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-105"
      />
    </div>
  );
};

export default Cover;
