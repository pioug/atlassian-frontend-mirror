# Prompt: run Stage 1 Volt migrate + fix leftover failures

You are migrating one AFM Platform package to Stage 1 Volt standards.

The migration workflow scripts live beside this prompt under
`platform/packages/volt/volt-components-entry-point-config/scripts/orchestrate/`:

- `main.sh` — runs migration, local validation, then post-validation;
- `migrate.sh` — runs the Rust `volt-migrate-package` codemod;
- `validate/main.sh` — runs the complete local validation surface and writes its report;
- `post-validate/main.sh` — creates the package changeset, marks it Volt-compliant, and regenerates
  entry-point configuration.

Pass the target Platform package path as the first argument to every script. The scripts reject
missing or additional arguments; do not hardcode a package path unless asked.

## Preconditions

1. Read `.ai/volt/AGENTS.md` end-to-end. That is the post-codemod cleanup contract (entry-point
   shims, `@deprecated` wording, changesets, lint disables). Apply it when editing code after the
   migrate script.
2. Skim existing notes under `.ai/volt/codemod-gaps/` so you recognise known gaps (e.g.
   package-local `build/` skipped during consumer rewrite).

## Step 1 — Run the orchestrator (once)

From the AFM repo root:

```bash
bash platform/packages/volt/volt-components-entry-point-config/scripts/orchestrate/main.sh platform/packages/<package-path>
```

What it does:

1. Runs `migrate.sh`, which invokes `volt-migrate-package` for `PACKAGE_PATH`.
2. Runs `validate/main.sh`, which performs scoped typecheck, eslint, oxlint, unit tests, export-map
   key validation, and exported-identifier validation. Oxlint mirrors the CI `afm lint oxlint` gate
   and catches oxlint-only rules such as `consistent-type-imports` that the eslint pass misses.
3. Writes the full machine-readable validation report to `.ai/volt/tmp/output.json` and individual
   stage logs to `.ai/volt/tmp/logs/`.
4. On validation **success**: creates a dedicated non-interactive changeset and leaves the working
   tree **uncommitted** for human review.
5. On migration or validation **failure**: exits non-zero without creating the changeset.

**Do not re-run `orchestrate.sh` after a failure or after you start fixing.** It would run the
codemod again. Fix forward on the existing branch, then run only the standalone validation script.

If migration fails **before** validation produces a useful `output.json` (for example, a cargo/build
failure), treat that as **infra** — summarise to the human and stop. Do **not** write a codemod-gap
note for infra failures.

## Step 2 — If checks fail

1. Read `.ai/volt/tmp/output.json` and the relevant stage log under `.ai/volt/tmp/logs/`.
2. Classify each failure:
   - **Trivial / mechanical** — you can fix it in a small number of attempts (see budget below) by
     restoring pre-codemod behaviour (retarget a missed import, add an explicit type for
     isolated-declarations, move an eslint-disable onto the export line per `AGENTS.md`, etc.).
   - **Non-trivial / bail** — unclear root cause, would change public API or runtime behaviour,
     needs design judgment, spans packages outside `PACKAGE_PATH`, looks pre-existing / unrelated to
     this migrate, **or** you have exhausted the attempt budget below without a green re-check.
3. **Trivial:** edit only under `PACKAGE_PATH` (and gap notes under `.ai/volt/codemod-gaps/`).
   Re-validate without re-running the codemod or creating another changeset:

   ```bash
   bash platform/packages/volt/volt-components-entry-point-config/scripts/orchestrate/validate/main.sh platform/packages/<package-path>
   ```

   This command reruns the complete validation surface, including the package export checks,
   refreshes `.ai/volt/tmp/output.json`, and replaces the per-stage logs under `.ai/volt/tmp/logs/`.

   **Attempt budget:** at most **5** typecheck runs, **5** lint runs (eslint + oxlint combined), and
   **5** unit-test runs after the orchestrator exits. If still red after that, **bail** (treat as
   non-trivial). Prefer reading errors carefully over spray-and-pray edits.

4. **Bail:** stop editing. Tell the human what failed, why it’s non-trivial (or that the attempt
   budget was exhausted), and the smallest next question you’d need. Leave the tree as-is for them
   to inspect. Do **not** commit, push, or open a PR.

## Step 3 — Codemod-gap writeup after fix or bail

If you fixed anything **or** bailed on a migrate/check failure, add a new markdown file under
`.ai/volt/codemod-gaps/` (this directory is gitignored — still write the file for the human’s local
review).

Naming: `kebab-case-short-description.md` (see `package-local-build-dir-skipped-as-output.md`).

Required sections:

1. **Seen on** — package name, VOLTC / branch, which step failed
2. **Symptom** — concrete errors from `output.json` and its stage log (trimmed)
3. **Root cause** — what the migrate did vs what was left broken
4. **Manual fix applied?** — yes (describe) / no (bailed)
5. **Codemod extension** — how `volt-migrate-package` (or a sub-pass) could handle this
   deterministically next time, with complexity (`trivial` / `low` / `medium` / `high`)
6. **Not flake?** — yes/no and why

Skip the writeup only when the orchestrator was fully green and you made no fixes.

## Step 4 — When checks are green

Apply remaining `.ai/volt/AGENTS.md` cleanup the codemod does not fully own:

- entry-point shims → direct exports where required
- `@deprecated` message shape (backtick import paths)
- Edit the changeset body the orchestrator created so it lists recommended entry-point imports
  (consumer-facing; no Volt/VOLTC wording). Keep it a **dedicated** changeset for this package only.

Leave everything **uncommitted**. The human will review, commit, and push.

Do **not** push or open a PR unless the human explicitly asks.

## Hard rules

- Scope code edits to `PACKAGE_PATH` (+ `.ai/volt/codemod-gaps/` notes, + the changeset under
  `platform/.changeset/` when polishing AGENTS cleanup).
- Prefer the smallest fix that restores prior behaviour; do not “improve” the package while
  migrating.
- Never `git commit`, `--amend`, or force-push unless the human explicitly asks.
- Never silence volt-strict-mode rules with a blanket file disable; follow `AGENTS.md` for
  per-export disables.
- This prompt’s validation surface is typecheck + eslint + oxlint + package unit tests
  - package-export checks. Do not run VR / Gemini locally (OOM risk) or chase unrelated CI flakes
    unless asked.
