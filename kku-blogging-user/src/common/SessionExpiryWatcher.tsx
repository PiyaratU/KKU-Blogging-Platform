import { useCallback, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../App";
import {
  SESSION_EXPIRED_CODE,
  SESSION_EXPIRED_MESSAGE,
  lookInSession,
  removeFromSession,
  tokenExpiresAt,
} from "./session";

/** setTimeout รับได้ไม่เกิน ~24.8 วัน — นานกว่านั้นตั้งเวลาเช็กซ้ำแทน */
const MAX_TIMEOUT_MS = 2_147_000_000;

/**
 * ดูแล session หมดอายุ — วางไว้ใน App ครั้งเดียว
 * 1. ถึงเวลาหมดอายุของ token (exp) → ออกจากระบบทันที แม้ไม่ได้กดอะไร
 * 2. server ตอบ 401 code SESSION_EXPIRED (เช่น เครื่องเวลาไม่ตรง) → ออกจากระบบ
 * ออกจากระบบแล้วแจ้ง "เซสชันหมดอายุ" และพาไปหน้าเข้าสู่ระบบ (เว็บแอดมินแยกไปที่ kku-blogging-admin/ มีตัวของตัวเอง)
 */
const SessionExpiryWatcher = () => {
  const navigate = useNavigate();
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  const handledTokenRef = useRef<string | null>(null);

  const expireSession = useCallback(() => {
    const stored = lookInSession("user");
    const user = stored ? (JSON.parse(stored) as { access_token?: string }) : null;
    const token = user?.access_token ?? null;
    // token นี้จัดการไปแล้ว (หลาย request ตอบ 401 พร้อมกัน) — ทำครั้งเดียว
    if (!token || handledTokenRef.current === token) return;
    handledTokenRef.current = token;

    removeFromSession("user");
    removeFromSession("userId");
    setUserAuth({ access_token: null });
    toast.error(SESSION_EXPIRED_MESSAGE, { id: "session-expired" });
    navigate("/signin", { replace: true });
  }, [navigate, setUserAuth]);

  // 1. ตั้งเวลาออกจากระบบตาม exp ของ token
  useEffect(() => {
    const expiresAt = tokenExpiresAt(access_token);
    if (!access_token || expiresAt === null) return;

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        expireSession();
        return;
      }
      timer = setTimeout(schedule, Math.min(remaining, MAX_TIMEOUT_MS));
    };
    schedule();

    // กลับมาที่แท็บหลังพับจอ / เครื่องหลับ — timer อาจช้า เช็กใหม่ทันที
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() >= expiresAt) expireSession();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [access_token, expireSession]);

  // 2. server บอกว่าหมดอายุ — ดักทุก request ของ axios
  useEffect(() => {
    const id = axios.interceptors.response.use(undefined, (error) => {
      if (error?.response?.status === 401 && error.response.data?.code === SESSION_EXPIRED_CODE) {
        expireSession();
      }
      return Promise.reject(error);
    });
    return () => axios.interceptors.response.eject(id);
  }, [expireSession]);

  return null;
};

export default SessionExpiryWatcher;
