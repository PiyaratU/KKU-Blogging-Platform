/**
 * เข้าสู่ระบบด้วย Google โดยตรง (Google Identity Services) — ไม่ใช้ Firebase
 * · เว็บขอ access token จาก Google ผ่าน pop-up แล้วส่งให้ API (POST /google-auth)
 * · API ตรวจกับ Google ว่า token ออกให้ Client ID ของเราจริง (kku-blogging-api/utils/googleAuth.js)
 * ตั้ง REACT_APP_GOOGLE_CLIENT_ID ใน .env (Google Cloud Console → APIs & Services → Credentials → OAuth client ID)
 */

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || "";

type TokenResponse = { access_token?: string; error?: string; error_description?: string };
type TokenClient = { requestAccessToken: (overrides?: { prompt?: string }) => void };
type GoogleOAuth2 = {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (res: TokenResponse) => void;
    error_callback?: (err: { type?: string }) => void;
  }) => TokenClient;
};

declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } };
  }
}

let scriptPromise: Promise<GoogleOAuth2> | null = null;

/** โหลดสคริปต์ของ Google ล่วงหน้า (เรียกตอนเปิดหน้าเข้าสู่ระบบ — pop-up จะได้เปิดทันทีที่กดปุ่ม ไม่โดนบล็อก) */
export const loadGoogleScript = (): Promise<GoogleOAuth2> => {
  if (window.google?.accounts?.oauth2) return Promise.resolve(window.google.accounts.oauth2);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GSI_SRC;
      script.async = true;
      script.onload = () =>
        window.google?.accounts?.oauth2 ? resolve(window.google.accounts.oauth2) : reject(new Error("load failed"));
      script.onerror = () => reject(new Error("load failed"));
      document.head.appendChild(script);
    }).catch((err) => {
      scriptPromise = null; // ให้ลองโหลดใหม่ได้ครั้งหน้า
      throw err;
    }) as Promise<GoogleOAuth2>;
  }
  return scriptPromise;
};

const POPUP_ERRORS: Record<string, string> = {
  popup_closed: "ปิดหน้าต่าง Google ก่อนเข้าสู่ระบบเสร็จ",
  popup_failed_to_open: "เบราว์เซอร์บล็อกหน้าต่าง Google — อนุญาต pop-up แล้วลองใหม่",
};

/** เปิด pop-up ของ Google แล้วคืน access token (ส่งต่อให้ API ตรวจ) */
export const authWithGoogle = async (): Promise<string> => {
  if (!CLIENT_ID) {
    throw new Error("ยังไม่ได้ตั้งค่า REACT_APP_GOOGLE_CLIENT_ID — เข้าสู่ระบบด้วย Google ไม่ได้");
  }

  let oauth2: GoogleOAuth2;
  try {
    oauth2 = await loadGoogleScript();
  } catch {
    throw new Error("โหลดระบบเข้าสู่ระบบของ Google ไม่ได้ — ตรวจสอบอินเทอร์เน็ต");
  }

  return new Promise((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid email profile",
      callback: (res) => {
        if (res.access_token) return resolve(res.access_token);
        reject(new Error(res.error === "access_denied" ? "ไม่ได้อนุญาตให้เข้าถึงบัญชี Google" : "การลงชื่อเข้าใช้ด้วย Google ล้มเหลว"));
      },
      error_callback: (err) => {
        reject(new Error(POPUP_ERRORS[err?.type || ""] || "การลงชื่อเข้าใช้ด้วย Google ล้มเหลว"));
      },
    });
    client.requestAccessToken({ prompt: "select_account" });
  });
};
