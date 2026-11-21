import * as nsfwjs from "nsfwjs";
import type { Prediction } from "../types/blog";

/**
 * อัปโหลดรูปไปเก็บที่ Cloudinary (ฟรี ไม่ต้องผูกบัตร) — แทน Firebase Storage ที่ต้องใช้แผน Blaze
 * ใช้ "unsigned upload preset" ฝั่งหน้าเว็บจึงไม่ต้องมี API secret
 * ตั้งค่าใน kku-blogging-user/.env: REACT_APP_CLOUDINARY_CLOUD_NAME, REACT_APP_CLOUDINARY_UPLOAD_PRESET
 */
const CLOUD_NAME = import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

async function ImageNSFWProcessing(file: File) {
  try {
    const model = await nsfwjs.load();

    const img = new Image();
    img.src = URL.createObjectURL(file);

    return new Promise<File>((resolve, reject) => {
      img.onload = async () => {
        try {
          const badImages: Prediction[] = [];
          const predictions = await model.classify(img);

          const filteredPredictions = predictions.filter(
            (obj) =>
              (obj.className === "Hentai" && obj.probability > 0.4) ||
              (obj.className === "Sexy" && obj.probability > 0.9) ||
              (obj.className === "Porn" && obj.probability > 0.5)
          );

          filteredPredictions.forEach((obj) => {
            badImages.push(obj);
            console.log(obj.className, obj.probability * 100);
          });

          if (badImages.length > 0) {
            reject(new Error("Not accept NSFW Content"));
            return;
          }
          resolve(file);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Image loading failed"));
      };
    });
  } catch (error) {
    console.error("Error loading NSFW model:", error);
  }
}

/** ส่งไฟล์ไป Cloudinary แล้วคืน URL (https) ของรูปสำหรับบันทึกในฐานข้อมูล */
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "ยังไม่ได้ตั้งค่า Cloudinary — ใส่ REACT_APP_CLOUDINARY_CLOUD_NAME และ REACT_APP_CLOUDINARY_UPLOAD_PRESET ใน kku-blogging-user/.env"
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`อัปโหลดรูปไม่สำเร็จ: ${data?.error?.message ?? res.status}`);
  }
  return data.secure_url as string;
}

export const uploadProfileImage = async (file: File): Promise<string> => {
  await ImageNSFWProcessing(file);
  return uploadToCloudinary(file, "kku-blogging/profile-images");
};

export const uploadImage = async (file: File): Promise<string> => {
  await ImageNSFWProcessing(file);
  return uploadToCloudinary(file, "kku-blogging/images");
};
