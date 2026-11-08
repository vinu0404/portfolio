# Evaluation

Method: every page was reviewed at 375/390, 768-equivalent and 1440 wide in the in-app browser. Round 1 ran
against the Docker dev server, round 2 against the Docker production build (`docker compose --profile prod up --build prod`).

**Not run: Lighthouse and axe-core.** Both need a Chromium download (Playwright), which the owner asked me not to do.
Instead, round 2 uses an in-page audit script (heading order, accessible names, duplicate ids, broken
`aria-labelledby`, alt text, CLS, JS transfer size, horizontal overflow per route) plus manual contrast maths on the
tokens. Performance and Accessibility scores below are therefore estimates, not Lighthouse numbers.

Mid-build the brief changed from dark to **light mode**. Round 1 scores below are for the light version.

---

## Round 1 (in-app browser, dev server)

### Preloader and logo

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Visual hierarchy | 9 | Monogram centred, counter bottom right, label bottom left. | none |
| Typography | 9 | Mono counter, tabular digits. | none |
| Colour and contrast | 9 | Single cyan node is the only colour. | none |
| Layout and spacing | 9 | Shell gutters match the rest of the site. | none |
| Motion | 9 | Draw 0.9s, node pop, counter eased, logo flies into the nav slot, panel lifts. ~2.2s total. | none |
| Interaction | 9 | Skip button and any key skip. Once per session. | none |
| Responsiveness | 9 | Logo 80px on mobile, 96px desktop. | none |
| Accessibility | 9 | role=status, hidden without JS via `<noscript>`. | none |
| Performance | 10 | SVG + Anime.js only. | none |
| Content | 9 | Name and title only. | none |

### Hero

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Visual hierarchy | 8 | At 800px the outlined "KUMAR" wrapped to two lines. | Mega scale to `clamp(3.25rem,12vw,13.75rem)`, nowrap, smaller indent. **Fixed** |
| Colour and contrast | 7 | After the switch to light, idle nodes (#b9c1cc) and edges almost vanished. | Idle nodes #8e99a8, idle edges #c3cbd5, bigger nodes. **Fixed** |
| Motion | 9 | Topological wave, packets on edges, parallax, scroll fly-through. | none |
| Responsiveness | 9 | 375px: name fits after fix, graph fills the top half. | none |

### About

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Layout | 8 | Stat labels rendered above the numbers. | `flex-col-reverse` on each stat. **Fixed** |
| Content | 9 | Two short paragraphs, three true stats, photo slot with placeholder. | none |

### Selected work

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Layout and spacing | 8 | Headings scrolled under the logo with nothing behind the fixed header. | Fade band behind the header. **Fixed** |
| Visual hierarchy | 9 | Flagship card is full width with the warm marker. | none |

### Experience

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Layout and spacing | 8 | 320px of dead space before Skills (two 160px paddings). | Sections to `py-24 sm:py-32`. **Fixed** |
| Interaction | 8 | Nav pill was 60% transparent, so text showed through it. | Solid surface/85 pill with shadow. **Fixed** |

### Skills

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Layout and spacing | 7 | Empty cell bottom right and a half-empty AI card. | AI spans two rows beside Languages and Backend, DevOps and Frontend split the last row, larger AI chips. **Fixed** |

### Case studies

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Typography | 6 | "TOPOSORT" broke mid-word ("TOPOSOR / T"). Syne ExtraBold is ~1.2em per capital. | Case title `clamp(2.25rem,8vw,8rem)`, next-project `clamp(2rem,7.5vw,8rem)`, contact headline `clamp(2rem,7.5vw,9rem)`. Sized so a 9-letter word fits at 390px. **Fixed** |
| Motion | 9 | Diagram draws edges per Kahn wave, in-degree badges tick to 0 before a node lights. | none |

### Credentials, Contact

| Criterion | Score | Evidence | Fix |
|---|---|---|---|
| Visual hierarchy | 9 | Two balanced cards. Contact headline on three lines over the shader. | none |
| Colour and contrast | 9 | Muted footer labels over the light shader still about 4.7:1. | none |

---

## Round 2 (production build, after owner feedback)

Owner feedback applied before this round:
- Cursor ring removed. Now one dot that swells over links and becomes a "View" pill over project cards.
- The node-graph "signatures" on project cards looked like unrelated neurons. Replaced with product pictures:
  TopoSort RAG execution timeline (wave 1 agents overlap in time), GitSpeak chat with retrieved code,
  FrameBus player with an "up next" column, LLaMA fine-tune GPU memory bar under 16 GB with the real settings.
- GitSpeak code link changed to github.com/vinu0404/mini_mini.

Audit evidence (prod, 1440): 0 duplicate ids, 0 unnamed links or buttons, 0 images without alt, 0 broken
`aria-labelledby`, heading order h1 > h2 > h3 with no skips, CLS 0.000, initial JS 189 KB transferred (3D chunks load
lazily after). All 6 routes: document width = viewport width at 375px. Routes return 200, unknown route 404.

Contrast (WCAG, on #f4f5f7): text #0b0e13 18.9:1, muted #5a6472 5.5:1, accent text #0369a1 5.5:1, warm #c2410c 4.7:1.
Brief cyan #36bcf7 is 2.2:1 on light, so it is only used for non-text light (bars, glows, cursor).

Issues found and fixed in this round:

| Page | Issue (evidence) | Fix |
|---|---|---|
| Case study | At 375px the page was 810px wide: the 760px diagram stretched its grid cell, pushing the Menu button off screen. | `min-w-0` on the grid cell, diagram scrolls inside its own frame. Re-measured: 375px on all routes. |
| Skills | Screen readers read "Languages04". | Counts `aria-hidden`. |
| Global | `noUnusedLocals` failed on Next's generated dev types. | Removed the two extra flags. `strict` stays on. |

### Final scores

| Page | Hierarchy | Type | Colour | Layout | Motion | UX clarity | Responsive | A11y | Perf | Content | **UX** | **UI** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Preloader + logo | 10 | 9.5 | 10 | 9.5 | 10 | 10 | 10 | 9.5 | 10 | 9.5 | **9.8** | **9.7** |
| Hero | 9.5 | 10 | 9.5 | 9.5 | 10 | 9.5 | 9.5 | 9.5 | 8.5 | 10 | **9.5** | **9.7** |
| About | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 10 | 9 | 9.5 | **9.5** | **9.5** |
| Selected work | 10 | 9.5 | 9.5 | 9.5 | 9.5 | 10 | 9.5 | 10 | 10 | 10 | **9.8** | **9.6** |
| Case studies | 9.5 | 9.5 | 9.5 | 9.5 | 10 | 9.5 | 9.5 | 9.5 | 10 | 10 | **9.6** | **9.6** |
| Experience | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 10 | 10 | 9.5 | **9.6** | **9.5** |
| Skills | 9.5 | 9.5 | 9.5 | 9.5 | 9 | 9.5 | 9.5 | 10 | 10 | 9.5 | **9.6** | **9.5** |
| Credentials | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 10 | 9.5 | 10 | 10 | 10 | **9.8** | **9.5** |
| Contact + footer | 10 | 10 | 9.5 | 9.5 | 9.5 | 10 | 9.5 | 9.5 | 9 | 9.5 | **9.6** | **9.7** |
| 404 | 9.5 | 10 | 10 | 9.5 | 9 | 10 | 10 | 10 | 10 | 10 | **9.8** | **9.6** |

Why not 10 where it isn't:
- **Hero perf 8.5 / About perf 9 / Contact perf 9:** three WebGL contexts (graph, gradient, shader) exist on the home page.
  They are lazy, paused off screen and the gradient unmounts when far away, but a mid-range phone will still work hard.
  Not measured with Lighthouse (see method).
- **Motion 9 on Skills / 404:** simple rise and fade, nothing distinctive. Acceptable for a reference section.
- **A11y 9.5 where WebGL or the preloader is involved:** not verified with a screen reader or axe. Reduced motion paths
  are coded (no Lenis, still hero frame, plain fades) but could not be emulated in the pane.
- **Photo slot:** the About figure is a placeholder until a real portrait is added.
