import { useContext, useEffect, useRef, useState } from "react";
// สไตล์เดิมของ navbar — ยังมีหน้าอื่นใช้คลาสในไฟล์นี้ (หน้าเขียนบล็อก, ปุ่ม btn-dark/btn-light, แชท)
// ย้ายหน้าเหล่านั้นเป็น Tailwind ครบแล้วค่อยลบ
import "./Navbar.css";
import logoKKU from "../pic/logo-head.jpg";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { LuFileEdit } from "react-icons/lu";
import { UserContext } from "../App";
import { IoNotificationsOutline } from "react-icons/io5";
import UserNavigationPanel from "../components/user-navigation.component";
import axios from "axios";
import Notifications from "./chat/Notification";
import Avatar from "../components/ui/Avatar";
import Tag from "../components/ui/Tag";
import { Button, LinkButton } from "../components/ui/Button";
import { cn } from "../components/ui/cn";

const NOTI_FILTERS = ["ทั้งหมด", "ยังไม่อ่าน", "อ่านแล้ว"] as const;

const iconButton =
  "tw:relative tw:inline-flex tw:size-10 tw:items-center tw:justify-center tw:rounded-full tw:border-0 tw:bg-transparent tw:text-ink-soft tw:transition-colors tw:hover:bg-surface tw:hover:text-ink tw:cursor-pointer";

const formatTimeAgo = (timestamp: string) => {
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor((Date.now() - createdAt.getTime()) / 1000);
  if (diffInSeconds < 60) return "ไม่กี่วินาทีที่แล้ว";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays <= 3) return `${diffInDays} วันที่แล้ว`;
  return createdAt.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const notificationText = (n: any) => {
  const name = n.user?.fullname;
  switch (n.type) {
    case "delete":
      return `บล็อกของคุณถูกลบเนื่องจาก ${n.reason}`;
    case "follow":
      return `${name} เริ่มติดตามคุณ`;
    case "like":
      return `${name} กดถูกใจบล็อกของคุณ`;
    case "comment":
      return `${name} แสดงความคิดเห็นบนบล็อกของคุณ`;
    case "reply":
      return `${name} ตอบกลับความคิดเห็นของคุณ`;
    default:
      return `${name} แสดงความคิดเห็นบนบล็อกของคุณ`;
  }
};

function Navbar() {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [userNotiPanel, setUserNotiPanel] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof NOTI_FILTERS)[number]>("ทั้งหมด");
  const navigate = useNavigate();
  const {
    userAuth: { access_token, profile_picture, fullname, username },
    NotificationShow,
  } = useContext(UserContext);
  const userId = sessionStorage.getItem("userId");

  const [notifications, setNotifications] = useState<any[]>([]);
  const API_BASE_URL = import.meta.env.REACT_APP_API_ENDPOINT;
  const notiPanelRef = useRef<HTMLDivElement>(null);

  // ดึงการแจ้งเตือนทุก 5 วินาที (ไม่นับที่ตัวเองเป็นคนทำ ยกเว้นแจ้งลบบล็อก)
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/notifications/${userId}`);
        if (response.status === 200) {
          setNotifications(response.data.filter((n: any) => (n.user && n.user._id !== userId) || n.type === "delete"));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, [userId, API_BASE_URL]);

  // คลิกนอกกล่องแจ้งเตือน = ปิด
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiPanelRef.current && !notiPanelRef.current.contains(event.target as Node)) {
        setUserNotiPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (type: string, notificationId: string, entityId: string, fromUserId: string | null) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/mark-as-read`);
      if (response.status === 200) {
        setNotifications((prev) => prev.map((n) => (n._id === notificationId ? { ...n, seen: true } : n)));
        navigate(type === "follow" ? `/user/${fromUserId}` : type === "delete" ? "/" : `/blog/${entityId}`);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
    setUserNotiPanel(false);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value.trim();
    if (e.key === "Enter" && query.length) {
      navigate(`/search/${query}`);
    }
  };

  // ปิดเมนูผู้ใช้หลังคลิกนอก (หน่วงให้คลิกลิงก์ในเมนูทันก่อน)
  const handleBlur = () => setTimeout(() => setUserNavPanel(false), 200);

  const unseenCount = notifications.filter((n) => n.seen === false).length;
  const filteredNotifications = notifications
    .filter((n) => (activeFilter === "ทั้งหมด" ? true : activeFilter === "อ่านแล้ว" ? n.seen : !n.seen))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <header className="tw:sticky tw:top-0 tw:z-40 tw:border-b tw:border-line tw:bg-white/90 tw:backdrop-blur">
      <nav className="tw:mx-auto tw:flex tw:h-16 tw:max-w-7xl tw:items-center tw:gap-4 tw:px-4 tw:md:px-8">
        <Link to="/" className="tw:flex tw:shrink-0 tw:items-center" aria-label="หน้าแรก">
          <img src={logoKKU} alt="KKU Blogging Platform" className="tw:h-8 tw:w-auto" />
        </Link>

        {/* ช่องค้นหา — จอเล็กซ่อนไว้ กดแว่นขยายถึงเปิดเป็นแถบใต้ navbar */}
        <div
          className={cn(
            "tw:md:static tw:md:block tw:md:w-80 tw:lg:w-96 tw:md:p-0 tw:md:border-0",
            searchBoxVisibility
              ? "tw:absolute tw:inset-x-0 tw:top-full tw:block tw:border-b tw:border-line tw:bg-white tw:px-4 tw:py-3"
              : "tw:hidden"
          )}
        >
          <label className="tw:relative tw:m-0 tw:block">
            <span className="tw:sr-only">ค้นหา</span>
            <IoIosSearch className="tw:pointer-events-none tw:absolute tw:left-3 tw:top-1/2 tw:size-5 tw:-translate-y-1/2 tw:text-muted" />
            <input
              type="search"
              placeholder="ค้นหาบล็อก ผู้เขียน แท็ก"
              className="tw:h-10 tw:w-full tw:rounded-full tw:border tw:border-transparent tw:bg-surface tw:pl-10 tw:pr-4 tw:text-sm tw:text-ink tw:outline-none tw:transition-colors tw:focus:border-line tw:focus:bg-white"
              onKeyDown={handleSearch}
            />
          </label>
        </div>

        <div className="tw:ml-auto tw:flex tw:items-center tw:gap-1 tw:md:gap-2">
          <button
            type="button"
            className={cn(iconButton, "tw:md:hidden")}
            onClick={() => setSearchBoxVisibility((v) => !v)}
            aria-label="ค้นหา"
            aria-expanded={searchBoxVisibility}
          >
            <IoIosSearch className="tw:size-5" />
          </button>

          {access_token ? (
            <>
              <span className="tw:mr-1 tw:hidden tw:md:inline-flex">
                <LinkButton to="/editor" size="sm">
                  <LuFileEdit className="tw:size-4" />
                  เขียน
                </LinkButton>
              </span>

              <Notifications />

              {/* การแจ้งเตือน */}
              <div className="tw:relative" ref={notiPanelRef}>
                <button
                  type="button"
                  className={iconButton}
                  onClick={() => setUserNotiPanel((v) => !v)}
                  aria-label={unseenCount ? `การแจ้งเตือน ${unseenCount} รายการที่ยังไม่อ่าน` : "การแจ้งเตือน"}
                  aria-expanded={userNotiPanel}
                >
                  <IoNotificationsOutline className="tw:size-5" />
                  {unseenCount > 0 && NotificationShow && (
                    <span className="tw:absolute tw:right-1.5 tw:top-1.5 tw:flex tw:h-4 tw:min-w-4 tw:items-center tw:justify-center tw:rounded-full tw:bg-red-500 tw:px-1 tw:text-[0.625rem] tw:font-semibold tw:leading-none tw:text-white">
                      {unseenCount > 99 ? "99+" : unseenCount}
                    </span>
                  )}
                </button>

                {userNotiPanel && (
                  <div className="tw:absolute tw:right-0 tw:top-12 tw:w-[min(22rem,calc(100vw-2rem))] tw:overflow-hidden tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:shadow-xl">
                    <div className="tw:flex tw:items-center tw:justify-between tw:px-4 tw:pt-4">
                      <p className="tw:m-0 tw:text-base tw:font-semibold tw:text-ink">การแจ้งเตือน</p>
                    </div>
                    <div className="tw:flex tw:gap-2 tw:px-4 tw:py-3">
                      {NOTI_FILTERS.map((f) => (
                        <Tag key={f} hash={false} plain active={activeFilter === f} onClick={() => setActiveFilter(f)}>
                          {f}
                        </Tag>
                      ))}
                    </div>
                    <div className="tw:max-h-96 tw:overflow-y-auto tw:border-t tw:border-line">
                      {filteredNotifications.length === 0 ? (
                        <p className="tw:m-0 tw:px-4 tw:py-10 tw:text-center tw:text-sm tw:text-muted">ไม่มีการแจ้งเตือน</p>
                      ) : (
                        filteredNotifications.map((n) => (
                          <button
                            type="button"
                            key={n._id}
                            onClick={() =>
                              handleNotificationClick(n.type, n._id, n.blog?.blog_id || n._id, n.user ? n.user._id : null)
                            }
                            className={cn(
                              "tw:flex tw:w-full tw:items-start tw:gap-3 tw:border-0 tw:px-4 tw:py-3 tw:text-left tw:transition-colors tw:hover:bg-surface tw:cursor-pointer",
                              n.seen ? "tw:bg-white" : "tw:bg-primary-soft/50"
                            )}
                          >
                            {n.type === "delete" ? (
                              <span className="tw:inline-flex tw:size-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-surface tw:text-sm">
                                🛠
                              </span>
                            ) : (
                              <Avatar src={n.user?.profile_picture} name={n.user?.fullname} size="sm" className="tw:size-9" />
                            )}
                            <span className="tw:min-w-0 tw:flex-1">
                              <span className="tw:block tw:text-sm tw:leading-snug tw:text-ink">{notificationText(n)}</span>
                              <span className="tw:mt-1 tw:block tw:text-xs tw:text-muted">{formatTimeAgo(n.createdAt)}</span>
                            </span>
                            {!n.seen && <span className="tw:mt-1.5 tw:size-2 tw:shrink-0 tw:rounded-full tw:bg-violet-400" aria-label="ยังไม่อ่าน" />}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* เมนูผู้ใช้ */}
              <div className="tw:relative" onBlur={handleBlur}>
                <button
                  type="button"
                  className="tw:ml-1 tw:inline-flex tw:rounded-full tw:border-0 tw:bg-transparent tw:p-0 tw:cursor-pointer tw:ring-offset-2 tw:transition-shadow tw:hover:ring-2 tw:hover:ring-line"
                  onClick={() => setUserNavPanel((v) => !v)}
                  aria-label="เมนูผู้ใช้"
                  aria-expanded={userNavPanel}
                >
                  <Avatar src={profile_picture} name={fullname || username} size="md" className="tw:size-9" />
                </button>
                {userNavPanel && <UserNavigationPanel />}
              </div>
            </>
          ) : (
            <>
              <LinkButton to="/signin" size="sm">
                เข้าสู่ระบบ
              </LinkButton>
              <span className="tw:hidden tw:md:inline-flex">
                <LinkButton to="/signup" size="sm" variant="secondary">
                  สมัครสมาชิก
                </LinkButton>
              </span>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
