import { Fragment, useContext } from "react";
import { UserContext } from "../../App";

const PHRASES = ["ค้นพบเรื่องราว", "ความรู้", "และไอเดีย", "จากเพื่อน ๆ"];

/** หัวข้อต้อนรับตัวใหญ่ด้านบนหน้าแรก */
const HomeHero = () => {
  const {
    userAuth: { access_token, fullname },
  } = useContext(UserContext);
  const greeting = access_token && fullname ? `สวัสดี ${fullname}!` : "สวัสดี ชาว KKU!";

  return (
    <h1 className="tw:mt-6 tw:mb-10 tw:text-4xl tw:font-light tw:leading-tight tw:text-ink tw:md:mt-10 tw:md:text-6xl tw:md:leading-[1.15]">
      {/* ตัดบรรทัดเฉพาะระหว่างวลี — เบราว์เซอร์ตัดคำไทยบางคำผิด (เช่น "ไอ|เดีย") */}
      <span className="tw:font-bold">{greeting}</span>{" "}
      {PHRASES.map((p) => (
        <Fragment key={p}>
          <span className="tw:whitespace-nowrap">{p}</span>{" "}
        </Fragment>
      ))}
    </h1>
  );
};

export default HomeHero;
