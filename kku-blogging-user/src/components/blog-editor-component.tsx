import { Link, useNavigate, useParams } from "react-router-dom";
import logoKKU from "../pic/logo-head.jpg";
import "../misc/blogEdit.css";
import { uploadImage } from "../common/b2";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../components/tools.component";
import { UserContext } from "../App";
import AnimationWrapper from "../Screens/page-animation";
import { EditorContext } from "../Screens/editor-page";
import axios from "axios";
import { LuImagePlus, LuTrash2 } from "react-icons/lu";
import PublishDialog, { CHARACTER_LIMIT } from "./editor/PublishDialog";
import { Button } from "./ui/Button";
import Breadcrumb from "./ui/Breadcrumb";
import { cn } from "./ui/cn";
import "../misc/publish-form.css";

/**
 * หน้าเขียนบล็อก — พื้นที่เขียนกลางจอแบบเรียบ ๆ (ภาพปก · ชื่อ · เนื้อหา)
 * คำอธิบาย / แท็ก / ใครเห็นได้ ย้ายไปอยู่ในหน้าต่าง "เผยแพร่"
 */
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
  const [publishOpen, setPublishOpen] = useState(false);

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
          placeholder: "เริ่มเขียนเรื่องราวของคุณที่นี่… (กด Tab เพื่อเพิ่มหัวข้อ รูปภาพ หรือรายการ)",
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

  const requireTitle = (message: string) => {
    if (topic.trim().length) return true;
    titleRef.current?.focus();
    toast.error(message);
    return false;
  };

  const saveBlog = (draft: boolean) => {
    if (busy || !textEditor?.isReady) return;
    if (!requireTitle(draft ? "เขียนชื่อบล็อกก่อนบันทึกฉบับร่าง" : "เขียนชื่อบล็อกก่อนเผยแพร่")) return;
    if (!draft) {
      if (!banner.length) return toast.error("เพิ่มภาพปกก่อนเผยแพร่");
      if (!des.length || des.length > CHARACTER_LIMIT) {
        return toast.error(`เขียนคำอธิบายไม่เกิน ${CHARACTER_LIMIT} ตัวอักษรก่อนเผยแพร่`);
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

  const openPublish = () => {
    if (requireTitle("เขียนชื่อบล็อกก่อนเผยแพร่")) setPublishOpen(true);
  };
  const closePublish = useCallback(() => setPublishOpen(false), []);

  return (
    <div className="tw:min-h-screen tw:bg-white">
      <Toaster position="top-center" toastOptions={{ style: { zIndex: 60 } }} />

      {/* แถบบน */}
      <div className="tw:sticky tw:top-0 tw:z-30 tw:bg-white/90 tw:backdrop-blur">
        <div className="tw:mx-auto tw:flex tw:h-16 tw:max-w-6xl tw:items-center tw:gap-3 tw:px-4 tw:md:px-8">
          <Link to="/homepage" className="tw:hidden tw:shrink-0 tw:sm:block">
            <img src={logoKKU} alt="KKU Blogging Platform" className="tw:block tw:h-8 tw:w-auto" />
          </Link>
          {/* ใช้ breadcrumb แทนปุ่มย้อนกลับ — บอกด้วยว่ากำลังเขียนใหม่หรือแก้ไข */}
          <Breadcrumb
            className="tw:m-0"
            items={
              blog_id
                ? [
                    { label: "แดชบอร์ด", to: "/dashboard/blogs" },
                    { label: "บล็อก", to: "/dashboard/blogs" },
                    { label: "แก้ไขบล็อก" },
                  ]
                : [{ label: "เขียนบล็อกใหม่" }]
            }
          />

          <div className="tw:ml-auto tw:flex tw:shrink-0 tw:items-center tw:gap-2">
            <Button variant="ghost" disabled={!!busy} onClick={() => saveBlog(true)}>
              {busy === "draft" ? "กำลังบันทึก…" : "บันทึกร่าง"}
            </Button>
            <Button disabled={!!busy} onClick={openPublish}>
              เผยแพร่
            </Button>
          </div>
        </div>
      </div>

      <AnimationWrapper>
        {/* พื้นที่เขียน — กลางจอ เว้นซ้ายไว้ให้ปุ่ม + ของ Editor.js */}
        <div className="tw:mx-auto tw:max-w-3xl tw:px-5 tw:pt-8 tw:pb-24 tw:md:px-16 tw:md:pt-14">
          <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />

          {banner ? (
            <div className="tw:group tw:relative tw:mb-10 tw:aspect-[2/1] tw:overflow-hidden tw:rounded-2xl tw:bg-surface">
              <img src={banner} alt="ภาพปก" className="tw:size-full tw:object-cover" />
              <div className="tw:absolute tw:right-3 tw:bottom-3 tw:flex tw:gap-2 tw:opacity-0 tw:transition-opacity tw:group-hover:opacity-100 tw:focus-within:opacity-100">
                <label
                  htmlFor="uploadBanner"
                  className="tw:mb-0 tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-1.5 tw:rounded-full tw:bg-white/90 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-ink tw:shadow-sm tw:hover:bg-white"
                >
                  <LuImagePlus className="tw:size-3.5" /> เปลี่ยนภาพ
                </label>
                <button
                  type="button"
                  onClick={() => setBlog({ ...blog, banner: "" })}
                  className="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-1.5 tw:rounded-full tw:bg-white/90 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-rose-600 tw:shadow-sm tw:hover:bg-white"
                >
                  <LuTrash2 className="tw:size-3.5" /> ลบ
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="uploadBanner"
              className="tw:mb-4 tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-2 tw:rounded-full tw:px-3 tw:py-1.5 tw:-ml-3 tw:text-sm tw:text-muted tw:transition-colors tw:hover:bg-primary-soft tw:hover:text-primary-strong"
            >
              <LuImagePlus className="tw:size-4" /> เพิ่มภาพปก
            </label>
          )}

          <textarea
            ref={titleRef}
            rows={1}
            value={topic}
            onChange={(e) => setBlog({ ...blog, topic: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            placeholder="ชื่อบล็อก"
            className="tw:block tw:w-full tw:resize-none tw:overflow-hidden tw:border-0 tw:bg-transparent tw:p-0 tw:text-4xl tw:leading-tight tw:font-bold tw:tracking-tight tw:text-ink tw:outline-none tw:placeholder:text-ink/20 tw:md:text-5xl"
          />

          {/* Editor.js — ชิดซ้ายตามชื่อบล็อก ตัวอักษรใหญ่อ่านสบาย */}
          <div
            id="textEditor"
            className={cn(
              "tw:mt-6 tw:text-lg tw:text-ink",
              "tw:[&_.ce-block__content]:max-w-none tw:[&_.ce-toolbar__content]:max-w-none",
              "tw:[&_.ce-paragraph]:leading-[1.85] tw:[&_[class*=redactor]]:pb-20",
              "tw:[&_.ce-header]:font-semibold tw:[&_.ce-header]:tracking-tight",
              "tw:[&_.cdx-quote__text]:min-h-0 tw:[&_.cdx-quote__text]:border-0 tw:[&_.cdx-quote__text]:border-l-4 tw:[&_.cdx-quote__text]:border-primary-pastel tw:[&_.cdx-quote__text]:rounded-none tw:[&_.cdx-quote__text]:shadow-none tw:[&_.cdx-quote__text]:pl-4 tw:[&_.cdx-quote__text]:italic",
              "tw:[&_.image-tool\\_\\_image]:rounded-xl tw:[&_.image-tool\\_\\_image]:overflow-hidden"
            )}
          />
        </div>
      </AnimationWrapper>

      {publishOpen && (
        <PublishDialog
          visibility={visibility}
          onVisibilityChange={setVisibility}
          onBannerUpload={handleBannerUpload}
          onPublish={() => saveBlog(false)}
          onClose={closePublish}
          busy={busy === "publish"}
        />
      )}
    </div>
  );
};

export default BlogEditor;
