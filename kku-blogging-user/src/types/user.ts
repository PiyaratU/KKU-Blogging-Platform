export type User = {
  _id: string;
  fullname: string;
  username: string;
  profile_picture: string;
  email: string;
  isFollowing?: boolean;
  createAt: Date;
};

// จาก App.tsx
export interface AppUser {
  access_token?: string;
  role?: string;
  username?: string;
  _id?: string;
}

// จาก components/about.component.tsx
export interface AboutUserProps {
  className?: string;
  bio: string; // bio เป็น string
  social_links: { [key: string]: string } | null;
  joinedAt: string;
}

// จาก components/usercard.component.tsx
export interface UserCardProps {
  user: User;
}

// จาก Screens/ProfilePage.tsx
export interface Profile {
  fullname: string;
  username: string;
  profile_picture: string;
  bio: string;
  email: string;
  total_posts: number;
  total_reads: number;
  total_blogs: number;
  social_links: Record<string, string>;
  joinedAt: string;
}

// components/shared/FollowListModal.tsx
export type FollowListKind = "followers" | "following";

export interface FollowListModalProps {
  userProfile: any;
  /** followers = ผู้ติดตาม · following = กำลังติดตาม */
  list: FollowListKind;
}
