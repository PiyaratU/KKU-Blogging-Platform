import { Link } from "react-router-dom";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import Avatar from "./ui/Avatar";
import Cover from "./ui/Cover";
import { pastelTextFor } from "./ui/colors";
import type { BlogpostBlogCardProps as BlogCardProps } from "../types/blog";

/** "19 พ.ย. 2569" — ปี พ.ศ. ตาม locale ไทย */
export const formatThaiDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "";

/** หมวดหมู่หลักของบล็อก = แท็กแรก (ข้อมูลจริงเป็น array แต่ type เดิมประกาศเป็น string) */
export const firstTag = (tags: unknown): string =>
  (Array.isArray(tags) ? (tags[0] as string) : (tags as string)) || "";

/** การ์ดบล็อก — รูปปกซ้าย ข้อความขวา (จอเล็กเรียงบน-ล่าง) · ใช้ในหน้าแรก / ผลค้นหา / หน้าโปรไฟล์ */
const BlogCard: React.FC<BlogCardProps> = ({ content, author }) => {
  const {
    publishedAt,
    tags,
    topic,
    des,
    banner,
    activity: { total_likes = 0, total_comments = 0 } = {},
    blog_id: id,
    visibility,
  } = content;

  const { fullname = "ไม่ทราบผู้เขียน", profile_picture = "" } = author || {};
  const category = firstTag(tags);

  return (
    <article className="tw:group tw:grid tw:gap-5 tw:py-6 tw:sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] tw:sm:gap-8">
      <Link to={`/blog/${id}`} className="tw:block" aria-label={topic}>
        <Cover src={banner} seed={id || topic} className="tw:aspect-[4/3] tw:w-full tw:rounded-xl" />
      </Link>

      <div className="tw:flex tw:min-w-0 tw:flex-col tw:justify-center">
        <p className="tw:m-0 tw:flex tw:items-center tw:gap-1.5 tw:text-sm tw:text-muted">
          <time dateTime={publishedAt}>{formatThaiDate(publishedAt) || "ไม่ทราบวันที่"}</time>
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <span className={`tw:font-semibold tw:uppercase ${pastelTextFor(category)}`}>{category}</span>
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
          <h2 className="tw:mt-3 tw:mb-0 tw:line-clamp-2 tw:text-xl tw:font-semibold tw:leading-snug tw:text-ink tw:transition-colors tw:group-hover:text-primary-strong tw:md:text-2xl">
            {topic}
          </h2>
        </Link>

        {des && <p className="tw:mt-3 tw:mb-0 tw:line-clamp-2 tw:text-[0.95rem] tw:leading-relaxed tw:text-muted">{des}</p>}

        <div className="tw:mt-5 tw:flex tw:flex-wrap tw:items-center tw:gap-x-4 tw:gap-y-2 tw:text-sm tw:text-muted">
          <span className="tw:flex tw:min-w-0 tw:items-center tw:gap-2 tw:text-ink-soft">
            <Avatar src={profile_picture} name={fullname} size="xs" />
            <span className="tw:truncate">{fullname}</span>
          </span>
          <span className="tw:inline-flex tw:items-center tw:gap-1.5" title="ถูกใจ">
            <FaRegHeart className="tw:size-3.5 tw:text-rose-300" />
            {total_likes}
          </span>
          <span className="tw:inline-flex tw:items-center tw:gap-1.5" title="ความคิดเห็น">
            <FaRegCommentDots className="tw:size-3.5 tw:text-sky-300" />
            {total_comments}
          </span>
          <Link
            to={`/blog/${id}`}
            className="tw:ml-auto tw:border-b tw:border-ink-soft tw:pb-0.5 tw:text-sm tw:font-medium tw:text-ink tw:no-underline tw:hover:border-primary-strong tw:hover:text-primary-strong"
          >
            อ่านต่อ
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
