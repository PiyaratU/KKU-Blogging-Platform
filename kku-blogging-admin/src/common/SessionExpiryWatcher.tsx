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
 * ดูแล session หมดอายุของเว็บแอดมิน (ชุดเดียวกับ kku-blogging-user/src/common/SessionExpiryWatcher.tsx)
 * ถึงเวลา exp ของ token หรือ server ตอบ 401 SESSION_EXPIRED → ล้าง session แล้วพาไปหน้าเข้าสู่ระบบแอดมิน
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
    const token = stored ? (JSON.parse(stored) as { access_token?: string }).access_token ?? null : null;
    if (!token || handledTokenRef.current === token) return;
    handledTokenRef.current = token;

    removeFromSession("user");
    setUserAuth({ access_token: null });
    toast.error(SESSION_EXPIRED_MESSAGE, { id: "session-expired" });
    navigate("/admin/login", { replace: true });
  }, [navigate, setUserAuth]);

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

    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() >= expiresAt) expireSession();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [access_token, expireSession]);

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
