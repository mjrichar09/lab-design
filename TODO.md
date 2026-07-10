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

- [ ] Replace estimated dimensions with manufacturer spec-sheet footprints
      (W x D, plus service/access clearance) for each item, especially:
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
- [ ] Confirm the osmometer and sample-prep cart mentioned in the design
      notes (assigned to "Island 3") are actually represented in the item
      list.
- [ ] Review RM 34166 (adjacent analytical storage) contents to see if
      anything there should move into or interact with the working area.

## 4. Optimize layout for space utilization & operations

- [ ] Model the actual process flow sequence (inoculation → bioreactor →
      harvest → centrifugation → sample analysis) and lay out equipment in
      that order to minimize backtracking.
- [ ] Estimate walking distances between linked steps (e.g. bioreactor to
      harvest skid to centrifuge to analytics island) and iterate placement
      to minimize them.
- [ ] Check aisle widths meet ergonomic/code minimums for cart and personnel
      traffic, especially at pinch points near doors.
- [ ] Re-check the 33.9% occupied-area figure once footprints/clearances are
      corrected — decide if there's room to consolidate aisles or if more
      space is needed.
- [ ] Produce 2-3 alternative layout options (e.g. process-flow-optimized vs.
      minimal-disruption-to-existing-islands) and compare tradeoffs.

## 5. Sign-off

- [ ] Review with EHS for safety/egress compliance.
- [ ] Review with facilities/engineering against CAD.
- [ ] Review with process/operations team for workflow validation.
