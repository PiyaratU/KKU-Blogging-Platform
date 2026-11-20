import "../misc/signup.css";
import googleIcon from "../pic/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "./page-animation";
import { useContext, useRef, useState } from "react";
import type { ComponentType, InputHTMLAttributes } from "react";
import { Toaster, toast } from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline, IoLockClosedOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { storeInSession, userInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";
import { Button, buttonClasses } from "../components/ui/Button";
import { PASTEL } from "../components/ui/colors";
import type { LoginPageProps } from "../types/auth";

/** หัวข้อตัวอย่างที่ลอยอยู่ฝั่งซ้าย — แค่ตกแต่ง */
const TOPICS = ["เรื่องเรียน", "กิจกรรม", "ของกินรอบมอ", "ท่องเที่ยว", "เทคโนโลยี", "ชีวิตหอ"];
const TILTS = ["tw:-rotate-3", "tw:rotate-2", "tw:-rotate-1", "tw:rotate-3", "tw:-rotate-2", "tw:rotate-1"];

/** ช่องกรอก — ป้ายชื่อด้านบน ไอคอนซ้าย (รหัสผ่านมีปุ่มดู/ซ่อน) */
const Field = ({
  label,
  icon: Icon,
  aside,
  hint,
  type = "text",
  ...input
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  aside?: React.ReactNode;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <div className="tw:mb-1.5 tw:flex tw:items-baseline tw:justify-between tw:gap-3">
        <label htmlFor={input.id} className="tw:text-sm tw:font-medium tw:text-ink">
          {label}
        </label>
        {aside}
      </div>
      <div className="tw:group/field tw:relative">
        <Icon className="tw:pointer-events-none tw:absolute tw:left-4 tw:top-1/2 tw:size-5 tw:-translate-y-1/2 tw:text-muted tw:transition-colors tw:group-focus-within/field:text-primary-strong" />
        <input
          type={isPassword && show ? "text" : type}
          className="tw:block tw:h-12 tw:w-full tw:rounded-xl tw:border tw:border-solid tw:border-line tw:bg-surface tw:pl-12 tw:pr-12 tw:text-base tw:text-ink tw:outline-none tw:transition tw:placeholder:text-muted/70 tw:hover:border-primary-pastel tw:focus:border-primary-pastel-hover tw:focus:bg-white tw:focus:ring-4 tw:focus:ring-primary-soft"
          {...input}
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
      {hint && <p className="tw:mt-1.5 tw:mb-0 tw:text-xs tw:text-muted">{hint}</p>}
    </div>
  );
};

const UserAuthForm: React.FC<LoginPageProps> = ({ type }) => {
  const authForm = useRef<HTMLFormElement>(null);
  const isSignIn = type === "เข้าสู่ระบบ";
  const API_URL =
    import.meta.env.REACT_APP_API_ENDPOINT ||
    "https://kku-blog-server-ak2l.onrender.com";

  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

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
        userInSession("userId", data._id);
        setUserAuth(data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const serverRoute = isSignIn ? "/signin" : "/signup";

    if (!authForm.current) {
      toast.error("Form not found");
      return;
    }

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const form = new FormData(authForm.current as HTMLFormElement);
    const formData: { [key: string]: any } = {};

    form.forEach((value, key) => {
      formData[key] = value;
    });

    const { fullname, email, password } = formData;
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("ชื่อต้องมีความยาวอย่างน้อย 3 ตัว อักษร");
      }
    }

    if (!email.length) {
      return toast.error("ใส่ Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email ไม่ถูกต้อง");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "รหัสผ่านควรมีความยาว 6-20 ตัวอักษร พร้อมตัวเลข ตัวพิมพ์เล็ก 1 ตัว ตัวพิมพ์ใหญ่ 1 ตัว"
      );
    }
    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = async (e: React.MouseEvent) => {
    e.preventDefault();
    const userCredential = await authWithGoogle();

    if (userCredential) {
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const serverRoute = "/google-auth";
      const formData = {
        access_token: idToken,
      };
      await userAuthThroughServer(serverRoute, formData);
    } else {
      toast.error("การลงชื่อเข้าใช้ล้มเหลว");
    }
  };

  return access_token ? (
    <Navigate to="/homepage" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <Toaster />
      <div className="tw:flex tw:min-h-[calc(100vh-72px)] tw:items-center tw:justify-center tw:bg-linear-to-b tw:from-primary-soft/60 tw:to-white tw:px-4 tw:py-10 tw:md:py-16">
        <div className="tw:grid tw:w-full tw:max-w-5xl tw:overflow-hidden tw:rounded-[2rem] tw:border tw:border-solid tw:border-line/80 tw:bg-white tw:shadow-xl tw:shadow-primary-pastel/30 tw:md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* ฝั่งซ้าย — แผงสีพาสเทล (ซ่อนบนมือถือ) */}
          <div className="tw:relative tw:hidden tw:overflow-hidden tw:bg-linear-to-br tw:from-violet-200 tw:via-pink-100 tw:to-amber-100 tw:p-10 tw:md:flex tw:md:flex-col tw:lg:p-12">
            <span aria-hidden="true" className="tw:absolute tw:-right-16 tw:-top-16 tw:size-56 tw:rounded-full tw:bg-white/40" />
            <span aria-hidden="true" className="tw:absolute tw:-bottom-20 tw:-left-10 tw:size-64 tw:rounded-full tw:bg-sky-200/50" />
            <span aria-hidden="true" className="tw:absolute tw:bottom-24 tw:right-10 tw:size-16 tw:rounded-full tw:bg-amber-200/80" />

            <div className="tw:relative">
              <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/70 tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-primary-strong">
                <span className="tw:size-1.5 tw:rounded-full tw:bg-primary-strong" />
                KKU Blogging Platform
              </span>
              <h2 className="tw:mt-6 tw:mb-0 tw:text-4xl tw:font-semibold tw:leading-tight tw:text-violet-950">
                ทุกเรื่องราวของ<span className="tw:whitespace-nowrap">ชาว มข.</span>
                <br />
                อยู่ที่นี่
              </h2>
              <p className="tw:mt-4 tw:mb-0 tw:max-w-sm tw:text-base tw:leading-relaxed tw:text-violet-950/70">
                อ่าน เขียน และแบ่งปันประสบการณ์ ตั้งแต่เรื่องเรียน กิจกรรม{" "}
                <span className="tw:whitespace-nowrap">จนถึงของกินรอบมอ</span>
              </p>
            </div>

            <div className="tw:relative tw:mt-auto tw:flex tw:flex-wrap tw:gap-2.5 tw:pt-12">
              {TOPICS.map((t, i) => (
                <span
                  key={t}
                  className={`tw:rounded-full tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:shadow-sm ${PASTEL[i % PASTEL.length]} ${TILTS[i]}`}
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* มือถือ — แถบสีพาสเทลแทนแผงซ้าย */}
          <div className="tw:relative tw:flex tw:flex-wrap tw:gap-2 tw:overflow-hidden tw:bg-linear-to-br tw:from-violet-200 tw:via-pink-100 tw:to-amber-100 tw:px-6 tw:py-5 tw:md:hidden">
            <span aria-hidden="true" className="tw:absolute tw:-right-8 tw:-top-10 tw:size-28 tw:rounded-full tw:bg-white/40" />
            {TOPICS.slice(0, 4).map((t, i) => (
              <span key={t} className={`tw:relative tw:rounded-full tw:px-3 tw:py-1 tw:text-xs tw:font-semibold ${PASTEL[i]} ${TILTS[i]}`}>
                #{t}
              </span>
            ))}
          </div>

          {/* ฝั่งขวา — ฟอร์ม */}
          <div className="tw:px-6 tw:py-10 tw:sm:px-12 tw:md:py-14">
            <h1 className="tw:m-0 tw:text-3xl tw:font-semibold tw:tracking-tight tw:text-ink">
              {isSignIn ? "ยินดีต้อนรับกลับมา" : "สร้างบัญชีใหม่"}
            </h1>
            <p className="tw:mt-2 tw:mb-0 tw:text-base tw:text-muted">
              {isSignIn ? (
                <>
                  เข้าสู่ระบบเพื่อเขียนและ<span className="tw:whitespace-nowrap">ติดตามบล็อกที่ชอบ</span>
                </>
              ) : (
                <>
                  สมัครฟรี แล้วเริ่มเขียน<span className="tw:whitespace-nowrap">เรื่องแรกของคุณ</span>
                </>
              )}
            </p>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className={buttonClasses({ variant: "secondary", size: "lg", className: "tw:mt-8 tw:w-full tw:gap-3" })}
            >
              <img src={googleIcon} alt="" style={{ width: 20, height: 20 }} />
              ดำเนินการต่อด้วย Google
            </button>

            <div className="tw:my-6 tw:flex tw:items-center tw:gap-3 tw:text-xs tw:text-muted">
              <span className="tw:h-px tw:flex-1 tw:bg-line" />
              <span className="tw:whitespace-nowrap">หรือใช้อีเมล</span>
              <span className="tw:h-px tw:flex-1 tw:bg-line" />
            </div>

            <form id="formElement" ref={authForm} onSubmit={handlesubmit} noValidate className="tw:flex tw:flex-col tw:gap-5">
              {!isSignIn && (
                <Field
                  label="ชื่อที่ใช้แสดง"
                  icon={IoPersonOutline}
                  name="fullname"
                  id="fullname"
                  placeholder="เช่น สมหญิง ใจดี"
                  autoComplete="name"
                />
              )}

              <Field
                label="อีเมล"
                icon={IoMailOutline}
                name="email"
                id="email"
                type="email"
                placeholder="you@kkumail.com"
                autoComplete="email"
              />

              <Field
                label="รหัสผ่าน"
                icon={IoLockClosedOutline}
                name="password"
                id="password"
                type="password"
                placeholder={isSignIn ? "รหัสผ่านของคุณ" : "ตั้งรหัสผ่าน"}
                autoComplete={isSignIn ? "current-password" : "new-password"}
                hint={isSignIn ? undefined : "6–20 ตัว มีตัวเลข ตัวพิมพ์เล็ก และตัวพิมพ์ใหญ่"}
                aside={
                  isSignIn && (
                    <Link
                      to="/forgot-password-user"
                      className="tw:text-sm tw:font-medium tw:text-primary-strong tw:no-underline tw:hover:text-ink"
                    >
                      ลืมรหัสผ่าน?
                    </Link>
                  )
                }
              />

              <Button type="submit" size="lg" className="tw:mt-2 tw:w-full">
                {type}
              </Button>
            </form>

            <p className="tw:mt-8 tw:mb-0 tw:text-center tw:text-sm tw:text-muted">
              {isSignIn ? "ยังไม่มีบัญชี?" : "เป็นสมาชิกอยู่แล้ว?"}{" "}
              <Link
                to={isSignIn ? "/signup" : "/signin"}
                className="tw:font-semibold tw:text-primary-strong tw:underline tw:decoration-primary-pastel tw:decoration-2 tw:underline-offset-4 tw:hover:text-ink"
              >
                {isSignIn ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
