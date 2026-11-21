import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import logo from "../../pic/logo-headV2.png";

/**
 * กรอบหน้าเข้าสู่ระบบ / สมัครของเว็บแอดมิน — หน้าตาชุดเดียวกับหน้าเข้าสู่ระบบของเว็บผู้ใช้
 * (kku-blogging-user/src/Screens/UserAuthForm.tsx): พื้นไล่ม่วงจาง · การ์ดขาวมุมโค้ง · ช่องกรอกพื้นเทาขอบม่วงตอนพิมพ์
 */
export const AuthLayout = ({
  title,
  subtitle,
  wide = false,
  children,
}: {
  title: string;
  subtitle?: string;
  /** ฟอร์มหลายช่อง (สมัคร) ใช้การ์ดกว้างขึ้น */
  wide?: boolean;
  children: ReactNode;
}) => (
  <div className="tw:flex tw:min-h-screen tw:items-center tw:justify-center tw:bg-linear-to-b tw:from-primary-soft/60 tw:to-white tw:px-4 tw:py-10">
    <div
      className={
        "tw:w-full tw:rounded-[2rem] tw:border tw:border-solid tw:border-line/80 tw:bg-white tw:px-6 tw:py-8 tw:shadow-xl tw:shadow-primary-pastel/30 tw:sm:px-10 tw:sm:py-10 " +
        (wide ? "tw:max-w-2xl" : "tw:max-w-md")
      }
    >
      <img src={logo} alt="KKU Blogging Platform" className="tw:mx-auto tw:block tw:h-11 tw:w-auto" />
      <span className="tw:mx-auto tw:mt-4 tw:flex tw:w-fit tw:items-center tw:gap-2 tw:rounded-full tw:bg-primary-soft tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-primary-strong">
        <span className="tw:size-1.5 tw:rounded-full tw:bg-primary-strong" />
        สำหรับผู้ดูแลระบบ
      </span>
      <h1 className="tw:mt-4 tw:mb-0 tw:text-center tw:text-2xl tw:font-semibold tw:text-ink">{title}</h1>
      {subtitle && <p className="tw:mt-2 tw:mb-0 tw:text-center tw:text-sm tw:text-muted">{subtitle}</p>}
      <div className="tw:mt-8">{children}</div>
    </div>
  </div>
);

/** ช่องกรอกแบบเดียวกับหน้าเข้าสู่ระบบของเว็บผู้ใช้ — รหัสผ่านมีปุ่มแสดง / ซ่อน */
export const AuthField = ({
  label,
  error,
  ...input
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) => {
  const [show, setShow] = useState(false);
  const isPassword = input.type === "password";

  return (
    <div>
      <label htmlFor={input.id} className="tw:mb-1.5 tw:block tw:text-sm tw:font-medium tw:text-ink">
        {label}
      </label>
      <div className="tw:relative">
        <input
          {...input}
          type={isPassword && show ? "text" : input.type}
          className={
            "tw:block tw:h-12 tw:w-full tw:rounded-xl tw:border tw:border-solid tw:bg-surface tw:px-4 tw:text-base tw:text-ink tw:outline-none tw:transition tw:placeholder:text-muted/70 tw:hover:border-primary-pastel tw:focus:border-primary-pastel-hover tw:focus:bg-white tw:focus:ring-4 tw:focus:ring-primary-soft " +
            (error ? "tw:border-rose-300" : "tw:border-line") +
            (isPassword ? " tw:pr-12" : "")
          }
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            className="tw:absolute tw:right-2 tw:top-1/2 tw:flex tw:size-9 tw:-translate-y-1/2 tw:cursor-pointer tw:items-center tw:justify-center tw:rounded-full tw:border-0 tw:bg-transparent tw:text-muted tw:hover:bg-primary-soft tw:hover:text-primary-strong"
          >
            {show ? <IoEyeOutline className="tw:size-5" /> : <IoEyeOffOutline className="tw:size-5" />}
          </button>
        )}
      </div>
      {error && <p className="tw:mt-1.5 tw:mb-0 tw:text-xs tw:text-rose-700">{error}</p>}
    </div>
  );
};
