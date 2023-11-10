# @atlaskit/link-test-helpers

## 6.2.6

### Patch Changes

- [#42661](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42661) [`c6abc68904d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6abc68904d) - [ux] Fix date showing incorrectly and also update test data to check for the format it was failing for

## 6.2.5

### Patch Changes

- [#42867](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42867) [`35472354e2c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35472354e2c) - Update mockBasicFilterAGGFetchRequests to return error response.

## 6.2.4

### Patch Changes

- [#42835](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42835) [`2dd92680543`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2dd92680543) - Updated mockBasicFilterAGGFetchRequests to return empty results.

## 6.2.3

### Patch Changes

- [#42756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42756) [`2bae2862ce7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2bae2862ce7) - Updated mockBasicFilterAGGFetchRequests response to slow down for vr testing

## 6.2.2

### Patch Changes

- [#42612](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42612) [`709162833ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/709162833ca) - Exports alert image for use in mocks. Updates folder structure for basic-filters and adds AGG fetch request mocks.

## 6.2.1

### Patch Changes

- [#42575](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42575) [`d7338b9229e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7338b9229e) - Update toBeFiredWithAnalyticEventOnce helper message to account for screen events

## 6.2.0

### Minor Changes

- [#41851](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41851) [`1617920980f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1617920980f) - Add and export `mockBasicFilterAGGFetchRequests`, `mockBasicFilterData` for AGG mocks in basic filters.

## 6.1.6

### Patch Changes

- [#41407](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41407) [`1a0b798e027`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a0b798e027) - Added optional mock site data override to test util

## 6.1.5

### Patch Changes

- [#40773](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40773) [`36ece5e3656`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36ece5e3656) - Ordering mock data alphabetically for site selector

## 6.1.4

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491) [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update json-ld-types dependencies to be compatible with version

## 6.1.3

### Patch Changes

- [#40235](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40235) [`13af8af3ff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13af8af3ff4) - Updating mock to include 'extensionKey' instead of 'key'

## 6.1.2

### Patch Changes

- [#40187](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40187) [`6ca45119002`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca45119002) - Added destination object types to meta responses.

## 6.1.1

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127) [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump json-ld-types 3.8.0 -> 3.9.1

## 6.1.0

### Minor Changes

- [#39926](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39926) [`3f30d999d86`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f30d999d86) - Updating VR tests and helpers that use external resources to local ones for Gemini migration

## 6.0.5

### Patch Changes

- [#39460](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39460) [`882e4e88358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/882e4e88358) - Add playwright tests and add test ids to find elements
- Updated dependencies

## 6.0.4

### Patch Changes

- [#38967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38967) [`f2fcb2a54c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2fcb2a54c8) - Update test data types

## 6.0.3

### Patch Changes

- [#38722](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38722) [`3f3b63589a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3b63589a1) - Fix issue where icon sizing is inconsitent. Also added some icons that are larger and were causing problems in prod to the mock data so we can have some examples on hand.

## 6.0.2

### Patch Changes

- [#37958](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37958) [`e4137f1638e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4137f1638e) - Added an option to disable ORS mocking.

## 6.0.1

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720) [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update dependency json-ld-types@3.8.0

## 6.0.0

### Major Changes

- [#37569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37569) [`adf48a24a25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adf48a24a25) - Removed MockLinkPickerPlugin, this is no longer exported

  New images entrypoint now supports newly exported icon.

## 5.0.0

### Major Changes

- [#37194](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37194) [`dadcc574c94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dadcc574c94) - Removed and moved to @atlaskit/link-picker

  - MockLinkPickerPromisePlugin
  - MockLinkPickerGeneratorPlugin
  - UnstableMockLinkPickerPlugin

## 4.2.2

### Patch Changes

- [#37409](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37409) [`2cb283138ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cb283138ce) - Added Search Functionality to Assets Config Modal and added endpoints for Assets fetch mocks

## 4.2.1

### Patch Changes

- [#37163](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37163) [`d76d056a63a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d76d056a63a) - Fix problem where React key violation is thrown in console when datasources are displayed with mocked data

## 4.2.0

### Minor Changes

- [#37034](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37034) [`dd0db85e7b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd0db85e7b7) - [ux] Added onInsertPressed method to insert ADF into doc and updated helper test mocks

## 4.1.4

### Patch Changes

- [#36344](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36344) [`b5eb462a7b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5eb462a7b0) - Update /data response to be in line with real backend response.

## 4.1.3

### Patch Changes

- [#35424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35424) [`776a88442e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/776a88442e4) - [ux] When on mobile, the datasources will fallback to inline smartcard views.

## 4.1.2

### Patch Changes

- [#35297](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35297) [`ba155a0034c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba155a0034c) - [ux] Add restricted access view to modal and table
- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#35861](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35861) [`f427908df3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f427908df3d) - change the datasource response type to include the meta data section and the data response will wrap in the data section

### Patch Changes

- Updated dependencies

## 4.0.8

### Patch Changes

- [#34936](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34936) [`b1ffae0351d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1ffae0351d) - - Remove duplicating entry in datasource mock data that was causing react's "key" uniqness error
  - Move from table view having list of keys in table view to list of objects with key as a string

## 4.0.7

### Patch Changes

- [#35473](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35473) [`09348dbabbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09348dbabbb) - Changes images in link picker plugin mock data to be base64 images

## 4.0.6

### Patch Changes

- [#34796](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34796) [`d0680816ada`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0680816ada) - [ux] Added empty and error states to jira modal and datasourceTable

## 4.0.5

### Patch Changes

- [#34363](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34363) [`105f0c7291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/105f0c7291b) - [ux] Various bug fixes to jira issue modal
- Updated dependencies

## 4.0.4

### Patch Changes

- [#34180](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34180) [`7f2a6cd138c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f2a6cd138c) - Added `schema` in `generateDataResponse`

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [#33689](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33689) [`d86bc75af82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d86bc75af82) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 4.0.0

### Major Changes

- [#34035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34035) [`0b0226e2ff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b0226e2ff4) - Updated mock response to the new `DatasourceDataResponseItem` format

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#34060](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34060) [`79588abed5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79588abed5b) - Add `forceBaseUrl` member under /datasource entrypoint.

## 3.0.0

### Major Changes

- [#33917](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33917) [`111d5e59c3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/111d5e59c3a) - Updated mock response to the new `DatasourceType` value format

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#33841](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33841) [`9434c1e3f40`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9434c1e3f40) - Introduce entry point /datasource where exported members are:

  - `mockAutoCompleteData`
  - `mockJiraData`
  - `mockSiteData`
  - `mockSuggestionData`
  - `mockDatasourceFetchRequests`
    Where `mockDatasourceFetchRequests` will mock some of the calls requested via native `fetch` to support examples where datasources are used

## 2.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#31285](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31285) [`84881060de0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84881060de0) - Introduce `MockIntersectionObserverFactory`, `MockIntersectionObserverOpts` and `mockSimpleIntersectionObserver`helpers to help testing IntersectObserver interface

## 2.1.1

### Patch Changes

- [#30977](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30977) [`ecef5fad2b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecef5fad2b4) - Update MockLinkPickerPromisePlugin to return action
- Updated dependencies

## 2.1.0

### Minor Changes

- [#29067](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29067) [`36848fe9148`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36848fe9148) - Adds jest entrypoint to expose jest custom matcher .toBeFiredWithAnalyticEventOnce

## 2.0.1

### Patch Changes

- [#27732](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27732) [`41d0c413ea1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41d0c413ea1) - Update `UnstableMockLinkPickerPlugin` every time errorFallback is provided will be treated as `UnauthenticatedError`
- Updated dependencies

## 2.0.0

### Major Changes

- [#25757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25757) [`cc13a62e933`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc13a62e933) - Remove Enzyme mounting helpers

## 1.5.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.5.0

### Minor Changes

- [#25115](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25115) [`7dbc77d866a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7dbc77d866a) - Adds support for plugins providing metadata about resolved links.

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.4.0

### Minor Changes

- [#23812](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23812) [`d0feee9b4ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0feee9b4ad) - [ux] Add a UI error message to display when the link picker plugin resolve throws an error

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#23444](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23444) [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux] Adds in TAB UI support for Link Picker

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#23370](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23370) [`3fe49774601`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fe49774601) - Refactor link picker test to use RTL

## 1.1.0

### Minor Changes

- [#22889](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22889) [`854d5c55d9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/854d5c55d9b) - Adds link-picker export with mock link picker plugin.

## 1.0.0

### Major Changes

- [#22739](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22739) [`06d995b3d3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06d995b3d3b) - Introduces the @atlaskit/link-test-helpers pkg
