import ForgotPasswordForm from "../components/shared/ForgotPasswordForm";

/** ลืมรหัสผ่าน — ผู้ใช้ทั่วไป */
const ForgotPasswordUser = () => <ForgotPasswordForm endpoint="/forgot-password/user" loginPath="/signin" />;

export default ForgotPasswordUser;
