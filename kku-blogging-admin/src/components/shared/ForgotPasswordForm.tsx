import React, { useState } from "react";
import { Alert, Box, Button, Container, IconButton, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";
import "../../misc/reset-password.css";
import InputBox from "../input.component";
import { pillButtonSx } from "./styles";
import type { CustomAlertProps } from "../../types/auth";
import type { ForgotPasswordFormProps } from "../../types/ui";

/**
 * หน้า "ลืมรหัสผ่าน" — ใช้ร่วมกันทั้งผู้ใช้ทั่วไปและผู้ดูแลระบบ
 * ต่างกันแค่ API ที่ส่งอีเมล (endpoint) และหน้าเข้าสู่ระบบที่พากลับไป (loginPath)
 */
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ endpoint, loginPath }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<CustomAlertProps>({
    show: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${import.meta.env.REACT_APP_API_ENDPOINT}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(`เราได้ส่งลิงก์สําหรับตั้งค่ารหัสผ่านใหม่ไปยังอีเมล ${email}`);
          setAlert({
            show: true,
            message: `เราได้ส่งลิงก์สําหรับตั้งค่ารหัสผ่านใหม่ไปยังอีเมล ${email} รหัสอ้างอิง (${data.ref})`,
            severity: "success",
          });
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง"));
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ position: "absolute", top: "10px", left: "10px", margin: "50px" }}
      >
        <IoChevronBackOutline />
      </IconButton>
      <ToastContainer />
      <Box
        sx={{
          padding: "40px 20px",
          borderRadius: "8px",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ marginBottom: "20px", fontWeight: "600" }}>
          ป้อนอีเมลของคุณ
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: "20px", color: "#6c757d" }}>
          ป้อนที่อยู่อีเมลที่เชื่อมต่อกับบัญชีของคุณ แล้วเราจะส่งลิงก์สำหรับตั้งค่ารหัสผ่านใหม่ให้แก่คุณ
        </Typography>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ my: "24px", textAlign: "left", borderRadius: "8px" }}>
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <InputBox
            name="email"
            type="email"
            id="email"
            placeholder="อีเมล"
            icon="MdOutlineMail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={alert.show}
          />

          {alert.show ? (
            <Button variant="contained" fullWidth disableElevation onClick={() => navigate(loginPath)} sx={pillButtonSx}>
              กลับไปหน้าหลัก
            </Button>
          ) : (
            <Button type="submit" variant="contained" fullWidth disableElevation sx={pillButtonSx}>
              ดำเนินการต่อ
            </Button>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPasswordForm;
