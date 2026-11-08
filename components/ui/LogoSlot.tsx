import { existsSync } from "node:fs";
import { join } from "node:path";
import RiveLogo from "./RiveLogo";

const RIVE_SRC = "/rive/logo.riv";

// Checked at build time: drop public/rive/logo.riv in and the Rive version replaces the SVG.
export default function LogoSlot() {
  const hasRive = existsSync(join(process.cwd(), "public", RIVE_SRC));
  return <RiveLogo src={hasRive ? RIVE_SRC : undefined} />;
}
