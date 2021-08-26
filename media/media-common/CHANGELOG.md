# @atlaskit/media-common

## 2.9.0

### Minor Changes

- [`46d9d2872b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d9d2872b4) - Video Analytics - Add UI events for CustomMediaPlayer

### Patch Changes

- [`4777a174e6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4777a174e6d) - Added analytics support for customMediaPlayer + screen event + entrypoint for locales
- [`b77bfe8e99c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b77bfe8e99c) - Add performance attributes to Commenced, Succeeded, Failed events for media card
- [`35d85025b4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35d85025b4d) - MEX-860 Changed base track events payload + added CustomMediaPlayerType

## 2.8.0

### Minor Changes

- [`c74e598326e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74e598326e) - Add new members (see below). Extra entry point `mediaTypeUtils` for all of them is added.

  New members:

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

### Patch Changes

- [`8cba1694b5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cba1694b5e) - Remove pollingMaxFailuresExceeded error from implementation and feature flags

## 2.7.0

### Minor Changes

- [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added RxJS compatiblity notice in Media docs

### Patch Changes

- [`6be6879ef6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6be6879ef6d) - Enforce types

## 2.6.2

### Patch Changes

- [`49363db4abf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49363db4abf) - Modify getLocalMediaFeature to accept extra param and add unit tests
- Updated dependencies

## 2.6.1

### Patch Changes

- [`db441ee18c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db441ee18c3) - Handle localStorage and sessionStorage safely

## 2.6.0

### Minor Changes

- [`e5413204ba8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5413204ba8) - Add optional errorDetail to FailAttributes for extra debugging context
- [`b7b0cdea03f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7b0cdea03f) - add generic type for MediaAnalyticsContext<DataType>
- [`f2db5a33953`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2db5a33953) - Added withMediaAnalyticsContext() in media-common for use by media components
- [`ce5671da5e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce5671da5e7) - keep media analytics fileAttributes nested in attributes
  move FileStatus from media-client to media-common, maintaing export from media-client

### Patch Changes

- [`08000e61e72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08000e61e72) - Patched withMediaAnalyticsContext() to accept React refs + minor Analytics types change
- [`bfd3311eb16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfd3311eb16) - Fixed withMediaAnalyticsContext() typing issue
- [`ea425224c8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea425224c8f) - Updated Screen & Operational Event types in media-common
- [`4f1d3a6b22a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f1d3a6b22a) - Refactored Media Analytics Namespaced Context (now delivered by our HOC in media-common)
- [`ed20a0c50b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed20a0c50b0) - Fixed MediaAnalyticsContext to correctly attach static properties
  Made 'attributes' a mandatory member of BaseEventPayload
- Updated dependencies

## 2.5.1

### Patch Changes

- [`ab112f3020`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab112f3020) - Updated media-common analytics exports

## 2.5.0

### Minor Changes

- [`ad2a0e3352`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad2a0e3352) - add common analytics types for media

### Patch Changes

- [`56b5424269`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b5424269) - BMPT-1075 improve media common analytics
- [`b611cc4044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b611cc4044) - improve common generic analytics types
- [`52d4b2cbfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52d4b2cbfb) - Updated media-common analytics types

## 2.4.4

### Patch Changes

- [`91061fed3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91061fed3e) - Updated default values for Polling feature Flags
- [`11b4fc8033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11b4fc8033) - ensure maximum media poll interval ms is 3.3min not 33min

## 2.4.3

### Patch Changes

- [`956cf2d5ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/956cf2d5ee) - HOT-93465 docs(changeset): ensure maximum media poll interval ms is 3.3min not 33min

## 2.4.2

### Patch Changes

- [`0698db3a1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0698db3a1f) - Updated default values for Polling feature Flags

## 2.4.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.4.0

### Minor Changes

- [`f2b871e61d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2b871e61d) - expose NumericalCardDimensions from media-common

## 2.3.0

### Minor Changes

- [`bf98a47a0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf98a47a0f) - Enhance polling strategy to limit to finite attempts with timing backoff
- [`73613210d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73613210d4) - Adding support for Code and Email files so that they are now able to be previewed in the viewer.

## 2.2.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.2.0

### Minor Changes

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

## 2.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.1.0

### Minor Changes

- [`62eb1114c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62eb1114c4) - Enable passing of MediaFeatureFlags through Editor Renderer via MediaOptions to Media components
- [`6faafb144c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faafb144c) - Introduce MediaFeatureFlags. Refactor components to use.
- [`2202870181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2202870181) - Added support for zip previews in media viewer

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`37f235e7f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37f235e7f7) - remove FF override warning for localhost
- [`641c4c54e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/641c4c54e6) - Format comments of getMediaFeatureFlag utility

## 2.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 1.1.0

### Minor Changes

- [`3ae1f77dd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ae1f77dd4) - Expose MediaType from media-common

## 1.0.1

### Patch Changes

- [patch][bb2fe95478](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb2fe95478):

  Create @atlaskit/media-common- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

  - @atlaskit/docs@8.5.1
