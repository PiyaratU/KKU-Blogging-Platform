import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";

// ค่าของ Firebase Web App (ไม่ใช่ข้อมูลลับ — ฝั่งเว็บต้องเห็นอยู่แล้ว)
// ตั้งใน .env เพื่อสลับไปใช้โปรเจกต์ Firebase อื่นได้โดยไม่ต้องแก้โค้ด · ไม่ตั้ง = ใช้โปรเจกต์ kku-blogging เดิม
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA2xu2Gk8jCEmyVxT9QVJda4YbxpuvItEs",
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN || "kku-blogging.firebaseapp.com",
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID || "kku-blogging",
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET || "kku-blogging.appspot.com",
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1049515511189",
  appId: env.REACT_APP_FIREBASE_APP_ID || "1:1049515511189:web:128d03a138874966c63a9c",
  measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-SJNFTSNPGW",
};

// ใช้ Firebase แค่ Google login (แผนฟรีใช้ได้) — รูปเก็บที่ Cloudinary ดู common/b2.tsx
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export const authWithGoogle = async (): Promise<UserCredential | null> => {
  let user: UserCredential | null = null;
  try {
    const result = await signInWithPopup(auth, provider);
    user = result;
  } catch (err) {
    console.log(err);
  }
  return user;
};
