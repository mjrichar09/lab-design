# Walking-distance analysis — v2 (current) vs. v3 (optimized)

Generated with `compute_walking_distance.py`, which reads station coordinates
straight from the layout HTML and the workflow data in this folder. Re-run it
any time the workflow data or a layout changes:

```
python3 compute_walking_distance.py ../layouts/upstream_lab_layout_v2.html
python3 compute_walking_distance.py ../layouts/upstream_lab_layout_v3.html
```

## Method

This is a standard **From-To (travel) chart**: for every activity we walk its
ordered sequence of stations, sum the straight-line (centroid-to-centroid) leg
distances, then weight by **how often the activity happens** and **how many
people** do it. Everything is normalized to a common **trips-per-day** basis so
frequent and rare activities can be compared.

Normalization uses the run cadence you provided: **3 runs/month → ~0.099
runs/day**, so a "1 per run" activity contributes ~0.099 trips/day.

| activity | freq | people | basis used |
|---|---|---|---|
| Daily sampling | 2 / day | 1 | modeled once **per active bioreactor** (500L, 200L, 50L) since up to 3 runs can be concurrent |
| Harvest to centrifuge | 1 / run | 2 | 0.099 / day |
| Passage shake flask | 2 / week | 1 | 0.286 / day |
| Inoculate rocker | 1 / run | 1 | 0.099 / day |
| Inoculate bioreactor | 1 / run | 2 | 0.099 / day |

## Result

| | Total walking | vs. current |
|---|---|---|
| **v2 (current)** | **428.5 ft/day** | — |
| **v3 (optimized)** | **184.0 ft/day** | **−57%** |

Equipment footprint is unchanged (**~33%** of the 1,408 SF working area) — this
is purely rearrangement, not densification, so aisles and open floor are
preserved.

## Why the current layout is inefficient

**Daily sampling is ~85% of all foot traffic** (363 of 428 ft/day). It runs
2×/day per active bioreactor and follows *bioreactor → analytics island → data
station → back*. In v2 the bioreactors sit on the **far-right wall (x≈38)** while
the analytics island and data station are on the **far-left (x≈10–12)**, so every
single sample walks the full ~28–30 ft width of the room and back. The six
heaviest legs in the travel chart are all bioreactor↔island / bioreactor↔data
station.

A secondary loser: the **prep loop** (passaging + inoculation) repeatedly moves
between the **freezer (top-left, y≈2)** and the **BSC + incubator (bottom-left,
y≈30)** — used together but ~28 ft apart.

## What v3 changes

1. **Central bioreactor bay.** The 50L / 200L / 500L reactors (+ ATF, gas
   manifold) move off the right wall into a bay **immediately east of the fixed
   analytics island**, with the data station tucked between them. The dominant
   sampling leg drops from ~28–30 ft to ~8–14 ft. This single change accounts
   for most of the savings.
2. **Tight prep cluster.** Incubator, freezer (media), and BSC are grouped in
   the lower-left corner so the passage/inoculation loop stops crossing the
   room. Passage walking per trip drops from ~130 ft to ~52 ft.
3. **Low-frequency equipment to the perimeter.** Harvest skids, continuous
   centrifuge, and floor scales — used ~0.1–0.2×/day — go to the lower-right and
   right wall, where longer walks cost almost nothing in the weighted total.

The one leg that gets slightly *worse* in v3 is harvest (500L → skid →
centrifuge), because the 500L moved toward the island and away from the harvest
train. At 0.099 runs/day × 2 people that's ~1.5 extra ft/day — a rounding error
against the ~245 ft/day saved on sampling.

## Assumptions & caveats (please confirm)

- **The analytics island is treated as fixed casework** (existing utility
  drops) — everything else is arranged around it. If the island *can* move,
  there's likely a bit more to gain.
- **A media refrigerator is referenced by three workflows but does not exist as
  a station.** The `-20/-80 freezer` is used as a proxy in the math. This is a
  missing-equipment item — adding a dedicated media fridge in the prep cluster
  would make the model (and the real workflow) cleaner.
- **Which specific bioreactor / rocker each trip targets is assumed** where the
  narrative was ambiguous (e.g. inoculate-bioreactor → 50L seed; harvest → 500L
  + 10-capsule skid + 1000 kg collection tank). Correct these in
  `compute_walking_distance.py`'s `activities()` if the real targets differ.
- **Straight-line distances**, centroid to centroid, in this document and in
  `compute_walking_distance.py`. The room is fairly open so this is a good first
  approximation. The **interactive layouts (`layouts/*.html`) now additionally
  offer obstacle-aware routing** (paths walk *around* equipment), which reads
  higher in absolute terms — roughly **v2 ≈ 623 ft/day and v3 ≈ 213 ft/day** —
  but widens rather than narrows the gap (v3 is ~66% less walking than v2 when
  routed, vs. 57% straight-line), so the conclusion is unchanged.
- **Concurrency:** daily sampling is modeled for all three reactor scales
  because up to 3 runs can be concurrent. If in practice a run scales up
  sequentially (50L → 200L → 500L) rather than three reactors running at once,
  the absolute numbers shrink but the *ranking* — bioreactors belong next to
  the island — does not change.

## Next refinements

- Add the media refrigerator and re-run.
- Confirm bioreactor/rocker/skid targets per activity.
- Once manufacturer footprints + clearances are in (see `../TODO.md` §2),
  re-check that the central bay actually fits with service access around the
  500L, and that aisles between the bay and island meet code minimums.
