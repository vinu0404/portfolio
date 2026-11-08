"use client";
import { useEffect, useRef } from "react";
import { addTick } from "@/lib/ticker";
import { scrollState } from "@/lib/scroll";

export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => addTick(() => bar.current && (bar.current.style.transform = `scaleX(${scrollState.progress})`)), []);
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[55] h-px">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-cyan to-violet" />
    </div>
  );
}
