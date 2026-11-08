"use client";
import type Lenis from "lenis";

/** Written by the Lenis scroll event (or native scroll when Lenis is off). Read by everything else. */
export const scrollState = { y: 0, progress: 0, velocity: 0, viewport: 1 };

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

export function scrollToTarget(target: string | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: 1.2, offset: 0 });
    return;
  }
  const behavior: ScrollBehavior = immediate ? "instant" : "smooth";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else document.querySelector(target)?.scrollIntoView({ behavior });
}
