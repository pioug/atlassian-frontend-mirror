# @atlaskit/editor-card-provider

## 3.11.9

### Patch Changes

- Updated dependencies

## 3.11.8

### Patch Changes

- Updated dependencies

## 3.11.7

### Patch Changes

- Updated dependencies

## 3.11.6

### Patch Changes

- Updated dependencies

## 3.11.5

### Patch Changes

- Updated dependencies

## 3.11.4

### Patch Changes

- Updated dependencies

## 3.11.3

### Patch Changes

- Updated dependencies

## 3.11.2

### Patch Changes

- Updated dependencies

## 3.11.1

### Patch Changes

- Updated dependencies

## 3.11.0

### Minor Changes

- [#166667](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166667)
  [`821e294042f28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/821e294042f28) -
  [ux] Update editor card provider to return embed card for Jira version links

## 3.10.8

### Patch Changes

- Updated dependencies

## 3.10.7

### Patch Changes

- Updated dependencies

## 3.10.6

### Patch Changes

- [#156951](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156951)
  [`0f38b2895a03e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0f38b2895a03e) -
  Added default embed smart link type for plans URLs

## 3.10.5

### Patch Changes

- Updated dependencies

## 3.10.4

### Patch Changes

- Updated dependencies

## 3.10.3

### Patch Changes

- Updated dependencies

## 3.10.2

### Patch Changes

- Updated dependencies

## 3.10.1

### Patch Changes

- Updated dependencies

## 3.10.0

### Minor Changes

- [#144036](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144036)
  [`0509cf0b76664`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0509cf0b76664) -
  [ux] Update editor card provider to return embed card for backlog and board links

## 3.9.0

### Minor Changes

- [#139456](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139456)
  [`a788f5ceac7a2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a788f5ceac7a2) -
  [ux] Add optional forth optional parameter to EditorCardProvider.resolve method called
  `isEmbedFriendlyLocation` which when given `false` value will prevent auto-conversion (on link
  paste) to an embed based on FE speciafied regexp rules. If value is not given it will act as true
  and remain old behaviour

## 3.8.2

### Patch Changes

- Updated dependencies

## 3.8.1

### Patch Changes

- Updated dependencies

## 3.8.0

### Minor Changes

- [`4f0da3d4d6c4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4f0da3d4d6c4e) -
  EDM-10533 Cleanup platform.linking-platform.embed-youtube-by-default FF

## 3.7.1

### Patch Changes

- [#134513](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134513)
  [`9908df0490fce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9908df0490fce) -
  NO-ISSUE: remmove unneeded setimmediate dependency

## 3.7.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 3.6.0

### Minor Changes

- [#128578](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128578)
  [`cafc6755fb65a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cafc6755fb65a) -
  Add React 18 compatability

## 3.5.1

### Patch Changes

- Updated dependencies

## 3.5.0

### Minor Changes

- [#126756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126756)
  [`851ff3f2d8e45`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/851ff3f2d8e45) -
  Tidying FF for default embed for jira dashboard smartlink

### Patch Changes

- Updated dependencies

## 3.4.4

### Patch Changes

- Updated dependencies

## 3.4.3

### Patch Changes

- Updated dependencies

## 3.4.2

### Patch Changes

- Updated dependencies

## 3.4.1

### Patch Changes

- Updated dependencies

## 3.4.0

### Minor Changes

- [#112094](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112094)
  [`b19771fec1a43`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b19771fec1a43) -
  Accept additional optional product arg in provider that will be forwarded as X-Product header to
  ORSbatch resolve endpoint

## 3.3.6

### Patch Changes

- [#107009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107009)
  [`4eb69d60f58f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4eb69d60f58f4) -
  Make getHardCodedAppearance protected so that subclasses can override this in order to handle link
  embedded by default

## 3.3.5

### Patch Changes

- Updated dependencies

## 3.3.4

### Patch Changes

- [#98840](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98840)
  [`cff3be4e0774`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cff3be4e0774) -
  Default Jira dashboard to embed appearance

## 3.3.3

### Patch Changes

- [#86596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86596)
  [`37621cb1f1b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37621cb1f1b9) -
  Update dependency json-ld-types
- Updated dependencies

## 3.3.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 3.3.1

### Patch Changes

- [#81050](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81050)
  [`c15d7331e8b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c15d7331e8b8) -
  We are updating the Jira List URL pattern as we recently update the urls

## 3.3.0

### Minor Changes

- [#75659](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75659)
  [`28d133564298`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/28d133564298) -
  Removed duplicated version of environment.ts in editor-card-provider package and all usages were
  replaced with the corresponding type/function from linking-common.

## 3.2.0

### Minor Changes

- [#74458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74458)
  [`c40e977de5da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c40e977de5da) -
  [ux] List view links will be converted into smart link embed by default

## 3.1.17

### Patch Changes

- [#72315](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72315)
  [`818ff8704f34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/818ff8704f34) -
  Updated default smart card view for Confluence Databases to include default for savedViewId
- [#71047](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71047)
  [`931a7edba41e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/931a7edba41e) -
  update window.location usage to be compatible with SSR

## 3.1.16

### Patch Changes

- [#68764](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68764)
  [`59b851a5d621`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/59b851a5d621) -
  [ux] Render Polaris (Jira Product Discovery) published view as an embed by default

## 3.1.15

### Patch Changes

- [#68194](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68194)
  [`c1d4a8fecc4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1d4a8fecc4e) -
  bump json-ld-types to version 3.11.0

## 3.1.14

### Patch Changes

- [#66881](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66881)
  [`d940eeab50d9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d940eeab50d9) -
  [ux] Updated default smart card view for Confluence Databases to include all-entries for
  savedViewId and only uuid for unsavedView

## 3.1.13

### Patch Changes

- Updated dependencies

## 3.1.12

### Patch Changes

- [#63428](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63428)
  [`441be131933f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/441be131933f) -
  [ux] make youtube videos embed by default

## 3.1.11

### Patch Changes

- [#62385](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62385)
  [`f3e422857a54`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3e422857a54) -
  [ux] Updated default smart card view for Confluence Databases to include check for unsavedView
  parameter

## 3.1.10

### Patch Changes

- [#42239](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42239)
  [`3ebc0b4f999`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ebc0b4f999) - [ux]
  Updated default smart card view for Confluence Databases to include check for entryId and
  savedViewId parameters

## 3.1.9

### Patch Changes

- [#40406](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40406)
  [`542d0dd0b1d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/542d0dd0b1d) - [ux]
  Changed default smart card view for Confluence Databases route from inline to embed.

## 3.1.8

### Patch Changes

- [#40491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40491)
  [`1fedffbd64b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fedffbd64b) - Update
  json-ld-types dependencies to be compatible with version

## 3.1.7

### Patch Changes

- [#40127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40127)
  [`2cd7af71b63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2cd7af71b63) - Bump
  json-ld-types 3.8.0 -> 3.9.1

## 3.1.6

### Patch Changes

- [#37720](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37720)
  [`e74ae7f06d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e74ae7f06d4) - Update
  dependency json-ld-types@3.8.0

## 3.1.5

### Patch Changes

- [#37136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37136)
  [`83f06b6e7f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83f06b6e7f6) - Update
  to use 'getStatus' from '@atlaskit/linking-common'
- Updated dependencies

## 3.1.4

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340)
  [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out
  of peer dependency enforcement

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757)
  [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add
  postinstall check to enforce internal peer dependencies

## 3.1.1

### Patch Changes

- [#36089](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36089)
  [`1e7190077d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7190077d4) - Move off
  deprecated @atlaskit/linking-common/extractors to @atlaskit/link-extractors
- Updated dependencies

## 3.1.0

### Minor Changes

- [#35032](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35032)
  [`04295e9d5bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04295e9d5bc) - [ux]
  Updating ORS response to include datasources and facilitating pasting JQL links turning into
  datasource tables

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- [#35428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35428)
  [`1674b5907b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1674b5907b4) - [ux]
  Make confluence whiteboard urls default to embed view

## 3.0.3

### Patch Changes

- [#33699](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33699)
  [`f10ed88032c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f10ed88032c) - With the
  renaming of Jira Roadmaps to Timeline, we are updating the regex rules to match timeline in
  conjunction to roadmaps
- Updated dependencies

## 3.0.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8
- Updated dependencies

## 3.0.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 3.0.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#32541](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32541)
  [`0624df1ffe1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0624df1ffe1) - Bump
  json-ld-types dependency
- Updated dependencies

## 2.0.3

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 2.0.2

### Patch Changes

- [#32360](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32360)
  [`0ee9370595a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee9370595a) - Update
  json-ld-types
- Updated dependencies

## 2.0.1

### Patch Changes

- [#31388](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31388)
  [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) -
  Dependency update json-ld-types@3.4.0
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#30266](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30266)
  [`12223b3ee04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12223b3ee04) - Move
  EditorCardProvider to new package instead of using imports from Link Provider and Smart Card

### Patch Changes

- Updated dependencies
