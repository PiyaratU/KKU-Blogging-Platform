const jwt = require("jsonwebtoken");

/**
 * อายุ session (access token) — ตั้งใน .env ด้วย SESSION_EXPIRES_IN รูปแบบของ jsonwebtoken เช่น "30m", "12h", "1d"
 * ไม่ตั้ง = 1 วัน · หมดอายุแล้วต้องเข้าสู่ระบบใหม่ (หน้าเว็บจะพาไปหน้าเข้าสู่ระบบเอง)
 */
const SESSION_EXPIRES_IN = process.env.SESSION_EXPIRES_IN || "1d";

/** รหัสที่หน้าเว็บใช้แยก "session หมดอายุ" ออกจาก token ผิด */
const SESSION_EXPIRED_CODE = "SESSION_EXPIRED";
const SESSION_EXPIRED_MESSAGE = "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่";

/** ออก access token ที่มีวันหมดอายุ — ใช้ทุกจุดที่เข้าสู่ระบบ (สมัคร / ล็อกอิน / Google / แอดมิน) */
const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: SESSION_EXPIRES_IN });

const isSessionExpiredError = (err) => err && err.name === "TokenExpiredError";

/** ตอบ 401 แบบเดียวกันทุกที่เมื่อ token หมดอายุ */
const sendSessionExpired = (res) =>
  res.status(401).json({
    error: SESSION_EXPIRED_MESSAGE,
    message: SESSION_EXPIRED_MESSAGE,
    code: SESSION_EXPIRED_CODE,
  });

module.exports = {
  SESSION_EXPIRES_IN,
  SESSION_EXPIRED_CODE,
  signAccessToken,
  isSessionExpiredError,
  sendSessionExpired,
};
