# Vinay Kumar, portfolio

Next.js 16 (App Router), React Three Fiber, Lenis, Anime.js v4, ShaderGradient, Unicorn Studio and Rive.
Everything runs in Docker. Nothing is installed on your machine.

## Run it

```bash
docker compose up
```

Dev server with hot reload on http://localhost:3100. `node_modules` lives in a Docker volume, not in this folder.

Production build:

```bash
docker compose --profile prod up --build prod
```

Served on http://localhost:3001.

## Edit content

All copy lives in `data/portfolio.ts`. Every section renders from it.

### Your photo

1. Put the image in `public/images/`, for example `public/images/vinay.jpg` (portrait, 4:5, at least 800px wide).
2. In `data/portfolio.ts` set `photo: "/images/vinay.jpg"`.

Until then the About section shows a placeholder frame with the monogram.

### Rive logo

Put your file at `public/rive/logo.riv`. It needs a state machine named `Logo` with a boolean input `hover`
and a trigger input `loaded`. The build checks for the file and swaps the SVG monogram for it automatically.
Delete the file to go back to the SVG.

### Unicorn Studio scene

In `data/portfolio.ts` set `unicornProjectId` to the embed id from Unicorn Studio (Export, Embed).
It is a public id, so no `.env` is needed. While it is empty, the contact section uses the built-in shader.

## Deploy on Vercel

1. Push this repo to GitHub.
2. On vercel.com: Add New, Project, import the repo. Vercel detects Next.js. Keep the defaults.
3. Optional: add the environment variable `NEXT_PUBLIC_SITE_URL` with your final domain (for example
   `https://vinaykumar.dev`) so the sitemap, canonical links and Open Graph use it. Without it, the
   Vercel production URL is used.
4. Deploy.

The Dockerfile and `output: "standalone"` are only for Docker. Vercel ignores them.

## Structure

```
app/                 routes, metadata, sitemap, robots, OG image, 404
components/three/    hero graph (R3F), ShaderGradient, contact shader fallback
components/reactbits/ React Bits components, ported to Anime.js
components/sections/ home page sections
components/case/     TopoSort RAG architecture diagram
components/ui/       nav, cursor, preloader, logo, transitions
data/portfolio.ts    all content
lib/                 shared frame loop, scroll state, motion tokens, graph generator
```

See `NOTES.md` for the design decisions and `EVALUATION.md` for the review scorecards.
