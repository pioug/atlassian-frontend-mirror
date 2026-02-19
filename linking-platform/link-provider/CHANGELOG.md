# @atlaskit/link-provider

## 4.2.1

### Patch Changes

- [`3bee560fea726`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3bee560fea726) -
  Exclude Invalid URL error from new URL() from operational.smartLink.unresolved event, behind fg
  platform_navx_lp_invalid_url_error
- Updated dependencies

## 4.2.0

### Minor Changes

- [`bf24d7f6ba59b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bf24d7f6ba59b) -
  SmartCardProvider accepts new prop called rovoOptions that defines what rovo capabilities are
  available in runtime in the product

## 4.1.0

### Minor Changes

- [`77df724ec737e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77df724ec737e) -
  [https://product-fabric.atlassian.net/browse/ED-28631](ED-28631) - cleanup the
  platform_editor_smart_card_otp Statsig experiment

## 4.0.7

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- [`b687f93157a72`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b687f93157a72) -
  Typescript fixes
- Updated dependencies

## 4.0.3

### Patch Changes

- [`6b08c3a8cde08`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b08c3a8cde08) -
  Construct confluence url from smart card embed preview href when smart card url is short
  confluence url, in the form "{host}/wiki/x/{hash}"

## 4.0.2

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [`e5a87f6037145`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5a87f6037145) -
  Revert: add isAdminHubAIEnabled in the merge alsong with isPreviewPanelAvailable and
  openPreviewPanel for confluencePreview Panels.

## 4.0.0

### Major Changes

- [`4535040a84a6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4535040a84a6e) -
  add isAdminHubAIEnabled in the merge alsong with isPreviewPanelAvailable and openPreviewPanel for
  confluencePreview Panels.

### Patch Changes

- Updated dependencies

## 3.7.2

### Patch Changes

- Updated dependencies

## 3.7.1

### Patch Changes

- [`1b7d48c39ae03`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b7d48c39ae03) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 3.7.0

### Minor Changes

- [`6b61788ba65a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b61788ba65a2) - -
  Added a new `custom` environment to `EnvironmentsKeys`. Now, you can pass the `baseUrlOverride`
  parameter to both `EditorCardProvider` and `CardClient` to access a service directly.
  - Introduced a new `setHeaders` method in CardClient, allowing you to specify custom HTTP headers
    for requests to the object-resolver service.
  - `EditorCardProvider` now supports passing a custom `CardClient` instance, so you can use your
    own client instead of the built-in one.

  These changes provide more flexibility for configuring access to the object-resolver service,
  including support for SSR and integration with custom infrastructures.

### Patch Changes

- Updated dependencies

## 3.6.0

### Minor Changes

- [`e5b3e00a23242`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5b3e00a23242) - -
  Added a new `custom` environment to `EnvironmentsKeys`. Now, you can pass the `baseUrlOverride`
  parameter to both `EditorCardProvider` and `CardClient` to access a service directly.
  - Introduced a new `setHeaders` method in CardClient, allowing you to specify custom HTTP headers
    for requests to the object-resolver service.
  - `EditorCardProvider` now supports passing a custom `CardClient` instance, so you can use your
    own client instead of the built-in one.

  These changes provide more flexibility for configuring access to the object-resolver service,
  including support for SSR and integration with custom infrastructures.

### Patch Changes

- Updated dependencies

## 3.5.0

### Minor Changes

- [`19da7355cd815`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19da7355cd815) - -
  Added a new `custom` environment to `EnvironmentsKeys`. Now, you can pass the `baseUrlOverride`
  parameter to both `EditorCardProvider` and `CardClient` to access a service directly.
  - Introduced a new `setHeaders` method in CardClient, allowing you to specify custom HTTP headers
    for requests to the object-resolver service.
  - `EditorCardProvider` now supports passing a custom `CardClient` instance, so you can use your
    own client instead of the built-in one.

  These changes provide more flexibility for configuring access to the object-resolver service,
  including support for SSR and integration with custom infrastructures.

### Patch Changes

- Updated dependencies

## 3.4.3

### Patch Changes

- [`2a46c52a9d189`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2a46c52a9d189) -
  NAVX-1307 cleaning up smart-links-noun-support
- Updated dependencies

## 3.4.2

### Patch Changes

- [#191110](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191110)
  [`14f7f807a5bdc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14f7f807a5bdc) -
  NAVX-1184 adding a11y unit tests to linking-platform packages missing a11y coverage

## 3.4.1

### Patch Changes

- [#181417](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181417)
  [`fab5cb9a9877d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fab5cb9a9877d) -
  Pass ignoreCachedValue to resolve/batch endpoint when reload is set to true to force cache busting
  in ORS behind a FG platform_linking_force_no_cache_smart_card_client

## 3.4.0

### Minor Changes

- [#176618](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176618)
  [`3dc0f901305b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3dc0f901305b0) -
  [ux] added a showFooter prop to hide/show the default AI footer in snippet block

## 3.3.2

### Patch Changes

- [#167423](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167423)
  [`064579ff3e75c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/064579ff3e75c) -
  Move smart_links_noun_support feature gate to link-extractor
- Updated dependencies

## 3.3.1

### Patch Changes

- [#165007](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165007)
  [`1f50b1c7072cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1f50b1c7072cf) -
  Remove atlassian:design and flattern the entity data
- Updated dependencies

## 3.3.0

### Minor Changes

- [#164586](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164586)
  [`ef096c9e7bd94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ef096c9e7bd94) -
  Adds analytics for AISnippet component. Updates SnippetBlock in smart-card to pass hidden
  information to prevent logging of metrics in hidden cases

## 3.2.1

### Patch Changes

- [#164735](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164735)
  [`e775157fd06b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e775157fd06b8) -
  Rename nounData to entityData. Fg smart_links_noun_support
- Updated dependencies

## 3.2.0

### Minor Changes

- [#161542](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161542)
  [`dcc9722d5f3f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dcc9722d5f3f8) -
  Type updates for linking provider and ai-snippet. No currently used changes. Simplyfying and
  adding product typings

## 3.1.0

### Minor Changes

- [#158715](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158715)
  [`baf5cca2f83aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/baf5cca2f83aa) -
  Adds an optional snippet renderer method to SmardCardProvider context for overriding the default
  snippet component on smart cards

## 3.0.0

### Major Changes

- [#152125](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152125)
  [`8fbd6c30c5ee3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8fbd6c30c5ee3) -
  Remove dead type CardProviderCacheOpts and any related values

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#152068](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152068)
  [`8689483a3d0e3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8689483a3d0e3) -
  Add deprecation to featureFlags type and props within linking platform packages
- Updated dependencies

## 2.1.1

### Patch Changes

- [#141229](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141229)
  [`9740656964ab1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9740656964ab1) -
  Implement nounData embed preview extractors behind ff: smart_links_noun_support

## 2.1.0

### Minor Changes

- [#135983](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135983)
  [`7bc55a027722d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7bc55a027722d) -
  Resolving a vulnerability that allowed data secure policy controlled content to be exposed in
  smart card previews during export.

## 2.0.1

### Patch Changes

- [#132126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132126)
  [`5d45dce9796da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d45dce9796da) -
  Updated dependency json-ld-types to @atlaskit/json-ld-types
- Updated dependencies

## 2.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 1.19.2

### Patch Changes

- Updated dependencies

## 1.19.1

### Patch Changes

- Updated dependencies

## 1.19.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.18.0

### Minor Changes

- [#176132](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176132)
  [`738d9aeecf5e1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/738d9aeecf5e1) -
  [ED-24119] Replace Legacy React Context with proper React Context

## 1.17.0

### Minor Changes

- [#166390](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166390)
  [`43872445442d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43872445442d8) -
  Set the default appearance for Rovo Agent profile links to 'embed'

## 1.16.2

### Patch Changes

- Updated dependencies

## 1.16.1

### Patch Changes

- [#151132](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151132)
  [`3da1333fcf30d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3da1333fcf30d) -
  Adds the 'origin-timezone' header to all cached requests by removing feature flag
  platform.linking-platform.datasource.add-timezone-header

## 1.16.0

### Minor Changes

- [#141074](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141074)
  [`8e945d5784e6a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e945d5784e6a) -
  Clean up the `map_new_ors_generic_error_types_in_link_provider` feature flag

## 1.15.0

### Minor Changes

- [#136903](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136903)
  [`6835fc4fdb6c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6835fc4fdb6c2) -
  Enable react 18

## 1.14.1

### Patch Changes

- [#134513](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134513)
  [`9908df0490fce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9908df0490fce) -
  NO-ISSUE: remmove unneeded setimmediate dependency

## 1.14.0

### Minor Changes

- [`d0cbbb4cfdfa3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0cbbb4cfdfa3) -
  Map new ORS errors to link-provider specific errors

### Patch Changes

- Updated dependencies

## 1.13.0

### Minor Changes

- [#122208](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122208)
  [`976382f1717a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/976382f1717a1) -
  EDM-9894: implement functionality for related links modal to render correct views

## 1.12.2

### Patch Changes

- Updated dependencies

## 1.12.1

### Patch Changes

- Updated dependencies

## 1.12.0

### Minor Changes

- [#113876](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113876)
  [`265f6093bd22b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/265f6093bd22b) -
  EDM-10049: add resolve ari batch endpoint to card client

## 1.11.0

### Minor Changes

- [#109647](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109647)
  [`17d330a232539`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/17d330a232539) -
  The changes here adds a "origin-timezone" header to the smart-link resolve request.

## 1.10.0

### Minor Changes

- [#104892](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104892)
  [`7a12046ea45d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a12046ea45d) -
  Send product source data as X-product header to backend ORS

### Patch Changes

- [#104892](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104892)
  [`58eee9b7de5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58eee9b7de5a) -
  Use pascal case for X-Product

## 1.9.2

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 1.9.1

### Patch Changes

- [#86596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86596)
  [`37621cb1f1b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37621cb1f1b9) -
  Update dependency json-ld-types
- Updated dependencies

## 1.9.0

### Minor Changes

- [#82211](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82211)
  [`272179bd91d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/272179bd91d3) -
  Added optional extension key to smartlink error response to be persisted in the store

### Patch Changes

- Updated dependencies

## 1.8.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.8.0

### Minor Changes

- [#78407](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78407)
  [`33e1f2cec1fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/33e1f2cec1fa) -
  Add product prop to smart link context

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#68990](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68990)
  [`61004adee81f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/61004adee81f) -
  EDM-9083: add is ai enabled prop to smart link context

## 1.6.15

### Patch Changes

- [#68764](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68764)
  [`59b851a5d621`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/59b851a5d621) -
  [ux] Render Polaris (Jira Product Discovery) published view as an embed by default

## 1.6.14

### Patch Changes

- [#68194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68194)
  [`c1d4a8fecc4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d4a8fecc4e) -
  bump json-ld-types to version 3.11.0

## 1.6.13

### Patch Changes

- Updated dependencies

## 1.6.12

### Patch Changes

- [#42251](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42251)
  [`9c7b42127f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c7b42127f6) - Enrol
  `@atlaskit/mention` and `@atlaskit/link-provider` on push model in JFE.

## 1.6.11

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491)
  [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update
  json-ld-types dependencies to be compatible with version

## 1.6.10

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127)
  [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump
  json-ld-types 3.8.0 -> 3.9.1

## 1.6.9

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720)
  [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update
  dependency json-ld-types@3.8.0

## 1.6.8

### Patch Changes

- [#37136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37136)
  [`8d5c196ba3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d5c196ba3b) - Update
  to use 'getStatus' from '@atlaskit/linking-common'
- Updated dependencies

## 1.6.7

### Patch Changes

- [#36725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36725)
  [`a908aececaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a908aececaa) - Moved to
  an import @atlaskit/link-extractors instead of @atlaskit/linking-common that was missed in the
  initial deprecation
- Updated dependencies

## 1.6.6

### Patch Changes

- [#36089](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36089)
  [`1e7190077d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7190077d4) - Move off
  deprecated @atlaskit/linking-common/extractors to @atlaskit/link-extractors
- Updated dependencies

## 1.6.5

### Patch Changes

- Updated dependencies

## 1.6.4

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 1.6.3

### Patch Changes

- [#33699](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33699)
  [`f10ed88032c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f10ed88032c) - With the
  renaming of Jira Roadmaps to Timeline, we are updating the regex rules to match timeline in
  conjunction to roadmaps

## 1.6.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.6.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.6.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- [#32541](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32541)
  [`0624df1ffe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0624df1ffe1) - Bump
  json-ld-types dependency
- Updated dependencies

## 1.5.3

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 1.5.2

### Patch Changes

- [#32360](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32360)
  [`0ee9370595a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee9370595a) - Update
  json-ld-types

## 1.5.1

### Patch Changes

- [#31388](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31388)
  [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) -
  Dependency update json-ld-types@3.4.0

## 1.5.0

### Minor Changes

- [#30817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30817)
  [`5c43e7c2924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c43e7c2924) - - make
  envKey and baseUrlOverride properties public in CardClient
  - move request API and environment config and getter to linking-common

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- [#30266](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30266)
  [`12223b3ee04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12223b3ee04) - Move
  EditorCardProvider to new package instead of using imports from Link Provider and Smart Card

## 1.4.2

### Patch Changes

- [#30335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30335)
  [`f770f0118a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f770f0118a4) - This
  package is now declared as a singleton within its package.json file. Consumers should provide
  tooling to assist in deduplication and enforcement of the singleton pattern.

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#29427](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29427)
  [`a284fdb625b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a284fdb625b) - [ux]
  Convert ProForma Issue Forms Direct smart link to embed by default.

## 1.3.12

### Patch Changes

- [#29483](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29483)
  [`0f339954961`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f339954961) - Retry
  /providers if initial request fails

## 1.3.11

### Patch Changes

- [#29339](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29339)
  [`51db1ccb9ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51db1ccb9ca) - Giphy
  links default to embed appearance on insert

## 1.3.10

### Patch Changes

- [#29080](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29080)
  [`7d2488dcbcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d2488dcbcf) - Upgrade
  lru-fast@0.2.2 to lru_map

## 1.3.9

### Patch Changes

- [#28679](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28679)
  [`d211e7df62b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d211e7df62b) - Retry
  request in fetchData upon receiving 429 from ORS.
- Updated dependencies

## 1.3.8

### Patch Changes

- [#28416](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28416)
  [`1acb31160ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1acb31160ec) - error
  loggin improvement for cases when error property is an instance or Error

## 1.3.7

### Patch Changes

- [#27768](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27768)
  [`21ec93500f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21ec93500f6) - Use same
  promise/response cache layer for both `fetchData` and `prefetchData` methods of `CardClient`

## 1.3.6

### Patch Changes

- [#27328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27328)
  [`10a8469cb13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10a8469cb13) - Add
  `force` optional second parameter to `fetchData` method of `CardClient` class.

## 1.3.5

### Patch Changes

- [#27073](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27073)
  [`efa366b6ed6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa366b6ed6) - Upgrade
  json-ld-types from 3.1.0 to 3.2.0

## 1.3.4

### Patch Changes

- [#26585](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26585)
  [`f5cc6bde738`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5cc6bde738) - Do not
  destroy redux store when unrelated props to SmartCardProvider change

## 1.3.3

### Patch Changes

- [#26360](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26360)
  [`f21edecaac4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f21edecaac4) - Don't
  initiate a fetch for a url if there is already another request in progress for the same url

## 1.3.2

### Patch Changes

- [#25967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25967)
  [`6af519d2a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6af519d2a17) - Upgrade
  json-ld-types from 3.0.2 to 3.1.0

## 1.3.1

### Patch Changes

- [#26342](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26342)
  [`fd4495cc938`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4495cc938) - [ux]
  Jira Work Management (JWM) Summary view links will be converted into smart link embed by default

## 1.3.0

### Minor Changes

- [#25094](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25094)
  [`3d99b313302`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d99b313302) -
  `CardClient` and `EditorCardProvider` members now accept second optional argument called
  `baseUrlOverride`. When provided, first argument `envKey` is ignored and provided override url is
  used as a base for object-resolver-service calls. For example, if
  `https://api-gateway.trellis.coffee/gateway/api` is provided, final fetching url would be
  `https://api-gateway.trellis.coffee/gateway/api/object-resolver`.

## 1.2.9

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.2.8

### Patch Changes

- [#24955](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24955)
  [`86c47a3f711`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86c47a3f711) - Added
  search ratelimit error
- Updated dependencies

## 1.2.7

### Patch Changes

- [#24142](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24142)
  [`90ceb732d6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90ceb732d6d) - Improved
  speed of resolving links due to single /resolve call and no more /check calls before that

## 1.2.6

### Patch Changes

- [#23959](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23959)
  [`61acd5bc2d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61acd5bc2d0) - Added
  more search errors
- Updated dependencies

## 1.2.5

### Patch Changes

- [#24569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24569)
  [`534ebc3f2da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/534ebc3f2da) - This
  changes fatal errors to return an APIError with a message that has been piped through
  `JSON.stringify()` instead of `.toString()` to gain more visibility into the underlying error.

## 1.2.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.2.3

### Patch Changes

- [#24044](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24044)
  [`d043517e947`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d043517e947) - [ux]
  Adds avatarUrl and unauthorised description to Forge Plugin

## 1.2.2

### Patch Changes

- [#24065](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24065)
  [`779661fb6b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/779661fb6b9) - Fix
  matching logic to support non letter characters at start or end of urlSegment

## 1.2.1

### Patch Changes

- [#23708](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23708)
  [`0c7b099146e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c7b099146e) - Improve
  path matching of user link preferences

## 1.2.0

### Minor Changes

- [#23444](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23444)
  [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux]
  Adds in TAB UI support for Link Picker

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- [#22592](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22592)
  [`e15410365b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e15410365b2) - - export
  types/functions in linking common to be used in smart card
  - add flag to card action to override re-using previous 'resolved' state

  - add prop to cardState which reflects the metadata state, can be pending, resolved or errored

  - modified reducer and dispatchers to handle these new props

- Updated dependencies

## 1.1.4

### Patch Changes

- [#22904](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22904)
  [`0377d53f311`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0377d53f311) - Properly
  process case when old editor uses new component AND we have user preferences coming from
  /providers

## 1.1.3

### Patch Changes

- [#23104](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23104)
  [`263ef1e543b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/263ef1e543b) - Change
  data structure of lpup data we get

## 1.1.2

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`4c73e4d0cfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c73e4d0cfa) - Add
  optional argument to CardProvider.resolve method identifying if it's a manual request or not

## 1.1.1

### Patch Changes

- [#23198](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23198)
  [`74fdf4bb16b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74fdf4bb16b) - Fix
  problem when for public links one can't go back to smart-link via dropdown after switching to URL

## 1.1.0

### Minor Changes

- [#22966](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22966)
  [`896bfc34e67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/896bfc34e67) - Added
  search API to the client

## 1.0.8

### Patch Changes

- [#23000](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23000)
  [`cd5e63258cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5e63258cd) - Moved
  extractors to linking-common/extractors
- Updated dependencies

## 1.0.7

### Patch Changes

- [#23081](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23081)
  [`d45fd532d5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d45fd532d5e) - [ux]
  Make form smart link view as embed view by default

## 1.0.6

### Patch Changes

- [#22855](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22855)
  [`b2032a5f6e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2032a5f6e3) - Add FF
  support to <LinkProvider />

  ```
  import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';

  const MyComponent = () => {
    const showHoverPreview = useFeatureFlag('showHoverPreview')

    return (
      <>
        {showHoverPreview}
      </>
    )
  }

  <SmartCardProvider featureFlags={{showHoverPreview: true}}>
    <MyComponent />
  </SmartCardProvider>
  ```

## 1.0.5

### Patch Changes

- [#22578](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22578)
  [`e09ea69c384`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e09ea69c384) -
  Introduce argument shouldForceAppearance to EditorCardProvider.resolve signature

## 1.0.4

### Patch Changes

- [#22476](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22476)
  [`f538640e3a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f538640e3a5) - fix:
  Previously the .reload() action would not propagate changes through to the smart-card state in
  some scenarios. This has been amended by making it an explicit Redux action.

## 1.0.3

### Patch Changes

- [#22266](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22266)
  [`50b81e07a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b81e07a35) - Version
  of package 'json-ld-types' was upgraded to 2.4.2

## 1.0.2

### Patch Changes

- [#18889](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18889)
  [`06df1d75255`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06df1d75255) - Use new
  defaultView property of /providers endpoint to decide what view link should be render as

## 1.0.1

### Patch Changes

- [#21676](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21676)
  [`28410ec919d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28410ec919d) - Flexible
  UI: Passing JsonLD response on authFlow disabled

## 1.0.0

### Major Changes

- [#20562](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20562)
  [`99fa7e54884`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99fa7e54884) - Move non
  critical things into linking-common & release first stable version

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- [#20973](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20973)
  [`8b9f08cbc1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9f08cbc1c) - [ux]
  Default representation for Slack links was changed from 'block' to 'inline'

## 0.1.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 0.1.1

### Patch Changes

- [#20526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20526)
  [`eaa0b52d49e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaa0b52d49e) -
  Introduce @atlaskit/link-provider
