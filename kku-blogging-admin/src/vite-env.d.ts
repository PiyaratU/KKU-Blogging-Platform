/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL ของ API server เช่น http://localhost:3005 */
  readonly REACT_APP_API_ENDPOINT?: string;
  /** URL ของเว็บผู้ใช้ (kku-blogging-user) เช่น http://localhost:3000 — ใช้เปิดโปรไฟล์ผู้เขียนจากหน้ารายงาน */
  readonly REACT_APP_CLIENT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
