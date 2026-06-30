---
name: add-design-tokens
description: >
  Guides contributors through adding new Atlassian Design System tokens in AFM. Use when creating,
  updating, or reviewing `@atlaskit/tokens` token schema changes, generated token artifacts, Figma
  token outputs, token docs, or token build failures. Enforces the manual token codegen and
  verification steps that branch CI may not protect before merge.
---

# Add Design Tokens

Use this skill when adding or reviewing Atlassian Design System token changes in AFM, especially
`@atlaskit/tokens` changes that produce generated artifacts.

## When to Use

- User asks to add, update, rename, deprecate, or review design tokens.
- Work touches `platform/packages/design-system/tokens` or generated token artifacts.
- A PR adds token schemas, palette/base tokens, semantic tokens, theme mappings, style maps, Forge
  partials, Figma token outputs, or docs examples.
- A token PR has many generated files and the user wants confidence no steps were missed.
- Builds fail on token artifacts, signed generated files, missing token exports, docs token output,
  or prebuilt token assets.

## When NOT to Use

- Consuming existing tokens in product UI only → use `atlassian-design-system` or
  `ui-styling-standard`.
- Designing whether a new reusable token should exist before implementation → use
  `add-frontend-offering` first.
- Non-token ADS component work → use `atlassian-design-system`.
- General frontend lint/type failures unrelated to tokens → use the relevant pipeline failure skill.

## Auth

No auth is required to use this skill locally. Access to AFM, Bitbucket PRs, Pipelines, and relevant
Jira tickets may be needed for implementation or review.

## Workflow

1. **Classify the token change** using [workflow.md](references/workflow.md): palette/base token,
   semantic token, theme mapping, interaction state, elevation/surface, spacing/radius/typography,
   or deprecation.
2. **Find source-of-truth files first.** Do not edit generated artifacts by hand. Locate the
   schema/theme/source files that should produce the generated outputs.
3. **Implement source changes** in the token package and add a changeset for `@atlaskit/tokens` when
   package output changes. 3a. **Widen hand-authored TypeScript types** to match the new tokens —
   see [workflow.md](references/workflow.md) §3a. These are source files (e.g.
   `tokens/src/types.tsx` `SurfaceTokenSchema`, `primitives/src/utils/types.tsx`
   `BackgroundColorToken`), so codegen and `check-clean-git` will **not** catch them; a missed
   widening fails only at `afm ts check` (e.g. `TS2353` for nested `[default]`/`hovered`/`pressed`
   states). Mirror an existing sibling (`overlay`/`raised`), and leave types that intentionally omit
   states unchanged.
4. **Run the FULL token build manually before merge.** This is mandatory: branch CI may not catch
   missing generated token artifacts. The canonical command is the full build, `yarn build tokens`.
   **Do not stop at `codegen-tokens`** — it regenerates `src/artifacts/` but does **not** refresh
   `prebuilt/artifacts/token-names.js`, the allow-list the Babel plugin validates `token('…')` calls
   against. A stale `prebuilt/` passes `check-clean-git` locally but fails CI with
   `token '<name>' does not exist`. See [workflow.md](references/workflow.md) §5. **Re-run the full
   build after every merge/rebase from the base branch** — generated artifacts (including
   `prebuilt/`) depend on the whole token set, so an upstream token landing can make your branch
   stale even if your source didn't change.
5. **Review generated artifacts** with
   [generated-artifacts-checklist.md](references/generated-artifacts-checklist.md). Generated files
   commonly include signed `@codegen` outputs, TypeScript token types, token maps, prebuilt
   artifacts, Figma outputs, docs data, style maps, and Forge token partials.
6. **Author or refresh human-facing docs and examples** using
   [docs-and-examples.md](references/docs-and-examples.md). Generated docs _data_ (e.g.
   `token-metadata.codegen.tsx`) is not enough: new public tokens must also be shown in the
   hand-authored `tokens/examples/*` and, where applicable, the per-category usage guidance in
   `tokens/docs/ai/*`.
7. **Update snapshots and downstream tests** using
   [snapshot-and-downstream-tests.md](references/snapshot-and-downstream-tests.md). Some packages
   embed the entire token set in a snapshot (e.g. `help-center/ssr`), and these live in workspaces
   **not** rebuilt by the token build. Search the whole repo for full-token snapshots and
   proactively regenerate them.
8. **Run targeted verification.** At minimum, run the full token build, package tests or type checks
   affected by tokens, downstream package tests (`primitives`, `ds-explorations`, `css`), and any
   docs/build command required by changed token docs. **Prove `prebuilt/` is current** by compiling
   a file that uses the new token (e.g. the dst-examples a11y suite) — `check-clean-git` alone will
   not catch a stale `prebuilt/`.
9. **Debug failures** using [build-failures.md](references/build-failures.md). Prefer regenerating
   from source over patching generated files.
10. **Pre-merge gate:** confirm no generated artifacts are stale. Run the repo's own staleness
    check, `yarn workspace @atlaskit/tokens check-clean-git`, **and** confirm an example using the
    new token compiles (proves `prebuilt/` is fresh). If the full build changes files, commit those
    files before review/merge.

## Reference

- [workflow.md](references/workflow.md) — implementation flow and source-file discovery.
- [generated-artifacts-checklist.md](references/generated-artifacts-checklist.md) — files and
  outputs to verify before PR merge.
- [docs-and-examples.md](references/docs-and-examples.md) — hand-authored token docs/examples to
  update for new public tokens.
- [snapshot-and-downstream-tests.md](references/snapshot-and-downstream-tests.md) — finding and
  updating full-token snapshots and downstream package tests.
- [build-failures.md](references/build-failures.md) — common build/codegen failures and fixes.

## Non-Negotiables

- Never hand-edit generated token artifacts as the primary fix.
- When adding nested/interaction-state tokens, widen the hand-authored TS types (schema + token-name
  unions) in the same change and verify with `afm ts check` (0 errors for `tokens`, `primitives`,
  `ds-explorations`, `css`); these source-file types are not protected by codegen or
  `check-clean-git`.
- Always run the **full** token build (`yarn build tokens`), not just `codegen-tokens`, before
  merging token PRs — only the full build refreshes `prebuilt/`, which the Babel plugin's `token()`
  allow-list depends on.
- Re-run the full token build (and `check-clean-git`) after every merge/rebase from the base branch,
  then commit any regenerated files; never hand-merge generated token artifacts.
- Never trust `check-clean-git` alone as proof the build is complete — it does not detect a stale
  `prebuilt/`, nor phantom/orphaned generated files. Confirm by compiling a file that uses the new
  token.
- Review the diff for generated/signed files unrelated to your change: the `prebuilt/` copy step
  doesn't clean first, so stale `dist/cjs` leftovers (e.g. unrelated theme files) can be swept in. A
  newly-added artifact is only legitimate if it has a source in `src/artifacts/` and/or already
  exists on the base branch; otherwise remove it.
- If the build changes files (including `prebuilt/`), include those generated files in the PR.
- Treat missing generated artifacts as release-blocking: consumers can import a token that was added
  in source but unavailable in generated package output.
- Include or update a changeset whenever `@atlaskit/tokens` package behavior or exports change.
- Update human-facing docs and examples (`tokens/examples/*`, `tokens/docs/ai/*`) for every new
  public token — generated docs data alone is insufficient.
- Search the whole repo (not just the tokens package) for full-token-set snapshots and proactively
  update them; token codegen does not touch other workspaces such as `help-center/ssr`.
- Before merge, run `yarn workspace @atlaskit/tokens check-clean-git` and ensure the working tree is
  clean.
