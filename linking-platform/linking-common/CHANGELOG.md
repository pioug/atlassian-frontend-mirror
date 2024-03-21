# @atlaskit/linking-common

## 5.6.0

### Minor Changes

- [#82211](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82211) [`272179bd91d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/272179bd91d3) - Added optional extension key to smartlink error response to be persisted in the store

## 5.5.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 5.5.0

### Minor Changes

- [#76893](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76893) [`764ef8bfb973`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/764ef8bfb973) - Add optional `isWrapped` attribute to properties.columns array object in datasource table view configuration. Also export `DatasourceAdfTableViewColumn` type that describe one such column.

## 5.4.0

### Minor Changes

- [#78407](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78407) [`33e1f2cec1fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/33e1f2cec1fa) - Add product prop to smart link context

## 5.3.3

### Patch Changes

- [#78708](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78708) [`ae9ca3c95f80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ae9ca3c95f80) - Cleans up Sentry related ffs: isolated-sentry-hub and sentry.disable-dedupe

## 5.3.2

### Patch Changes

- [#70612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70612) [`87457cd97d6b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87457cd97d6b) - Modified `DatasourceAdf` to accept a generic parameter.

## 5.3.1

### Patch Changes

- [#68194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68194) [`c1d4a8fecc4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d4a8fecc4e) - bump json-ld-types to version 3.11.0

## 5.3.0

### Minor Changes

- [#63659](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63659) [`ccb176cf487b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ccb176cf487b) - Disables the Dedupe integration for Sentry (behind ff)

## 5.2.0

### Minor Changes

- [#64758](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64758) [`c571940e36f8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c571940e36f8) - Deprecated enableHoverCardResolutionTracking FF

## 5.1.0

### Minor Changes

- [#63962](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63962) [`2bc7dc8ad123`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2bc7dc8ad123) - Isolates linking platform sentry client to its own hub, behind a ff.

## 5.0.0

### Major Changes

- [#63549](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63549) [`11c4dad42160`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/11c4dad42160) - Add shouldShowPulse prop to pulse component and add feature to persist pulse through rerenders.

  Major Change: Remove isDiscovered prop use shouldShowPulse to override pulse behaviour instead.

## 4.21.3

### Patch Changes

- [#60388](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60388) [`34578f53c9a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/34578f53c9a0) - Add `@sentry/types` dependency

## 4.21.2

### Patch Changes

- [#57729](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57729) [`3778c5a24fc1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3778c5a24fc1) - Fix bug with available sites filtering in Jira Create plugin

## 4.21.1

### Patch Changes

- [#56583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/56583) [`20b3af3d87ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20b3af3d87ff) - Improves observability of network failures on available sites.

## 4.21.0

### Minor Changes

- [#43513](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43513) [`316615d4cfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/316615d4cfa) - Exposes a v2 version of available sites hook: `useAvailableSitesV2()`.
  The v2 hook changes the `error` field returned to be of type `unknown`.

  The value can be any error that could be caught in process of fetching available sites including:

  - `Response` if `!response.ok`
  - `TypeError` if something goes wrong when attempting to fetch
  - or anything else

  The v2 hook does not currently send any analytics events.

## 4.20.0

### Minor Changes

- [#43724](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43724) [`60bbae163c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60bbae163c8) - Deprecate useLinkPickerScrollingTabs ff from type

### Patch Changes

- Updated dependencies

## 4.19.0

### Minor Changes

- [#43497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43497) [`049969f8eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/049969f8eb1) - Added a `getTraceId` to extract traceId from a `Response`.

## 4.18.2

### Patch Changes

- [#43063](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43063) [`549ce93517c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/549ce93517c) - deprecate showHoverPreview feature flag prop

## 4.18.1

### Patch Changes

- [#43352](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43352) [`1a114b01fa4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a114b01fa4) - [ux] Fixed a UI issue in the pulse

## 4.18.0

### Minor Changes

- [#42692](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42692) [`8443e671cdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8443e671cdd) - [ux] Added a prop onAnimationStart to the Pulse component

## 4.17.0

### Minor Changes

- [#42755](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42755) [`8bb39480e00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bb39480e00) - add onAnimationIteration event handler to pulse component

## 4.16.0

### Minor Changes

- [#42758](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42758) [`de7c4a28af8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de7c4a28af8) - Adds /sentry entrypoint which exposes captureException method to capture exceptions to Sentry.

## 4.15.0

### Minor Changes

- [#42607](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42607) [`87e6390f290`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87e6390f290) - [ux] Added an optional prop isDiscovered to the Pulse component that will stop the animation when true.

## 4.14.1

### Patch Changes

- [#42643](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42643) [`4ff9296edf3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ff9296edf3) - Upgrade `linkify-it` from `2.x` to `3.x`

## 4.14.0

### Minor Changes

- [#38725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38725) [`5084b740027`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5084b740027) - [ux] `DatasourceAdfTableView` type gets an update. Now properties.columns item can have optional `width` of type number
- [#42602](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42602) [`3f6926d24cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f6926d24cc) - Deprecates useLinkPickerAtlassianTabs feature flag in LinkingPlatformFeatureFlags

## 4.13.0

### Minor Changes

- [#42417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42417) [`ce50b40c45b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce50b40c45b) - EDM-8199 Fix gatewaybaseurl in linkCreate

## 4.12.0

### Minor Changes

- [#41979](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41979) [`e9a109ecb52`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9a109ecb52) - Export base pulse component

## 4.11.0

### Minor Changes

- [#38342](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38342) [`9b37a0f7afa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b37a0f7afa) - Deprecates ff enableLinkPickerForgeTabs relating to @atlaskit/link-picker-plugins

## 4.10.1

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491) [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update json-ld-types dependencies to be compatible with version

## 4.10.0

### Minor Changes

- [#40038](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40038) [`c9aa6fd6c38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9aa6fd6c38) - Newly exported filterSiteProducts that allows filtering of site products, used by jira/confluence create forms

## 4.9.1

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127) [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump json-ld-types 3.8.0 -> 3.9.1

## 4.9.0

### Minor Changes

- [#39265](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39265) [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Modified the `getStatus` arg type to be less restrictive and only require the field it uses, `meta`, instead of the entire Json response type.

## 4.8.0

### Minor Changes

- [#39536](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39536) [`bffcaa68d09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bffcaa68d09) - EDM-7530: fixes mockAvailableSites error where available-sites-result export was not available in versions @4.6.1 and @4.7.0

## 4.7.0

### Minor Changes

- [#39907](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39907) [`fcc19d02d34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fcc19d02d34) - Deprecate useLozengeAction feature flag

## 4.6.1

### Patch Changes

- [#39599](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39599) [`d4dc55d027c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4dc55d027c) - Update available-sites-result icons to be base64 images so we can use mockAvailableSites in Gemini VR tests

## 4.6.0

### Minor Changes

- [#38829](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38829) [`3f12e00f046`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f12e00f046) - [ux] EDM-7493 Link create Jira quick insert

## 4.5.0

### Minor Changes

- [#38973](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38973) [`4a3a91d26e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a3a91d26e7) - Deprecate enableImprovedPreviewAction feature flag from LinkingPlatformFeatureFlags.

## 4.4.0

### Minor Changes

- [#37734](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37734) [`f81166160ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f81166160ba) - EDM-7272: export mockAvailableSitesWithError mock to be used externally.

## 4.3.0

### Minor Changes

- [#37245](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37245) [`220d407e10c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/220d407e10c) - [ux] Update empty state skeleton UI and add empty state to datasourceTableView

## 4.2.0

### Minor Changes

- [#37820](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37820) [`fa496530f1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa496530f1a) - Added a new FF "enableHoverCardResolutionTracking" to smart link feature flags

## 4.1.2

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720) [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update dependency json-ld-types@3.8.0

## 4.1.1

### Patch Changes

- [#37341](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37341) [`dc546d1044a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc546d1044a) - Update failure handler in link-create API to take Error instead of string, and fire analytics on failure

## 4.1.0

### Minor Changes

- [#37136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37136) [`d7c13ff481e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7c13ff481e) - Added 'getStatus' that calculates a Smart Link status based on accessType, access & visibility

## 4.0.0

### Major Changes

- [#36725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36725) [`582f0121f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/582f0121f72) - Deleted deprecated extractors from @atlaskit/linking-common - use @atlaskit/link-extractors instead, it has all the same exports. No other breaking changes - if you don't have any imports from extractors then you can safely upgrade

## 3.4.0

### Minor Changes

- [#36461](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36461) [`a5877196a3c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5877196a3c) - [ux] EDM-6499 Fix handling of tel and other custom URI links

## 3.3.0

### Minor Changes

- [#36589](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36589) [`ed592463743`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed592463743) - Deprecate showAuthTooltip feature flag from LinkingPlatformFeatureFlags. Control of this feature will now be through Renderer prop 'SmartLinks' or Smart Card Prop 'showAuthTooltip'.

## 3.2.0

### Minor Changes

- [#36322](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36322) [`30f18a3a297`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30f18a3a297) - Deprecates ff enableResolveMetadataForLinkAnalytics relating to @atlaskit/link-analytics

## 3.1.1

### Patch Changes

- [#36053](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36053) [`cbe49a0d032`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbe49a0d032) - deprecated `@atlaskit/linking-common/extractors`, use `@atlaskit/link-extractors` instead

## 3.1.0

### Minor Changes

- [#35032](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35032) [`04295e9d5bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04295e9d5bc) - [ux] Updating ORS response to include datasources and facilitating pasting JQL links turning into datasource tables

## 3.0.1

### Patch Changes

- [#35233](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35233) [`a9350cf3831`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9350cf3831) - Check existence of window and document variable for confluence SSR to work

## 3.0.0

### Major Changes

- [#34936](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34936) [`67370a954bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67370a954bd) - DatasourceAdfTableView has changed in a breaking way. Instead of properties.columnKeys: string[] there is now properties.columns: {key: string}[]

## 2.15.0

### Minor Changes

- [#34189](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34189) [`5b744a84924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b744a84924) - [ux] Support for an empty state in LinkPicker, and implementation of empty state for the link-picker-atlassian-plugin

## 2.14.0

### Minor Changes

- [#34424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34424) [`4d5119d5052`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d5119d5052) - New analytics for operational event for getAvailableSites failed
- [#34691](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34691) [`5ffc8529049`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ffc8529049) - - Export `DatasourceAdf`, `DatasourceAdfView`, `DatasourceAdfTableView`
  - Modify DatasourceAdf table view type

## 2.13.2

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443) [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 2.13.1

### Patch Changes

- [#34572](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34572) [`037331dd044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/037331dd044) - Copy json files postBuild
- Updated dependencies

## 2.13.0

### Minor Changes

- [#34207](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34207) [`7734ef0bdb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7734ef0bdb4) - allowing default values in confluence creation form.

## 2.12.0

### Minor Changes

- [#32358](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32358) [`c6d962997a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6d962997a7) - [ux] Changed the text of the button from 'Full screen view' to 'Open preview' and also changed the color of a button in the hover cards

## 2.11.1

### Patch Changes

- [#33691](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33691) [`f27eb952289`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f27eb952289) - [ux] This fixes a bug which is caused when some text including a newline is linked and clicked, which incorrectly triggers a warning.

## 2.11.0

### Minor Changes

- [#32778](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32778) [`877b4f8f7fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/877b4f8f7fc) - Remove iframe dwell tracking feature flag. Smart card embedded iframes will always track dwell events.

## 2.10.1

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.10.0

### Minor Changes

- [#32948](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32948) [`607d908eefa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/607d908eefa) - Add new hooks useAvailableSites and useCloudIdToUrl

## 2.9.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.9.0

### Minor Changes

- [#33399](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33399) [`f87ee2af752`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f87ee2af752) - Adds filterUniqueItems to linking common utils entry point

## 2.8.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 2.7.0

### Minor Changes

- [#32939](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32939) [`67cc7412f66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67cc7412f66) - Added `DatasourceAdf`

## 2.6.0

### Minor Changes

- [#32541](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32541) [`eceb32a564f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eceb32a564f) - [ux] This adds a new Flexible UI attribute, `OwnedBy`, which represents who owns a resource.

## 2.5.2

### Patch Changes

- [#32635](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32635) [`dc6b9d43e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc6b9d43e66) - Increased `ShimmerSkeleton` animation width

## 2.5.1

### Patch Changes

- [#32585](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32585) [`f101fd45eea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f101fd45eea) - Fix json parse error from trying to converting response with no content to json

## 2.5.0

### Minor Changes

- [#32442](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32442) [`bcc645691c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bcc645691c5) - Add lozenge action feature flag and extract server action for state lozenge from JSON-LD response

## 2.4.2

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424) [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 2.4.1

### Patch Changes

- [#32360](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32360) [`0ee9370595a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee9370595a) - Update json-ld-types

## 2.4.0

### Minor Changes

- [#31717](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31717) [`2ce1ea6f723`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ce1ea6f723) - The change here adds the new `Skeleton` component which can be used with or without a shimmering effect

## 2.3.1

### Patch Changes

- [#31601](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31601) [`aeaf58d2384`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeaf58d2384) - Change adds a new prop on Smart Card `embedIframeUrlType` which allows a user of a Smart Card with the `embed` appearance to specify whether the Smart Card embed should use `href` or `interactiveHref` in the JSON-LD response.

## 2.3.0

### Minor Changes

- [#31057](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31057) [`86f9123aa19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86f9123aa19) - Add allow response statuses option on request

## 2.2.2

### Patch Changes

- [#31388](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31388) [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) - Dependency update json-ld-types@3.4.0

## 2.2.1

### Patch Changes

- [#29648](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29648) [`a132b532d6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a132b532d6a) - Support common URL protocols:

  - gopher
  - integrity
  - file
  - smb
  - dynamicsnav

## 2.2.0

### Minor Changes

- [#30817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30817) [`5c43e7c2924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c43e7c2924) - - make envKey and baseUrlOverride properties public in CardClient
  - move request API and environment config and getter to linking-common

## 2.1.0

### Minor Changes

- [#29372](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29372) [`7581526cc61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7581526cc61) - Remove `disableLinkPickerPopupPositioningFix` feature flag

## 2.0.0

### Major Changes

- [#30111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30111) [`17dae33474e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17dae33474e) - Remove embedModalSize as part of embed preview modal feature flag cleanup

## 1.22.0

### Minor Changes

- [#29067](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29067) [`08de765c04b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08de765c04b) - Adds user agent utilities.

## 1.21.1

### Patch Changes

- Updated dependencies

## 1.21.0

### Minor Changes

- [#28234](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28234) [`00899283bb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00899283bb1) - Add enableResolveMetadataForLinkAnalytics ff

## 1.20.0

### Minor Changes

- [#28679](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28679) [`42be2053e92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42be2053e92) - Add ResolveRateLimitError to ServerErrorTypes

## 1.19.0

### Minor Changes

- [#27632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27632) [`d5a9fd04c02`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5a9fd04c02) - Analytics to track dwell time and focus on smart links embedded iframes

## 1.18.0

### Minor Changes

- [#28482](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28482) [`c3528743169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3528743169) - Introduce enableLinkPickerForgeTabs feature flag

## 1.17.0

### Minor Changes

- [#28362](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28362) [`10410539ac9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10410539ac9) - Url utils added (normalizeURL and isSafeUrl). Available to export

## 1.16.3

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324) [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving performance.

## 1.16.2

### Patch Changes

- Updated dependencies

## 1.16.1

### Patch Changes

- Updated dependencies

## 1.16.0

### Minor Changes

- [#26943](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26943) [`3cbd9b63e96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbd9b63e96) - [ux] Added search for 1P tabs

## 1.15.0

### Minor Changes

- [#27416](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27416) [`1f55d430d9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f55d430d9a) - [ux] A new flag 'showAuthTooltip' is added that indicates if an authentication tooltip should show up on a hover over unauthorized smart links.

## 1.14.0

### Minor Changes

- [#27236](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27236) [`1070e536838`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1070e536838) - [ux] Hover Preview: Add experiment for actionable element

## 1.13.0

### Minor Changes

- [#27193](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27193) [`9dd3377f9bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd3377f9bb) - [ux] This adds support for the new Flexible UI Block Card, added behind a feature flag "useFlexibleBlockCard"

## 1.12.2

### Patch Changes

- Updated dependencies

## 1.12.1

### Patch Changes

- [#27073](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27073) [`efa366b6ed6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa366b6ed6) - Upgrade json-ld-types from 3.1.0 to 3.2.0

## 1.12.0

### Minor Changes

- [#26811](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26811) [`6533e448c53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6533e448c53) - [ux] Embed: Update unauthorised view text messages and use provider image if available

## 1.11.0

### Minor Changes

- [#26367](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26367) [`c64e78c6e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c64e78c6e45) - Updates LinkingPlatformFeatureFlags type with disableLinkPickerPopupPositioningFix ff

## 1.10.1

### Patch Changes

- [#26692](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26692) [`5066a68a6f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5066a68a6f5) - [ux] fix promiseDebounce to ensure usage of the latest debounced value

## 1.10.0

### Minor Changes

- [#25323](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25323) [`99035cb130b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99035cb130b) - introduce useLinkPickerScrollingTabs feature flag

## 1.9.2

### Patch Changes

- [#25967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25967) [`6af519d2a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6af519d2a17) - Upgrade json-ld-types from 3.0.2 to 3.1.0

## 1.9.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.9.0

### Minor Changes

- [#24955](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24955) [`86c47a3f711`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86c47a3f711) - Added search ratelimit error

## 1.8.0

### Minor Changes

- [#23959](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23959) [`61acd5bc2d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61acd5bc2d0) - Added more search errors

## 1.7.0

### Minor Changes

- [#24650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24650) [`826112611c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/826112611c2) - Update embed preview feature flag type to generic string

## 1.6.0

### Minor Changes

- [#24391](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24391) [`d2439a3c65d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2439a3c65d) - [ux] Embed Preview Modal: Add experiment modal with new UX and resize functionality (behind feature flag)

## 1.5.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.5.1

### Patch Changes

- [#23982](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23982) [`9b79278f983`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b79278f983) - Fix promise debounce to support rejects

## 1.5.0

### Minor Changes

- [#23444](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23444) [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux] Adds in TAB UI support for Link Picker

## 1.4.0

### Minor Changes

- [#22592](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22592) [`e15410365b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e15410365b2) - - export types/functions in linking common to be used in smart card

  - add flag to card action to override re-using previous 'resolved' state

  - add prop to cardState which reflects the metadata state, can be pending, resolved or errored

  - modified reducer and dispatchers to handle these new props

## 1.3.0

### Minor Changes

- [#23375](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23375) [`0fa3ac70ed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fa3ac70ed0) - Restores backwards compatibility that was broken in 1.2.x

## 1.2.1

### Patch Changes

- [#22966](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22966) [`5db7cbdb520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5db7cbdb520) - XPC3P-23 Add types for search dialog

## 1.2.0

### Minor Changes

- [#23000](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23000) [`cd5e63258cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5e63258cd) - Moved extractors to linking-common/extractors

## 1.1.3

### Patch Changes

- [#22855](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22855) [`b2032a5f6e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2032a5f6e3) - Add FF support to <LinkProvider />

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

## 1.1.2

### Patch Changes

- [#22476](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22476) [`f538640e3a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f538640e3a5) - fix: Previously the .reload() action would not propagate changes through to the smart-card state in some scenarios. This has been amended by making it an explicit Redux action.

## 1.1.1

### Patch Changes

- [#22266](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22266) [`50b81e07a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b81e07a35) - Version of package 'json-ld-types' was upgraded to 2.4.2

## 1.1.0

### Minor Changes

- [#20562](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20562) [`f69424339b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f69424339b2) - Expose common types and helpers from linking-common rather than from link-picker

## 1.0.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.0.1

### Patch Changes

- [#20479](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20479) [`84d7a6b11a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84d7a6b11a4) - Create @atlaskit/linking-common
