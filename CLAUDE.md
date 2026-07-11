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
| `workflows/equipment_footprints.md` | Checking/refining equipment dimensions against manufacturer spec sheets | Real spec-sheet footprints are confirmed or applied to a layout |

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
- Keep layout iterations comparable by adding each new arrangement as a preset in the `LAYOUTS` registry (v2, v3, …) inside the single `layouts/upstream_lab_layout.html`, rather than forking a new file.

## Working efficiently (session cost)

The whole transcript is re-sent every turn, so cost scales with session length and with heavy material kept in context. Without cutting rigor:
- Prefer targeted reads (Grep, or Read with offset/limit) over whole-file reads; don't re-read a file already in context, and don't re-read after an Edit just to confirm it (Edit fails loudly if it didn't apply).
- Don't take screenshots unless the user explicitly asks — verify programmatically instead (drive it headless and assert computed values / script output).
- Prefer Edit over re-emitting whole blocks; don't paste large code back into chat.
- Keep replies concise: briefly state what changed and the result, not a blow-by-blow of every step.
- The layout is one big inline-CSS/JS HTML file — reading the relevant region is fine; just don't read the whole file twice.

## Repo structure

```
README.md          overview + how to open the layouts and run the analysis
TODO.md            prioritized backlog / next steps
CLAUDE.md          this file
layouts/           self-contained interactive floor-plan HTML (open in a browser)
  upstream_lab_layout.html      single app; v2 (as-provided) & v3 (optimized) are built-in presets
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

- **Open / edit a layout:** open `layouts/upstream_lab_layout.html` in a browser. Pick **v2** or **v3** from the "Layout preset" dropdown at the top. Drag to move, corner handle to resize, ↻ to rotate (90° swap), sidebar to rename/add/remove. "Download my edited layout" exports a new standalone HTML pinned to what's on screen.
- **Run the walking-distance analysis:** `python3 workflows/compute_walking_distance.py layouts/upstream_lab_layout.html v3` (second arg picks the preset; default `v2`).

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
- **Equipment lives in the `LAYOUTS` presets.** Each preset's `items` array (`ITEMS_V2` / `ITEMS_V3`) is the source of truth for that arrangement; `let items` is the working copy the tool renders and mutates. The tool rebuilds the entire floor from `items` on load and on every preset switch, so edit coordinates/sizes in the relevant `ITEMS_*` array; the pre-rendered DOM is regenerated.
- **Station ids are stable keys.** e.g. `custom1` = 1000 kg scale, `custom5` = Rocker 1. The walking-distance `ACTIVITIES` list and `workflows/compute_walking_distance.py` both reference these ids — keep them in sync when renaming/adding equipment, and regenerate `station_reference.csv` from the layout.
- **One tooling copy, layouts as presets.** v2 and v3 are presets in a single file, so the walking-distance panel and routing logic exist once — no more mirroring tool changes across files. Add a new layout by appending an `ITEMS_*` array + a `LAYOUTS` entry (and, if it should feed the Python analysis, wire the preset name there too).
- **Be explicit about which distance a number is.** The analysis doc and Python script use straight-line centroid-to-centroid distance (the documented first-pass); the in-tool overlay adds obstacle-aware routing on top and reads higher.
