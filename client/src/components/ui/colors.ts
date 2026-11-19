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
  "tw:bg-pink-100 tw:text-pink-800",
  "tw:bg-orange-100 tw:text-orange-800",
  "tw:bg-lime-100 tw:text-lime-800",
  "tw:bg-indigo-100 tw:text-indigo-800",
] as const;

/**
 * กล่องหมวดหมู่หน้าแรก — ไล่สีเข้มกว่า PASTEL หนึ่งขั้น ให้เห็นสีชัดแต่ยังเป็นพาสเทล
 * เรียงให้กล่องที่อยู่ติดกันสีต่างกันชัด
 */
export const TILE_COLORS = [
  "tw:from-violet-200 tw:to-fuchsia-100 tw:text-violet-900",
  "tw:from-sky-200 tw:to-cyan-100 tw:text-sky-900",
  "tw:from-amber-200 tw:to-yellow-100 tw:text-amber-900",
  "tw:from-emerald-200 tw:to-lime-100 tw:text-emerald-900",
  "tw:from-rose-200 tw:to-pink-100 tw:text-rose-900",
  "tw:from-indigo-200 tw:to-sky-100 tw:text-indigo-900",
  "tw:from-orange-200 tw:to-amber-100 tw:text-orange-900",
  "tw:from-teal-200 tw:to-emerald-100 tw:text-teal-900",
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

/** สีตัวหนังสือเข้มขึ้นของชุดเดียวกัน (index ตรงกับ PASTEL) — ใช้กับชื่อหมวดหมู่ในบรรทัดวันที่ */
export const PASTEL_TEXT = [
  "tw:text-violet-600",
  "tw:text-sky-600",
  "tw:text-emerald-600",
  "tw:text-amber-600",
  "tw:text-rose-600",
  "tw:text-teal-600",
  "tw:text-pink-600",
  "tw:text-orange-600",
  "tw:text-lime-700",
  "tw:text-indigo-600",
] as const;

export const pastelTextFor = (text: string) => PASTEL_TEXT[hashIndex(text, PASTEL_TEXT.length)];
