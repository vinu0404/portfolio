"use client";
import { useEffect, useRef, useState } from "react";
import { createTimeline, svg, utils } from "animejs";
import LogoMark from "./LogoMark";
import { easeInOut, easeOut, finishIntro, prefersReducedMotion } from "@/lib/motion";
import { ensureTicker } from "@/lib/ticker";

const KEY = "vk-intro";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const meta = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("seen")) {
      finishIntro();
      setGone(true);
      return;
    }
    ensureTicker();
    const done = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      finishIntro();
    };

    if (prefersReducedMotion()) {
      const tl = createTimeline({ onComplete: () => setGone(true) });
      tl.add(root.current!, { opacity: [1, 0], duration: 400, delay: 300, onBegin: done });
      return () => {
        tl.revert();
      };
    }

    const strokes = svg.createDrawable(logo.current!.querySelectorAll(".logo-stroke"));
    const node = logo.current!.querySelector(".logo-node")!;
    const count = { v: 0 };

    // Where the nav logo lives, so the monogram can land on it.
    const target = document.getElementById("logo-slot")?.getBoundingClientRect();
    const from = logo.current!.getBoundingClientRect();
    const dx = target ? target.left + target.width / 2 - (from.left + from.width / 2) : 0;
    const dy = target ? target.top + target.height / 2 - (from.top + from.height / 2) : 0;
    const scale = target ? target.width / from.width : 0.3;

    const tl = createTimeline({
      defaults: { ease: easeOut },
      onComplete: () => {
        done();
        setGone(true);
      },
    });
    tl.add(strokes, { draw: ["0 0", "0 1"], duration: 900, ease: easeInOut }, 0)
      .add(node, { scale: [0, 1], duration: 400 }, 850)
      .add(
        count,
        {
          v: 100,
          duration: 1400,
          ease: easeInOut,
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.round(count.v)).padStart(3, "0");
          },
        },
        0,
      )
      .add(meta.current!, { opacity: 0, y: -8, duration: 300 }, 1400)
      .add(logo.current!, { x: dx, y: dy, scale, duration: 700, ease: easeInOut }, 1450)
      .add(panel.current!, { y: ["0%", "-100%"], duration: 700, ease: easeInOut, onBegin: done }, 1550)
      .add(logo.current!, { opacity: 0, duration: 150 }, 2150);

    const skip = () => tl.complete();
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      window.removeEventListener("keydown", skip);
      tl.revert();
      utils.remove([count]);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[90]" aria-label="Loading" role="status">
      <div ref={panel} className="absolute inset-0 bg-bg" />
      <div className="absolute inset-0 grid place-items-center">
        <div ref={logo} className="h-20 w-20 text-fg sm:h-24 sm:w-24">
          <LogoMark className="h-full w-full" strokeWidth={2.2} />
        </div>
      </div>
      <div ref={meta} className="shell absolute inset-x-0 bottom-8 flex items-end justify-between">
        <p className="label">Vinay Kumar / GenAI Engineer</p>
        <div className="flex items-end gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              window.dispatchEvent(new KeyboardEvent("keydown"));
            }}
            className="label underline-offset-4 hover:text-fg hover:underline"
          >
            Skip intro
          </button>
          <p className="font-mono text-5xl leading-none tabular-nums text-fg sm:text-7xl" aria-hidden="true">
            <span ref={counter}>000</span>
            <span className="text-cyan">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
