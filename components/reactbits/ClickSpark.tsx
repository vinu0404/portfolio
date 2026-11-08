"use client";
// React Bits ClickSpark: short lines burst from the click point. Drawn on a canvas, stepped by the shared ticker.
import { useEffect, useRef } from "react";
import { addTick } from "@/lib/ticker";
import { prefersReducedMotion } from "@/lib/motion";

type Spark = { x: number; y: number; angle: number; start: number };

export default function ClickSpark({
  children,
  sparkColor = "#36bcf7",
  sparkSize = 12,
  sparkRadius = 22,
  sparkCount = 10,
  duration = 500,
}: {
  children: React.ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => () => stopRef.current(), []);

  const onClick = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    const c = canvas.current!;
    const rect = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const now = performance.now();
    const x = e.clientX - rect.left || rect.width / 2;
    const y = e.clientY - rect.top || rect.height / 2;
    for (let i = 0; i < sparkCount; i++) sparks.current.push({ x, y, angle: (i / sparkCount) * Math.PI * 2, start: now });

    stopRef.current();
    const ctx = c.getContext("2d")!;
    stopRef.current = addTick((t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      sparks.current = sparks.current.filter((s) => {
        const p = (t - s.start) / duration;
        if (p >= 1) return false;
        const eased = 1 - Math.pow(1 - p, 3);
        const d = eased * sparkRadius;
        const len = sparkSize * (1 - eased);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x + d * Math.cos(s.angle), s.y + d * Math.sin(s.angle));
        ctx.lineTo(s.x + (d + len) * Math.cos(s.angle), s.y + (d + len) * Math.sin(s.angle));
        ctx.stroke();
        return true;
      });
      if (!sparks.current.length) stopRef.current();
    });
  };

  return (
    <div className="relative inline-block" onClick={onClick}>
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]" />
      {children}
    </div>
  );
}
