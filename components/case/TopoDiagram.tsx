"use client";
// Animated architecture of one TopoSort RAG query. Edges draw, nodes light per Kahn wave,
// and in-degree counters tick down to zero before a node is allowed to run.
import { useEffect, useRef } from "react";
import { createTimeline, svg, utils } from "animejs";
import { easeInOut, easeOut, onEnterView, prefersReducedMotion } from "@/lib/motion";

type N = { id: string; x: number; y: number; label: string; sub: string; wave: number; deps?: string[] };

const W = 150;
const H = 64;
const nodes: N[] = [
  { id: "query", x: 20, y: 178, label: "Query", sub: "plain English", wave: 0 },
  { id: "router", x: 200, y: 178, label: "Router", sub: "picks the agents", wave: 1, deps: ["query"] },
  { id: "kahn", x: 380, y: 178, label: "Kahn sort", sub: "in-degree 0 runs", wave: 2, deps: ["router"] },
  { id: "retrieval", x: 580, y: 40, label: "Retrieval", sub: "Qdrant", wave: 3, deps: ["kahn"] },
  { id: "gmail", x: 580, y: 178, label: "Gmail agent", sub: "via MCP", wave: 3, deps: ["kahn"] },
  { id: "github", x: 580, y: 316, label: "GitHub agent", sub: "via MCP", wave: 3, deps: ["kahn"] },
  { id: "approve", x: 780, y: 247, label: "Approval", sub: "human in the loop", wave: 4, deps: ["gmail", "github"] },
  { id: "answer", x: 980, y: 178, label: "Answer", sub: "grounded reply", wave: 5, deps: ["retrieval", "approve"] },
];
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const edges = nodes.flatMap((n) => (n.deps ?? []).map((d) => ({ from: byId[d], to: n })));

const edgePath = (a: N, b: N) => {
  const x1 = a.x + W;
  const y1 = a.y + H / 2;
  const x2 = b.x;
  const y2 = b.y + H / 2;
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
};

export default function TopoDiagram() {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current!;
    const q = (s: string) => el.querySelectorAll<SVGElement>(s);
    const setDeg = (id: string, v: number) => {
      const t = el.querySelector(`[data-deg="${id}"]`);
      if (t) t.textContent = String(v);
    };
    const resetDeg = () => nodes.forEach((n) => n.deps && setDeg(n.id, n.deps.length));

    if (prefersReducedMotion()) {
      q(".glow").forEach((g) => g.setAttribute("opacity", "1"));
      nodes.forEach((n) => n.deps && setDeg(n.id, 0));
      return;
    }

    utils.set(svg.createDrawable(Array.from(q("[data-edge]"))), { draw: "0 0" });
    let tl: ReturnType<typeof createTimeline> | null = null;
    const unobserve = onEnterView(el, () => {
      tl = createTimeline({ loop: true, loopDelay: 1800, defaults: { ease: easeOut }, onLoop: resetDeg });
      tl.call(resetDeg, 0);
      const waves = Math.max(...nodes.map((n) => n.wave));
      let at = 0;
      for (let w = 0; w <= waves; w++) {
        const incoming = edges.filter((e) => e.to.wave === w);
        if (incoming.length) {
          const paths = Array.from(q(incoming.map((e) => `[data-edge="${e.from.id}-${e.to.id}"]`).join(",")));
          tl.add(svg.createDrawable(paths), { draw: ["0 0", "0 1"], duration: 650, ease: easeInOut }, at);
          // every finished dependency knocks one off the in-degree
          incoming.forEach((e, i) => {
            tl!.call(() => {
              const t = el.querySelector(`[data-deg="${e.to.id}"]`);
              if (t) t.textContent = String(Math.max(0, Number(t.textContent) - 1));
            }, at + 450 + i * 90);
          });
          at += 650;
        }
        const ids = nodes.filter((n) => n.wave === w).map((n) => `[data-glow="${n.id}"]`);
        tl.add(Array.from(q(ids.join(","))), { opacity: [0, 1], duration: 450 }, at);
        if (w === 3) tl.add(Array.from(q("[data-parallel]")), { opacity: [0, 1], duration: 450 }, at);
        at += 380;
      }
      tl.add(Array.from(q(".glow, [data-parallel]")), { opacity: 0, duration: 500 }, at + 1400);
      tl.add(svg.createDrawable(Array.from(q("[data-edge]"))), { draw: "1 1", duration: 500, ease: easeInOut }, at + 1400);
    });
    return () => {
      unobserve();
      tl?.revert();
    };
  }, []);

  return (
    <figure className="overflow-x-auto rounded-2xl border border-line bg-surface p-4 sm:p-8">
      <svg
        ref={root}
        viewBox="0 0 1150 400"
        className="min-w-[760px]"
        role="img"
        aria-labelledby="topo-title topo-desc"
      >
        <title id="topo-title">TopoSort RAG, one query</title>
        <desc id="topo-desc">
          A query goes to the router, which picks agents. Kahn&apos;s sort runs every agent whose in-degree is zero. Retrieval,
          the Gmail agent and the GitHub agent run in parallel in the same wave. Actions from Gmail and GitHub wait for human
          approval, and the answer waits for retrieval and approval.
        </desc>
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0" stopColor="#0284c7" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        <g data-parallel="" opacity="0">
          <rect x="562" y="22" width="186" height="376" rx="14" fill="none" stroke="#0284c7" strokeDasharray="4 6" strokeOpacity="0.6" />
          <text x="655" y="14" textAnchor="middle" className="fill-cyan font-mono text-[12px] uppercase tracking-[0.14em]">
            wave 1, parallel
          </text>
        </g>

        {edges.map((e) => (
          <g key={`${e.from.id}-${e.to.id}`}>
            <path d={edgePath(e.from, e.to)} fill="none" stroke="rgba(11,14,19,0.1)" strokeWidth="1.5" />
            <path data-edge={`${e.from.id}-${e.to.id}`} d={edgePath(e.from, e.to)} fill="none" stroke="url(#edge)" strokeWidth="2" />
          </g>
        ))}

        {nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            <rect width={W} height={H} rx="12" fill="#ffffff" stroke="rgba(11,14,19,0.16)" />
            <rect
              data-glow={n.id}
              className="glow"
              width={W}
              height={H}
              rx="12"
              fill="rgba(54,188,247,0.12)"
              stroke={n.id === "approve" ? "#c2410c" : "#0284c7"}
              strokeWidth="1.5"
              opacity="0"
            />
            <text x="16" y="28" className="fill-fg font-display text-[16px] font-semibold">
              {n.label}
            </text>
            <text x="16" y="48" className="fill-muted font-mono text-[11px]">
              {n.sub}
            </text>
            {n.deps && (
              <g transform={`translate(${W - 26} -10)`}>
                <circle cx="13" cy="13" r="13" fill="#f4f5f7" stroke="rgba(11,14,19,0.2)" />
                <text data-deg={n.id} x="13" y="17.5" textAnchor="middle" className="fill-fg font-mono text-[12px]">
                  {n.deps.length}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
        <span>Simplified view of one query.</span>
        <span>Badge = in-degree: unmet dependencies before a node can run.</span>
      </figcaption>
    </figure>
  );
}
