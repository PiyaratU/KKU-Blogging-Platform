import BlogCard from "../components/blogpost.component";
import MinimalBlogPost from "../Screens/nobanner-blog";
import InPageNavigation from "../components/Inpage-navigation";
import FeedHero from "../components/FeedHero";
import FeedSidebar from "../components/FeedSidebar";
import Tag from "../components/ui/Tag";
import Avatar from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import NoDataMessage from "../components/nodata.component";
import Loader from "../components/loader.component";

/**
 * หน้าตัวอย่าง UI (เฉพาะตอน npm run dev — route /dev/ui) ใช้ดูหน้าตา component ด้วยข้อมูลสมมติ
 * ไม่ต้องมีข้อมูลในฐานข้อมูล · ไม่ถูกรวมใน build จริง
 */
const now = Date.now();
const sample = (i: number) =>
  ({
    blog_id: `sample-${i}`,
    topic: [
      "เริ่มต้นเขียนบล็อกอย่างไรให้คนอยากอ่านจนจบ",
      "รีวิวร้านกาแฟรอบมหาวิทยาลัยขอนแก่น ที่นั่งทำงานได้ทั้งวัน",
      "สรุปเนื้อหา Data Structure ก่อนสอบไฟนอล ฉบับเข้าใจง่าย",
      "ทริปเที่ยวภูกระดึงครั้งแรก เตรียมตัวยังไงไม่ให้พลาด",
    ][i % 4],
    des: "เกริ่นสั้น ๆ ของบทความ ให้คนอ่านรู้ว่าจะได้อะไรจากบล็อกนี้ ไม่ยาวเกินสองบรรทัด ถ้ายาวกว่านั้นจะถูกตัดด้วยจุดสามจุด เพื่อให้การ์ดสูงเท่า ๆ กัน",
    // รูปปกตัวอย่าง (SVG ในตัว ไม่ต้องโหลดจากเน็ต) — ใบที่ 3 ไม่มีรูปปก
    banner:
      i === 2
        ? ""
        : `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220"><rect width="320" height="220" fill="${["#ede4f7", "#e3eef7", "#f3ece2", "#e6f2ea"][i % 4]}"/><circle cx="230" cy="80" r="46" fill="#ffffff" opacity=".7"/><rect x="40" y="140" width="160" height="14" rx="7" fill="#ffffff" opacity=".8"/></svg>`
          )}`,
    tags: [["เทคโนโลยี", "การเขียน"], ["ร้านกาแฟ"], ["การเรียน", "สอบ"], ["ท่องเที่ยว"]][i % 4],
    publishedAt: new Date(now - i * 86400000 * 3).toISOString(),
    activity: { total_likes: 12 + i * 7, total_comments: i * 2 },
    visibility: i === 1 ? "followers" : "public",
    author: { fullname: ["ปิยะรัตน์ อุปชีวะ", "สมชาย ใจดี", "Nok Student"][i % 3], username: "user" + i, profile_picture: "" },
  }) as any;

const blogs = [0, 1, 2, 3].map(sample);
const tags = ["เทคโนโลยี", "การเรียน", "ร้านกาแฟ", "ท่องเที่ยว", "การเขียน", "สอบ"];

const UiPreview = () => (
  <div className="tw:mx-auto tw:flex tw:max-w-7xl tw:gap-10 tw:px-4 tw:py-6 tw:md:px-8 tw:xl:gap-14">
    <div className="tw:min-w-0 tw:flex-1">
      <FeedHero />
      <InPageNavigation routes={["ล่าสุด", "ยอดนิยม"]} defaultHidden={["ยอดนิยม"]}>
        <>
          {blogs.map((b) => (
            <BlogCard key={b.blog_id} content={b} author={b.author} />
          ))}
        </>
        <div className="tw:divide-y tw:divide-line">
          {blogs.map((b, i) => (
            <MinimalBlogPost key={b.blog_id} blog={b} index={i} />
          ))}
        </div>
      </InPageNavigation>

      <h3 className="tw:mt-12 tw:text-sm tw:font-semibold tw:text-ink">ชิ้นส่วนพื้นฐาน</h3>
      <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        <Button>ปุ่มหลัก</Button>
        <Button variant="secondary">ปุ่มรอง</Button>
        <Button variant="ghost">ปุ่มเรียบ</Button>
        <Button size="sm">เล็ก</Button>
        {tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        <Tag active onClick={() => {}}>
          เลือกอยู่
        </Tag>
        <Avatar name="ปิยะรัตน์" size="md" />
        <Avatar name="สมชาย" size="md" />
        <Avatar name="Nok" size="md" />
      </div>
      <NoDataMessage message="ยังไม่มีบล็อกที่เผยแพร่" />
      <Loader />
    </div>

    <FeedSidebar
      tags={tags}
      activeTag="การเรียน"
      onTagClick={() => {}}
      trending={
        <div className="tw:divide-y tw:divide-line">
          {blogs.map((b, i) => (
            <MinimalBlogPost key={b.blog_id} blog={b} index={i} />
          ))}
        </div>
      }
    />
  </div>
);

export default UiPreview;
