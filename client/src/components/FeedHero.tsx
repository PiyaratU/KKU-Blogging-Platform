import { useContext } from "react";
import { LuFileEdit } from "react-icons/lu";
import { UserContext } from "../App";
import { LinkButton } from "./ui/Button";

/** แถบต้อนรับด้านบนฟีด — ชวนเขียน (ล็อกอินแล้ว) หรือชวนสมัคร (ยังไม่ล็อกอิน) */
const FeedHero = () => {
  const {
    userAuth: { access_token, fullname },
  } = useContext(UserContext);

  return (
    <div className="tw:mb-6 tw:flex tw:flex-col tw:gap-4 tw:rounded-2xl tw:bg-linear-to-r tw:from-violet-100 tw:via-pink-100 tw:to-amber-100 tw:p-6 tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
      <div>
        <p className="tw:m-0 tw:text-lg tw:font-semibold tw:leading-snug tw:text-ink">
          {access_token && fullname ? `สวัสดี ${fullname}` : "แบ่งปันเรื่องราวของคุณ"}
        </p>
        <p className="tw:mt-1 tw:mb-0 tw:text-sm tw:text-ink-soft">
          {access_token ? "วันนี้มีเรื่องอะไรอยากเล่าไหม?" : "อ่านบล็อกจากเพื่อน ๆ ในมหาวิทยาลัย แล้วเขียนเรื่องของคุณเอง"}
        </p>
      </div>
      {access_token ? (
        <LinkButton to="/editor" variant="secondary" className="tw:self-start tw:sm:self-auto">
          <LuFileEdit className="tw:size-4" />
          เขียนบล็อก
        </LinkButton>
      ) : (
        <LinkButton to="/signup" variant="secondary" className="tw:self-start tw:sm:self-auto">
          สมัครสมาชิก
        </LinkButton>
      )}
    </div>
  );
};

export default FeedHero;
