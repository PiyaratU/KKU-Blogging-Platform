import { useState } from "react";
import PostRow from "../components/home/PostRow";
import Pager from "../components/home/Pager";
import MinimalBlogPost from "../Screens/nobanner-blog";
import FeedSidebar from "../components/FeedSidebar";
import HomeHero from "../components/home/HomeHero";
import FeaturedPost from "../components/home/FeaturedPost";
import CategoryTiles from "../components/home/CategoryTiles";
import PickItem from "../components/home/PickItem";
import NoDataMessage from "../components/nodata.component";

/**
 * หน้าตัวอย่าง UI (เฉพาะตอน npm run dev — route /dev/ui) — หน้าแรกด้วยข้อมูลสมมติ
 * ไม่ต้องมีข้อมูลในฐานข้อมูล · ไม่ถูกรวมใน build จริง
 */
const now = Date.now();
const COLORS = ["#ede4f7", "#e3eef7", "#f3ece2", "#e6f2ea", "#f7e4ea", "#e2f1f0"];
const svgCover = (i: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="${COLORS[i % COLORS.length]}"/><circle cx="470" cy="150" r="90" fill="#fff" opacity=".7"/><rect x="80" y="300" width="300" height="24" rx="12" fill="#fff" opacity=".8"/><rect x="80" y="344" width="200" height="24" rx="12" fill="#fff" opacity=".6"/></svg>`
  )}`;

const TOPICS = [
  "เริ่มต้นเขียนบล็อกอย่างไรให้คนอยากอ่านจนจบ",
  "รีวิวร้านกาแฟรอบมหาวิทยาลัยขอนแก่น ที่นั่งทำงานได้ทั้งวัน",
  "สรุปเนื้อหา Data Structure ก่อนสอบไฟนอล ฉบับเข้าใจง่าย",
  "ทริปเที่ยวภูกระดึงครั้งแรก เตรียมตัวยังไงไม่ให้พลาด",
  "แต่งหอพักงบน้อยให้น่าอยู่ ด้วยของจากตลาดนัด",
  "ฝึกงานที่บริษัทเทคครั้งแรก ได้เรียนรู้อะไรบ้าง",
];
const TAGS = [["การเขียน"], ["ร้านกาแฟ"], ["การเรียน"], ["ท่องเที่ยว"], ["ไลฟ์สไตล์"], ["เทคโนโลยี"]];
const AUTHORS = ["ปิยะรัตน์ อุปชีวะ", "สมชาย ใจดี", "Nok Student"];

const sample = (i: number) =>
  ({
    blog_id: `sample-${i}`,
    topic: TOPICS[i % TOPICS.length],
    des: "เกริ่นสั้น ๆ ของบทความ ให้คนอ่านรู้ว่าจะได้อะไรจากบล็อกนี้ ไม่ยาวเกินสองบรรทัด ถ้ายาวกว่านั้นจะถูกตัดด้วยจุดสามจุด เพื่อให้การ์ดสูงเท่า ๆ กัน",
    banner: i === 3 ? "" : svgCover(i),
    tags: TAGS[i % TAGS.length],
    publishedAt: new Date(now - i * 86400000 * 3).toISOString(),
    activity: { total_likes: 12 + i * 7, total_comments: i * 2 },
    visibility: i === 1 ? "followers" : "public",
    author: { fullname: AUTHORS[i % AUTHORS.length], username: "user" + i, profile_picture: "" },
  }) as any;

const blogs = [0, 1, 2, 3, 4, 5].map(sample);
const tags = TAGS.map((t) => t[0]);

const UiPreview = () => {
  const [page, setPage] = useState(1);
  const pageBlogs = page === 1 ? blogs.slice(0, 5) : blogs.slice(5);
  return (
  <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:pb-20 tw:md:px-8">
    <HomeHero />
    <FeaturedPost blog={blogs[0]} />
    <CategoryTiles tags={tags} posts={blogs} onSelect={() => {}} />

    <div className="tw:mt-16 tw:flex tw:gap-12 tw:xl:gap-16">
      <div className="tw:min-w-0 tw:flex-1">
        <h2 className="tw:m-0 tw:text-2xl tw:font-semibold tw:text-ink tw:md:text-3xl">บล็อกล่าสุด</h2>
        <div className="tw:divide-y tw:divide-line">
          {pageBlogs.map((b) => (
            <PostRow key={b.blog_id} blog={b} />
          ))}
        </div>
        <Pager page={page} hasMore={page === 1} onChange={setPage} />
        <h3 className="tw:mt-12 tw:text-sm tw:font-semibold tw:text-ink">ตอนยังไม่มีบล็อก</h3>
        <NoDataMessage message="ยังไม่มีบล็อกที่เผยแพร่" hint="มาเป็นคนแรกที่แบ่งปันเรื่องราว" />
      </div>

      <FeedSidebar
        tags={tags}
        activeTag="การเรียน"
        onTagClick={() => {}}
        popular={
          <div className="tw:divide-y tw:divide-line">
            {blogs.slice(0, 4).map((b, i) => (
              <MinimalBlogPost key={b.blog_id} blog={b} index={i} />
            ))}
          </div>
        }
        picks={
          <div className="tw:divide-y tw:divide-line">
            {blogs.slice(2, 6).map((b) => (
              <PickItem key={b.blog_id} blog={b} />
            ))}
          </div>
        }
      />
    </div>
  </div>
  );
};

export default UiPreview;
