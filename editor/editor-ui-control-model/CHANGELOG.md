# @atlaskit/editor-ui-control-model

## 2.10.0

### Minor Changes

- [`fc26bfc51dd5c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fc26bfc51dd5c) -
  Add sparse block-control surface anchors, intersection-driven candidates, and explicit visibility
  invalidation for registry-backed block controls. Expose registration change subscriptions from the
  UI control registry model, and refresh cached visibility from suggestion and collapse transaction
  metadata. Under `platform_editor_block_control_migration`, use native node-anchor identity across
  Editor and Block Controls, and route expand keyboard focus through the shared Block Controls
  command. Preserve Show Diff visibility checks in both migration cohorts so block controls stay
  hidden while a diff is displayed. Keep the block menu closed when a migrated layout-column handle
  opens the layout menu, and close the layout menu when the selection moves away from its selected
  columns.

## 2.9.0

### Minor Changes

- [`c5ff0c329170a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c5ff0c329170a) -
  Add a dedicated createSurfaceContext entrypoint and use it in editor runtime packages.

## 2.8.1

### Patch Changes

- [`5f66a8c3706e3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f66a8c3706e3) -
  Add the registry-backed Block Controls Quick Insert surface behind
  `platform_editor_block_control_migration`, including typed surface context, cached registry
  lookup, stable left/right surface identities, and experiment-gated Quick Insert registration.

## 2.8.0

### Minor Changes

- [`edcef04b6350e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/edcef04b6350e) -
  Add the Quick Insert recommendation resolver API and typed surface context support for the gated
  `platform_editor_slash_command` Recommended menu. TypeAhead uses immutable surface context for
  visibility and React context for registered Quick Insert rendering, while Quick Insert keeps one
  recommendation snapshot per menu open. Fix Quick Insert declaration generation.

## 2.7.0

### Minor Changes

- [`f213e995cbb18`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f213e995cbb18) -
  Support replacing and removing registered snippet Quick Insert items behind
  `platform_editor_slash_command`.

## 2.6.0

### Minor Changes

- [`3a4c286fdb8c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3a4c286fdb8c1) -
  Add registry-backed Quick Insert search matching under the existing
  `platform_editor_slash_command` experiment. Make native, provider, and extension registered Quick
  Insert items searchable.

## 2.5.0

### Minor Changes

- [`c0cf420333ef1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c0cf420333ef1) -
  Add public registration APIs for provider-backed Quick Insert components.

  Providers can expose registered items directly:

  ```tsx
  const getComponents = async () => [
  	{
  		key: 'insert-table',
  		component: TableItem,
  		parents: [{ type: 'menu-section', key: 'quick-insert', rank: 1 }],
  	},
  ];
  ```

## 2.4.0

### Minor Changes

- [`4bc741a70d678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4bc741a70d678) -
  Add the first registry-backed Quick Insert slice with Table

## 2.3.0

### Minor Changes

- [`51c33ef5349b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/51c33ef5349b6) -
  Enable compatibility with React 19.2.0

## 2.2.0

### Minor Changes

- [`779a0020403de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/779a0020403de) -
  Add async hidden support to paste menu registered components, including timeout/error handling and
  single Smart Link URL context from the paste options toolbar. Use Smart Card access checks to hide
  Smart Link Display as options and AI Add Summary / Ask Rovo paste actions for inaccessible
  single-link pastes in Confluence.

## 2.1.0

### Minor Changes

- [`cd097a2111788`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd097a2111788) -
  Republish packages depending on `@atlaskit/react-compiler-gating` so their published dependency
  reference is updated to the renamed `@atlaskit/react-compiler-gating` scope.

  The earlier rename of `@atlassian/react-compiler-gating` to `@atlaskit/react-compiler-gating` only
  bumped the renamed package itself, so dependent packages were never republished and their
  published versions still referenced the old `@atlassian/react-compiler-gating` name, which is not
  available in the public npm registry. This minor bump republishes all affected packages with the
  corrected dependency.

## 2.0.1

### Patch Changes

- [`ee28cf33718b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee28cf33718b0) -
  Add @atlaskit/react-compiler-gating as a runtime dependency to enable React Compiler platform
  gating.
- Updated dependencies

## 2.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

## 1.2.0

### Minor Changes

- [`7b2ab46c79d94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b2ab46c79d94) -
  Autofix: add explicit package exports (barrel removal)

## 1.1.1

### Patch Changes

- [`9e45c7ac76c9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e45c7ac76c9a) -
  Enrol editor core packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform

## 1.1.0

### Minor Changes

- [`031e535207444`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/031e535207444) -
  Implements the surface renderer for the new Editor UI controls registry, providing a unified
  component for rendering editor menu trees.

## 1.0.0

### Major Changes

- [`35fd4b17a4355`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/35fd4b17a4355) -
  EDITOR-5598 Create initial implementation of Editor UI Control Registry, implementing its API for
  adding elements to the registry and retrieving menu elements for a surface.
