# Lab Design

Working repo for designing an optimal layout for a new lab space. The goal is to
turn a rough, hand-traced floor plan into a validated, space-efficient layout
that equipment, safety, and operations teams can sign off on before it goes to
construction drawings.

## What's here

- `layouts/upstream_lab_layout_v2.html` — an interactive, single-file HTML floor
  plan editor for the **Upstream Process Development Suite**. Open it directly
  in a browser (no server/build step needed). Drag equipment to reposition,
  use the corner handle to resize, ↻ to rotate, and the sidebar list to
  rename/add/remove items. Use **"Download my edited layout"** to export your
  edits as a new standalone HTML file.

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

1. Open `layouts/upstream_lab_layout_v2.html` in a browser to view/edit the
   current layout.
2. Track outstanding design work in `TODO.md`.
3. When you export an edited layout from the tool, save it into `layouts/`
   with an incremented version suffix (e.g. `_v3`) so prior iterations stay
   available for comparison.
