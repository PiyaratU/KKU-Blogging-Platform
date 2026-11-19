import { Link } from "react-router-dom";
import Cover from "../ui/Cover";
import Avatar from "../ui/Avatar";
import { ReadMoreLink } from "../ui/Button";
import { pastelTextFor } from "../ui/colors";
import { formatThaiDate } from "../blogpost.component";
import type { Post } from "../../types/post";

/** บทความเด่น — รูปใหญ่ซ้าย ข้อความขวา (จอเล็กเรียงบน-ล่าง) */
const FeaturedPost = ({ blog }: { blog: Post }) => {
  const { blog_id: id, topic, des, banner, publishedAt, author } = blog;
  const category = (Array.isArray(blog.tags) ? (blog.tags as string[])[0] : blog.tags) || "";

  return (
    <article className="tw:group tw:grid tw:items-center tw:gap-6 tw:md:grid-cols-2 tw:md:gap-12">
      <Link to={`/blog/${id}`} className="tw:block" aria-label={topic}>
        <Cover src={banner} seed={id || topic} className="tw:aspect-[4/3] tw:w-full tw:rounded-2xl" />
      </Link>
      <div>
        <p className="tw:m-0 tw:text-sm tw:text-muted">
          {formatThaiDate(publishedAt)}
          {category && (
            <>
              {" · "}
              <span className={`tw:font-semibold tw:uppercase ${pastelTextFor(category)}`}>{category}</span>
            </>
          )}
        </p>
        <Link to={`/blog/${id}`} className="tw:text-inherit tw:no-underline">
          <h2 className="tw:mt-3 tw:mb-0 tw:text-3xl tw:font-semibold tw:leading-snug tw:text-ink tw:transition-colors tw:group-hover:text-primary-strong tw:md:text-4xl">
            {topic}
          </h2>
        </Link>
        {des && <p className="tw:mt-4 tw:mb-0 tw:line-clamp-3 tw:text-base tw:leading-relaxed tw:text-muted">{des}</p>}
        <div className="tw:mt-6 tw:flex tw:flex-wrap tw:items-center tw:gap-4">
          <ReadMoreLink to={`/blog/${id}`} />
          {author && (
            <span className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-ink-soft">
              <Avatar src={author.profile_picture} name={author.fullname} size="xs" />
              {author.fullname}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;
