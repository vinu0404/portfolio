import { skills } from "@/data/portfolio";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/reactbits/SplitText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import Reveal from "@/components/ui/Reveal";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="04" text="Skills" />
        <SplitText as="h2" id="skills-title" text="The tools I reach for." className="mt-6 max-w-3xl font-display text-[length:var(--text-h2)] font-bold leading-[1.02]" />

        <Reveal variant="children" stagger={60} className="mt-16 grid gap-4 md:grid-cols-6">
          {skills.map((g, i) => (
            <SpotlightCard key={g.group} className={i === 1 ? "md:col-span-4 md:row-span-2" : i >= 3 ? "md:col-span-3" : "md:col-span-2"}>
              <div className="relative p-6 sm:p-8">
                <h3 className="label flex items-center justify-between">
                  {g.group}
                  <span aria-hidden="true" className="text-muted">{String(g.items.length).padStart(2, "0")}</span>
                </h3>
                <ul className={`mt-6 flex flex-wrap ${i === 1 ? "gap-2 sm:gap-3" : "gap-2"}`}>
                  {g.items.map((s) => (
                    <li
                      key={s}
                      className={`rounded-full border border-line bg-bg/50 px-3.5 py-1.5 transition-[border-color,color,box-shadow] duration-300 hover:border-cyan hover:text-cyan hover:shadow-[0_0_24px_-6px_#36bcf7] ${
                        i === 1 ? "text-base sm:px-5 sm:py-2.5 sm:text-xl" : "text-sm"
                      }`}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
