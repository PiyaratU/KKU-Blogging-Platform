import { Link } from "react-router-dom";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { useState } from "react";
import Avatar from "./ui/Avatar";
import Tag from "./ui/Tag";
import { cn } from "./ui/cn";
import { pastelGradientFor } from "./ui/colors";
import type { BlogpostBlogCardProps as BlogCardProps } from "../types/blog";

/** "19 พ.ย. 2569" — ปี พ.ศ. ตาม locale ไทย */
export const formatThaiDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "";

/** การ์ดบล็อกในฟีด / ผลค้นหา / หน้าโปรไฟล์ */
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
  // ข้อมูลจริงเป็น array แต่ type เดิมประกาศเป็น string — รองรับทั้งสองแบบ
  const tagList: string[] = (Array.isArray(tags) ? (tags as string[]) : tags ? [tags] : []).slice(0, 2);

  return (
    <article className="tw:border-b tw:border-line">
      <Link to={`/blog/${id}`} className="tw:group tw:flex tw:gap-5 tw:py-6 tw:text-inherit tw:no-underline tw:md:gap-8">
        <div className="tw:min-w-0 tw:flex-1">
          <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm">
            <Avatar src={profile_picture} name={fullname} size="xs" />
            <span className="tw:truncate tw:font-medium tw:text-ink-soft">{fullname}</span>
            <span className="tw:text-muted" aria-hidden="true">
              ·
            </span>
            <time className="tw:shrink-0 tw:text-muted" dateTime={publishedAt}>
              {formatThaiDate(publishedAt) || "ไม่ทราบวันที่"}
            </time>
            {visibility === "followers" && (
              <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-muted" title="เฉพาะผู้ติดตาม">
                <FaUserGroup className="tw:size-3" />
                <span className="tw:sr-only">เฉพาะผู้ติดตาม</span>
              </span>
            )}
          </div>

          <h2 className="tw:mt-3 tw:mb-0 tw:line-clamp-2 tw:text-xl tw:font-semibold tw:leading-snug tw:text-ink tw:transition-colors tw:group-hover:text-primary-strong tw:md:text-2xl">
            {topic}
          </h2>

          {des && (
            <p className="tw:mt-2 tw:mb-0 tw:line-clamp-2 tw:text-[0.95rem] tw:leading-relaxed tw:text-muted">{des}</p>
          )}

          <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-x-4 tw:gap-y-2 tw:text-sm tw:text-muted">
            {tagList.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            <span className="tw:inline-flex tw:items-center tw:gap-1.5" title="ถูกใจ">
              <FaRegHeart className="tw:size-3.5 tw:text-rose-300" />
              {total_likes}
            </span>
            <span className="tw:inline-flex tw:items-center tw:gap-1.5" title="ความคิดเห็น">
              <FaRegCommentDots className="tw:size-3.5 tw:text-sky-300" />
              {total_comments}
            </span>
          </div>
        </div>

        <Cover src={banner} seed={id || topic} />
      </Link>
    </article>
  );
};

/** รูปปก — ไม่มีรูปหรือโหลดไม่ได้ แสดงพาสเทลไล่สีอ่อน (สีตามบล็อก) แทน */
const Cover = ({ src, seed }: { src?: string; seed: string }) => {
  const [broken, setBroken] = useState(false);
  const box = "tw:mt-1 tw:size-24 tw:shrink-0 tw:overflow-hidden tw:rounded-xl tw:sm:h-28 tw:sm:w-40";
  if (!src || broken) {
    return <div aria-hidden="true" className={cn(box, "tw:bg-linear-to-br", pastelGradientFor(seed))} />;
  }
  return (
    <div className={cn(box, "tw:bg-surface")}>
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
        className="tw:size-full tw:object-cover tw:transition-transform tw:duration-300 tw:group-hover:scale-105"
      />
    </div>
  );
};

export default BlogCard;
