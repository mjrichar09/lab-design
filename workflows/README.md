# Workflow data — fill-in templates

These files capture *who walks where, how often* so we can compute a
weighted travel (From-To) chart against the layout in
`../layouts/upstream_lab_layout_v2.html` and identify which equipment
should be placed closer together to cut wasted walking distance.

Fill in the three `*_template.csv` files (Google Sheets, Excel, or a text
editor all work fine — they're plain CSV). Delete the `EXAMPLE -` rows once
you've added your real activities, or leave them as a reference. Each file
has one job:

## 1. `station_reference.csv` (read-only, generated — don't edit)

Auto-generated list of every station/equipment `station_id` currently in
the layout, with its display name and category. Use this to look up the
correct `station_id` when filling in the other two files. If you rename,
add, or remove equipment in the layout tool, let me know and I'll
regenerate this file to match.

## 2. `activities_template.csv` — one row per activity

| column | meaning |
|---|---|
| `activity_name` | A short, unique name for the activity (e.g. "Daily viability sampling"). Must match exactly across this file and `activity_steps_template.csv`. |
| `frequency_count` | How many times this activity happens, per the unit below. |
| `frequency_unit` | `per_day`, `per_run`, or `per_week` — whatever's most natural to describe it. |
| `people_per_trip` | How many people walk this path together each time (2 people doing it side-by-side counts as 2x the foot traffic, even though the distance per trip is the same). |
| `path_type` | `circuit` — walks stop 1 → 2 → 3 → ... in order (e.g. harvest → centrifuge → freezer). `hub_and_spoke` — walks out from a home base to each stop and back before the next (e.g. keeps returning to the data station between measurements). `one_way` — walks the sequence once and doesn't return. |
| `home_base_station_id` | Only needed for `hub_and_spoke` — the station_id of the home base (e.g. `datastation`). Leave blank otherwise. |
| `notes` | Anything useful — free text. |

## 3. `activity_steps_template.csv` — the stops for each activity, in order

| column | meaning |
|---|---|
| `activity_name` | Must exactly match a row in `activities_template.csv`. |
| `step_order` | 1, 2, 3... the order stops happen in. |
| `station_id` | Must match a `station_id` from `station_reference.csv`. |
| `notes` | What happens at this stop (optional but helpful). |

## 4. `run_cadence_template.csv` — production cadence

A few numbers so "per run" activities can be converted to the same daily
basis as "per day" activities (e.g. if a run takes 6 days and happens twice
a month, an activity that happens once "per run" works out to roughly
2/(6×~4.3) ≈ 0.08 times per day per run-day, or we can instead express
everything on a "per run" basis — whichever is more useful once we see
the real numbers).

## What happens next

Once these are filled in, I'll:
1. Compute distance between every pair of stations from their layout
   coordinates (straight-line, to start).
2. Build a weighted travel matrix: for each activity, sum
   `distance × frequency (normalized to a common time basis) × people_per_trip`
   across its path.
3. Roll that up into total daily/weekly walking distance for the current
   layout, and identify the highest-weight station pairs — the best
   candidates to move closer together.
4. Use that to propose one or more revised layouts and compare their
   total weighted travel against the current one.

You don't need to fill in every activity to get started — even 4-5 of the
most common ones (the stuff that happens daily) will produce a useful first
read. Less-frequent "per run" activities matter too but contribute less to
the daily total, so they're lower priority to capture precisely.
