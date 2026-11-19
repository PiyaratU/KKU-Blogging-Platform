import { Link } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import { formatThaiDate } from "../components/blogpost.component";
import type { NobannerBlogBlogCardProps as BlogCardProps } from "../types/blog";

/** รายการบล็อกแบบย่อ (มีลำดับเลข) — ใช้ในแถบ "ยอดนิยม" */
const MinimalBlogPost: React.FC<BlogCardProps> = ({ blog, index }) => {
  const { topic, blog_id: id, author, publishedAt } = blog;
  const fullname = author?.fullname || "ไม่ทราบผู้เขียน";

  return (
    <Link to={`/blog/${id}`} className="tw:group tw:flex tw:gap-4 tw:py-3 tw:text-inherit tw:no-underline">
      <span
        className="tw:w-8 tw:shrink-0 tw:text-2xl tw:font-semibold tw:leading-none tw:text-violet-300"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="tw:min-w-0">
        <div className="tw:flex tw:items-center tw:gap-2 tw:text-xs">
          <Avatar src={author?.profile_picture} name={fullname} size="xs" className="tw:size-5" />
          <span className="tw:truncate tw:font-medium tw:text-ink-soft">{fullname}</span>
          <span className="tw:shrink-0 tw:text-muted">{formatThaiDate(publishedAt)}</span>
        </div>
        <p className="tw:mt-1.5 tw:mb-0 tw:line-clamp-2 tw:text-[0.95rem] tw:font-semibold tw:leading-snug tw:text-ink tw:transition-colors tw:group-hover:text-primary-strong">
          {topic}
        </p>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
