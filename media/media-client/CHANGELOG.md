# @atlaskit/media-client

## 32.0.2

### Patch Changes

- [#125907](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125907)
  [`a453a64a6138d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a453a64a6138d) -
  Updated SVG test file ids

## 32.0.1

### Patch Changes

- [#123539](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123539)
  [`3be0da32cfe48`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3be0da32cfe48) -
  Updated helper createServerUnauthorizedError. Adds Inner Error to the returned value

## 32.0.0

### Patch Changes

- Updated dependencies

## 31.1.2

### Patch Changes

- Updated dependencies

## 31.1.1

### Patch Changes

- Updated dependencies

## 31.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 31.0.0

### Major Changes

- [#104917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104917)
  [`f5b9e90ce5043`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5b9e90ce5043) -
  changed useFileHashes to take an array of identifiers which it will then pre-emptively fetch
  metadata when it detects duplicates with missing hashes

### Minor Changes

- [#104917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104917)
  [`4c1c65faff476`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c1c65faff476) -
  Adding forceRefresh to fileState request to enable removing cache and forcing the refetching of
  meta-data

## 30.0.0

### Major Changes

- [#102527](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102527)
  [`a90d34cd14faf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a90d34cd14faf) -
  Updated the constructor of the following classes. Consult the type definitions for details.

  - `RequestError`

  - `PollingError`

  - `FileFetcherError`

### Minor Changes

- [#102527](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102527)
  [`a90d34cd14faf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a90d34cd14faf) - -
  New error verification helper `isCommonMediaClientError`

  - `ErrorFileState` is now deserializable into a `CommonMediaClientError` using new export
    `toCommonMediaClientError`

## 29.1.0

### Minor Changes

- [#103451](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103451)
  [`c45fe9fe50a79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c45fe9fe50a79) -
  Extended Abuse Classification Confidence values

## 29.0.1

### Patch Changes

- [#97492](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97492)
  [`5195c4fd974a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5195c4fd974a3) -
  Extended internal types with AbuseClassification attribute

## 29.0.0

### Major Changes

- [#98696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98696)
  [`bb55fa33eaf3f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bb55fa33eaf3f) -
  Changed API of unused registerCopyIntents to enable mutli-file uploads and added bulk reigster
  copy intent endpoint in file

## 28.6.0

### Minor Changes

- [#179378](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179378)
  [`cb26b4db4b6ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb26b4db4b6ad) -
  Calling the /v2/file/copy endpoint in file.copyFile if auth providers are not given

## 28.5.0

### Minor Changes

- [#170974](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170974)
  [`215eb993c1ea3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/215eb993c1ea3) -
  Added `registerCopyIntents` and `copyFile` endpoints to meida client to enable cross client copy
  and paste

## 28.4.0

### Minor Changes

- [#170821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170821)
  [`52532d238c0b6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52532d238c0b6) -
  Enabled the deduplication of files in media-filmstrip by passing includeHashForDuplicateFiles flag
  to /items

## 28.3.1

### Patch Changes

- [#165609](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165609)
  [`b29c0cc4fef46`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b29c0cc4fef46) -
  Cleaned up media card perf observer feature flag

## 28.3.0

### Minor Changes

- [#163838](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163838)
  [`c3fcf9a7c2028`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3fcf9a7c2028) -
  Media Client File Download throws Request errors due to failed connection (Not streaming errors)

## 28.2.0

### Minor Changes

- [`6099ac032dd30`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6099ac032dd30) -
  Added viewerOptions to override file preview renderer in media components

## 28.1.0

### Minor Changes

- [#156454](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156454)
  [`cfba72d9716f0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cfba72d9716f0) -
  Logs trace context for metadata error events

## 28.0.8

### Patch Changes

- [#158161](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158161)
  [`f092b9d2f949d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f092b9d2f949d) -
  clean up LD Media CDN FFs

## 28.0.7

### Patch Changes

- [#158481](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158481)
  [`a6efbf9ceb2c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a6efbf9ceb2c9) -
  Removed nonMediaErrors due to incorrectly logging serverUnauthorised

## 28.0.6

### Patch Changes

- [#156328](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156328)
  [`91ea9df3f02c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/91ea9df3f02c3) -
  migrate media CDN FFs to Statsig
- [#157454](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157454)
  [`94e18b08d21d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/94e18b08d21d2) -
  add config for authProviderTimeout to media-client to override default timeout

## 28.0.5

### Patch Changes

- [#155484](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155484)
  [`958e4ecdf8ab7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/958e4ecdf8ab7) -
  add nonMediaError reason to media-client

## 28.0.4

### Patch Changes

- [#151581](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151581)
  [`906487ee4e09a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/906487ee4e09a) -
  fix media viewer for video when no 1280 artifact available
- Updated dependencies

## 28.0.3

### Patch Changes

- [#150155](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150155)
  [`d06247128ff41`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d06247128ff41) -
  Reverse the check of FedRAMP env to check against Commercial instead in media-client

## 28.0.2

### Patch Changes

- [#149473](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149473)
  [`4c74b6716ded9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c74b6716ded9) -
  Remove global jest override to fix runtime type error in jest tests

## 28.0.1

### Patch Changes

- [#147039](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147039)
  [`f29b4d6055c5e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f29b4d6055c5e) -
  fix media cdn errors caused by excessive media token length

## 28.0.0

### Major Changes

- [#139803](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139803)
  [`573e2dccbc940`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/573e2dccbc940) -
  BREAKING CHANGE: Attribute `preview` in File State is now set unnconditionally in the file state.
  No longer when it's supported by the broswer. If your application relies on this attribute, check
  the file mimetype to ensure that you are using it properly. This change was released in `v27.0.0`
  behind a feature flag. Now, it is a permanent change.

## 27.6.1

### Patch Changes

- [#139979](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139979)
  [`7db4a3764719f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7db4a3764719f) -
  Implementing a safe guard for platform.media-cdn-delivery against FedRAMP environment

## 27.6.0

### Minor Changes

- [#134882](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134882)
  [`ba204702f8e32`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba204702f8e32) -
  [ED-24567]

  - **@atlaskit/editor-common** Add MEDIA_PICKER as a variable fo analytics
  - **@atlaskit/media-client** Return the mime-type from when calling the `uploadExternal` function

## 27.5.2

### Patch Changes

- [#134513](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134513)
  [`9908df0490fce`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9908df0490fce) -
  NO-ISSUE: remmove unneeded setimmediate dependency

## 27.5.1

### Patch Changes

- [`eaacfc7b03414`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaacfc7b03414) -
  Changed the feature flag used for analytics publishing to prevent spamming due to cached clients
  using bugged versions of Card

## 27.5.0

### Minor Changes

- [#132649](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132649)
  [`ab55ae1b17d7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab55ae1b17d7d) -
  add media cdn single host redirect

## 27.4.0

### Minor Changes

- [#130787](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130787)
  [`64a680780dc57`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/64a680780dc57) -
  Add performance observer metrics for Media Card to assist investigation into hot-110955

## 27.3.4

### Patch Changes

- [#120529](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120529)
  [`dc8b7900f9d1b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc8b7900f9d1b) -
  fix artifacts cdn url

## 27.3.3

### Patch Changes

- [#121438](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121438)
  [`6fc64e2707215`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6fc64e2707215) -
  Exported new test helpers createPollingMaxAttemptsError, createRateLimitedError,
  createServerUnauthorizedError, createMediaStoreError

## 27.3.2

### Patch Changes

- Updated dependencies

## 27.3.1

### Patch Changes

- Updated dependencies

## 27.3.0

### Minor Changes

- [#112714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112714)
  [`2a85dbbc4bc4f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a85dbbc4bc4f) -
  CXP-3328 Safeguard getArtifactUrl output with CDN feature flag

## 27.2.1

### Patch Changes

- [#106454](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106454)
  [`48b4b542e5ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48b4b542e5ae) -
  Fixed MediaStore getFileBinary call

## 27.2.0

### Minor Changes

- [#101187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101187)
  [`021415681643`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/021415681643) -
  Added SVG sample files

## 27.1.0

### Minor Changes

- [#103718](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103718)
  [`5bdb1cb0f2b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5bdb1cb0f2b7) -
  CXP-3328 Integrate CDN delivery to media-client

## 27.0.1

### Patch Changes

- [#103775](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103775)
  [`ce306a2407b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce306a2407b0) -
  Fix updateExternal function never resolves

## 27.0.0

### Major Changes

- [#97923](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97923)
  [`81075dd79e7f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/81075dd79e7f) -
  BREAKING CHANGE: Attribute `preview` (used for local previews during file upload) is now set
  unnconditionally in the file state. No longer when it's supported by the broswer. If your
  application relies on this attribute, check the file mimetype to ensure that you are using it
  properly.

## 26.3.0

### Minor Changes

- [#87494](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87494)
  [`050f1e462e17`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/050f1e462e17) -
  Added Get Binary endpoint to Media API class

## 26.2.3

### Patch Changes

- [#86762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/86762)
  [`f3d1602fa574`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3d1602fa574) -
  CXP-2655 Implemented a change to an endpoint for Mocked Media API

## 26.2.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 26.2.1

### Patch Changes

- [#77668](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77668)
  [`c8a08df51a9f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c8a08df51a9f) -
  Add password protected pdf support for media viewer

## 26.2.0

### Minor Changes

- [#70414](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70414)
  [`2125e318f970`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2125e318f970) -
  Adding the option to use SHA256 for file uploads to ensure Media is FedRAMP compliant. If not
  specified the system will default to SHA1 to preserve backwards compatibiilty.

### Patch Changes

- Updated dependencies

## 26.1.2

### Patch Changes

- [#71336](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71336)
  [`9abd05a91e25`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9abd05a91e25) -
  Fixed image load performance issue where setting max age in getFileImageURL params to undefined
  would override the default

## 26.1.1

### Patch Changes

- [#65817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65817)
  [`3be0ec786219`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3be0ec786219) -
  Updated mocked Media Api mothod

## 26.1.0

### Minor Changes

- [#60253](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60253)
  [`2d535695b891`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d535695b891) -
  Exposed MediaApi type
- [#60253](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60253)
  [`662b6d273ec0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/662b6d273ec0) -
  Breaking change: Updated interface for Test Helper "createMockedMediaApi". This is not a
  production-code breaking change

## 26.0.0

### Major Changes

- [#60352](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60352)
  [`ff9488b450dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff9488b450dd) -
  WHAT: Media has removed the ability to probe for existing file chunks.  
  WHY: This is to support the work to deprecate SHA1 usage and make the Media Platform comply with
  FedRAMP moderate controls. HOW: Remove any calls you have directly to probing, instead upload all
  files directly. If you upload files via MediaPicker no changes are required.

### Patch Changes

- Updated dependencies

## 25.1.0

### Minor Changes

- [#43817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43817)
  [`048aca70499`](https://bitbucket.org/atlassian/atlassian-frontend/commits/048aca70499) - new
  Mocked Media Api utility for tests

## 25.0.3

### Patch Changes

- [#43076](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43076)
  [`43317a91142`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43317a91142) - Added
  new internal interface MediaApi

## 25.0.2

### Patch Changes

- Updated dependencies

## 25.0.1

### Patch Changes

- Updated dependencies

## 25.0.0

### Major Changes

- [#41659](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41659)
  [`a0c97a19dba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0c97a19dba) - Remove
  unused utils and depreciated exports in mediaClient.

## 24.0.3

### Patch Changes

- [#41932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41932)
  [`756dd90f1a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/756dd90f1a3) - 1.
  Deprecate withMediaClient HOC in media-client and migrated it to media-client-react 2. clean up
  deprecated imports from media-client

## 24.0.2

### Patch Changes

- [#41501](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41501)
  [`b3cb749dc67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3cb749dc67) - Fix TS
  errors in AFM

## 24.0.1

### Patch Changes

- [#41371](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41371)
  [`a5766038a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5766038a35) - Fix TS
  errors in AFM

## 24.0.0

### Major Changes

- [#38532](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38532)
  [`7b6a2c6671b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b6a2c6671b) -
  Introducing 'media-state' for handling media internal file state. Introducing 'media-client-react'
  to provide hooks for seamless media-client integration with React. Introducing 'MediaCardV2' with
  a feature flag to replace rxjs based fileState subscription with 'useFileState' hook. Removed
  unused feature flags APIs from 'media-client' and its helper functions from 'media-common'.

### Patch Changes

- Updated dependencies

## 23.2.0

### Minor Changes

- [#39255](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39255)
  [`ede6ee7aaab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ede6ee7aaab) - Updated
  tests, examples and moving towards /test-helper export in packages to prevent circular
  dependancies

### Patch Changes

- Updated dependencies

## 23.1.3

### Patch Changes

- Updated dependencies

## 23.1.2

### Patch Changes

- [#37340](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37340)
  [`b9355830504`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9355830504) - Opt out
  of peer dependency enforcement

## 23.1.1

### Patch Changes

- [#36757](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36757)
  [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add
  postinstall check to enforce internal peer dependencies

## 23.1.0

### Minor Changes

- [#35121](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35121)
  [`195c473dd37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/195c473dd37) - Exposed
  helper to create Request errors externally

## 23.0.2

### Patch Changes

- [#33728](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33728)
  [`48e4a655534`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48e4a655534) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 23.0.1

### Patch Changes

- Updated dependencies

## 23.0.0

### Major Changes

- [#34887](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34887)
  [`eedf90fbaa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eedf90fbaa9) -
  'isPreviewableType' no longer requires feature flags to be passed as an argument since we are
  removing the new card experience feature flag

### Patch Changes

- Updated dependencies

## 22.0.5

### Patch Changes

- [#34814](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34814)
  [`a7281dbb78f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7281dbb78f) - Moved
  onFileRejection prop to Upload params and added file-size-limit API changes to /upload endpoint

## 22.0.4

### Patch Changes

- [#34644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34644)
  [`4d139e63f12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d139e63f12) - [ux] As
  part of migrating from the classic card experience to the new card experience, media of type 'doc'
  displays a preview by default

## 22.0.3

### Patch Changes

- [#34192](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34192)
  [`b098a252236`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b098a252236) - Add
  emptyFileName as a reason to FileFetcherError.
- [`e725edbb0d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e725edbb0d9) - Media
  Client now fetch remote file state regardless of file browser support (removed feature flag,
  permanent change)
- [`9425ed86eb7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9425ed86eb7) - File
  size limit is now verified in the backend, no longer the frontend
- Updated dependencies

## 22.0.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8
- Updated dependencies

## 22.0.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 22.0.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 21.1.0

### Minor Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`1df7534fc12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1df7534fc12) - [ux]
  Introduce file size limits when uploading

## 21.0.0

### Major Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`0f99ed9df35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f99ed9df35) - BREAKING
  CHANGES:

  - Media Store class no longer exposes getCollectionItems method

  - `MediaClient.collection.removeFile` method is now accessible through the replacement method
    `MediaClient.removeFileFromCollection`

  - `MediaClient.collection` has been fully removed. The following classes, types and utils have
    been also removed:

    - MediaCollection
    - MediaCollectionItem
    - MediaCollectionItems
    - MediaCollectionItemDetails
    - MediaCollectionItemMinimalDetails
    - isMediaCollectionItemFullDetails

  - Renamed type `MediaCollectionItemFullDetails` to `MediaItemDetails`

  - `MediaSubscribable` is no longer be a generic type. It now only works with `FileState`.

  - Removed `MediaSubscribableItem` type

### Patch Changes

- Updated dependencies

## 20.2.1

### Patch Changes

- Updated dependencies

## 20.2.0

### Minor Changes

- [#31582](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31582)
  [`0e2981295ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e2981295ce) - Media
  Client accepts a feature flags object in the upload method overriding internal flags

## 20.1.0

### Minor Changes

- [#30248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30248)
  [`894e1910ed4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/894e1910ed4) -
  Deprecation notice: Media Client and Media Store classes will no longer expose collection items
  listing methods. They will be removed in the next release

### Patch Changes

- Updated dependencies

## 20.0.3

### Patch Changes

- [#31194](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31194)
  [`4fdaa8a4645`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4fdaa8a4645) - update
  default chunk size from 4mb to 5mb

## 20.0.2

### Patch Changes

- [#30177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30177)
  [`cdd0445e5a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdd0445e5a5) - Fixed
  instantiation logic when feature flags object is passed

## 20.0.1

### Patch Changes

- [#28932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28932)
  [`90f6203e794`](https://bitbucket.org/atlassian/atlassian-frontend/commits/90f6203e794) - Media
  Client now fetch remote file state regardless of file browser support (behind feature flag)
- Updated dependencies

## 20.0.0

### Major Changes

- [#28374](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28374)
  [`2e902a363ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e902a363ad) - MEX-1649
  Update uploadChunk and probeChunk functions in mediastore with mandatory params - uploadId and
  partNumber

### Patch Changes

- Updated dependencies

## 19.1.1

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 19.1.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`81573c1dfa7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81573c1dfa7) - Items
  call creates a batched metadata trace Id
- [`0bccac57db6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bccac57db6) - remove
  mediaUploadApiV2 Feature flag

### Patch Changes

- [`a8eeb045e3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8eeb045e3a) - adding
  media only callouts to docs
- [`3d40d5e9b37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d40d5e9b37) - Adopt
  updated version of getRandomHex function for generating traceId
- Updated dependencies

## 19.0.0

### Major Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`5eb06146a4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5eb06146a4e) - Added
  support traceContext to be supplied to all request endpoint points.

### Patch Changes

- [`358de54a124`](https://bitbucket.org/atlassian/atlassian-frontend/commits/358de54a124) - Allow
  collection-fetcher endpoints to pass traceContext

## 18.1.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`2c402e87213`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c402e87213) -
  [Experimental] Add traceId in media card get image request.

### Patch Changes

- [`bf8302c838a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf8302c838a) -
  Implemented internal functionality to create local video preview.
- Updated dependencies

## 18.0.0

### Major Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`37ff149ab87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37ff149ab87) - Remove
  exposing StreamsCache class

### Patch Changes

- [`153829bfcb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/153829bfcb3) - Upgrade
  caching algorithm library lru-fast to lru_map.
- Updated dependencies

## 17.1.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`
- Updated dependencies

## 17.1.2

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`45b6d35ea96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45b6d35ea96) -
  [ME-1327] Added new upload methods to editor mobile bridge to support previews and progress for
  media cards.

## 17.1.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.
- Updated dependencies

## 17.1.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`c07a8176ddf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c07a8176ddf) - New
  BlobType SlicedBlob that includes partnumber introduced and used for uploading chunks
- [`a2e6bd37426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2e6bd37426) - add
  uploadId to prob function to support new media upload api

### Patch Changes

- [`e80f52696fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e80f52696fe) - Migrated
  styled-components to emotion
- [`de9dc9e7cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de9dc9e7cbd) - Renamed
  internal helpers and files
- Updated dependencies

## 17.0.0

### Major Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`a718050239e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a718050239e) - Media
  Client Uploader enforces a hard limit of 2Tb files.

  To mitigate these changes:

  - Set the feature flag mediaUploadApiV2 as false or Revert to a previous version for affected
    consumers and methods; Media Client uploadFile method. Media Client File Fetcher upload method.
    Media Picker.

- [`e4d0b89cd8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4d0b89cd8b) -
  Additional parameters and changes to the way parameters are passed to MediaStore.uploadChunk and
  MediaStore.probeChunks.
- [`d07442a7ff7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d07442a7ff7) - Breaking
  change to media-client uploadFile method, chunkSize and processingBatchSize as parameters removed
  from uploadFile.

### Patch Changes

- [`61cf857a95a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cf857a95a) - A util
  function for dynamically calculating chunkSizes.
- Updated dependencies

## 16.0.1

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`12d0af77572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12d0af77572) - Store
  media environment in session storage
- [`325e210e59f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/325e210e59f) - Revert
  changes made in MEX-1638-revert-update-media-store-class-with-new-endpoint-parameters
- [`b73f20ed703`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b73f20ed703) -
  EDM-3073: Fix collab for media inline and copy-paste regression
- [`c2ede50a80a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2ede50a80a) - Add
  media region and environment returned from media API response into failed analytic events.
- Updated dependencies

## 16.0.0

### Major Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`b6d47de3fd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6d47de3fd9) -
  [MEX-1417] remove access to media file streams cache

### Minor Changes

- [`5e249d1ad05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e249d1ad05) - Exposed
  media environment

### Patch Changes

- [`bde94d1a336`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bde94d1a336) - When
  chunkinator has multiple processing batches of chunks, file will only be finalised uploading for
  once.
- [`567b33b2eeb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/567b33b2eeb) - stripe
  out null and undefined params when calling media server
- [`c4c75f5a769`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c4c75f5a769) - Removed
  query string from media client
- Updated dependencies

## 15.1.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`a424e62b264`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a424e62b264) - Changes
  to support Node 16 Typescript definitions from `@types/node`.

## 15.1.0

### Minor Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Export
  `WithMediaClient` type to resolve a deep import path d.ts reference

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 15.0.0

### Major Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`fdc41ee7a0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fdc41ee7a0b) - Stop
  exposing observableToPromise from media client API. mediaSubscribableToPromise is used internally.
- [`118f3af101f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/118f3af101f) - Media
  Client APIs has been updated to use MediaSubscribable which provides subscription functionality
  (similar to RxJs observables). It exposes subscribe method that is called with MediaObserver as an
  argument and returns MediaSubscription. MediaSubscription exposes unsubscribe method.

  getFileState: The returned type of this function has changed from RxJs ReplaySubject to
  MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const fileStateSubscribable: MediaSubscribable<FileState> = mediaClient.file.getFileState(id);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = fileStateSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

  upload: The returned type of this function has changed from RxJs ReplaySubject to
  MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const uploadFileSubscribable: MediaSubscribable<FileState> = mediaClient.file.upload(uploadableFile);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = uploadFileSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

  getItems: The returned type of this function has changed from RxJs ReplaySubject to
  MediaSubscribable.

  ```
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const collectionItemsSubscribable: MediaSubscribable<MediaCollectionItem[]> = mediaClient.collection.getItems(collectionName);

  const mediaObserver: MediaObserver<MediaCollectionItem[]> = {
    next: (items) => {
      nextCallback(items)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = collectionItemsSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  ```

### Minor Changes

- [`f862d5ae7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f862d5ae7aa) - remove
  RxJs peer dependency

### Patch Changes

- Updated dependencies

## 14.4.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`7d2943a6038`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d2943a6038) - Created
  MediaSubscribable wrapper around RxJs Observable

### Patch Changes

- Updated dependencies

## 14.3.2

### Patch Changes

- [#17344](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17344)
  [`59a14d364b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59a14d364b1) - Bump
  query-string@^6.14.1

## 14.3.1

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`586b7869085`](https://bitbucket.org/atlassian/atlassian-frontend/commits/586b7869085) - Pass
  initialAuth to MediaStore
- [`dc1f9d42903`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc1f9d42903) - Updated
  typeguard
- [`f461edcfd05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f461edcfd05) - Update
  CardLoader to use react-loadable Add SSR feature prop to be passed in renderer and media card
- Updated dependencies

## 14.3.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`b51fc0a9062`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b51fc0a9062) - New
  helper to convert ImageResizeMode into FileImageMode
- [`269ee940b87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/269ee940b87) - redesign
  error UI on new media card experience

### Patch Changes

- [`fe9ced0cd70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe9ced0cd70) - Removed
  feature flags for polling settings
- Updated dependencies

## 14.2.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`381deea2aab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/381deea2aab) - MEX-710
  Added mobileUpload API to media-client

### Patch Changes

- [`c2ae093a067`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2ae093a067) - Fixed
  unit test taking more than 10secs
- Updated dependencies

## 14.1.1

### Patch Changes

- [#13973](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13973)
  [`e6689b61735`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6689b61735) - Added a
  new authProviderTimeout parameter within resolveAuth to control the timeout duration.

## 14.1.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`17776bda189`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17776bda189) - -
  Improve Smart Links providers and batch requests mechanism
  - Remove non-functional props that impact reloading

### Patch Changes

- [`7d869388cfe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d869388cfe) - Added
  timeout to auth provider

## 14.0.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`531dcf9459d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/531dcf9459d) - Media
  Client allows sync operations by using initial Auth credentials when the consumer needs it
  _inmediatelly_ after instantiation (e.g., Server Side Rendering). MediaClientConfig requires the
  "initialAuth" attribute to provide an Auth object that does not come from an async Auth provider.
  Example:

  ```
  const mediaClientConfig = {
    authProvider: myAuthProvider,
    initialAuth: myAuth
  }
  const mediaClient = new MediaClient(mediaClientConfig);
  const imageUrl = mediaClient.getImageUrlSync(myFileId, myParams);
  ```

### Patch Changes

- Updated dependencies

## 13.3.1

### Patch Changes

- [#13080](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13080)
  [`f50b26327dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f50b26327dd) - Remove
  Expired check from Media Client

## 13.3.0

### Minor Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`10932f6ae07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10932f6ae07) -
  SPFE-561: Remove the URLSearchParams polyfill

## 13.2.1

### Patch Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`8cba1694b5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cba1694b5e) - Remove
  pollingMaxFailuresExceeded error from implementation and feature flags
- [`50cc05dde71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50cc05dde71) - Mark the
  following members as deprecated:

  - getMediaTypeFromMimeType
  - isImageMimeTypeSupportedByBrowser
  - isDocumentMimeTypeSupportedByBrowser
  - isMimeTypeSupportedByBrowser
  - isImageMimeTypeSupportedByServer
  - isDocumentMimeTypeSupportedByServer
  - isAudioMimeTypeSupportedByServer
  - isVideoMimeTypeSupportedByServer
  - isUnknownMimeTypeSupportedByServer
  - isMimeTypeSupportedByServer

- Updated dependencies

## 13.2.0

### Minor Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`65c76061dc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65c76061dc0) - Verifiy
  token expiration before performing requests or providing URLs

### Patch Changes

- [`78125228ee2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78125228ee2) - Fixed
  token expiration criteria
- [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added
  RxJS compatiblity notice in Media docs
- Updated dependencies

## 13.1.2

### Patch Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`8eefb856389`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8eefb856389) - Added
  emptyItems failReason to media-client

## 13.1.1

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed
  media bundle names following atlassian-frontend linting rules

## 13.1.0

### Minor Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`abc38bc9990`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abc38bc9990) - Added
  request metadata to failed frontend SLIs

## 13.0.1

### Patch Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`d6b31d9713d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6b31d9713d) - Fixed
  uncaught exceptions when uploading MP4/HEVC

## 13.0.0

### Major Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`1a37545d238`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a37545d238) - File
  Fetcher is now emitting errors from upload/copyFile operations from ReplaySubject instead of
  creating an ErrorFileState

### Minor Changes

- [`1d09c9ed549`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d09c9ed549) - refactor
  media-viewer for better analytics and error handling
- [`37d4add135f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37d4add135f) -
  Refactored Media Client Error interface and types
- [`398fee1d575`](https://bitbucket.org/atlassian/atlassian-frontend/commits/398fee1d575) - detect
  zero version (empty) files in media-client, throw FileFetcherError

### Patch Changes

- [`3a350428814`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a350428814) - Moved
  request error reason "clientExhaustedRetries" into an attribute to not obscure original error
- [`ce5671da5e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce5671da5e7) - keep
  media analytics fileAttributes nested in attributes move FileStatus from media-client to
  media-common, maintaing export from media-client
- [`6611b6b3975`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6611b6b3975) - Fixed
  isMediaClientError method to accept any type as input
- Updated dependencies

## 12.4.1

### Patch Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`dfc79cafa6c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfc79cafa6c) - Fixed
  failures on /upload/createWithFiles not aborting upload
- Updated dependencies

## 12.4.0

### Minor Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170)
  [`b37190888c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b37190888c) - ensure
  polling errors trigger more graceful UX
- [`a26afbd493`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a26afbd493) - Added
  getMediaClientFailReason() helper

### Patch Changes

- [`758aa08653`](https://bitbucket.org/atlassian/atlassian-frontend/commits/758aa08653) - Polling
  Fuction throws the inner error instead of wrapping it
- [`7c44d1e585`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c44d1e585) - Fixed
  cards with non web-friendly MP4/MOV videos not mounting
- [`8dfcc55dce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8dfcc55dce) - Refactored
  error enums to be types for code clarity
- Updated dependencies

## 12.3.0

### Minor Changes

- [#6930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6930)
  [`56693486a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56693486a3) - [ux] Rate
  Limited UI for the MediaViewer. Also moved a MediaCard function into MediaClient so that that
  functionality can be used across multiple packages

## 12.2.0

### Minor Changes

- [#6571](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6571)
  [`7736346d88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7736346d88) - Added
  strongly typed errors to Media Client

### Patch Changes

- [`fa5ef18162`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa5ef18162) - Fixed
  media client's DataLoader error handling
- [`11b4fc8033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11b4fc8033) - ensure
  maximum media poll interval ms is 3.3min not 33min

## 12.1.2

### Patch Changes

- [#6521](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6521)
  [`956cf2d5ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/956cf2d5ee) - HOT-93465
  docs(changeset): ensure maximum media poll interval ms is 3.3min not 33min

## 12.1.1

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc
- Updated dependencies

## 12.1.0

### Minor Changes

- [#6228](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6228)
  [`3c263cb2df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c263cb2df) - Added
  error handling when calling media client getCurrentState()

### Patch Changes

- Updated dependencies

## 12.0.0

### Patch Changes

- Updated dependencies

## 11.1.0

### Minor Changes

- [#5516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5516)
  [`3f0dd38c9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f0dd38c9d) - BMPT-626
  Fixed fetching remote preview for non-supported documents in classic Media Card experience

### Patch Changes

- [`bf98a47a0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf98a47a0f) - Enhance
  polling strategy to limit to finite attempts with timing backoff
- Updated dependencies

## 11.0.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.
- Updated dependencies

## 11.0.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated
  to declarative entry points

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [#4769](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4769)
  [`8687140735`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8687140735) - [ux] Fix
  for file processing blocking pages and tickets from saving.

## 10.0.0

### Major Changes

- [#4455](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4455)
  [`2ddfbcd92b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ddfbcd92b) - Removed
  SVG local previews due to XSS vulnerability

## 9.0.3

### Patch Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`1434c4e094`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1434c4e094) - Fixed
  cloud files rendering when publishing page in CF
- [`21b9d3d336`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21b9d3d336) - Fixed
  RAR/non-ZIP files not recognised as archives

## 9.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 9.0.1

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 9.0.0

### Major Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`caf46c7c45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caf46c7c45) - Improved
  remote preview functionality for media-card redesign. Breaking change: renamed type of argument
  "SourceFile" to "CopySourceFile" in the method "copyFile" of media-client.

### Minor Changes

- [`0c1bb3fa88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c1bb3fa88) - Fixed
  mocked response for "/file/copy/withToken" in MediaMock. Added isMediaCollectionItemFullDetails()
  to media-client.
- [`878d4126c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/878d4126c2) - Added mime
  types supported by Media API file preview
- [`02757a0d09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02757a0d09) - Add
  mediaStore instance as an optional dependency of copyFile to avoid calls to constructor inside the
  method
- [`2202870181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2202870181) - Added
  support for zip previews in media viewer
- [`b8695823e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8695823e3) - Fixed
  Giphy images display as plain text when inserted into Editor

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing
  unused code to be published
- [`87459b57ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87459b57ba) - Fixed
  insertion failure of processing file from recent files into Editor
- Updated dependencies

## 8.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`b73317b63c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b73317b63c) - Increased
  polling interval for processing files
- [`4543f920b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4543f920b0) - Disabled
  previews for redesign; fixed not initially showing a doc icon when uploading a document

## 8.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`6658272d94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6658272d94) - Remove
  Promise<string> from FileIdentifier to just be string

  ## Before

  ```
  FileIdentifier {
    id: string | Promise<string>;
  }
  ```

  ## Now

  ```
  FileIdentifier {
    id: string;
  }
  ```

## 6.2.3

### Patch Changes

- [#2979](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2979)
  [`81c6a2fcb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81c6a2fcb2) - Fixed
  potential exception when synchronously accessing uninitialized RxJS subscription.

## 6.2.2

### Patch Changes

- [#2443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2443)
  [`328902687e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/328902687e) - Remove
  stack traces from media analytic events

## 6.2.1

### Patch Changes

- [#2959](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2959)
  [`64e7f3f077`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64e7f3f077) - Bump
  dependency query-string to ^5.1.0

## 6.2.0

### Minor Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`a2ffde361d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2ffde361d) - MPT-131:
  fetch remote preview for files not supported by the browser
- [`928dd60d5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/928dd60d5d) - Add
  optional createdAt property to FileState interface
- [`c3b799c7eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3b799c7eb) - add
  optional createdAt field

### Patch Changes

- [`0eb38a0ebd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0eb38a0ebd) - minor code
  styling changes in media-client
- Updated dependencies

## 6.1.0

### Minor Changes

- [minor][11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):

  Using media api region in analytics events

### Patch Changes

- [patch][5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):

  EDM-475: Handle items call error to prevent error cards-
  [patch][692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):

  Replace Chunkinator-
  [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has
  been superseded by native typescript helper utilities.-
  [patch][fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):

  Fix transition from External to Internal files in Media Viewer-
  [patch][d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):

  Use @atlaskit/media-common- Updated dependencies
  [6a6a991904](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a6a991904):

- Updated dependencies
  [84f82f7015](https://bitbucket.org/atlassian/atlassian-frontend/commits/84f82f7015):
- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [e5c869ee31](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5c869ee31):
- Updated dependencies
  [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies
  [b2402fc3a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2402fc3a2):
- Updated dependencies
  [d38212e1be](https://bitbucket.org/atlassian/atlassian-frontend/commits/d38212e1be):
- Updated dependencies
  [bb2fe95478](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb2fe95478):
- Updated dependencies
  [4aca202534](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aca202534):
- Updated dependencies
  [12112907b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/12112907b5):
- Updated dependencies
  [c28ff17fbd](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28ff17fbd):
- Updated dependencies
  [7e363d5aba](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e363d5aba):
  - @atlaskit/media-test-helpers@27.2.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/button@13.3.10
  - @atlaskit/media-card@67.2.0
  - @atlaskit/media-common@1.0.1
  - @atlaskit/chunkinator@1.1.0

## 6.0.0

### Minor Changes

- [minor][eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):

  - Add MAX_RESOLUTION constant. Can be imported via direct entry point
    `import { MAX_RESOLUTION } from '@atlaskit/media-client/constants';`
  - `Preview` class (`preview` prop in most `FileState`) now has optional field `origin` that can be
    either `local` or `remote`-
    [minor][6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):

  - Added Stargate integration to MediaPicker popup.
  - Added `useMediaPickerPopup` option to Editor which enables using MediaPicker popup even when
    userAuthProvider is not provided.

  ### Using Stargate Integration

  Stargate integration is enabled by default as long as an `userAuthProvider` is not provided to
  `MediaClient`.

  By default it uses the current domain as base URL. If you need to use a different base URL you can
  provide a `stargateBaseUrl` configuration:

  ```
  import { MediaClient } from '@atlaskit/media-client';
  const mediaClient = new MediaClient({ authProvider, stargateBaseUrl: 'http://stargate-url' });
  ```

  _Note_: Editor default behaviour is falling back to native file upload when `userAuthProvider` is
  not provided. In order to avoid that, and being able to use Stargate, you need to set Media option
  `useMediaPickerPopup` to true.

### Patch Changes

- [patch][70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):

  text/plain files now match media api and return a doc mediaType- Updated dependencies
  [9d2da865dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d2da865dd):

- Updated dependencies
  [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies
  [9a93eff8e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a93eff8e6):
- Updated dependencies
  [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies
  [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies
  [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
  - @atlaskit/media-card@67.1.1
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0

## 5.0.2

### Patch Changes

- [patch][b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):

  Emit ErrorFileState when file has failed to upload- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies
  [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies
  [be57ca3829](https://bitbucket.org/atlassian/atlassian-frontend/commits/be57ca3829):
- Updated dependencies
  [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies
  [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies
  [39ee28797d](https://bitbucket.org/atlassian/atlassian-frontend/commits/39ee28797d):
- Updated dependencies
  [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [695e1c1c31](https://bitbucket.org/atlassian/atlassian-frontend/commits/695e1c1c31):
- Updated dependencies
  [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies
  [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/media-card@67.1.0
  - @atlaskit/media-core@31.0.5
  - @atlaskit/button@13.3.9

## 5.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/type-helpers@4.2.3
  - @atlaskit/media-card@67.0.3
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-test-helpers@26.1.1

## 5.0.0

### Major Changes

- [major][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables. For the most part,
  this is just the interface that's being updated, as under the hood ReplaySubject was already
  getting used. ReplaySubjects better suit our use case because they track 1 version of history of
  the file state. As a consumer, there shouldn't be any necessary code changes. ReplaySubjects
  extend Observable, so the current usage should continue to work.

### Patch Changes

- Updated dependencies
  [5504a7da8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/5504a7da8c):
- Updated dependencies
  [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies
  [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-card@67.0.1
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-core@31.0.3

## 4.3.0

### Minor Changes

- [minor][8c7f8fcf92](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f8fcf92):

  Exposes an utilitary function `createFileStateSubject` which can be used to create ReplaySubject
  objects of type FileState

### Patch Changes

- [patch][a47d750b5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/a47d750b5d):

  dont make collection a required param in getAttrsFromUrl - @atlaskit/media-test-helpers@25.2.7

## 4.2.2

### Patch Changes

- Updated dependencies
  [486a5aec29](https://bitbucket.org/atlassian/atlassian-frontend/commits/486a5aec29):
- Updated dependencies
  [03c917044e](https://bitbucket.org/atlassian/atlassian-frontend/commits/03c917044e):
- Updated dependencies
  [d3f4c97f6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3f4c97f6a):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/media-card@67.0.0
  - @atlaskit/button@13.3.5
  - @atlaskit/media-core@31.0.2
  - @atlaskit/media-test-helpers@25.2.6

## 4.2.1

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files

## 4.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  fixed media client retrying aborted request-
  [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  export safeUnsubscribe util to prevent exceptions when unsubscribing from RXJS Subscriptions

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Check if the subscription is defined before calling unsubscribe in utils observableToPromise-
  Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  - @atlaskit/media-card@66.1.2

## 4.1.1

### Patch Changes

- [patch][579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):

  MS-2423 add retries on 5xx errors and network errors to HTTP calls

## 4.1.0

### Minor Changes

- [minor][ed9aafe0e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed9aafe0e2):

  Fix withMediaClient to allow external files to work when mediaClientConfig is not defined

## 4.0.1

### Patch Changes

- [patch][c0da69b4dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0da69b4dc):

  [MS-2626] Fix objectToQueryString when there is an object using null as value

## 4.0.0

### Minor Changes

- [minor][cbe5316ac9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbe5316ac9):

  http failures now return Error instances rather than the Response-
  [minor][51dfee6d35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51dfee6d35):

  Image, Binary and Artifact files will be cached for 30 days

### Patch Changes

- [patch][436b46929e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/436b46929e):

  Removed auth credentials from query params in GET requests. Now they are being sent in the heder
  to help on browser caching.

- Updated dependencies
  [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/media-card@66.0.1
  - @atlaskit/media-core@31.0.0

## 3.0.1

### Patch Changes

- [patch][f1bbcf3847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1bbcf3847):

  dont log id when is not a valid uuid in FileFetcher getFileState

## 3.0.0

### Major Changes

- [major][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of
  "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

- [major][e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):

  ## Breaking change

  > remove Context related method and types from public api in favour of mediaClientConfig

  ### Removed

  ```
  * WithContextOrMediaClientConfig
  * WithContextOrMediaClientConfigProps
  ```

  ### Added

  ```
  * WithMediaClientConfig
  * WithMediaClientConfigProps
  ```

  ### Changed

  **getMediaClient**

  - Before

  > works with passing either mediaClientConfig or context

  ```
  import {getMediaClient} from '@atlaskit/media-client'

  const mediaClientFromMediaClientConfig = getMediaClient({
    mediaClientConfig: {
      authProvider: () => Promise.resolve()
    }
  })

  const mediaClientFromContext = getMediaClient({
    context: {
      authProvider: () => Promise.resolve()
    }
  })
  ```

  - Now

  > only accepts mediaClientConfig as the only param

  ```
  import {getMediaClient} from '@atlaskit/media-client'

  const mediaClient = getMediaClient({
    authProvider: () => Promise.resolve()
  })
  ```

### Minor Changes

- [minor][0b62e854d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b62e854d7):

  New event `media-viewed` with type `UploadEventPayloadMap` is added to `globalMediaEventEmitter`-
  [minor][550d260bfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/550d260bfc):

  Introducing support for alt-text in media.

- Updated dependencies
  [c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):
  - @atlaskit/media-core@30.0.17
  - @atlaskit/media-test-helpers@25.2.0
  - @atlaskit/media-card@66.0.0

## 2.3.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 2.3.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 2.3.0

### Minor Changes

- [minor][65ada7f318](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65ada7f318):

  **FABDODGEM-12 Editor Cashmere Release**

  - [Internal post](http://go.atlassian.com/cashmere-release)

  **Affected editor components:**

  tables, media, mobile, text color, emoji, copy/paste, analytics

  **Performance**

  - Async import for code blocks and task items on renderer
    - https://product-fabric.atlassian.net/browse/ED-7155

  **Table**

  - Add support to sort tables that contains smart links
    - https://product-fabric.atlassian.net/browse/ED-7449
  - Scale table when changing to full width mode
    - https://product-fabric.atlassian.net/browse/ED-7724

  **Text color**

  - Update text color toolbar with right color when text is inside a list, panel, etc.
    - https://product-fabric.atlassian.net/browse/FM-1752

**Mobile** - Implement undo/redo interface on Hybrid Editor -
https://product-fabric.atlassian.net/browse/FM-2393

**Copy and Paste**

    - Support copy & paste when missing context-id attr
      - https://product-fabric.atlassian.net/browse/MS-2344
    - Right click + copy image fails the second time that is pasted
      - https://product-fabric.atlassian.net/browse/MS-2324
    - Copying a never touched image for the first time from editor fails to paste
      - https://product-fabric.atlassian.net/browse/MS-2338
    - Implement analytics when a file is copied
      - https://product-fabric.atlassian.net/browse/MS-2036

**Media**

- Add analytics events and error reporting [NEW BIG FEATURE]
  - https://product-fabric.atlassian.net/browse/MS-2275
  - https://product-fabric.atlassian.net/browse/MS-2329
  - https://product-fabric.atlassian.net/browse/MS-2330
  - https://product-fabric.atlassian.net/browse/MS-2331
  - https://product-fabric.atlassian.net/browse/MS-2332
  - https://product-fabric.atlassian.net/browse/MS-2390
- Fixed issue where we can’t insert same file from MediaPicker twice
  - https://product-fabric.atlassian.net/browse/MS-2080
- Disable upload of external files to media
  - https://product-fabric.atlassian.net/browse/MS-2372

**Notable Bug Fixes**

    - Implement consistent behaviour for rule and mediaSingle on insertion
      - Feature Flag:
        - allowNewInsertionBehaviour - [default: true]
      - https://product-fabric.atlassian.net/browse/ED-7503
    - Fixed bug where we were showing table controls on mobile.
      - https://product-fabric.atlassian.net/browse/ED-7690
    - Fixed bug where editor crashes after unmounting react component.
      - https://product-fabric.atlassian.net/browse/ED-7318
    - Fixed bug where custom emojis are not been showed on the editor
      - https://product-fabric.atlassian.net/browse/ED-7726

- [minor][02dd8e6c76](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02dd8e6c76):

  Add RECENTS_COLLECTION constant with the name of user's recents collection

## 2.2.1

### Patch Changes

- [patch][598fde647a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/598fde647a):

  dont append file attrs to url in Safari

## 2.2.0

### Minor Changes

- [minor][8e6bce4da8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e6bce4da8):

  New fetchMaxRes parameter for getImage method allows to set default download params (4096 width
  and height and 'fit' mode)-
  [minor][d9abdd3030](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9abdd3030):

  Expose url helpers for copy&paste and stringify params

## 2.1.2

- Updated dependencies
  [af72468517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af72468517):
  - @atlaskit/media-core@30.0.14
  - @atlaskit/media-test-helpers@25.1.1
  - @atlaskit/media-card@65.0.0

## 2.1.1

### Patch Changes

- [patch][9c28ef71fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c28ef71fe):

  Add missing peerDependency in package.json

## 2.1.0

### Minor Changes

- [minor][e5c3f6ae3e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5c3f6ae3e):

  ED-6216: External images will now be uploaded to media services if possible

## 2.0.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 2.0.4

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 2.0.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 2.0.2

- Updated dependencies
  [3624730f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3624730f44):
  - @atlaskit/media-core@30.0.11
  - @atlaskit/media-test-helpers@25.0.2
  - @atlaskit/media-card@64.0.0

## 2.0.1

- Updated dependencies
  [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/media-card@63.3.11
  - @atlaskit/media-core@30.0.10
  - @atlaskit/media-test-helpers@25.0.0

## 2.0.0

### Major Changes

- [major][ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):

  Remove getCurrentState method from FileStreamCache

  Before you could do:

  ```
  import {getFileStreamsCache} from '@atlaskit/media-client'

  const currentFileState = await getFileStreamsCache().getCurrentState('some-uuid');
  ```

  That will return the last state from that fileState in a promise rather than having to use
  Observables to subscribe and get the last event.

  Now you could just use the already existing method getCurrentState from mediaClient:

  ```
  import {getMediaClient} from '@atlaskit/media-client';

  const mediaClient = getMediaClient({
    mediaClientConfig: {} // Some MediaClientConfig
  });
  const state = await mediaClient.file.getCurrentState('some-uuid');
  ```

## 1.5.3

### Patch Changes

- [patch][13eed9b89c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13eed9b89c):

  populate media cache when using FileFetcher:copyFile

## 1.5.2

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 1.5.1

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 1.5.0

### Minor Changes

- [minor][60af38e3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60af38e3f7):

  Expose globalMediaEventEmitter to allow consumers to subscribe to global events rather than per
  context/mediaClient instance

  ```
  //
  // BEFORE
  //
  import {ContextFactory} from '@atlaskit/media-core'

  const context = ContextFactory.create();

  // Events happen per instance
  context.on('file-added', ...)

  //
  // NOW
  //

  import {globalMediaEventEmitter} from '@atlaskit/media-client';

  // Context happens globally on any upload. This is needed since there might be multiple mediaClient instances at runtime
  globalMediaEventEmitter.on('file-added', ...);
  ```

## 1.4.0

### Minor Changes

- [minor][02185fba43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02185fba43):

  getMediaClient is now exposed

## 1.3.0

### Minor Changes

- [minor][61ed1951ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61ed1951ce):

  Expose getFileBinaryURL method in mediaClient.file.getFileBinaryURL

## 1.2.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 1.2.0

- [minor][dcda79d48c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dcda79d48c):

  - `withMediaClient` and associated Props are introduced to make possible soft transition from
    Context based media components to Media Client Config ones.

- Updated dependencies
  [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
  - @atlaskit/media-card@63.1.0
  - @atlaskit/media-core@30.0.3
  - @atlaskit/media-test-helpers@24.0.0

## 1.1.5

- [patch][af1cbd4ce4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af1cbd4ce4):

  - Removing unnecessary deps and dev deps in media-core and media-client

## 1.1.4

- [patch][12aa76d5b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12aa76d5b5):

  - ED-6814: fixed rendering mediaSingle without collection

## 1.1.3

- Updated dependencies
  [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
  - @atlaskit/media-card@63.0.2
  - @atlaskit/media-core@30.0.1
  - @atlaskit/media-test-helpers@23.0.0

## 1.1.2

- [patch][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 1.1.1

- [patch][2f58d39758](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f58d39758):

  - Fix problem with double exporting one of the existing items

## 1.1.0

- [minor][8536258182](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8536258182):

  - expose on + off + emit methods on client in order to communicate events with integrators. At
    this point the only emitted event is 'file-added'

## 1.0.0

- [major][e38d662f7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e38d662f7d):

  - Media API Web Client Library initial release. It contains mostly combined code from media-core
    and media-store.

- Updated dependencies
  [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/media-card@61.0.0
  - @atlaskit/media-test-helpers@21.3.0
  - @atlaskit/media-core@29.2.0
