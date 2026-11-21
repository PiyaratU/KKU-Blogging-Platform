import { useContext, useState, useEffect } from "react";
import { HiChatBubbleLeft } from "react-icons/hi2";
import { ChatContext } from "../../Screens/ChatContext";
import "../../misc/Userchat.css";
import Chat from "../../Screens/chat";
import type { Notification } from "../../types/chat";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    userChats,
    userId,
    isChatBoxOpen,
    setIsChatBoxOpen,
    updateCurrentChat
  } = useContext(ChatContext);

  const user = allUsers.find((user) => user._id === userId);

  const unreadNotifications = notifications.filter((notification) => !notification.isRead);

  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.firstname
    };
  });

  const handleNotificationClick = (notification: Notification) => {
    if (user) {
      markNotificationAsRead(notification, userChats, user, notifications);
      const selectedChat = userChats.find((chat) => chat._id === notification.chatId);
      if (selectedChat) {
        updateCurrentChat(selectedChat);
        if (!isChatBoxOpen) {
          setIsChatBoxOpen(true);
          setIsOpen(false);
        }
      }
    } else {
      console.warn("User is not defined.");
    }
  };

  const handleChatClick = () => {
    if (!isChatBoxOpen) {
      setIsChatBoxOpen(true);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isChatBoxOpen) {
      setIsOpen(false);
    }
  }, [isChatBoxOpen]);

  return (
    <div className="notifications">
      {/* ปุ่มเปิดแชท — หน้าตาเดียวกับปุ่มกระดิ่งบน navbar (กล่องแชทยังใช้สไตล์เดิมใน Userchat.css) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={unreadNotifications.length ? `ข้อความ ${unreadNotifications.length} รายการที่ยังไม่อ่าน` : "ข้อความ"}
        aria-expanded={isOpen}
        className="tw:relative tw:inline-flex tw:size-10 tw:items-center tw:justify-center tw:rounded-full tw:border-0 tw:bg-transparent tw:text-ink-soft tw:transition-colors tw:hover:bg-surface tw:hover:text-ink tw:cursor-pointer"
      >
        <HiChatBubbleLeft className="tw:size-5" />
        {unreadNotifications.length > 0 && (
          <span className="tw:absolute tw:right-1.5 tw:top-1.5 tw:flex tw:h-4 tw:min-w-4 tw:items-center tw:justify-center tw:rounded-full tw:bg-red-500 tw:px-1 tw:text-[0.625rem] tw:font-semibold tw:leading-none tw:text-white">
            {unreadNotifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>ข้อความ</h3>
            <div className="mark-as-read" onClick={() => markAllNotificationsAsRead(notifications)}>
              Mark all as read  
            </div>
          </div>

          {/* Show "ไม่มีข้อความ" if no notifications */}
          {unreadNotifications.length === 0 ? (
            <div className="no-notifications">
              <p>ไม่มีข้อความ</p>
            </div>
          ) : (
            <div className="notification-list">
              {modifiedNotifications.map((notification) => (
                <div
                  key={notification.chatId}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p>{notification.senderName}: {notification.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* If the chat box is not open, show a section to initiate chat */}
          {!isChatBoxOpen && (
            <div className="chat-section" onClick={handleChatClick}>
              <Chat />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
