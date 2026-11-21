import type React from "react";
import type { Author, Post } from "./post";
import type { Dispatch, SetStateAction } from "react";

// จาก common/b2.tsx
export interface Prediction {
  className: string;
  probability: number;
}

// จาก components/blog.content.component.tsx
export interface Block {
  type: string
  data: {
    text?: string
    level?: number
    file?: {
      url: string
    }
    caption?: string
    style?: string
    items?: string[]
  }
}

// จาก components/blog.content.component.tsx
export interface BlogContentProps {
  block: Block
}

// จาก components/blog.content.component.tsx
export interface ImgProps {
  url: string
  caption: string
}

// จาก components/blog.content.component.tsx
export interface QuoteProps {
  quote: string
  caption: string
}

// จาก components/blog.content.component.tsx
export interface ListProps {
  style: "ordered" | "unordered"
  items: string[]
}

// จาก components/blogpost.component.tsx
export interface BlogpostBlogCardProps {
  content: Post;
  author: Author;
}

// จาก components/manage-blogcard.component.tsx
export interface ManageBlogcardBlog {
  _id?:string;
  banner?: string;
  blog_id?: string;
  topic?: string;
  publishedAt: string;
  activity?: { [key: string]: number };
  des?: string;
  index?: any;
  setStateFunc?:any;
}

// จาก components/manage-blogcard.component.tsx
export interface BlogStatsProps {
  stats: { [key: string]: number };
}

// จาก components/manage-blogcard.component.tsx
export interface ManagePublishedBlogCardProps {
  blog: ManageBlogcardBlog;
}

// จาก components/manage-blogcard.component.tsx
export interface ManageDraftBlogPostProps {
  blog: ManageBlogcardBlog;
}

// จาก components/tags.component.tsx
export interface TagProps {
  tag: string;
  tagIndex: number;
}

// จาก kku-blogging-admin/src/components/manageCate.tsx
export interface ManageCateBlog {
  _id: string;
  blog_id: string;
  topic: string;
  banner: string;
  des: string;
  content: Array<{
    time: number;
    blocks: Array<{
      id: string;
      type: string;
      data: {
        text: string;
      };
    }>;
    version: string;
  }>;
  tags: string[];
  author: string;
  comments: any[];
  draft: boolean;
  likes: any[];
  saves: any[];
  views: number;
  publishedAt: string;
  updatedAt: string;
  __v: number;
}

// จาก Screens/blog.page.tsx
export interface BlogContextType {
  blog: Partial<Post>;
  setBlog: Dispatch<SetStateAction<Partial<Post>>>;
  islikedByUser: boolean;
  setLikeByUser: React.Dispatch<React.SetStateAction<boolean>>;
  issavedByUser: boolean;
  setSaveByUser: React.Dispatch<React.SetStateAction<boolean>>;
  commentWrapper: boolean;
  setCommentWrapper: React.Dispatch<React.SetStateAction<boolean>>;
  totalParentCommentsLoaded: number;
  setTotalParentCommentsLoaded: React.Dispatch<React.SetStateAction<number>>;
}

// จาก Screens/home.page.tsx
export interface HomeBlogState {
  result: Post[];
  totalDocs: number;
  page: number;
}

// จาก Screens/manageblogs.tsx
export interface GetBlogsParams {
  page: number;
  draft: boolean;
  deleteDocCount?: number;
}

// จาก Screens/manageblogs.tsx
export interface ManageblogsBlog {
  blog_id: string;
  topic: string;
  publishedAt: string;
  activity: { [key: string]: number };
  des?: string;
}

// จาก Screens/manageblogs.tsx
export interface BlogsResponse {
  result: ManageblogsBlog[];
  deleteDocCount: number;
}

// จาก Screens/nobanner-blog.tsx
export interface NobannerBlogBlogCardProps {
  blog: Post;
  index: number;
}

// จาก Screens/ProfilePage.tsx
export interface ProfilePageBlogState {
  result: Post[];
  totalDocs: number;
  page: number;
  user_id?: string;
}
