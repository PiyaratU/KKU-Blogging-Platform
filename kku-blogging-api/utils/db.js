const mongoose = require("mongoose");

/**
 * ต่อ MongoDB ครั้งเดียวแล้วใช้ซ้ำ — รองรับทั้งรันในเครื่อง / Render และ Vercel (serverless)
 * บน Vercel เครื่องถูกปลุกใหม่บ่อย (cold start) ถ้า request มาก่อนต่อ DB เสร็จจะได้ "buffering timed out"
 * จึงให้ทุก request รอ connectDB() ก่อน (middleware ใน index.js) · ต่อไม่ได้ = ลองใหม่ใน request ถัดไป
 */
let connecting = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.ATLAS_URI, {
        serverSelectionTimeoutMS: 8000, // หา server ไม่เจอใน 8 วินาที = แจ้ง error เลย ไม่ค้าง
        maxPoolSize: 5,
      })
      .then((m) => {
        console.log("MongoDB connection established");
        return m.connection;
      })
      .catch((error) => {
        connecting = null; // ให้ request ถัดไปลองต่อใหม่
        console.log("MongoDB connection failed: ", error.message);
        throw error;
      });
  }
  return connecting;
};

module.exports = { connectDB };
