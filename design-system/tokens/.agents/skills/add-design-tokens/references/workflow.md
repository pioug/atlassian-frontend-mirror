# Token Implementation Workflow

## 1. Classify the change

Identify the smallest category that describes the change:

- **Palette/base token:** raw color value or primitive token, such as adding a neutral palette
  value.
- **Semantic token:** consumer-facing token name, such as text, background, border, elevation,
  shadow, opacity, or interaction states.
- **Theme mapping:** light, dark, high-contrast, or custom theme mapping for an existing semantic
  token.
- **Interaction state:** default, hovered, pressed, selected, disabled, inverse, subtle/bold
  variants.
- **Product/brand extension:** dedicated product-family tokens such as Rovo surface/elevation
  tokens.
- **Deprecation/rename:** replacing or aliasing old token names.

If the user is still deciding whether the token should exist, pause implementation and use
`add-frontend-offering` to capture naming, semantics, consumers, and rollout.

## 2. Locate source files before generated files

Work from source-of-truth files. Search AFM for nearby examples and matching token categories before
editing.

Useful searches:

```bash
rg "<existing-token-name>|<new-token-prefix>" platform/packages/design-system/tokens
rg "palette|semantic|theme|figma|forge|prebuilt" platform/packages/design-system/tokens
```

Common source areas include token schemas, theme maps, palette definitions, token descriptions, docs
data, and package-level source files. Generated files usually contain banners such as `@codegen`,
`SignedSource`, minified output, or generated artifact names.

## 3. Add the source token data

For every new token, verify:

- Name follows existing taxonomy and comparable tokens.
- Description explains intended use and when not to use it.
- Light, dark, and increased-contrast behavior is intentional when applicable.
- Interaction states are complete for the pattern being introduced.
- Palette/base values exist before semantic tokens reference them.
- Contrast-sensitive foreground/background pairings are defined or deliberately excluded.

## 3a. Widen hand-authored TypeScript types

Some token types are **hand-authored source files**, not generated. They will not be fixed by
codegen and `check-clean-git` will not flag them — they only surface as a `tsc`/`afm ts check`
failure (often in a downstream package), so update them in the same change as the schema/themes.
This is especially important for **nested / interaction-state tokens** (adding
`[default]`/`hovered`/`pressed` under an existing leaf), which changes the type's _shape_, not just
its name set.

Known hot-spots (verify they still exist; names/paths can drift):

| File                                                             | Type                                                   | What to do                                                                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform/packages/design-system/tokens/src/types.tsx`           | `SurfaceTokenSchema` (and per-theme type files)        | Widen the leaf to the nested shape `{ '[default]'                                                                                          | hovered | pressed }`, mirroring an existing sibling such as `overlay`/`raised`. A flat `PaintToken<BaseToken>`leaf will fail with`TS2353: '[default]' does not exist in type`. |
| `platform/packages/design-system/primitives/src/utils/types.tsx` | `BackgroundColorToken` (and sibling token-name unions) | Add the new token-name string literals (e.g. `'elevation.surface.container.hovered'`, `'…pressed'`) so consumers like `box.tsx` typecheck. |

General rule (don't rely only on the table above — search):

```bash
# Find hand-authored token-name unions / schema types that may need widening
rg -n "TokenSchema|ColorToken|PaintToken<|'elevation\.surface" \
  platform/packages/design-system/tokens/src \
  platform/packages/design-system/primitives/src
```

Mirror, don't invent: copy the exact shape of the closest existing sibling token (e.g.
`overlay`/`raised` for surfaces).

**Caveat — do not blindly add states everywhere.** Some types intentionally omit interaction states.
For example, `tokens/.../compiled/components/types.tsx` (`SurfaceColorToken`) deliberately excludes
`.hovered`/`.pressed`, so it needs **no** change. Only widen a type if the failing `token()`/schema
usage actually requires it.

Verify with the type checker across the tokens package and its downstream consumers:

```bash
afm ts generate && afm ts check   # primary (matches CI)
# fallback if afm tooling is unavailable in the checkout:
yarn typecheck platform/packages/design-system/tokens
```

Expect **0 errors** for `tokens`, `primitives`, `ds-explorations`, and `css`.

## 4. Add release metadata

If `@atlaskit/tokens` package output changes, add a changeset under `platform/.changeset/`.

Use the smallest correct semver bump:

- `patch` for adding primitive/base artifacts without new public semantic API, docs-only fixes, or
  generated corrections.
- `minor` for new public token names or new supported token states.
- `major` only for breaking token removals or incompatible behavior changes.

## 5. Run the FULL token build (not just codegen)

Run the **full** token package build. This is the canonical command — `codegen-tokens` alone is
**not enough** (see the critical warning below):

```bash
yarn build tokens
```

The full build runs codegen **and** the package's `ak-postbuild`, which compiles `dist/cjs/*` and
refreshes the `prebuilt/` directory. `prebuilt/artifacts/token-names.js` is the allow-list the
`@atlaskit/tokens` Babel plugin validates every `token('…')` call against, so it must include any
new token before consumers/examples can compile.

> ⚠️ **Critical: `codegen-tokens` does NOT refresh `prebuilt/`.**
> `yarn workspace @atlaskit/tokens codegen-tokens` regenerates `src/artifacts/`, style maps, and
> Figma outputs, but it does **not** rebuild `prebuilt/artifacts/`. Worse, `check-clean-git` passes
> even though `prebuilt/` is stale (the committed file simply isn't updated, so there's no diff to
> flag). The result is a green local check but failing CI: any file calling a new `token('…')` fails
> to compile with `token '<name>' does not exist` at `prebuilt/babel-plugin/plugin.js`. This
> cascades into example/a11y tests, DS package builds, and the website/docs deploys. **Always run
> the full `yarn build tokens` so `prebuilt/` is regenerated.**

> Note on environments: `yarn build tokens` is the AFM tooling shorthand for the full build. If it
> fails with "Couldn't find a script named build" (e.g. a shallow/sparse clone where the wrapper is
> unavailable), run the package build directly so `ak-postbuild`/`prebuilt` still runs — inspect
> `platform/packages/design-system/tokens/package.json` `scripts` (look for `build`, `ak-postbuild`,
> and the `prebuilt` step) and run the equivalent. Running only `codegen-tokens` is never sufficient
> on its own.

This step is mandatory before merge. Do not rely on branch CI to protect token generated artifacts.

### Re-run the full build after every merge/rebase from master

Token generated artifacts (including `prebuilt/`) depend on the **entire** token source set, not
just your change. Whenever the branch is updated from `master`/`main` (merge, rebase, or "Update
branch" in the PR UI), another token may have landed upstream, leaving your branch's generated
output stale. So **every time the branch is synced with the base branch, re-run the full build and
re-commit**:

```bash
git merge origin/master   # or: git rebase origin/master
yarn build tokens         # full build — refreshes src/artifacts AND prebuilt/
yarn workspace @atlaskit/tokens check-clean-git
# if the build changed files, commit them
git add -A && git commit -m "Rebuild token artifacts after merging master"
```

Notes:

- Use the **full build**, not `codegen-tokens` — a post-merge `codegen-tokens` leaves `prebuilt/`
  stale and produces the exact green-local/red-CI trap described above.
- Resolve merge conflicts in **source** files first, then rebuild — never hand-merge generated
  artifacts; let the build reproduce them.
- `check-clean-git` passing is necessary but **not sufficient** to prove `prebuilt/` is correct;
  confirm by compiling a file that uses the new token (e.g. run the dst-examples a11y test).
- This applies even if your own source files didn't change in the sync.

## 6. Review the generated diff

After codegen:

```bash
git status --short
git diff --stat
```

Then inspect generated changes for consistency:

- The new token appears in all expected generated maps/types.
- Signed generated files have updated signatures.
- No unrelated generated churn appears.
- Generated docs/Figma outputs match the token category and theme coverage.

**Watch for phantom/orphaned generated files.** The `prebuilt/` copy step is **not** a clean sync —
it copies `dist/cjs/*` into `prebuilt/` without first cleaning the source or destination. Stale
leftovers from an _earlier, unrelated_ build (e.g. an experimental `shape-rounder`/`shape-roundest`
theme) can be swept in and committed by mistake. `check-clean-git` will **not** flag them, because
they're internally consistent — they're just files that shouldn't exist. Any generated/signed file
unrelated to your change is a red flag.

```bash
# 1) Are any added files unrelated to your token change? (e.g. a theme you didn't touch)
git diff --stat origin/master...HEAD -- platform/packages/design-system/tokens

# 2) Does each added prebuilt/dist theme file have a real source AND exist on master?
ls platform/packages/design-system/tokens/src/artifacts/themes/   # source must exist
git ls-tree origin/master --name-only \
  platform/packages/design-system/tokens/prebuilt/artifacts/themes/   # legit files are on master

# 3) Suspicious timestamps: phantom files are older than your genuine rebuild
ls -l --time-style=+%H:%M platform/packages/design-system/tokens/dist/cjs/artifacts/themes/
```

Rules of thumb:

- A newly-**added** theme/artifact file is only legitimate if it has a source in `src/artifacts/`
  **and/or** already exists on `master` (some theme files are generated by a different mechanism and
  have no `src/artifacts/themes` source, but are present on master — those are fine and must not be
  touched).
- If a file has **no source** and is **not on master**, it's a phantom — remove it from `prebuilt/`
  and clean the stale `dist/cjs` copy, then re-verify `check-clean-git` (EXIT 0) and that the
  `prebuilt/` theme set is byte-identical to master's (minus your intended change).
- Mismatched modification timestamps (older than your genuine rebuild) are a strong tell that a file
  is a leftover, not a fresh artifact.

## 7. Author docs and examples

Generated docs _data_ (e.g. `token-metadata.codegen.tsx`, which feeds `@atlaskit/ads-mcp` and the
hosted `llms-tokens.txt`) is produced by the codegen step above, but it is **not** a substitute for
the hand-authored docs and examples. For any new public token:

- Update or add the relevant example in `platform/packages/design-system/tokens/examples/*` so the
  token is demonstrated (e.g. `2-elevations.tsx` for elevation/surface tokens, `0-color-roles.tsx`
  for color roles). VR examples (files ending `-vr.tsx`) drive visual-regression coverage.
- Update the matching per-category usage guidance in
  `platform/packages/design-system/tokens/docs/ai/*` (`color-instructions.md`,
  `spacing-instructions.md`, `border-radius-instructions.md`) when the token belongs to that
  category.

Note: the per-token reference table is hosted on `atlassian.design`; `docs/1-tokens-reference.tsx`
is only a stub link. See [docs-and-examples.md](docs-and-examples.md) for the full map.

## 8. Update snapshots and downstream tests

The token build regenerates `primitives`, `css`, and `ds-explorations` style maps automatically. It
does **not** update full-token-set snapshots that live in _other_ workspaces. Search the whole repo
and proactively regenerate them:

```bash
# Find snapshots that embed token CSS custom properties / the full token set
rg "--ds-" --glob "**/__snapshots__/*.snap" -l
```

The canonical example is the Help Center SSR snapshot, which embeds the entire token stylesheet:

```
help-center/ssr/__snapshots__/entry.test.tsx.snap
help-center/ssr/__snapshots__/tesseract.bundle.test.tsx.snap
```

Update affected snapshots proactively with Jest's update flag from the owning workspace/package,
e.g.:

```bash
cd help-center/ssr && yarn test -u   # or the workspace's test runner with -u
```

See [snapshot-and-downstream-tests.md](snapshot-and-downstream-tests.md) for the full search recipe
and update commands.

## 9. Verify locally and in PR

Run these default checks from the AFM workspace root after the full build:

```bash
yarn build tokens   # full build — refreshes prebuilt/ (NOT just codegen-tokens)
yarn typecheck platform/packages/design-system/tokens
```

**Prove `prebuilt/` includes the new token** by compiling a file that uses it. The dst-examples a11y
test is the fastest signal because it transforms the examples through the Babel plugin:

```bash
# Confirm the new token is in the allow-list the Babel plugin reads
rg "'<new-token-name>'" platform/packages/design-system/tokens/prebuilt/artifacts/token-names.js
# Compile-time check: run the example/a11y test that transforms token() calls
yarn test platform/packages/design-system/tokens/examples   # or the dst-examples a11y suite
```

If you see `token '<name>' does not exist` at `prebuilt/babel-plugin/plugin.js`, `prebuilt/` is
stale — re-run the full `yarn build tokens` and commit the refreshed `prebuilt/artifacts/*`.

Then run the token package tests plus the downstream packages that consume the token list:

```bash
cd platform/packages/design-system/tokens && yarn test
cd platform/packages/design-system/primitives && yarn test
cd platform/packages/design-system/ds-explorations && yarn test
cd platform/packages/design-system/css && yarn test
```

If those exact script names are unavailable in the current AFM checkout, inspect each package's
`package.json` and run the equivalent package-level build, typecheck, and test scripts. If a PR
comments with a branch-specific design-system docs build, open it and smoke-test the relevant token
pages/examples.

Finally, run the repo's own staleness gate and confirm a clean tree:

```bash
yarn workspace @atlaskit/tokens check-clean-git
```

Before merge, answer:

- Did the **full** `yarn build tokens` (not just `codegen-tokens`) run after the final source edit
  and after any merge from the base branch?
- Does `prebuilt/artifacts/token-names.js` contain the new token, and does an example/a11y test that
  uses it compile?
- Are the human-facing examples/docs updated for the new public token(s)?
- Were full-token snapshots in other workspaces (e.g. `help-center/ssr`) searched for and updated?
- Is the working tree clean after build, docs, snapshots, and tests (`check-clean-git` passes)?
- Are generated artifacts — including `prebuilt/` — committed?
- Does the changeset reflect the public API impact?
- Are reviewers told which files are generated vs source?
