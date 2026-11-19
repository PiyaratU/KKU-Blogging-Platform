import type { SxProps, Theme } from "@mui/material";

/** ปุ่มดำทรงแคปซูลเต็มความกว้าง — ใช้ในหน้าลืมรหัสผ่าน / ตั้งรหัสผ่านใหม่ */
export const pillButtonSx: SxProps<Theme> = {
  backgroundColor: "#000",
  color: "#fff",
  textTransform: "none",
  padding: "10px 0",
  borderRadius: "50px",
  "&:hover": {
    backgroundColor: "#181818",
  },
};
