"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile, stats } from "@/data/portfolio";
import { addTick } from "@/lib/ticker";
import { scrollState } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";
import BlurText from "@/components/reactbits/BlurText";
import CountUp from "@/components/reactbits/CountUp";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import LogoMark from "@/components/ui/LogoMark";

const GradientBg = dynamic(() => import("@/components/three/GradientBg"), { ssr: false });

export default function About() {
  const section = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    // Only keep the gradient's WebGL context alive while the section is close to the viewport.
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "50% 0px" });
    io.observe(section.current!);
    // Colour shifts with scroll through the section (one Lenis value, no React renders).
    const stop = addTick(() => {
      const el = section.current;
      if (!el || !bg.current) return;
      const p = (scrollState.y - el.offsetTop + scrollState.viewport) / (el.offsetHeight + scrollState.viewport);
      bg.current.style.filter = `hue-rotate(${Math.max(0, Math.min(1, p)) * 70 - 20}deg)`;
    });
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <section ref={section} id="about" aria-labelledby="about-title" className="relative isolate overflow-hidden py-28 sm:py-40">
      <div ref={bg} aria-hidden="true" className="absolute inset-0 -z-20 opacity-70">
        {near && <GradientBg animate={!reduced} />}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-bg)_0%,rgba(244,245,247,0.6)_30%,rgba(244,245,247,0.6)_70%,var(--color-bg)_100%)]" />

      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionLabel index="01" text="About" />
          <Reveal className="mt-8">
            <figure className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-surface/70 backdrop-blur-sm">
              {profile.photo ? (
                <Image src={profile.photo} alt={`Portrait of ${profile.name}`} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
              ) : (
                // Placeholder until profile.photo is set in data/portfolio.ts
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(54,188,247,0.18),transparent_60%)]">
                  <LogoMark className="h-24 w-24 text-fg/80" title={profile.name} />
                  <span aria-hidden="true" className="absolute inset-4 rounded-xl border border-dashed border-line-strong" />
                </div>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 flex justify-between p-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                <span>{profile.education.school}</span>
                <span>{profile.education.grade}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <h2 id="about-title" className="sr-only">
            About {profile.name}
          </h2>
          <div className="space-y-8">
            {profile.about.map((p, i) => (
              <BlurText
                key={i}
                text={p}
                className={i === 0 ? "font-display text-[1.75rem] font-semibold leading-[1.25] tracking-tight sm:text-[2.5rem]" : "max-w-2xl text-lg leading-relaxed text-fg/80"}
              />
            ))}
          </div>
          <p className="mt-6 text-muted">{profile.education.degree}, {profile.education.school}.</p>

          <dl className="mt-16 grid grid-cols-3 border-t border-line">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-3 border-r border-line pt-6 pr-4 last:border-r-0 [&:not(:first-child)]:pl-4 sm:[&:not(:first-child)]:pl-8">
                <dt className="label">{s.label}</dt>
                <dd className="font-display text-6xl font-bold leading-none sm:text-8xl">
                  <CountUp to={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <ScrollVelocity
        className="mt-24 border-y border-line py-6 font-display text-4xl font-bold uppercase text-fg/15 sm:mt-32 sm:text-6xl"
        texts={["Multi-agent systems  ·  RAG pipelines  ·  Evaluation", "APIs  ·  Queues  ·  Databases  ·  Deployment"]}
      />
    </section>
  );
}
