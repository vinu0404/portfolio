import TransitionLink from "@/components/ui/TransitionLink";
import LogoMark from "@/components/ui/LogoMark";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[100svh] flex-col justify-center pt-24">
      <p className="label flex items-center gap-3">
        <span className="text-cyan">404</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        Node not found
      </p>
      <h1 className="mt-6 font-display text-[length:var(--text-mega)] font-extrabold uppercase leading-[0.88]">
        Dead
        <br />
        <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-fg)]">end</span>
      </h1>
      <p className="mt-8 max-w-md text-lg text-fg/85">This page has no incoming edges. Nothing points here, so let&apos;s go back to the graph.</p>
      <div className="mt-10 flex items-center gap-6">
        <TransitionLink href="/" className="inline-flex h-14 items-center rounded-full bg-fg px-7 font-medium text-bg hover:bg-cyan">
          Back home
        </TransitionLink>
        <LogoMark className="h-8 w-8 text-muted" />
      </div>
    </section>
  );
}
