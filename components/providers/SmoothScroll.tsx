"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { addTick, ensureTicker } from "@/lib/ticker";
import { scrollState, setLenis } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";

function measure(y: number, velocity: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollState.y = y;
  scrollState.velocity = velocity;
  scrollState.viewport = window.innerHeight;
  scrollState.progress = max > 0 ? y / max : 0;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureTicker();
    if (prefersReducedMotion()) {
      const onScroll = () => measure(window.scrollY, 0);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", (l: Lenis) => measure(l.scroll, l.velocity));
    measure(window.scrollY, 0);
    const stop = addTick((time) => lenis.raf(time));
    return () => {
      stop();
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
