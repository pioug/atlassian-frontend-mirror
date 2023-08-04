# @atlaskit/link-test-helpers

## 6.0.2

### Patch Changes

- [`e4137f1638e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4137f1638e) - Added an option to disable ORS mocking.

## 6.0.1

### Patch Changes

- [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update dependency json-ld-types@3.8.0

## 6.0.0

### Major Changes

- [`adf48a24a25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adf48a24a25) - Removed MockLinkPickerPlugin, this is no longer exported

  New images entrypoint now supports newly exported icon.

## 5.0.0

### Major Changes

- [`dadcc574c94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dadcc574c94) - Removed and moved to @atlaskit/link-picker

  - MockLinkPickerPromisePlugin
  - MockLinkPickerGeneratorPlugin
  - UnstableMockLinkPickerPlugin

## 4.2.2

### Patch Changes

- [`2cb283138ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cb283138ce) - Added Search Functionality to Assets Config Modal and added endpoints for Assets fetch mocks

## 4.2.1

### Patch Changes

- [`d76d056a63a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d76d056a63a) - Fix problem where React key violation is thrown in console when datasources are displayed with mocked data

## 4.2.0

### Minor Changes

- [`dd0db85e7b7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd0db85e7b7) - [ux] Added onInsertPressed method to insert ADF into doc and updated helper test mocks

## 4.1.4

### Patch Changes

- [`b5eb462a7b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5eb462a7b0) - Update /data response to be in line with real backend response.

## 4.1.3

### Patch Changes

- [`776a88442e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/776a88442e4) - [ux] When on mobile, the datasources will fallback to inline smartcard views.

## 4.1.2

### Patch Changes

- [`ba155a0034c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba155a0034c) - [ux] Add restricted access view to modal and table
- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [`f427908df3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f427908df3d) - change the datasource response type to include the meta data section and the data response will wrap in the data section

### Patch Changes

- Updated dependencies

## 4.0.8

### Patch Changes

- [`b1ffae0351d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1ffae0351d) - - Remove duplicating entry in datasource mock data that was causing react's "key" uniqness error
  - Move from table view having list of keys in table view to list of objects with key as a string

## 4.0.7

### Patch Changes

- [`09348dbabbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09348dbabbb) - Changes images in link picker plugin mock data to be base64 images

## 4.0.6

### Patch Changes

- [`d0680816ada`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0680816ada) - [ux] Added empty and error states to jira modal and datasourceTable

## 4.0.5

### Patch Changes

- [`105f0c7291b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/105f0c7291b) - [ux] Various bug fixes to jira issue modal
- Updated dependencies

## 4.0.4

### Patch Changes

- [`7f2a6cd138c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f2a6cd138c) - Added `schema` in `generateDataResponse`

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [`d86bc75af82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d86bc75af82) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 4.0.0

### Major Changes

- [`0b0226e2ff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b0226e2ff4) - Updated mock response to the new `DatasourceDataResponseItem` format

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [`79588abed5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79588abed5b) - Add `forceBaseUrl` member under /datasource entrypoint.

## 3.0.0

### Major Changes

- [`111d5e59c3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/111d5e59c3a) - Updated mock response to the new `DatasourceType` value format

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [`9434c1e3f40`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9434c1e3f40) - Introduce entry point /datasource where exported members are:

  - `mockAutoCompleteData`
  - `mockJiraData`
  - `mockSiteData`
  - `mockSuggestionData`
  - `mockDatasourceFetchRequests`
    Where `mockDatasourceFetchRequests` will mock some of the calls requested via native `fetch` to support examples where datasources are used

## 2.3.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.3.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.3.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`84881060de0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84881060de0) - Introduce `MockIntersectionObserverFactory`, `MockIntersectionObserverOpts` and `mockSimpleIntersectionObserver`helpers to help testing IntersectObserver interface

## 2.1.1

### Patch Changes

- [`ecef5fad2b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecef5fad2b4) - Update MockLinkPickerPromisePlugin to return action
- Updated dependencies

## 2.1.0

### Minor Changes

- [`36848fe9148`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36848fe9148) - Adds jest entrypoint to expose jest custom matcher .toBeFiredWithAnalyticEventOnce

## 2.0.1

### Patch Changes

- [`41d0c413ea1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41d0c413ea1) - Update `UnstableMockLinkPickerPlugin` every time errorFallback is provided will be treated as `UnauthenticatedError`
- Updated dependencies

## 2.0.0

### Major Changes

- [`cc13a62e933`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc13a62e933) - Remove Enzyme mounting helpers

## 1.5.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.5.0

### Minor Changes

- [`7dbc77d866a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7dbc77d866a) - Adds support for plugins providing metadata about resolved links.

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.4.0

### Minor Changes

- [`d0feee9b4ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0feee9b4ad) - [ux] Add a UI error message to display when the link picker plugin resolve throws an error

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux] Adds in TAB UI support for Link Picker

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`3fe49774601`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fe49774601) - Refactor link picker test to use RTL

## 1.1.0

### Minor Changes

- [`854d5c55d9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/854d5c55d9b) - Adds link-picker export with mock link picker plugin.

## 1.0.0

### Major Changes

- [`06d995b3d3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06d995b3d3b) - Introduces the @atlaskit/link-test-helpers pkg
