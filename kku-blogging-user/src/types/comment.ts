import type React from "react";

import { Author } from "./post";

export type ReplyComment = {
  _id: string;
  content: string;
  author: Author;
  replyTo: Author;
  created_at: Date;
};

export type Comment = {
  _id: string;
  author: Author;
  comment: string;
  replies: ReplyComment[];
  created_at: Date;
  commented_by: Author;
  childrenLevel: number;
  children: string[];
  isReplyingLoaded?: boolean;
  parentIndex?: number;
};

export type CommentsData = {
  results: Comment[]; // ผลลัพธ์ของความคิดเห็น
};

// จาก components/comment-field.component.tsx
export interface CommentFieldProps {
  action: string;
  index?: number;
  replyingTo?: string;
  setReplying?: React.Dispatch<React.SetStateAction<boolean>>;
}

// จาก components/commentcard.component.tsx
export interface CommentCardProps {
  index: number;
  leftVal: number;
  commentData: {
    comment: string;
    commented_by: {
      profile_picture: string;
      fullname: string;
      username: string;
      _id?: string;
    };
    commentedAt?: string;
    _id?: string;
    isReplyingLoaded?: boolean;
    childrenLevel: number;
    children?: string[];
  };
}
