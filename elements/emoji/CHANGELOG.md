# @atlaskit/emoji

## 63.1.8

### Patch Changes

- [`12ab65f8153`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12ab65f8153) - Disabling flaky test
- Updated dependencies

## 63.1.7

### Patch Changes

- [`252a76e7f61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/252a76e7f61) - Updated comment reference to moved xregexp-transformer package

## 63.1.6

### Patch Changes

- [`81c07c8a095`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81c07c8a095) - AK-340: add screen reader description text to the Choose custom emoji button
- [`6f94f8032cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f94f8032cd) - AK-95: fetch emoji as images in order to fix Windows High Contrast mode issues
- [`e7d86570528`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7d86570528) - AK-110, Emoji picker: make skin tone selection accessible for screen-reader and keyboard users
- Updated dependencies

## 63.1.5

### Patch Changes

- [`351177c316c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/351177c316c) - Emoji component: add aria-label attr to the Search Emoji input field
- [`10932f6ae07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10932f6ae07) - SPFE-561: Remove the URLSearchParams polyfill
- Updated dependencies

## 63.1.4

### Patch Changes

- [`2c076bc792a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c076bc792a) - Update internal component usage

## 63.1.3

### Patch Changes

- [`6c5df7efe3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c5df7efe3d) - ED-11854 Improve localStorage detection
- Updated dependencies

## 63.1.2

### Patch Changes

- Updated dependencies

## 63.1.1

### Patch Changes

- [`18820a0a9a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18820a0a9a1) - Internal changes to break up internal component structure of EmojiPicker
- Updated dependencies

## 63.1.0

### Minor Changes

- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations

## 63.0.13

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 63.0.12

### Patch Changes

- Updated dependencies

## 63.0.11

### Patch Changes

- [`401be935e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/401be935e9) - Fix bug with emoji category selector not working inside forms
- Updated dependencies

## 63.0.10

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 63.0.9

### Patch Changes

- Updated dependencies

## 63.0.8

### Patch Changes

- [`c0533f4b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0533f4b35) - Upgrade analytics-next to prevent event loss (https://hello.atlassian.net/wiki/spaces/AFP/blog/2020/08/26/828144759/ACTION+REQUIRED+-+upgrade+analytics-next+to+prevent+event+loss)
- Updated dependencies

## 63.0.7

### Patch Changes

- [`bee2157c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bee2157c1b) - Remove usage of @atlaskit/util-common-test package

## 63.0.6

### Patch Changes

- Updated dependencies

## 63.0.5

### Patch Changes

- Updated dependencies

## 63.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 63.0.3

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 63.0.2

### Patch Changes

- Updated dependencies

## 63.0.1

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 63.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 62.8.4

### Patch Changes

- Updated dependencies

## 62.8.3

### Patch Changes

- Updated dependencies

## 62.8.2

### Patch Changes

- [`fc83c36503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc83c36503) - Update translation files via Traduki build

## 62.8.1

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- Updated dependencies

## 62.8.0

### Minor Changes

- [`7d80e07781`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e07781) - ED-9040 Add class to image emojis so they can be distinguished from sprite emojis in the DOM

### Patch Changes

- Updated dependencies

## 62.7.2

### Patch Changes

- [patch][f5dcc0bc6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5dcc0bc6a):

  added retries on 404 errors when fetching emoji from media- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [7e26fba915](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e26fba915):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [5f8e3caf72](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f8e3caf72):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [692692ba24](https://bitbucket.org/atlassian/atlassian-frontend/commits/692692ba24):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [823d80f31c](https://bitbucket.org/atlassian/atlassian-frontend/commits/823d80f31c):
- Updated dependencies [fd782b0705](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd782b0705):
- Updated dependencies [d80b8e8fdb](https://bitbucket.org/atlassian/atlassian-frontend/commits/d80b8e8fdb):
- Updated dependencies [3644fc1afe](https://bitbucket.org/atlassian/atlassian-frontend/commits/3644fc1afe):
- Updated dependencies [62f1f218d9](https://bitbucket.org/atlassian/atlassian-frontend/commits/62f1f218d9):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
  - @atlaskit/docs@8.5.1
  - @atlaskit/editor-test-helpers@11.1.0
  - @atlaskit/theme@9.5.3
  - @atlaskit/media-client@6.1.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 62.7.1

### Patch Changes

- [patch][8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):

  Measure failures and successes in inserting emoji- Updated dependencies [eb962d2c36](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb962d2c36):

- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):
- Updated dependencies [70b68943d1](https://bitbucket.org/atlassian/atlassian-frontend/commits/70b68943d1):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [6dcad31e41](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dcad31e41):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
  - @atlaskit/media-client@6.0.0
  - @atlaskit/layer@8.0.2
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/media-core@31.1.0
  - @atlaskit/docs@8.5.0

## 62.7.0

### Minor Changes

- [minor][a065689858](https://bitbucket.org/atlassian/atlassian-frontend/commits/a065689858):

  ED-8689: fixed creation of onClick for every render() of CategorySelector

### Patch Changes

- Updated dependencies [9d6b02c04f](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d6b02c04f):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/editor-test-helpers@10.6.0
  - @atlaskit/icon@20.0.2

## 62.6.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/field-base@14.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/layer@8.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/elements-test-helpers@0.6.7
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/util-service-support@5.0.1
  - @atlaskit/media-client@5.0.1
  - @atlaskit/media-core@31.0.4

## 62.6.2

### Patch Changes

- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/layer@8.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 62.6.1

### Patch Changes

- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [cfcd27b2e4](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcd27b2e4):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
- Updated dependencies [ec929ab10e](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec929ab10e):
  - @atlaskit/docs@8.3.0
  - @atlaskit/editor-test-helpers@10.4.3
  - @atlaskit/media-client@5.0.0
  - @atlaskit/media-core@31.0.3

## 62.6.0

### Minor Changes

- [minor][2d1aee3e47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d1aee3e47):

  EmojiProvider and UploadingEmojiProvider can be consumed directly from `@atlaskit/emoji/types` entrypoint

### Patch Changes

- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [579779f5aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/579779f5aa):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/icon@19.0.11
  - @atlaskit/media-client@4.1.1
  - @atlaskit/theme@9.3.0
  - @atlaskit/editor-test-helpers@10.3.0

## 62.5.6

### Patch Changes

- [patch][88e1e909ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/88e1e909ac):

  ED-7487: Ensure EmojiPickerList scrolls in Safari

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/editor-test-helpers@10.1.3
  - @atlaskit/media-client@4.0.0
  - @atlaskit/media-core@31.0.0

## 62.5.5

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/util-data-test@13.0.1
  - @atlaskit/util-service-support@5.0.0

## 62.5.4

### Patch Changes

- [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of "mediaClientConfig". This affects all public media UI components.
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

- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [e7b5c917de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7b5c917de):
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/media-core@30.0.17
  - @atlaskit/media-client@3.0.0

## 62.5.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 62.5.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 62.5.1

- Updated dependencies [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/editor-test-helpers@10.0.0

## 62.5.0

### Minor Changes

- [minor][8b73f10071](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b73f10071):

  fixed emoji CDN urls to ddev and re-enabled VR tests

## 62.4.1

### Patch Changes

- [patch][c2ffd0a09a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2ffd0a09a):

  ED-7682: Fixes copy and pasting a media based emoji from renderer to editor, provide an ID on the image tag.

## 62.4.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 62.3.4

### Patch Changes

- [patch][3797db3796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3797db3796):

  ED-7513: fixed pasting content with an emoji duplicates the emoji as an image in Editor

## 62.3.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 62.3.2

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 62.3.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 62.3.0

### Minor Changes

- [minor][66c5c88f4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c5c88f4a):

  Refactor emoji to use typeahead plugin

## 62.2.11

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 62.2.10

### Patch Changes

- [patch][f171f08d59](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f171f08d59):

  Switch from Media's Context to Media's MediaClient

## 62.2.9

### Patch Changes

- [patch][af6787c63d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af6787c63d):

  Export EmojiTypeAheadList from @atlaskit/emoji/typeahead

## 62.2.8

### Patch Changes

- [patch][6785d8d4e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6785d8d4e4):

  Move @types/js-search from dependencies to devDependencies.

## 62.2.7

### Patch Changes

- [patch][43f66019ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43f66019ee):

  Updates dependency on p-wait-for

## 62.2.6

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 62.2.5

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 62.2.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 62.2.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 62.2.2

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 62.2.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/field-base@13.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/icon@19.0.0

## 62.2.0

### Minor Changes

- [minor][11cb8d8626](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11cb8d8626):

  - Remove @atlaskit/analytics dependency.

## 62.1.7

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon@18.0.1
  - @atlaskit/tooltip@15.0.0

## 62.1.6

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/field-base@13.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/icon@18.0.0

## 62.1.5

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 62.1.4

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/field-base@13.0.1
  - @atlaskit/spinner@12.0.0

## 62.1.3

- [patch][ee970b5526](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee970b5526):

  - Detect emoji gender and skintone correctly on selection

## 62.1.2

- [patch][9eb495b1e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9eb495b1e0):

  - Remove completely canvas-prebuilt as it does not seem to be used

## 62.1.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 62.1.0

- [minor][f120090dfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f120090dfe):

  - Add GASv3 analytics to Emoji TypeAhead.

## 62.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/util-service-support@4.0.3
  - @atlaskit/docs@8.0.0
  - @atlaskit/visual-regression@0.1.0
  - @atlaskit/analytics-next@5.0.0
  - @atlaskit/analytics@6.0.0
  - @atlaskit/button@13.0.0
  - @atlaskit/field-base@13.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/layer@7.0.0
  - @atlaskit/section-message@3.0.0
  - @atlaskit/spinner@11.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/tooltip@14.0.0
  - @atlaskit/editor-test-helpers@9.0.0
  - @atlaskit/elements-test-helpers@0.6.0
  - @atlaskit/util-data-test@12.0.0
  - @atlaskit/media-core@30.0.0

## 61.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/util-data-test@11.1.9
  - @atlaskit/media-core@29.3.0

## 60.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/util-data-test@11.1.8
  - @atlaskit/media-core@29.2.0

## 59.2.5

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 59.2.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 59.2.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 59.2.2

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 59.2.1

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/section-message@2.0.2
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/media-core@29.1.4
  - @atlaskit/button@12.0.0

## 59.2.0

- [minor][b81d427d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81d427d5c):

  - ED-5373: Refactor emoji plugin to use new type ahead

## 59.1.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 59.1.0

- [minor][ce6fec11a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce6fec11a3):

  - code split for emoji

## 59.0.1

- [patch][3fa12076fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fa12076fd):

  - Fix import statement in emoji analytics

## 59.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/util-data-test@11.1.5
  - @atlaskit/media-core@29.1.0

## 58.3.0

- [minor][fdc41108fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdc41108fa):

  - Updated analytics to modern form

## 58.2.0

- [minor][b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):

  - reset jest modules before hydration

## 58.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 58.1.0

- [minor][b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):

  - improvement of SSR tests and examples for Fabric Elements

## 58.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/i18n-tools@0.5.0
  - @atlaskit/button@11.0.0
  - @atlaskit/editor-test-helpers@8.0.0
  - @atlaskit/util-data-test@11.0.0
  - @atlaskit/util-service-support@4.0.0
  - @atlaskit/media-core@29.0.0

## 57.0.1

- Updated dependencies [7261577953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7261577953):
  - @atlaskit/elements-test-helpers@0.3.0

## 57.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/util-data-test@10.2.5
  - @atlaskit/media-core@28.0.0

## 56.2.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/media-core@27.2.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics@5.0.0
  - @atlaskit/field-base@12.0.0
  - @atlaskit/layer@6.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 56.2.0

- [minor][4072865c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4072865c1c):

  - added SSR tests to task-decision

## 56.1.0

- [minor][36bb743af0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36bb743af0):

  - added/cleaned up ssr tests

## 56.0.0

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/util-data-test@10.2.2
  - @atlaskit/media-core@27.2.0

## 55.1.0

- [minor][9ab9e467d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ab9e467d2):

  - Bump version of typestyle for ssr compatibility

## 55.0.2

- [patch][2d691c1e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d691c1e48):

  - Added aria labels to Emoji upload component

## 55.0.1

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/editor-test-helpers@7.0.0

## 55.0.0

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/util-data-test@10.2.1
  - @atlaskit/media-core@27.1.0

## 54.1.0

- [minor][cf6799312a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf6799312a):

  - Enable striter types for emoji package

## 54.0.0

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/util-data-test@10.0.36
  - @atlaskit/media-core@27.0.0

## 53.0.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/field-base@11.0.14
  - @atlaskit/section-message@1.0.16
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/editor-test-helpers@6.3.13
  - @atlaskit/icon@16.0.0

## 53.0.0

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/util-data-test@10.0.34
  - @atlaskit/media-core@26.2.0

## 52.0.0

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/util-data-test@10.0.33
  - @atlaskit/media-core@26.1.0

## 51.2.0

- [minor][6ef7a45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ef7a45):

  - FS-1230 New standalone emoji upload component added

## 51.1.0

- [minor][e60d7aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e60d7aa):

  - updated i18n translations

## 51.0.0

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/util-data-test@10.0.31
  - @atlaskit/media-core@26.0.0

## 50.0.0

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/util-data-test@10.0.30
  - @atlaskit/media-core@25.0.0

## 49.1.0

- [patch][53cb129](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53cb129):

  - show emoji preview error in a tooltip, render spinner outside button, css changes

- [minor][514790b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/514790b):

  - added i18n support to emoji

- [patch][686de31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/686de31):

  - added maxWidth to other buttons

## 49.0.0

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/util-data-test@10.0.28
  - @atlaskit/media-core@24.7.0

## 48.0.2

- [patch][0f19693](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f19693):

  - added tests for xregexp transformer, updated README and simplified code

- [patch][b789b3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b789b3a):

  - removed xregexp library dependency from emoji and mention components, added xregexp-transformer package to compile xregexp expressions to unicode charsets

## 48.0.1

- [patch][015fcd0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/015fcd0):

  - Adjusted unit tests to test for the bug noticed in FS-3259. Added multiple atlassian-ftfy emoji to test this, so updated a unit test to confirm that there are 14 Atlassian emoji, and also added an additional unit test to confirm that FS-3259 was corrected.

- [patch][18203e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18203e6):

  - FS-3259 Fixed bug that caused an emoji to be automatically inserted for a query including a closing colon even if there are multiple (an odd number specifically) emoji with an exact shortName match.

## 48.0.0

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/util-data-test@10.0.26
  - @atlaskit/media-core@24.6.0

## 47.0.8

- [patch][b81da9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b81da9b):

  - Fix typescript types to support strictFunctionTypes

## 47.0.7

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics@4.0.7
  - @atlaskit/button@10.1.1
  - @atlaskit/field-base@11.0.13
  - @atlaskit/icon@15.0.2
  - @atlaskit/layer@5.0.10
  - @atlaskit/section-message@1.0.14
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/media-core@24.5.2
  - @atlaskit/docs@6.0.0

## 47.0.6

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-base@11.0.12
  - @atlaskit/icon@15.0.1
  - @atlaskit/spinner@9.0.12
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 47.0.5

- [patch][31ac424](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31ac424):

  - FS-1596 Changed sizes of example emojis in test00.

## 47.0.4

- [patch][90c4702](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90c4702):

  - FS-1734 Removed the try it out section from Emoji and Mentions documentation pages to match other pages. The section only contained a link to the same page, so was essentially redundant and potentially confusing.

## 47.0.3

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 47.0.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/field-base@11.0.11
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 47.0.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/media-core@24.5.1
  - @atlaskit/button@10.0.0

## 47.0.0

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/util-data-test@10.0.21
  - @atlaskit/media-core@24.5.0

## 46.0.1

- [patch][49a2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49a2a58):

  - Use onClick from button in emoji

## 46.0.0

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/util-data-test@10.0.20
  - @atlaskit/media-core@24.4.0

## 45.0.4

- [patch][36c362f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c362f):

  - FS-3174 - Fix usage of gridSize() and borderRadius()

## 45.0.3

- [patch][527b954](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/527b954):

  - FS-3174 - Remove usage of util-shared-styles from elements components

## 45.0.2

- [patch] Tweak emoji tests to work better with newest EmojiOne v4 metadata [c034007](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c034007)

## 45.0.1

- [patch] Move canvas-prebuilt to devDep [7c3512e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c3512e)

## 45.0.0

- [major] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/util-data-test@10.0.16
  - @atlaskit/media-core@24.3.0

## 44.0.0

- [major] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/util-data-test@10.0.14
  - @atlaskit/media-core@24.2.0

## 43.0.0

- [patch] Deprecate context.uploadFile & context.getFile. Instead context.file.upload & context.file.getFileState should be used; media-store's uploadFile function now takes MediaStore as a second argument, not MediaApiConfig [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [major] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/util-data-test@10.0.12
  - @atlaskit/media-core@24.1.0

## 42.0.2

- [patch] Remove ua-parser-js to save some pageweight [cf18b9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf18b9f)

## 42.0.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-base@11.0.8
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 42.0.0

- [major] Update RXJS dependency to ^5.5.0 [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
- [major] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/util-data-test@10.0.10
  - @atlaskit/media-core@24.0.0

## 41.0.1

- [patch] FS-1583 size placeholders in picker to square [a836b20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a836b20)

## 41.0.0

- [major] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/util-data-test@10.0.9
  - @atlaskit/media-core@23.2.0

## 40.0.2

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
  - @atlaskit/media-core@23.1.1

## 40.0.1

- [patch] FS-2941 Stop using Request object and upgrade fetch-mock [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 40.0.0

- [major] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/util-data-test@10.0.8
  - @atlaskit/media-core@23.1.0

## 39.1.1

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/util-data-test@10.0.7

## 39.1.0

- [minor] FS-2892 add code splitting to emoji components [dd91bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd91bcf)
- [none] Updated dependencies [dd91bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd91bcf)

## 39.0.4

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/spinner@9.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 39.0.3

- [patch] FS-2819 use aria-label as selector rather than closest [84a7235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84a7235)
- [none] Updated dependencies [84a7235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84a7235)

## 39.0.2

- [patch] Update emoji examples to use valid emoji in test data [62ebfd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62ebfd7)
- [none] Updated dependencies [62ebfd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62ebfd7)
  - @atlaskit/util-data-test@10.0.6

## 39.0.1

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/field-base@11.0.3
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/layer@5.0.4
  - @atlaskit/analytics@4.0.4
  - @atlaskit/icon@13.2.4

## 39.0.0

- [patch] Synchronous property "serviceHost" as part of many Interfaces in media components (like MediaApiConfig) is removed and replaced with asynchronous "baseUrl" as part of Auth object. [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/util-data-test@10.0.3
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/util-data-test@10.0.3
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/util-data-test@10.0.3
- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/media-core@23.0.0
  - @atlaskit/util-data-test@10.0.3

## 38.0.5

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/media-core@22.2.1
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1
  - @atlaskit/layer@5.0.3
  - @atlaskit/analytics@4.0.3
  - @atlaskit/field-base@11.0.2

## 38.0.4

- [patch] FS-2111 Code review feedback [cf930e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf930e3)
- [patch] Fix emoji picker focus issue for IE11 [ce6eb48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce6eb48)
- [none] Updated dependencies [cf930e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf930e3)
- [none] Updated dependencies [ce6eb48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce6eb48)

## 38.0.3

- [patch] FS-2819 fix typechecking of target element [8edc3a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8edc3a2)
- [none] Updated dependencies [8edc3a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8edc3a2)

## 38.0.2

- [patch] FS-2819 use internal version of closest [1cd9438](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1cd9438)
- [none] Updated dependencies [1cd9438](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1cd9438)

## 38.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1

## 38.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/media-core@22.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0

## 37.0.2

- [patch] Move emoji tests [0c6d1c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c6d1c7)
- [none] Updated dependencies [0c6d1c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c6d1c7)

## 37.0.1

- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-service-support@2.0.12
  - @atlaskit/util-data-test@9.1.18

## 37.0.0

- [major] FS-2011 change EmojiRepository to use CategoryId [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)
- [minor] FS-2011 fix scroll to user custom upload section [cacf096](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacf096)
- [none] Updated dependencies [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)
  - @atlaskit/util-data-test@9.1.17
- [none] Updated dependencies [cacf096](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacf096)
  - @atlaskit/util-data-test@9.1.17

## 36.0.2

- [none] Updated dependencies [8c711bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c711bd)
- [patch] Updated dependencies [42ee1ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42ee1ea)
  - @atlaskit/media-core@21.0.0

## 36.0.1

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/media-picker@8.1.6
  - @atlaskit/util-data-test@9.1.15

## 36.0.0

- [major] remove MediaPicker and use media-core to upload files [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/util-data-test@9.1.14

## 35.1.4

- [patch] Updated dependencies [c57e9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c57e9c1)
  - @atlaskit/media-picker@8.1.4
  - @atlaskit/media-core@20.0.0

## 35.1.3

- [patch] FS-2056 defer input focus in EmojiPickerListSearch [b062ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b062ab4)
- [none] Updated dependencies [b062ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b062ab4)

## 35.1.2

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/media-picker@8.1.3
  - @atlaskit/field-base@10.1.3
  - @atlaskit/button@8.2.3

## 35.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/media-picker@8.1.2
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/media-core@19.1.3
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/field-base@10.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/spinner@7.0.2
  - @atlaskit/icon@12.1.2

## 35.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/util-data-test@9.1.11

## 35.0.7

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/media-picker@8.0.0
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/media-core@19.0.0
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8
  - @atlaskit/layer@4.0.0
  - @atlaskit/analytics@3.0.2

## 35.0.6

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/media-picker@7.0.6
  - @atlaskit/util-data-test@9.1.9

## 35.0.5

- [patch] Updated dependencies [5ee48c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee48c4)
  - @atlaskit/media-picker@7.0.5
  - @atlaskit/media-core@18.1.2

## 35.0.4

- [patch] FS-1954 fix emoji remove button truncation [5ed86f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ed86f9)
- [none] Updated dependencies [5ed86f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ed86f9)

## 35.0.3

- [patch] FS-1206 remove AtlassianEmojiMigrationResource [0edc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0edc6c8)
- [none] Updated dependencies [0edc6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0edc6c8)

## 35.0.2

- [patch] FS-1904 add support for emoji with ascii starting with ( [c83d567](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c83d567)
- [none] Updated dependencies [c83d567](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c83d567)
  - @atlaskit/util-data-test@9.1.5

## 35.0.1

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
  - @atlaskit/media-picker@7.0.1
  - @atlaskit/media-core@18.1.1

## 35.0.0

- [major] media-picker: <All but popup picker>.emitUploadEnd second argument shape has changed from MediaFileData to FileDetails; `upload-end` event payload body shape changed from MediaFileData to FileDetails; All the media pickers config now have new property `useNewUploadService: boolean` (false by default); popup media-picker .cancel can't be called with no argument, though types does allow for it; `File` is removed; --- media-store: MediaStore.createFile now has a required argument of type MediaStoreCreateFileParams; MediaStore.copyFileWithToken new method; uploadFile method result type has changed from just a promise to a UploadFileResult type; --- media-test-helpers: mediaPickerAuthProvider argument has changed from a component instance to just a boolean authEnvironment; [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/util-data-test@9.1.4
- [none] Updated dependencies [714ab32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/714ab32)
  - @atlaskit/util-data-test@9.1.4
- [major] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/media-core@18.1.0
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/media-picker@7.0.0
- [major] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/media-core@18.1.0
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/media-picker@7.0.0

## 34.2.1

- [patch] FS-1976 sort emojis based on order property [70de5fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70de5fc)
- [none] Updated dependencies [70de5fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70de5fc)

## 34.2.0

- [patch] FS-1580 add new atlassian emoji [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
- [minor] FS-1580 add new Atlassian emoji [89146bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89146bf)
- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [74f84c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74f84c6)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [92cdf83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cdf83)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [4151cc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4151cc5)
  - @atlaskit/util-data-test@9.1.3
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/icon@11.3.0
  - @atlaskit/media-picker@6.0.5
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/field-base@9.0.3
  - @atlaskit/media-core@18.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/util-service-support@2.0.7
  - @atlaskit/layer@3.1.1
  - @atlaskit/analytics@3.0.1
- [patch] Updated dependencies [89146bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89146bf)
  - @atlaskit/util-data-test@9.1.3

## 34.1.9

- [patch] FS-1860 Fix site emoji stuck in a bad state [bf8622c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf8622c)

## 34.1.6

- [patch] Expose the EmojiResourceConfig interface [3015b9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3015b9d)

## 34.1.1

- [patch] Fixed flex issue in IE11 [137d8bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/137d8bd)
- [patch] Improve custom emoji upload failure and waiting experience [1ab5945](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ab5945)

## 34.1.0

- [minor] FS-1660 emoji upload preview uses new design [52a8dd9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52a8dd9)

## 34.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 33.0.2

- [patch] FS-1853 custom category button scrolls to Your Uploads if present [f42e14e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f42e14e)

## 33.0.1

- [patch] code clean up [6c1c0a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c1c0a0)
- [patch] custom emoji pre-upload file validation for invalid image and files over 1Mb [86244f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86244f5)

## 33.0.0

- [major] FS-1658 deleteSiteEmoji and getCurrentUser are required for EmojiProvider implementation [ecec57f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecec57f)

## 32.0.0

- [major] FS-1697 move elements packages to use util-data-test for test data [deb820a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deb820a)

## 31.1.23

- [patch] Fix painting issue after scrolling to top of emoji list [debbe10](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/debbe10)

## 31.1.22

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 31.1.20

- [patch] FS-1843 fix incorrect emoji category [36473a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36473a8)

## 31.1.19

- [patch] code split MediaEditor in MediaPicker [bdc395a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdc395a)

## 31.1.16

- [patch] FS-1834 check for undefined repository in EmojiResource [c97751f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c97751f)

## 31.1.13

- [patch] add guard condition for nullable function emojiProvider.getCurrentUser [b8780e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8780e4)

## 31.1.12

- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 31.1.10

- [patch] code clean up [b6ecb4a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b6ecb4a)
- [patch] kept currentUser attribute consistent in all places, fixed typescript errors [6f375f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f375f0)
- [patch] added implementation for missing ES6 findIndex function [3ead412](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ead412)
- [patch] removed service-data-site.json [653f2df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/653f2df)
- [patch] user parameter renamed to currentUser, user custom group logic moved to EmojiPickerList.buildGroups, tests added [7796a7c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7796a7c)
- [patch] render user custom emoji separately [18f45ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18f45ff)

## 31.1.8

- [patch] show custom emojis regardless of upload support [efc7e9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/efc7e9a)

## 31.1.7

- [patch] removed UploadingEmojiResource.isCustomCategoryRequired function [9370179](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9370179)
- [patch] only scroll to custom category after adding the emoji, fixed MockEmojiResource to not render custom category header if there is no custom emoji [22bc389](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22bc389)
- [patch] refactored tests [d9e3745](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9e3745)
- [patch] show "add custom emoji" button if user moves mouse away from Footer area [38a1c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38a1c1c)
- [patch] Fixed typescript error [26d187a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26d187a)
- [patch] added unit tests for EmojiPreview component [e136dff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e136dff)
- [patch] New UX button for adding a custom emoji [e86d2f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e86d2f4)

## 31.1.6

- [patch] fix mention and emoji bug related to MutationObserver API [dd0a69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd0a69c)

## 31.1.3

- [patch] IE11 does not calculate emoji picker width correctly so give it a min-width explicitly. [95bbc84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95bbc84)

## 31.1.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 31.1.1

- [patch] fixed typescript errors [fe6676e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe6676e)
- [patch] added analytics to emoji picker [d9d4fb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d4fb2)

## 31.1.0

- [minor] FS-1649 move emoji to mk-2 [6953ac1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6953ac1)

## 31.0.8 (2018-01-10)

- bug fix; added nbsp to emoji sprite spans to allow for selection at start of paragraph (issues closed: fs-1622) ([77d6ca0](https://bitbucket.org/atlassian/atlaskit/commits/77d6ca0))

## 31.0.7 (2018-01-05)

- bug fix; fix missing window when using emoji in node.js code ([136b0c5](https://bitbucket.org/atlassian/atlaskit/commits/136b0c5))

## 31.0.6 (2018-01-04)

- bug fix; fS-1600 Code review remark ([458577d](https://bitbucket.org/atlassian/atlaskit/commits/458577d))
- bug fix; fS-1600 Change lifecycle methods used to avoid rerender when possible ([51f14a1](https://bitbucket.org/atlassian/atlaskit/commits/51f14a1))

## 31.0.5 (2018-01-02)

- bug fix; update util-service-support dependency to 2.0.3 (issues closed: fs-1091) ([593da96](https://bitbucket.org/atlassian/atlaskit/commits/593da96))

## 31.0.4 (2017-12-21)

- bug fix; use memorycachestrategy for ie ([2801cfd](https://bitbucket.org/atlassian/atlaskit/commits/2801cfd))

## 31.0.3 (2017-12-20)

- bug fix; fS-1588 force edge to use memorycachestrategy (issues closed: fs-1588) ([8b2224c](https://bitbucket.org/atlassian/atlaskit/commits/8b2224c))

## 31.0.2 (2017-12-19)

- bug fix; fix publishing of emoji component (issues closed: fs-1591) ([676cb72](https://bitbucket.org/atlassian/atlaskit/commits/676cb72))

## 31.0.1 (2017-12-19)

- bug fix; fS-1584 fix high res emoji rendering in firefox and edge (issues closed: fs-1584) ([7ec1e3b](https://bitbucket.org/atlassian/atlaskit/commits/7ec1e3b))

## 31.0.0 (2017-12-14)

- breaking; property fitHeight removed in favor of size property in EmojiPlaceholder ([fedf004](https://bitbucket.org/atlassian/atlaskit/commits/fedf004))
- breaking; removed redundant prop fitToHeight in EmojiPlaceholder ([fedf004](https://bitbucket.org/atlassian/atlaskit/commits/fedf004))

## 30.3.8 (2017-12-13)

- bug fix; atlassianEmojiMigrationResource does not resolve atlassian emojis by id (issues closed: fs-1557) ([1bfc13c](https://bitbucket.org/atlassian/atlaskit/commits/1bfc13c))

## 30.3.7 (2017-12-08)

- bug fix; fS-1504 Fix lint error ([64563cf](https://bitbucket.org/atlassian/atlaskit/commits/64563cf))
- bug fix; fS-1504: Delete emoji tooltip style ([07e6300](https://bitbucket.org/atlassian/atlaskit/commits/07e6300))
- bug fix; fS-1504 Use tooltip component instead of css solution ([fde67b6](https://bitbucket.org/atlassian/atlaskit/commits/fde67b6))

## 30.3.6 (2017-12-05)

- bug fix; fixed typescript error in unit test ([a4dceec](https://bitbucket.org/atlassian/atlaskit/commits/a4dceec))
- bug fix; removed circular dependency on constant defaultListLimit ([1978b73](https://bitbucket.org/atlassian/atlaskit/commits/1978b73))
- bug fix; fixed EmojiPlaceHolder height for big emoji to fix stride scrolling bug ([06638c5](https://bitbucket.org/atlassian/atlaskit/commits/06638c5))

## 30.3.5 (2017-11-28)

- bug fix; upgrade all atlaskit dependencies (issues closed: fs-1526) ([8dac2d2](https://bitbucket.org/atlassian/atlaskit/commits/8dac2d2))
- bug fix; use theme package instead of util-shared-styles (issues closed: fs-1526) ([45d7bb9](https://bitbucket.org/atlassian/atlaskit/commits/45d7bb9))

## 30.3.4 (2017-11-28)

- bug fix; fixed typescript errors in emoji ([8619a6e](https://bitbucket.org/atlassian/atlaskit/commits/8619a6e))
- bug fix; fS-1518 requests higher res image on error (issues closed: fs-1518) ([63ef0bd](https://bitbucket.org/atlassian/atlaskit/commits/63ef0bd))

## 30.3.3 (2017-11-22)

- bug fix; big emoji scrolling issue fixed (issues closed: fs-1512) ([b715731](https://bitbucket.org/atlassian/atlaskit/commits/b715731))

## 30.3.2 (2017-11-20)

- bug fix; make emoji react 16 compatible (issues closed: ed-3181) ([9ca27d8](https://bitbucket.org/atlassian/atlaskit/commits/9ca27d8))

## 30.3.1 (2017-11-17)

- bug fix; fix more cases of classname useage ([7fd79d4](https://bitbucket.org/atlassian/atlaskit/commits/7fd79d4))
- bug fix; prefix global classnames to prevent product conflicts (issues closed: fs-1474) ([b5cccae](https://bitbucket.org/atlassian/atlaskit/commits/b5cccae))

## 30.3.0 (2017-11-17)

- feature; upgrade version of mediapicker to 11.1.6 and media-core to 11.0.0 across packages ([aaa7aa0](https://bitbucket.org/atlassian/atlaskit/commits/aaa7aa0))

## 30.2.0 (2017-11-09)

- feature; added optional alternateRepresentation field to EmojiDescription for using higher r ([624210a](https://bitbucket.org/atlassian/atlaskit/commits/624210a))

## 30.1.6 (2017-10-31)

- bug fix; fixed mpConfig in SiteEmojiResource ([bd01a52](https://bitbucket.org/atlassian/atlaskit/commits/bd01a52))

## 30.1.5 (2017-10-25)

- bug fix; fixed sizing of emoji in upload preview (issues closed: fs-1441) ([d69a2b2](https://bitbucket.org/atlassian/atlaskit/commits/d69a2b2))

## 30.1.4 (2017-10-24)

- bug fix; bumped mediapicker to v10 (issues closed: fs-1443) ([de8a306](https://bitbucket.org/atlassian/atlaskit/commits/de8a306))

## 30.1.3 (2017-10-22)

- bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 30.1.2 (2017-10-20)

- bug fix; simplify positioning of tooltip css. ([d1d2c2e](https://bitbucket.org/atlassian/atlaskit/commits/d1d2c2e))
- bug fix; change animation to slide up (issues closed: fs-1413) ([0cf80c9](https://bitbucket.org/atlassian/atlaskit/commits/0cf80c9))
- bug fix; adjusted positioning for tooltip on emojis of variable sizes ([cde6bf0](https://bitbucket.org/atlassian/atlaskit/commits/cde6bf0))
- bug fix; updated placeholder to fit with square design ([c73c8f0](https://bitbucket.org/atlassian/atlaskit/commits/c73c8f0))

## 30.1.1 (2017-10-11)

- bug fix; fS-1360 Loading emojis for the first time uses more than 1 network call even for the ([866a41f](https://bitbucket.org/atlassian/atlaskit/commits/866a41f))

## 30.1.0 (2017-10-10)

- bug fix; emoji rendered with set width and height to reduce reflows (issues closed: fs-1156) ([4a2a3b9](https://bitbucket.org/atlassian/atlaskit/commits/4a2a3b9))
- feature; allow size of emoji to be overridden (issues closed: fs-1156) ([98cd503](https://bitbucket.org/atlassian/atlaskit/commits/98cd503))

## 30.0.0 (2017-10-05)

- bug fix; fix typescript errors ([c577c6e](https://bitbucket.org/atlassian/atlaskit/commits/c577c6e))
- breaking; EmojiResource and EmojiRepository implement addUnknownEmoji rather than addCustomEmoji ([f82b6ae](https://bitbucket.org/atlassian/atlaskit/commits/f82b6ae))
- breaking; unknown emojis of any type can be resolved and added to the repository (issues closed: fs-1404) ([f82b6ae](https://bitbucket.org/atlassian/atlaskit/commits/f82b6ae))
- bug fix; query auto converts to emoji on exact unique shortname match (issues closed: fs-1381) ([c16eb18](https://bitbucket.org/atlassian/atlaskit/commits/c16eb18))

## 29.1.1 (2017-09-27)

- bug fix; fS-1348 preview displays correct img (issues closed: fs-1348) ([6b0d167](https://bitbucket.org/atlassian/atlaskit/commits/6b0d167))

## 29.1.0 (2017-09-25)

- bug fix; emoji picker displays people emojis after frequent (issues closed: fs-1340) ([f2a089e](https://bitbucket.org/atlassian/atlaskit/commits/f2a089e))
- feature; return creator user Id and created data in EmojiDescription (optionally) (issues closed: fs-1328) ([7949ff4](https://bitbucket.org/atlassian/atlaskit/commits/7949ff4))

## 29.0.4 (2017-09-22)

- bug fix; removed reference to selectedCategory ([7319aa2](https://bitbucket.org/atlassian/atlaskit/commits/7319aa2))
- bug fix; export props and state of emojipickerlist ([3c2dde2](https://bitbucket.org/atlassian/atlaskit/commits/3c2dde2))
- bug fix; fS-1349 refactor selectedCategory resolution logic in picker (issues closed: fs-1349) ([10c7487](https://bitbucket.org/atlassian/atlaskit/commits/10c7487))

## 29.0.3 (2017-09-22)

- bug fix; remove code splitting from emoji ([94a5901](https://bitbucket.org/atlassian/atlaskit/commits/94a5901))

## 29.0.2 (2017-09-21)

- bug fix; shows tone selector by default in preview (issues closed: fs-1346) ([d4fbaf8](https://bitbucket.org/atlassian/atlaskit/commits/d4fbaf8))
- bug fix; fS-1297 picker row to fit emoji if custom is uploaded (issues closed: fs-1297) ([cf42328](https://bitbucket.org/atlassian/atlaskit/commits/cf42328))

## 29.0.1 (2017-09-19)

- bug fix; code splitted mediapicker in emoji package (issues closed: ed-2776) ([8649f12](https://bitbucket.org/atlassian/atlaskit/commits/8649f12))

## 29.0.0 (2017-09-18)

- breaking; EmojiProvider.calculateDynamicCategories() now returns a Promise<string[]> instead of string[](<[c19395f](https://bitbucket.org/atlassian/atlaskit/commits/c19395f)>)
- breaking; a few bug fixes around emoji upload plus Atlassian icon change. (issues closed: fs-1271) ([c19395f](https://bitbucket.org/atlassian/atlaskit/commits/c19395f))

## 28.0.2 (2017-09-13)

- bug fix; fixed typescript errors ([db466da](https://bitbucket.org/atlassian/atlaskit/commits/db466da))

## 28.0.1 (2017-09-11)

- bug fix; some of the support classes did not implement EmojiProvider interface properly. ([ab68a91](https://bitbucket.org/atlassian/atlaskit/commits/ab68a91))
- bug fix; frequently used emoji should include skin-tone modifier (issues closed: fs-1331) ([1b48b4a](https://bitbucket.org/atlassian/atlaskit/commits/1b48b4a))

## 28.0.0 (2017-09-08)

- bug fix; fS-1359 siteEmojiResource.findEmoji only returns emojis of type CUSTOM (issues closed: fs-1359) ([cf222de](https://bitbucket.org/atlassian/atlaskit/commits/cf222de))
- feature; deleting an emoji removes all references to it from the EmojiRepository ([70f105b](https://bitbucket.org/atlassian/atlaskit/commits/70f105b))
- breaking; EmojiResource must implement deleteSiteEmoji functioon ([cf45944](https://bitbucket.org/atlassian/atlaskit/commits/cf45944))
- breaking; fS-1194 add deleteSiteEmoji to EmojiResource ([cf45944](https://bitbucket.org/atlassian/atlaskit/commits/cf45944))

## 27.1.0 (2017-09-06)

- feature; only allow upload if the MediaEmojiResource was able to retrieve an upload token (issues closed: fs-1338) ([b7c085a](https://bitbucket.org/atlassian/atlaskit/commits/b7c085a))
- bug fix; added a story using a proper EmojiResource for testing ([2614b8f](https://bitbucket.org/atlassian/atlaskit/commits/2614b8f))

## 27.0.5 (2017-09-05)

- bug fix; we need to make sure the component is not unmounted before we use this.setState in p (issues closed: ed-2448) ([b3301ea](https://bitbucket.org/atlassian/atlaskit/commits/b3301ea))

## 27.0.4 (2017-09-01)

- bug fix; changed prop type passed into LoadingEmojiComponent ([93cf9e3](https://bitbucket.org/atlassian/atlaskit/commits/93cf9e3))

## 27.0.3 (2017-09-01)

- bug fix; fix size of placeholders in emoji picker. ([b5c5a02](https://bitbucket.org/atlassian/atlaskit/commits/b5c5a02))

## 27.0.2 (2017-08-29)

- bug fix; prevent default on category buttons (issues closed: fs-1320) ([976e395](https://bitbucket.org/atlassian/atlaskit/commits/976e395))

## 27.0.1 (2017-08-29)

- bug fix; added external story to test AtlassianEmojiMigrationResource behaviour ([ec6a355](https://bitbucket.org/atlassian/atlaskit/commits/ec6a355))

## 27.0.0 (2017-08-24)

- feature; add tests for the frequent emoji in the EmojiPicker. ([5b176d0](https://bitbucket.org/atlassian/atlaskit/commits/5b176d0))
- bug fix; ensure only 16 frequent emoji are shown and they are at top of picker ([038b6eb](https://bitbucket.org/atlassian/atlaskit/commits/038b6eb))
- breaking; EmojiProvider implementations need to implement a new method: getFrequentlyUsed. ([84b7c6c](https://bitbucket.org/atlassian/atlaskit/commits/84b7c6c))
- breaking; show frequently used emoji in the EmojiPicker. (issues closed: fs-1095) ([84b7c6c](https://bitbucket.org/atlassian/atlaskit/commits/84b7c6c))
- breaking; EmojiRepository search now applies a default sort unless you specifically set a parameter to prevent ([4f21e3c](https://bitbucket.org/atlassian/atlaskit/commits/4f21e3c))
- breaking; sort the default emoji presented in the typeahead so that the most frequently used (issues closed: fs-1094) ([4f21e3c](https://bitbucket.org/atlassian/atlaskit/commits/4f21e3c))

## 26.0.2 (2017-08-21)

- bug fix; no longer chain calls to mediapicker (no longer supported). ([14b4e6c](https://bitbucket.org/atlassian/atlaskit/commits/14b4e6c))
- bug fix; bump media picker and other dependencies to align with editor-core ([d3c9668](https://bitbucket.org/atlassian/atlaskit/commits/d3c9668))

## 26.0.1 (2017-08-14)

- bug fix; publish only javascript files in dist/ ([367736a](https://bitbucket.org/atlassian/atlaskit/commits/367736a))

## 26.0.0 (2017-08-13)

- feature; unit tests for the frequency in search work. ([ab28372](https://bitbucket.org/atlassian/atlaskit/commits/ab28372))
- breaking; The usageTracker property is moved from EmojiResource. If you subclassed EmojiResource and relied on ([b495c56](https://bitbucket.org/atlassian/atlaskit/commits/b495c56))
- breaking; ensure frequently used emoji are boosted in search results in the typeahead and pick (issues closed: fs-1213) ([b495c56](https://bitbucket.org/atlassian/atlaskit/commits/b495c56))

## 25.0.0 (2017-08-10)

- bug fix; fix .npm-ingore for fabric ts packages. ([f6f2edd](https://bitbucket.org/atlassian/atlaskit/commits/f6f2edd))
- bug fix; bumped emoji to next latest version ([79b61ba](https://bitbucket.org/atlassian/atlaskit/commits/79b61ba))
- breaking; EmojiSearchResult no longer has categories field ([cbc47eb](https://bitbucket.org/atlassian/atlaskit/commits/cbc47eb))
- breaking; categorySelector inserts non-standard categories dynamically (issues closed: fs-1201) ([cbc47eb](https://bitbucket.org/atlassian/atlaskit/commits/cbc47eb))
- feature; atlassianEmojiMigrationResource removes Atlassian emojis that have a corresponding (issues closed: fs-1200) ([a95ef0c](https://bitbucket.org/atlassian/atlaskit/commits/a95ef0c))

## 23.0.1 (2017-08-10)

- bug fix; release imports up into src fail in dist ([9846bc5](https://bitbucket.org/atlassian/atlaskit/commits/9846bc5))

## 23.0.0 (2017-08-09)

- bug fix; make the typeahead and picker call Provider.recordSelection by default ([c801f20](https://bitbucket.org/atlassian/atlaskit/commits/c801f20))
- bug fix; change how skin tone variations are converted back to their 'base' emoji ([ef6fbf3](https://bitbucket.org/atlassian/atlaskit/commits/ef6fbf3))
- bug fix; fixed a bug where the storybook update was happening before the usage had been recor ([eeedf56](https://bitbucket.org/atlassian/atlaskit/commits/eeedf56))
- breaking; EmojiResource.recordSelection now returns a resolved Promise rather than a rejected Promise when ([e7680d0](https://bitbucket.org/atlassian/atlaskit/commits/e7680d0))
- breaking; keep track of selected emoji so we know most frequently used. (issues closed: fs-1212) ([e7680d0](https://bitbucket.org/atlassian/atlaskit/commits/e7680d0))

## 22.3.1 (2017-07-27)

- fix; ensure :sweat_smile: is in emoji test data for editor tests ([00759bf](https://bitbucket.org/atlassian/atlaskit/commits/00759bf))
- fix; update test/story data to all source from latest prod url. Stop using dev. ([2d223f8](https://bitbucket.org/atlassian/atlaskit/commits/2d223f8))

## 22.3.0 (2017-07-26)

- feature; added test for localStorage use in EmojiResource ([b17b64a](https://bitbucket.org/atlassian/atlaskit/commits/b17b64a))

## 22.2.0 (2017-07-25)

- feature; emojiResource uses localStorage to remember tone selection ([5547296](https://bitbucket.org/atlassian/atlaskit/commits/5547296))
- feature; export test/story data for direct import. Not in bundle. ([bafc231](https://bitbucket.org/atlassian/atlaskit/commits/bafc231))

## 22.1.0 (2017-07-24)

- feature; switch to util-service-support for service interaction ([2ee3928](https://bitbucket.org/atlassian/atlaskit/commits/2ee3928))

## 22.0.1 (2017-07-21)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))
- fix; addes in a wrapper for emoji so that it can be parsed by PM editor ([39e8389](https://bitbucket.org/atlassian/atlaskit/commits/39e8389))

## 21.0.0 (2017-07-20)

- feature; fixed CSS of emoji picker ([d98acb3](https://bitbucket.org/atlassian/atlaskit/commits/d98acb3))

## 19.0.0 (2017-07-19)

- fix; don't return non-searchable emoji in searches (and 'getAll') calls ([4e95196](https://bitbucket.org/atlassian/atlaskit/commits/4e95196))
- fix; emojiDescription in a few test files were missing the searchable field. ([08f31e2](https://bitbucket.org/atlassian/atlaskit/commits/08f31e2))
- fix; fix flexbox issue when upload panel displayed in FF/IE/Edge. ([aaff6f0](https://bitbucket.org/atlassian/atlaskit/commits/aaff6f0))
- fix; Tests and minor fixes for media caching/loading. ([7ea11c1](https://bitbucket.org/atlassian/atlaskit/commits/7ea11c1))
- feature; emojis with skin variations in the picker ([90af318](https://bitbucket.org/atlassian/atlaskit/commits/90af318))
- feature; skin tone selection made in the picker is stored in the EmojiResource ([fcdcee8](https://bitbucket.org/atlassian/atlaskit/commits/fcdcee8))
- feature; skin tone selection stored in EmojiResource propagated to typeahead ([b17570c](https://bitbucket.org/atlassian/atlaskit/commits/b17570c))
- feature; Performance improvements ([9f5215c](https://bitbucket.org/atlassian/atlaskit/commits/9f5215c))
- breaking; The EmojiDescription and EmojiServiceDescription interfaces have an additional mandatory property.
- ISSUES CLOSED: FS-1171
- breaking; EmojiProvider requires getter/setter for remembering tone selection
- ISSUES CLOSED: FS-1127
- breaking; - Most EmojiProvider methods now return T | Promise<T> instead of Promise<T>

* This should still be compatible for implementors of an EmojiProvider, but they can improve rendering speeds in some cases if they return a T instead of a Promise<T>, but old returns will continue to work.

- ISSUES CLOSED: FS-1057

## 18.4.2 (2017-07-10)

- fix; added missing URLSearchParams in emoji ([b028827](https://bitbucket.org/atlassian/atlaskit/commits/b028827))

## 18.4.1 (2017-07-10)

- fix; size emoji to 20px by default. ([776fc42](https://bitbucket.org/atlassian/atlaskit/commits/776fc42))

## 18.4.0 (2017-07-05)

- feature; exact matches on emoji shortName will cause it to be selected ([8dbc1cb](https://bitbucket.org/atlassian/atlaskit/commits/8dbc1cb))

## 18.3.0 (2017-07-04)

- fix; emojiRepository returns emojis starting with numbers ([d98b5d8](https://bitbucket.org/atlassian/atlaskit/commits/d98b5d8))
- feature; improve rendering performance of emoji picker with virtual list. ([212e076](https://bitbucket.org/atlassian/atlaskit/commits/212e076))

## 18.1.0 (2017-06-26)

- fix; accept webp if in a supported browser. ([87c612b](https://bitbucket.org/atlassian/atlaskit/commits/87c612b))
- feature; allow enabling of upload support via EmojiResourceConfig ([234cdc6](https://bitbucket.org/atlassian/atlaskit/commits/234cdc6))
- feature; removed inbuilt tooltip for ADG3 compliant version ([2089361](https://bitbucket.org/atlassian/atlaskit/commits/2089361))

## 18.0.6 (2017-06-22)

- fix; don't index minus in emoji name. ([55398db](https://bitbucket.org/atlassian/atlaskit/commits/55398db))

## 18.0.5 (2017-06-21)

- fix; make sure we don't try to get the AsciiMap from EmojiRepository until all emoji have ([0b047b2](https://bitbucket.org/atlassian/atlaskit/commits/0b047b2))

## 18.0.3 (2017-06-20)

- fix; fix default type ahead search to allow queries starting with a colon ([ed5dc16](https://bitbucket.org/atlassian/atlaskit/commits/ed5dc16))

## 18.0.2 (2017-06-20)

- fix; changed double quotes to single quotes ([266fe04](https://bitbucket.org/atlassian/atlaskit/commits/266fe04))
- fix; fixed linting errors in Emojis ([9aed8a9](https://bitbucket.org/atlassian/atlaskit/commits/9aed8a9))

## 18.0.1 (2017-06-15)

- fix; fix correct usage of react lifecycle and controlled input component. ([3ccd3ec](https://bitbucket.org/atlassian/atlaskit/commits/3ccd3ec))

## 17.0.0 (2017-06-15)

- fix; ensure there are no emoji duplicates when matching by ascii representation ([7d847b4](https://bitbucket.org/atlassian/atlaskit/commits/7d847b4))
- fix; emojiPicker stories use Layer component to anchor to input field ([0819541](https://bitbucket.org/atlassian/atlaskit/commits/0819541))
- feature; add ascii->emoji map to EmojiResource and EmojiRepository ([e9dbd69](https://bitbucket.org/atlassian/atlaskit/commits/e9dbd69))
- feature; add support for mapping new optional ascii field in EmojiDescription ([b3846a4](https://bitbucket.org/atlassian/atlaskit/commits/b3846a4))
- feature; fS-976 removed interal Popup from EmojiPicker and integrated with layer ([f081739](https://bitbucket.org/atlassian/atlaskit/commits/f081739))
- feature; introduce the new method findById(String) to EmojiProvider ([99c7549](https://bitbucket.org/atlassian/atlaskit/commits/99c7549))
- feature; properly handle emoji selection in typeahead when dealing with ascii match ([5a79e60](https://bitbucket.org/atlassian/atlaskit/commits/5a79e60))
- breaking; target, position, zIndex, offsetX and offsetY removed as props from EmojiPicker
- ISSUES CLOSED: FS-976
- breaking; Added required getAsciiMap() method to EmojiProvider. Consumers will need to implement it in their concrete classes.
- breaking; The introduction of findById(String) to EmojiProvider is a breaking change.
- ISSUES CLOSED: FS-935

## 16.1.0 (2017-06-06)

- fix; fix flexbox issue in IE11 ([383e10f](https://bitbucket.org/atlassian/atlaskit/commits/383e10f))
- fix; minor fixes, and tests for loading site emoji if not found. ([ad17ab6](https://bitbucket.org/atlassian/atlaskit/commits/ad17ab6))
- fix; tidy up conditional check, variable name ([39ad1f2](https://bitbucket.org/atlassian/atlaskit/commits/39ad1f2))
- fix; workaround react bug with EmojiUploadPicker in IE11 ([a161053](https://bitbucket.org/atlassian/atlaskit/commits/a161053))
- feature; look for an emoji on the server if unable to find it locally by id. ([5d9367f](https://bitbucket.org/atlassian/atlaskit/commits/5d9367f))

## 16.0.0 (2017-06-01)

- fix; add polyfills for all storybooks, use es6-promise, URLSearchParams, Fetch API and Elemen ([db2f5cf](https://bitbucket.org/atlassian/atlaskit/commits/db2f5cf))
- fix; move all polyfills into devDeps ([d275563](https://bitbucket.org/atlassian/atlaskit/commits/d275563))
- fix; remove polyfills from mention and emoji packages, use styled-components instead of t ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
- fix; rollback style changes for emoji component ([cd2bebd](https://bitbucket.org/atlassian/atlaskit/commits/cd2bebd))
- feature; upload emoji to media api support ([c230ac8](https://bitbucket.org/atlassian/atlaskit/commits/c230ac8))
- breaking; ED-1701, ED-1702, ED-1704
- ISSUES CLOSED: ED-1701, ED-1702, ED-1704

## 15.0.0 (2017-05-22)

- feature; emojiPlaceholder prop rename title -> shortName to avoid confusion. ([974f48d](https://bitbucket.org/atlassian/atlaskit/commits/974f48d))
- feature; support media api based emoji ([b102cee](https://bitbucket.org/atlassian/atlaskit/commits/b102cee))
- breaking; EmojiPlaceholder prop change is breaking. title -> shortName
- ISSUES CLOSED: FS-782

## 14.2.0 (2017-05-17)

- feature; trigger release of emoji component ([08e4e62](https://bitbucket.org/atlassian/atlaskit/commits/08e4e62))

## 14.1.0 (2017-05-10)

- fix; fixed emoji icon position ([5987e98](https://bitbucket.org/atlassian/atlaskit/commits/5987e98))
- feature; bumped typestyle in emoji ([2708133](https://bitbucket.org/atlassian/atlaskit/commits/2708133))

## 14.0.3 (2017-05-09)

- fix; emoji can handle empty parameter list ([b1ca73c](https://bitbucket.org/atlassian/atlaskit/commits/b1ca73c))
- feature; bump icon in emoji and field-base ([5f0a127](https://bitbucket.org/atlassian/atlaskit/commits/5f0a127))

## 14.0.2 (2017-05-09)

- fix; added dependencies to package.json to import URL library ([5895ba1](https://bitbucket.org/atlassian/atlaskit/commits/5895ba1))
- fix; fixed debounce function timeout clearing ([65d2d23](https://bitbucket.org/atlassian/atlaskit/commits/65d2d23))
- fix; query params can be included in the base url for the emoji service ([2de1256](https://bitbucket.org/atlassian/atlaskit/commits/2de1256))

## 14.0.1 (2017-05-08)

- fix; moved resize event handling to popper ([a876317](https://bitbucket.org/atlassian/atlaskit/commits/a876317))

## 13.4.5 (2017-05-08)

- fix; allows absolute position to be passed to props of EmojiPicker ([e31615d](https://bitbucket.org/atlassian/atlaskit/commits/e31615d))
- fix; fix emoji picker search styling ([59bec8b](https://bitbucket.org/atlassian/atlaskit/commits/59bec8b))
- fix; fix missing border radius on image based emoji ([a0bc069](https://bitbucket.org/atlassian/atlaskit/commits/a0bc069))
- fix; fix picker button sizing due to padding removal on Emoji ([a0930d4](https://bitbucket.org/atlassian/atlaskit/commits/a0930d4))
- fix; handle non-square emoji ([930aabc](https://bitbucket.org/atlassian/atlaskit/commits/930aabc))
- fix; only show pointer cursor in typeahead / picker emoji. ([957be05](https://bitbucket.org/atlassian/atlaskit/commits/957be05))
- fix; order field given larger weight when sorting emojis ([90818d8](https://bitbucket.org/atlassian/atlaskit/commits/90818d8))
- fix; selecting an emoji primarily matches on id then fallbacks to shortName if not found ([e8914b9](https://bitbucket.org/atlassian/atlaskit/commits/e8914b9))
- fix; simplify emoji so can be used as is in rendering ([0ebf05e](https://bitbucket.org/atlassian/atlaskit/commits/0ebf05e))
- fix; fix external story not initialising component correctly from config. ([e458ab1](https://bitbucket.org/atlassian/atlaskit/commits/e458ab1))
- breaking; Emoji markup and default padding/margins has changed. Anyone relying on this will likely have visual breakages (i.e. the editor/renderer/reactions). Do visual review after upgrading.
- ISSUES CLOSED: FS-904

## 13.4.3 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 13.4.2 (2017-04-26)

- fix; fS-923 In the picker search, the cursor jumps to the end of the editor when typing ([cc7986d](https://bitbucket.org/atlassian/atlaskit/commits/cc7986d))
- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 13.4.0 (2017-04-19)

- fix; don't setState on promise return if component unmounted ([41facf8](https://bitbucket.org/atlassian/atlaskit/commits/41facf8))

## 13.3.0 (2017-04-18)

- feature; added ref field to access EmojiPicker component through the editor ([6f09435](https://bitbucket.org/atlassian/atlaskit/commits/6f09435))
- feature; optimise EmojiPicker rendering to improve responsiveness when all Emoji visible. ([9302aca](https://bitbucket.org/atlassian/atlaskit/commits/9302aca))

## 13.2.2 (2017-04-13)

- fix; fixed rendering of names in emoji typeahead when scrollbar is present ([49da9f8](https://bitbucket.org/atlassian/atlaskit/commits/49da9f8))

## 13.2.1 (2017-04-11)

- fix; cross browser fixes for Emoji ([b464f1e](https://bitbucket.org/atlassian/atlaskit/commits/b464f1e))
- fix; fix cropping of short name in IE/Edge ([add87b1](https://bitbucket.org/atlassian/atlaskit/commits/add87b1))
- fix; fix flexbox layout for compatibility with IE11. ([e111027](https://bitbucket.org/atlassian/atlaskit/commits/e111027))
- fix; fS-331 emoji picker search preserves order of resulting emojis within categories ([d92d07e](https://bitbucket.org/atlassian/atlaskit/commits/d92d07e))
- fix; fS-790 searching for emojis returns results grouped by initial category order ([7644e0a](https://bitbucket.org/atlassian/atlaskit/commits/7644e0a))
- fix; rearranged category order in selector to match standard coming in from service ([6b3f2eb](https://bitbucket.org/atlassian/atlaskit/commits/6b3f2eb))
- fix; remove extra padding on buttons in firefox. Adjust width of search to match design a ([2e522e7](https://bitbucket.org/atlassian/atlaskit/commits/2e522e7))

## 13.2.0 (2017-04-11)

- fix; disable clear on input in IE, as it doesn't fire an onChange event. ([7232430](https://bitbucket.org/atlassian/atlaskit/commits/7232430))
- fix; fix active category syncing on scroll in the Emoji Pickers. ([8278cc7](https://bitbucket.org/atlassian/atlaskit/commits/8278cc7))
- fix; polyfill Element.closest. Fix category selector disabled behaviour/hover behaviour. ([420b90f](https://bitbucket.org/atlassian/atlaskit/commits/420b90f))
- feature; remove categories from search results. Disable category selector. ([70ac388](https://bitbucket.org/atlassian/atlaskit/commits/70ac388))

## 13.1.1 (2017-04-11)

- fix; emoji should be wrapped in span instead of div ([87076d7](https://bitbucket.org/atlassian/atlaskit/commits/87076d7))
- fix; fix inconsistent naming for usage of EmojiRepository ([df7200a](https://bitbucket.org/atlassian/atlaskit/commits/df7200a))
- feature; performance improvements to EmojiPicker ([3b1f537](https://bitbucket.org/atlassian/atlaskit/commits/3b1f537))

## 13.1.0 (2017-04-04)

- feature; add count() method to EmojiTypeAhead for number of matching emoji displayed. ([f06ac39](https://bitbucket.org/atlassian/atlaskit/commits/f06ac39))

## 12.0.0 (2017-03-31)

- fix; update test data to match service. Fix missing mapping for fallback. ([99931b2](https://bitbucket.org/atlassian/atlaskit/commits/99931b2))
- feature; change what identifies an Emoji. ([8e4c476](https://bitbucket.org/atlassian/atlaskit/commits/8e4c476))
- feature; upgrade to new service schema, and new render rules. ([e61e059](https://bitbucket.org/atlassian/atlaskit/commits/e61e059))
- breaking; The service schema have changed, component changing to match as well as refine rendering to match spec.
- ISSUES CLOSED: FS-833
- breaking; EmojiId now must contain a shortcut in all cases. id is optional, but preferred. This maximises
- compatibility with different storage formats (such as markdown).
- ISSUES CLOSED: FS-833

## 11.2.3 (2017-03-24)

- fix; added the types property to package.json for emoji ([630d3b2](https://bitbucket.org/atlassian/atlaskit/commits/630d3b2))

## 11.2.1 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 11.2.0 (2017-03-21)

- feature; allow rendering an emoji using only a shortcut. ([fcc400e](https://bitbucket.org/atlassian/atlaskit/commits/fcc400e))
- feature; export EmojiPlaceholder for consumers wishing to use ResourcedEmoji and ResourcedEm ([48c755e](https://bitbucket.org/atlassian/atlaskit/commits/48c755e))
- feature; separate shortcut based ResourceEmoji from EmojiId based implementation ([1972e5d](https://bitbucket.org/atlassian/atlaskit/commits/1972e5d))

## 11.1.1 (2017-03-17)

- fix; upgrade TypeScript to 2.2.1 ([2aa28fc](https://bitbucket.org/atlassian/atlaskit/commits/2aa28fc))

## 11.1.0 (2017-03-09)

- feature; export addition interfaces/classes for Emoji ([b9f32a1](https://bitbucket.org/atlassian/atlaskit/commits/b9f32a1))

## 10.0.0 (2017-03-07)

- fix; make sure an id change in ResourcedEmoji is properly refresh. ([c72c651](https://bitbucket.org/atlassian/atlaskit/commits/c72c651))
- fix; rename ResourcedEmoji prop from id to emojiId for clarity. ([b519e0a](https://bitbucket.org/atlassian/atlaskit/commits/b519e0a))
- fix; require at least one provider to EmojiResource. ([f6feada](https://bitbucket.org/atlassian/atlaskit/commits/f6feada))
- feature; Support asynchronous emoji resource loading, searching, lookups, and rendering. ([298b5ac](https://bitbucket.org/atlassian/atlaskit/commits/298b5ac))
- breaking; Changes resource API to reflect async nature. More similar to Mention resources, and first steps to a common base.
- breaking; EmojiPicker is now using EmojiResource instead of EmojiService to support asynchronous loading and rendering.
- breaking; EmojiTypeAhead is now using EmojiResource instead of EmojiService to support asynchronous loading and rendering.
- ISSUES CLOSED: FS-780

## 9.0.2 (2017-02-27)

- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 9.0.1 (2017-02-22)

- fix; Import only 1 icon instead of whole icon package ([c5fd67b](https://bitbucket.org/atlassian/atlaskit/commits/c5fd67b))

## 2.0.0 (2017-02-22)

- Fix typescript build issue ([5209dee](https://bitbucket.org/atlassian/atlaskit/commits/5209dee))
- Typescript configuration changes to match latest core configuration. ([aa13d3f](https://bitbucket.org/atlassian/atlaskit/commits/aa13d3f))
- Migrating to typescript. Introduce breaking API changes. ([739cbde](https://bitbucket.org/atlassian/atlaskit/commits/739cbde))
- onSelection signature changed for both EmojiTypeAhead and EmojiPicker
- Type and prop changes across most components.
- EmojiResource response structure has changed to allow returning of media api token,
- event signatures from the type ahead component has changed.
- Bump emoji version to prevent local linking by reactions
- ISSUE CLOSED: FS-318

## 1.0.1 (2017-02-20)

- Force release of [@atlaskit](https://github.com/atlaskit)/emoji ([0a322a7](https://bitbucket.org/atlassian/atlaskit/commits/0a322a7))
