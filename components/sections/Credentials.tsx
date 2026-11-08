import { certifications, publication } from "@/data/portfolio";
import SectionLabel from "@/components/ui/SectionLabel";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import Reveal from "@/components/ui/Reveal";

export default function Credentials() {
  return (
    <section id="credentials" aria-labelledby="cred-title" className="py-28 sm:py-32">
      <div className="shell">
        <SectionLabel index="05" text="Credentials" />
        <h2 id="cred-title" className="sr-only">
          Credentials
        </h2>
        <Reveal variant="children" className="mt-10 grid gap-4 md:grid-cols-2">
          <SpotlightCard spotlightColor="rgba(139, 92, 246, 0.16)">
            <article className="flex h-full flex-col p-6 sm:p-10">
              <p className="label">Publication / {publication.venue}</p>
              <h3 className="mt-6 font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 after:rounded-2xl hover:text-cyan focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-cyan"
                >
                  {publication.title}
                </a>
              </h3>
              <p className="mt-auto flex items-center gap-2 pt-10 font-mono text-sm text-cyan">
                Read on ACM Digital Library <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </p>
            </article>
          </SpotlightCard>

          <SpotlightCard>
            <article className="flex h-full flex-col p-6 sm:p-10">
              <p className="label">Certifications</p>
              <ul className="mt-6 divide-y divide-line">
                {certifications.map((c) => (
                  <li key={c.name} className="flex items-baseline justify-between gap-6 py-5 first:pt-0">
                    <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{c.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {c.issuer}, {c.date}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
