"use client";
import { useEffect, useRef } from "react";
import { animate, onScroll, stagger } from "animejs";
import { experience } from "@/data/portfolio";
import { easeOut, prefersReducedMotion } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/reactbits/SplitText";

export default function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const items = Array.from(list.current!.querySelectorAll<HTMLElement>("[data-item]"));
    if (prefersReducedMotion()) {
      rail.current!.style.transform = "scaleY(1)";
      items.forEach((el) => (el.dataset.active = "true"));
      return;
    }
    // Rail fill is synced to scroll position (Anime.js onScroll, fed by Lenis' real scroll).
    const fill = animate(rail.current!, {
      scaleY: [0, 1],
      ease: "linear",
      autoplay: onScroll({ target: list.current!, enter: "center top", leave: "center bottom", sync: true }),
    });
    // Each role lights up as it crosses the middle of the screen.
    const observers = items.map((el) =>
      animate(el.querySelectorAll("[data-line]"), {
        opacity: [0, 1],
        x: [-16, 0],
        duration: 900,
        ease: easeOut,
        delay: stagger(80),
        autoplay: onScroll({
          target: el,
          enter: "80% top",
          onEnter: () => (el.dataset.active = "true"),
          onLeaveBackward: () => (el.dataset.active = "false"),
        }),
      }),
    );
    return () => {
      fill.revert();
      observers.forEach((o) => o.revert());
    };
  }, []);

  return (
    <section id="experience" aria-labelledby="exp-title" className="py-24 sm:py-32">
      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionLabel index="03" text="Experience" />
            <SplitText as="h2" id="exp-title" text="Where I've done the work." className="mt-6 font-display text-[length:var(--text-h2)] font-bold leading-[1.02]" />
            <p className="mt-6 max-w-xs text-muted">Most relevant first.</p>
          </div>
        </div>

        <ol ref={list} className="relative md:col-span-8">
          <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-line" />
          <span
            ref={rail}
            aria-hidden="true"
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top scale-y-0 bg-gradient-to-b from-cyan to-violet"
          />
          {experience.map((job) => (
            <li key={job.company} data-item="" data-active="false" className="group relative pb-20 pl-12 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border border-line-strong bg-bg transition-all duration-500 group-data-[active=true]:border-cyan group-data-[active=true]:bg-cyan group-data-[active=true]:shadow-[0_0_16px_#36bcf7]"
              />
              <p className="label" data-line="">
                {job.role}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl" data-line="">
                {job.company}
              </h3>
              <div className="mt-5 max-w-2xl space-y-3 text-fg/80">
                {job.lines.map((l) => (
                  <p key={l} data-line="">
                    {l}
                  </p>
                ))}
                <p className="text-muted" data-line="">
                  {job.detail.join(" ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
