// จาก components/report-view-modal.tsx
export interface ReportDetailsModalProps {
  showModal: boolean;
  handleClose: () => void;
  report: Report | null;
  refreshReports: () => void;
  /** แสดงปุ่มอนุญาต / ลบบล็อก (ผู้ดูแลระบบ) — ไม่ใส่ = ดูอย่างเดียว */
  showVerifyActions?: boolean;
}

// จาก kku-blogging-admin/src/pages/adminHome.tsx
export interface Report {
  _id: string;
  reason: string;
  verified: boolean;
  status: string;
  createdAt: string;
  reportedBy: {
    _id: string;
    fullname: string;
  };
  post: {
    _id: string;
    author: {
      _id: string;
      fullname: string;
      banner: string;
      profile_picture: string;
    };
    content: [
      {
        time: number;
        blocks: [
          {
            id: string;
            type: string;
            data: {
              text: string;
            };
          }
        ];
        version: string;
      }
    ];
    image: string;
    topic: string;
    detail: string;
    tags: string[];
    banner: string;
    publishedAt: string;
    contentWithImages: {
      content: string;
      images?: string[];
    }[];
  };
}

// จาก kku-blogging-admin/src/pages/adminProfile.tsx
export interface AdminData {
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  username: string; // เพิ่ม username
}

// จาก kku-blogging-admin/src/pages/adminProfile.tsx
export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// จาก kku-blogging-admin/src/pages/adminProfile.tsx
export interface LoginLog {
  _id: string;
  adminId: {
    username: string;
    email: string;
  };
  loginTime: string;
}

// จาก kku-blogging-admin/src/pages/adminProfile.tsx
export interface AdminListData {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  tel: string;
}

// จาก kku-blogging-admin/src/pages/adminProfile.tsx
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

// จาก kku-blogging-admin/src/pages/adminProfile.tsx
export interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminListData;
  onSave: (updatedData: AdminListData) => void;
}

// จาก kku-blogging-admin/src/pages/adminProfile.tsx
export interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    adminData: Omit<AdminListData, "_id"> & { password: string }
  ) => void;
}

// จาก kku-blogging-admin/src/components/manageUs.tsx
export interface UserProps {
  users: any[];
  allUsers: any[];
}
