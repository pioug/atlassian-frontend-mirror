# @atlaskit/media-image

## 20.0.5

### Patch Changes

- Updated dependencies

## 20.0.4

### Patch Changes

- Updated dependencies

## 20.0.3

### Patch Changes

- Updated dependencies

## 20.0.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 20.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 20.0.0

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

## 19.4.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

## 19.3.1

### Patch Changes

- Updated dependencies

## 19.3.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 19.2.3

### Patch Changes

- Updated dependencies

## 19.2.2

### Patch Changes

- Updated dependencies

## 19.2.1

### Patch Changes

- [#103673](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103673)
  [`41cc17bdee600`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/41cc17bdee600) -
  Replaced feature gate "platform_media_copy_and_paste_v2" with "platform_media_cross_client_copy"
  to avoid releasing to users with broken versions in cache
- Updated dependencies

## 19.2.0

### Minor Changes

- [#98696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98696)
  [`396ff0958321d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/396ff0958321d) -
  Adding the ability to register copy intents to enable cross site / product copy and paste for
  media by forwarding the ref from useCopyIntent / useFilePreview

### Patch Changes

- Updated dependencies

## 19.1.3

### Patch Changes

- Updated dependencies

## 19.1.2

### Patch Changes

- Updated dependencies

## 19.1.1

### Patch Changes

- Updated dependencies

## 19.1.0

### Minor Changes

- [#130435](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130435)
  [`c3ee11ca89274`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3ee11ca89274) -
  add React 18 support

### Patch Changes

- Updated dependencies

## 19.0.4

### Patch Changes

- Updated dependencies

## 19.0.3

### Patch Changes

- [#126802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126802)
  [`75d18a17584f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/75d18a17584f4) -
  Replaced custom error boundary with react-error-boundary

## 19.0.2

### Patch Changes

- Updated dependencies

## 19.0.1

### Patch Changes

- [#108139](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108139)
  [`9ffe339502dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ffe339502dc) -
  Exported MediaImageChildrenProps type

## 19.0.0

### Major Changes

- [#100564](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100564)
  [`bb41a6b29013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bb41a6b29013) -
  This update brings major internal changes that could cause unexpected issues, such as broken
  tests. If you encounter any problems, please reach out to #help-media-platform

## 18.1.1

### Patch Changes

- Updated dependencies

## 18.1.0

### Minor Changes

- [#91499](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91499)
  [`249d6d1c9db7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/249d6d1c9db7) -
  Cleaned up media imagev2 feature flag

## 18.0.7

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 18.0.6

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 18.0.5

### Patch Changes

- Updated dependencies

## 18.0.4

### Patch Changes

- Updated dependencies

## 18.0.3

### Patch Changes

- [#70034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70034)
  [`0cf829b2ca1f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0cf829b2ca1f) -
  Updated prop names from Preview Hook
- Updated dependencies

## 18.0.2

### Patch Changes

- Updated dependencies

## 18.0.1

### Patch Changes

- [#65749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65749)
  [`1b2e73df14b4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b2e73df14b4) -
  Updated Preview Hook usage
- Updated dependencies

## 18.0.0

### Major Changes

- [#63829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63829)
  [`572ec913a0ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/572ec913a0ae) -
  Fixed the `MediaImageProps` type to be semantically correct. Previously, the accepted prop type of
  the `MediaImage` component and the exported `MediaImageProps` type was inconsistent since
  `MediaImageProps` had an additional `mediaClient` property. This inconsistency was fixed such that
  the additional property was removed. Consequently, the `MediaImageProps` type accurately reflects
  the type of props that `MediaImage` actually accepts.

  This should not require any changes for consumers since a `mediaClient` could not actually be
  passed to the `MediaImage` component. If one was to be using the `mediaClient` property of
  `MediaImageProps`, please use `mediaClientConfig` instead.

### Minor Changes

- [#64371](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64371)
  [`1a8b5d9880dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a8b5d9880dd) -
  Added an optional `ssr` property to MediaInline props. This prop enables SSR support in
  MediaInline version V2 (which is still in development) and will make no difference for the current
  version of MediaInline.

## 17.4.12

### Patch Changes

- [#63417](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63417)
  [`8b146c6cdeff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b146c6cdeff) -
  Removed async loader from MediaImageV2

## 17.4.11

### Patch Changes

- [#61636](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61636)
  [`c15983092689`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c15983092689) -
  Updates to Media Image V2: Converted MediaImageV2 to a functional component that is integrated
  with the `useFilePreview` hook and an SSR compatiable loader.

## 17.4.10

### Patch Changes

- [#59476](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59476)
  [`719cd6fb0bc0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/719cd6fb0bc0) -
  Duplicated MediaImage to provide a V2 version that will include refactors in the future

## 17.4.9

### Patch Changes

- Updated dependencies

## 17.4.8

### Patch Changes

- Updated dependencies

## 17.4.7

### Patch Changes

- [#41659](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41659)
  [`a0c97a19dba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0c97a19dba) - Remove
  unused utils and depreciated exports in mediaClient.
- Updated dependencies

## 17.4.6

### Patch Changes

- Updated dependencies

## 17.4.5

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 17.4.4

### Patch Changes

- [#33728](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33728)
  [`48e4a655534`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48e4a655534) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 17.4.3

### Patch Changes

- Updated dependencies

## 17.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 17.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 17.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 17.3.2

### Patch Changes

- Updated dependencies

## 17.3.1

### Patch Changes

- Updated dependencies

## 17.3.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`79660ee4fa7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79660ee4fa7) -
  Restructured the Media-Image and added CSS to make doc responsive.

### Patch Changes

- Updated dependencies

## 17.2.7

### Patch Changes

- Updated dependencies

## 17.2.6

### Patch Changes

- Updated dependencies

## 17.2.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 17.2.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 17.2.3

### Patch Changes

- Updated dependencies

## 17.2.2

### Patch Changes

- Updated dependencies

## 17.2.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 17.2.0

### Minor Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`f862d5ae7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f862d5ae7aa) - remove
  RxJs peer dependency
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

### Patch Changes

- Updated dependencies

## 17.1.9

### Patch Changes

- Updated dependencies

## 17.1.8

### Patch Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`6810728cd53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6810728cd53) - Ehance
  test for new auth provider in media-image to prevent re-subscription
- [`0b201786d9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b201786d9c) - Render
  children as loading for media-image loader while fetching bundle
- Updated dependencies

## 17.1.7

### Patch Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added
  RxJS compatiblity notice in Media docs
- Updated dependencies

## 17.1.6

### Patch Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`17b0f1123c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17b0f1123c6) - Update
  media-image package.json with correct description

## 17.1.5

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed
  media bundle names following atlassian-frontend linting rules

## 17.1.4

### Patch Changes

- Updated dependencies

## 17.1.3

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 17.1.2

### Patch Changes

- Updated dependencies

## 17.1.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 17.1.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated
  to declarative entry points

### Patch Changes

- Updated dependencies

## 17.0.4

### Patch Changes

- Updated dependencies

## 17.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 17.0.2

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393)
  [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump
  required because of conflicts on wadmal release

## 17.0.1

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing
  unused code to be published
- Updated dependencies

## 17.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 16.0.2

### Patch Changes

- Updated dependencies

## 16.0.1

### Patch Changes

- [#2443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2443)
  [`51aa5587ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51aa5587ef) - bump
  media-client: Remove stack traces from media analytic events

## 16.0.0

### Major Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`db7a864f43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db7a864f43) - Using Lazy
  Load in MediaImage component

### Patch Changes

- [`a2ffde361d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2ffde361d) - MPT-131:
  fetch remote preview for files not supported by the browser
- Updated dependencies

## 15.0.7

### Patch Changes

- Updated dependencies
  [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):
- Updated dependencies
  [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies
  [d49ebd7c7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/d49ebd7c7a):
- Updated dependencies
  [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies
  [3cbc8a49a2](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbc8a49a2):
  - @atlaskit/media-client@6.0.0
  - @atlaskit/media-test-helpers@27.1.0
  - @atlaskit/docs@8.5.0

## 15.0.6

### Patch Changes

- Updated dependencies
  [b408e050ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/b408e050ab):
- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies
  [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies
  [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies
  [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies
  [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
  - @atlaskit/media-client@5.0.2
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/field-text@10.0.2
  - @atlaskit/select@11.0.9
  - @atlaskit/spinner@12.1.6

## 15.0.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/field-text@10.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-test-helpers@26.1.1

## 15.0.4

### Patch Changes

- Updated dependencies
  [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/field-text@10.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/select@11.0.6

## 15.0.3

### Patch Changes

- [patch][6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):

  Stream caches in media-client now use ReplaySubjects instead of Observables. For the most part,
  this is just the interface that's being updated, as under the hood ReplaySubject was already
  getting used. ReplaySubjects better suit our use case because they track 1 version of history of
  the file state. As a consumer, there shouldn't be any necessary code changes. ReplaySubjects
  extend Observable, so the current usage should continue to work.- Updated dependencies
  [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):

- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies
  [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-client@5.0.0

## 15.0.2

- Updated dependencies
  [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/media-test-helpers@25.2.3
  - @atlaskit/select@11.0.0

## 15.0.1

- Updated dependencies
  [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-test-helpers@25.2.2

## 15.0.0

### Major Changes

- [major][c3e65f1b9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e65f1b9e):

  ## Breaking change

  > remove deprecated "context" property from media components in favor of "mediaClientConfig"

  This affects all public media UI components:

  - Card
  - Filmstrip
  - SmartMediaEditor
  - MediaImage
  - Dropzone
  - Clipboard
  - Browser
  - MediaPicker
  - MediaViewer

  **Before**:

  ```
  import {ContextFactory} from '@atlaskit/media-core';
  import {Card} from '@atlaskit/media-card'
  import {SmartMediaEditor} from '@atlaskit/media-editor'
  import {Filmstrip} from '@atlaskit/media-filmstrip'
  import {MediaImage} from '@atlaskit/media-image'
  import {MediaViewer} from '@atlaskit/media-viewer'
  import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';

  const context = ContextFactory.creat({
    authProvider: () => Promise.resolve({})
  })

  const mediaPicker = MediaPicker(context);

  <Card context={context}>
  <SmartMediaEditor context={context}>
  <Filmstrip context={context}>
  <MediaImage context={context}>
  <Dropzone context={context}>
  <Clipboard context={context}>
  <Browser context={context}>
  <MediaViewer context={context}>
  ```

  **Now**:

  ```
  import {MediaClientConfig} from '@atlaskit/media-core';
  import {Card} from '@atlaskit/media-card'
  import {SmartMediaEditor} from '@atlaskit/media-editor'
  import {Filmstrip} from '@atlaskit/media-filmstrip'
  import {MediaImage} from '@atlaskit/media-image'
  import {MediaViewer} from '@atlaskit/media-viewer'
  import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';
  ```

const mediaClientConfig: MediaClientConfig = { authProvider: () => Promise.resolve({}) }

const mediaPicker = MediaPicker(mediaClientConfig);

  <Card mediaClientConfig={mediaClientConfig}>
  <SmartMediaEditor mediaClientConfig={mediaClientConfig}>
  <Filmstrip mediaClientConfig={mediaClientConfig}>
  <MediaImage mediaClientConfig={mediaClientConfig}>
  <Dropzone mediaClientConfig={mediaClientConfig}>
  <Clipboard mediaClientConfig={mediaClientConfig}>
  <Browser mediaClientConfig={mediaClientConfig}>
  <MediaViewer mediaClientConfig={mediaClientConfig}>
  ```

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

- Updated dependencies
  [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
- @atlaskit/media-store@12.0.14
- @atlaskit/media-test-helpers@25.2.0
- @atlaskit/media-client@3.0.0

## 14.2.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 14.2.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 14.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

More information about the deprecation of lifecycles methods can be found here:
https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 14.1.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative
imports as relative imports

## 14.1.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

Upgraded Typescript to 3.3.x

## 14.1.5

- Updated dependencies
  [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
- @atlaskit/media-client@2.0.1
- @atlaskit/media-store@12.0.8
- @atlaskit/media-test-helpers@25.0.0

## 14.1.4

- Updated dependencies
  [ee804f3eeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee804f3eeb):
- @atlaskit/media-store@12.0.6
- @atlaskit/media-test-helpers@24.3.5
- @atlaskit/media-client@2.0.0

## 14.1.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

bugfix, fixes missing version.json file

## 14.1.2

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

## 14.1.1

- Updated dependencies
  [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
- @atlaskit/media-test-helpers@24.3.1
- @atlaskit/select@10.0.0

## 14.1.0

### Minor Changes

- [minor][2eeb3f4eb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2eeb3f4eb8):

- You can supply mediaClientConfig instead of Context to MediaImage component. Soon Context input
  will be deprecated and removed.

## 14.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

- This is just a safety release in case anything strange happened in in the previous one. See Pull
  Request #5942 for details

## 14.0.2

- Updated dependencies
  [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies
  [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
- @atlaskit/select@9.1.2
- @atlaskit/spinner@12.0.0
- @atlaskit/media-core@30.0.3
- @atlaskit/media-store@12.0.2
- @atlaskit/media-test-helpers@24.0.0

## 14.0.1

- Updated dependencies
  [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
- @atlaskit/media-core@30.0.1
- @atlaskit/media-store@12.0.1
- @atlaskit/media-test-helpers@23.0.0

## 14.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

- Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this
  package, please ensure you use at least this version of react and react-dom.

- Updated dependencies
  [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
- @atlaskit/docs@8.0.0
- @atlaskit/field-text@9.0.0
- @atlaskit/select@9.0.0
- @atlaskit/spinner@11.0.0
- @atlaskit/theme@9.0.0
- @atlaskit/media-core@30.0.0
- @atlaskit/media-store@12.0.0
- @atlaskit/media-test-helpers@22.0.0

## 13.0.0

- Updated dependencies
  [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
- @atlaskit/media-store@11.1.1
- @atlaskit/media-test-helpers@21.4.0
- @atlaskit/media-core@29.3.0

## 12.0.0

- Updated dependencies
  [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
- @atlaskit/media-store@11.1.0
- @atlaskit/media-test-helpers@21.3.0
- @atlaskit/media-core@29.2.0

## 11.0.3

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

- Bump tslib

## 11.0.2

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
- @atlaskit/docs@7.0.3
- @atlaskit/field-text@8.0.3
- @atlaskit/select@8.1.1
- @atlaskit/spinner@10.0.7
- @atlaskit/theme@8.1.7

## 11.0.1

- [patch][ba94afcac3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba94afcac3):

- updating media image when context changes

## 11.0.0

- Updated dependencies
  [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
- @atlaskit/media-store@11.0.3
- @atlaskit/media-test-helpers@21.1.0
- @atlaskit/media-core@29.1.0

## 10.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

- Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 10.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

- Dropped ES5 distributables from the typescript packages

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
- @atlaskit/docs@7.0.1
- @atlaskit/field-text@8.0.1
- @atlaskit/select@8.0.3
- @atlaskit/spinner@10.0.1
- @atlaskit/theme@8.0.1
- @atlaskit/media-core@29.0.0
- @atlaskit/media-store@11.0.0
- @atlaskit/media-test-helpers@21.0.0

## 9.0.0

- Updated dependencies
  [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
- @atlaskit/media-test-helpers@20.1.8
- @atlaskit/media-core@28.0.0
- @atlaskit/media-store@10.0.0

## 8.0.1

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
- @atlaskit/media-core@27.2.3
- @atlaskit/media-store@9.2.1
- @atlaskit/media-test-helpers@20.1.7
- @atlaskit/docs@7.0.0
- @atlaskit/field-text@8.0.0
- @atlaskit/select@8.0.0
- @atlaskit/spinner@10.0.0
- @atlaskit/theme@8.0.0

## 8.0.0

- [major][25952eca2f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25952eca2f):

- Adding upgrade guide docs to help consumers with the major bump

## 7.0.10

- [patch][f84de3bf0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f84de3bf0b):

- Adding collection as optional parameter

## 7.0.9

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

- MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 7.0.8

- Updated dependencies
  [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
- @atlaskit/media-test-helpers@20.1.0
- @atlaskit/media-core@27.0.0

## 7.0.7

- Updated dependencies
  [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
- @atlaskit/media-core@26.2.1
- @atlaskit/media-test-helpers@20.0.0

## 7.0.6

- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
- @atlaskit/media-core@26.1.0
- @atlaskit/media-test-helpers@19.0.0

## 7.0.5

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
- @atlaskit/media-test-helpers@18.9.1
- @atlaskit/media-core@26.0.0

## 7.0.4

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
- @atlaskit/media-core@25.0.0
- @atlaskit/media-test-helpers@18.9.0

## 7.0.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
- @atlaskit/field-text@7.0.18
- @atlaskit/media-core@24.5.2
- @atlaskit/docs@6.0.0

## 7.0.2

- [patch] Updated dependencies
  [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
- @atlaskit/media-core@24.0.0
- @atlaskit/media-test-helpers@18.0.0

## 7.0.1

- [patch] Updated dependencies
  [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
- @atlaskit/media-test-helpers@17.0.0
- @atlaskit/media-core@23.0.2

## 7.0.0

- [major] Synchronous property "serviceHost" as part of many Interfaces in media components (like
  MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object.
  [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [major] Updated dependencies
  [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- @atlaskit/media-test-helpers@16.0.0
- @atlaskit/media-core@23.0.0

## 6.0.1

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
- @atlaskit/media-core@22.2.1
- @atlaskit/media-test-helpers@15.2.1
- @atlaskit/field-text@7.0.3

## 6.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- @atlaskit/field-text@7.0.0
- @atlaskit/media-core@22.0.0
- @atlaskit/media-test-helpers@15.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- @atlaskit/media-test-helpers@15.0.0
- @atlaskit/media-core@22.0.0
- @atlaskit/field-text@7.0.0

## 5.0.12

- [patch] Updated dependencies
  [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
- @atlaskit/media-test-helpers@14.0.6
- @atlaskit/media-core@21.0.0

## 5.0.11

- [patch] Updated dependencies
  [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
- @atlaskit/media-test-helpers@14.0.4
- @atlaskit/media-core@20.0.0

## 5.0.10

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- @atlaskit/media-test-helpers@14.0.3
- @atlaskit/media-core@19.1.3
- @atlaskit/field-text@6.0.4

## 5.0.9

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- @atlaskit/media-test-helpers@14.0.2
- @atlaskit/media-core@19.1.2

## 5.0.8

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
- @atlaskit/media-core@19.1.1
- @atlaskit/media-test-helpers@14.0.1
- @atlaskit/field-text@6.0.2

## 5.0.7

- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- @atlaskit/media-test-helpers@14.0.0
- @atlaskit/media-core@19.0.0
- @atlaskit/field-text@6.0.0

## 5.0.6

- [patch] Updated dependencies
  [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
- @atlaskit/media-core@18.1.2

## 5.0.5

- [patch] Updated dependencies
  [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
- @atlaskit/media-core@18.1.1
- @atlaskit/media-test-helpers@13.0.1

## 5.0.4

- [patch] Updated dependencies
  [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
- @atlaskit/media-test-helpers@13.0.0
- @atlaskit/media-core@18.1.0
- [patch] Updated dependencies
  [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
- @atlaskit/media-test-helpers@13.0.0
- @atlaskit/media-core@18.1.0

## 5.0.3

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
- @atlaskit/field-text@5.0.3
- @atlaskit/media-test-helpers@12.0.4
- @atlaskit/media-core@18.0.3

## 5.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 4.0.6

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake
  [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 3.0.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.3.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.2.3

- [patch] Update dependencies
  [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 2.1.1 (2017-09-18)

- bug fix; update media-core and media-test-helpers version
  ([00108cf](https://bitbucket.org/atlassian/atlaskit/commits/00108cf))

## 2.1.0 (2017-08-11)

- feature; bump :allthethings: ([f4b1375](https://bitbucket.org/atlassian/atlaskit/commits/f4b1375))

## 2.0.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 1.0.0 (2017-06-07)

- feature; fix imgSrc property ([d2274ce](https://bitbucket.org/atlassian/atlaskit/commits/d2274ce))
- feature; mediaImage component skeleton
  ([5dd2f84](https://bitbucket.org/atlassian/atlaskit/commits/5dd2f84))

```

```
