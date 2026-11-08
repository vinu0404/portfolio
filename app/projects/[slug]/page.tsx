import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import SplitText from "@/components/reactbits/SplitText";
import Reveal from "@/components/ui/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import ProjectVisual from "@/components/ui/ProjectVisual";
import TopoDiagram from "@/components/case/TopoDiagram";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.tagline} ${p.summary}`,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.name, description: p.tagline, url: `/projects/${p.slug}` },
  };
}

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-6 border-t border-line py-14 md:grid-cols-12 md:py-20">
      <h2 className="label md:col-span-3">
        <span className="text-cyan">{index}</span> / {title}
      </h2>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <article className="pt-32 sm:pt-40">
      <header className="shell">
        <TransitionLink href="/#work" className="label hover:text-fg">
          ← All work
        </TransitionLink>
        <p className="label mt-12">
          {p.flagship ? <span className="text-warm">Flagship project</span> : `Project 0${i + 1}`}
        </p>
        <SplitText
          as="h1"
          text={p.name}
          splitType="chars"
          delay={40}
          className="mt-4 font-display text-[clamp(2.25rem,8vw,8rem)] font-extrabold uppercase leading-[0.9]"
        />
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p className="text-xl text-fg/85 md:col-span-7 md:text-2xl">{p.tagline}</p>
          <div className="flex flex-wrap items-start gap-3 md:col-span-5 md:justify-end">
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-full bg-fg px-6 font-medium text-bg hover:bg-cyan">
                Live demo ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {p.code && (
              <a href={p.code} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium hover:border-cyan hover:text-cyan">
                Code on GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
        <Reveal variant="mask" className="mt-16 aspect-[2/1] max-h-[420px] w-full rounded-2xl border border-line bg-surface p-6 sm:p-10">
          <div className="pv-play h-full">
            <ProjectVisual kind={p.visual} />
          </div>
        </Reveal>
      </header>

      <div className="shell mt-16">
        <Block index="01" title="Problem">
          <p className="max-w-3xl text-lg leading-relaxed text-fg/85 sm:text-xl">{p.problem}</p>
        </Block>

        {p.slug === "toposort-rag" && (
          <Block index="02" title="Architecture">
            <p className="mb-8 max-w-2xl text-muted">
              Each agent is a node. An edge means one agent needs another&apos;s output. Kahn&apos;s algorithm repeatedly runs every
              node with no unmet dependencies, so independent agents start together.
            </p>
            <TopoDiagram />
          </Block>
        )}

        <Block index={p.slug === "toposort-rag" ? "03" : "02"} title="What I built">
          <ul className="max-w-3xl divide-y divide-line">
            {p.built.map((b, k) => (
              <li key={b} className="flex gap-6 py-5 text-lg text-fg/85">
                <span className="font-mono text-sm text-muted">{String(k + 1).padStart(2, "0")}</span>
                {b}
              </li>
            ))}
          </ul>
        </Block>

        <Block index={p.slug === "toposort-rag" ? "04" : "03"} title="Stack">
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="rounded-full border border-line px-4 py-2 font-mono text-sm">
                {s}
              </li>
            ))}
          </ul>
        </Block>

        <Block index={p.slug === "toposort-rag" ? "05" : "04"} title="Outcome">
          <p className="max-w-3xl font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{p.outcome}</p>
        </Block>
      </div>

      <TransitionLink
        href={`/projects/${next.slug}`}
        data-cursor="view"
        className="group mt-10 block border-t border-line"
      >
        <div className="shell py-20 sm:py-32">
          <p className="label">Next project</p>
          <p className="mt-4 font-display text-[clamp(2rem,7.5vw,8rem)] font-extrabold uppercase leading-[0.9] transition-colors group-hover:text-cyan">
            {next.name} <span aria-hidden="true">→</span>
          </p>
        </div>
      </TransitionLink>
    </article>
  );
}
