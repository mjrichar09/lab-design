# Status Update

> **Placeholder / stub.** A running, session-level build log — "what already
> exists / did we already do X?" Add one short summary entry per session (at
> session end), newest first. Keep it to outcomes; git history has the detail.

## 2026-07-11 — cyber theme added; v3 preset removed

- Added a third theme, **Cyber — HELIX HUD** (neon-on-dark: glass panels,
  cyan/violet glow, drifting grid + scanline overlay, glowing draw-on walk
  paths), ported from `claude/cyber-theme`. Same two-part pattern as hand: a
  scoped `:root[data-theme="cyber"]` CSS block + a `cyber` entry in the JS
  `BG_THEMES` registry. Equipment is now theme-aware — `COLORS`/`FILLS` reference
  `--cat-*` / `--fill-*` tokens the themes override (blueprint/hand keep the
  original values, so no change there).
- **Removed the v3 preset** (`ITEMS_V3` + its `LAYOUTS` entry, ~6.7 KB). v2 is
  now the sole layout preset; `compute_walking_distance.py` and the docs were
  updated to drop the `v3` arg. The v2↔v3 rationale still lives in
  `workflows/walking_distance_analysis.md` and git history.
- Verified headless (jsdom): clean load, preset list is just `v2`, all three
  themes switch and revert, walk total unchanged (598 ft) across themes.

## 2026-07-11 — hand-drafted theme added as a picker

- Ported the vellum / hand-lettered look from `claude/hand-drafted-style`
  into `layouts/upstream_lab_layout.html` as a **Theme** dropdown (Blueprint /
  Hand-drafted) sitting next to Layout preset — the two axes are independent.
- Blueprint stays the default and renders unchanged; Hand-drafted swaps the
  palette, display/annotation fonts (Architects Daughter / Caveat), roughen SVG
  filters, sketch-edged boxes, inked walk paths, and wall-draw + sketch-in load
  animations. Driven by `data-theme` on `<html>` + scoped CSS; the background
  SVG is now built by a themeable `buildBg()` reading a `BG_THEMES` registry.
- Theme persists to `localStorage` and is pinned into exported layouts.
  Verified headless (jsdom): clean load, live switch, and revert.

## 2026-07-11 — layouts consolidated into one app

- Collapsed the duplicated `_v2`/`_v3` HTML files (~1,650 identical tooling
  lines each) into a single `layouts/upstream_lab_layout.html`; v2 and v3 are
  now built-in **presets** (`ITEMS_V2`/`ITEMS_V3` + a `LAYOUTS` registry) chosen
  from a "Layout preset" dropdown, with the choice persisted. Tooling now lives
  in exactly one place — no more mirroring changes across two files.
- `compute_walking_distance.py` takes a preset arg (`… upstream_lab_layout.html v3`);
  totals unchanged (v2 403.7 / v3 183.2 ft/day straight-line), confirming a
  clean coordinate move.
- "Download my edited layout" now pins the export to the on-screen arrangement.
- Old `_v2.html` / `_v3.html` removed (history in git). Docs updated.

## 2026-07-10 — initial build

- Repo seeded: `README`, `TODO`, `CLAUDE.md`, and two interactive floor-plan
  layouts (`layouts/upstream_lab_layout_v2.html` = as-provided,
  `upstream_lab_layout_v3.html` = walking-distance-optimized, ~57% less walking).
- Workflow data captured in `workflows/` (activities, step sequences, run
  cadence, station reference) and a From-To travel-chart calculator
  (`compute_walking_distance.py`) + written analysis.
- Layout tool gained an interactive walking-distance panel with obstacle-aware
  path routing (merged, PR #1).
- In flight (PR open, unmerged): editor features (rotate / lock-size / saved
  layouts), a dedicated media refrigerator, and an equipment-footprint research
  draft.
- Doc placeholders scaffolded: `PLAN.md`, `STYLE_GUIDE.md`, `humantest.md`,
  this file.

_Next entry goes above this line._
