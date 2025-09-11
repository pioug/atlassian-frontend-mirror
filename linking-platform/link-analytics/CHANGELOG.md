# @atlaskit/link-analytics

## 11.0.0

### Patch Changes

- Updated dependencies

## 10.0.6

### Patch Changes

- [`1b7d48c39ae03`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b7d48c39ae03) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 10.0.5

### Patch Changes

- Updated dependencies

## 10.0.4

### Patch Changes

- Updated dependencies

## 10.0.3

### Patch Changes

- Updated dependencies

## 10.0.2

### Patch Changes

- Updated dependencies

## 10.0.1

### Patch Changes

- Updated dependencies

## 10.0.0

### Patch Changes

- Updated dependencies

## 9.1.1

### Patch Changes

- [#132126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132126)
  [`5d45dce9796da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d45dce9796da) -
  Updated dependency json-ld-types to @atlaskit/json-ld-types
- Updated dependencies

## 9.1.0

### Minor Changes

- [#122851](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122851)
  [`818fdc04fd7eb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/818fdc04fd7eb) -
  On smartlink unresolved, include extensionKey from error object

## 9.0.0

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

## 8.7.1

### Patch Changes

- Updated dependencies

## 8.7.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 8.6.0

### Minor Changes

- [#174545](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174545)
  [`401a215e8702c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/401a215e8702c) -
  Add the activation id to the event

## 8.5.3

### Patch Changes

- [#168880](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168880)
  [`570b3c702f4bc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/570b3c702f4bc) -
  Migrates analytics types to codegen via @atlassian/analytics-tooling. No expected functional
  changes.

## 8.5.2

### Patch Changes

- Updated dependencies

## 8.5.1

### Patch Changes

- Updated dependencies

## 8.5.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 8.4.2

### Patch Changes

- Updated dependencies

## 8.4.1

### Patch Changes

- Updated dependencies

## 8.4.0

### Minor Changes

- [#127351](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127351)
  [`e87b54903058e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e87b54903058e) -
  Add React 18 compatability

### Patch Changes

- Updated dependencies

## 8.3.12

### Patch Changes

- [#99590](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99590)
  [`708a78926d0e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/708a78926d0e) -
  Updates the fireEvent method to use defaultProperties from schema if available, and be overwritten
  by attributes retrieved from the ADF

## 8.3.11

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component

## 8.3.10

### Patch Changes

- [#86596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86596)
  [`37621cb1f1b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37621cb1f1b9) -
  Update dependency json-ld-types

## 8.3.9

### Patch Changes

- [#68194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68194)
  [`c1d4a8fecc4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d4a8fecc4e) -
  bump json-ld-types to version 3.11.0

## 8.3.8

### Patch Changes

- Updated dependencies

## 8.3.7

### Patch Changes

- [#59541](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59541)
  [`5cd5311a0014`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5cd5311a0014) -
  Enrol packages to push model in JFE

## 8.3.6

### Patch Changes

- [#41985](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41985)
  [`4e1f5c00d92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e1f5c00d92) -
  Datasource analytic getDatasourceData request now includes includeSchema flag

## 8.3.5

### Patch Changes

- [#41199](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41199)
  [`33844c6d074`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33844c6d074) - Add
  ts-ignore for mock functions to pass typecheck

## 8.3.4

### Patch Changes

- [#40908](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40908)
  [`c229318d297`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c229318d297) - Add new
  event for jira datasource inserts

## 8.3.3

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491)
  [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update
  json-ld-types dependencies to be compatible with version

## 8.3.2

### Patch Changes

- [#40380](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40380)
  [`d925ab8abef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d925ab8abef) - Added a
  new attribute 'canBeDatasource' to link created/updated/deleted events

## 8.3.1

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127)
  [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump
  json-ld-types 3.8.0 -> 3.9.1

## 8.3.0

### Minor Changes

- [#39265](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39265)
  [`8b8a309cb62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b8a309cb62) - Added
  datasource analytic CRUD events

### Patch Changes

- Updated dependencies

## 8.2.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 8.2.6

### Patch Changes

- [#37925](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37925)
  [`f01deb5e6ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f01deb5e6ab) - Use
  injected env vars instead of version.json

## 8.2.5

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720)
  [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update
  dependency json-ld-types@3.8.0

## 8.2.4

### Patch Changes

- [#37136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37136)
  [`2811ef86faf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2811ef86faf) - Update
  to use 'getStatus' from '@atlaskit/linking-common'
- Updated dependencies

## 8.2.3

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340)
  [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out
  of peer dependency enforcement

## 8.2.2

### Patch Changes

- Updated dependencies

## 8.2.1

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757)
  [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add
  postinstall check to enforce internal peer dependencies

## 8.2.0

### Minor Changes

- [#36322](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36322)
  [`4db1a942f14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4db1a942f14) - Cleans
  up FF enableResolveMetadataForLinkAnalytics added in 3.0.0 — feature flag is is no longer required
  to enable "resolved attributes".

### Patch Changes

- Updated dependencies

## 8.1.0

### Minor Changes

- [#36198](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36198)
  [`c5a897eb81d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5a897eb81d) - add
  statusDetails attribute

## 8.0.6

### Patch Changes

- Updated dependencies

## 8.0.5

### Patch Changes

- [#35183](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35183)
  [`3b393e53508`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b393e53508) - Updates
  events triggered from link picker source event to have method of linkpicker_none if the link
  picker analytic event has no input method for the url field. This means if the link picker was
  mounted with a url and submitted without any change the method for an updated event will have
  updateMethod of linkpicker_none instead of having no updateMethod.

## 8.0.4

### Patch Changes

- [#34396](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34396)
  [`438b90799c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/438b90799c4) - Removes
  urlHash from linking platform events.

## 8.0.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8
- Updated dependencies

## 8.0.2

### Patch Changes

- [#33581](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33581)
  [`65392e23be5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65392e23be5) - Fetch
  for resolved attributes regardless of displayCategory (i.e. when it is 'link')

## 8.0.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 8.0.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 7.0.5

### Patch Changes

- [#32541](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32541)
  [`0624df1ffe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0624df1ffe1) - Bump
  json-ld-types dependency
- Updated dependencies

## 7.0.4

### Patch Changes

- [#32054](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32054)
  [`3c287cb61c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c287cb61c4) - Updates
  callbacks to source creationMethod and updateMethod attribute from link picker form submission
  event when provided as sourceEvent.

## 7.0.3

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 7.0.2

### Patch Changes

- [#32360](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32360)
  [`0ee9370595a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee9370595a) - Update
  json-ld-types
- Updated dependencies

## 7.0.1

### Patch Changes

- [#32035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32035)
  [`8aa0ed775f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aa0ed775f3) - Updates
  resolve attributes to return displayCategory as link instead of smartLink when handling
  ResolveUnsupportedError.

## 7.0.0

### Major Changes

- [#31253](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31253)
  [`d2703b479a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2703b479a1) - Removes
  extraneous exports from /resolved-attributes entry point.

### Minor Changes

- [`13ea25a119c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13ea25a119c) - Adds
  support to callbacks to provide `displayCategory` link detail.

  If firing an event for a link that is not yet (or is no longer) displayed as a smart link, provide
  the link details `displayCategory` field the value of `link`.

  ```ts
  const { linkCreated } = useSmartLinkLifecycleAnalytics();

  /**
   * If creating a link that won't be displayed as smart link
   * fire link created with displayCategory = link
   */
  linkCreated({ url: 'https://atlassian.com', displayCategory: 'link' });

  /**
   * If the user changes the appearance of the link so it will now be displayed
   * as a smart link, call linkUpdated but do not provide displayCategory field,
   * indicating the link is currently displayed as smart link
   */
  linkUpdated({ url: 'https://atlassian.com' });

  /**
   * If the user deletes a link that is currently being displayed as a smart link,
   * do not provide displayCategory field
   */
  linkDeleted({ url: 'https://atlassian.com' });
  ```

## 6.0.1

### Patch Changes

- [#31388](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31388)
  [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) -
  Dependency update json-ld-types@3.4.0
- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [#30731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30731)
  [`8ed1b29ab37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ed1b29ab37) - Defer
  analytics event firing with `window.requestIdleCallback()`, with `window.requestAnimationFrame()`
  as fallback

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [#29477](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29477)
  [`d17a6d964ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d17a6d964ac) - Removes
  `getAnalyticsAttributes` from main entrypoint.

### Patch Changes

- [`69b42fc04b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b42fc04b8) - Package
  size optimisation

## 4.1.0

### Minor Changes

- [#29618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29618)
  [`2159e1814fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2159e1814fc) - Adds
  getAnalyticsAttributes as single mechanism to access resolved metada for analytics attributes

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#28234](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28234)
  [`78913286eca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78913286eca) - - Add
  support for resolved metadata
  - It is now a requirement for Link Analytics to be wrapped with the SmartCardProvider, else it
    will catastrophically break

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#28171](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28171)
  [`06a9ae91ce0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06a9ae91ce0) - Add
  nonPrivacySafeAttributes.domainName to event payload

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [#25164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25164)
  [`e48301ec460`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e48301ec460) - Adds
  support for confluence-style analytic events.

## 1.1.0

### Minor Changes

- [#24967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24967)
  [`d107fd8bd93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d107fd8bd93) - Adds
  callbacks for tracking link updates and link deletions.

## 1.0.0

### Major Changes

- [#24791](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24791)
  [`e7c31586ebe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7c31586ebe) - Add
  support for deriving create link attributes from another event.

## 0.1.1

### Patch Changes

- [#24373](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24373)
  [`69136bc61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69136bc61f3) - Initial
  release
