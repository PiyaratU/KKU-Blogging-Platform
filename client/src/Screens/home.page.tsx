import AnimationWrapper from "./page-animation";
import InPageNavigation from "../components/Inpage-navigation";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/loader.component";
import { Post } from "../types/post";
import BlogCard from "../components/blogpost.component";
import MinimalBlogPost from "./nobanner-blog";
import FeedHero from "../components/FeedHero";
import FeedSidebar from "../components/FeedSidebar";
import { activeTabRef } from "../components/Inpage-navigation";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../components/filter-pagination";
import LoadMoreDataBtn from "../components/load-more.component";
import Tag from "../components/ui/Tag";
import { Button, LinkButton } from "../components/ui/Button";
import { LuFileEdit } from "react-icons/lu";
import { UserContext } from "../App";
import type { HomeBlogState as BlogState } from "../types/blog";

const HomePage = () => {
  const API_URL =
    import.meta.env.REACT_APP_API_ENDPOINT ||
    "https://kku-blog-server-ak2l.onrender.com";
  const [recommend, setRecommend] = useState<BlogState | null>(null);
  const [blogs, setBlogs] = useState<BlogState | null>(null);
  const [uniqueBlogs, setUniqueBlogs] = useState<BlogState | null>(null);
  const [trendingBlogs, setTrendingBlogs] = useState<Post[] | null>(null);
  const [pageState, setPageState] = useState("หน้าหลัก");
  const [allTags, setAllTags] = useState<string[]>([]);
  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const getUniqueTags = (posts: Post[]): string[] => {
    const tagCount: Record<string, number> = {};

    // นับจำนวนครั้งที่แต่ละแท็กถูกใช้
    posts.forEach((post) => {
      if (Array.isArray(post.tags)) {
        // ตรวจสอบว่า tags เป็น array หรือไม่
        post.tags.forEach((tag: string) => {
          if (tag) {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          }
        });
      } else if (typeof post.tags === "string" && post.tags) {
        // ถ้าเป็น string ให้แปลงเป็น array
        tagCount[post.tags] = (tagCount[post.tags] || 0) + 1;
      }
    });

    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  };

  // กดแท็กเดิมซ้ำ = กลับไปหน้าหลัก
  const loadBlogBycategory = (tag: string) => {
    const category = tag.toLowerCase();
    setBlogs(null);
    setPageState(pageState === category ? "หน้าหลัก" : category);
  };

  const getAuthHeaders = () => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return {};

    try {
      const user = JSON.parse(userStr);
      if (user?.access_token) {
        return {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        };
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }

    return { "Content-Type": "application/json" };
  };

  const fetchLatestBlogs = ({ page = 1 }) => {
    const headers = getAuthHeaders();
    axios
      .post(API_URL + "/posts/latest-blog", { page }, { headers })
      .then(async ({ data }) => {
        console.log(data.blogs);

        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/posts/all-latest-blogs-count",
        });
        const uniqueTags = getUniqueTags(data.blogs);
        setAllTags(uniqueTags);
        setBlogs(formatData);

        console.log(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(API_URL + "/search-blogs", { tag: pageState, page })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });

        setBlogs(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(API_URL + "/posts/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // recommend
  useEffect(() => {
    const headers = getAuthHeaders();

    axios
      .post(API_URL + "/posts/blog-recommends", {}, { headers })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: recommend,
          data: data.blogs,
          page: 1,
          countRoute: "/posts/all-latest-blogs-count",
        });

        setRecommend(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (recommend?.result && blogs?.result) {
      const combinedBlogs = [...recommend.result, ...blogs.result];

      const uniqueBlogsResult = combinedBlogs.reduce((acc, blog) => {
        if (!acc.some((b) => b.blog_id === blog.blog_id)) {
          acc.push(blog);
        }
        return acc;
      }, [] as Post[]);

      const totalDocs = uniqueBlogsResult.length;

      const page = recommend?.page ?? blogs?.page ?? 1;

      setUniqueBlogs({
        result: uniqueBlogsResult,
        totalDocs,
        page,
      });
    } else {
      setUniqueBlogs(blogs);
    }
  }, [recommend, blogs]);

  useEffect(() => {
    activeTabRef.current?.click();

    if (pageState === "หน้าหลัก") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  const isTagFeed = pageState !== "หน้าหลัก";

  const trendingList =
    trendingBlogs === null ? (
      <Loader />
    ) : trendingBlogs.length ? (
      <div className="tw:divide-y tw:divide-line">
        {trendingBlogs.map((blog, i) => (
          <MinimalBlogPost key={blog.blog_id ?? i} blog={blog} index={i} />
        ))}
      </div>
    ) : (
      <NoDataMessage compact message="ยังไม่มีบล็อกยอดนิยม — บล็อกที่มีคนกดถูกใจจะขึ้นที่นี่" />
    );

  return (
    <AnimationWrapper>
      <div className="tw:mx-auto tw:flex tw:min-h-[calc(100vh-4rem)] tw:max-w-7xl tw:gap-10 tw:px-4 tw:py-6 tw:md:px-8 tw:xl:gap-14">
        {/* ฟีดบล็อก */}
        <div className="tw:min-w-0 tw:flex-1">
          <FeedHero />

          {/* จอเล็กไม่มีแถบข้าง — แสดงแท็กเป็นแถวเลื่อนด้านบนแทน */}
          {allTags.length > 0 && (
            <div className="tw:-mx-4 tw:mb-2 tw:flex tw:gap-2 tw:overflow-x-auto tw:px-4 tw:pb-2 tw:lg:hidden">
              {allTags.map((tag) => (
                <Tag key={tag} active={pageState === tag.toLowerCase()} onClick={() => loadBlogBycategory(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <InPageNavigation routes={[isTagFeed ? `#${pageState}` : "ล่าสุด", "ยอดนิยม"]} defaultHidden={["ยอดนิยม"]}>
            <>
              {blogs === null ? (
                <Loader />
              ) : uniqueBlogs?.result.length ? (
                uniqueBlogs.result.map((blog, i) => (
                  <AnimationWrapper transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }} key={blog.blog_id ?? i}>
                    <BlogCard content={blog} author={blog.author} />
                  </AnimationWrapper>
                ))
              ) : isTagFeed ? (
                <NoDataMessage
                  message={`ยังไม่มีบล็อกในแท็ก #${pageState}`}
                  hint="ลองเลือกแท็กอื่น หรือกลับไปดูบล็อกล่าสุดทั้งหมด"
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
              <LoadMoreDataBtn state={blogs} fetchDataFun={isTagFeed ? fetchBlogsByCategory : fetchLatestBlogs} />
            </>
            {trendingList}
          </InPageNavigation>
        </div>

        <FeedSidebar tags={allTags} activeTag={pageState} onTagClick={loadBlogBycategory} trending={trendingList} />
      </div>
    </AnimationWrapper>
  );
};

export default HomePage;
