# Equipment footprint reference (research draft — verify before applying)

Purpose: replace the layout's estimated footprints with real
manufacturer-spec-sheet dimensions (TODO §2). This is a **research draft** —
values pulled from public product pages/datasheets and should be confirmed
against the official spec sheet for the exact model/configuration and your PO
before the layout is changed. Nothing here has been applied to the layouts yet.

Conversion note: layout footprints are **plan-view W × D in feet** (what the
box occupies on the floor). Manufacturers usually quote W × D × H in mm/inches;
only W and D matter for the floor plan. 1 ft = 305 mm = 12 in.

## Found — reasonably confident

| Equipment | Layout id | Spec footprint (W × D) | In feet (W × D) | Current box (W × H) | Note |
|---|---|---|---|---|---|
| Vi-CELL BLU cell viability analyzer | `vicell` | 420 × 540 mm (16.5 × 21.3 in) | ~1.4 × 1.8 ft | 2.2 × 2.2 ft | Benchtop; current box a bit generous but fine with bench clearance. |
| Nova BioProfile FLEX2 | `nova` | 17 × 25 in (base); 25 × 25 in with osmometer module | ~1.4 × 2.1 ft (base); ~2.1 × 2.1 ft w/ osmometer | 2 × 2 ft | Benchtop. **The FLEX2's optional osmometer module may be the "osmometer" from the design notes** — check whether a separate osmometer is really needed (TODO §3). |
| Sartorius BIOSTAT STR 500 — bag holder + TCU | `sartorius500` | 815 × 1061 mm (32 × 42 in) | ~2.7 × 3.5 ft | 7 × 7.5 ft (vessel + tower combined) | Vessel skid only. |
| Sartorius BIOSTAT STR 500 — control tower | (part of `sartorius500`) | 800 × 850 mm (31.5 × 33.5 in), 7.32 ft² | ~2.6 × 2.8 ft | — | Separate tower; often placed beside the vessel. |

**Implication for the 500L:** the vessel (~2.7 × 3.5 ft) + control tower
(~2.6 × 2.8 ft) sum to roughly **20–25 ft² of hardware**, versus the **52.5 ft²
(7 × 7.5)** box in the layout. The current box is effectively hardware +
operator/service space rolled into one. Decide whether to (a) shrink it to the
true hardware footprint and model operator clearance separately, or (b) keep the
generous box as a hardware-plus-clearance envelope. Recommend (a) — model
clearance as its own zone (TODO §2, "clearance zones") so aisles are explicit.

## Typical sizes — confirm against actual model

These follow common/NSF-standard sizes; confirm the specific model.

| Equipment | Layout id | Typical footprint (W × D) | Current box | Note |
|---|---|---|---|---|
| Biosafety cabinet, Class II | `bsc` | 6 ft models: ~6 × 2.5–3 ft (cabinet); base stand similar | 6 × 3 ft | Looks right for a 6-ft unit; add front working clearance + sash swing. |
| CO2 incubator / shaker | `incubator` | Single stack ~2.5–3 × 2.5–3 ft | 3 × 2.5 ft | Reasonable; large-capacity shakers run bigger. |
| −20/−80 °C freezer | `freezer` | Upright ~2.5–3.5 × 2.5–3 ft | 3 × 3 ft | Reasonable for an upright; a chest/−80 ULT can be larger. |
| Media refrigerator | `fridge` | Lab fridge ~2–2.5 × 2.5–3 ft | 2.5 × 3 ft | Newly added; confirm the actual unit. |

## Needs a vendor spec sheet (not yet researched / model unconfirmed)

- **ATF 6** (`atf6`) — Repligen ATF system controller + filter housing.
- **Alfa Laval continuous centrifuge, single-use** (`centrifuge`) — model unconfirmed; skid footprints vary widely. Get the drawing.
- **Millipore harvest skids** (`harvest10`, `harvest5`) — depth-filtration/pod skids; footprint depends on pod holder + pump cart configuration.
- **200L / 50L BIOSTAT STR** (`200L-a`, `50L-a`) — same datasheet family as the 500 (bag holder + TCU per size); pull the per-size rows.
- **Floor scales** (`scale1000`, `scale500`, `scale150`) — platform size depends on capacity/model; the platform plus any ramp/frame.
- **Rockers** (`rocker1–3`) — wave/rocker bag platforms; size by bag volume.

## How to apply once confirmed

1. Put the confirmed W × D (in feet) into the layout's `let items = [...]` array
   (`w`, `h`) for each id, and regenerate `station_reference.csv`.
2. Add clearance/access as a separate concern (TODO §2) rather than inflating the
   hardware box, so aisle-width checks (TODO §4) are meaningful.
3. Re-run `python3 workflows/compute_walking_distance.py <layout>.html` and
   refresh `walking_distance_analysis.md`.

## Sources

- [Beckman Coulter Vi-CELL BLU](https://www.beckman.com/cell-counters-and-analyzers/vi-cell-blu)
- [Nova Biomedical BioProfile FLEX2](https://www.novabiomedical.com/cell-culture-analyzers/bioprofile-flex2)
- [Sartorius Biostat STR Generation 3 datasheet (PDF)](https://api.sartorius.com/document-hub/dam/download/69190/Biostat-STR-Flexsafe-Datasheet-en-B.pdf)
