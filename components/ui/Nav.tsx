"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";
import { nav, profile } from "@/data/portfolio";
import { easeOut } from "@/lib/motion";
import { getLenis, scrollToTarget } from "@/lib/scroll";
import TransitionLink from "./TransitionLink";

export default function Nav({ logo }: { logo: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    if (pathname !== "/") return; // TransitionLink routes home, then jumps to the hash
    e.preventDefault();
    scrollToTarget(`#${id}`);
    history.replaceState(null, "", `#${id}`);
  };

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      animate(overlay.current!.querySelectorAll("li"), {
        y: ["100%", "0%"],
        opacity: [0, 1],
        duration: 700,
        ease: easeOut,
        delay: stagger(60),
      });
      overlay.current!.querySelector("a")?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    lenis?.start();
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-bg via-bg/85 to-transparent">
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between sm:h-20">
        <TransitionLink href="/" className="flex items-center gap-3 text-fg" aria-label={`${profile.name}, home`}>
          {logo}
          <span className="label hidden text-fg sm:inline">{profile.name}</span>
        </TransitionLink>

        <ul className="hidden items-center gap-1 rounded-full border border-line bg-surface/85 px-2 py-1.5 shadow-[0_8px_30px_-12px_rgba(11,14,19,0.15)] backdrop-blur-md md:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <TransitionLink
                href={`/#${n.id}`}
                onClick={(e) => go(e, n.id)}
                className="block rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:bg-fg/5 hover:text-fg"
              >
                {n.label}
              </TransitionLink>
            </li>
          ))}
        </ul>

        <button
          ref={menuButton}
          type="button"
          className="label rounded-full border border-line bg-surface/85 px-4 py-2 text-fg backdrop-blur-md md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div
        ref={overlay}
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 top-16 z-40 bg-bg/95 backdrop-blur-xl md:hidden"
      >
        <ul className="shell flex flex-col gap-2 pt-10">
          {nav.map((n, i) => (
            <li key={n.id} className="overflow-hidden border-b border-line">
              <TransitionLink
                href={`/#${n.id}`}
                onClick={(e) => go(e, n.id)}
                className="flex items-baseline justify-between py-4 font-display text-5xl font-bold text-fg"
              >
                {n.label}
                <span className="label">0{i + 1}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
