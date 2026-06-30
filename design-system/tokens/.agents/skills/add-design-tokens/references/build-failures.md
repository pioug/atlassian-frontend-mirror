# Debugging Token Build Failures

Start by determining whether the failure is a source-data problem, stale generated output, or an
unrelated branch build issue.

## Table of contents

- [Stale `prebuilt/` — `token '<name>' does not exist`](#stale-prebuilt--token-name-does-not-exist)
- [Stale generated artifacts](#stale-generated-artifacts)
- [Phantom / orphaned `prebuilt/` artifacts swept in](#phantom--orphaned-prebuilt-artifacts-swept-in)
- [Hand-authored type not widened — `TS2353` / token-name not assignable](#hand-authored-type-not-widened--ts2353--token-name-not-assignable)
- [Missing token export or type](#missing-token-export-or-type)
- [Theme coverage mismatch](#theme-coverage-mismatch)
- [Contrast or pair generation issues](#contrast-or-pair-generation-issues)
- [Changeset or package release failure](#changeset-or-package-release-failure)
- [Docs or Figma output failure](#docs-or-figma-output-failure)
- [Last-resort escalation](#last-resort-escalation)

## Stale `prebuilt/` — `token '<name>' does not exist`

This is the most common token CI trap and is **not** caught by `check-clean-git`.

Symptoms:

- CI fails with `token '<token-name>' does not exist` originating from
  `platform/packages/design-system/tokens/prebuilt/babel-plugin/plugin.js`.
- Multiple unrelated pipelines fail at once — e.g. `test-dst-examples` (a11y),
  `build-services-parallel`, `branch-deploy-atlaskit-website-staging`,
  `branch-deploy-design-system-docs` — all because any file calling the new `token('…')` fails to
  compile.
- It reproduces in CI but `check-clean-git` and most local commands passed, especially right after
  running only `codegen-tokens` or after a merge/rebase from the base branch.

Root cause:

- The `@atlaskit/tokens` Babel plugin validates every `token('…')` call against an allow-list loaded
  from `prebuilt/artifacts/token-names.js`.
- `yarn workspace @atlaskit/tokens codegen-tokens` regenerates `src/artifacts/`, style maps, and
  Figma outputs — but it does **not** rebuild `prebuilt/`. `prebuilt/` is refreshed only by the full
  package build (`yarn build tokens` → `ak-postbuild`, which copies `dist/cjs/*` → `prebuilt/`).
- `check-clean-git` passes because the stale `prebuilt/` is already committed (no diff), so nothing
  flags it.

Fix:

```bash
# Run the FULL build so prebuilt/ is regenerated (not just codegen-tokens)
yarn build tokens
# Confirm the new token is now in the allow-list
rg "'<token-name>'" platform/packages/design-system/tokens/prebuilt/artifacts/token-names.js
# Compile-time proof: run an example/a11y test that transforms token() calls
yarn test platform/packages/design-system/tokens/examples
git status --short   # commit the refreshed prebuilt/artifacts/*
```

If `yarn build tokens` is unavailable in the checkout, run the package's full `build`/`ak-postbuild`
directly (inspect `platform/packages/design-system/tokens/package.json` `scripts`) —
`codegen-tokens` alone will not fix this.

## Stale generated artifacts

Symptoms:

- Master/main build fails after a token PR merged.
- Error references generated token files, prebuilt artifacts, `SignedSource`, `@codegen`, or missing
  generated pairs.
- A follow-up PR only changes generated files after running token build.
- A token exists in source schema but is missing from package output or generated maps.

Fix:

```bash
yarn build tokens   # full build; refreshes src/artifacts AND prebuilt/
git status --short
```

Commit all generated changes. Do not hand-edit signatures or minified generated outputs. If you ran
only `codegen-tokens`, see [Stale `prebuilt/`](#stale-prebuilt--token-name-does-not-exist) above —
`prebuilt/` will still be stale.

## Phantom / orphaned `prebuilt/` artifacts swept in

Adding files to `prebuilt/` that don't belong to your change — and that `check-clean-git` won't flag
because they're internally consistent.

Symptoms:

- Your PR diff adds generated/signed files unrelated to your change — e.g. theme files for
  `shape-rounder`/`shape-roundest` in a PR that only adds elevation tokens.
- The signed header reads `THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY` /
  `@codegenCommand yarn build tokens`, making them look legitimate at a glance.
- `check-clean-git` returns EXIT 0 and the build is green, yet the files have **no** source in
  `src/artifacts/` and are **not** present on `master`.
- File timestamps are older than your genuine rebuild (leftovers from a previous build session).

Root cause:

- The `prebuilt/` copy step is not a clean sync: it copies `dist/cjs/*` into `prebuilt/` without
  cleaning first. Stale `dist/cjs` files from an earlier, unrelated build get swept in and
  committed.
- `check-clean-git` only checks that committed artifacts match what a build would produce _for files
  that exist_ — it does not detect extra files that shouldn't exist at all.

Fix:

```bash
# Identify added files unrelated to your change
git diff --stat origin/master...HEAD -- platform/packages/design-system/tokens
# For each suspect: no source AND not on master => phantom
ls platform/packages/design-system/tokens/src/artifacts/themes/
git ls-tree origin/master --name-only platform/packages/design-system/tokens/prebuilt/artifacts/themes/
# Remove the phantom prebuilt files and clean the stale dist/cjs copies, then rebuild + re-verify
git rm platform/packages/design-system/tokens/prebuilt/artifacts/themes/<phantom>.js
rm -f platform/packages/design-system/tokens/dist/cjs/artifacts/themes/<phantom>.js
yarn workspace @atlaskit/tokens check-clean-git   # EXIT 0
```

Keep files that **lack a `src/artifacts/themes` source but exist on master** (e.g.
`atlassian-dark-brand-refresh.js`, `atlassian-light-brand-refresh.js`) — these are generated by a
different mechanism and are legitimate; do not remove them. Confirm the final `prebuilt/` theme set
is byte-identical to master's apart from your intended change.

## Hand-authored type not widened — `TS2353` / token-name not assignable

A `Platform Parallel Typecheck` (`afm ts check`) failure caused by **hand-authored** TypeScript
types that weren't updated to match the new tokens. Codegen and `check-clean-git` will **not** catch
this — the types are source files, so they only fail at typecheck time, often in a downstream
package.

Symptoms:

- `TS2353: '[default]' does not exist in type …` in `tokens/src/types.tsx` and/or the per-theme type
  files when adding nested/interaction-state tokens (`[default]`/`hovered`/`pressed`).
- A token-name string literal "is not assignable" error in a consumer, e.g.
  `primitives/src/components/box.tsx` referencing a missing entry in `BackgroundColorToken`.
- `check-clean-git` passes (EXIT 0) and the build looks clean, but `afm ts check` reports errors.

Root cause:

- Adding nested interaction states changes a type's **shape**, but the leaf in `SurfaceTokenSchema`
  is still typed flat (`PaintToken<BaseToken>`).
- Hand-authored token-name unions (e.g. `BackgroundColorToken`) don't auto-include new token names.

Fix (source-of-truth only — never hand-edit generated types):

1. Widen the schema leaf in `tokens/src/types.tsx` (and per-theme type files) to the nested
   `{ '[default]' | hovered | pressed }` shape, mirroring an existing sibling such as
   `overlay`/`raised`.
2. Add the new token-name string literals to the relevant union(s) in
   `primitives/src/utils/types.tsx` (e.g. `BackgroundColorToken`).
3. Leave types that intentionally omit interaction states unchanged (e.g. `compiled/.../types.tsx`
   `SurfaceColorToken`).
4. Verify: `afm ts generate && afm ts check` → expect 0 errors for `tokens`, `primitives`,
   `ds-explorations`, `css`.

See [workflow.md](workflow.md) §3a for the full file map and search recipe.

## Missing token export or type

Symptoms:

- TypeScript says a new token name is not assignable to token types.
- Runtime consumers cannot resolve a token that exists in source files.
- Lint rules or token helper APIs reject the new token name.

Fix:

1. Confirm the token was added to the correct source category.
2. Confirm public token naming matches existing taxonomy exactly.
3. Rerun token codegen.
4. Search generated TypeScript/types for the token name.
5. If absent, find the source filter/category that controls generated public exports.

## Theme coverage mismatch

Symptoms:

- Light mode works but dark or increased-contrast output is missing.
- Figma/docs output has a token in one theme only.
- Visual examples show fallback values.

Fix:

1. Compare with an adjacent token in the same category.
2. Add explicit mappings for every required theme.
3. Rerun codegen and inspect generated theme outputs.
4. If a theme intentionally lacks support, document why in the source description or PR.

## Contrast or pair generation issues

Symptoms:

- Generated pair artifacts change unexpectedly.
- Contrast checker examples or tests fail after adding foreground/background tokens.
- New background states are missing from pair output.

Fix:

1. Classify whether the token is foreground, background, border, or decorative.
2. Add or adjust pair metadata only in source files.
3. Rerun token codegen.
4. Verify generated pairs include desired contrast and layered token information where applicable.

## Changeset or package release failure

Symptoms:

- Changeset validation fails.
- Reviewers ask why package output changed without a changeset.
- Release notes omit a new public token.

Fix:

- Add or update a `platform/.changeset/*.md` entry for `@atlaskit/tokens`.
- Use `minor` for new public tokens and `patch` for generated fixes or non-public artifacts.
- Keep the summary consumer-facing and mention token names or token families.

## Docs or Figma output failure

Symptoms:

- Design-system docs build comments appear but token pages do not show the new token.
- Figma token JSON/output is missing values.
- Docs examples import a token that is not generated.

Fix:

1. Confirm token source metadata marks the token for docs/Figma export if required.
2. Rerun token codegen.
3. Run or inspect the docs build for changed token pages.
4. Commit docs/Figma generated outputs.

## Last-resort escalation

Escalate to Design System maintainers when:

- Source taxonomy conflicts with intended token naming.
- Codegen omits the token despite matching nearby source patterns.
- Branch CI does not run the relevant token build and the failure only reproduces after merge.
- A generated artifact appears unsafe to commit because it contains unrelated churn.
