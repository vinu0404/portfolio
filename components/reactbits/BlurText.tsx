"use client";
// React Bits BlurText on Anime.js: words resolve from blur as they enter the viewport.
import { useEffect, useRef } from "react";
import { animate, splitText, stagger } from "animejs";
import { easeOut, onEnterView, prefersReducedMotion } from "@/lib/motion";

export default function BlurText({
  text,
  className = "",
  delay = 40,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current!;
    return onEnterView(el, () => {
      if (prefersReducedMotion()) {
        animate(el, { opacity: [0, 1], duration: 600 });
        return;
      }
      const { words } = splitText(el, { words: true });
      el.style.opacity = "1";
      animate(words, {
        opacity: [0, 1],
        filter: ["blur(10px)", "blur(0px)"],
        y: [12, 0],
        duration: 900,
        ease: easeOut,
        delay: stagger(delay),
      });
    });
  }, [delay]);

  return (
    <p ref={ref} className={className} data-reveal="">
      {text}
    </p>
  );
}
