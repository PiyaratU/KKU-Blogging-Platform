const storeInSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

const userInSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

const userIdInSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

const lookInSession = (key: string): string | null => {
  return sessionStorage.getItem(key);
};

const removeFromSession = (key: string) => {
  return sessionStorage.removeItem(key);
};

const logOutUser = () => {
  sessionStorage.clear();
};

/** รหัสที่ server ตอบมาเมื่อ token หมดอายุ (kku-blogging-api/utils/session.js) */
export const SESSION_EXPIRED_CODE = "SESSION_EXPIRED";
export const SESSION_EXPIRED_MESSAGE = "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่";

/**
 * เวลาหมดอายุของ access token (ms) จากค่า exp ใน JWT — อ่านอย่างเดียว ไม่ได้ตรวจลายเซ็น
 * token ไม่มี exp / อ่านไม่ได้ = null (ปล่อยให้ server เป็นคนตัดสิน)
 */
export const tokenExpiresAt = (token: string | null | undefined): number | null => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export {
  storeInSession,
  userInSession,
  lookInSession,
  removeFromSession,
  logOutUser,
  userIdInSession,
};
