import ForgotPasswordForm from "../../components/shared/ForgotPasswordForm";

/** ลืมรหัสผ่าน — ผู้ดูแลระบบ */
const ForgotPassword = () => <ForgotPasswordForm endpoint="/forgot-password" loginPath="/admin/login" />;

export default ForgotPassword;
