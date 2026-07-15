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
- Keep layout iterations comparable by adding each new arrangement as a preset in the `LAYOUTS` registry inside the single `layouts/upstream_lab_layout.html`, rather than forking a new file. (v3 was removed 2026-07-11; v2 is the sole preset now.)

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
  upstream_lab_layout.html      single app; v2 (as-provided) is the built-in preset, with Blueprint / Hand-drafted / Cyber themes
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

- **Open / edit a layout:** open `layouts/upstream_lab_layout.html` in a browser. It opens the **v2** arrangement fit to the canvas width; use the **Scale** slider / **Fit width** button to zoom (all objects rescale together) and the **Theme** picker (Blueprint / Hand-drafted / Cyber). Drag to move, corner handle to resize, ↻ to rotate, sidebar to rename/add/remove. Equipment names auto-place (inside / rotated / beside the box). The **Saved layouts** panel stores named arrangements; the original v2 is seeded as **"Default (v2)"**. "Download my edited layout" exports a standalone HTML pinned to what's on screen (and to the current theme).
- **Run the walking-distance analysis:** `python3 workflows/compute_walking_distance.py layouts/upstream_lab_layout.html` (optional second arg picks a preset; default `v2`).

## Design system

Each layout HTML carries its own lightweight visual system inline (no external
stylesheet). When editing the tool, match what's already there rather than
introducing new styles.

- **Themes.** A `Theme` picker (independent of the Layout-preset picker) swaps the whole sheet's look via `data-theme` on `<html>`. `blueprint` (default) is the crisp draft described here; `hand` is a warm vellum, hand-lettered variant (Architects Daughter / Caveat display faces, ruler-straight ink lines on vellum, sketch-edged boxes, inked walk paths, wall-draw + sketch-in load animations); `cyber` (HELIX HUD) is neon-on-dark — glass panels, cyan/violet glow, a drifting grid + scanline overlay, and glowing draw-on walk paths. Each theme has **two** coordinated halves that must stay in sync: (1) scoped `:root[data-theme="…"]` CSS (palette + chrome), and (2) the JS `BG_THEMES` registry that `buildBg()` reads for the background-SVG ink colors/filters. Equipment colors are theme-driven too — `COLORS`/`FILLS` reference `--cat-*` / `--fill-*` tokens overridden per theme. Keep `blueprint` output byte-faithful to the original draft.
- **Font:** IBM Plex Mono throughout (labels, dimension tags, stats) in the blueprint theme; the hand theme uses cursive display/annotation faces.
- **Equipment color categories** — defined as `COLORS` / `FILLS` in the HTML and shown in the on-screen Legend:
  - teal — bioreactors / ATF
  - amber — centrifugation
  - plum — harvest / filtration skids
  - slate — carts, utilities & storage
  - blue — custom / user-added
- **Walking-path overlay colors** — one per path. Built-in paths seed distinct colors in `DEFAULT_WALKPATHS` (sampling = red-orange, harvest = teal-green, passage = purple, inoculate-rocker = amber, inoculate-bioreactor = blue); user-defined paths draw the next free color from `PATH_PALETTE`. Keep them distinct so several read clearly at once.

## Conventions

- **Self-contained HTML.** Each layout is one offline file with no required external dependencies, so anyone can open and keep editing it. Don't add build steps or external runtime deps. One deliberate exception: AI icon generation calls `/api/generate-icon` (a zero-dependency Vercel function proxying Groq; `GROQ_API_KEY`/`GROQ_MODEL` env vars) — offline the feature fails gracefully and everything else works. The claude.ai artifact shim at the top of the file is gated to `window.parent !== window` so native fetch/`URL.createObjectURL` work standalone.
- **AI icons live in `it.svg`.** A sanitized SVG string on the item wins over the built-in `icon` kind (`itemIcon()`); `sanitizeSvg()` re-runs on every load path (activate/import), and `exportLayout` escapes `<` in the serialized JSON so SVG can't break the exported inline script. Generated art strokes with `currentColor` (the box's category color), so it re-themes automatically.
- **Two serverless proxies, one key.** `api/generate-icon.js` (AI icons) and `api/critique.js` (layout review) are both zero-dependency Vercel functions that read `GROQ_API_KEY`/`GROQ_MODEL`. Both degrade gracefully offline. Never inline `</script>` (even in a JS comment) in the single HTML file — the HTML parser closes the script tag on that literal string and breaks the whole page.
- **Auto-optimize + critic are modal-based.** A lazily-created `#modalRoot` hosts the shared modal (`openModal`). Auto-optimize runs a constrained simulated-annealing pass in feet over `items` (reusing `itemBox`/`rectsOverlap`/`pathFtPerDay`/`freqPerDay`), honoring "sit-together" groups + locked items, snapshotting via `pushUndo` so it's revertible. The optimizer minimizes straight-line path length (fast inner loop); the panel total stays obstacle-aware, so the two figures differ slightly — say which is which. It auto-detects **bench stacks** (an item ≥50% covered by a larger one is bound to it) and moves each stack as a rigid unit; `valid()` forbids every overlap except within a stack and any aisle narrower than `minAisleFt`, and the objective penalizes existing cross-stack overlaps + narrow aisles so they get resolved.
- **Equipment lives in `ITEMS_V2`.** That array is the source of truth for the built-in arrangement; `let items` is the working copy the tool renders and mutates. The tool rebuilds the entire floor from `items` on load, so edit coordinates/sizes in `ITEMS_V2`; the pre-rendered DOM is regenerated. (Layout iterations are kept as Saved layouts, not source presets.)
- **Shared geometry, one source.** `itemBox(it, pad)` computes an item's rotated axis-aligned box; the router (`prepRouting`, padded by `CLEAR_FT`) and the clearance checks (`computeClearanceIssues`, `pad=0`) both use it. Doors live once in the `DOORS` const — `buildBg` draws them and the clearance checker derives keep-clear zones from the same data. The clearance overlay is `warnLayer` (mirrors `pathLayer`); warnings use `--danger` so they read in every theme.
- **Station ids are stable keys.** e.g. `custom1` = 1000 kg scale, `custom5` = Rocker 1. Walk paths (`walkPaths`, seeded from `DEFAULT_WALKPATHS`) and `workflows/compute_walking_distance.py` both reference these ids — keep them in sync when renaming/adding equipment, and regenerate `station_reference.csv` from the layout. In-tool walk paths are now user-editable (Define-path button); they persist in Saved layouts and the HTML export but do **not** flow to the Python script, which keeps its own activity list.
- **One self-contained file.** The whole tool (walking-distance panel, routing, clearance checks, themes) lives in `layouts/upstream_lab_layout.html` — no mirroring across files.
- **Be explicit about which distance a number is.** The analysis doc and Python script use straight-line centroid-to-centroid distance (the documented first-pass); the in-tool overlay adds obstacle-aware routing on top and reads higher.
