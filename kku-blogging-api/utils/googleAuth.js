/**
 * ตรวจ access token จาก "Sign in with Google" (เว็บส่งมาที่ POST /google-auth) — ไม่ใช้ Firebase
 * 1. ถาม Google (tokeninfo) ว่า token ยังใช้ได้ และออกให้ Client ID ของเราจริง (กัน token ที่ขอมาจากเว็บอื่น)
 * 2. ดึงชื่อ / รูปจาก userinfo
 * ตั้ง GOOGLE_CLIENT_ID ใน .env (หลายตัวคั่นด้วย ,) ให้ตรงกับ REACT_APP_GOOGLE_CLIENT_ID ของเว็บ
 */

const TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

class GoogleAuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.status = status;
  }
}

const allowedClientIds = () =>
  (process.env.GOOGLE_CLIENT_ID || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

/** คืน { email, name, picture } ของบัญชี Google — token ไม่ผ่านจะ throw GoogleAuthError */
const verifyGoogleAccessToken = async (accessToken) => {
  const clientIds = allowedClientIds();
  if (!clientIds.length) {
    throw new GoogleAuthError("ยังไม่ได้ตั้งค่า GOOGLE_CLIENT_ID บน server จึงเข้าสู่ระบบด้วย Google ไม่ได้", 503);
  }

  const auth = { Authorization: `Bearer ${accessToken}` };

  // ส่ง token ใน body (POST) — ไม่ใส่ใน URL จะได้ไม่ไปค้างใน log
  const infoRes = await fetch(TOKENINFO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ access_token: accessToken }),
  });
  if (!infoRes.ok) {
    throw new GoogleAuthError("token ของ Google ไม่ถูกต้องหรือหมดอายุ — ลองเข้าสู่ระบบใหม่");
  }
  const info = await infoRes.json();

  if (!clientIds.includes(info.aud) && !clientIds.includes(info.azp)) {
    throw new GoogleAuthError("token นี้ไม่ได้ออกให้เว็บไซต์นี้");
  }
  if (String(info.email_verified) !== "true" || !info.email) {
    throw new GoogleAuthError("บัญชี Google นี้ยังไม่ได้ยืนยันอีเมล");
  }

  const userRes = await fetch(USERINFO_URL, { headers: auth });
  const profile = userRes.ok ? await userRes.json() : {};

  return {
    email: info.email,
    name: profile.name || info.email.split("@")[0],
    picture: profile.picture,
  };
};

module.exports = { verifyGoogleAccessToken, GoogleAuthError };
