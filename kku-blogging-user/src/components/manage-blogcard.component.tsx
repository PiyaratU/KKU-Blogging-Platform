import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import PostStatisticsChart from "./stat-component";
import type { ManageBlogcardBlog as Blog, BlogStatsProps, ManagePublishedBlogCardProps, ManageDraftBlogPostProps } from "../types/blog";

const BlogStats: React.FC<BlogStatsProps> = ({ stats }) => {
  return (
    <div className="stat-blogs">
      {Object.keys(stats).map((key, i) => {
        return !key.includes("parent") ? (
          <div key={i} className={"stat-key " + (i !== 0 ? " stat-keyi " : "")}>
            <h1 className="stat-h1">{stats[key].toLocaleString()}</h1>
            <p className="stat-p">{key.split("_")[1]}</p>
          </div>
        ) : null;
      })}
    </div>
  );
};

export const ManagePublishedBlogCard: React.FC<ManagePublishedBlogCardProps> = ({ blog }) => {
  let { banner, blog_id, topic, publishedAt, activity, _id } = blog;
  let [showStat, setShowStat] = useState(false);
  let { userAuth: { access_token } } = useContext(UserContext);

  return (
    <>
      <div className="manage-blogpage">
        <img src={banner} alt="" className="img-manageblog" />

        <div className="manage-blogdetail">
          <div>
            <Link
              to={`/blog/${blog_id}`}
              className="blog-title mb-4 manage-link"
            >
              {topic}
            </Link>

            <p className="clamp-1">เผยแพร่เมื่อ: {getDay(publishedAt)}</p>
          </div>

          <div className="d-flex gap-3 mt-3">
            <Link to={`/editor/${blog_id}`} className="stat-button">
              แก้ไข
            </Link>

            <button
              className="lg-hidden stat-button"
              onClick={() => setShowStat((prev) => !prev)}
            >
              สถิติ
            </button>

            <button
              className="stat-button "
              style={{ color: "red" }}
              onClick={(e) => deleteBlog(blog, access_token, e.target)}
            >
              ลบ
            </button>
          </div>
        </div>

        <div className="hidden-max-lg">
        <PostStatisticsChart postId={_id?.toString() || ""} />
        </div>

        {showStat ? (
        <div className="lg-hidden">
          <PostStatisticsChart postId={_id?.toString() || ""} />
        </div>
      ) : (
        ""
      )}
      </div>
    </>
  );
};

export const ManageDraftBlogPost: React.FC<ManageDraftBlogPostProps> = ({ blog }) => {
  let { topic, des, blog_id, index } = blog;
  let { userAuth: { access_token } } = useContext(UserContext);
  index++;

  return (
    <div className="draft-blogcard">
      <h1 className="blog-index index-front">
        {index < 10 ? "0" + index : index}
      </h1>

      <div>
        <h1 className="blog-title mb-3">{topic}</h1>
        <p className="clamp-2">{des?.length ? des : "ไม่มีรายละเอียดบล็อก"}</p>

        <div className="flex gap-3 mt-3">
          <Link to={`/editor/${blog_id}`} className="stat-button">
            แก้ไข
          </Link>

          <button
            className="stat-button "
            style={{ color: "red" }}
            onClick={(e) => deleteBlog(blog, access_token, e.target)}
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
};

/** บล็อกที่ผู้ใช้กดบันทึกไว้ — ตามที่ GET /create-blog/saved-blogsPost ส่งกลับ */
export type SavedBlogItem = {
  _id: string;
  topic?: string;
  banner?: string;
  des?: string;
  publishedAt?: string;
};

/** การ์ดบล็อกที่บันทึก 1 ใบ — หน้าจัดการบล็อกโหลดรายการครั้งเดียวแล้วส่งมาทีละใบ */
export const SaveBlog = ({ blog }: { blog: SavedBlogItem }) => {
  const { _id, topic, banner, des, publishedAt } = blog;

  return (
    <div className="manage-blogpage">
      {banner && <img src={banner} alt={topic || "บล็อก"} className="img-manageblog" />}
      <div>
        <Link to={`/blog/${_id}`} className="blog-title manage-link">
          <h1 className="blog-title mt-3">{topic || "ไม่มีชื่อบล็อก"}</h1>
        </Link>
        <p className="clamp-1">
          เผยแพร่เมื่อ:{" "}
          {publishedAt
            ? `${getDay(publishedAt)} ${new Date(publishedAt).getFullYear() + 543} เวลา ${new Date(
                publishedAt
              ).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`
            : "ไม่ทราบวันที่"}
        </p>
        <p>{des || ""}</p>
      </div>
    </div>
  );
};

const deleteBlog = (blog: any, access_token: any, target: any) => {
  let { index, blog_id, setStateFunc } = blog;

  target.setAttribute("disabled", true);

  axios
    .post(
      `${import.meta.env.REACT_APP_API_ENDPOINT}/create-blog/delete-blog`,
      { blog_id },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(({ data }) => {
      target.removeAttribute("disabled");

      setStateFunc((preVal: any) => {
        let { deleteDocCount, totalDocs, result } = preVal;

        result.splice(index, 1);

        if (!deleteDocCount) {
          deleteDocCount = 0;
        }

        if (!result.length && totalDocs - 1 > 0) {
          return null;
        }

        console.log({
          ...preVal,
          totalDocs: totalDocs - 1,
          deleteDocCount: deleteDocCount + 1,
        });
        return {
          ...preVal,
          totalDocs: totalDocs - 1,
          deleteDocCount: deleteDocCount + 1,
        };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};