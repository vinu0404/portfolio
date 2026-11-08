"use client";
import { cubicBezier } from "animejs";

// One easing language for the whole site (mirrored as CSS vars in globals.css).
export const easeOut = cubicBezier(0.22, 1, 0.36, 1);
export const easeInOut = cubicBezier(0.65, 0, 0.35, 1);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Resolves once the preloader has finished (or immediately when it was skipped / already seen). */
let resolveIntro: () => void = () => {};
export const introDone =
  typeof window === "undefined" ? Promise.resolve() : new Promise<void>((r) => (resolveIntro = r));
export const finishIntro = () => resolveIntro();

/** Fires `cb` once when `el` enters the viewport. Returns a cleanup. */
export function onEnterView(el: Element, cb: () => void, rootMargin = "0px 0px -12% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
