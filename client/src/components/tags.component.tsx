import { useContext } from "react";
import { MdClose } from "react-icons/md";
import { EditorContext } from "../Screens/editor-page";
import { pastelFor } from "./ui/colors";
import { cn } from "./ui/cn";
import type { TagProps } from "../types/blog";

/** แท็กในหน้าเขียนบล็อก — คลิกเพื่อแก้ชื่อ (Enter เพื่อยืนยัน) · กด × เพื่อลบ */
const Tag: React.FC<TagProps> = ({ tag, tagIndex }) => {
  const context = useContext(EditorContext);
  if (!context) return null;

  const {
    blog,
    blog: { tags },
    setBlog,
  } = context;

  const handleTagEdit = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const currentTag = e.currentTarget.innerText.trim();
      const next = [...tags];
      if (currentTag) next[tagIndex] = currentTag;
      else next.splice(tagIndex, 1);
      setBlog({ ...blog, tags: next });
      e.currentTarget.setAttribute("contentEditable", "false");
    }
  };

  const addEditable = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.setAttribute("contentEditable", "true");
    e.currentTarget.focus();
  };

  const handleTagDelete = () => {
    setBlog({ ...blog, tags: tags.filter((t) => t !== tag) });
  };

  return (
    <span
      className={cn(
        "tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:py-1 tw:pr-1 tw:pl-3 tw:text-sm tw:font-medium",
        pastelFor(tag)
      )}
    >
      <span
        title="คลิกเพื่อแก้ไข"
        className="tw:cursor-text tw:outline-none"
        onKeyDown={handleTagEdit}
        onClick={addEditable}
      >
        {tag}
      </span>
      <button
        type="button"
        aria-label={`ลบแท็ก ${tag}`}
        onClick={handleTagDelete}
        className="tw:grid tw:size-5 tw:cursor-pointer tw:place-items-center tw:rounded-full tw:bg-transparent tw:opacity-60 tw:transition tw:hover:opacity-100 tw:hover:bg-white/60"
      >
        <MdClose className="tw:size-3.5" />
      </button>
    </span>
  );
};

export default Tag;
