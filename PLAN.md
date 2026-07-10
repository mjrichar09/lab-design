# Plan

> **Placeholder / stub.** Project-level plan and spec for the lab-design effort:
> phases, the sequence of work, and open decisions. Read this for "where are we
> headed and what's undecided"; read `TODO.md` for the granular backlog. Update
> when a phase completes or a project-level decision lands.

## Goal

Design an optimal layout for the new Upstream Process Development Suite
(~1,409 SF working area) that maximizes usable space and minimizes wasted
walking distance between related process steps — validated well enough that
equipment, EHS, and facilities can sign off before construction drawings.

## Phases

1. **Capture the space & equipment** — trace the room, list equipment. _(done, rough)_
2. **Capture the workflows** — activities, step sequences, frequency, cadence. _(done)_
3. **Walking-distance analysis** — From-To travel chart; identify the drivers. _(done; v3 optimized layout produced)_
4. **Accuracy pass** — real geometry (CAD/DWG) + manufacturer footprints + clearances. _(in progress / blocked on inputs)_
5. **Constraint-aware optimization** — respect adjacency/utility constraints; produce & compare alternatives. _(not started)_
6. **Validation & sign-off** — EHS egress, facilities vs. CAD, process/ops workflow review. _(not started)_

## Open decisions

- TODO: Is the analytics island truly fixed, or can it move? (affects how much more can be saved)
- TODO: Do runs scale up sequentially (50L→200L→500L) or run concurrently? (affects sampling weight)
- TODO: Which specific bioreactor/rocker/skid does each activity target?
- TODO: Apply researched equipment footprints now, or wait for full vendor spec sheets?
- TODO: Which layout becomes the baseline for construction — v3, or a later constraint-aware option?

## Not in scope (yet)

- No build system, backend, accounts, or monetization — the deliverable is
  self-contained HTML layouts plus the analysis. Revisit only if that changes.
