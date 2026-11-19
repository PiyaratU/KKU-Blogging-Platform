import { Link } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import Cover from "../ui/Cover";
import { pastelTextFor } from "../ui/colors";
import { firstTag, formatThaiDate } from "../blogpost.component";
import type { Post } from "../../types/post";

/**
 * แถวบล็อกในหน้าแรก (แบบนิตยสาร) — รูปใหญ่ซ้าย · วันที่ · หมวด · หัวข้อ · เกริ่น · "อ่านต่อ"
 * หน้าค้นหา / โปรไฟล์ยังใช้ BlogCard ที่มีผู้เขียนและยอดถูกใจ
 */
const PostRow = ({ blog }: { blog: Post }) => {
  const { blog_id: id, topic, des, banner, publishedAt, tags, visibility } = blog;
  const category = firstTag(tags);

  return (
    <article className="tw:group tw:grid tw:gap-5 tw:py-8 tw:first:pt-6 tw:sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] tw:sm:items-center tw:sm:gap-10">
      <Link to={`/blog/${id}`} className="tw:block" aria-label={topic}>
        <Cover src={banner} seed={id || topic} className="tw:aspect-[4/3] tw:w-full tw:rounded-2xl" />
      </Link>

      <div className="tw:min-w-0">
        <p className="tw:m-0 tw:flex tw:flex-wrap tw:items-center tw:gap-x-1.5 tw:text-sm tw:text-muted">
          <time dateTime={publishedAt}>{formatThaiDate(publishedAt)}</time>
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <span className={`tw:font-semibold tw:uppercase tw:tracking-wide ${pastelTextFor(category)}`}>{category}</span>
            </>
          )}
          {visibility === "followers" && (
            <span className="tw:ml-1 tw:inline-flex tw:items-center" title="เฉพาะผู้ติดตาม">
              <FaUserGroup className="tw:size-3" />
              <span className="tw:sr-only">เฉพาะผู้ติดตาม</span>
            </span>
          )}
        </p>

        <Link to={`/blog/${id}`} className="tw:text-inherit tw:no-underline">
          <h3 className="tw:mt-3 tw:mb-0 tw:line-clamp-3 tw:text-2xl tw:font-semibold tw:leading-snug tw:text-ink tw:transition-colors tw:group-hover:text-primary-strong tw:md:text-[1.75rem]">
            {topic}
          </h3>
        </Link>

        {des && <p className="tw:mt-4 tw:mb-0 tw:line-clamp-3 tw:text-base tw:leading-relaxed tw:text-muted">{des}</p>}

        <Link
          to={`/blog/${id}`}
          className="tw:mt-5 tw:inline-block tw:border-b-2 tw:border-ink tw:pb-0.5 tw:text-sm tw:font-semibold tw:text-ink tw:no-underline tw:transition-colors tw:hover:border-primary-strong tw:hover:text-primary-strong"
        >
          อ่านต่อ
        </Link>
      </div>
    </article>
  );
};

export default PostRow;
