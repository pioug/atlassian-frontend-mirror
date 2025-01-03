# @atlaskit/feature-gate-js-client

## 4.23.3

### Patch Changes

- [#99483](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99483)
  [`851e510c3036c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/851e510c3036c) -
  Refactored internals to prepare for non-static client usage.

## 4.23.2

### Patch Changes

- [#167601](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167601)
  [`46d0f99bcbbac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46d0f99bcbbac) -
  Fixed type for window.**FEATUREGATES_JS**

## 4.23.1

### Patch Changes

- [#166741](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166741)
  [`3d620e0c95d2f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d620e0c95d2f) -
  Trigger subscriptions when local overrides are changed

## 4.23.0

### Minor Changes

- [#163513](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163513)
  [`740148acc161b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/740148acc161b) -
  add feature flag override support for Criterion

## 4.22.0

### Minor Changes

- [#157451](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157451)
  [`3733e5e12d1dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3733e5e12d1dc) -
  Update statsig-js-lite

## 4.21.0

### Minor Changes

- [#158460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158460)
  [`bcb59292573a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bcb59292573a3) -
  Set a sensible default for `perimeter` based on the hostname, rather than always defaulting to
  commercial

## 4.20.2

### Patch Changes

- [#154235](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154235)
  [`40d7270897472`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40d7270897472) -
  Export CheckGateOptions type

## 4.20.1

### Patch Changes

- [#153087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153087)
  [`476c1b4e48adb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/476c1b4e48adb) -
  Bugfixes - subscriptions method support when update user without using a provider, and fix to
  update user with provider when update fails

## 4.20.0

### Minor Changes

- [#151557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151557)
  [`0935b95608ca3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0935b95608ca3) -
  Add support for providers to initialize and update users

## 4.19.0

### Minor Changes

- [#140090](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140090)
  [`69b1ce7f8cfc5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/69b1ce7f8cfc5) -
  Introduce `productIntegrationsVendorId`, `bitbucketConnectAppId` and `bitbucketRepositoryId`
  identifier types

## 4.18.0

### Minor Changes

- [#107367](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107367)
  [`f5b17f8223772`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5b17f8223772) -
  [ux] Add getLayer, getLayerValue and manuallyLogLayerExposure method to the FeatureGates class

## 4.17.2

### Patch Changes

- [#103967](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103967)
  [`52eed0e32c8b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52eed0e32c8b) -
  Refactored some code to support lower ECMAScript versions

## 4.17.1

### Patch Changes

- [#102857](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102857)
  [`26aafa87daf6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26aafa87daf6) -
  Bump statsig-js-lite to v1.3.1

## 4.17.0

### Minor Changes

- [#92417](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92417)
  [`917bb55883de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/917bb55883de) -
  Introduce `bitbucketWorkspaceId` identifier type.

## 4.16.1

### Patch Changes

- [#90633](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90633)
  [`11fe9dfc5d0a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/11fe9dfc5d0a) -
  Make the check for an existing FeatureGate client on the window safer. Only log warn when there is
  a version mismatch found between the existing FeatureGate client and the current one.

## 4.16.0

### Minor Changes

- [#89773](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89773)
  [`654f882d8efe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/654f882d8efe) - -
  Add optional `fireGateExposure` option to `checkGate` in order to allow suppression of gate
  exposure events.
  - Expose `manuallyLogGateExposure` from `Statsig` class.
  - Expose `getOverrides` from `Statsig` class.

## 4.15.2

### Patch Changes

- [#87981](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87981)
  [`2a138baa0014`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a138baa0014) -
  Updated the request timeout and ensure doc-comments match reality

## 4.15.1

### Patch Changes

- [#89200](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89200)
  [`74d711290a14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/74d711290a14) -
  Ensure the `DynamicConfig` class is exported, so that new instances can be created for testing.

## 4.15.0

### Minor Changes

- Introduce `activationId` identifier type.

## 4.14.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 4.14.0

### Minor Changes

- [#81461](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81461)
  [`f01ea03ca266`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f01ea03ca266) -
  Added optional `perimeter` initialization option to allow customization of the base url for the
  `feature-flag-service` based on environment and perimeter type; this parameter enables use of this
  client in FedRAMP envrionments.

## 4.13.0

### Minor Changes

- [#76457](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76457)
  [`c15908464f29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c15908464f29) -
  Migrated @atlassian/feature-gate-js-client to @atlaskit/feature-gate-js-client

## 4.12.0

- Introduce `msTeamsTenantId` identifier type.

## 4.11.0

- Allows for multiple copies of a `@atlassian/feature-gate-js-client` to work together via global
  variable. If multiple copies of `@atlassian/feature-gate-js-client` prior to v4.11.0 exist in your
  frontend bundles, race conditions may cause strange behaviour in evaluations.

## 4.10.0

- Introduce `gsacIssueId` identifier type.
- Introduce `intercomConversationId` identifier type.
- Introduce `marketplacePartnerId` identifier type.
- Introduce `randomizationId` identifier type. A fallback identifier when there are no other
  applicable identifiers. This cannot be used with metrics.

## 4.9.0

- Add optional analyticsClient parameter to `initialize` and `initializeFromValues` functions. If
  passed in, this will enable the collection of monitoring events which can be used to debug any
  issues with client initialization.

## 4.8.0

- Add support for Arrays of strings in `CustomAttributes`.

## 4.7.1

- Fixed bug that caused `undefined` values for the `fireExperimentExposure` options to be treat as
  `false` instead of the default value `true`.

## 4.7.0

- Change `setOverrides` to accept a `Partial<LocalOverrides>` instead of `LocalOverrides`. The
  client will now provide its own defaults for any missing fields.

## 4.6.1

- Added a try/catch around `checkGate`, where `false` will be returned if there are errors.

## 4.6.0

There is a new default value for the `eventLoggingApi` initialization parameter:
`https://xp.atlassian.com/v1/`. This will prevent exposure event loss due to ad blockers blocking
Statsig's default event logging API.

Please see [this blog](https://hello.atlassian.net/wiki/spaces/MEASURE/blog/3116404078) and the
"Exposure Event Logging" section of the [README](./README.md) for more information.

## 4.5.0

- Introduce `marketplaceAnonymousId` identifier type

## 4.4.0

- Introduce `trelloWorkspaceId` identifier type

## 4.3.1

- Removed initialize warning for client if initialized multiple times with identical parameters.
  Warning will show when client initialized with different parameters.
- Removed `filterTags` from `clientOptions`. `filterTags` will no longer be an accepted parameter to
  pass to the client when initializing.

## 4.3.0

- Added logic to use `customAttributes` from `feature-flag-service` response when creating or update
  `Statsig.User`. This will support TAP traits for User Dimensions.

## 4.2.1

- Fix `window is not defined` error that occurs when the module is loaded in a server environment

## 4.2.0

- Added a new `isCurrentUser` method, which can be used to check whether the currently configured
  user aligns with a given set of values.

## 4.1.0

- Added a new `initializeCompleted` method, which can be used to check whether the
  `initialize`/`initializeFromValues` Promises have been resolved yet.
- Added conditional logic to setting of the `window.__FEATUREGATES_JS__` global variable to allow
  this package to be imported in server-side rendering environments, which don't contain a global
  variable for `window`.

## 4.0.0

- Removed deprecated `getExperimentCohort` method
- Removed deprecated `getExperimentWithExposureLoggingDisabled` method
- `targetApp` is now a mandatory initialization parameter, and replaces the `products` parameter.
  Please see the v3.5.0 release notes for more information on how to set this up.

## 3.5.0

#### Added a new `getExperimentValue` API

`getExperimentCohort` has been deprecated in favour of a new `getExperimentValue` API, which can be
used to access any named parameter. Existing calls to `getExperimentCohort` can be migrated using
the following replacement:

**Before:**

```typescript
FeatureGates.getExperimentCohort('example-experiment', 'default-value');
```

**After:**

```typescript
FeatureGates.getExperimentValue(
	'example-experiment',
	'cohort', // <-- use this exact string
	'default-value',
);
```

Please see
[this blog](https://hello.atlassian.net/wiki/spaces/MEASURE/blog/2023/10/03/2928166432/Upcoming+removal+of+FeatureGates.getExperimentCohort?search_id=2654bf66-557c-4ea6-910c-434b15f44207)
and the "Evaluation" section of the [README](./README.md) for more information.

#### Added a new optional `targetApp` initialization parameter

<ins>Use of this parameter requires additional configuration within Statsig and
`feature-flag-service`!</ins>

The `targetApp` initialization parameter will allow your client to pull only the experiments and
gates that are relevant for your product. The client will only fetch gates and experiments that
either:

- have no Target Applications specified, or
- have `targetApp` in their selected list of Target Applications

Before setting this parameter, you will need to add the Target Application configuration to all of
your existing gates and experiments.

Please see
[this blog](https://hello.atlassian.net/wiki/spaces/MEASURE/pages/2955970231/How-to+Use+TargetApps+in+Statsig)
for more information on how to set this up.

#### Added new API methods for local overrides

New `overrideExperiment`, `overrideGate` and `setOverrides` methods have been added that allow you
to override values locally.

Please note that these overrides are persisted to localStorage, so they will affect all subsequent
page views. You will need to call the `clearExperimentOverride`, `clearGateOverride` or
`clearAllOverrides` methods to de-activate an override.

These were mostly introduced for E2E testing, allowing you to set up test suites for different
combinations of gate and experiment values. Please see the Testing section of the
[README](./README.md) for some example usage.

## 3.4.3

- Export the DynamicConfig class, which enables callers to create their own instances when mocking
  the getExperiment function.

## 3.4.2

- Added `window.__FEATUREGATES_JS__` as a way to get a reference to the FeatureGates client at
  runtime. This is important for mocking gate and experiment values in E2E testing frameworks like
  Cyprus, as it allows them to get a reference to the instance that was created for each generated
  window.

## 3.4.1

- Remove hard dependency on the AbortSignal.timeout function to increase support for older browser
  versions

## 3.4.0

- Introduce `analyticsAnonymousId`, `transactionAccountId` and `trelloUserId` identifier types

## 3.3.0

- Add `updateUser` and `updateUserWithValues` methods which can be used to re-initialize the client
  for a different user.

## 3.2.0

- Fix to initialise in a default mode if there is an error with the Statsig client initialising e.g.
  an invalid sdk key (key not starting with 'client-') is used
- `sdkKey` for `FeatureGates.initializeFromValues` is now optional. A default client key is used if
  one is not provided. This should only be used in the case where a sdkKey is not available as this
  means events are not sent back to Statsig

## 3.1.1

- Remove strict Node version requirements for client builds

## 3.1.0

### Minor Changes

- Add `fetchTimeoutMs` to clientOptions for `FeatureGates.initialize` to set the timeout for
  requests to feature-flag-service. Default being 2000ms.
- Improve error handling for requests made to feature flag service.
  - A total of two requests are made to feature-flag-service. One for the clientSdkKey and one for
    the experiment values. This means if retrieving the experiment values fails, it is still
    possible to have a valid SDK key and send info back to Statsig. The clientSdkKey endpoint should
    be more performant and reliable than the experiment values endpoint.

## 3.0.1

- Fixes build issues from the v3.0.0 release

## 3.0.0 [Broken version - do not use]

### Major Changes

- Some behavioural changes with `initialize` and `initializeWithValues`:
  - Failures will still put the client into a mode which always returns default values, but these
    methods will now also return a rejected promise so that applications can add their own logs,
    metrics or logic.
  - If either of these methods have already been called, subsequent calls will now return the
    existing promise
  - `initializeCalled` will now return `true` immediately after a call to `initialize` or
    `initializeWithValues` as expected
- `isLocalMode` initialization option has been renamed to `localMode`
- `fromValuesClientOptions` type has been renamed to `FromValuesClientOptions`

## 2.0.3

- Disables page logging by default

## 2.0.2

- Fixes package.json entrypoint and js target issue from `2.0.0` - `2.0.1`

## 2.0.0 [Broken version - do not use]

### Major Changes

- Introduction of new initialized without values method, taking over `FeatureGate.initialize` with
  the previous method moved to `FeatureGate.initializeFromValues`
- Changes to `FeatureGate.initializeFromValues` method signature
- Removal of `activationId` (no longer supported), and `userId` (replaced by `atlassianAccountId`)
