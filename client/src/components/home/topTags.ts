import type { Post } from "../../types/post";

/** แท็กที่ใช้บ่อยที่สุด n อันดับจากรายการบล็อก (tags เป็น array หรือ string ก็ได้) */
export const getTopTags = (posts: Post[], n = 10): string[] => {
  const tagCount: Record<string, number> = {};
  posts.forEach((post) => {
    const tags: unknown = post.tags;
    const list = Array.isArray(tags) ? (tags as string[]) : typeof tags === "string" && tags ? [tags] : [];
    list.forEach((tag) => {
      if (tag) tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([tag]) => tag);
};

/** ลิงก์ไปหน้าแรกที่กรองตามหมวด */
export const categoryHref = (tag: string) => `/homepage?tag=${encodeURIComponent(tag.toLowerCase())}`;
