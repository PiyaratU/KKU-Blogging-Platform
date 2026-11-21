// RegisterForm.tsx
import { useState } from "react";
// import { registerAdmin } from "../api/adminlogin-Regist";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { registerAdmin } from "../api/adminlogin-Regist";
import { Link, useNavigate } from "react-router-dom";
import { AuthField, AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";

const RegisterAdmin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  // รหัสตั้งค่าระบบ — ใช้เฉพาะตอนสร้างผู้ดูแลระบบคนแรก (ADMIN_SETUP_KEY ที่ server)
  const [setupKey, setSetupKey] = useState("");
  const navigate = useNavigate();

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  const displayAlert = (message: string) => {
    setAlertMessage(message);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordMatchError(false);
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    setPasswordMatchError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setPasswordMatchError(true);
      return;
    }

    try {
      const admin = {
        username,
        email,
        password,
        tel,
        firstname,
        lastname,
        ...(setupKey.trim() && { setup_key: setupKey.trim() }),
      };
      await registerAdmin(admin);

      displayAlert("ลงทะเบียนสำเร็จ!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Registration failed:", error);
      // ข้อความจาก server เช่น ต้องเข้าสู่ระบบเป็นผู้ดูแลระบบก่อน / รหัสตั้งค่าระบบไม่ถูกต้อง / ชื่อผู้ใช้หรืออีเมลซ้ำ
      const message = error instanceof Error ? error.message : "";
      displayAlert(
        /already taken/i.test(message)
          ? "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่แล้ว"
          : message || "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่"
      );
    }
  };

  // หน้าตาเดียวกับหน้าสมัครของเว็บผู้ใช้ (components/auth/AuthLayout)
  return (
    <AuthLayout
      title="สมัครใช้งานผู้ดูแลระบบ"
      subtitle="เพิ่มผู้ดูแลระบบได้เฉพาะผู้ดูแลระบบที่เข้าสู่ระบบแล้ว · ผู้ดูแลระบบคนแรกใช้รหัสตั้งค่าระบบ"
      wide
    >
      <form onSubmit={handleSubmit} className="tw:grid tw:gap-5 tw:sm:grid-cols-2">
        <AuthField id="admin-firstname" label="ชื่อ" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        <AuthField id="admin-lastname" label="นามสกุล" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        <AuthField id="admin-username" label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <AuthField id="admin-email" label="อีเมล" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="tw:sm:col-span-2">
          <AuthField id="admin-tel" label="เบอร์โทรศัพท์" type="tel" value={tel} onChange={(e) => setTel(e.target.value)} />
        </div>
        <AuthField id="admin-password" label="ตั้งรหัสผ่าน" type="password" value={password} onChange={handlePasswordChange} />
        <AuthField
          id="admin-password-confirm"
          label="ยืนยันรหัสผ่าน"
          type="password"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          error={passwordMatchError ? "รหัสผ่านไม่ตรงกัน" : undefined}
        />
        <div className="tw:sm:col-span-2">
          <AuthField
            id="admin-setup-key"
            label="รหัสตั้งค่าระบบ (เฉพาะผู้ดูแลระบบคนแรก)"
            type="password"
            autoComplete="off"
            placeholder="ว่างไว้ถ้าเข้าสู่ระบบเป็นผู้ดูแลระบบอยู่แล้ว"
            value={setupKey}
            onChange={(e) => setSetupKey(e.target.value)}
          />
        </div>

        {alertMessage && (
          <div
            role="alert"
            className={
              "tw:flex tw:items-center tw:gap-3 tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm tw:sm:col-span-2 " +
              (alertMessage.includes("สำเร็จ") ? "tw:bg-emerald-50 tw:text-emerald-800" : "tw:bg-rose-50 tw:text-rose-700")
            }
          >
            {alertMessage.includes("สำเร็จ") ? <FaCheckCircle /> : <IoCloseCircle />}
            <span className="tw:flex-1">{alertMessage}</span>
            <button
              type="button"
              onClick={handleAlertClose}
              className="tw:cursor-pointer tw:border-0 tw:bg-transparent tw:text-sm tw:font-medium tw:text-inherit tw:underline"
            >
              ปิด
            </button>
          </div>
        )}

        <Button type="submit" size="lg" className="tw:w-full tw:sm:col-span-2">
          ลงทะเบียน
        </Button>
        <p className="tw:m-0 tw:text-center tw:text-sm tw:text-muted tw:sm:col-span-2">
          มีบัญชีแล้ว?{" "}
          <Link to="/admin/login" className="tw:font-medium tw:text-primary-strong tw:no-underline tw:hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterAdmin;
