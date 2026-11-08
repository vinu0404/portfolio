"use client";
// React Bits Magnet on Anime.js createAnimatable: the child leans toward the pointer.
import { useEffect, useRef } from "react";
import { createAnimatable } from "animejs";
import { prefersReducedMotion } from "@/lib/motion";

export default function Magnet({
  children,
  padding = 60,
  strength = 3,
  className = "",
}: {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const a = createAnimatable(inner.current!, { x: 500, y: 500, ease: "out(3)" });
    const onMove = (e: PointerEvent) => {
      const r = wrap.current!.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const near =
        Math.abs(e.clientX - cx) < r.width / 2 + padding && Math.abs(e.clientY - cy) < r.height / 2 + padding;
      a.x(near ? (e.clientX - cx) / strength : 0);
      a.y(near ? (e.clientY - cy) / strength : 0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      a.revert();
    };
  }, [padding, strength]);

  return (
    <div ref={wrap} className={`inline-block ${className}`}>
      <div ref={inner} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
