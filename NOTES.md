# Notes: research and design decisions

## Concept

"Mission control for AI agents, with a human edge." The whole site is built around one idea from
Vinay's flagship project, TopoSort RAG: a directed graph that lights up in dependency order.
The hero is that graph in 3D, the case study draws it in 2D, and the logo's junction dot is a node.

## Techniques used (and where they came from)

| Effect | Technique | Source |
|---|---|---|
| One frame loop | A single `requestAnimationFrame` in `lib/ticker.ts` steps Lenis (`autoRaf: false`, `lenis.raf(t)`), Anime.js (`engine.useDefaultMainLoop = false`, `engine.update()`) and the hero canvas (`frameloop="never"` + `advance(t / 1000)`). Nothing runs its own loop, so scroll, DOM motion and 3D are always on the same frame. | Lenis React README (custom raf), Anime.js v4 engine docs, R3F hooks/frame-loop docs |
| Scroll value | Lenis `scroll` event writes into one mutable object (`lib/scroll.ts`). The camera, the About hue shift and the progress bar all read it. No React state per frame. | Lenis docs, basement / darkroom pattern |
| Hero graph | Layered DAG generated in `lib/graph.ts`. Nodes are one `InstancedMesh`; edges are one `LineSegments` geometry with per-vertex colour; packets travelling along edges are a second `InstancedMesh`. A "wave" walks the layers so nodes light up in topological order. | Three.js Journey (instancing, fog), drei docs |
| Glow | `@react-three/postprocessing` Bloom with `mipmapBlur`, luminance threshold so only active nodes bloom. | pmndrs postprocessing docs |
| Off-screen pause | IntersectionObserver gates the `advance` call. Hidden tabs stop rAF on their own. | R3F performance pitfalls docs |
| Text reveals | Anime.js v4 `splitText` (words / lines, `wrap: 'clip'`) + `stagger`. | Anime.js text docs, Codrops text reveal articles |
| Logo draw | Anime.js `svg.createDrawable` on the monogram strokes. | Anime.js SVG docs |
| Scroll-linked timeline | Anime.js `onScroll({ sync: true })` drives the timeline rail fill. | Anime.js onScroll docs |
| Architecture diagram | `createDrawable` edges + timeline per Kahn wave, with in-degree counters ticking to zero. | Anime.js SVG docs, Maxime Heckel's "build it so it teaches" approach |
| Gradient | `@shadergradient/react` waterPlane, colour shifted with a scroll-linked CSS `hue-rotate` so we never re-render the canvas. | ShaderGradient README |
| Contact shader | `unicornstudio-react/next` when `unicornProjectId` is set; otherwise a hand-written fbm domain-warp fragment shader reacting to the pointer. | Unicorn Studio llms.txt, Book of Shaders / Heckel shader articles |
| Grain | Fixed SVG `feTurbulence` noise overlay, `mix-blend-mode: overlay`, no JS. | basement.studio language |
| Verification | Docker dev + prod builds, in-browser audit (headings, names, ids, CLS, JS weight). Playwright / Lighthouse / axe were not downloaded at the owner's request. | |
| Page transition | Two-panel mask wipe (cover 380ms, reveal 450ms) with the in-out curve. Under 900ms. | Codrops page transition demos |

## React Bits

The React Bits TS + Tailwind components (SplitText, BlurText, CountUp, Magnet, ClickSpark,
SpotlightCard, ScrollVelocity, DecryptedText) are ported into `components/reactbits/`
keeping their names and props, but re-implemented on **Anime.js** instead of GSAP / Motion.
Reason: one motion engine, one easing language, one frame loop, and two fewer dependencies.

## Design decisions

- **Type:** Syne (display, 700/800) for its wide, slightly odd letterforms that read as
  confident at 200px. Inter for body. JetBrains Mono for labels, counters and code.
- **Scale:** 12 / 14 / 16 / 20 / 28 / 40 / 64 and a fluid hero `clamp(64px, 14vw, 220px)`.
- **Colour:** light theme (requested after the first build). bg #f4f5f7, surface #fff, text #0b0e13, muted #5a6472 (5.5:1). The brief's cyan #36bcf7 is only 2.2:1 on light, so it stays as `--color-glow` for light and bloom, and text uses `--color-cyan` #0369a1 (5.5:1). Warm becomes #c2410c (4.7:1). Violet (#7c3aed) only appears as light or decoration. Warm is used once per page:
  the flagship marker.
- **Motion:** entrances `cubic-bezier(0.22, 1, 0.36, 1)`, in-out `cubic-bezier(0.65, 0, 0.35, 1)`,
  0.4s to 1.2s, stagger 40 to 90ms. Defined once in `lib/motion.ts` and as CSS variables.
- **Project visuals:** each card shows what the project does, drawn as a scalable SVG, with no stock imagery
  and no generic node graphs. TopoSort RAG is an execution timeline where the wave 1 agents overlap in time.
  GitSpeak is a chat answer with retrieved code. FrameBus is a player with an "up next" column. The LLaMA
  fine-tune is a GPU memory bar under 16 GB with the real settings. Bars replay on hover and once on
  case study load.
- **Cursor:** one dot, no ring. It swells over links and turns into a "View" pill over project cards.
- **Reduced motion:** Lenis is not created, the hero renders a single still frame, text uses
  plain fades, and the page transition becomes a 200ms fade.
- **No JS:** the preloader is hidden by a `<noscript>` style, and reveal states are only applied
  when an inline script has added `html.js`, so all content is visible without JavaScript.
- **Rive:** no `.riv` was supplied and I did not ship a community file I could not verify the
  licence of. `RiveLogo` checks at build time whether `public/rive/logo.riv` exists and falls
  back to the animated SVG monogram. Drop the file in and it switches over.
- **Unicorn Studio:** `unicornProjectId` in `data/portfolio.ts` is empty, so the shader fallback runs.
