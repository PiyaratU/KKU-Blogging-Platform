/**
 * ชุดสีพาสเทล — ของที่ "มีชื่อ" (แท็ก / รูปโปรไฟล์ที่ไม่มีรูป / รูปปกที่ไม่มีรูป) ได้สีตามชื่อ ชื่อเดิมได้สีเดิมเสมอ
 * (เขียนคลาสเต็มทุกตัว — Tailwind หาคลาสจากข้อความในไฟล์ ประกอบชื่อคลาสตอนรันไม่ได้)
 */
export const PASTEL = [
  "tw:bg-violet-100 tw:text-violet-800",
  "tw:bg-sky-100 tw:text-sky-800",
  "tw:bg-emerald-100 tw:text-emerald-800",
  "tw:bg-amber-100 tw:text-amber-800",
  "tw:bg-rose-100 tw:text-rose-800",
  "tw:bg-teal-100 tw:text-teal-800",
] as const;

/** ไล่สีพาสเทลอ่อนสำหรับรูปปกที่ไม่มีรูป */
export const PASTEL_GRADIENTS = [
  "tw:from-violet-100 tw:to-pink-100",
  "tw:from-sky-100 tw:to-indigo-100",
  "tw:from-emerald-100 tw:to-teal-100",
  "tw:from-amber-100 tw:to-rose-100",
  "tw:from-rose-100 tw:to-violet-100",
] as const;

/** แปลงข้อความเป็นเลข index คงที่ */
export const hashIndex = (text: string, size: number) => {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h) % size;
};

export const pastelFor = (text: string) => PASTEL[hashIndex(text, PASTEL.length)];
export const pastelGradientFor = (text: string) => PASTEL_GRADIENTS[hashIndex(text, PASTEL_GRADIENTS.length)];
