import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * เว็บผู้ดูแลระบบ (แยกจาก kku-blogging-user) — deploy แยกโปรเจกต์ / แยกโดเมน
 * พอร์ต 3006 ตอน dev · server ต้องอนุญาต CORS ไว้ที่ http://localhost:3006 (หรือ ADMIN_FRONTEND_ENDPOINT)
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ใช้ชื่อตัวแปรแบบเดียวกับ client (REACT_APP_*)
  envPrefix: ["VITE_", "REACT_APP_"],
  server: {
    port: 3006,
  },
  preview: {
    port: 3006,
  },
  build: {
    outDir: "build",
  },
});
