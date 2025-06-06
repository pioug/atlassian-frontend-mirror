# @atlaskit/link-extractors

## 2.3.8

### Patch Changes

- Updated dependencies

## 2.3.7

### Patch Changes

- [#165007](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165007)
  [`1f50b1c7072cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1f50b1c7072cf) -
  Remove atlassian:design and flattern the entity data
- Updated dependencies

## 2.3.6

### Patch Changes

- [#164735](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164735)
  [`e775157fd06b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e775157fd06b8) -
  Rename nounData to entityData. Fg smart_links_noun_support
- Updated dependencies

## 2.3.5

### Patch Changes

- Updated dependencies

## 2.3.4

### Patch Changes

- [#160330](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160330)
  [`f1c0f21f646c9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1c0f21f646c9) -
  Check for nullable jsonLd object on extractLink and extractTitle

## 2.3.3

### Patch Changes

- [#154600](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154600)
  [`0b06dde976fe0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b06dde976fe0) -
  Internal updates to logo component usage
- Updated dependencies

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#144842](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144842)
  [`06d13af127efa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06d13af127efa) -
  Export new entity based extractors extractSmartLinkAri, extractSmartLinkCreatedBy,
  extractSmartLinkCreatedOn, extractSmartLinkModifiedBy, extractSmartLinkModifiedOn. Renamed:
  extractSmartLinkIcon -> extractEntityIcon.

## 2.2.1

### Patch Changes

- [#144118](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144118)
  [`d608e2fc69b26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d608e2fc69b26) -
  extractEntityProvider return undefined when no generator in meta

## 2.2.0

### Minor Changes

- [#142166](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142166)
  [`d17e6b5e5f937`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d17e6b5e5f937) -
  Expose new extractors extractSmartLinkUrl, extractSmartLinkIcon, extractSmartLinkProvider,
  extractEntityProvider. Renamed isEntityPresent.

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#137904](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137904)
  [`10e0142c317b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/10e0142c317b1) -
  Exports new functionality: extractEntity, isEntityType, extractSmartLinkEmbed,
  extractSmartLinkTitle

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#132126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132126)
  [`5d45dce9796da`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d45dce9796da) -
  Updated dependency json-ld-types to @atlaskit/json-ld-types

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

## 1.10.0

### Minor Changes

- [#109430](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109430)
  [`c6429aa44850a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6429aa44850a) -
  [ux] Adds support for Confluence Live Doc icons to @atlaskit/smart-card

## 1.9.2

### Patch Changes

- [#104833](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104833)
  [`0b0aae2a7e26e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0b0aae2a7e26e) -
  [ux] Migrate block card unresolved view icons

## 1.9.1

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#133311](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133311)
  [`d0dfe717c6cc3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0dfe717c6cc3) -
  Added removeTextHighlightingFromTitle prop to allow for removal of text fragment from the title
  ofan inline smart card

## 1.8.0

### Minor Changes

- [`25c7d3c7d5354`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/25c7d3c7d5354) -
  Remove the platform.linking-platform.extractor.improve-bitbucket-file-links feature flag

## 1.7.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#127351](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127351)
  [`e87b54903058e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e87b54903058e) -
  Add React 18 compatability

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#97142](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97142)
  [`317def0c5d45`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/317def0c5d45) -
  EDM-9697 Export extractProviderIcon from link-extractors

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#95278](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95278)
  [`ee9b5712d03a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee9b5712d03a) -
  [ux] EDM-9697 Standardise linking icons across view types

## 1.3.0

### Minor Changes

- [#86596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86596)
  [`7aab5c5119fc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7aab5c5119fc) -
  Add ARI extractor

### Patch Changes

- [#86596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86596)
  [`37621cb1f1b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37621cb1f1b9) -
  Update dependency json-ld-types

## 1.2.4

### Patch Changes

- [#81411](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81411)
  [`a5aef2090149`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a5aef2090149) -
  Line breaks are now removed from extracted link titles

## 1.2.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.2.2

### Patch Changes

- [#68194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68194)
  [`c1d4a8fecc4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d4a8fecc4e) -
  bump json-ld-types to version 3.11.0

## 1.2.1

### Patch Changes

- [#65857](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65857)
  [`af6c077d8694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af6c077d8694) -
  [ux] change title for BB file links to include repo name and file path

## 1.2.0

### Minor Changes

- [#40648](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40648)
  [`4c9952cf9d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9952cf9d5) - make
  json prop optional for extractPreview function

## 1.1.4

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491)
  [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update
  json-ld-types dependencies to be compatible with version

## 1.1.3

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127)
  [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump
  json-ld-types 3.8.0 -> 3.9.1

## 1.1.2

### Patch Changes

- [#39932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39932)
  [`cadbf4706f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cadbf4706f5) - Remove
  deprecated props in usages of @atlaskit/logo, replace with appearance prop.

## 1.1.1

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720)
  [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update
  dependency json-ld-types@3.8.0

## 1.1.0

### Minor Changes

- [#36089](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36089)
  [`1e7190077d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7190077d4) - Move off
  deprecated @atlaskit/linking-common/extractors to @atlaskit/link-extractors
