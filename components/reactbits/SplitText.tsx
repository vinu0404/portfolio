"use client";
// React Bits SplitText, ported to Anime.js splitText so it shares the site's single motion engine.
import { createElement, useEffect, useRef } from "react";
import { animate, splitText, stagger } from "animejs";
import { easeOut, introDone, onEnterView, prefersReducedMotion } from "@/lib/motion";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  splitType?: "chars" | "words";
  /** stagger between pieces, ms */
  delay?: number;
  duration?: number;
  startDelay?: number;
  /** wait for the preloader instead of the viewport */
  afterIntro?: boolean;
  id?: string;
};

export default function SplitText({
  text,
  as = "p",
  className = "",
  splitType = "words",
  delay = 60,
  duration = 1000,
  startDelay = 0,
  afterIntro = false,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let cancelled = false;
    let cleanup = () => {};
    const reduced = prefersReducedMotion();

    const run = () => {
      if (cancelled) return;
      if (reduced) {
        animate(el, { opacity: [0, 1], duration: 500, delay: startDelay });
        return;
      }
      const split = splitText(el, splitType === "chars" ? { chars: { wrap: "clip" } } : { words: { wrap: "clip" } });
      const pieces = splitType === "chars" ? split.chars : split.words;
      el.style.opacity = "1";
      animate(pieces, {
        y: ["110%", "0%"],
        rotate: [splitType === "chars" ? 6 : 2, 0],
        duration,
        ease: easeOut,
        delay: stagger(delay, { start: startDelay }),
      });
    };

    if (afterIntro) introDone.then(run);
    else cleanup = onEnterView(el, run);
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [afterIntro, delay, duration, splitType, startDelay]);

  return createElement(as, { ref, id, className, "data-reveal": "" }, text);
}
