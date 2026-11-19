import type { ReactNode } from "react";
import Tag from "./ui/Tag";

type FeedSidebarProps = {
  tags: string[];
  activeTag?: string;
  onTagClick: (tag: string) => void;
  /** รายการบล็อกยอดนิยม (หรือ Loader / ข้อความว่าง) */
  trending: ReactNode;
};

const heading = "tw:mb-4 tw:mt-0 tw:text-sm tw:font-semibold tw:text-ink";

/** แถบข้างหน้าฟีด (จอใหญ่) — แท็กยอดนิยม + บล็อกที่ถูกใจมากที่สุด */
const FeedSidebar = ({ tags, activeTag, onTagClick, trending }: FeedSidebarProps) => (
  <aside className="tw:hidden tw:w-72 tw:shrink-0 tw:lg:block">
    <div className="tw:sticky tw:top-24 tw:space-y-6">
      <div className="tw:rounded-2xl tw:bg-violet-50/70 tw:p-5">
        <h3 className={heading}>แท็กยอดนิยม</h3>
        {tags.length ? (
          <div className="tw:flex tw:flex-wrap tw:gap-2">
            {tags.map((tag) => (
              <Tag key={tag} active={activeTag === tag.toLowerCase()} onClick={() => onTagClick(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
        ) : (
          <p className="tw:m-0 tw:text-sm tw:text-muted">ยังไม่มีแท็ก</p>
        )}
      </div>

      <div className="tw:rounded-2xl tw:bg-amber-50/70 tw:p-5">
        <h3 className={heading}>ถูกใจมากที่สุด</h3>
        {trending}
      </div>
    </div>
  </aside>
);

export default FeedSidebar;
