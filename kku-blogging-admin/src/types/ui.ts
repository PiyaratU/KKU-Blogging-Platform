import type React from "react";
import type { ReactNode } from "react";

// จาก components/ConfirmCancelModal.tsx
export interface ConfirmCancelModalProps {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  handleClose: () => void;
}

// จาก components/filter-pagination.tsx
export interface FilterPaginationDataProps {
  create_new_arr?: boolean;
  state?: any;
  save?: any;  // เพิ่ม property save (ถ้าจำเป็น)
  data: any[];
  page?: number;
  countRoute?: string;
  data_to_send?: any;
  user?: string;
}

// จาก components/Inpage-navigation.tsx
export interface InPageNavigationProps {
  routes: string[];
  defaultHidden?: string[];
  defaultActiveIndex?: number;
  children: ReactNode;
}

// จาก components/input.component.tsx
export interface InputBoxProps {
  name: string;
  type: string;
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
}

// จาก components/load-more.component.tsx
export interface LoadmoreProps {
  state?: any;
  fetchDataFun: (params: { page: number; draft: boolean; deleteDocCount: number }) => void;
  additionalParam?: any;
}

// จาก components/nodata.component.tsx
export interface NoDataMessageProps {
  message: string;
  /** คำอธิบายใต้ข้อความหลัก */
  hint?: string;
  /** ปุ่มชวนทำต่อ เช่น "เขียนบล็อกแรก" */
  action?: ReactNode;
  /** แบบเล็ก (ไม่มีไอคอน / กรอบ) — ใช้ในแถบข้าง */
  compact?: boolean;
}

// จาก Screens/firstpage.tsx
export interface SplitTextProps {
  text: string;
}

// จาก Screens/page-animation.tsx
export interface AnimationWrapperProps {
  children: React.ReactNode;
  keyValue?: string | number;
  initial?: { [key: string]: any };
  animate?: { [key: string]: any };
  transition?: { duration?: number; delay?: number };
  className?: string;
}

// components/shared/ForgotPasswordForm.tsx
export interface ForgotPasswordFormProps {
  /** path ของ API ที่ส่งอีเมลตั้งรหัสผ่านใหม่ เช่น /forgot-password/user */
  endpoint: string;
  /** หน้าเข้าสู่ระบบที่พากลับไป เช่น /signin หรือ /admin/login */
  loginPath: string;
}

// components/shared/ResetPasswordForm.tsx
export interface ResetPasswordFormProps {
  /** หน้าเข้าสู่ระบบที่พาไปหลังตั้งรหัสผ่านสำเร็จ */
  loginPath: string;
}
