import { useEffect, useRef, useState } from "react";
import React from "react";
import { cn } from "./ui/cn";
import type { InPageNavigationProps } from "../types/ui";

export const activeTabLineRef = React.createRef<HTMLHRElement>();
export const activeTabRef = React.createRef<HTMLButtonElement>();

/** แท็บในหน้า — เส้นใต้เลื่อนตามแท็บที่เลือก · defaultHidden = แท็บที่โชว์เฉพาะจอเล็ก */
const InPageNavigation: React.FC<InPageNavigationProps> = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) => {
  const activeTabLineRef = useRef<HTMLSpanElement>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn: HTMLButtonElement, i: number) => {
    const { offsetWidth, offsetLeft } = btn;
    if (activeTabLineRef.current) {
      activeTabLineRef.current.style.width = offsetWidth + "px";
      activeTabLineRef.current.style.left = offsetLeft + "px";
    }
    setInPageNavIndex(i);
  };

  useEffect(() => {
    if (activeTabRef.current) {
      changePageState(activeTabRef.current, defaultActiveIndex);
    }
  }, [defaultActiveIndex]);

  return (
    <>
      <div role="tablist" className="tw:relative tw:mb-2 tw:flex tw:flex-nowrap tw:overflow-x-auto tw:border-b tw:border-line tw:bg-white">
        {routes.map((route, i) => (
          <button
            type="button"
            role="tab"
            aria-selected={inPageNavIndex === i}
            ref={i === defaultActiveIndex ? activeTabRef : null}
            key={i}
            className={cn(
              "tw:shrink-0 tw:border-0 tw:bg-transparent tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:capitalize tw:transition-colors tw:cursor-pointer",
              inPageNavIndex === i ? "tw:text-primary-strong" : "tw:text-muted tw:hover:text-ink",
              defaultHidden.includes(route) && "tw:md:hidden"
            )}
            onClick={(e) => changePageState(e.currentTarget, i)}
          >
            {route}
          </button>
        ))}
        <span
          ref={activeTabLineRef}
          aria-hidden="true"
          className="tw:absolute tw:bottom-0 tw:h-0.5 tw:rounded-full tw:bg-violet-300 tw:transition-all tw:duration-300"
        />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
