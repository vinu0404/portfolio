"use client";
// Two-panel mask wipe: cover (380ms) -> route -> reveal (450ms). Under 900ms total.
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate, stagger } from "animejs";
import { easeInOut, prefersReducedMotion } from "@/lib/motion";
import { scrollToTarget } from "@/lib/scroll";

let go: (href: string) => void = (href) => (window.location.href = href);
export const navigate = (href: string) => go(href);

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const accent = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);

  useEffect(() => {
    go = (href) => {
      const reduced = prefersReducedMotion();
      pending.current = href;
      const els = [accent.current!, panel.current!];
      if (reduced) {
        animate(panel.current!, { opacity: [0, 1], duration: 150, onComplete: () => router.push(href, { scroll: false }) });
        return;
      }
      els.forEach((el) => {
        el.style.transformOrigin = "50% 100%";
        el.style.opacity = "1";
      });
      animate(els, {
        scaleY: [0, 1],
        duration: 380,
        ease: easeInOut,
        delay: stagger(60),
        onComplete: () => router.push(href, { scroll: false }),
      });
    };
  }, [router]);

  useEffect(() => {
    if (!pending.current) return;
    const hash = pending.current.split("#")[1];
    pending.current = null;
    scrollToTarget(hash ? `#${hash}` : 0, true);
    const els = [panel.current!, accent.current!];
    document.getElementById("main")?.focus({ preventScroll: true });
    if (prefersReducedMotion()) {
      animate(panel.current!, { opacity: 0, duration: 200 });
      return;
    }
    els.forEach((el) => (el.style.transformOrigin = "50% 0%"));
    animate(els, { scaleY: 0, duration: 450, ease: easeInOut, delay: stagger(60, { start: 80 }) });
  }, [pathname]);

  return (
    <>
      {children}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
        <div ref={accent} className="absolute inset-0 origin-bottom scale-y-0 bg-cyan" />
        <div ref={panel} className="absolute inset-0 origin-bottom scale-y-0 bg-surface" />
      </div>
    </>
  );
}
