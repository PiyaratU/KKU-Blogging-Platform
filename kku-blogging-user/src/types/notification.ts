// จาก components/notification-card.component.tsx
export interface NotificationCardProps {
  data: {
    seen?: any;
    type?: string;
    reply?: any;
    comment?: any;
    replied_on_comment?: any;
    createdAt?: string;
    reason?: string;
    user?: {
      fullname: string;
      username: string;
      profile_picture: string;
      _id: string;
    };
    blog?: {
      _id: string;
      blog_id: string;
      topic: string;
    } | null;
    _id?: string;
  };
  index?: number;
  notificationState?: any;
}

// จาก Screens/notifications.page.tsx
export interface NotificationData {
  id: string;
  type: string;
  createdAt: string;
}

// จาก Screens/notifications.page.tsx
export interface NotificationsResponse {
  result: NotificationData[];
  deletedDoccount?: number;
}
