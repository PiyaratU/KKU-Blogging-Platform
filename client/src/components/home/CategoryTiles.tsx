import { cn } from "../ui/cn";
import { PASTEL } from "../ui/colors";
import { firstTag } from "../blogpost.component";
import type { Post } from "../../types/post";

type CategoryTilesProps = {
  tags: string[];
  /** บล็อกที่มีอยู่แล้วในหน้า — ใช้รูปปกของบล็อกแรกในแต่ละหมวดเป็นรูปวงกลม */
  posts?: Post[];
  activeTag?: string;
  onSelect: (tag: string) => void;
};

/** รูปของหมวด = รูปปกของบล็อกแรกในหมวดนั้นที่มีรูป (key เป็นตัวพิมพ์เล็ก) */
const coversByTag = (posts: Post[]): Record<string, string> => {
  const covers: Record<string, string> = {};
  posts.forEach((post) => {
    const tag = firstTag(post.tags).toLowerCase();
    if (tag && post.banner && !covers[tag]) covers[tag] = post.banner;
  });
  return covers;
};

/** หมวดหมู่ยอดนิยม — แถบพาสเทลกว้าง มีรูปวงกลม (ไม่มีรูปใช้ตัวอักษรแรก) กดแล้วกรองบล็อกตามหมวด */
const CategoryTiles = ({ tags, posts = [], activeTag, onSelect }: CategoryTilesProps) => {
  if (!tags.length) return null;
  const covers = coversByTag(posts);

  return (
    <div className="tw:mt-20">
      <h2 className="tw:mb-6 tw:mt-0 tw:text-2xl tw:font-semibold tw:text-ink tw:md:text-3xl">หมวดหมู่ยอดนิยม</h2>
      <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:lg:gap-6">
        {tags.slice(0, 6).map((tag, i) => {
          const active = activeTag === tag.toLowerCase();
          const cover = covers[tag.toLowerCase()];
          return (
            <button
              type="button"
              key={tag}
              onClick={() => onSelect(tag)}
              aria-pressed={active}
              className={cn(
                "tw:flex tw:h-24 tw:items-center tw:gap-4 tw:rounded-2xl tw:border-0 tw:px-5 tw:text-left tw:transition tw:cursor-pointer tw:hover:-translate-y-0.5 tw:hover:shadow-md",
                PASTEL[i % PASTEL.length], // ไล่สีตามลำดับ ให้ 6 กล่องไม่ซ้ำสีกัน
                active && "tw:ring-2 tw:ring-violet-400 tw:ring-offset-2"
              )}
            >
              <span className="tw:flex tw:size-14 tw:shrink-0 tw:items-center tw:justify-center tw:overflow-hidden tw:rounded-full tw:bg-white/70 tw:text-lg tw:font-semibold">
                {cover ? (
                  <img src={cover} alt="" loading="lazy" className="tw:size-full tw:object-cover" />
                ) : (
                  tag.charAt(0).toUpperCase()
                )}
              </span>
              <span className="tw:min-w-0 tw:truncate tw:text-base tw:font-semibold">{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTiles;
