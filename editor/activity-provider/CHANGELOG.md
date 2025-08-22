# @atlaskit/activity-provider

## 2.5.1

### Patch Changes

- [`098cfbb01dc36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/098cfbb01dc36) -
  Add missing npmignore files to remove unnecessary files from published package

## 2.5.0

### Minor Changes

- [#165049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165049)
  [`febce5463e07f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/febce5463e07f) -
  Enable no-re-export rule for a subset of editor packages

  ### Major

  #### @atlaskit/collab-provider

  @atlaskit/collab-provider doesn't export following types anymore:

  ```
  CollabParticipant,
  CollabEventInitData,
  CollabEventRemoteData,
  CollabEventConnectionData,
  CollabEventConnectingData,
  CollabEventPresenceData,
  ResolvedEditorState,
  CollabConnectedPayload,
  CollabConnectingPayload,
  CollabDisconnectedPayload,
  CollabInitPayload,
  CollabDataPayload,
  CollabTelepointerPayload,
  CollabPresencePayload,
  CollabMetadataPayload,
  CollabLocalStepsPayload,
  CollabCommitStatusEventPayload,
  CollabPermissionEventPayload,
  UserPermitType,
  CollabEvents,
  Metadata,
  StepJson,
  CollabEventTelepointerData,
  CollabSendableSelection,
  CollabEditProvider,
  NewCollabSyncUpErrorAttributes,
  SyncUpErrorFunction,
  CollabEventLocalStepData,
  ```

  Import them from `@atlaskit/editor-common/collab`.

  #### @atlaskit/editor-common

  `@atlaskit/editor-common/provider-factory` doesn't export following types anymore:

  ```
  CardAdf,
  DatasourceAdf,
  ```

  Import them from `@atlaskit/smart-card`.

## 2.4.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.4.3

### Patch Changes

- [#38762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38762)
  [`b3378348ad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3378348ad8) -
  Dependency `graphql` has been updated to major version 15

## 2.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.3.7

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 2.3.6

### Patch Changes

- [#24950](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24950)
  [`3771da907e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3771da907e9) - Add
  deprecation to package.json

## 2.3.5

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 2.3.4

### Patch Changes

- [#23669](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23669)
  [`09e3f210e94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09e3f210e94) - This
  Activity Provider is now deprecated. Please migrate to using the recent-work-client instead. For
  more details please contact #activity-platform.

## 2.3.3

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 2.3.2

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 2.3.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 2.3.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`903a529a3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/903a529a3e) - Return
  types in activity-provider which will be used in analytics Adds in instrumentation metrics for
  HyperLinkToolBar

## 2.2.0

### Minor Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`d1c666bb6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c666bb6d) - Adds
  activity analytic events

## 2.1.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 2.1.0

### Minor Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`b530b169db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b530b169db) - EDM-642
  update graphql filter

### Patch Changes

- [`db19eeb8c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db19eeb8c5) - - rename
  some of the properties for ActivityItem
  - a new SearchProvider for quick link search

## 2.0.0

### Major Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`71c78f8719`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71c78f8719) - EDM-642
  Use new ActivityProvider and it's going to be a replacement of the existing `@atlaskit/activity`.
  The new ActivityProvider will use the new platform API instead of talking to the old Activity
  Service API.
