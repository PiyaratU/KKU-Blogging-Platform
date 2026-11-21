import { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthField, AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import {
  storeInSession,
  userInSession,
  userIdInSession,
} from "../common/session";
import type { LoginPageProps } from "../types/auth";

const Login: React.FC<LoginPageProps> = ({ type }) => {
  const authForm = useRef<HTMLFormElement>(null);
  const API_URL = import.meta.env.REACT_APP_API_ENDPOINT;
  const navigate = useNavigate();

  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const userAuthThroughServer = (
    serverRoute: string,
    formData: { [key: string]: any }
  ) => {
    fetch(API_URL + serverRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Error occurred");
          });
        }
        return response.json();
      })
      .then((data) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
        userInSession("userId", data.username);
        userIdInSession("adminId", data._id);
        navigate(`/admin/${data._id}`);
      })
      .catch((error) => {
        // Set the error message in the alertMessage state
        setAlertMessage(error.message); // Use the error message
        toast.error(error.message);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAlertMessage(null); // Clear any previous error messages
    userAuthThroughServer("/admin", { email, password });
  };

  // หน้าตาเดียวกับหน้าเข้าสู่ระบบของเว็บผู้ใช้ (components/auth/AuthLayout)
  return (
    <AuthLayout title="ยินดีต้อนรับผู้ดูแลระบบ" subtitle="เข้าสู่ระบบเพื่อจัดการบล็อก ผู้ใช้ และรายงาน">
      {/* แสดง toast (เข้าสู่ระบบไม่สำเร็จ / เซสชันหมดอายุ) */}
      <Toaster position="top-center" />
      <form autoComplete="off" onSubmit={handleSubmit} ref={authForm} className="tw:flex tw:flex-col tw:gap-5">
        <AuthField
          id="admin-email"
          label="อีเมล"
          type="email"
          minLength={4}
          autoComplete="off"
          required
          placeholder="you@kkumail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <AuthField
            id="admin-password"
            label="รหัสผ่าน"
            type="password"
            minLength={4}
            autoComplete="off"
            required
            placeholder="รหัสผ่านของคุณ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="tw:mt-2 tw:text-right">
            <Link
              to="/forgot-password"
              className="tw:text-sm tw:font-medium tw:text-primary-strong tw:no-underline tw:hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </div>

        {alertMessage && (
          <p role="alert" className="tw:m-0 tw:rounded-xl tw:bg-rose-50 tw:px-4 tw:py-3 tw:text-sm tw:text-rose-700">
            {alertMessage}
          </p>
        )}

        <Button type="submit" size="lg" className="tw:mt-1 tw:w-full">
          เข้าสู่ระบบ
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
