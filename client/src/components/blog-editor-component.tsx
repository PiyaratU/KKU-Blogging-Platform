import { Link, useNavigate, useParams } from "react-router-dom";
import logoKKU from "../pic/logo-head.jpg";
import "../misc/blogEdit.css";
import { uploadImage } from "../common/b2";
import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../components/tools.component";
import { UserContext } from "../App";
import AnimationWrapper from "../Screens/page-animation";
import { EditorContext } from "../Screens/editor-page";
import axios from "axios";
import { LuImagePlus, LuArrowLeft } from "react-icons/lu";
import VisibilitySelector from "./visibility-selector.component";
import Tag from "./tags.component";
import { Button } from "./ui/Button";
import { cn } from "./ui/cn";
import "../misc/publish-form.css";

const CHARACTER_LIMIT = 200;
const TAG_LIMIT = 10;

/** กล่องหัวข้อในแผงตั้งค่า */
const Field = ({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) => (
  <div>
    <div className="tw:mb-2 tw:flex tw:items-baseline tw:justify-between tw:gap-2">
      <p className="tw:m-0 tw:text-sm tw:font-medium tw:text-ink">{label}</p>
      {hint && <span className="tw:text-xs tw:text-muted">{hint}</span>}
    </div>
    {children}
  </div>
);

const inputClass =
  "tw:w-full tw:rounded-xl tw:border tw:border-line tw:bg-surface tw:px-3.5 tw:py-2.5 tw:text-sm tw:text-ink tw:outline-none tw:transition-colors tw:placeholder:text-muted/70 tw:focus:border-primary tw:focus:bg-white";

const BlogEditor = () => {
  const API_URL =
    import.meta.env.REACT_APP_API_ENDPOINT ||
    "https://kku-blog-server-ak2l.onrender.com";
  const editorContext = useContext(EditorContext);
  const { blog_id } = useParams();
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const navigate = useNavigate();
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [busy, setBusy] = useState<"draft" | "publish" | null>(null);

  if (!editorContext) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }

  const {
    blog,
    blog: { topic, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
  } = editorContext;

  const [visibility, setVisibility] = useState(blog.visibility || "public");

  useEffect(() => {
    if (!textEditor?.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "เริ่มเขียนเรื่องราวของคุณที่นี่…",
        })
      );
    }
  }, []);

  // ปรับความสูงช่องชื่อบล็อกให้พอดีข้อความ (รวมตอนเปิดบล็อกเดิมมาแก้)
  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [topic]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    const loadingToast = toast.loading("กำลังอัปโหลดภาพปก...");
    uploadImage(img)
      .then((url) => {
        toast.dismiss(loadingToast);
        if (url) {
          toast.success("อัปโหลดแล้ว");
          setBlog({ ...blog, banner: url });
        }
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error(err.message || "อัปโหลดภาพไม่สำเร็จ");
      });
    e.target.value = "";
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBlog({ ...blog, topic: e.target.value });
  };

  const preventEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const tag = e.currentTarget.value.trim();
    if (!tag) return;
    if (tags.length >= TAG_LIMIT) {
      toast.error(`เพิ่มแท็กได้สูงสุด ${TAG_LIMIT} แท็ก`);
    } else if (tags.includes(tag)) {
      toast.error("มีแท็กนี้แล้ว");
    } else {
      setBlog({ ...blog, tags: [...tags, tag] });
    }
    e.currentTarget.value = "";
  };

  const saveBlog = (draft: boolean) => {
    if (busy || !textEditor?.isReady) return;

    if (!topic.trim().length) {
      titleRef.current?.focus();
      return toast.error(draft ? "เขียนชื่อบล็อกก่อนบันทึกฉบับร่าง" : "เขียนชื่อบล็อกก่อนเผยแพร่");
    }
    if (!draft) {
      if (!banner.length) return toast.error("อัปโหลดภาพปกก่อนเผยแพร่");
      if (!des.length || des.length > CHARACTER_LIMIT) {
        return toast.error(`เขียนคำอธิบายบล็อกไม่เกิน ${CHARACTER_LIMIT} ตัวอักษรก่อนเผยแพร่`);
      }
      if (!tags.length) return toast.error("ใส่อย่างน้อย 1 แท็ก เพื่อให้คนค้นเจอบล็อกของคุณ");
    }

    setBusy(draft ? "draft" : "publish");
    const loadingToast = toast.loading(draft ? "กำลังบันทึกฉบับร่าง..." : "กำลังเผยแพร่...");

    textEditor
      .save()
      .then((content) => {
        if (!draft && !content.blocks.length) {
          throw { response: { data: { error: "เขียนเนื้อหาบล็อกก่อนเผยแพร่" } } };
        }
        return axios.post(
          API_URL + "/create-blog",
          { topic, banner, des, content, tags, draft, visibility, id: blog_id },
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
      })
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success(draft ? "บันทึกแล้ว" : "เผยแพร่แล้ว");
        setTimeout(() => navigate(draft ? "/dashboard/blogs?tab=draft" : "/homepage"), 500);
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error(err?.response?.data?.error || "เกิดข้อผิดพลาด ลองอีกครั้ง");
        setBusy(null);
      });
  };

  const charsLeft = CHARACTER_LIMIT - des.length;

  return (
    <div className="tw:min-h-screen tw:bg-white">
      <Toaster position="top-center" />

      {/* แถบบน */}
      <div className="tw:sticky tw:top-0 tw:z-30 tw:border-b tw:border-line tw:bg-white/90 tw:backdrop-blur">
        <div className="tw:mx-auto tw:flex tw:h-16 tw:max-w-6xl tw:items-center tw:gap-3 tw:px-4 tw:md:px-8">
          <Link
            to="/homepage"
            aria-label="กลับหน้าแรก"
            className="tw:grid tw:size-9 tw:shrink-0 tw:place-items-center tw:rounded-full tw:text-ink-soft tw:transition-colors tw:hover:bg-surface tw:hover:text-ink"
          >
            <LuArrowLeft className="tw:size-5" />
          </Link>
          <Link to="/homepage" className="tw:hidden tw:shrink-0 tw:sm:block">
            <img src={logoKKU} alt="KKU Blogging Platform" className="tw:block tw:h-8 tw:w-auto" />
          </Link>
          <span className="tw:hidden tw:h-5 tw:w-px tw:bg-line tw:md:block" />
          <p className="tw:m-0 tw:hidden tw:min-w-0 tw:truncate tw:text-sm tw:text-muted tw:md:block">
            {blog_id ? "แก้ไขบล็อก" : "บล็อกใหม่"}
            {topic.trim() && <span className="tw:text-ink-soft"> · {topic}</span>}
          </p>

          <div className="tw:ml-auto tw:flex tw:shrink-0 tw:items-center tw:gap-2">
            <Button variant="secondary" disabled={!!busy} onClick={() => saveBlog(true)}>
              {busy === "draft" ? "กำลังบันทึก…" : "บันทึกร่าง"}
            </Button>
            <Button disabled={!!busy} onClick={() => saveBlog(false)}>
              {busy === "publish" ? "กำลังเผยแพร่…" : "เผยแพร่"}
            </Button>
          </div>
        </div>
      </div>

      <AnimationWrapper>
        <div className="tw:mx-auto tw:grid tw:max-w-6xl tw:gap-10 tw:px-4 tw:pt-8 tw:pb-24 tw:md:px-8 tw:lg:grid-cols-[minmax(0,1fr)_320px] tw:lg:gap-14">
          {/* พื้นที่เขียน */}
          <div className="tw:min-w-0 tw:md:pl-14">
            <label
              htmlFor="uploadBanner"
              className={cn(
                "tw:group tw:relative tw:block tw:aspect-[2/1] tw:cursor-pointer tw:overflow-hidden tw:rounded-2xl",
                !banner && "tw:border-2 tw:border-dashed tw:border-primary-pastel tw:bg-primary-soft tw:transition-colors tw:hover:border-primary"
              )}
            >
              {banner ? (
                <>
                  <img src={banner} alt="ภาพปก" className="tw:size-full tw:object-cover" />
                  <span className="tw:absolute tw:inset-0 tw:grid tw:place-items-center tw:bg-black/0 tw:transition-colors tw:group-hover:bg-black/30">
                    <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-ink tw:opacity-0 tw:shadow-sm tw:transition-opacity tw:group-hover:opacity-100">
                      <LuImagePlus className="tw:size-4" />
                      เปลี่ยนภาพปก
                    </span>
                  </span>
                </>
              ) : (
                <span className="tw:absolute tw:inset-0 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:text-center">
                  <span className="tw:grid tw:size-12 tw:place-items-center tw:rounded-full tw:bg-white tw:text-primary-strong tw:shadow-sm">
                    <LuImagePlus className="tw:size-6" />
                  </span>
                  <span className="tw:text-sm tw:font-medium tw:text-primary-strong">เพิ่มภาพปก</span>
                  <span className="tw:text-xs tw:text-muted">PNG หรือ JPG · แนะนำแนวนอน 2:1</span>
                </span>
              )}
              <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
            </label>

            <textarea
              ref={titleRef}
              rows={1}
              value={topic}
              onChange={handleTitleChange}
              onKeyDown={preventEnter}
              placeholder="ชื่อบล็อก"
              className="tw:mt-8 tw:block tw:w-full tw:resize-none tw:overflow-hidden tw:border-0 tw:bg-transparent tw:p-0 tw:text-3xl tw:leading-tight tw:font-bold tw:text-ink tw:outline-none tw:placeholder:text-ink/25 tw:md:text-4xl"
            />

            <div className="tw:my-6 tw:h-px tw:bg-line" />

            {/* Editor.js — ปรับให้ชิดซ้ายตามชื่อบล็อก และตัวอักษรอ่านง่าย */}
            <div
              id="textEditor"
              className={cn(
                "tw:text-lg tw:text-ink",
                "tw:[&_.ce-block__content]:max-w-none tw:[&_.ce-toolbar__content]:max-w-none",
                "tw:[&_.ce-paragraph]:leading-[1.8] tw:[&_[class*=redactor]]:pb-20"
              )}
            />
          </div>

          {/* แผงตั้งค่า */}
          <aside className="tw:lg:sticky tw:lg:top-24 tw:lg:self-start">
            <div className="tw:space-y-6 tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:p-5 tw:lg:bg-surface/60">
              <div>
                <p className="tw:m-0 tw:text-xs tw:text-muted">ก่อนเผยแพร่</p>
                <h2 className="tw:mt-0.5 tw:mb-0 tw:text-lg tw:font-semibold tw:text-ink">ตั้งค่าบล็อก</h2>
              </div>

              <Field label="ใครเห็นโพสต์นี้ได้">
                <VisibilitySelector visibility={visibility} onChange={setVisibility} />
              </Field>

              <Field
                label="คำอธิบายสั้น ๆ"
                hint={<span className={cn(charsLeft < 20 && "tw:text-rose-500")}>{charsLeft}</span>}
              >
                <textarea
                  rows={4}
                  maxLength={CHARACTER_LIMIT}
                  value={des}
                  onChange={(e) => setBlog({ ...blog, des: e.target.value })}
                  onKeyDown={preventEnter}
                  placeholder="สรุปให้คนอ่านรู้ว่าจะได้อะไรจากบล็อกนี้"
                  className={cn(inputClass, "tw:block tw:resize-none tw:leading-relaxed")}
                />
              </Field>

              <Field label="แท็ก" hint={`${tags.length}/${TAG_LIMIT}`}>
                <input
                  type="text"
                  placeholder="พิมพ์แล้วกด Enter"
                  onKeyDown={handleTagKeyDown}
                  disabled={tags.length >= TAG_LIMIT}
                  className={inputClass}
                />
                {tags.length > 0 ? (
                  <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">
                    {tags.map((tag, i) => (
                      <Tag tag={tag} tagIndex={i} key={tag + i} />
                    ))}
                  </div>
                ) : (
                  <p className="tw:mt-2 tw:mb-0 tw:text-xs tw:text-muted">แท็กช่วยให้คนค้นเจอบล็อกของคุณ เช่น การเรียน, ร้านกาแฟ</p>
                )}
              </Field>
            </div>
          </aside>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default BlogEditor;
