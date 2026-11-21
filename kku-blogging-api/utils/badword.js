const {
  addBadWords,
  removeBadWords,
  getBadWords,
  addIgnoreList,
  addPrefixes,
  scanBadWords,
} = require("@sit-sandbox/thai-bad-words");
const BadWordModel = require("../models/badword");
const { connectDB } = require("./db");

async function loadBadWordsFromDB() {
  try {
    await connectDB(); // รอต่อ DB ก่อน (โหลดตอนเปิด server — บน Vercel อาจยังต่อไม่เสร็จ)
    const badwordGroups = await BadWordModel.find();
    const allBadWords = badwordGroups.flatMap((group) => group.words);
    const currentBadWords = getBadWords();
    removeBadWords(currentBadWords);
    addPrefixes([
      "กู",
      "มึง",
      "ไอ้",
      "อี",
      "ไอ",
      "ผม",
      "คุณ",
      "กระผม",
      "เธอ",
      "พ่อ",
      "แม่",
      "นาย",
    ]);
    addIgnoreList(["หีบ", "สัสดี", "หน้าหีบ", "ตด", "กะหรี่ปั๊บ", "บ้าน"]);
    addBadWords(allBadWords);
    console.log("✅ Loaded bad words from database");
  } catch (error) {
    console.error("❌ Error loading bad words from DB:", error);
  }
}

loadBadWordsFromDB();

module.exports = scanBadWords;
module.exports.loadBadWordsFromDB = loadBadWordsFromDB;
