# @atlaskit/eslint-plugin-editor

## 1.3.0

### Minor Changes

- [#170695](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170695)
  [`1975de52244da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1975de52244da) -
  Added a new rule no-htmlElement-assignment

## 1.2.0

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

## 1.1.5

### Patch Changes

- [#137614](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137614)
  [`f7efc61f35951`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7efc61f35951) -
  Add export for plugin type from paste options toolbar. Slightly re-arrange plugins to meet linting
  rule.

## 1.1.4

### Patch Changes

- [#92552](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92552)
  [`7cd874b858c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7cd874b858c8) -
  Check target elements are actually HTMLElement rather than typecasting.

## 1.1.3

### Patch Changes

- [#81166](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81166)
  [`a249a1bd29a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a249a1bd29a6) -
  Upgrade ESLint to version 8

## 1.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump
