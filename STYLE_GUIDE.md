# Style Guide — "HELIX HUD" cyber-future theme (branch: `claude/cyber-theme`)

> **Scope of this branch.** A deliberate visual experiment: a *Sleek sci-fi HUD*
> re-skin applied to **`layouts/upstream_lab_layout_v2.html` only**. v3 stays on
> the current light system. This intentionally breaks the usual "keep v2 and v3
> in visual parity" convention — that's the point of the experiment, so don't
> "fix" the divergence.
>
> **Hard constraints kept:** self-contained, offline, single HTML file, no
> external fonts/scripts/CDNs. All effects are inline CSS/SVG. It stays a
> *functional, to-scale* planning tool — legibility wins ties.
>
> Status: **spec only — no HTML changes made yet.** This is the plan to build to.

## Direction

Dark "holographic console": a near-black navy field, a faint tech-grid, and
ice-blue / violet neon used *surgically* on interactive and active elements
(selection, active walking paths, focus, the occupancy meter). Glow is an
accent, never applied to small functional text. Think spaceship console / Tron-lite, not neon-grunge.

## Palette

Dark base with two accents (ice = primary, violet = secondary) plus semantic
signal colors. Body text `#e2e8f0` on `#0b1020` ≈ 13:1 contrast.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b1020` | page background (deep navy-black) |
| `--bg-2` | `#070b16` | stage / room interior, vignette core |
| `--surface` | `rgba(18,26,45,0.72)` | glass panel fill (with blur) |
| `--surface-solid` | `#121a2d` | inputs, solid chips |
| `--edge` | `rgba(125,211,252,0.25)` | panel & control borders (faint ice) |
| `--grid-line` | `rgba(125,211,252,0.06)` | background tech-grid |
| `--scanline` | `rgba(125,211,252,0.035)` | CRT scanline overlay |
| `--text` | `#e2e8f0` | primary text |
| `--text-dim` | `#8aa0b8` | secondary / hints |
| `--text-mute` | `#5f7286` | tertiary / disabled |
| `--ice` | `#7dd3fc` | primary accent: interactive, highlights, meter |
| `--ice-bright` | `#a5e8ff` | glow core / hover |
| `--violet` | `#a78bfa` | secondary accent: selection, secondary actions |
| `--violet-bright` | `#c4b5fd` | selection glow core |
| `--danger` | `#fb7185` | delete, eyewash/safety, negative signals only |
| `--ok` | `#34d399` | positive/confirmation (sparingly) |

**Glow tokens** (box/text-shadow):
- `--glow-ice`: `0 0 5px rgba(125,211,252,.55), 0 0 14px rgba(125,211,252,.28)`
- `--glow-violet`: `0 0 5px rgba(167,139,250,.55), 0 0 14px rgba(167,139,250,.28)`

## Functional color systems (remapped for dark)

These carry meaning, so identity is preserved — just brightened for the dark
field and given translucent fills so the grid reads through them (glass feel).

**Equipment categories** (`COLORS` = border, `FILLS` = fill):

| Category | Border | Fill |
|---|---|---|
| teal — bioreactors / ATF | `#2dd4bf` | `rgba(45,212,191,0.12)` |
| amber — centrifugation | `#fbbf24` | `rgba(251,191,36,0.12)` |
| plum — harvest / filtration | `#c084fc` | `rgba(192,132,252,0.12)` |
| slate — utilities / storage | `#94a3b8` | `rgba(148,163,184,0.12)` |
| blue — custom / user-added | `#60a5fa` | `rgba(96,165,250,0.12)` |

**Walking-path overlay** (keep distinct; each gets a matching glow via SVG
`drop-shadow`): sampling `#ff6b4a` · harvest `#2dd4bf` · passage `#c084fc` ·
inoculate-rocker `#fbbf24` · inoculate-bioreactor `#38bdf8`.

## Type

- **Family:** IBM Plex Mono, unchanged (already techy, and keeps us offline).
  *Note:* a display face (Orbitron/Rajdhani) would need to be base64-embedded to
  stay offline and would bloat the file — recommend against unless you want it.
- **Headers (h1/h2):** uppercase, `letter-spacing: 0.14em`, `--ice`, subtle
  `--glow-ice`. H1 gets a thin HUD bracket/underline rule.
- **Big stat numbers** (occupancy %, walking total): mono, tabular, faint glow.
- **Equipment labels & dimension tags:** normal weight, `--text`, **solid dark
  text-shadow for contrast — no neon glow** (legibility guardrail).

## Effects (all four enabled)

1. **Neon glow** — on: selected equipment (violet), focused inputs & hovered
   buttons (ice), active walking paths + their nodes, the occupancy-meter fill,
   headers. Not on body copy or dim tags.
2. **Grid / scanline backdrop** — the stage keeps its to-scale 1-ft grid but
   drawn in `--grid-line`; add a faint full-bleed tech-grid behind the app and a
   low-opacity horizontal `--scanline` overlay on the stage. Subtle only; the
   functional grid must stay the most legible grid.
3. **Motion** — active walking path animates its draw (stroke-dashoffset, ~600ms
   ease-out); start-nodes pulse (1.6s loop); selected equipment has a soft glow
   pulse; buttons ramp glow on hover; optional very-slow grid drift (~40s).
   **All motion wrapped in `@media (prefers-reduced-motion: reduce)` → off.**
4. **Glass panels** — sidebar and the walkbox/savebox use `--surface` +
   `backdrop-filter: blur(12px)` + 1px `--edge` + a 1px inner top highlight.
   Provide a solid `--surface-solid` fallback where `backdrop-filter` is
   unsupported.

## Component treatments

- **Sidebar / boxes:** glass, ice-edged; section headers as HUD labels.
- **Buttons:** translucent dark, `--edge` border, ice text; hover = ice glow +
  brighten. Primary ("Download my edited layout") = ice-filled, dark text.
- **Inputs / selects:** `--surface-solid`, `--edge` border; focus = ice glow.
- **Occupancy meter:** dark track; fill = ice→violet gradient with glow.
- **Legend:** neon dots matching the category borders.
- **Room shell:** walls/notches/doors in `--ice` lines (not dark ink); the
  "~1,409 SF" tag in ice/violet.
- **Equipment boxes:** translucent category fill, neon category border, faint
  outer glow; **selected** = violet glow + pulse; labels stay high-contrast.
- **Walking paths:** glowing polylines with animated draw; pulsing start nodes.

## Guardrails (functional tool first)

- Small functional text (labels, dim tags, stats rows) stays high-contrast; glow
  decorates, it is never the only signal.
- The to-scale grid must remain readable — decorative grid/scanlines stay subtle.
- Respect `prefers-reduced-motion`.
- **Print/PDF:** the current print CSS hides the sidebar; add a print override so
  the plan prints on **white with dark lines/labels** (don't print the dark
  theme). This keeps "Print / PDF" usable.
- Still one offline HTML file — no external deps.

## Build order (once approved)

1. Add the `:root` token block + base/background (bg, grid, scanline) to v2.
2. Reskin chrome: sidebar/glass panels, buttons, inputs, meter, legend, headers.
3. Remap `COLORS`/`FILLS` + room-shell SVG colors; verify equipment legibility.
4. Reskin the walking-path overlay (glow + node pulse + animated draw).
5. Add motion + `prefers-reduced-motion` and the print override.
6. Verify headless in a browser (light-text contrast, paths, print) before commit.
