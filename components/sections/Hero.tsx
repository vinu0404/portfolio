"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { profile } from "@/data/portfolio";
import { easeOut, introDone, prefersReducedMotion } from "@/lib/motion";
import { scrollToTarget } from "@/lib/scroll";
import SplitText from "@/components/reactbits/SplitText";
import Magnet from "@/components/reactbits/Magnet";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export default function Hero() {
  const [scene, setScene] = useState<{ reduced: boolean; mobile: boolean } | null>(null);
  const meta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScene({ reduced: prefersReducedMotion(), mobile: window.innerWidth < 768 });
    introDone.then(() => {
      animate(meta.current!.querySelectorAll("[data-reveal]"), {
        opacity: [0, 1],
        y: [16, 0],
        duration: 900,
        ease: easeOut,
        delay: stagger(70, { start: 450 }),
      });
    });
  }, []);

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Static backdrop: visible before WebGL loads, and if it never does */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(54,188,247,0.16),transparent_70%),radial-gradient(40%_40%_at_70%_60%,rgba(139,92,246,0.12),transparent_70%)]"
      />
      <div className="absolute inset-0 -z-10">{scene && <HeroScene {...scene} />}</div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-bg via-bg/70 to-transparent" />

      <div ref={meta} className="shell flex flex-1 flex-col justify-end pb-10 pt-28 sm:pb-14">
        <p className="label mb-6 flex items-center gap-3" data-reveal="">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_#36bcf7]" />
          {profile.title}
        </p>

        <h1 id="hero-title" className="font-display text-[length:var(--text-mega)] font-extrabold uppercase leading-[0.86]">
          <SplitText as="span" text={profile.firstName} splitType="chars" delay={50} afterIntro className="block whitespace-nowrap" />
          <SplitText
            as="span"
            text={profile.lastName}
            splitType="chars"
            delay={50}
            startDelay={180}
            afterIntro
            className="block whitespace-nowrap pl-[0.5em] text-transparent [-webkit-text-stroke:1.5px_var(--color-fg)] md:pl-[1.4em]"
          />
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="max-w-xl text-lg leading-relaxed text-fg/85 md:col-span-6 md:text-xl" data-reveal="">
            {profile.oneLiner}
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end" data-reveal="">
            <Magnet>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#work");
                }}
                className="inline-flex h-14 items-center gap-3 rounded-full bg-fg px-7 font-medium text-bg transition-colors hover:bg-cyan"
              >
                View work
                <span aria-hidden="true">↓</span>
              </a>
            </Magnet>
            <Magnet>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
                className="inline-flex h-14 items-center rounded-full border border-line-strong px-7 font-medium text-fg transition-colors hover:border-cyan hover:text-cyan"
              >
                Get in touch
              </a>
            </Magnet>
          </div>
        </div>
      </div>
    </section>
  );
}
