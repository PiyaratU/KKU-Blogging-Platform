import { FaEarthAmericas } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { cn } from "./ui/cn";

type Visibility = "public" | "followers";

const OPTIONS: { value: Visibility; label: string; hint: string; Icon: typeof FaUserFriends }[] = [
  { value: "public", label: "สาธารณะ", hint: "ทุกคนเห็นได้", Icon: FaEarthAmericas },
  { value: "followers", label: "ผู้ติดตาม", hint: "เฉพาะผู้ติดตาม", Icon: FaUserFriends },
];

/** เลือกว่าใครเห็นโพสต์ได้ — การ์ดสองตัวเลือก */
const VisibilitySelector = ({
  visibility,
  onChange,
}: {
  visibility: string;
  onChange: (value: Visibility) => void;
}) => (
  <div role="radiogroup" aria-label="ใครเห็นโพสต์นี้ได้" className="tw:grid tw:grid-cols-2 tw:gap-2">
    {OPTIONS.map(({ value, label, hint, Icon }) => {
      const active = visibility === value;
      return (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(value)}
          className={cn(
            "tw:flex tw:cursor-pointer tw:items-start tw:gap-2.5 tw:rounded-xl tw:border tw:p-3 tw:text-left tw:transition-colors",
            active
              ? "tw:border-primary tw:bg-primary-soft"
              : "tw:border-line tw:bg-white tw:hover:bg-surface"
          )}
        >
          <Icon className={cn("tw:mt-0.5 tw:size-4 tw:shrink-0", active ? "tw:text-primary-strong" : "tw:text-muted")} />
          <span className="tw:min-w-0">
            <span className={cn("tw:block tw:text-sm tw:font-medium", active ? "tw:text-primary-strong" : "tw:text-ink")}>
              {label}
            </span>
            <span className="tw:block tw:text-xs tw:text-muted">{hint}</span>
          </span>
        </button>
      );
    })}
  </div>
);

export default VisibilitySelector;
