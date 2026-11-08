import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  // a few graph nodes in topological layers, same motif as the hero
  const dots = Array.from({ length: 18 }, (_, i) => ({ x: 640 + (i % 6) * 90, y: 120 + Math.floor(i / 6) * 150 + (i % 2) * 40 }));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f5f7", color: "#0b0e13", padding: 72, position: "relative" }}>
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: 14,
              height: 14,
              borderRadius: 14,
              background: i < 7 ? "#0284c7" : "#c3cad4",
              boxShadow: i < 7 ? "0 0 30px #36bcf7" : "none",
            }}
          />
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#0369a1", textTransform: "uppercase" }}>{profile.title}</div>
          <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, marginTop: 16, letterSpacing: -4 }}>VINAY</div>
          <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}>KUMAR</div>
          <div style={{ fontSize: 28, color: "#5a6472", marginTop: 32, maxWidth: 760 }}>{profile.oneLiner}</div>
        </div>
      </div>
    ),
    size,
  );
}
