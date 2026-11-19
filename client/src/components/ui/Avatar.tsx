import { useState } from "react";
import { cn } from "./cn";
import { pastelFor } from "./colors";

const SIZES = {
  xs: "tw:size-6 tw:text-[0.65rem]",
  sm: "tw:size-8 tw:text-xs",
  md: "tw:size-10 tw:text-sm",
  lg: "tw:size-16 tw:text-xl",
} as const;

type AvatarProps = {
  src?: string | null;
  name?: string;
  size?: keyof typeof SIZES;
  className?: string;
};

/** รูปโปรไฟล์ทรงกลม — ไม่มีรูปหรือโหลดไม่ได้ แสดงตัวอักษรแรกของชื่อแทน */
const Avatar = ({ src, name = "", size = "sm", className }: AvatarProps) => {
  const [broken, setBroken] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const base = cn("tw:shrink-0 tw:rounded-full tw:overflow-hidden", SIZES[size], className);

  if (!src || broken) {
    return (
      <span
        aria-hidden="true"
        className={cn(base, "tw:inline-flex tw:items-center tw:justify-center tw:font-semibold", pastelFor(name))}
      >
        {initial}
      </span>
    );
  }
  return <img src={src} alt="" className={cn(base, "tw:object-cover")} onError={() => setBroken(true)} />;
};

export default Avatar;
