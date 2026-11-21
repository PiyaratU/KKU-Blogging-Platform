import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profileData } from "./ProfilePage";
import AnimationWrapper from "./page-animation";
import Loader from "../components/loader.component";
import toast, { Toaster } from "react-hot-toast";
import "../misc/edit-profile.css";
import InputBox from "../components/input.component";
import { uploadProfileImage } from "../common/b2";
import { storeInSession } from "../common/session";

const EditProfile = () => {
  let {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  let bioLimit = 150;
  const profileImgEle = useRef<HTMLImageElement | null>(null);
  const editProfileForm = useRef<HTMLFormElement | null>(null);
  const [profile, setProfile] = useState(profileData);
  const [loading, setLoading] = useState(true);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updateProfileImg, setUpdateProfileImg] = useState<File | null>(null);
  const userId = sessionStorage.getItem("userId");

  let {
    username: profile_username,
    fullname,
    profile_picture,
    email,
    bio,
    social_links,
  } = profile;

  useEffect(() => {
    if (access_token) {
      axios
        .get(`${import.meta.env.REACT_APP_API_ENDPOINT}/profile/${userId}`)
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [access_token]);

  const handleCharacterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharactersLeft(bioLimit - e.target.value.length);
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    let img = e.target.files?.[0];
    if (img && profileImgEle.current) {
      profileImgEle.current.src = URL.createObjectURL(img);

      setUpdateProfileImg(img);
    }
  };
  const handleImageUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (updateProfileImg) {
      let loadingToast = toast.loading("กำลังอัพโหลด...");
      (e.target as HTMLButtonElement).setAttribute("disabled", "true");

      // อัปโหลดรูปไปยัง Cloudinary
      uploadProfileImage(updateProfileImg)
        .then((url) => {
          if (url) {
            axios
              .post(
                `${import.meta.env.REACT_APP_API_ENDPOINT}/users/update-profile-img`,
                { url },
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              )
              .then(({ data }) => {
                let newUserAuth = {
                  ...userAuth,
                  profile_picture: data.profile_picture,
                };
                console.log("Updated userAuth:", newUserAuth); // ตรวจสอบข้อมูลที่เก็บใน userAuth

                storeInSession("user", JSON.stringify(newUserAuth));
                setUserAuth(newUserAuth);

                setUpdateProfileImg(null);

                toast.dismiss(loadingToast);
                if (e.currentTarget) {
                  e.currentTarget.removeAttribute("disabled");
                }

                toast.success("อัพโหลดแล้ว👍");
              })
              .catch(({ response }) => {
                toast.dismiss(loadingToast);
                if (e.currentTarget) {
                  e.currentTarget.removeAttribute("disabled");
                }
                toast.error(
                  response?.data?.error || "เกิดข้อผิดพลาดในการบันทึก URL"
                );
              });
            console.log("Uploaded Image URL:", url);
          }
        })
        .catch((err) => {
          console.error("Profile image upload failed:", err);
          toast.dismiss(loadingToast);
          if (e.currentTarget) {
            e.currentTarget.removeAttribute("disabled");
          }
          toast.error(`อัพโหลดรูปไม่สำเร็จ`);
        });
    }
  };
  const handleSumit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let form = new FormData(editProfileForm.current!);
    let formData: { [key: string]: FormDataEntryValue } = {};

    form.forEach((value, key) => {
      formData[key] = value;
    });
    let {
      fullname,
      bio,
      facebook,
      twitter,
      github,
      instagram,
      website,
      youtube,
    } = formData;

    if (typeof fullname === "string" && fullname.length < 3) {
      return toast.error("ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร");
    }

    if (typeof bio === "string" && bio.length > bioLimit) {
      return toast.error(`ไบโอต้องไม่เกิน ${bioLimit} ตัวอักษร`);
    }

    let loadingToast = toast.loading("กำลังอัปเดต...");
    const button = e.target as HTMLButtonElement;
    button.setAttribute("disabled", "true");

    axios
      .post(
        `${import.meta.env.REACT_APP_API_ENDPOINT}/users/update-profile`,
        {
          fullname,
          bio,
          social_links: {
            youtube,
            facebook,
            twitter,
            github,
            instagram,
            website,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        if (userAuth.fullname !== data.fullname) {
          let newUserAuth = { ...userAuth, fullname: data.fullname };

          storeInSession("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
        }

        toast.dismiss(loadingToast);
        button.removeAttribute("disabled");
        toast.success("โปรไฟล์อัปเดตแล้ว");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        button.removeAttribute("disabled");
        toast.error(response.data.error);
      });
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm} className="m-3">
          <Toaster />

          <h1 className="topic-editProfile fs-5 ">แก้ไขโปรไฟล์</h1>

          <div className="divinput">
            <div className="divlabel mb-3">
              <label
                htmlFor="uploadImg"
                id="profileImgLable"
                className="position-relative d-block rounded-circle overflow-hidden"
                style={{
                  width: "10rem",
                  height: "10rem",
                  background: "#f0f0f0",
                }}
              >
                <div className="w-100 h-100 position-absolute top-0 left-0 d-flex align-items-center justify-content-center imgDiv">
                  อัพโหลดรูปภาพ
                </div>
                <img ref={profileImgEle} src={profile_picture} alt="" />
              </label>

              <input
                type="file"
                id="uploadImg"
                accept=".jpeg, .png, .jpg"
                hidden
                onChange={handleImagePreview}
              />

              <button
                className="btn-light mt-3 btn-upload"
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                onClick={handleImageUpload}
              >
                อัปโหลด
              </button>

              {/* <p className="m-0 " style={{ color: "#494949" }}>
                กดอัปโหลดเพื่อเปลี่ยนรูปภาพ
              </p> */}
            </div>

            <div className="w-100">
              <div className="Inputbox-edit">
                <div>
                  <InputBox
                    type="text"
                    name="username"
                    value={profile_username}
                    placeholder="username"
                    disabled={true}
                    icon="CiAt"
                  />
                </div>

                <div>
                  <InputBox
                    name="email"
                    type="text"
                    value={email}
                    placeholder="อีเมล"
                    disabled={true}
                    icon="MdOutlineMail"
                  />
                </div>
              </div>

              <p
                className="m-0 "
                style={{ marginTop: "-0.75rem", color: "#494949" }}
              >
                ชื่อ
              </p>

              <InputBox
                name="fullname"
                type="text"
                value={fullname}
                placeholder="ชื่อ"
                icon="AiOutlineUser"
              />

              <p
                className="m-0 "
                style={{ marginTop: "-0.75rem", color: "#494949" }}
              >
                ไบโอ
              </p>
              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box textarea-editprofile"
                placeholder="ไบโอ"
                onChange={handleCharacterChange}
                style={{ margin: "0" }}
              ></textarea>

              <p className="mt-1" style={{ color: "#494949" }}>
                 ตัวอักษรคงเหลือ {charactersLeft}
              </p>

              <p className="my-4" style={{ color: "#494949" }}>
                เพิ่มบัญชีโซเชียลของคุณด้านล่าง
              </p>

              <div className="object-social">
                {Object.keys(social_links).map((key, i) => {
                  let link = social_links[key];

                  return (
                    <InputBox
                      key={i}
                      name={key}
                      type="text"
                      value={link}
                      placeholder="https://"
                      icon={`bi bi-${
                        key !== "website" ? key : "globe"
                      } hover:text-black`}
                    />
                  );
                })}
              </div>
              <button
                className="btn-dark w-auto px-3"
                type="submit"
                onClick={handleSumit}
              >
                อัปเดต
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;