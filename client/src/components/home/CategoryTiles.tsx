import { cn } from "../ui/cn";
import { pastelFor } from "../ui/colors";

type CategoryTilesProps = {
  tags: string[];
  activeTag?: string;
  onSelect: (tag: string) => void;
};

/** หมวดหมู่ยอดนิยม — กล่องพาสเทลเรียงเป็นตาราง กดแล้วกรองบล็อกตามหมวด */
const CategoryTiles = ({ tags, activeTag, onSelect }: CategoryTilesProps) => {
  if (!tags.length) return null;
  return (
    <div className="tw:mt-16">
      <h2 className="tw:mb-6 tw:mt-0 tw:text-2xl tw:font-semibold tw:text-ink">หมวดหมู่ยอดนิยม</h2>
      <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:grid-cols-3 tw:lg:grid-cols-6 tw:lg:gap-4">
        {tags.slice(0, 6).map((tag) => {
          const active = activeTag === tag.toLowerCase();
          return (
            <button
              type="button"
              key={tag}
              onClick={() => onSelect(tag)}
              aria-pressed={active}
              className={cn(
                "tw:flex tw:h-16 tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border-0 tw:px-3 tw:text-sm tw:font-medium tw:transition tw:cursor-pointer tw:hover:-translate-y-0.5 tw:hover:shadow-md",
                pastelFor(tag),
                active && "tw:ring-2 tw:ring-violet-400 tw:ring-offset-2"
              )}
            >
              <span className="tw:flex tw:size-7 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/70 tw:text-xs tw:font-semibold">
                {tag.charAt(0).toUpperCase()}
              </span>
              <span className="tw:truncate">{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTiles;
