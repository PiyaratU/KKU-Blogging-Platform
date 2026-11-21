import type { Dispatch, ReactNode, SetStateAction } from "react";

// จาก hook/useFetchLatestMessages.ts
export interface Message {
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  deletedBy?: { [userId: string]: boolean };
}

// จาก hook/useFetchRecipient.ts
export interface UseFetchRecipientChat {
  _id: string;
  members: string[];
}

// จาก hook/useFetchRecipient.ts
export interface UseFetchRecipientUser {
  _id: string;
  username: string;
  profile_picture: string;
}

// จาก Navbar/chat/Notification.tsx
export interface Notification {
  senderId: string;
  chatId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

// จาก Navbar/chat/UserChat.tsx
export interface UserchatProps {
  chat: UseFetchRecipientChat;
  userId: string;
}

// จาก Screens/ChatContext.tsx
export interface ChatContextUser {
  _id: string;
  firstname: string;
  profile_picture?: string;
}

// จาก Screens/ChatContext.tsx
export interface ChatContextChat {
  _id: string;
  members: string[];
  deletedBy?: Map<string, boolean>;
  messages: Message[];
}

// จาก Screens/ChatContext.tsx
export interface ChatContextProps {
  userChats: ChatContextChat[];
  isUserChatsLoading: boolean;
  UserChatsError: any;
  userId: string | null;
  potentialChats: ChatContextUser[];
  createChat: (firstId: string, secondId: string) => Promise<void>;
  updateCurrentChat: (chat: ChatContextChat) => void;
  currentChat: ChatContextChat | null;
  messages: any[];
  isMessagesLoading: boolean;
  messagesError: any;
  sendTextMessage: (
    textMessage: string,
    sender: ChatContextUser,
    currentChatId: string,
    setTextMessage: Dispatch<SetStateAction<string>>
  ) => Promise<void>;
  onlineUsers: any[];
  notifications: Notification[];
  allUsers: ChatContextUser[];
  markAllNotificationsAsRead: (notifications: Notification[]) => void;
  markNotificationAsRead: (
    n: Notification,
    userChats: ChatContextChat[],
    user: ChatContextUser,
    notifications: Notification[]
  ) => void;
  toggleChatBox: () => void;
  markThisUserNotificationsAsRead: (
    thisUserNotifications: Notification[],
    notifications: Notification[]
  ) => void;
  newMessage: Message | null;
  isChatBoxOpen: boolean;
  setIsChatBoxOpen: (isOpen: boolean) => void;
  deleteChat: (chatId: string, userId: string) => Promise<void>;
  getUserChats: () => void;
}

// จาก Screens/ChatContext.tsx
export interface ChatContextProviderProps {
  children: ReactNode;
}
