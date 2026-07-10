# Lab Design

A lab design tool for organizing equipment in a space. Equipment can be dragged
around a to-scale floor plan and helpful calculations are performed on top of it
(today: walking-distance / travel-chart analysis of the daily workflows). The
layouts are self-contained, offline HTML files — there is no build system.

## Document map — what to read when, what to update when

These files are the project's memory across sessions. Read column first; the
update cadence matters (see Preferences below).

| Document | Read it when… | Update it when… |
|---|---|---|
| `CLAUDE.md` | Every session start (automatic) | A convention, structure, or preference changes — rare |
| `README.md` | Getting oriented — what the project is, how to open the layouts and run the analysis | Structure or usage changes |
| `TODO.md` | Start of every work session — the prioritized backlog + recorded recommendations | A work item completes or a decision lands — batched at feature-completion, not per-edit |
| `workflows/README.md` | Working with the workflow data (activities, step sequences, run cadence) that feeds the analysis | The data templates / schema change |
| `workflows/walking_distance_analysis.md` | Reviewing methodology, assumptions, or results of the walking-distance work | A layout or the workflow data changes and the analysis is re-run |

Git history + PR descriptions carry everything else; don't duplicate what a
commit message already says.

_Placeholder stubs_ (scaffolded, mostly skeletons — flesh out as the project
needs them): `PLAN.md` (phases + open decisions), `STYLE_GUIDE.md` (the tool's
visual tokens — colors, type), `Status_update.md` (per-session build log,
newest first), `humantest.md` (user-testing feedback ledger).

## Preferences

- Commit logically-scoped changes as work completes; keep code commits frequent and batch the prose (docs).
- Doc-update cadence: batch, don't drip. `TODO.md` is touched at feature completion or when a decision lands; `CLAUDE.md`/`README.md` only on real changes; the analysis doc is refreshed when a layout or the underlying data changes and the numbers are re-run.
- Verify tool/layout changes by actually opening the HTML in a browser (or driving it headless) before committing — don't rely on reading the diff alone.
- Periodically archive: when `TODO.md`'s checked-off `[x]` items outnumber the open ones, delete the completed entries (their substance lives in git history / commit messages) to keep `TODO.md` scannable.
- Version layouts with a `_vN` suffix rather than overwriting, so iterations stay comparable.

## Repo structure

```
README.md          overview + how to open the layouts and run the analysis
TODO.md            prioritized backlog / next steps
CLAUDE.md          this file
layouts/           self-contained interactive floor-plan HTML (open in a browser)
  upstream_lab_layout_v2.html   current / as-provided layout
  upstream_lab_layout_v3.html   walking-distance-optimized layout
workflows/         workflow data + walking-distance analysis
  README.md                     how the data templates feed the analysis
  activities_template.csv       one row per recurring activity (frequency, people, path type)
  activity_steps_template.csv   ordered station stops per activity
  run_cadence_template.csv      run length / runs per month
  station_reference.csv         station_id -> name / category (generated from the layout)
  compute_walking_distance.py   From-To travel-chart calculator
  walking_distance_analysis.md  written analysis + assumptions
.claude/           local Claude Code settings
```

There is no package manager, bundler, or test runner. The whole project is plain
HTML you open directly, plus one Python script:

- **Open / edit a layout:** open `layouts/upstream_lab_layout_v3.html` in a browser. Drag to move, corner handle to resize, ↻ to rotate (90° swap), sidebar to rename/add/remove. "Download my edited layout" exports a new standalone HTML.
- **Run the walking-distance analysis:** `python3 workflows/compute_walking_distance.py layouts/upstream_lab_layout_v3.html`

## Design system

Each layout HTML carries its own lightweight visual system inline (no external
stylesheet). When editing the tool, match what's already there rather than
introducing new styles.

- **Font:** IBM Plex Mono throughout (labels, dimension tags, stats).
- **Equipment color categories** — defined as `COLORS` / `FILLS` in the HTML and shown in the on-screen Legend:
  - teal — bioreactors / ATF
  - amber — centrifugation
  - plum — harvest / filtration skids
  - slate — carts, utilities & storage
  - blue — custom / user-added
- **Walking-path overlay colors** — one per activity, in the `ACTIVITIES` array: sampling = red-orange, harvest = teal-green, passage = purple, inoculate-rocker = amber, inoculate-bioreactor = blue. Keep them distinct so several paths read clearly when shown at once.

## Conventions

- **Self-contained HTML.** Each layout is one offline file with no required external dependencies, so anyone can open and keep editing it. Don't add build steps or external runtime deps.
- **Equipment lives in the `let items = [...]` array.** The tool rebuilds the entire floor from it on load, so that array is the source of truth — edit coordinates/sizes there; the pre-rendered DOM is regenerated.
- **Station ids are stable keys.** e.g. `custom1` = 1000 kg scale, `custom5` = Rocker 1. The walking-distance `ACTIVITIES` list and `workflows/compute_walking_distance.py` both reference these ids — keep them in sync when renaming/adding equipment, and regenerate `station_reference.csv` from the layout.
- **Keep v2 and v3 tooling in parity.** The walking-distance panel and routing logic are mirrored in both files; apply tool changes to both.
- **Be explicit about which distance a number is.** The analysis doc and Python script use straight-line centroid-to-centroid distance (the documented first-pass); the in-tool overlay adds obstacle-aware routing on top and reads higher.
