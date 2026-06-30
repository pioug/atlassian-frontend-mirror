# Snapshots and Downstream Tests

Adding a token changes generated output that several places depend on. Some are updated
automatically by codegen; others are **not** and must be updated proactively, or CI on consuming
workspaces will break after merge.

## What codegen already covers

The full token build — `yarn build tokens` — regenerates token output (including `prebuilt/`)
**and** the style maps in the downstream packages:

- `platform/packages/design-system/primitives` (`yarn codegen-styles`)
- `platform/packages/design-system/css` (style maps)
- `platform/packages/design-system/ds-explorations` (`yarn codegen-styles`)
- `platform/packages/forge/forge-ui` (`tokens.partial.tsx`)

So those packages' generated style maps update as part of the normal token codegen. Still run their
tests (below) to catch snapshot/type drift.

## What codegen does NOT cover: full-token-set snapshots

Some packages render the **entire** token stylesheet (all `--ds-*` custom properties) into a Jest
snapshot — typically SSR/bundle entry tests. These live in **separate workspaces** that token
codegen does not rebuild, so adding any token can leave their snapshots stale. Whether a given
snapshot is affected depends on what that bundle inlines, so run the test to confirm rather than
assuming.

Canonical example (Help Center SSR):

```
help-center/ssr/__snapshots__/entry.test.tsx.snap
help-center/ssr/__snapshots__/tesseract.bundle.test.tsx.snap
```

Reference commit: `452541b66153cc0b297bb7385cd5b99b460712e3` ("Update Help Center SSR token
snapshot"), which had to be made separately after a token addition.

## Find all affected snapshots

Search the whole repo — not just `platform/packages/design-system` — for snapshots that embed token
CSS custom properties:

```bash
# Snapshot files that contain token custom properties
rg "--ds-" --glob "**/__snapshots__/*.snap" -l

# Narrow to likely full-token / SSR / reset / stylesheet snapshots
rg -l "ssr|reset|stylesheet|all.?tokens|--ds-" --glob "**/__snapshots__/*.snap"
```

Treat any snapshot that contains a large block of `--ds-*` declarations as a full-token snapshot
that must be regenerated whenever tokens change.

## Update snapshots proactively

Regenerate with Jest's update flag from the owning workspace/package (do this proactively rather
than waiting for the user):

```bash
# Tokens + downstream design-system packages
cd platform/packages/design-system/tokens && yarn test -u
cd platform/packages/design-system/primitives && yarn test -u
cd platform/packages/design-system/ds-explorations && yarn test -u
cd platform/packages/design-system/css && yarn test -u

# Full-token snapshots in other workspaces (example)
cd help-center/ssr && yarn test -u
```

If a package's test script does not pass through `-u`, run its Jest invocation directly with
`--updateSnapshot` (inspect the package's `package.json` `scripts`).

## Verify nothing is stale

After updating source, codegen, docs, and snapshots, confirm the tree is clean using the repo's own
gate:

```bash
yarn workspace @atlaskit/tokens check-clean-git
```

If it reports the tokens are out of date, re-run the full `yarn build tokens` and commit the result.
(`codegen-tokens` alone will not refresh `prebuilt/`.)

## Checklist

- [ ] Full `yarn build tokens` run (regenerates `prebuilt/`, `primitives`, `css`, `ds-explorations`,
      `forge-ui` style maps).
- [ ] Repo-wide search done for full-token snapshots
      (`rg "--ds-" --glob "**/__snapshots__/*.snap"`).
- [ ] Full-token snapshots in other workspaces (e.g. `help-center/ssr`) regenerated with `-u`.
- [ ] Downstream package tests run: `primitives`, `ds-explorations`, `css`.
- [ ] `yarn workspace @atlaskit/tokens check-clean-git` passes.
- [ ] All regenerated snapshots committed.
