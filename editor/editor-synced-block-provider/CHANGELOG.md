# @atlaskit/editor-synced-block-provider

## 3.14.0

### Minor Changes

- [`55d9a4080dfa8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55d9a4080dfa8) -
  parentAri field for fetch/write providers are mandatory

## 3.13.2

### Patch Changes

- [`87abc5dda86fe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87abc5dda86fe) -
  [ux] Show last edited time in sync block tooltip
- Updated dependencies

## 3.13.1

### Patch Changes

- [`ab11bedd7f6e6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ab11bedd7f6e6) -
  Fix over logging of source ari not found error

## 3.13.0

### Minor Changes

- [`870c3baec758b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/870c3baec758b) -
  Enable consumers to use GraphQL subscription for fetching the block data when the block changes

### Patch Changes

- [`5c522f81f181e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5c522f81f181e) -
  [ux] EDITOR-4369 Support synced location for references on Jira in source and reference synced
  block
- [`058065aadf69f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/058065aadf69f) -
  [ux] [EDITOR-2851] Support reference sync block unsyc
- Updated dependencies

## 3.12.1

### Patch Changes

- [`7f41011a1b0ff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f41011a1b0ff) -
  EDITOR-1665 update sync block experience events to use general experience ids, keep existing error
  events and add success events
- Updated dependencies

## 3.12.0

### Minor Changes

- [`3d9abca1c1cd9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d9abca1c1cd9) -
  The batch retrieve of the blocks must also send document ARI and also the local instance ID of the
  reference blocks

## 3.11.0

### Minor Changes

- [`7b4cb91fc67a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b4cb91fc67a6) -
  Do not immediately show error state on initial load of blocks

## 3.10.0

### Minor Changes

- [`7638bd91b6c72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7638bd91b6c72) -
  The errors should render correctly when using batch-retrieve to fetch synced blocks

## 3.9.0

### Minor Changes

- [`fe0f9c8de91c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe0f9c8de91c3) -
  The batch retrieve of the blocks must also send document ARI and also the local instance ID of the
  reference blocks

## 3.8.1

### Patch Changes

- [`7b1f7ff1a2235`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b1f7ff1a2235) -
  [ux] [EDITOR-4536] Update synced location dropdown UI
- Updated dependencies

## 3.8.0

### Minor Changes

- [`9b427b1878556`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b427b1878556) -
  EDITOR-2850 create resource-id utils and unify the creation and parse

### Patch Changes

- Updated dependencies

## 3.7.0

### Minor Changes

- [`4490bcc4595c4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4490bcc4595c4) -
  Render some smart links loading states in SSR to match Editor's renderer

## 3.6.1

### Patch Changes

- [`f0124a523d8f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0124a523d8f1) -
  [ux] [EDITOR-2845] Implement synced location for source and reference sync block
- Updated dependencies

## 3.6.0

### Minor Changes

- [`8100ae00326b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8100ae00326b4) -
  EDITOR-2850-add media ssr support for sync blocks

### Patch Changes

- [`fff45a651440a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fff45a651440a) -
  EDITOR-1665 add experience tracking analytics for sync block save, fetch and delete
- Updated dependencies

## 3.5.5

### Patch Changes

- [`a36447029e3c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a36447029e3c3) -
  Add fetchMediaToken helper function to synced block provider confluence client.

## 3.5.4

### Patch Changes

- [`0248c6fa91442`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0248c6fa91442) -
  EDITOR-4310 Ensure confirmation callback is cleaned up properly

## 3.5.3

### Patch Changes

- [`bf9309f0d44d1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf9309f0d44d1) -
  Pass parentAri to block service provider
- Updated dependencies

## 3.5.2

### Patch Changes

- [`54cbf654939aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/54cbf654939aa) -
  Send current document ARI when fetching block

## 3.5.1

### Patch Changes

- [`19ca45d2afec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19ca45d2afec9) -
  EDITOR-3596 Fix mentions and profile card in Synced Blocks in Jira Renderer
- Updated dependencies

## 3.5.0

### Minor Changes

- [`25da5a5d67a2a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25da5a5d67a2a) -
  EDITOR-2257 implement resourceId conversion and enable SSR

## 3.4.1

### Patch Changes

- [`656adaeec9d0b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/656adaeec9d0b) -
  [ux] EDITOR-1665 add experience tracking for create sync block
- Updated dependencies

## 3.4.0

### Minor Changes

- [`f660139caa049`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f660139caa049) -
  Use the batch retrieve endpoint instead of singular endpoint to get block

## 3.3.0

### Minor Changes

- [`bf49041938d1a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf49041938d1a) -
  EDITOR-2257 editor synced blocks ssr part 1

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [`d1a28b3f74e5e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1a28b3f74e5e) -
  EDITOR-3594 Add creator Synced Block helpers for Jira Renderer

## 3.2.1

### Patch Changes

- [`08984e84a58de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08984e84a58de) -
  EDITOR-3594 Improve ARIs handling to ensure correctness

## 3.2.0

### Minor Changes

- [`b7db97837674e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7db97837674e) -
  Use GraphQL endpoint for fetching references on a document instead of Rest API

## 3.1.0

### Minor Changes

- [`324fe88e2a5e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/324fe88e2a5e0) -
  EDITOR-4048 Stop flickering on repositioning of synced blocks

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.16.3

### Patch Changes

- [`ef9a29c147d99`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef9a29c147d99) -
  EDITOR-4021 Ensure store manager reference remains stable when fireAnalytics callback changes.
- Updated dependencies

## 2.16.2

### Patch Changes

- [`98568bfc82648`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98568bfc82648) -
  Export SyncedBlockRendererDataProviders type
- Updated dependencies

## 2.16.1

### Patch Changes

- [`5f9c5b4ae25c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f9c5b4ae25c7) -
  EDITOR-3594 Add Jira ARI utility functions to synced block provider

## 2.16.0

### Minor Changes

- [`1e626a0fb59a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1e626a0fb59a7) -
  Can pass in get NCS step version function

## 2.15.6

### Patch Changes

- [`d40079fdeef5d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d40079fdeef5d) -
  EDITOR-4044 Fix a race condition in source sync block dirty tracking logic
- [`267f0abf6b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/267f0abf6b4cf) -
  EDITOR-4044 Fix a race condition in reference sync block dirty tracking logic
- Updated dependencies

## 2.15.5

### Patch Changes

- [`a4ed9f55162ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a4ed9f55162ae) -
  EDITOR-3960 Refactor Synced Blocks initialization to remove multiple re-renders and duplicated
  fetches
- Updated dependencies

## 2.15.4

### Patch Changes

- [`a41bf96788d92`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a41bf96788d92) -
  [ux] Fix sync block permissions denied error to show the correct state

## 2.15.3

### Patch Changes

- [`f14e76661c943`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f14e76661c943) -
  [EDITOR-2844] Save reference synced block on document to BE when a page is saved
- Updated dependencies

## 2.15.2

### Patch Changes

- [`70face9ce7f1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/70face9ce7f1b) -
  EDITOR-3778 optimise flush to only send to BE when sync block data changes
- Updated dependencies

## 2.15.1

### Patch Changes

- [`bf478ab5eb042`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf478ab5eb042) -
  Fix reference synced block displays error view after re-creation despite successful fetch from
  backend

## 2.15.0

### Minor Changes

- [`4daaa6358e6fb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4daaa6358e6fb) -
  Update resourceId generation for create reference from browser copy + pasting source block

### Patch Changes

- [`dcc6a3e73f414`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dcc6a3e73f414) -
  [ux] EDITOR-3304 add offline error state for sync blocks and update other error UI to match new
  designs
- Updated dependencies

## 2.14.1

### Patch Changes

- [`433b512284284`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/433b512284284) -
  [EDITOR-2558] Update bodiedSyncBlock deletion failure flow
- Updated dependencies

## 2.14.0

### Minor Changes

- [`8f3a22c66ae60`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f3a22c66ae60) -
  Update to read from ssr cache

## 2.13.1

### Patch Changes

- [`d04179e359d44`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d04179e359d44) -
  EDITOR-2484 fix flush return on error

## 2.13.0

### Minor Changes

- [`676d28a61e356`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/676d28a61e356) -
  Add runtime blockAri generation for endpoint calls, update resourceId generation for create
  reference from toolbar

## 2.12.3

### Patch Changes

- [`707c3960baedb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/707c3960baedb) -
  EDITOR-1923 retry api requests on rate limited for sync block provider
- Updated dependencies

## 2.12.2

### Patch Changes

- [`fd932d0fad4a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fd932d0fad4a5) -
  [ux] EDITOR-3693 separate sync block creation and update into different provider calls
- [`1f90e6ac4a228`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1f90e6ac4a228) -
  [ux] EDITOR-3662 fix sync block error merging logic to retain old information on error

## 2.12.1

### Patch Changes

- [`e3779b75fdeca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3779b75fdeca) -
  EDITOR-1643 Promote syncBlock and bodiedSyncBlock to full schema
- Updated dependencies

## 2.12.0

### Minor Changes

- [`b5512b047226d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5512b047226d) -
  EDITOR-2256 add fetch reference integration

## 2.11.3

### Patch Changes

- [`48a3dd84c602b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/48a3dd84c602b) -
  [EDITOR-3394] Decouple editorView from source manager
- Updated dependencies

## 2.11.2

### Patch Changes

- [`1511d9ee0c2e3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1511d9ee0c2e3) -
  [ux] EDITOR-3643 populate source url and title for sync block with block service by returning
  source ari and product from fetchData

## 2.11.1

### Patch Changes

- [`99387f7d6303b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99387f7d6303b) -
  [ux] [EDITOR-2767] Implement bodiedSyncBlock creation/deletion undo/redo

## 2.11.0

### Minor Changes

- [`1ed7afa478690`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1ed7afa478690) -
  Update the blocks endpoint calls to match API design

### Patch Changes

- [`0cc1855e9071d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0cc1855e9071d) -
  EDITOR-1921 add analytics for sync block provider failures
- Updated dependencies

## 2.10.6

### Patch Changes

- [`23c24c4b7faff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23c24c4b7faff) -
  EDITOR-3312 Make data handling product agnostic
- Updated dependencies

## 2.10.5

### Patch Changes

- Updated dependencies

## 2.10.4

### Patch Changes

- [`e48b21e64bb2e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e48b21e64bb2e) -
  EDITOR-3312 Populate the sync block data on creation and fetch properly
- Updated dependencies

## 2.10.3

### Patch Changes

- [`964b980644f9d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/964b980644f9d) -
  EDITOR-3348 Refactor Synced Block Store Manager
- [`caa54ec7bac4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/caa54ec7bac4c) -
  EDITOR-3312 Refactor and restructure synced block provider

## 2.10.2

### Patch Changes

- [`27e34de207285`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27e34de207285) -
  EDITOR-2771 Create media & emoji provider per each reference sync block
- Updated dependencies

## 2.10.1

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema
- Updated dependencies

## 2.10.0

### Minor Changes

- [`00d86f82d23fa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/00d86f82d23fa) -
  Move ARI checks to providers

### Patch Changes

- Updated dependencies

## 2.9.1

### Patch Changes

- [`e3aafa008fcf4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3aafa008fcf4) -
  EDITOR-2771 Pass parent Editor/Renderer data providers through SyncBlockDataProvider to the nested
  renderer
- Updated dependencies

## 2.9.0

### Minor Changes

- [`e0dc40edfc665`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e0dc40edfc665) -
  Update the resource ID generation for blockAri format

## 2.8.0

### Minor Changes

- [`ec416ddf3747c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec416ddf3747c) -
  Add a block service API provider

## 2.7.4

### Patch Changes

- [`3432c4a4a074c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3432c4a4a074c) -
  [ux] EDITOR-2525 update block menu convert to sync block to support all fishfooding node types

## 2.7.3

### Patch Changes

- [`2ccc83663f44b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2ccc83663f44b) -
  [EDITOR-2744] Fix deleting source sync block re-creates the node in live page
- Updated dependencies

## 2.7.2

### Patch Changes

- [`7bb84f91500cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bb84f91500cf) -
  [ux] EDITOR-2442 update warning modal on source sync block deletion

## 2.7.1

### Patch Changes

- [`23f6c637ea176`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23f6c637ea176) -
  [ux] EDITOR-2629 redirect to source edit page instead of view page on edit source url click in
  sync block

## 2.7.0

### Minor Changes

- [`5b03ddd528034`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5b03ddd528034) -
  [EDITOR-2542] Save new bodiedSyncBlock to backend when creating the node, so that the node can be
  copied and reference without page being published/updated

## 2.6.0

### Minor Changes

- [`261fa27c56fd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/261fa27c56fd0) -
  EDITOR-2533 implement retry function for sync-block renderer

## 2.5.2

### Patch Changes

- [`7e3353721fa66`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e3353721fa66) -
  [ux] EDITOR-1822 update sync blocks ui to new design

## 2.5.1

### Patch Changes

- [`ff3e1422d5b70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff3e1422d5b70) -
  [ux] EDITOR-2437 implement request access to sync block component

## 2.5.0

### Minor Changes

- [`424619eee38cb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/424619eee38cb) -
  EDITOR-2451 add tests and refactor

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [`7d9f7451809ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7d9f7451809ce) -
  [EDITOR-2481] Move in memory write/fetch provider to @af/editor-examples-helpers/utils

## 2.3.1

### Patch Changes

- [`eb9f8e2ab6fb5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb9f8e2ab6fb5) -
  [EDITOR-2543] Save bodiedSyncBlock deletion to BE instantly

## 2.3.0

### Minor Changes

- [`6f9f13ab4687d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f9f13ab4687d) -
  EDITOR-2451 update sync-block refreshed logic based on experience principles

## 2.2.3

### Patch Changes

- [`b32a210dc472a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b32a210dc472a) -
  Refactor async logic

## 2.2.2

### Patch Changes

- [`f282b1ca41f1c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f282b1ca41f1c) -
  EDITOR-1648 refactor of sync block error types

## 2.2.1

### Patch Changes

- [`127d07803ff4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/127d07803ff4c) -
  Internal refactor of sync block store manager
- Updated dependencies

## 2.2.0

### Minor Changes

- [`49860e3111ce8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/49860e3111ce8) -
  [ux] [EDITOR-2481] Implement plugin action flushBodiedSyncBlocks so that bodied sync block content
  is only updated when required

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [`62d0954696c7e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/62d0954696c7e) -
  [ux] EDITOR-1648 handle permission denied, not found and any generic error for sync block

## 2.1.1

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2
- Updated dependencies

## 2.1.0

### Minor Changes

- [`7ef8ad00e2b1f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7ef8ad00e2b1f) -
  EDITOR-2430 Update the sync-blocker-tracker to work properly for bodied-sync-block

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1
- Updated dependencies

## 2.0.0

### Major Changes

- [`7b80545f98f03`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b80545f98f03) -
  Move use hooks into manager, refactor manager API

## 1.0.0

### Major Changes

- [`10882b2fab738`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/10882b2fab738) -
  [ux] Introduced bodiedSyncBlock nodeview

## 0.9.0

### Minor Changes

- [`d69b1dec4af70`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d69b1dec4af70) -
  Generate link to source block with localid parameter

## 0.8.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

### Patch Changes

- Updated dependencies

## 0.7.0

### Minor Changes

- [`4140dc02feebd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4140dc02feebd) -
  Add support for blogpost pages in content property provider

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [`218e1d54178bb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/218e1d54178bb) -
  Pre-fetch URL to source blocks

## 0.5.3

### Patch Changes

- Updated dependencies

## 0.5.2

### Patch Changes

- [`e053b5e610ac2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e053b5e610ac2) -
  [ux] EDITOR-1652 add convert to sync block to block menu

## 0.5.1

### Patch Changes

- [`1256b3dd0431e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1256b3dd0431e) -
  Fix isSource check in provider

## 0.5.0

### Minor Changes

- [`3ebbf8e97e2d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ebbf8e97e2d9) -
  Simplify provider API

## 0.4.0

### Minor Changes

- [`acb8231bc9e0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/acb8231bc9e0c) -
  EDITOR-1779 - "rebase" the transaction to reflect the latest document state

## 0.3.0

### Minor Changes

- [`9e7a5a0bb1869`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e7a5a0bb1869) -
  Add content api sync block provider

## 0.2.0

### Minor Changes

- [`6fabf6d555515`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fabf6d555515) -
  EDITOR-1566 add renderer sync-block node support

## 0.1.3

### Patch Changes

- [`dd19fd49edc58`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd19fd49edc58) -
  Added sync block quick insert

## 0.1.2

### Patch Changes

- [`6e2b6f72d4bc2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e2b6f72d4bc2) -
  Added floating toolbar for sync block

## 0.1.1

### Patch Changes

- Updated dependencies
