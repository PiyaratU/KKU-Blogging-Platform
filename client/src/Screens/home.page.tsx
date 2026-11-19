import AnimationWrapper from "./page-animation";
import HomeHero from "../components/home/HomeHero";
import FeaturedPost from "../components/home/FeaturedPost";
import CategoryTiles from "../components/home/CategoryTiles";
import PickItem from "../components/home/PickItem";
import PostRow from "../components/home/PostRow";
import Pager from "../components/home/Pager";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Loader from "../components/loader.component";
import { Post } from "../types/post";
import MinimalBlogPost from "./nobanner-blog";
import FeedSidebar from "../components/FeedSidebar";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../components/filter-pagination";
import { Button, LinkButton } from "../components/ui/Button";
import { LuFileEdit } from "react-icons/lu";
import { UserContext } from "../App";
import { useSearchParams } from "react-router-dom";
import { getTopTags } from "../components/home/topTags";
import type { HomeBlogState as BlogState } from "../types/blog";

const HOME = "หน้าหลัก";
/** /posts/latest-blog ส่งครั้งละ 5 เรื่อง — หมวดหมู่ขอจำนวนเท่ากันจะได้เปลี่ยนหน้าแบบเดียวกัน */
const PAGE_SIZE = 5;

const getAuthHeaders = () => {
  const userStr = sessionStorage.getItem("user");
  if (!userStr) return {};
  try {
    const user = JSON.parse(userStr);
    if (user?.access_token) {
      return { Authorization: `Bearer ${user.access_token}`, "Content-Type": "application/json" };
    }
  } catch (err) {
    console.error("Error parsing user data:", err);
  }
  return { "Content-Type": "application/json" };
};

const HomePage = () => {
  const API_URL = import.meta.env.REACT_APP_API_ENDPOINT || "https://kku-blog-server-ak2l.onrender.com";
  const [recommend, setRecommend] = useState<BlogState | null>(null);
  const [trendingBlogs, setTrendingBlogs] = useState<Post[] | null>(null);
  // หมวดที่เลือกเก็บใน URL (?tag=) — ลิงก์หมวดในส่วนท้ายเว็บพามาที่นี่ได้
  const [searchParams, setSearchParams] = useSearchParams();
  const pageState = searchParams.get("tag")?.toLowerCase() || HOME;
  const [allTags, setAllTags] = useState<string[]>([]);
  /** หน้าแรกของฟีดหลัก — ใช้หาบทความเด่นและรูปของหมวด */
  const [firstPage, setFirstPage] = useState<Post[]>([]);

  // รายการที่กำลังแสดง — ทีละหน้า แทนที่ของเดิม (ไม่ต่อท้าย)
  const [blogs, setBlogs] = useState<Post[] | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const isTagFeed = pageState !== HOME;

  // กดแท็กเดิมซ้ำ = กลับไปหน้าหลัก
  const loadBlogBycategory = (tag: string) => {
    const category = tag.toLowerCase();
    setBlogs(null);
    setSearchParams(pageState === category ? {} : { tag: category }, { replace: true });
  };

  const fetchPage = async (nextPage: number, scroll = false) => {
    setLoadingPage(true);
    try {
      const { data } = isTagFeed
        ? await axios.post(API_URL + "/search-blogs", { tag: pageState, page: nextPage, limit: PAGE_SIZE })
        : await axios.post(API_URL + "/posts/latest-blog", { page: nextPage }, { headers: getAuthHeaders() });
      const result: Post[] = data.blogs ?? [];

      // หน้าถัดไปว่าง (จำนวนบล็อกลงตัวพอดี) — อยู่หน้าเดิม แค่ปิดปุ่มถัดไป
      if (nextPage > 1 && result.length === 0) {
        setHasMore(false);
        return;
      }

      setBlogs(result);
      setPage(nextPage);
      setHasMore(isTagFeed ? result.length === PAGE_SIZE : Boolean(data.hasMore));
      if (!isTagFeed && nextPage === 1) {
        setFirstPage(result);
        setAllTags(getTopTags(result));
      }
      if (scroll) listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.log(err);
      if (nextPage === 1) setBlogs([]);
    } finally {
      setLoadingPage(false);
    }
  };

  // เปิดหน้ามาที่หมวดเลย (?tag=) — ยังต้องมีบล็อกล่าสุดหน้าแรกไว้ทำแถบหมวดหมู่
  useEffect(() => {
    if (!isTagFeed) return;
    axios
      .post(API_URL + "/posts/latest-blog", { page: 1 }, { headers: getAuthHeaders() })
      .then(({ data }) => {
        setFirstPage(data.blogs ?? []);
        setAllTags(getTopTags(data.blogs ?? []));
      })
      .catch((err) => console.log(err));
  }, []);

  // recommend
  useEffect(() => {
    axios
      .post(API_URL + "/posts/blog-recommends", {}, { headers: getAuthHeaders() })
      .then(async ({ data }) => {
        const formatData = await filterPaginationData({
          state: recommend,
          data: data.blogs,
          page: 1,
          countRoute: "/posts/all-latest-blogs-count",
        });
        setRecommend(formatData);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchPage(1);
    if (!trendingBlogs) {
      axios
        .get(API_URL + "/posts/trending-blogs")
        .then(({ data }) => setTrendingBlogs(data.blogs))
        .catch((err) => console.log(err));
    }
  }, [pageState]);

  // บทความเด่น = บล็อกที่มาแรงที่สุด (เอาข้อมูลเต็มจากรายการอื่นเพื่อให้มีรูป/เกริ่น) → ไม่มีใช้บล็อกล่าสุด
  const known = [...firstPage, ...(recommend?.result ?? [])];
  const topTrending = trendingBlogs?.[0];
  const featured =
    known.find((b) => topTrending && b.blog_id === topTrending.blog_id) ?? known[0] ?? topTrending ?? null;
  const picks = recommend?.result?.slice(0, 4) ?? [];

  const popularList =
    trendingBlogs === null ? (
      <Loader />
    ) : trendingBlogs.length ? (
      <div className="tw:divide-y tw:divide-line">
        {trendingBlogs.slice(0, 5).map((blog, i) => (
          <MinimalBlogPost key={blog.blog_id ?? i} blog={blog} index={i} />
        ))}
      </div>
    ) : (
      <NoDataMessage compact message="ยังไม่มีบล็อกยอดนิยม — บล็อกที่มีคนกดถูกใจจะขึ้นที่นี่" />
    );

  const picksList = picks.length ? (
    <div className="tw:divide-y tw:divide-line">
      {picks.map((blog, i) => (
        <PickItem key={blog.blog_id ?? i} blog={blog} />
      ))}
    </div>
  ) : null;

  return (
    <AnimationWrapper>
      <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:pb-20 tw:md:px-8">
        <HomeHero />

        {!isTagFeed && featured && <FeaturedPost blog={featured} />}

        <CategoryTiles tags={allTags} posts={known} activeTag={pageState} onSelect={loadBlogBycategory} />

        <div className="tw:mt-16 tw:flex tw:gap-12 tw:xl:gap-16">
          {/* บล็อกล่าสุด / บล็อกในหมวดที่เลือก */}
          <div ref={listRef} className="tw:min-w-0 tw:flex-1 tw:scroll-mt-28">
            <div className="tw:flex tw:items-baseline tw:justify-between tw:gap-4">
              <h2 className="tw:m-0 tw:text-2xl tw:font-semibold tw:text-ink tw:md:text-3xl">
                {isTagFeed ? `หมวด: ${pageState}` : "บล็อกล่าสุด"}
              </h2>
              {isTagFeed && (
                <Button variant="ghost" onClick={() => loadBlogBycategory(pageState)}>
                  ดูทั้งหมด
                </Button>
              )}
            </div>

            {blogs === null ? (
              <Loader />
            ) : blogs.length ? (
              <div className={loadingPage ? "tw:divide-y tw:divide-line tw:opacity-60" : "tw:divide-y tw:divide-line"}>
                {blogs.map((blog, i) => (
                  <PostRow key={blog.blog_id ?? i} blog={blog} />
                ))}
              </div>
            ) : isTagFeed ? (
              <NoDataMessage
                message={`ยังไม่มีบล็อกในหมวด ${pageState}`}
                hint="ลองเลือกหมวดอื่น หรือกลับไปดูบล็อกล่าสุดทั้งหมด"
                action={
                  <Button variant="secondary" onClick={() => loadBlogBycategory(pageState)}>
                    ดูบล็อกทั้งหมด
                  </Button>
                }
              />
            ) : (
              <NoDataMessage
                message="ยังไม่มีบล็อกที่เผยแพร่"
                hint="มาเป็นคนแรกที่แบ่งปันเรื่องราว ความรู้ หรือประสบการณ์ให้เพื่อน ๆ ได้อ่าน"
                action={
                  access_token ? (
                    <LinkButton to="/editor">
                      <LuFileEdit className="tw:size-4" />
                      เขียนบล็อกแรก
                    </LinkButton>
                  ) : (
                    <LinkButton to="/signup">สมัครสมาชิกเพื่อเริ่มเขียน</LinkButton>
                  )
                }
              />
            )}

            {blogs?.length ? (
              <Pager page={page} hasMore={hasMore} loading={loadingPage} onChange={(p) => fetchPage(p, true)} />
            ) : null}

            {/* จอเล็กไม่มีแถบข้าง — แสดงยอดนิยมต่อท้ายรายการ */}
            <div className="tw:mt-12 tw:lg:hidden">
              <p className="tw:m-0 tw:text-xs tw:text-muted">กำลังมาแรง</p>
              <h3 className="tw:mt-0.5 tw:mb-3 tw:text-xl tw:font-semibold tw:text-ink">ยอดนิยม</h3>
              {popularList}
            </div>
          </div>

          <FeedSidebar
            tags={allTags}
            activeTag={pageState}
            onTagClick={loadBlogBycategory}
            popular={popularList}
            picks={picksList}
          />
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default HomePage;
