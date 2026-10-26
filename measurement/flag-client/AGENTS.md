# @atlaskit/flag-client

Browser-safe client for reading server-evaluated Feature Flag Platform (FFP) flags from a
`BulkEvaluationPayload`. Read the root `AGENTS.md` and `platform/AGENTS.md` first; this file adds
package-specific rules.

## Source of truth

This package is the only implementation of the FFP JavaScript client. It used to live in
`sdks/flag-client-js` in the
[`feature-flag-platform`](https://bitbucket.org/atlassian/feature-flag-platform) repository, which
removed it once this package took over (FFP-142). `feature-flag-platform` now keeps only the specs
that describe the client, so behaviour changes start there and are then implemented here.

- **The specs on FFP's `main` branch are authoritative.** Any change to this package must align with
  the JS client specs on [`main`](https://bitbucket.org/atlassian/feature-flag-platform/src/main/).
  Read the relevant specs before changing behaviour, public types, failure reasons, metadata, or
  diagnostics:
  - [`openspec/specs/client-js-lifecycle/`](https://bitbucket.org/atlassian/feature-flag-platform/src/main/openspec/specs/client-js-lifecycle/):
    construction, payload providers, initialization, and the lifecycle surface.
  - [`openspec/specs/client-js-flag-evaluation/`](https://bitbucket.org/atlassian/feature-flag-platform/src/main/openspec/specs/client-js-flag-evaluation/):
    typed value and details reads, details metadata, and safe defaults.
  - [`openspec/specs/client-js-exposure-logging/`](https://bitbucket.org/atlassian/feature-flag-platform/src/main/openspec/specs/client-js-exposure-logging/):
    exposure telemetry configuration, mapping, deduplication, delivery, and persistence.
  - Search `openspec/specs/` for other `client-js-*` capabilities that may have been added since.
- **In-flight changes live in `openspec/changes/`.** An unarchived change there whose specs touch a
  `client-js-*` capability describes behaviour that isn't on `main` yet. Only implement it here when
  the task asks for it, and say so in the AFM PR so it isn't released before the FFP change lands.
- **Do not diverge silently.** If a change here needs behaviour the `main` specs don't describe, or
  contradicts them, stop and flag it. The spec change must land in `feature-flag-platform` first, or
  alongside this change.
- **Propagate changes upstream.** When you change this package's behaviour, make the matching spec
  update in `feature-flag-platform`, or file a ticket in the FFP Jira project. There is no
  implementation there to update. Link the FFP PR or ticket in the AFM PR description.
- **Pick up work from FFP.** Spec changes on FFP `main` are expected to produce JS client tasks to
  implement here. When starting work on this package, check FFP `main` and the FFP Jira project for
  JS client tasks not yet reflected in AFM.

## Shared test vectors

These fixtures in `src/__tests__/__fixtures__/` are vendored from `feature-flag-platform` and shared
with the server SDKs:

- `bulk-evaluation-fixtures.json` from `sdks/evaluation-test-vectors/bulk-evaluation-fixtures.json`.
- `exposure-test-vectors/` from `sdks/exposure-test-vectors/` (JSON files only).

Do not edit them here. Update them in `feature-flag-platform` and re-copy them.

## AFM conventions

This package was ported from the FFP implementation, and these AFM conventions came with the port.
They are intentional, so don't treat them as drift from the specs:

- The API is exposed through subpath exports (`@atlaskit/flag-client/client` and
  `@atlaskit/flag-client/types`) rather than a root barrel, per AFM rules for new packages.
- Exposure telemetry identifies the SDK as `@atlaskit/flag-client` (`PACKAGE_NAME` in
  `src/version.ts`: the Instrumentation Scope name, `atl.feature_flag.sdk.type`, and the
  `service.name` fallback). `PACKAGE_NAME` and `PACKAGE_VERSION` are `process.env._PACKAGE_NAME_`
  and `process.env._PACKAGE_VERSION_`, injected at build time from `package.json` like other AFM
  packages (`"@product/platform"` and `"0.0.0"` under Jest), so tests compare against the constants
  rather than checking the version against `package.json`.
- Undelivered exposures persist under `@atlaskit/flag-client:exposures:`, the package name.
- `window.localStorage` is read directly with `no-direct-web-storage-usage` suppressed, because a
  public `@atlaskit` package cannot depend on `@atlassian/browser-storage-controls`. The key prefix
  must be registered for Browser Storage Controls before exposure persistence ships.
- Tests use Jest (`@jest-environment node`) instead of Vitest. `expectTypeOf` checks are replaced by
  the compile-time helpers in `src/__tests__/_utils/type-assertions.ts`, enforced by `afm ts check`.
  `vi.stubGlobal` is replaced by `src/__tests__/_utils/stub-globals.ts`.
- The package has no browser-smoke, module-load-smoke, or type-writing build scripts. AFM builds and
  publishes it.

## Consumers

`@atlaskit/feature-gate-js-client` wraps this client alongside Statsig. This package is published to
public npm, so treat the exports in `src/client.ts` and `src/types.ts` as public API, and use
changesets for every change.

## Validation

Run from `platform/`:

```bash
afm test unit packages/measurement/flag-client --run-in-band
afm ts check --project ./packages/measurement/flag-client/tsconfig.app.json
afm lint eslint packages/measurement/flag-client
afm lint oxlint packages/measurement/flag-client
```
