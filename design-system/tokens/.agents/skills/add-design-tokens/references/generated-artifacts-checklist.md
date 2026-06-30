# Generated Artifacts Checklist

Use this checklist after running token codegen. Exact paths can change; search the local AFM
checkout for the token name and inspect generated banners rather than relying only on this list.

## Source files should drive generated files

Never patch generated files first. If a generated output is wrong, fix the schema/theme/source data
and rerun codegen.

## Expected artifact families

Depending on token category, confirm updates in the relevant families:

| Artifact family               | What to check                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| Token schemas and source maps | New token, palette value, or theme mapping exists in the source-of-truth files.                     |
| TypeScript types              | Public token names and token categories are typed and consumable.                                   |
| Token name/value maps         | Generated token maps include every light/dark/increased-contrast value expected.                    |
| Prebuilt artifacts            | Prebuilt package outputs are regenerated, including signed `@codegen` artifacts.                    |
| Contrast/pairing artifacts    | Foreground/background pairings include new contrast-sensitive tokens where applicable.              |
| Style maps                    | Spacing, radius, typography, elevation, color, or surface maps include the new token when relevant. |
| Figma token outputs           | Figma-facing JSON/output files include the new token and theme variants.                            |
| Design-system docs data       | Docs examples, token tables, or generated docs data include the token when docs expose it.          |
| Forge token partials          | Forge token outputs are updated if the token is exposed to Forge surfaces.                          |
| Package metadata              | Changeset and package generated entrypoints reflect public API changes.                             |

## Manual pre-merge gate

Run this immediately before PR is ready to merge:

```bash
yarn build tokens   # full build (refreshes prebuilt/, not just codegen-tokens)
git status --short
```

Expected result: codegen completes and `git status --short` shows no uncommitted generated changes.

If codegen modifies files, commit them. A token source change without generated package output can
pass branch checks but fail after merge or break consumers.

## Review tips

- In the PR description, separate **source changes** from **generated changes**.
- Mention the exact codegen command used.
- If generated output is very large, point reviewers to the source files and representative
  generated files.
- Search the PR diff for the new token name and confirm it appears in expected source and generated
  surfaces.
- Search for `SignedSource` or `@codegen` to make sure generated file signatures changed only where
  expected.
