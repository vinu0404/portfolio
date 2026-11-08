"use client";
// A single dot, no ring. It swells over links and becomes a "View" pill over [data-cursor="view"]. Fine pointers only.
import { useEffect, useRef, useState } from "react";
import { addTick } from "@/lib/ticker";

export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const p = { x: -100, y: -100 };
    const c = { x: -100, y: -100 };
    let mode = "";

    const onMove = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      const t = e.target as Element | null;
      const next = t?.closest("[data-cursor='view']") ? "view" : t?.closest("a,button,[role='button']") ? "link" : "";
      if (next !== mode && el.current) el.current.dataset.mode = mode = next;
    };
    const show = (v: string) => () => el.current && (el.current.style.opacity = v);
    const onLeave = show("0");
    const onEnter = show("1");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    const stop = addTick(() => {
      c.x += (p.x - c.x) * 0.35;
      c.y += (p.y - c.y) * 0.35;
      if (el.current) el.current.style.transform = `translate3d(${c.x}px,${c.y}px,0)`;
    });
    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[95]">
      <div ref={el} className="cursor" data-mode="">
        <span className="cursor-label">View</span>
      </div>
    </div>
  );
}
