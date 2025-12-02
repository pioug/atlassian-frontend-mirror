# @atlaskit/editor-plugin-local-id

## 4.2.6

### Patch Changes

- [`55920a92e882a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55920a92e882a) -
  tsignores added for help-center local consumpton removed
- Updated dependencies

## 4.2.5

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 4.2.4

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema
- Updated dependencies

## 4.2.3

### Patch Changes

- [`be55d2a043969`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be55d2a043969) -
  Use shorter localIds and fix duplicate bug to store less data.
- Updated dependencies

## 4.2.2

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2
- Updated dependencies

## 4.2.1

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1
- Updated dependencies

## 4.2.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [`1b290cb1f993b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b290cb1f993b) -
  Adds actions to get and replace nodes by their localId

  ```ts
  // Replace a local id with a ProseMirror node
  api?.localId.actions.replaceNode({ localId: 'example-id', value: node });

  // Get a prosemirror node based on its local id
  api?.localId.actions.getNode({ localId: 'example-id' });
  ```

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [`687c1b8fa7801`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/687c1b8fa7801) -
  EDITOR-1566 bump adf-schema + update validator

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [`b367661ba720e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b367661ba720e) -
  EDITOR-1562 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [`64ec65231b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64ec65231b4cf) -
  EDITOR-1568 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [`11af83fec458a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11af83fec458a) -
  Don't add localId transactions to history

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [`2e3c46a7095f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e3c46a7095f7) -
  Ignore remote transactions for appending local id transactions
- Updated dependencies

## 2.0.1

### Patch Changes

- [`6af2b9412a71e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6af2b9412a71e) -
  Ignore local id updates for certain transactions
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [`a2cd8c46a3e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2cd8c46a3e94) -
  EDITOR-1442 Bump adf-schema
- Updated dependencies

## 1.0.5

### Patch Changes

- [`e5f37a1deec51`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5f37a1deec51) -
  Added check for localId in the node spec to prevent adding id's to nodes that may not allow it.

## 1.0.4

### Patch Changes

- [`84d49ebfb038b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/84d49ebfb038b) -
  EDITOR-1426 Updated addLocalIdToNode to use setNodeAttribute which creates an attr step instead of
  a replace step as localId attribute changes should not result in a document change.
- Updated dependencies

## 1.0.3

### Patch Changes

- [`655a927604c69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/655a927604c69) -
  Ignore media group node for local id as it is not in the schema for now

## 1.0.2

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version
- Updated dependencies

## 1.0.1

### Patch Changes

- [`a53f6c9834696`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a53f6c9834696) -
  EDITOR-1340 Adds plugin option to use duplicate id detection and fix.
- Updated dependencies

## 1.0.0

### Major Changes

- [#197573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197573)
  [`65dfe86479bb2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/65dfe86479bb2) -
  EDITOR-1101 Setup new package scaffold

### Patch Changes

- Updated dependencies
