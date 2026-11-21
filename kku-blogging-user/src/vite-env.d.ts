/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL ของ API server เช่น http://localhost:3005 */
  readonly REACT_APP_API_ENDPOINT?: string;
  /** URL ของ socket server เช่น http://localhost:3004 */
  readonly REACT_APP_SOCKET_ENDPOINT?: string;
  readonly REACT_APP_FIREBASE_API_KEY?: string;
  readonly REACT_APP_FIREBASE_AUTH_DOMAIN?: string;
  readonly REACT_APP_FIREBASE_PROJECT_ID?: string;
  readonly REACT_APP_FIREBASE_STORAGE_BUCKET?: string;
  readonly REACT_APP_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly REACT_APP_FIREBASE_APP_ID?: string;
  readonly REACT_APP_FIREBASE_MEASUREMENT_ID?: string;
  /** Cloudinary (ที่เก็บรูป) — ชื่อ cloud และ unsigned upload preset */
  readonly REACT_APP_CLOUDINARY_CLOUD_NAME?: string;
  readonly REACT_APP_CLOUDINARY_UPLOAD_PRESET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
