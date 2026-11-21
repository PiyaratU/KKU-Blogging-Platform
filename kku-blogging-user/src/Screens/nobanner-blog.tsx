import { Link } from "react-router-dom";
import { pastelFor } from "../components/ui/colors";
import { firstTag, formatThaiDate } from "../components/blogpost.component";
import type { NobannerBlogBlogCardProps as BlogCardProps } from "../types/blog";

/** รายการบล็อกแบบย่อในแถบ "ยอดนิยม" — ป้ายหมวด + หัวข้อ + ผู้เขียน · วันที่ */
const MinimalBlogPost: React.FC<BlogCardProps> = ({ blog }) => {
  const { topic, blog_id: id, author, publishedAt, tags } = blog;
  const category = firstTag(tags);

  return (
    <Link to={`/blog/${id}`} className="tw:group tw:block tw:py-3 tw:text-inherit tw:no-underline">
      {category && (
        <span className={`tw:inline-block tw:rounded-full tw:px-2.5 tw:py-0.5 tw:text-[0.7rem] tw:font-medium ${pastelFor(category)}`}>
          {category}
        </span>
      )}
      <p className="tw:mt-1.5 tw:mb-0 tw:line-clamp-2 tw:text-[0.95rem] tw:font-medium tw:leading-snug tw:text-ink tw:transition-colors tw:group-hover:text-primary-strong">
        {topic}
      </p>
      <p className="tw:mt-1 tw:mb-0 tw:text-xs tw:text-muted">
        <span className="tw:font-medium tw:text-ink-soft">{author?.fullname || "ไม่ทราบผู้เขียน"}</span>
        {publishedAt && ` · ${formatThaiDate(publishedAt)}`}
      </p>
    </Link>
  );
};

export default MinimalBlogPost;
