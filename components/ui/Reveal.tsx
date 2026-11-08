"use client";
// Slight rise + fade (cards) or mask reveal (media) on entering the viewport.
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { easeOut, onEnterView, prefersReducedMotion } from "@/lib/motion";

export default function Reveal({
  children,
  className = "",
  variant = "rise",
  stagger: gap = 70,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "rise" | "mask" | "children";
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const ref = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const targets = variant === "children" ? Array.from(el.children) : [el];
    if (variant === "children") el.style.opacity = "1";
    targets.forEach((t) => ((t as HTMLElement).style.opacity = "0"));
    return onEnterView(el, () => {
      const reduced = prefersReducedMotion();
      if (reduced) {
        animate(targets, { opacity: [0, 1], duration: 500, delay: stagger(gap) });
        return;
      }
      animate(targets, {
        opacity: [0, 1],
        ...(variant === "mask"
          ? { clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] }
          : { y: [32, 0] }),
        duration: 1000,
        ease: easeOut,
        delay: stagger(gap),
      });
    });
  }, [variant, gap]);

  return (
    <Tag ref={ref} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
