"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { profile, unicornProjectId } from "@/data/portfolio";
import { prefersReducedMotion } from "@/lib/motion";
import { scrollToTarget } from "@/lib/scroll";
import SplitText from "@/components/reactbits/SplitText";
import ClickSpark from "@/components/reactbits/ClickSpark";
import Magnet from "@/components/reactbits/Magnet";
import SectionLabel from "@/components/ui/SectionLabel";

const UnicornScene = dynamic(() => import("unicornstudio-react/next"), { ssr: false });
const ShaderFallback = dynamic(() => import("@/components/three/ShaderFallback"), { ssr: false });

export default function Contact() {
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "60% 0px" });
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section ref={section} id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(54,188,247,0.18),transparent_70%)]">
        {near &&
          (unicornProjectId ? (
            <UnicornScene projectId={unicornProjectId} width="100%" height="100%" lazyLoad />
          ) : (
            <ShaderFallback animate={!reduced} />
          ))}
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-bg to-transparent" />

      <div className="shell flex min-h-[100svh] flex-col pb-10 pt-32">
        <SectionLabel index="06" text="Contact" />
        <SplitText
          as="h2"
          id="contact-title"
          text="Let's build something"
          splitType="words"
          delay={90}
          className="mt-8 max-w-5xl font-display text-[clamp(2rem,7.5vw,9rem)] font-extrabold uppercase leading-[0.88]"
        />
        <p className="mt-8 max-w-md text-lg text-fg/85">
          If you have an agent that needs to work after the demo, I would like to hear about it.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <ClickSpark>
            <Magnet padding={40}>
              <button
                type="button"
                onClick={copy}
                className="group inline-flex h-16 items-center gap-4 rounded-full bg-fg pl-7 pr-3 text-lg font-medium text-bg transition-colors hover:bg-cyan"
              >
                {profile.email}
                <span className="rounded-full bg-bg px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-fg">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </Magnet>
          </ClickSpark>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Email address copied to clipboard" : ""}
          </span>
        </div>

        <footer className="mt-auto flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex gap-6">
            {[
              ["GitHub", profile.links.github],
              ["LinkedIn", profile.links.linkedin],
              ["Email", `mailto:${profile.email}`],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="label text-fg underline-offset-4 hover:text-cyan hover:underline"
                >
                  {label}
                  {href.startsWith("http") && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
          <p className="label">{profile.name}, {profile.title}</p>
          <button type="button" onClick={() => scrollToTarget(0)} className="label self-start text-fg hover:text-cyan sm:self-auto">
            Back to top ↑
          </button>
        </footer>
      </div>
    </section>
  );
}
