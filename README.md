# Lab Design

Working repo for designing an optimal layout for a new lab space. The goal is to
turn a rough, hand-traced floor plan into a validated, space-efficient layout
that equipment, safety, and operations teams can sign off on before it goes to
construction drawings.

## What's here

- `layouts/upstream_lab_layout.html` — the interactive floor plan for the
  **Upstream Process Development Suite**. Open it directly in a browser (no
  server/build step needed). A **Layout preset** dropdown at the top switches
  between **v2** (the as-provided arrangement) and **v3** (a walking-distance-
  optimized rearrangement of the same equipment — ~57% less daily walking, same
  footprint; see `workflows/walking_distance_analysis.md` for the rationale and
  numbers). Drag equipment to reposition, use the corner handle to resize, ↻ to
  rotate, and the sidebar list to rename/add/remove items. Use **"Download my
  edited layout"** to export your edits as a new standalone HTML file.
- `workflows/` — workflow data (activities, ordered station sequences, run
  cadence) plus `compute_walking_distance.py`, which turns that data + a layout
  into a weighted travel chart. See `workflows/README.md`.

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
   layout; use the preset dropdown to compare v2 and v3.
2. Track outstanding design work in `TODO.md`.
3. Fill in the workflow data templates in `workflows/` to describe daily and
   per-run activities — this feeds the walking-distance analysis (see
   `workflows/README.md`).
4. To keep a new arrangement, add it as a preset in the `LAYOUTS` registry in
   `layouts/upstream_lab_layout.html` so prior iterations stay available for
   comparison in the dropdown. (The tool's "Download my edited layout" export
   produces a standalone one-off file pinned to the current on-screen layout.)
