import type React from "react";
import type { AlertProps } from "@mui/material";

// จาก api/adminlogin-Regist.ts
export interface LoginResponse {
  token: string;
  id: string;
  [key: string]: any; // Allow other fields as well
}

// จาก App.tsx
export interface UserContextType {
  userAuth: {
    access_token: string | null;
    _id?: string;
    username?: string;
    fullname?: string;
    profile_picture?: string;
    new_notification_available?: boolean;
  };
  setUserAuth: React.Dispatch<React.SetStateAction<any>>;
  NotificationShow: boolean;
  setNotificationShow: React.Dispatch<React.SetStateAction<boolean>>;
}

// จาก Screens/Admin/adminLogin.tsx
export interface LoginPageProps {
  type: string;
}

// จาก Screens/Admin/ForgotPassword.tsx
export type CustomAlertProps = AlertProps & { show: boolean; message: string };

// จาก Screens/Admin/ResetPassword.tsx
export type Params = {
  token: string;
};

// จาก Screens/ChangeEmailModal.tsx
export interface ChangeEmailModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (email: string) => void;
  oldEmail: string;
}
