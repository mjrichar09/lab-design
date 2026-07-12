# Status Update

> **Placeholder / stub.** A running, session-level build log — "what already
> exists / did we already do X?" Add one short summary entry per session (at
> session end), newest first. Keep it to outcomes; git history has the detail.

## 2026-07-12 — user-configurable walking paths

- Replaced the hard-coded `ACTIVITIES` array with an editable `walkPaths` model
  (one row per path; a path can have several disjoint legs). The walk panel now
  lets you rename a path, set its **frequency** (a number + per-day / per-month
  toggle), toggle it on the plan, and **delete** it.
- Added a **Define path** click-builder: press it, click each object in order
  (routed connecting lines draw live; dragging is suppressed), use **New leg** for
  a disjoint segment, then **Done** (or Cancel / Esc). New path gets the next free
  `PATH_PALETTE` colour and a default 1/day.
- Paths **persist with the layout** — stored in Saved layouts (record is now
  `{items, walkPaths}`, back-compatible with the old array shape) and baked into
  the HTML export via a `let walkPaths = […]` literal (mirrors the `items` trick).
- Reused the existing obstacle-aware router and `pathLayer`, so custom paths route
  around equipment like the built-ins. Seeded totals dropped from ~596→585 ft
  because the old people-multiplier was folded into a plain frequency (per the
  chosen day/month model); values are editable seeds.
- Note: `workflows/compute_walking_distance.py` still has its own activity list;
  in-tool custom paths don't feed it (possible follow-up: read `walkPaths` from an
  exported file).
- Verified headless (Edge): build flow incl. multi-leg + suppressed drag,
  frequency recompute, delete, save/restore, export→reopen round-trip, 3-leg
  sampling draw, 0 genuine route cut-throughs, all three themes clean.

## 2026-07-11 — hand theme: ruler-straight ink

- Dropped the `feDisplacementMap` roughen filters from the hand theme (walls,
  doors, shelves, and walk paths) so every line is ruler-straight. The
  hand-drafted feel now comes from the vellum palette, hand-lettering, sketch
  corners, and the wall drawing itself on — just without the wobble.

## 2026-07-11 — routing fix, fit-to-width, label auto-placement, preset dropdown retired

- **Collision avoidance fixed.** The visibility-graph router was letting legs cut
  diagonally through an obstacle (it skipped a box when the segment endpoint was
  that box's own corner) and, when a station sat inside shared furniture, falling
  back to a straight line that clipped nearby boxes. Now: corner-to-corner
  visibility no longer skips owner boxes (diagonals through interiors are
  rejected, edge-hugging runs still pass), and start/end skip *every* box the
  endpoint is inside. Verified in a real browser (headless Edge): 0 genuine
  cut-throughs across all activity legs; the only remaining crossings are
  equipment stacked on shared islands (unavoidable). Total ≈596 ft.
- `endDrag`/`endResize` now re-render, so the routed paths + distance update the
  moment you drop or resize an object (previously they stayed straight-line until
  the next interaction).
- **Fit-to-width / adjustable scale.** `PPF` (pixels-per-foot) is now dynamic; a
  Scale slider + "Fit width" button rescale the whole drawing (walls, equipment,
  paths) together, defaulting to fit the canvas and re-fitting on window resize.
- **Label auto-placement.** Each equipment name now fits inside its box (wrapping
  to 2 lines), rotates 90° to read along a tall-narrow box, or is written just
  beside the box when it's too small — chosen by a size estimate, so it adapts as
  you zoom. Verified real-DOM: 0 inside-labels overflow their box.
- **Layout-preset dropdown removed** (we have Saved layouts). v2 is the default
  arrangement and is also seeded as a restorable **"Default (v2)"** saved layout.
- **Renamed default equipment:** STR500, STR200, STR50, Bench (was "Existing
  island 1…"), Vi-Cell Blu, Flex 2. Station ids are unchanged, so the
  walking-distance activities + Python script still line up.

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
