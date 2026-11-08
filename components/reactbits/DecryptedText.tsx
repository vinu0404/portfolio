"use client";
// React Bits DecryptedText: characters settle from noise, left to right, when they enter the viewport.
import { useEffect, useRef } from "react";
import { addTick } from "@/lib/ticker";
import { onEnterView, prefersReducedMotion } from "@/lib/motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_";

export default function DecryptedText({ text, className = "", speed = 28 }: {
  text: string;
  className?: string;
  /** ms per settled character */
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    let stop = () => {};
    const unobserve = onEnterView(el, () => {
      const start = performance.now();
      stop = addTick((t) => {
        const settled = Math.floor((t - start) / speed);
        el.textContent = text
          .split("")
          .map((c, i) => (i < settled || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("");
        if (settled >= text.length) stop();
      });
    });
    return () => {
      unobserve();
      stop();
    };
  }, [text, speed]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
