import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
// สไตล์รวมของทั้งเว็บที่เคยมากับหน้า /login และ navbar เก่า (มีกฎ * / input / main) — ยังต้องโหลดไว้ ลำดับเดิม
import "./misc/login.css";
import HomePage from "./Screens/home.page";
import FirstPage from "./Screens/firstpage";
import SessionExpiryWatcher from "./common/SessionExpiryWatcher";
import EditProfile from "./Screens/edit-profile.page";
import Footer from "./Navbar/footer";
import ResetPasswordUser from "./Screens/ResetPasswordUser";
import Chat from "./Screens/chat";
import { ChatContextProvider } from "./Screens/ChatContext";
import "./Navbar/navbar1.css";
import Navbar from "./Navbar/Navbar";
import SiteFooter from "./components/SiteFooter";
import HelpCentre from "./Screens/helpcentre";
import Helpnotlog from "./Screens/help-notlogin";
import { createContext } from "react";
import { lookInSession } from "./common/session";
import UserAuthForm from "./Screens/UserAuthForm";
import Editor from "./Screens/editor-page";
import SearchPage from "./Screens/search.page";
import PageNotFound from "./Screens/404";
import ProfilePage from "./Screens/ProfilePage";
import BlogPage from "./Screens/blog.page";
import DashboardUser from "./Screens/DashboardUser";
import SideNav from "./components/sideNavbar";
import ChangPassword from "./Screens/change-password";
import Notifications from "./Screens/notifications.page";
import ManageBlogs from "./Screens/manageblogs";
import ReportCheck from "./Screens/reportCheck";
import NotiSetting from "./Screens/noti-setting";
import ForgotPasswordUser from "./Screens/ForgotPasswordUser";
import axios from "axios";
import { API_BASE_URL } from "./api/post";
import PostStatisticsChart from "./components/stat-component";
import UiPreview from "./dev/UiPreview";
import type { UserContextType } from "./types/auth";

// หน้าผู้ดูแลระบบย้ายไปเป็นเว็บแยกที่โฟลเดอร์ kku-blogging-admin/ (deploy แยก) — เว็บนี้มีเฉพาะหน้าผู้ใช้

export const UserContext = createContext<UserContextType>({
  userAuth: { access_token: null },
  setUserAuth: () => {},
  NotificationShow: true,
  setNotificationShow: () => {},
});

function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <SiteFooter />
    </>
  );
}

function App() {
  // อ่าน session ตั้งแต่แรก — ไม่งั้นเปิด /editor ตรง ๆ จะถูกเด้งไปหน้าเข้าสู่ระบบก่อน session โหลดเสร็จ
  const [userAuth, setUserAuth] = useState<{ access_token: string | null }>(() => {
    try {
      const stored = lookInSession("user");
      return stored ? JSON.parse(stored) : { access_token: null };
    } catch {
      return { access_token: null };
    }
  });
  const [NotificationShow, setNotificationShow] = useState(false);

  useEffect(() => {
    const userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
          console.error("No user data found in sessionStorage");
          return;
        }

        const { access_token } = JSON.parse(storedUser);
        if (!access_token) {
          console.error("No access token found");
          return;
        }

        const { data } = await axios.post(
          `${API_BASE_URL}/profile/notification-status`,
          {},
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        if (data.success) {
          setNotificationShow(data.notification_enable);
        } else {
          console.error("Failed to fetch notification settings");
        }
      } catch (error) {
        console.error("Error fetching notification status:", error);
      }
    };

    fetchNotificationStatus();
  }, [setNotificationShow]);

  return (
    <UserContext.Provider
      value={{ userAuth, setUserAuth, NotificationShow, setNotificationShow }}
    >
      {/* ออกจากระบบอัตโนมัติเมื่อ session หมดอายุ */}
      <SessionExpiryWatcher />
      <ChatContextProvider>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:blog_id" element={<Editor />} />
          <Route element={<NavbarLayout />}>
            <Route
              path="/signin"
              element={<UserAuthForm type="เข้าสู่ระบบ" />}
            />
            <Route
              path="/signup"
              element={<UserAuthForm type="สมัครสมาชิก" />}
            />
            <Route path="/homepage" element={<HomePage />} /> {/* Updated route */}
            {/* หน้าตัวอย่าง UI ด้วยข้อมูลสมมติ — มีเฉพาะตอน npm run dev */}
            {import.meta.env.DEV && <Route path="/dev/ui" element={<UiPreview />} />}
            <Route path="/user/:id" element={<ProfilePage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/blog/:blog_id" element={<BlogPage />}></Route>
            <Route path="/profile/edit-profile/:id" element={<EditProfile />} />
            <Route path="settings" element={<SideNav />}>
              <Route path="edit-profile" element={<EditProfile />}></Route>
              <Route path="change-password" element={<ChangPassword />}></Route>
              <Route path="noti-setting" element={<NotiSetting />} />
            </Route>
            <Route path="/footer" element={<Footer />} />
            <Route
              path="/stat"
              element={<PostStatisticsChart postId="67d9279351d2ec5af3522fb7" />}
            />

            <Route path="dashboard" element={<SideNav />}>
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="reportCheck" element={<ReportCheck />} />
            </Route>

            <Route
              path="/dashboard/blogs/statistics"
              element={<DashboardUser />}
            />
            <Route path="/helpcentre" element={<HelpCentre />} />
            <Route path="/help-notlogin" element={<Helpnotlog />} />
          </Route>
          <Route path="/" element={<FirstPage />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />
          <Route
            path="/forgot-password-user"
            element={<ForgotPasswordUser />}
          />
          <Route
            path="/reset-password-user/:token"
            element={<ResetPasswordUser />}
          />
          <Route path="/chats" element={<Chat />} />
        </Routes>
      </ChatContextProvider>
    </UserContext.Provider>
  );
}

export default App;
