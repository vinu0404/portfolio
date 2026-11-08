"use client";
// React Bits CountUp on Anime.js. Server-renders the final value so it is correct without JS.
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { easeOut, onEnterView, prefersReducedMotion } from "@/lib/motion";

export default function CountUp({ to, from = 0, duration = 1.6, className = "" }: {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) return;
    el.textContent = String(from);
    return onEnterView(el, () => {
      const o = { v: from };
      animate(o, {
        v: to,
        duration: duration * 1000,
        ease: easeOut,
        onUpdate: () => (el.textContent = String(Math.round(o.v))),
      });
    });
  }, [to, from, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {to}
    </span>
  );
}
