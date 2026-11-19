# @atlassian/a2ui-catalog

## 2.1.0

### Minor Changes

- [`197d0be200da9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/197d0be200da9) -
  Add an Agentic Forge v0.9 ResultPanel. It shows a completed result from a title and a summary,
  keeps line breaks in the summary, and has no actions. The catalog id is
  com.atlassian.agentic-forge/v0_9/v1.

## 2.0.0

### Major Changes

- [`ec57cc84535db`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec57cc84535db) -
  Rename `@atlassian/a2ui-catalog` to the public npm package `@atlaskit/a2ui-catalog` and update the
  renderer to consume the new package. Replace the old dependency and import prefix with
  `@atlaskit/a2ui-catalog`; existing API subpaths and wire catalog IDs remain unchanged.

  Expose the prebuilt ADS and Agentic Jira catalog JSON under `catalogs/<slug>/catalog.json` so
  external agent services can load versioned schemas and instructions without copying website
  content or running schema generation. Add external integration guidance covering model context,
  A2UI message output, host compatibility, validation, and user actions. The package now meets the
  production Atlaskit website's public-package scope filter.

## 1.5.0

### Minor Changes

- [`642eddc358bbc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/642eddc358bbc) -
  Publish a standalone `catalog.json` for every A2UI catalog (`catalogs/ads-v0_9/catalog.json`,
  `catalogs/agentic-jira-v0_9-v1/catalog.json`) so third-party agents can author surfaces against
  them. The files are generated from the Zod schemas via `@a2ui/web_core`'s inline-catalog
  conversion, bundle the A2UI common types under `$defs`, and are kept in sync by a drift test.

  New entry points:

  - `@atlassian/a2ui-catalog/catalog-json` — `buildCatalogJson()`, `CATALOG_DEFINITIONS`, and
    related types.
  - `@atlassian/a2ui-catalog/v0_9/catalog-component-apis` — `ADS_CATALOG_COMPONENT_APIS`.
  - `@atlassian/a2ui-catalog/agentic-jira-v0_9/catalog-component-apis` —
    `AGENTIC_JIRA_CATALOG_COMPONENT_APIS`.

  Adds a runtime dependency on `zod-to-json-schema`.

## 1.4.1

### Patch Changes

- [`f519a7f4f803a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f519a7f4f803a) -
  Internal changes as part of package refactor

## 1.4.0

### Minor Changes

- [`aeb49febdb108`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aeb49febdb108) -
  Add CodeDiff line feedback support for the `jira_ai_rendering_a2ui` rollout, including
  selected-line feedback payloads and renderer affordances for sending selected diff context back to
  the host.

## 1.3.0

### Minor Changes

- [`e79f337d6a8cba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e79f337d6a8cba) -
  Add the gated A2UI CodeDiff schema and renderer for reviewing agent-authored code changes.

## 1.2.1

### Patch Changes

- [`b98bf9602b70d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b98bf9602b70d) -
  Improve generated Platform Labs package documentation

## 1.2.0

### Minor Changes

- [`3501db6bf76f5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3501db6bf76f5) -
  Several v0.9 A2UI fixes for the Rovo surface flow:
  - `A2uiSurfaceAdapterRovo` now renders the most recently created surface when `deleteSurface` is
    present and correctly uses new A2UI data
  - Fix the `Column`, `Row`, `Form`, `FormSection`, and `FormFooter` which were running into errors
    when rendering child elements (problem in the `.map`)
  - Make `Text.text` schema now accepts a `{ path }` as previously it rendered `[Object object]` for
    some text

## 1.1.0

### Minor Changes

- [`c4559d7bc329a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4559d7bc329a) -
  Add the Agentic Jira v0.9 catalog (com.atlassian.agentic-jira/v0_9/v1) — a superset of the ADS
  base catalog: every ADS base adapter plus the MultipleChoiceQuestions, RepositoryPicker, and
  ToolApproval composites, with createAgenticJiraCatalog() and interactive playgrounds

## 1.0.0

### Major Changes

- [`6b8a8d9325973`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b8a8d9325973) -
  Publish the A2UI v0.9 packages to the internal registry and restructure their public API.
  - Removed `"private": true` so both packages publish to the internal registry.
  - Replaced the barrel entrypoints with granular, per-file `exports` subpaths backed by
    `src/entry-points/*` shims (mirroring the `@atlaskit/select` pattern), e.g.
    `@atlassian/a2ui-catalog/v0_9/apis`, `@atlassian/a2ui-catalog/v0_9/catalog-id`,
    `@atlassian/a2ui-renderer-next/v0_9/button-adapter`,
    `@atlassian/a2ui-renderer-next/v0_9/surface`.

  BREAKING: the aggregated `@atlassian/a2ui-catalog/v0_9` and `@atlassian/a2ui-renderer-next/v0_9`
  barrel entrypoints have been removed. Import from the specific per-file subpath instead.

## 0.2.0

### Minor Changes

- [`4970442b709e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4970442b709e5) -
  Add the A2UI platform-labs packages: `a2ui-catalog` (component catalog + schemas backed by
  `@a2ui/web_core`) and `a2ui-renderer-next` (the A2UI surface renderer and Rovo surface adapter
  built on `@a2ui/react`). Both consume the v0.10 `@a2ui/*` packages via the platform `root:*`
  anchor.
