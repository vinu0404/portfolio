// VK monogram on a 32 grid: the V's right arm and the K's stem share one stroke,
// and the K's arms meet at a node (the cyan dot), the same idea as the hero graph.
export const LOGO_PATHS = ["M5 7 L11.5 25 L18 7 V25", "M27 7 L18.5 16 L27 25"] as const;

export default function LogoMark({
  className = "",
  title = "Vinay Kumar",
  strokeWidth = 2.6,
}: {
  className?: string;
  title?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label={title} fill="none">
      {LOGO_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          className="logo-stroke"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      ))}
      <circle className="logo-node" cx="18.5" cy="16" r="2.4" fill="var(--color-cyan)" />
    </svg>
  );
}
