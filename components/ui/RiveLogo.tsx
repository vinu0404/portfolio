"use client";
import dynamic from "next/dynamic";
import LogoMark from "./LogoMark";

const RiveCanvas = dynamic(() => import("./RiveCanvas"), {
  ssr: false,
  loading: () => <LogoMark className="h-full w-full" />,
});

/**
 * Logo slot. With a .riv file it plays state machine `Logo` (inputs: `hover` boolean, `loaded` trigger).
 * Without one it renders the SVG monogram.
 */
export default function RiveLogo({ src }: { src?: string }) {
  return (
    <span id="logo-slot" className="block h-8 w-8">
      {src ? <RiveCanvas src={src} /> : <LogoMark className="h-full w-full" />}
    </span>
  );
}
