import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ใช้ชื่อตัวแปรแบบเดิมของ Create React App (REACT_APP_*) ต่อได้ — ค่าที่ตั้งไว้บน Vercel ไม่ต้องเปลี่ยนชื่อ
  envPrefix: ["VITE_", "REACT_APP_"],
  server: {
    // พอร์ตเดิมของ CRA — server / socket อนุญาต CORS ไว้ที่ http://localhost:3000
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    // โฟลเดอร์เดิมของ CRA — โปรเจกต์บน Vercel ที่ตั้ง Output Directory = build ใช้ต่อได้
    outDir: "build",
  },
});
