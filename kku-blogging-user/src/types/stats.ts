// จาก components/stat-component.tsx
export interface WeeklyStat {
  day: number;
  likes: number;
  comments: number;
  saves: number;
  reads: number;
}

// จาก components/stat-component.tsx
export interface yearlyStats {
  month: number;
  likes: number;
  comments: number;
  saves: number;
  reads: number;
}

// จาก components/stat-component.tsx
export interface Stat {
  dailyLikes: number;
  weeklyStats?: WeeklyStat[];
  monthlyLikes: number;
  yearlyStats?: yearlyStats[];
  dailySaves: number;
  monthlySaves: number;
  yearlySaves: number;
  dailyComments: number;
  monthlyComments: number;
  yearlyComments: number;
  dailyReads: number;
  monthlyReads: number;
  yearlyReads: number;
}

// จาก components/stat-component.tsx
export interface PostStatisticsChartProps {
  postId: string;
}

// จาก components/stat-component.tsx
export type Timeframe = "daily" | "weekly" | "monthly" | "yearly";

// จาก kku-blogging-admin/src/pages/adminHome.tsx
export interface MonthData {
  month: string;
  publishedAt: number;
}

// จาก kku-blogging-admin/src/components/Chart/GrowthChartAllblog.tsx
export interface GrowthChartAllblogProps {
  data: any[];
}

// จาก kku-blogging-admin/src/components/Chart/GrowthChartAllblog.tsx
export interface BlogCount {
  label: string;
  count: number;
}

// จาก kku-blogging-admin/src/components/Chart/GrowthChartAlluser.tsx
export interface GrowthChartProps {
  data: any[];
}

// จาก kku-blogging-admin/src/components/Chart/GrowthChartAlluser.tsx
export interface UserCount {
  label: string;
  count: number;
}

// จาก Screens/DashboardUser.tsx
export interface ViewData {
  _id: string;
  month: string;
  year: number;
  blog: string;
  __v: number;
  createdAt: string;
  total_reads: number;
  updatedAt: string;
}

// จาก Screens/DashboardUser.tsx
export interface MonthlyViewCount {
  month: string;
  viewCount: number;
}

// จาก Screens/DashboardUser.tsx
export interface YearlyViewCount {
  year: string;
  viewCount: number;
}

// components/shared/GrowthCountChart.tsx
export type GrowthViewMode = "monthly" | "yearly";

export interface CountPoint {
  label: string;
  count: number;
}

export interface GrowthCountChartProps {
  data: any[];
  /** ช่องวันที่ในแต่ละรายการที่ใช้นับ เช่น publishedAt (โพสต์) / joinedAt (ผู้ใช้) */
  dateField: string;
  /** คำที่แสดงในชื่อกราฟ เช่น "โพสต์" → จำนวนโพสต์ต่อเดือน */
  unitLabel: string;
}
