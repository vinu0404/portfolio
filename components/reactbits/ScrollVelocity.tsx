"use client";
// React Bits ScrollVelocity: marquee rows that speed up with scroll velocity (read from the shared Lenis value).
import { useEffect, useRef } from "react";
import { addTick } from "@/lib/ticker";
import { scrollState } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";

export default function ScrollVelocity({
  texts,
  velocity = 40,
  className = "",
}: {
  texts: string[];
  /** base px per second */
  velocity?: number;
  className?: string;
}) {
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const offsets = texts.map(() => 0);
    return addTick((_, dt) => {
      rows.current.forEach((row, i) => {
        if (!row) return;
        const dir = i % 2 ? 1 : -1;
        const boost = 1 + Math.min(Math.abs(scrollState.velocity) * 0.25, 8);
        const half = row.scrollWidth / 2;
        offsets[i] = (offsets[i] + dir * velocity * boost * (dt / 1000)) % half;
        if (offsets[i] > 0) offsets[i] -= half;
        row.style.transform = `translate3d(${offsets[i]}px,0,0)`;
      });
    });
  }, [texts, velocity]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <p className="sr-only">{texts.join(". ")}</p>
      {texts.map((t, i) => (
        <div
          key={t}
          ref={(el) => {
            rows.current[i] = el;
          }}
          aria-hidden="true"
          className="flex w-max whitespace-nowrap will-change-transform"
        >
          {Array.from({ length: 8 }, (_, k) => (
            <span key={k} className="px-6">
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
