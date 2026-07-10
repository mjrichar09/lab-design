PropCompare (AllSquare)
A lab design tool for organizing equipment in a space. The equipment can be moved around and specific helpful calculations are performed.

Document map — what to read when, what to update when
These files are the project's memory across sessions. Read column first; the update cadence matters (see Preferences below).

Document	Read it when…	Update it when…
CLAUDE.md	Every session start (automatic)	A convention, structure, or preference changes — rare
TODO.md	Start of every work session — the "Next session plan" at its top is the entry point; the rest is the prioritized backlog + recorded recommendations	A work item completes or a decision lands — batched at feature-completion, not per-edit
PLAN.md	Product/spec questions: phases, schema (§5/§10), monetization + pricing (§11/§13), growth outlook & decision gates (§13b), open decisions (§13)	A product-level decision is made or a phase completes
humantest.md	Before/after any user-testing session; it's the numbered feedback ledger with resolution status	Feedback arrives (log immediately — it's the capture inbox) and again when items resolve
Status_update.md	Catching up on what's already been built ("did we already do X?")	Once per session, a summary entry at session end — not per-feature
STYLE_GUIDE.md	Any UI work — colors, type, motion, density rules	Only on deliberate design-system changes; guide wins over code
README.md	Setup: install, env vars (apps/web/.env.local), run commands	Setup steps or env vars change
Git history + PR descriptions carry everything else; don't duplicate what a commit message already says.

Preferences
Claude commits automatically as work completes.
Doc-update cadence: batch, don't drip. Now: humantest.md gets feedback logged as it arrives (capture inbox); TODO.md gets touched at feature completion or when a decision lands; Status_update.md gets one summary entry per session, at session end; CLAUDE.md/PLAN.md only on real changes. Code commits stay frequent — it's the prose that batches.
Periodically archive: when TODO.md's checked-off items outnumber the open ones, sweep the [x] entries' substance into Status_update.md and delete them from TODO, keeping TODO scannable.
Repo structure
"add here"

packages/shared — the core, build everything against this
"add here"

cd packages/shared && npx vitest run
Design System
STYLE_GUIDE.md (repo root) is the source of truth for all UI work — colors, typography, spacing, and motion decisions derive from its tokens. When building a new component, check that file first rather than picking defaults. The tokens are wired into code in two mirrored places (update both if the guide changes): PALETTE/FONTS in packages/shared/constants.ts and the Tailwind @theme block in apps/web/src/app/globals.css. Key rules: forest green is the only saturated color (rust only for genuinely negative signals); the serif heading face (Fraunces, font-heading) only at 28px+ — never in dense UI, body copy, or buttons; numbers use the mono face with tabular-nums.

Conventions
"add here"
