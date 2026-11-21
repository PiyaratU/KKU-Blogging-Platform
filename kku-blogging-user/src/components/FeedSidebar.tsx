import type { ReactNode } from "react";
import Tag from "./ui/Tag";

type FeedSidebarProps = {
  tags: string[];
  activeTag?: string;
  onTagClick: (tag: string) => void;
  /** รายการบล็อกยอดนิยม (หรือ Loader / ข้อความว่าง) */
  popular: ReactNode;
  /** รายการแนะนำ — ไม่ส่ง = ไม่แสดงหัวข้อนี้ */
  picks?: ReactNode;
};

const Section = ({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) => (
  <div>
    <p className="tw:m-0 tw:text-xs tw:text-muted">{eyebrow}</p>
    <h3 className="tw:mt-0.5 tw:mb-3 tw:text-xl tw:font-semibold tw:text-ink">{title}</h3>
    {children}
  </div>
);

/** แถบข้างหน้าแรก (จอใหญ่) — ยอดนิยม / หมวดหมู่ / แนะนำสำหรับคุณ */
const FeedSidebar = ({ tags, activeTag, onTagClick, popular, picks }: FeedSidebarProps) => (
  <aside className="tw:hidden tw:w-80 tw:shrink-0 tw:lg:block">
    <div className="tw:space-y-12">
      <Section eyebrow="กำลังมาแรง" title="ยอดนิยม">
        {popular}
      </Section>

      <Section eyebrow="ค้นหาตามหัวข้อ" title="หมวดหมู่">
        {tags.length ? (
          <div className="tw:flex tw:flex-wrap tw:gap-2">
            {tags.map((tag) => (
              <Tag key={tag} hash={false} active={activeTag === tag.toLowerCase()} onClick={() => onTagClick(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
        ) : (
          <p className="tw:m-0 tw:text-sm tw:text-muted">ยังไม่มีหมวดหมู่ — แท็กที่ใช้บ่อยในบล็อกจะขึ้นที่นี่</p>
        )}
      </Section>

      {picks && (
        <Section eyebrow="คัดมาให้คุณ" title="แนะนำสำหรับคุณ">
          {picks}
        </Section>
      )}
    </div>
  </aside>
);

export default FeedSidebar;
