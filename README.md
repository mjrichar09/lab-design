# Lab Design

Working repo for designing an optimal layout for a new lab space. The goal is to
turn a rough, hand-traced floor plan into a validated, space-efficient layout
that equipment, safety, and operations teams can sign off on before it goes to
construction drawings.

## What's here

- `layouts/upstream_lab_layout.html` — the interactive floor plan for the
  **Upstream Process Development Suite**. Open it directly in a browser (no
  server/build step needed). It loads the **v2** (as-provided) arrangement; a
  **Theme** picker at the top restyles the whole sheet between **Blueprint**
  (default), **Hand-drafted** (warm vellum, hand-lettered), and **Cyber — HELIX
  HUD** (neon-on-dark). Drag equipment to reposition, use the corner handle to
  resize, ↻ to rotate, and the sidebar list to rename/add/remove items. Use
  **"Download my edited layout"** to export your edits (and the current theme)
  as a new standalone HTML file.
- `workflows/` — workflow data (activities, ordered station sequences, run
  cadence) plus `compute_walking_distance.py`, which turns that data + a layout
  into a weighted travel chart. See `workflows/README.md`.
- `api/generate-icon.js` — Vercel serverless proxy for the **AI icons** feature
  (see below). Not needed for opening the layout locally.

### AI-generated icons (hosted version only)

On the deployed (Vercel) site, the ✨ button next to each item in the sidebar
asks a Groq LLM to draw a blueprint-style top-down SVG icon for that piece of
equipment. Add optional detail in the inline prompt box (e.g. "4-bucket
front-loading"), press **Draw** (or **Redraw** to redesign an existing AI
icon), and ⟲ reverts to the built-in icon. Generated icons stroke with the
item's category color, restyle with the theme, and survive Saved layouts and
the HTML export. Opening the file locally still works fully — only icon
generation needs the hosted `/api` endpoint.

**Vercel setup:** in the project's settings, add the environment variable
`GROQ_API_KEY` (from console.groq.com). Optional: `GROQ_MODEL` overrides the
default model (`openai/gpt-oss-120b`) — a config change if Groq deprecates the
id. Note the endpoints are unauthenticated on the public URL (prompt/response
lengths are capped server-side).

### Optimize & review (sidebar box)

- **✦ Auto-optimize** — rearranges movable equipment to shorten the daily
  walking paths. A dialog first lets you give items a shared **group letter**
  when they must sit together (a bioreactor and its ATF, a scale beside its
  tank) and tick **Keep fixed** for anything that can't move (existing islands
  are pre-ticked). It runs a constrained simulated-annealing pass that never
  overlaps equipment or leaves the room, shows the before→after walking
  distance, and is fully undoable (Ctrl+Z). Works offline — no server needed.
- **🔍 Review layout** — an AI read of the current layout (walking hot spots,
  clearance/egress problems, adjacency & clean-to-dirty flow) via the
  `api/critique.js` Vercel proxy. Uses the same `GROQ_API_KEY`; needs the
  hosted version (degrades gracefully offline).

### Space summary (as of v2)

- **1,409 SF** working area (traced from the provided site plan), plus an
  adjacent **179 SF** analytical storage room (RM 34166, shown for reference
  only — not counted in the working area and not editable in the tool).
- 3 existing fixed islands (with existing utility drops) are kept in place
  rather than modeled as movable/new casework.
- Equipment currently modeled: large-scale bioreactors (500L/200L/50L) with
  ATF and gas manifold, biosafety cabinet, sample freezer, CO2
  incubator/shaker, cell/metabolite analyzers (Vi-CELL, Nova BioProfile),
  benchtop + continuous (Alfa Laval) centrifuges, Millipore harvest skids,
  handwash/eyewash station, floor scales, mixing rockers, a data station, gas
  manifold, and consumables storage.
- Current equipment footprint is roughly a third of the working area, leaving
  the remainder as open floor / aisle space — see the live stats panel in the
  tool for exact current numbers as the layout is edited.

## Known limitations in the current layout

- Wall shape, column notches, and door positions are still traced by eye from
  a site photo that crops off the room's right side — **not yet confirmed
  against CAD/DWG**.
- Equipment footprints are estimated dimensions, not verified against
  manufacturer spec sheets or vendor drawings.
- Layout has not been validated for workflow efficiency (walking distance
  between process steps, aisle widths, clearances for door swings/service
  access).
- The list of equipment may not be complete — see `TODO.md`.

## How to use this repo

1. Open `layouts/upstream_lab_layout.html` in a browser to view/edit the
   layout; use the Theme picker to switch between Blueprint, Hand-drafted, and
   Cyber looks.
2. Track outstanding design work in `TODO.md`.
3. Fill in the workflow data templates in `workflows/` to describe daily and
   per-run activities — this feeds the walking-distance analysis (see
   `workflows/README.md`).
4. To keep a new arrangement, add it as a preset in the `LAYOUTS` registry in
   `layouts/upstream_lab_layout.html` so prior iterations stay available for
   comparison in the dropdown. (The tool's "Download my edited layout" export
   produces a standalone one-off file pinned to the current on-screen layout.)
