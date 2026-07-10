# Style Guide

> **Placeholder / stub.** Source of truth for the layout tool's visual system.
> The tool currently carries its styles inline in each `layouts/*.html` file;
> this doc captures the intended tokens so they stay consistent. Flesh out the
> `TODO` sections as the UI evolves. When the guide and the code disagree, the
> guide wins — update the code to match (or update the guide deliberately).

## Type

- **Family:** IBM Plex Mono throughout — labels, dimension tags, sidebar stats,
  buttons. No secondary face.
- Numbers read as mono (they already are, given the single family).
- TODO: define the size scale actually in use (header / h2 / body / hint / tag).

## Color — equipment categories

Defined as `COLORS` / `FILLS` in each layout HTML and shown in the on-screen
Legend. Border = `COLORS`, fill = `FILLS`.

| Category | Token | Border hex |
|---|---|---|
| Bioreactors / ATF | `teal` | `#3e7c7c` |
| Centrifugation | `amber` | `#b9822f` |
| Harvest / filtration skids | `plum` | `#6b4c7a` |
| Carts, utilities & storage | `slate` | `#5b6b7a` |
| Custom / user-added | `blue` | `#2c5f8a` |

## Color — walking-path overlay

One saturated color per activity, in the `ACTIVITIES` array. Keep them distinct
so several paths read clearly at once.

| Activity | Hex |
|---|---|
| Daily sampling | `#e4572e` (red-orange) |
| Harvest → centrifuge | `#1f9e89` (teal-green) |
| Passage shake flask | `#8a4fff` (purple) |
| Inoculate rocker | `#d68a00` (amber) |
| Inoculate bioreactor | `#2f6fed` (blue) |

## UI chrome

- TODO: document the CSS custom properties used for chrome (`--ink`, `--slate`,
  `--line`, `--danger`, `--blue`, the `*-fill` variables) with their values,
  extracted from the `:root` block in the HTML.
- TODO: spacing / border-radius / density conventions for the sidebar controls.
- TODO: motion (currently minimal — none intended beyond native inputs).

## Rules

- Match what's already in the HTML rather than introducing new styles.
- Path colors and category colors must stay visually separable from each other.
