import type { SxProps, Theme } from "@mui/material";

/** ปุ่มหลักทรงแคปซูลเต็มความกว้าง (หน้าลืมรหัสผ่าน / ตั้งรหัสผ่านใหม่) — สีเดียวกับ <Button> ของเว็บ */
export const pillButtonSx: SxProps<Theme> = {
  backgroundColor: "#e4d4f7",
  color: "#6d3a9c",
  textTransform: "none",
  fontWeight: 500,
  padding: "10px 0",
  borderRadius: "9999px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#d8c2f2",
    boxShadow: "none",
  },
};
