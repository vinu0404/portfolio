import { projects } from "@/data/portfolio";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import SplitText from "@/components/reactbits/SplitText";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import ProjectVisual from "@/components/ui/ProjectVisual";

export default function Work() {
  const [flagship, ...rest] = projects;
  return (
    <section id="work" aria-labelledby="work-title" className="py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="02" text="Selected work" />
            <SplitText
              as="h2"
              id="work-title"
              text="Things I built that run on real data."
              className="mt-6 font-display text-[length:var(--text-h2)] font-bold leading-[1.02]"
            />
          </div>
          <p className="text-muted md:col-span-4">Four projects. The first one is the one I would show you first.</p>
        </div>

        <Reveal className="mt-16">
          <SpotlightCard className="sig-card" spotlightColor="rgba(255, 184, 107, 0.12)">
            <article data-cursor="view" className="grid gap-8 p-6 sm:p-10 md:grid-cols-12">
              <div className="flex flex-col md:col-span-6">
                <p className="label flex items-center gap-3">
                  <span className="text-warm">01 / Flagship</span>
                </p>
                <h3 className="mt-6 font-display text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">
                  <TransitionLink href={`/projects/${flagship.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-cyan">
                    {flagship.name}
                  </TransitionLink>
                </h3>
                <p className="mt-6 max-w-md text-lg text-fg/85">{flagship.tagline}</p>
                <p className="mt-3 max-w-md text-muted">{flagship.summary}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label="Stack">
                  {flagship.stack.map((s) => (
                    <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-xl border border-line bg-bg/60 p-4 pb-12 md:col-span-6">
                <ProjectVisual kind={flagship.visual} />
                <span className="label absolute bottom-4 right-4">Read case study →</span>
              </div>
            </article>
          </SpotlightCard>
        </Reveal>

        <Reveal variant="children" className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((p, i) => (
            <SpotlightCard key={p.slug} className="sig-card">
              <article data-cursor="view" className="flex h-full flex-col p-6 sm:p-8">
                <div className="aspect-[2/1] rounded-xl border border-line bg-bg/60 p-3">
                  <ProjectVisual kind={p.visual} />
                </div>
                <p className="label mt-8">0{i + 2}</p>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">
                  <TransitionLink href={`/projects/${p.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-cyan">
                    {p.name}
                  </TransitionLink>
                </h3>
                <p className="mt-3 text-muted">{p.tagline}</p>
                <p className="mt-auto pt-6 font-mono text-xs text-muted">{p.stack.slice(0, 3).join(" · ")}</p>
              </article>
            </SpotlightCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
