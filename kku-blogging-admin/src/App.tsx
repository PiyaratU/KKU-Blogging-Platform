import { createContext, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { lookInSession } from "./common/session";
import type { UserContextType } from "./types/auth";
import SessionExpiryWatcher from "./common/SessionExpiryWatcher";
import AdminHome from "./pages/adminHome";
import AdminLogin from "./pages/adminLogin";
import AdminProfile from "./pages/adminProfile";
import AdminRegister from "./pages/adminRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// ธีมให้หน้าตาเหมือนเว็บผู้ใช้ — ต้องโหลดหลัง CSS ของหน้า (import หน้าข้างบนก่อน)
import "./styles/user-theme.css";

/** session ของผู้ดูแลระบบ — ชื่อเดียวกับ client ให้หน้าเดิม (adminLogin) ใช้ได้โดยไม่ต้องแก้ */
export const UserContext = createContext<UserContextType>({
  userAuth: { access_token: null },
  setUserAuth: () => {},
  NotificationShow: false,
  setNotificationShow: () => {},
});

const readSession = () => {
  try {
    const stored = lookInSession("user");
    return stored ? JSON.parse(stored) : { access_token: null };
  } catch {
    return { access_token: null };
  }
};

/** ต้องเข้าสู่ระบบก่อน — ไม่มี token พาไปหน้าเข้าสู่ระบบ (สิทธิ์แอดมินจริงตรวจที่ server ทุก API) */
function PrivateRoute({ children }: { children: ReactNode }) {
  return readSession()?.access_token ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

function App() {
  const [userAuth, setUserAuth] = useState<{ access_token: string | null }>(readSession);
  const [NotificationShow, setNotificationShow] = useState(false);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth, NotificationShow, setNotificationShow }}>
      <SessionExpiryWatcher />
      {/* path เดิมตอนอยู่ใน client — ลิงก์ / bookmark เดิมใช้ต่อได้ */}
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin type="admin" />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/admin/:adminId/profile"
          element={
            <PrivateRoute>
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:adminId"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
