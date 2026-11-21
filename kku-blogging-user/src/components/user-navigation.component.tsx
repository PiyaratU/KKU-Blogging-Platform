import { Link } from "react-router-dom";
import { LuFileEdit } from "react-icons/lu";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";
import AnimationWrapper from "../Screens/page-animation";

const itemClass =
  "tw:block tw:px-4 tw:py-2.5 tw:text-sm tw:text-ink-soft tw:no-underline tw:transition-colors tw:hover:bg-surface tw:hover:text-ink";

/** เมนูที่เปิดจากรูปโปรไฟล์บน navbar */
const UserNavigationPanel = () => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);
  const userId = sessionStorage.getItem("userId");

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  return (
    <AnimationWrapper className="tw:absolute tw:right-0 tw:top-12 tw:z-50" transition={{ duration: 0.2 }}>
      <div className="tw:w-60 tw:overflow-hidden tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:py-2 tw:shadow-xl">
        {/* จอเล็กไม่มีปุ่ม "เขียน" บน navbar — ใส่ไว้ในเมนูแทน */}
        <Link to="/editor" className={`${itemClass} tw:flex tw:items-center tw:gap-2 tw:md:hidden`}>
          <LuFileEdit />
          เขียน
        </Link>
        <Link to={`/user/${userId}`} className={itemClass}>
          โปรไฟล์
        </Link>
        <Link to="/dashboard/blogs" className={itemClass}>
          แดชบอร์ด
        </Link>
        <Link to="/settings/edit-profile" className={itemClass}>
          แก้ไขโปรไฟล์
        </Link>
        <Link to="/settings/change-password" className={itemClass}>
          ตั้งค่าบัญชีผู้ใช้
        </Link>
        <Link to="/helpcentre" className={itemClass}>
          ช่วยเหลือ
        </Link>

        <div className="tw:my-2 tw:border-t tw:border-line" />

        <button
          type="button"
          onClick={signOutUser}
          className="tw:block tw:w-full tw:border-0 tw:bg-transparent tw:px-4 tw:py-2.5 tw:text-left tw:transition-colors tw:hover:bg-surface tw:cursor-pointer"
        >
          <span className="tw:block tw:text-sm tw:font-medium tw:text-ink">ออกจากระบบ</span>
          <span className="tw:block tw:text-xs tw:text-muted">@{username}</span>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
