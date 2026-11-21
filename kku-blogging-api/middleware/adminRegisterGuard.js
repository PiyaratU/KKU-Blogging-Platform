const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const User = require("../models/user");
const { isSessionExpiredError, sendSessionExpired } = require("../utils/session");

/** เทียบรหัสแบบใช้เวลาเท่ากัน (กันเดารหัสจากเวลาตอบ) */
const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/**
 * ใครเพิ่มผู้ดูแลระบบได้ (ใช้กับ POST /admin/register ใน routes/adminProfile.js)
 * · ระบบมีผู้ดูแลระบบแล้ว: ต้องส่ง token ของผู้ดูแลระบบที่เข้าสู่ระบบอยู่
 *   ตั้ง SUPER_ADMIN_EMAILS (คั่นด้วย ,) ใน .env = จำกัดให้เฉพาะอีเมลเหล่านั้น · ไม่ตั้ง = ผู้ดูแลระบบทุกคน
 * · ระบบยังไม่มีผู้ดูแลระบบเลย: สร้างคนแรกได้ด้วยรหัสตั้งค่า (body.setup_key) ที่ตรงกับ ADMIN_SETUP_KEY ใน .env
 *   ไม่ตั้ง ADMIN_SETUP_KEY = สร้างคนแรกไม่ได้ (กันคนนอกชิงเป็นผู้ดูแลระบบคนแรก)
 */
const requireAdminToRegister = async (req, res, next) => {
  try {
    const hasAnyAdmin =
      (await Admin.estimatedDocumentCount()) > 0 || Boolean(await User.exists({ is_admin: true }));

    if (!hasAnyAdmin) {
      const setupKey = process.env.ADMIN_SETUP_KEY || "";
      if (setupKey.length < 12) {
        return res.status(403).json({
          message: "ยังไม่ได้ตั้งค่า ADMIN_SETUP_KEY ที่ server (อย่างน้อย 12 ตัวอักษร) — สร้างผู้ดูแลระบบคนแรกไม่ได้",
        });
      }
      if (!safeEqual(req.body?.setup_key || "", setupKey)) {
        return res.status(403).json({ message: "รหัสตั้งค่าระบบไม่ถูกต้อง" });
      }
      return next(); // ตั้งผู้ดูแลระบบคนแรกของระบบ
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "ต้องเข้าสู่ระบบเป็นผู้ดูแลระบบก่อนจึงจะเพิ่มผู้ดูแลระบบได้" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (isSessionExpiredError(err)) return sendSessionExpired(res);
      return res.status(401).json({ message: "token ไม่ถูกต้อง" });
    }

    // ผู้ดูแลระบบอยู่ได้ทั้งตาราง admins และ users (is_admin) — แบบเดียวกับ isAdmin ใน routes/adminProfile.js
    const requester = (await Admin.findById(decoded.id)) || (await User.findById(decoded.id));
    if (!requester || !requester.is_admin) {
      return res.status(403).json({ message: "เฉพาะผู้ดูแลระบบเท่านั้นที่เพิ่มผู้ดูแลระบบได้" });
    }

    const superAdmins = (process.env.SUPER_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (superAdmins.length && !superAdmins.includes(String(requester.email).toLowerCase())) {
      return res.status(403).json({ message: "บัญชีนี้ไม่มีสิทธิ์เพิ่มผู้ดูแลระบบ" });
    }

    req.user = requester;
    next();
  } catch (error) {
    console.error("Error checking admin permission:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { requireAdminToRegister };
