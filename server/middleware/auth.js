const jwt = require("jsonwebtoken");
const User = require("../models/user");

/** อ่าน token จาก header "Authorization: Bearer <token>" — ไม่มี = null */
const readBearerToken = (req) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  return authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

/**
 * ต้องเข้าสู่ระบบ — req.user = id ของผู้ใช้ (string)
 * ไม่มี token = 401 · token ไม่ถูกต้อง / หมดอายุ = 403
 */
const verifyJWT = (req, res, next) => {
  const token = readBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "ไม่มี token การเข้าถึง" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "การเข้าถึง token ไม่ถูกต้อง" });
    }
    req.user = user.id;
    next();
  });
};

/**
 * ต้องเข้าสู่ระบบ และโหลดข้อมูลผู้ใช้จากฐานข้อมูล — req.user = document ของผู้ใช้
 * ไม่มี token / token ไม่ถูกต้อง / ไม่พบผู้ใช้ = 401
 */
const requireUser = async (req, res, next) => {
  try {
    const token = readBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ message: "Invalid authentication token" });
  }
};

module.exports = { verifyJWT, requireUser };
