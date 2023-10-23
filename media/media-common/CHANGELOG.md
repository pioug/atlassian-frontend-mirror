# @atlaskit/media-common

## 9.0.3

### Patch Changes

- [#41501](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41501) [`b3cb749dc67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3cb749dc67) - Fix TS errors in AFM

## 9.0.2

### Patch Changes

- [#41371](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41371) [`a5766038a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5766038a35) - Fix TS errors in AFM

## 9.0.1

### Patch Changes

- [#39320](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39320) [`ec4867e1376`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec4867e1376) - Removed captions flag and replaced with a new media prop `allowCaptions`. `allowCaptions` is set to `false` by default and products will need to opt in to be able to use captions from now on.

## 9.0.0

### Major Changes

- [#38532](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38532) [`7b6a2c6671b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b6a2c6671b) - Introducing 'media-state' for handling media internal file state.
  Introducing 'media-client-react' to provide hooks for seamless media-client integration with React.
  Introducing 'MediaCardV2' with a feature flag to replace rxjs based fileState subscription with 'useFileState' hook.
  Removed unused feature flags APIs from 'media-client' and its helper functions from 'media-common'.

## 8.2.0

### Minor Changes

- [#39255](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39255) [`ede6ee7aaab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ede6ee7aaab) - Updated tests, examples and moving towards /test-helper export in packages to prevent circular dependancies

## 8.1.0

### Minor Changes

- [#39007](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39007) [`b06cd74349c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b06cd74349c) - # Media Picker

  Make Clipboard secured by adding `container` and `onPaste()` to `config` `prop`. These two params address customer dissatisfaction when attachments are pasted duplicated, or to unwanted Jira issues (https://product-fabric.atlassian.net/browse/MEX-2454).

  Note for migration:
  The added `container` parameter sets a boundary for copy-paste zone. This is to filter out noise from existing practice that is problematic. **To ensure the effectiveness of this fix, please avoid using global `document` as `container` in best effort; please avoid overlapped boundary in best effort**.

  When `container` is not added, the behaviour falls back to legacy mechanism.

  # Media Common

  Add feature toggle (`securedClipboard` in `MediaFeatureFlags`) to control the rollout of Secured Clipboard (https://product-fabric.atlassian.net/browse/MEX-2454).

  # Editor Core

  Add support of the Secured Clipboard (https://product-fabric.atlassian.net/browse/MEX-2454).

  Use feature flag `securedClipboard` to protect such change.

## 8.0.0

### Major Changes

- [#37897](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37897) [`ed81e630547`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed81e630547) - MEX-2089 Remove timestamp feature flag on AFP

## 7.1.0

### Minor Changes

- [#36051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36051) [`9d91eb4b59b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d91eb4b59b) - MEX-2411 Remove Observed Width feature flag

## 7.0.0

### Major Changes

- [#34912](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34912) [`5dcaf51b269`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5dcaf51b269) - Removed memoryCacheLogging feature flag

## 6.0.0

### Major Changes

- [#34887](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34887) [`a425ccdeb0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a425ccdeb0c) - Remove 'newCardExperience' feature flag

## 5.0.0

### Major Changes

- [#34192](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34192) [`e725edbb0d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e725edbb0d9) - Removed feature flag fetchFileStateAfterUpload

## 4.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 4.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 4.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299) [`b37723f2cfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b37723f2cfa) - Removed unused method filterFeatureFlagKeysAllProducts
  Added new method getFeatureFlagKeysAllProducts

### Patch Changes

- [`5859ee7d4e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5859ee7d4e6) - Refactored code for better testing

## 3.0.0

### Major Changes

- [#30248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30248) [`c2bc38829e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2bc38829e1) - Removed mediaUploadApiV2 feature flag (now as a breaking change)

### Minor Changes

- [`8a0a92b2885`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a0a92b2885) - MEX-2210 improve inconsistent behaviour on timestampOnVideo playback

## 2.19.2

### Patch Changes

- Updated dependencies

## 2.19.1

### Patch Changes

- [#29320](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29320) [`9a88e254997`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a88e254997) - Recovered Media Feature Flag mediaUploadApiV2

## 2.19.0

### Minor Changes

- [#28932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28932) [`2b3859896cc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b3859896cc) - Added new Feature Flag to control internal Media Client behaviour

## 2.18.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090) [`81573c1dfa7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81573c1dfa7) - Items call creates a batched metadata trace Id
- [`0bccac57db6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0bccac57db6) - remove mediaUploadApiV2 Feature flag

### Patch Changes

- [`a8eeb045e3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8eeb045e3a) - adding media only callouts to docs
- [`3d40d5e9b37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d40d5e9b37) - Refactor traceId generator getRandomHex function to avoid id collision
- [`10480433c71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10480433c71) - Fix getRandomHex function to mitigate the issue of lacking digits in hex value.

## 2.17.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860) [`2c402e87213`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c402e87213) - [Experimental] Add traceId in media card get image request.

### Patch Changes

- [`19141d537a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19141d537a4) - Removes use of console.info in runtime

## 2.16.4

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710) [`42116304154`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42116304154) - Mocks console when it's not available
- Updated dependencies

## 2.16.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 2.16.2

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004) [`c81ee725277`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c81ee725277) - Add attribute fileMediaType into media viewer loadSucceeded event
- Updated dependencies

## 2.16.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 2.16.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381) [`a332288b5ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a332288b5ea) - Added analytics for media-card memoryCacheLogging and added relevant featureFlag keys for media-common package.

## 2.15.0

### Minor Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029) [`1a76e2839e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a76e2839e6) - Default value for mediaUploadApiV2 Media feature flag set to true.

## 2.14.0

### Minor Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570) [`bfde909c9b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bfde909c9b4) - Add new feature flag mediaUploadApiV2
- [`8d6064cece4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d6064cece4) - Add missing values for the launch darkly feature flags name

## 2.13.0

### Minor Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721) [`501240ef964`](https://bitbucket.org/atlassian/atlassian-frontend/commits/501240ef964) - Export `filterFeatureFlagKeysAllProducts`
- [`a09f961b9b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a09f961b9b2) - Add filterFeatureFlagNamesWithAllProducts for returning the feature flags for all the products
- [`a4f822c2d5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4f822c2d5d) - Add MediaFeatureFlagMap for Confluence and Jira

## 2.12.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 2.12.0

### Minor Changes

- [#20033](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20033) [`bac667f95d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bac667f95d5) - Export utility filterFeatureFlagNames and type RequiredMediaFeatureFlags

## 2.11.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019) [`8742dbe70bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8742dbe70bd) - MEX-1102 Removed lodash dependencies from media component and converted all to local functions (lightweight helpers)

## 2.10.3

### Patch Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526) [`5293a48368e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5293a48368e) - fix image size in layout with ref and width observer

## 2.10.2

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752) [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Switched as false default value for FF "Timestamp on video"
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Adding a feature flag for TimestampOnVideo

## 2.10.1

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475) [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 2.10.0

### Minor Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998) [`f461edcfd05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f461edcfd05) - Added a comparer helper for Media Feature Flags objects

### Patch Changes

- [`fc70978492a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc70978492a) - Using type for SSR prop to reduce dependency on media-common
- [`2b24fcc59f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b24fcc59f2) - Removed Code Viewer and Zip Previews Feature Flags
- [`f461edcfd05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f461edcfd05) - Update CardLoader to use react-loadable
  Add SSR feature prop to be passed in renderer and media card
- [`01a41e75803`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01a41e75803) - Removes `allowMediaInline` media prop and replaces with Inline Files feature flag for editor and mobile bridge

## 2.9.1

### Patch Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777) [`fe9ced0cd70`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe9ced0cd70) - Removed feature flags for polling settings

## 2.9.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864) [`46d9d2872b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d9d2872b4) - Video Analytics - Add UI events for CustomMediaPlayer

### Patch Changes

- [`4777a174e6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4777a174e6d) - Added analytics support for customMediaPlayer + screen event + entrypoint for locales
- [`b77bfe8e99c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b77bfe8e99c) - Add performance attributes to Commenced, Succeeded, Failed events for media card
- [`35d85025b4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35d85025b4d) - MEX-860 Changed base track events payload + added CustomMediaPlayerType

## 2.8.0

### Minor Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649) [`c74e598326e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74e598326e) - Add new members (see below). Extra entry point `mediaTypeUtils` for all of them is added.

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

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113) [`3cd9ee2d15b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cd9ee2d15b) - Added RxJS compatiblity notice in Media docs

### Patch Changes

- [`6be6879ef6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6be6879ef6d) - Enforce types

## 2.6.2

### Patch Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569) [`49363db4abf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49363db4abf) - Modify getLocalMediaFeature to accept extra param and add unit tests
- Updated dependencies

## 2.6.1

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230) [`db441ee18c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db441ee18c3) - Handle localStorage and sessionStorage safely

## 2.6.0

### Minor Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644) [`e5413204ba8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5413204ba8) - Add optional errorDetail to FailAttributes for extra debugging context
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

- [#7425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7425) [`ab112f3020`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab112f3020) - Updated media-common analytics exports

## 2.5.0

### Minor Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170) [`ad2a0e3352`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad2a0e3352) - add common analytics types for media

### Patch Changes

- [`56b5424269`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b5424269) - BMPT-1075 improve media common analytics
- [`b611cc4044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b611cc4044) - improve common generic analytics types
- [`52d4b2cbfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52d4b2cbfb) - Updated media-common analytics types

## 2.4.4

### Patch Changes

- [#6571](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6571) [`91061fed3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91061fed3e) - Updated default values for Polling feature Flags
- [`11b4fc8033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11b4fc8033) - ensure maximum media poll interval ms is 3.3min not 33min

## 2.4.3

### Patch Changes

- [#6521](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6521) [`956cf2d5ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/956cf2d5ee) - HOT-93465 docs(changeset): ensure maximum media poll interval ms is 3.3min not 33min

## 2.4.2

### Patch Changes

- [#6478](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6478) [`0698db3a1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0698db3a1f) - Updated default values for Polling feature Flags

## 2.4.1

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.4.0

### Minor Changes

- [#6228](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6228) [`f2b871e61d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2b871e61d) - expose NumericalCardDimensions from media-common

## 2.3.0

### Minor Changes

- [#5516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5516) [`bf98a47a0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf98a47a0f) - Enhance polling strategy to limit to finite attempts with timing backoff
- [`73613210d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73613210d4) - Adding support for Code and Email files so that they are now able to be previewed in the viewer.

## 2.2.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.2.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749) [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

## 2.1.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.1.0

### Minor Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823) [`62eb1114c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62eb1114c4) - Enable passing of MediaFeatureFlags through Editor Renderer via MediaOptions to Media components
- [`6faafb144c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faafb144c) - Introduce MediaFeatureFlags. Refactor components to use.
- [`2202870181`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2202870181) - Added support for zip previews in media viewer

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`37f235e7f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37f235e7f7) - remove FF override warning for localhost
- [`641c4c54e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/641c4c54e6) - Format comments of getMediaFeatureFlag utility

## 2.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 1.1.0

### Minor Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137) [`3ae1f77dd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ae1f77dd4) - Expose MediaType from media-common

## 1.0.1

### Patch Changes

- [patch][bb2fe95478](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb2fe95478):

  Create @atlaskit/media-common- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

  - @atlaskit/docs@8.5.1
