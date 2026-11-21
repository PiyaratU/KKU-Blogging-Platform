import { useContext, useEffect, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { LuImagePlus, LuX } from "react-icons/lu";
import { EditorContext } from "../../Screens/editor-page";
import VisibilitySelector from "../visibility-selector.component";
import Tag from "../tags.component";
import { Button } from "../ui/Button";
import { cn } from "../ui/cn";

export const CHARACTER_LIMIT = 200;
export const TAG_LIMIT = 10;

const inputClass =
  "tw:w-full tw:rounded-xl tw:border tw:border-line tw:bg-surface tw:px-3.5 tw:py-2.5 tw:text-sm tw:text-ink tw:outline-none tw:transition-colors tw:placeholder:text-muted/70 tw:focus:border-primary tw:focus:bg-white";

const Field = ({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) => (
  <div>
    <div className="tw:mb-2 tw:flex tw:items-baseline tw:justify-between tw:gap-2">
      <p className="tw:m-0 tw:text-sm tw:font-medium tw:text-ink">{label}</p>
      {hint && <span className="tw:text-xs tw:text-muted">{hint}</span>}
    </div>
    {children}
  </div>
);

type PublishDialogProps = {
  visibility: string;
  onVisibilityChange: (v: "public" | "followers") => void;
  onBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPublish: () => void;
  onClose: () => void;
  busy: boolean;
};

/** ขั้นตอนเผยแพร่ — ตัวอย่างการ์ดบล็อก + คำอธิบาย / แท็ก / ใครเห็นได้ */
const PublishDialog = ({ visibility, onVisibilityChange, onBannerUpload, onPublish, onClose, busy }: PublishDialogProps) => {
  const context = useContext(EditorContext);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [busy, onClose]);

  if (!context) return null;
  const {
    blog,
    blog: { topic, banner, des, tags },
    setBlog,
  } = context;

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const tag = e.currentTarget.value.trim();
    if (!tag) return;
    if (tags.length >= TAG_LIMIT) toast.error(`เพิ่มแท็กได้สูงสุด ${TAG_LIMIT} แท็ก`);
    else if (tags.includes(tag)) toast.error("มีแท็กนี้แล้ว");
    else setBlog({ ...blog, tags: [...tags, tag] });
    e.currentTarget.value = "";
  };

  const charsLeft = CHARACTER_LIMIT - des.length;

  return (
    <div
      className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-end tw:justify-center tw:bg-ink/30 tw:backdrop-blur-sm tw:sm:items-center tw:sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-title"
        className="tw:relative tw:max-h-[92vh] tw:w-full tw:max-w-4xl tw:overflow-y-auto tw:rounded-t-3xl tw:bg-white tw:shadow-2xl tw:sm:rounded-3xl"
      >
        <button
          type="button"
          aria-label="ปิด"
          onClick={onClose}
          disabled={busy}
          className="tw:absolute tw:top-4 tw:right-4 tw:z-10 tw:grid tw:size-9 tw:cursor-pointer tw:place-items-center tw:rounded-full tw:bg-white/80 tw:text-ink-soft tw:transition-colors tw:hover:bg-surface tw:hover:text-ink"
        >
          <LuX className="tw:size-5" />
        </button>

        <div className="tw:grid tw:md:grid-cols-2">
          {/* ตัวอย่าง */}
          <div className="tw:bg-primary-soft/60 tw:p-6 tw:md:p-8">
            <p className="tw:m-0 tw:text-xs tw:font-medium tw:uppercase tw:tracking-wider tw:text-muted">ตัวอย่างการ์ดบล็อก</p>
            <label
              htmlFor="publishBanner"
              className={cn(
                "tw:group tw:relative tw:mt-4 tw:block tw:aspect-video tw:cursor-pointer tw:md:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl",
                banner ? "tw:bg-surface" : "tw:border-2 tw:border-dashed tw:border-primary-pastel tw:bg-white"
              )}
            >
              {banner ? (
                <>
                  <img src={banner} alt="" className="tw:size-full tw:object-cover" />
                  <span className="tw:absolute tw:right-3 tw:bottom-3 tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-full tw:bg-white/90 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-ink tw:opacity-0 tw:shadow-sm tw:transition-opacity tw:group-hover:opacity-100">
                    <LuImagePlus className="tw:size-3.5" /> เปลี่ยนภาพปก
                  </span>
                </>
              ) : (
                <span className="tw:absolute tw:inset-0 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:text-center">
                  <LuImagePlus className="tw:size-7 tw:text-primary-strong" />
                  <span className="tw:text-sm tw:font-medium tw:text-primary-strong">เพิ่มภาพปก</span>
                  <span className="tw:text-xs tw:text-muted">ต้องมีภาพปกก่อนเผยแพร่</span>
                </span>
              )}
              <input id="publishBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={onBannerUpload} />
            </label>
            <h3 className="tw:mt-5 tw:mb-0 tw:line-clamp-2 tw:text-xl tw:font-semibold tw:leading-snug tw:text-ink">
              {topic || <span className="tw:text-muted">ยังไม่มีชื่อบล็อก</span>}
            </h3>
            <p className="tw:mt-2 tw:mb-0 tw:line-clamp-3 tw:text-sm tw:leading-relaxed tw:text-muted">
              {des || "คำอธิบายสั้น ๆ จะแสดงตรงนี้ ใต้ชื่อบล็อกในหน้าแรก"}
            </p>
          </div>

          {/* ตั้งค่า */}
          <div className="tw:flex tw:flex-col tw:gap-6 tw:p-6 tw:md:p-8">
            <div>
              <h2 id="publish-title" className="tw:m-0 tw:text-2xl tw:font-semibold tw:text-ink">
                พร้อมเผยแพร่แล้ว?
              </h2>
              <p className="tw:mt-1 tw:mb-0 tw:text-sm tw:text-muted">เพิ่มรายละเอียดอีกนิด ให้คนค้นเจอและอยากกดอ่าน</p>
            </div>

            <Field
              label="คำอธิบายสั้น ๆ"
              hint={<span className={cn(charsLeft < 20 && "tw:text-rose-500")}>เหลือ {charsLeft}</span>}
            >
              <textarea
                rows={3}
                maxLength={CHARACTER_LIMIT}
                value={des}
                onChange={(e) => setBlog({ ...blog, des: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                placeholder="สรุปให้คนอ่านรู้ว่าจะได้อะไรจากบล็อกนี้"
                className={cn(inputClass, "tw:block tw:resize-none tw:leading-relaxed")}
              />
            </Field>

            <Field label="แท็ก" hint={`${tags.length}/${TAG_LIMIT}`}>
              <input
                type="text"
                placeholder="พิมพ์แล้วกด Enter เช่น การเรียน, ร้านกาแฟ"
                onKeyDown={handleTagKeyDown}
                disabled={tags.length >= TAG_LIMIT}
                className={inputClass}
              />
              {tags.length > 0 && (
                <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">
                  {tags.map((tag, i) => (
                    <Tag tag={tag} tagIndex={i} key={tag + i} />
                  ))}
                </div>
              )}
            </Field>

            <Field label="ใครเห็นโพสต์นี้ได้">
              <VisibilitySelector visibility={visibility} onChange={onVisibilityChange} />
            </Field>

            <div className="tw:mt-auto tw:flex tw:justify-end tw:gap-2 tw:border-t tw:border-line tw:pt-5">
              <Button variant="ghost" onClick={onClose} disabled={busy}>
                ยกเลิก
              </Button>
              <Button onClick={onPublish} disabled={busy}>
                {busy ? "กำลังเผยแพร่…" : "เผยแพร่ตอนนี้"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishDialog;
