import { Link } from "react-router-dom";
import Cover from "../ui/Cover";
import { pastelFor } from "../ui/colors";
import { firstTag, formatThaiDate } from "../blogpost.component";
import type { Post } from "../../types/post";

/** รายการ "แนะนำสำหรับคุณ" ในแถบข้าง — รูปวงกลม + ป้ายหมวด + หัวข้อ */
const PickItem = ({ blog }: { blog: Post }) => {
  const { topic, blog_id: id, author, publishedAt, banner, tags } = blog;
  const category = firstTag(tags);

  return (
    <Link to={`/blog/${id}`} className="tw:group tw:flex tw:items-center tw:gap-4 tw:py-3 tw:text-inherit tw:no-underline">
      <Cover src={banner} seed={id || topic} className="tw:size-16 tw:shrink-0 tw:rounded-full" />
      <div className="tw:min-w-0">
        {category && (
          <span className={`tw:inline-block tw:rounded-md tw:px-2.5 tw:py-0.5 tw:text-[0.7rem] tw:font-medium ${pastelFor(category)}`}>
            {category}
          </span>
        )}
        <p className="tw:mt-1 tw:mb-0 tw:line-clamp-2 tw:text-sm tw:font-medium tw:leading-snug tw:text-ink tw:transition-colors tw:group-hover:text-primary-strong">
          {topic}
        </p>
        <p className="tw:mt-0.5 tw:mb-0 tw:text-xs tw:text-muted">
          {author?.fullname}
          {publishedAt && ` · ${formatThaiDate(publishedAt)}`}
        </p>
      </div>
    </Link>
  );
};

export default PickItem;
