# TODO

Goal: design an optimal layout for the new Upstream Process Development Suite
that maximizes usable space and minimizes wasted walking distance between
related process steps.

## 1. Verify room geometry

- [ ] Confirm true wall shape, column notches, and door positions against
      CAD/DWG (current trace is by eye from a site photo that crops off the
      room's right side).
- [ ] Confirm the true right-hand wall location.
- [ ] Confirm island spacing/positions against as-built drawings — islands
      are currently placed "roughly" in their real positions.
- [ ] Confirm which utilities (power, drain, vacuum, gas) are actually
      plumbed to each existing island before assigning equipment that needs
      them.

## 2. Improve equipment footprint accuracy

- [~] Replace estimated dimensions with manufacturer spec-sheet footprints
      (W x D, plus service/access clearance) for each item. **Research draft
      started in `workflows/equipment_footprints.md`** — found cited dims for
      Vi-CELL BLU, Nova FLEX2, and BIOSTAT STR 500 (vessel + control tower;
      the current 7×7.5 box is ~2× the true hardware footprint). Still needs
      vendor spec sheets for ATF 6, Alfa Laval centrifuge, Millipore skids,
      200L/50L, scales, rockers — and confirmation before applying to layouts:
  - Sartorius BIOSTAT STR 500L + control tower
  - 200L / 50L bioreactors
  - ATF 6
  - Alfa Laval continuous centrifuge (single-use)
  - Millipore harvest skids (5x and 10x capsule)
  - Biosafety cabinet, CO2 incubator/shaker, sample freezer
  - Vi-CELL BLU, Nova BioProfile FLEX2
  - Floor scales (1000 kg / 500 kg / 150 kg)
- [ ] Add required clearance zones (door swing, service access panels, fire
      code aisle minimums) as distinct footprint from the equipment itself.
- [ ] Note utility requirements per item (power draw, drain, CO2/N2/O2/air,
      vacuum, WFI/DI) so utility drops can be matched to placement.

## 3. Add missing equipment

- [ ] Audit against the full upstream process workflow to identify gaps —
      likely candidates: pH/DO calibration station, media prep area, buffer
      prep, single-use bag storage/staging, waste carts, PPE/gowning area,
      documentation/QA station, additional data stations near each
      bioreactor.
- [~] Confirm the osmometer and sample-prep cart mentioned in the design
      notes (assigned to "Island 3") are actually represented in the item
      list. Neither is currently a separate station. **Likely the "osmometer"
      is the Nova FLEX2's optional osmometer module** (see
      `equipment_footprints.md`) rather than a standalone unit — confirm before
      adding one. Sample-prep cart still needs to be added if it's real.
- [ ] Review RM 34166 (adjacent analytical storage) contents to see if
      anything there should move into or interact with the working area.

## 4. Optimize layout for space utilization & operations

- [x] Stand up fill-in templates for workflow data (`workflows/`) to collect
      activity sequences, frequency, and people-per-trip — needed to compute
      walking distance. Waiting on these to be filled in.
- [x] Model the actual process flow sequence (inoculation → bioreactor →
      harvest → centrifugation → sample analysis). Captured in
      `workflows/activity_steps_template.csv`.
- [x] Compute the weighted travel (From-To) matrix from `workflows/` data
      and current layout coordinates; identify highest-weight station pairs.
      See `workflows/walking_distance_analysis.md` — daily sampling is ~85%
      of foot traffic; bioreactor↔island legs dominate.
- [x] Estimate walking distances between linked steps and iterate placement
      to minimize them. Produced the walking-distance-optimized **v3** preset
      (~57% less walking, same footprint). **Pending user confirmation of
      assumptions** (media fridge, per-trip bioreactor targets).
- [x] Add a dedicated media refrigerator to the prep cluster (referenced by
      3 workflows, previously proxied by the freezer) and re-run the analysis.
      Added `fridge` station to both layouts; passage/inoculation activities
      now route to it; analysis + station reference updated (straight-line
      v2 404 / v3 183 ft/day).
- [ ] Confirm which specific bioreactor/rocker/skid each activity targets,
      then re-run `compute_walking_distance.py`.
- [ ] Check aisle widths meet ergonomic/code minimums for cart and personnel
      traffic, especially at pinch points near doors.
- [ ] Re-check the 33.9% occupied-area figure once footprints/clearances are
      corrected — decide if there's room to consolidate aisles or if more
      space is needed.
- [ ] Produce 2-3 alternative layout options (e.g. process-flow-optimized vs.
      minimal-disruption-to-existing-islands) and compare tradeoffs.
- [ ] Respect "must-stay-together" adjacency constraints in any optimization.
      Some equipment has to remain paired/co-located regardless of walking-
      distance math — e.g. **each floor scale next to its respective
      bioreactor/collection tank**, ATF next to its bioreactor, gas manifold
      reachable by the reactors it feeds. Capture the full list of hard
      adjacency (and any minimum-separation) constraints and enforce them so
      the optimizer can't split pairs apart to shave a few feet.

## 5. Layout tool / editor improvements

- [x] Consolidate the two duplicated layout files into a single
      `layouts/upstream_lab_layout.html` with v2/v3 as built-in **presets**
      (a `LAYOUTS` registry + `ITEMS_V2`/`ITEMS_V3`), chosen from a "Layout
      preset" dropdown and persisted. Removes ~1,650 lines of mirrored tooling
      per file; export pins to the on-screen arrangement;
      `compute_walking_distance.py` takes a preset arg. Walking-distance totals
      unchanged (v2 403.7 / v3 183.2 ft/day), confirming a clean move.
- [x] Make equipment rotatable. The ↻ button now rotates in 45° steps (stored
      as `rot`, applied via CSS transform; label/dim-tag counter-rotate to stay
      readable). Obstacle routing uses the rotated bounding box. *Follow-up:
      exact-polygon (non-AABB) collision for rotated boxes if the AABB
      approximation proves too conservative at 45°.*
- [x] Lock size by default to prevent accidental resize while dragging. A
      "Lock sizes" toggle (on by default) hides the corner resize handle so
      dragging never resizes; sizes are still editable on purpose via the
      sidebar W×H fields (or by unchecking the toggle).
- [x] Savable layouts. Sidebar "Saved layouts" box: name and save the current
      arrangement, keep several, switch via a dropdown + Activate, update/delete,
      and export/import as JSON. Persists to localStorage (with in-session
      fallback if storage is blocked).

## 6. Sign-off

- [ ] Review with EHS for safety/egress compliance.
- [ ] Review with facilities/engineering against CAD.
- [ ] Review with process/operations team for workflow validation.

## 7. Potential future tool features (backlog)

Ideas surfaced while building the design tool; ordered roughly by value. The
first (clearance & egress checks) is **done** — see `Status_update.md`.

- [x] **Clearance & egress checks** — live overlay flagging too-narrow aisles
      (settable min), equipment overlaps (ignoring intentional stacking), and
      anything blocking a door / exit. Reuses the box geometry + `DOORS`.
- [x] **AI-generated equipment icons (Groq)** — ✨ per item in the sidebar asks
      a Groq LLM (via the `api/generate-icon.js` Vercel proxy; `GROQ_API_KEY`
      env var) for a top-down blueprint-style SVG icon; optional detail prompt,
      redraw, and revert-to-built-in. Icons stroke with the category color and
      re-theme automatically; sanitized on generation and on every load path.
      Decision: Groq has no image generation, so icons are LLM-written SVG
      (better theme fit than raster anyway). Also fixed pre-existing standalone
      bugs: gated the claude.ai artifact shim (fetch/`URL.createObjectURL` were
      hijacked, breaking the export download outside claude.ai) and `<`-escaped
      the export's inline JSON. *Follow-up: the endpoint is public — consider a
      simple per-IP throttle.*
- [ ] **Equipment library** — drag common lab gear from a palette pre-loaded
      with real footprints/categories (seed from `workflows/equipment_footprints.md`)
      instead of add-then-resize.
- [ ] **Utilities & requirements roll-up** — tag each item with power/gas/drain/
      vacuum/exhaust/floor-load needs; total them for facilities and optionally
      mark utility drops on the plan and flag items placed far from them.
- [x] **Auto-optimize placement** — ✦ Auto-optimize rearranges movable
      equipment to shorten the weighted walking paths. Pre-run dialog captures
      "sit-together" groups + "keep fixed" items (islands pre-locked);
      constrained simulated-annealing keeps everything non-overlapping and
      in-bounds, shows before→after distance, and is undoable. *Follow-up:
      nearest-exit distance readout via the router; honor min-aisle as a soft
      objective term too.*
- [x] **Layout critic (AI review)** — 🔍 Review layout sends the layout +
      walking stats + clearance issues to a Groq LLM (`api/critique.js` proxy)
      and returns plain-English, item-specific suggestions on walking, clearance/
      egress, and adjacency/flow. Needs the hosted version; degrades offline.
- [ ] **Functional zones** — draw/label areas (prep, upstream, harvest, storage,
      gowning); per-zone area + check equipment sits in the right zone.
- [ ] **Adjacency rules** — "must be near" / "must be apart" constraints with
      live warnings (e.g. BSC↔incubator together; freezer away from heat).
- [ ] **Traffic / congestion heatmap** — shade where the defined paths concentrate
      foot traffic so those aisles can be widened.
- [ ] **Process-flow direction** — clean-to-dirty / unidirectional material-flow
      arrows + a check the layout follows them.
- [ ] **Equipment schedule / BOM export** — print/CSV table of all items with
      dimensions, category, utilities, counts, for procurement.
- [ ] **Background floor-plan underlay** — drop a scaled CAD/photo image to trace
      the real room instead of the hand-traced walls.
- [ ] **Editing QoL** — undo/redo, alignment guides, overlap snapping.
