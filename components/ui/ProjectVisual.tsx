import type { Project } from "@/data/portfolio";

// One small product picture per project, showing what it does (not a generic node graph).
// Bars with .pv-grow replay from the left on card hover, staggered by --d.

const C = {
  fg: "#0b0e13",
  muted: "#5a6472",
  line: "rgba(11,14,19,0.1)",
  soft: "#f4f5f7",
  glow: "#36bcf7",
  ink: "#0369a1",
  violet: "#7c3aed",
  warm: "#c2410c",
};
const mono = { fontFamily: "var(--font-mono)", fontSize: 11 } as const;
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/** TopoSort RAG: execution timeline. Wave 1 agents overlap in time, which is the whole point. */
function Waves() {
  const rows = [
    { label: "router", x: 112, w: 30, wave: 0 },
    { label: "retrieval", x: 150, w: 104, wave: 1 },
    { label: "gmail · mcp", x: 150, w: 76, wave: 1 },
    { label: "github · mcp", x: 150, w: 120, wave: 1 },
    { label: "approval", x: 278, w: 48, wave: 2, warm: true },
    { label: "answer", x: 334, w: 54, wave: 3 },
  ];
  return (
    <>
      <rect x="146" y="20" width="128" height="146" rx="6" fill={C.glow} fillOpacity="0.07" stroke={C.glow} strokeDasharray="3 4" />
      {rows.map((r, i) => {
        const y = 26 + i * 23;
        return (
          <g key={r.label}>
            <text x="12" y={y + 10} fill={C.muted} style={mono}>
              {r.label}
            </text>
            <rect x="112" y={y + 6} width="276" height="1" fill={C.line} />
            <rect
              className="pv-grow"
              style={d(r.wave * 0.18)}
              x={r.x}
              y={y}
              width={r.w}
              height="13"
              rx="3"
              fill={r.warm ? C.warm : r.wave === 1 ? C.glow : C.fg}
            />
          </g>
        );
      })}
      <text x="210" y="186" textAnchor="middle" fill={C.ink} style={mono}>
        wave 1 · parallel
      </text>
      <text x="388" y="186" textAnchor="end" fill={C.muted} style={mono}>
        time →
      </text>
    </>
  );
}

/** GitSpeak: you ask about the repo, the answer arrives with retrieved code. */
function Chat() {
  return (
    <>
      <rect x="8" y="6" width="384" height="188" rx="10" fill="#fff" stroke={C.line} />
      <text x="22" y="26" fill={C.muted} style={mono}>
        gitspeak
      </text>
      <rect x="8" y="34" width="384" height="1" fill={C.line} />
      <rect x="196" y="44" width="182" height="26" rx="13" fill={C.fg} />
      <text x="287" y="61" textAnchor="middle" fill="#fff" style={{ ...mono, fontSize: 10.5 }}>
        How do these files connect?
      </text>
      <rect x="22" y="80" width="250" height="102" rx="10" fill={C.soft} />
      <rect className="pv-grow" style={d(0)} x="34" y="92" width="180" height="6" rx="3" fill="rgba(11,14,19,0.18)" />
      <rect className="pv-grow" style={d(0.1)} x="34" y="104" width="130" height="6" rx="3" fill="rgba(11,14,19,0.18)" />
      <rect x="34" y="118" width="226" height="54" rx="6" fill={C.fg} />
      {[
        [46, 130, 60, C.glow],
        [112, 130, 80, "#fff"],
        [58, 143, 110, "#c4b5fd"],
        [58, 156, 70, "#fff"],
        [134, 156, 50, C.glow],
      ].map(([x, y, w, f], i) => (
        <rect key={i} className="pv-grow" style={d(0.2 + i * 0.06)} x={x} y={y} width={w} height="5" rx="2.5" fill={f as string} fillOpacity="0.85" />
      ))}
      <rect x="284" y="156" width="96" height="22" rx="11" fill="none" stroke={C.ink} />
      <text x="332" y="171" textAnchor="middle" fill={C.ink} style={{ ...mono, fontSize: 10 }}>
        retrieved code
      </text>
    </>
  );
}

/** FrameBus: a player, its progress, and the recommendations column. */
function Player() {
  return (
    <>
      <defs>
        <linearGradient id="pv-t1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#36bcf7" />
        </linearGradient>
        <linearGradient id="pv-t2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ddd6fe" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="pv-t3" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fed7aa" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <rect x="10" y="12" width="252" height="142" rx="8" fill={C.fg} />
      <circle cx="136" cy="83" r="20" fill="#fff" fillOpacity="0.12" />
      <path d="M130 72 L146 83 L130 94 Z" fill="#fff" />
      <rect x="22" y="138" width="228" height="3" rx="1.5" fill="#fff" fillOpacity="0.25" />
      <rect className="pv-grow" style={d(0)} x="22" y="138" width="96" height="3" rx="1.5" fill={C.glow} />
      <text x="278" y="22" fill={C.muted} style={mono}>
        up next
      </text>
      {["pv-t1", "pv-t2", "pv-t3"].map((g, i) => (
        <g key={g}>
          <rect x="278" y={32 + i * 42} width="56" height="34" rx="5" fill={`url(#${g})`} />
          <rect className="pv-grow" style={d(0.1 + i * 0.08)} x="342" y={38 + i * 42} width="46" height="5" rx="2.5" fill="rgba(11,14,19,0.2)" />
          <rect className="pv-grow" style={d(0.15 + i * 0.08)} x="342" y={50 + i * 42} width="30" height="5" rx="2.5" fill="rgba(11,14,19,0.12)" />
        </g>
      ))}
      <text x="10" y="182" fill={C.muted} style={mono}>
        upload · stream · recommend
      </text>
    </>
  );
}

/** LLaMA 2 QLoRA: the run fits under a 16 GB card, with the real settings. */
function Memory() {
  const specs = [
    ["base", "LLaMA 2 7B Chat"],
    ["weights", "4-bit NF4"],
    ["adapter", "LoRA · rank 64 · scaling 16"],
  ];
  return (
    <>
      <text x="14" y="26" fill={C.muted} style={mono}>
        GPU memory
      </text>
      <text x="318" y="26" textAnchor="middle" fill={C.fg} style={mono}>
        16 GB
      </text>
      <rect x="14" y="36" width="372" height="22" rx="5" fill={C.soft} stroke={C.line} />
      <rect className="pv-grow" style={d(0)} x="14" y="36" width="280" height="22" rx="5" fill="url(#pv-mem)" />
      <defs>
        <linearGradient id="pv-mem" x1="0" x2="1">
          <stop offset="0" stopColor="#36bcf7" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M318 32 V62" stroke={C.fg} strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="14" y="78" fill={C.ink} style={mono}>
        fits under the line
      </text>
      {specs.map(([k, v], i) => (
        <g key={k}>
          <rect x="14" y={96 + i * 30} width="372" height="1" fill={C.line} />
          <text x="14" y={115 + i * 30} fill={C.muted} style={mono}>
            {k}
          </text>
          <text x="110" y={115 + i * 30} fill={C.fg} style={{ ...mono, fontSize: 12 }}>
            {v}
          </text>
        </g>
      ))}
    </>
  );
}

const visuals: Record<Project["visual"], () => React.ReactElement> = {
  waves: Waves,
  chat: Chat,
  player: Player,
  memory: Memory,
};

export default function ProjectVisual({ kind }: { kind: Project["visual"] }) {
  const V = visuals[kind];
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" aria-hidden="true" fill="none" preserveAspectRatio="xMidYMid meet">
      <V />
    </svg>
  );
}
