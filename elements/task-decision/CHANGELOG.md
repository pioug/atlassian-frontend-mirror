# @atlaskit/task-decision

## 17.2.2

### Patch Changes

- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 17.2.1

### Patch Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - Upgrade date-fns to ^2.17

## 17.2.0

### Minor Changes

- [`ab7db4ccc25`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab7db4ccc25) - Wrap checkbox text with label

### Patch Changes

- Updated dependencies

## 17.1.0

### Minor Changes

- [`5be9ece5fd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5be9ece5fd5) - Removed RxJS from peer dependencies

### Patch Changes

- Updated dependencies

## 17.0.12

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 17.0.11

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 17.0.10

### Patch Changes

- Updated dependencies

## 17.0.9

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 17.0.8

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 17.0.7

### Patch Changes

- Updated dependencies

## 17.0.6

### Patch Changes

- [`66a23c5c94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66a23c5c94) - ED-9350: prevent action item/decision overflow
- Updated dependencies

## 17.0.5

### Patch Changes

- [`bee2157c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bee2157c1b) - Remove usage of @atlaskit/util-common-test package

## 17.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 17.0.3

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 17.0.2

### Patch Changes

- [`e7957c86bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7957c86bf) - ED-7467: Added a new attribute data-node-type in DecisionList to fix copy/pasting between `@atlaskit/renderer` and `@atlaskit/editor-core`.
- Updated dependencies

## 17.0.1

### Patch Changes

- [`c72502e22a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c72502e22a) - ED-9594: Remove cursor pointer from decision items in renderer

## 17.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 16.1.2

### Patch Changes

- [`d320dccd58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d320dccd58) - ED-9488 Remove `export *` from @atlaskit/task-decision

## 16.1.1

### Patch Changes

- [`6ce2418b54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ce2418b54) - ED-9349 Remove hover state from decision item
- [`a86fbdb2b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a86fbdb2b8) - CEMS-1138 Fix TaskItem 'isDone' state gets overriden when user changes the checkbox value

## 16.1.0

### Minor Changes

- [`ef36de69ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef36de69ad) - ED-8358 Change decision to use a grey background

### Patch Changes

- [`fd90289419`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd90289419) - ED-8981 Make decision items selectable
- [`8d91382fb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d91382fb1) - ED-9214: When creating an annotation we can identify marks rather than guessing inline nodes.
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies

## 16.0.12

### Patch Changes

- [`9b1a0d0033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b1a0d0033) - ED-8358 Revert making decisions background grey- [`d895d21c49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d895d21c49) - ED-9176: add annotations to task and decisions- Updated dependencies

## 16.0.11

### Patch Changes

- Updated dependencies [999fbf849e](https://bitbucket.org/atlassian/atlassian-frontend/commits/999fbf849e):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [e95a8726e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/e95a8726e2):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [22704db5a3](https://bitbucket.org/atlassian/atlassian-frontend/commits/22704db5a3):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [5f075c4fd2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f075c4fd2):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [cf41823165](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf41823165):
- Updated dependencies [aec7fbadcc](https://bitbucket.org/atlassian/atlassian-frontend/commits/aec7fbadcc):
  - @atlaskit/editor-common@45.1.0
  - @atlaskit/button@13.3.11
  - @atlaskit/avatar-group@5.1.2
  - @atlaskit/icon@20.1.1
  - @atlaskit/avatar@17.1.10
  - @atlaskit/renderer@58.0.0

## 16.0.10

### Patch Changes

- Updated dependencies [c74cc954d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/c74cc954d8):
- Updated dependencies [b4326a7eba](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4326a7eba):
- Updated dependencies [e4076915c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4076915c8):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [16c193eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/16c193eb3e):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [05539b052e](https://bitbucket.org/atlassian/atlassian-frontend/commits/05539b052e):
- Updated dependencies [11ff95c0f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/11ff95c0f0):
- Updated dependencies [ae426d5e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae426d5e97):
- Updated dependencies [258a36b51f](https://bitbucket.org/atlassian/atlassian-frontend/commits/258a36b51f):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [205b05851a](https://bitbucket.org/atlassian/atlassian-frontend/commits/205b05851a):
- Updated dependencies [1a48183584](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a48183584):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [69b678b38c](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b678b38c):
- Updated dependencies [de6548dae5](https://bitbucket.org/atlassian/atlassian-frontend/commits/de6548dae5):
- Updated dependencies [9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):
- Updated dependencies [0b22d3b9ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b22d3b9ea):
- Updated dependencies [b4ef7fe214](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4ef7fe214):
- Updated dependencies [17a46dd016](https://bitbucket.org/atlassian/atlassian-frontend/commits/17a46dd016):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [6eb8c0799f](https://bitbucket.org/atlassian/atlassian-frontend/commits/6eb8c0799f):
  - @atlaskit/editor-common@45.0.0
  - @atlaskit/renderer@57.0.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-listeners@6.3.0
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/analytics-namespaced-context@4.2.0

## 16.0.9

### Patch Changes

- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):
- Updated dependencies [7d80e44c09](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d80e44c09):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [0a0a54cb47](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a0a54cb47):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
- Updated dependencies [cc54ca2490](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc54ca2490):
  - @atlaskit/editor-common@44.1.0
  - @atlaskit/renderer@56.0.0
  - @atlaskit/docs@8.5.0

## 16.0.8

### Patch Changes

- Updated dependencies [bc380c30ce](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc380c30ce):
- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [5bb23adac3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bb23adac3):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [2475d1c9d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/2475d1c9d8):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [28573f37a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/28573f37a7):
- Updated dependencies [c7b205c83f](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7b205c83f):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [703b72cdba](https://bitbucket.org/atlassian/atlassian-frontend/commits/703b72cdba):
- Updated dependencies [025842de1a](https://bitbucket.org/atlassian/atlassian-frontend/commits/025842de1a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [cd662c7e4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd662c7e4c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
- Updated dependencies [395739b5ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/395739b5ef):
  - @atlaskit/editor-common@44.0.2
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/renderer@55.0.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/avatar-group@5.1.1
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/spinner@12.1.6

## 16.0.7

### Patch Changes

- Updated dependencies [9e90cb4336](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e90cb4336):
- Updated dependencies [e9a14f945f](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9a14f945f):
- Updated dependencies [151240fce9](https://bitbucket.org/atlassian/atlassian-frontend/commits/151240fce9):
- Updated dependencies [8d09cd0408](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d09cd0408):
- Updated dependencies [088f4f7d1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/088f4f7d1e):
- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
- Updated dependencies [4859ceaa73](https://bitbucket.org/atlassian/atlassian-frontend/commits/4859ceaa73):
- Updated dependencies [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies [b924951169](https://bitbucket.org/atlassian/atlassian-frontend/commits/b924951169):
- Updated dependencies [79cabaee0c](https://bitbucket.org/atlassian/atlassian-frontend/commits/79cabaee0c):
- Updated dependencies [ded54f7b9f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ded54f7b9f):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [a4ddcbf7e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4ddcbf7e2):
- Updated dependencies [e3a8052151](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a8052151):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
- Updated dependencies [02b2a2079c](https://bitbucket.org/atlassian/atlassian-frontend/commits/02b2a2079c):
  - @atlaskit/editor-common@44.0.0
  - @atlaskit/avatar-group@5.1.0
  - @atlaskit/renderer@54.0.0
  - @atlaskit/icon@20.0.2
  - @atlaskit/analytics-listeners@6.2.4

## 16.0.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar-group@5.0.4
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/editor-common@43.4.1
  - @atlaskit/renderer@53.2.7
  - @atlaskit/analytics-listeners@6.2.3
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/elements-test-helpers@0.6.7
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/util-service-support@5.0.1

## 16.0.5

### Patch Changes

- Updated dependencies [6ca6aaa1d7](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ca6aaa1d7):
- Updated dependencies [b01fc0ceef](https://bitbucket.org/atlassian/atlassian-frontend/commits/b01fc0ceef):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b8da779506](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8da779506):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/editor-common@43.4.0
  - @atlaskit/renderer@53.2.6
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/avatar-group@5.0.3
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 16.0.4

### Patch Changes

- Updated dependencies [271945fd08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/271945fd08):
- Updated dependencies [ea0e619cc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea0e619cc7):
- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [ef2ba36d5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef2ba36d5c):
- Updated dependencies [bb164fbd1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb164fbd1e):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [b4fda095ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4fda095ef):
- Updated dependencies [10425b84b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10425b84b4):
- Updated dependencies [4700477bbe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4700477bbe):
- Updated dependencies [7f8de51c36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f8de51c36):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
- Updated dependencies [926798632e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926798632e):
  - @atlaskit/editor-common@43.0.0
  - @atlaskit/icon@19.0.11
  - @atlaskit/renderer@53.2.0
  - @atlaskit/theme@9.3.0

## 16.0.3

- Updated dependencies [70e1055b8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70e1055b8f):
  - @atlaskit/renderer@53.1.0
  - @atlaskit/editor-common@42.0.0

## 16.0.2

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/renderer@53.0.0
  - @atlaskit/editor-common@41.2.1

## 16.0.1

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/util-data-test@13.0.1
  - @atlaskit/util-service-support@5.0.0

## 16.0.0

### Major Changes

- [major][bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):

  ED-7631: removed deprecated code for actions/decisions component- [major][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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

### Minor Changes

- [minor][1a0fe670f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a0fe670f9):

  ED-7674: support nested actions in stage-0 schema; change DOM representation of actions

  ### Nested actions

  This changeset adds support for nesting actions _at the schema level_, currently only within the stage-0 ADF schema.

  The editor and renderer currently do nothing special to represent these nested actions. As of this release, they appear as as flat list.

  To enable this feature, use the new `allowNestedTasks` prop.

  ### DOM representation of actions in renderer + editor

  This release also changes the DOM representation of actions away from a `ol > li` structure, to a `div > div` one. That is, both the `taskList` and `taskItem` are wrapped in `div` elements.

  Because taskLists can now be allowed to nest themselves, this would otherwise have created an `ol > ol` structure, which is invalid.

- Updated dependencies [4585681e3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4585681e3d):
  - @atlaskit/renderer@52.0.0

## 15.3.6

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 15.3.5

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 15.3.4

### Patch Changes

- [patch][917d3a4505](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/917d3a4505):

  ED-7593 Ensure Actions re-render with correct checked state when ADF is replaced/refreshed.- [patch][e171e3f38e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e171e3f38e):

  FM-2055, FM-2261: Expose mobile bridge API methods for scrolling to a mention, action, or decision item by ID. Add localId value into rendered action/decision list elements within the existing custom data attribute to allow scroll targetting.

- Updated dependencies [166eb02474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/166eb02474):
- Updated dependencies [40ead387ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40ead387ef):
- Updated dependencies [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/renderer@51.0.0
  - @atlaskit/editor-common@41.0.0

## 15.3.3

- Updated dependencies [40bda8f796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bda8f796):
  - @atlaskit/avatar-group@5.0.0
  - @atlaskit/avatar@17.0.1

## 15.3.2

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/avatar-group@4.0.13
  - @atlaskit/renderer@50.0.2
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 15.3.1

- Updated dependencies [08ec269915](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08ec269915):
  - @atlaskit/editor-common@40.0.0
  - @atlaskit/renderer@50.0.0

## 15.3.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 15.2.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 15.2.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 15.2.2

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

## 15.2.1

### Patch Changes

- [patch][aaefedf60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaefedf60d):

  Move @types/react-loadable from dependencies to devDependencies.

## 15.2.0

### Minor Changes

- [minor][cb33e2866d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb33e2866d):

  FS-4100 - Allow disabling of initial state hydration

## 15.1.5

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 15.1.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 15.1.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 15.1.2

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

## 15.1.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/avatar-group@4.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/editor-common@39.13.2
  - @atlaskit/renderer@49.4.1
  - @atlaskit/icon@19.0.0

## 15.1.0

### Minor Changes

- [minor][574e62c302](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/574e62c302):

  FS-4032 Update actions and decisions to a lighter style.

## 15.0.4

- Updated dependencies [ff85c1c706](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff85c1c706):
  - @atlaskit/renderer@49.0.0

## 15.0.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/avatar-group@4.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/editor-common@39.7.2
  - @atlaskit/renderer@48.7.3
  - @atlaskit/icon@18.0.0

## 15.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 15.0.1

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0

## 15.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 14.0.9

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/editor-common@38.0.0
  - @atlaskit/renderer@47.0.0
  - @atlaskit/util-data-test@11.1.9

## 14.0.8

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/editor-common@37.0.0
  - @atlaskit/renderer@46.0.0
  - @atlaskit/util-data-test@11.1.8

## 14.0.7

- [patch][a6fb248987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6fb248987):

  - ED-6639 Align lists styles between editor & renderer

## 14.0.6

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 14.0.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/avatar-group@3.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/spinner@10.0.7
  - @atlaskit/editor-common@36.1.12
  - @atlaskit/renderer@45.6.1
  - @atlaskit/theme@8.1.7

## 14.0.4

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 14.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/avatar-group@3.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/renderer@45.4.3
  - @atlaskit/analytics-listeners@5.0.3
  - @atlaskit/button@12.0.0

## 14.0.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 14.0.1

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/editor-common@36.0.0
  - @atlaskit/renderer@45.0.0
  - @atlaskit/util-data-test@11.1.5

## 14.0.0

- [major][eb4323c388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb4323c388):

  - removed cards appearance related code used by stride

## 13.2.0

- [minor][b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):

  - reset jest modules before hydration

## 13.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 13.1.0

- [minor][b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):

  - improvement of SSR tests and examples for Fabric Elements

## 13.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 12.0.2

- Updated dependencies [7261577953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7261577953):
  - @atlaskit/elements-test-helpers@0.3.0

## 12.0.1

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-common@34.0.0
  - @atlaskit/renderer@43.0.0
  - @atlaskit/util-data-test@10.2.5

## 12.0.0

- [major][72c6f68226](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72c6f68226):

  - removed ResourcedItemList component from task-decision

## 11.3.2

- Updated dependencies [4d17df92f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d17df92f8):
  - @atlaskit/renderer@42.0.0

## 11.3.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/renderer@41.2.1
  - @atlaskit/analytics-listeners@4.2.1
  - @atlaskit/analytics-namespaced-context@2.2.1
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/editor-common@33.0.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/avatar-group@3.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0

## 11.3.0

- [minor][4072865c1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4072865c1c):

  - added SSR tests to task-decision

## 11.2.3

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/editor-common@33.0.0
  - @atlaskit/renderer@41.0.0
  - @atlaskit/util-data-test@10.2.2

## 11.2.2

- Updated dependencies [4a84fc40e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a84fc40e0):
  - @atlaskit/renderer@40.0.0

## 11.2.1

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/editor-common@32.0.0
  - @atlaskit/renderer@39.0.0
  - @atlaskit/util-data-test@10.2.1

## 11.2.0

- [minor][be86cbebc3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be86cbebc3):

  - enable noImplicitAny for task-decision, and related changes

## 11.1.8

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-common@31.0.0
  - @atlaskit/renderer@38.0.0
  - @atlaskit/util-data-test@10.0.36

## 11.1.7

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/avatar-group@2.1.10
  - @atlaskit/button@10.1.2
  - @atlaskit/editor-common@30.0.1
  - @atlaskit/renderer@37.0.1
  - @atlaskit/icon@16.0.0

## 11.1.6

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/editor-common@30.0.0
  - @atlaskit/renderer@37.0.0
  - @atlaskit/util-data-test@10.0.34

## 11.1.5

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/editor-common@29.0.0
  - @atlaskit/renderer@36.0.0
  - @atlaskit/util-data-test@10.0.33

## 11.1.4

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-common@28.0.0
  - @atlaskit/renderer@35.0.0
  - @atlaskit/util-data-test@10.0.31

## 11.1.3

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/editor-common@27.0.0
  - @atlaskit/renderer@34.0.0
  - @atlaskit/util-data-test@10.0.30

## 11.1.2

- Updated dependencies [e858305](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e858305):
  - @atlaskit/renderer@33.0.4
  - @atlaskit/editor-common@26.0.0

## 11.1.1

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/editor-common@25.0.0
  - @atlaskit/renderer@33.0.0
  - @atlaskit/util-data-test@10.0.28

## 11.1.0

- [minor][d9815ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9815ba):

  - ED-5888 Add dark mode for task-decision

## 11.0.10

- Updated dependencies [1205725](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1205725):
  - @atlaskit/editor-common@24.0.0
  - @atlaskit/renderer@32.1.0

## 11.0.9

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/editor-common@23.0.0
  - @atlaskit/renderer@32.0.0
  - @atlaskit/util-data-test@10.0.26

## 11.0.8

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/avatar-group@2.1.9
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/renderer@31.1.3
  - @atlaskit/analytics-listeners@4.1.4
  - @atlaskit/analytics-namespaced-context@2.1.5
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/docs@6.0.0

## 11.0.7

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/avatar-group@2.1.8
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/spinner@9.0.12
  - @atlaskit/editor-common@22.2.3
  - @atlaskit/renderer@31.0.7
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 11.0.6

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/avatar-group@2.1.7
  - @atlaskit/button@10.0.1
  - @atlaskit/editor-common@22.0.2
  - @atlaskit/renderer@31.0.3
  - @atlaskit/icon@15.0.0

## 11.0.5

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/avatar-group@2.1.6
  - @atlaskit/icon@14.6.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/renderer@31.0.2
  - @atlaskit/analytics-listeners@4.1.1
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 11.0.4

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/editor-common@22.0.0
  - @atlaskit/renderer@31.0.0
  - @atlaskit/util-data-test@10.0.21

## 11.0.3

- [patch][a706ffd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a706ffd):

  ED-4427 Editor disabled state applies to floating toolbars and task decision checkboxes

## 11.0.2

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/editor-common@21.0.0
  - @atlaskit/renderer@30.0.0
  - @atlaskit/util-data-test@10.0.20

## 11.0.1

- [patch] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/editor-common@20.0.0
  - @atlaskit/renderer@29.0.0
  - @atlaskit/util-data-test@10.0.16

## 11.0.0

- [major] FS-1311 - i18n support for task-decsions. task-decisions now require the placeholder text to be passed in. [8a1ccf2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a1ccf2)

## 10.0.3

- [patch] Updated dependencies [6e510d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e510d8)
  - @atlaskit/editor-common@19.3.2
  - @atlaskit/renderer@28.0.0

## 10.0.2

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/editor-common@19.0.0
  - @atlaskit/renderer@27.0.0
  - @atlaskit/util-data-test@10.0.14

## 10.0.1

- [patch] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/editor-common@18.0.0
  - @atlaskit/renderer@26.0.0
  - @atlaskit/util-data-test@10.0.12

## 10.0.0

- [major] Upgrade task and decisions and editor to use @atlaskit/analytics-next. Remove usage of @atlaskit/analytics. [23c7eca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23c7eca)

## 9.0.2

- [patch] Async load avatargroup because it also pulls in dropdown [fb13496](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb13496)

## 9.0.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/avatar-group@2.1.3
  - @atlaskit/button@9.0.13
  - @atlaskit/editor-common@17.0.7
  - @atlaskit/renderer@24.2.1
  - @atlaskit/icon@14.0.0

## 9.0.0

- [major] Update RXJS dependency to ^5.5.0 [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)

## 8.1.10

- [patch] Updated dependencies [2a6410f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a6410f)
  - @atlaskit/editor-common@16.2.0
  - @atlaskit/renderer@23.0.0

## 8.1.9

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/editor-common@16.0.0
  - @atlaskit/renderer@22.0.0
  - @atlaskit/util-data-test@10.0.9

## 8.1.8

- [patch] FS-2941 Stop using Request object and upgrade fetch-mock [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 8.1.7

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/editor-common@15.0.0
  - @atlaskit/renderer@21.0.0
  - @atlaskit/util-data-test@10.0.8

## 8.1.6

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/renderer@20.0.11
  - @atlaskit/util-data-test@10.0.7
  - @atlaskit/editor-common@14.0.11

## 8.1.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/renderer@20.0.7
  - @atlaskit/spinner@9.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar-group@2.1.1
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 8.1.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/editor-common@14.0.1
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/analytics@4.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar-group@2.0.7
  - @atlaskit/avatar@14.0.6

## 8.1.3

- [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/renderer@20.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/renderer@20.0.0
- [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/renderer@20.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
- [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/renderer@20.0.0
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
- [patch] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/editor-common@14.0.0
  - @atlaskit/renderer@20.0.0

## 8.1.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/renderer@19.2.6
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/editor-common@13.2.7
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1
  - @atlaskit/analytics@4.0.3
  - @atlaskit/avatar-group@2.0.4
  - @atlaskit/avatar@14.0.5

## 8.1.1

- [patch] FS-1712 - Ensure empty state loading spinner is not taller than container [4defa84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4defa84)
- [none] Updated dependencies [4defa84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4defa84)

## 8.1.0

- [minor] Refreshing of a ResourcedItemList now replaces all content rather than merging. This is required as actions may now be deleted. [edcbf25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/edcbf25)
- [none] Updated dependencies [edcbf25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/edcbf25)

## 8.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/renderer@19.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/renderer@19.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/editor-common@13.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0

## 7.1.14

- [none] Updated dependencies [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)
  - @atlaskit/renderer@18.2.18
  - @atlaskit/editor-common@12.0.0
- [patch] Updated dependencies [5958588](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5958588)
  - @atlaskit/renderer@18.2.18
  - @atlaskit/editor-common@12.0.0

## 7.1.13

- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-service-support@2.0.12
  - @atlaskit/util-data-test@9.1.18

## 7.1.12

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/avatar-group@1.0.2
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/avatar-group@1.0.2

## 7.1.11

- [patch] FS-1704 - Bug fix - copy and pasting of rendered actions/decisions into the editor [9d47846](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d47846)
- [none] Updated dependencies [9d47846](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d47846)
  - @atlaskit/editor-common@11.4.1

## 7.1.10

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/avatar-group@1.0.0

## 7.1.9

- [patch] onChange for a ResourcedTaskItem will be called on changes even if no taskDecisionProvider is provided [07cb42f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07cb42f)
- [none] Updated dependencies [07cb42f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07cb42f)

## 7.1.8

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/util-data-test@9.1.15
  - @atlaskit/renderer@18.2.9
  - @atlaskit/editor-common@11.3.8

## 7.1.7

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/util-data-test@9.1.14
  - @atlaskit/renderer@18.2.7
  - @atlaskit/editor-common@11.3.7

## 7.1.6

- [patch] Make code blocks and actions have opaque backgrounds [5b79a19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b79a19)

- [patch] Updated dependencies [5b79a19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b79a19)
- [none] Updated dependencies [d708792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d708792)

## 7.1.5

- [patch] FS-2028 force line-height of 20px in T&D Item [445b7c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/445b7c9)
- [none] Updated dependencies [445b7c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/445b7c9)

## 7.1.4

- [patch] FS-2051 do not disable TaskItem when there is no provider [6861797](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6861797)
- [none] Updated dependencies [6861797](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6861797)

## 7.1.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 7.1.2

- [patch] Updated dependencies [4faccc0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4faccc0)
  - @atlaskit/renderer@18.2.5
  - @atlaskit/editor-common@11.3.0

## 7.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/renderer@18.1.2
  - @atlaskit/editor-common@11.2.1
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/icon@12.1.2

## 7.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/renderer@18.1.0
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/editor-common@11.1.0
- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/renderer@18.1.0
  - @atlaskit/editor-common@11.1.0
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/util-service-support@2.0.10
  - @atlaskit/theme@4.0.2
  - @atlaskit/analytics@3.0.4
  - @atlaskit/button@8.1.0

## 7.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/renderer@18.0.0
  - @atlaskit/editor-common@11.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8
  - @atlaskit/analytics@3.0.2
  - @atlaskit/avatar@11.0.0

## 6.0.9

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/util-data-test@9.1.9
  - @atlaskit/renderer@17.0.9
  - @atlaskit/editor-common@10.1.9

## 6.0.8

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 6.0.7

- [patch] FS-1911 Fix Action stays unchecked for some time if it is checked off while editing message [758b342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/758b342)
- [patch] Updated dependencies [758b342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/758b342)
  - @atlaskit/renderer@17.0.2

## 6.0.6

- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/renderer@17.0.0
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/editor-common@10.0.0
- [none] Updated dependencies [714ab32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/714ab32)
  - @atlaskit/renderer@17.0.0
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/editor-common@10.0.0
- [patch] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/editor-common@10.0.0
  - @atlaskit/renderer@17.0.0
- [patch] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/editor-common@10.0.0
  - @atlaskit/renderer@17.0.0

## 6.0.5

- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/renderer@16.2.6
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/editor-common@9.3.9
- [none] Updated dependencies [74f84c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74f84c6)
  - @atlaskit/editor-common@9.3.9
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/renderer@16.2.6
- [none] Updated dependencies [92cdf83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cdf83)
  - @atlaskit/renderer@16.2.6
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/editor-common@9.3.9
- [none] Updated dependencies [4151cc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4151cc5)
  - @atlaskit/renderer@16.2.6
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/editor-common@9.3.9
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/renderer@16.2.6
  - @atlaskit/editor-common@9.3.9
  - @atlaskit/icon@11.3.0
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/util-service-support@2.0.7
  - @atlaskit/analytics@3.0.1
- [patch] Updated dependencies [89146bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89146bf)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/renderer@16.2.6
  - @atlaskit/editor-common@9.3.9

## 6.0.1

- [patch] Updated placeholder displayed when rendering an empty action [9f87255](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f87255)

## 6.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 5.2.1

- [patch] FS-1855 Cache new state received via pubsub [f77a424](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f77a424)

## 5.2.0

- [minor] FS-1855 Add missing dependency to @atlassian/pubsub [31ae3d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/31ae3d4)

## 5.1.0

- [minor] FS-1855 A&D web component should listen to pubsub event [d7fd82d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7fd82d)

## 5.0.0

- [major] FS-1697 move elements packages to use util-data-test for test data [deb820a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deb820a)

## 4.10.12

- [patch] FS-1697 export util functions for use in util-data-test [7f68256](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f68256)

## 4.10.11

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 4.10.3

- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 4.10.1

- [patch] Fix for styled-components types to support v1.4.x [75a2375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75a2375)

## 4.10.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 4.9.1

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 4.9.0

- [patch] Fix package [4bf9e49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4bf9e49)
- [minor] Migrated package to new repo [537be77](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/537be77)

## 4.8.1 (2018-02-06)

- bug fix; copied updated json to dist for use in mk-2 ([17f61cf](https://bitbucket.org/atlassian/atlaskit/commits/17f61cf))

## 4.8.0 (2018-01-30)

- feature; resourcedItemList uses contentAsFabricDocument rather than rawContent as content to (issues closed: fs-1677) ([a0d08af](https://bitbucket.org/atlassian/atlaskit/commits/a0d08af))

## 4.7.2 (2018-01-29)

- bug fix; object/containerAri is optional to toggle isDone for ResourcedTaskItem (issues closed: fs-1674) ([1f77a21](https://bitbucket.org/atlassian/atlaskit/commits/1f77a21))

## 4.7.1 (2018-01-18)

- bug fix; move getCurrentUser to TaskDecisionResource ([222ef0e](https://bitbucket.org/atlassian/atlaskit/commits/222ef0e))

## 4.7.0 (2018-01-16)

- feature; product can pass username to resource to prevent delayed completed by message (issues closed: fs-1539) ([b85c8ac](https://bitbucket.org/atlassian/atlaskit/commits/b85c8ac))

## 4.6.1 (2017-12-19)

- bug fix; bump packages to fixed version of analytics ([615e41c](https://bitbucket.org/atlassian/atlaskit/commits/615e41c))
- bug fix; explicit bump of analytics in task-decision ([dd94543](https://bitbucket.org/atlassian/atlaskit/commits/dd94543))

## 4.6.0 (2017-12-11)

- bug fix; use onChange prop in ResourcedTaskItem ([e56bc38](https://bitbucket.org/atlassian/atlaskit/commits/e56bc38))
- bug fix; bumped renderer and editor-common versions ([cb4fff5](https://bitbucket.org/atlassian/atlaskit/commits/cb4fff5))
- feature; fS-1461 objectAri and containerAri are optional props within ResourcedTaskItem ([4ec360c](https://bitbucket.org/atlassian/atlaskit/commits/4ec360c))

## 4.5.0 (2017-12-05)

- bug fix; restore public analytics handling in TaskItem ([6a0153d](https://bitbucket.org/atlassian/atlaskit/commits/6a0153d))
- feature; fS-1461 duplicate props between TaskItem and ResourcedTaskItem ([d27cd65](https://bitbucket.org/atlassian/atlaskit/commits/d27cd65))

## 4.4.1 (2017-11-28)

- bug fix; fix export of sample-elements support data ([0a5fc11](https://bitbucket.org/atlassian/atlaskit/commits/0a5fc11))

## 4.4.0 (2017-11-28)

- feature; update react peer dep to support ^16.0.0 ([5b041bb](https://bitbucket.org/atlassian/atlaskit/commits/5b041bb))
- feature; moved from util-shared-styles to using theme package (issues closed: fs-1527) ([213377d](https://bitbucket.org/atlassian/atlaskit/commits/213377d))
- feature; update dev dependencies to latest (issues closed: fs-1527) ([dcf7ef7](https://bitbucket.org/atlassian/atlaskit/commits/dcf7ef7))
- feature; updated internal dependencies for repo migration (issues closed: fs-1527) ([0a8fde7](https://bitbucket.org/atlassian/atlaskit/commits/0a8fde7))

## 4.3.0 (2017-11-16)

- feature; fS-1387 Bump avatar version and set Participants boundaries to scrollParent ([c7e44e9](https://bitbucket.org/atlassian/atlaskit/commits/c7e44e9))

## 4.2.0 (2017-10-05)

- feature; action/decision related analytics (issues closed: fs-1290) ([38ade4e](https://bitbucket.org/atlassian/atlaskit/commits/38ade4e))

## 4.1.0 (2017-10-05)

- feature; action/decision related analytics (issues closed: fs-1290) ([38ade4e](https://bitbucket.org/atlassian/atlaskit/commits/38ade4e))

## 4.0.5 (2017-09-21)

- bug fix; Revert code splitting of mentions/task-decisions as it introduces a performance problem (issues closed: fs-1396 / hnw-3183) ([bbecb14](https://bitbucket.org/atlassian/atlaskit/commits/bbecb14))

## 4.0.4 (2017-09-21)

- bug fix; fix :derp: ([088588f](https://bitbucket.org/atlassian/atlaskit/commits/088588f))
- bug fix; fix typescript validation error in test. ([a6f3d53](https://bitbucket.org/atlassian/atlaskit/commits/a6f3d53))

## 4.0.3 (2017-09-20)

- bug fix; workaround chromium 56 bug for background svg's blurring (issues closed: fs-1392) ([727ed6c](https://bitbucket.org/atlassian/atlaskit/commits/727ed6c))

## 4.0.2 (2017-09-19)

- bug fix; fixed jest tests when require.ensure is undefined ([245707a](https://bitbucket.org/atlassian/atlaskit/commits/245707a))
- bug fix; fixed tests for task-decision ([619792f](https://bitbucket.org/atlassian/atlaskit/commits/619792f))
- bug fix; code splitted avatar in mention and task-decision packages (issues closed: ed-2776) ([19f8276](https://bitbucket.org/atlassian/atlaskit/commits/19f8276))

## 4.0.1 (2017-09-18)

- bug fix; make sure box shadow for card style is rendered inside the enclosing container. (issues closed: fs-1382) ([4b441f9](https://bitbucket.org/atlassian/atlaskit/commits/4b441f9))

## 4.0.0 (2017-09-12)

- feature; support attribution label depending on state/creator/updaters. (issues closed: fs-1368) ([8955414](https://bitbucket.org/atlassian/atlaskit/commits/8955414))
- bug fix; fix content height in card appearance in IE11. ([e51886b](https://bitbucket.org/atlassian/atlaskit/commits/e51886b))
- breaking; Removed incomplete/unused ResourcedDecisionList and ResourcedTaskList. Changed values of appearance ([5aeb4f9](https://bitbucket.org/atlassian/atlaskit/commits/5aeb4f9))
- breaking; support participant rendering in action/decision cards (issues closed: fs-1307) ([5aeb4f9](https://bitbucket.org/atlassian/atlaskit/commits/5aeb4f9))

## 3.7.0 (2017-09-06)

- feature; add toolbar button support for actions/decisions (issues closed: fs-1342) ([faddb0b](https://bitbucket.org/atlassian/atlaskit/commits/faddb0b))

## 3.6.0 (2017-09-05)

- feature; visual updates based on action and decision designs. (issues closed: fs-1232) ([8b2126f](https://bitbucket.org/atlassian/atlaskit/commits/8b2126f))

## 3.5.5 (2017-09-01)

- bug fix; break and wrap text that doesn't fit on a full line (e.g. link) (issues closed: fs-1300) ([2f8d413](https://bitbucket.org/atlassian/atlaskit/commits/2f8d413))

## 3.5.4 (2017-08-29)

- bug fix; results clears if initialQuery prop changes. Consistent spinner. (issues closed: fs-1315) ([0933f72](https://bitbucket.org/atlassian/atlaskit/commits/0933f72))

## 3.5.3 (2017-08-25)

- bug fix; show placeholder with ellipsis it it will overflow (issues closed: fs-1286) ([d18ccba](https://bitbucket.org/atlassian/atlaskit/commits/d18ccba))

## 3.5.2 (2017-08-25)

- bug fix; direct import date-fns for support classes too (issues closed: fs-1280) ([0dfa9e8](https://bitbucket.org/atlassian/atlaskit/commits/0dfa9e8))
- bug fix; switch to lighter weight date-fns (issues closed: fs-1281) ([dd21922](https://bitbucket.org/atlassian/atlaskit/commits/dd21922))

## 3.5.1 (2017-08-23)

- bug fix; optimistically notify when a task state changes. (issues closed: fs-1285) ([d9a4557](https://bitbucket.org/atlassian/atlaskit/commits/d9a4557))

## 3.5.0 (2017-08-23)

- feature; support emptyComponent and errorComponent for ResourceItemList (issues closed: fs-1292) ([4b012e2](https://bitbucket.org/atlassian/atlaskit/commits/4b012e2))

## 3.4.1 (2017-08-18)

- bug fix; add missing dependency from InfiniteScroll ([e43126c](https://bitbucket.org/atlassian/atlaskit/commits/e43126c))

## 3.4.0 (2017-08-17)

- feature; support retry for recentUpdates if expecting item is not found. (issues closed: fs-1284) ([ed9af1e](https://bitbucket.org/atlassian/atlaskit/commits/ed9af1e))

## 3.3.1 (2017-08-17)

- bug fix; ensure RendererContext is passed to renderDocument prop when rendering a ResourcedIt (issues closed: fs-1282) ([ec2a02a](https://bitbucket.org/atlassian/atlaskit/commits/ec2a02a))

## 3.3.0 (2017-08-17)

- feature; support infinite scroll for ResourcedItemList (issues closed: fs-1268) ([a7bbfe2](https://bitbucket.org/atlassian/atlaskit/commits/a7bbfe2))

## 3.2.0 (2017-08-17)

- feature; support refreshing of ResourcedItemList and task state updates from an external tri (issues closed: fs-1267) ([bc2d4f1](https://bitbucket.org/atlassian/atlaskit/commits/bc2d4f1))

## 3.1.2 (2017-08-17)

- bug fix; fix exporting of support json data (issues closed: fs-1274) ([b1ec12f](https://bitbucket.org/atlassian/atlaskit/commits/b1ec12f))

## 3.1.1 (2017-08-16)

- bug fix; fix incorrect prop type for taskDecisionProvider - it should be a Promise<TaskDecisi (issues closed: fs-1274) ([6a11027](https://bitbucket.org/atlassian/atlaskit/commits/6a11027))

# 3.1.0 (2017-08-14)

- feature; make default query ordering CREATION_DATE (issues closed: fs-1259) ([96e546d](https://bitbucket.org/atlassian/atlaskit/commits/96e546d))
- bug fix; export ResourcedItemList ([4385f29](https://bitbucket.org/atlassian/atlaskit/commits/4385f29))
- feature; add support for grouping items by sort date in ResourcedItemList. (issues closed: fs-1259) ([dbff6cf](https://bitbucket.org/atlassian/atlaskit/commits/dbff6cf))

## 3.0.0 (2017-08-14)

- breaking; TaskDecisionProvider has new required methods. ([9e48cf4](https://bitbucket.org/atlassian/atlaskit/commits/9e48cf4))
- breaking; support service integration with tasks and all item types (issues closed: fs-1249) ([9e48cf4](https://bitbucket.org/atlassian/atlaskit/commits/9e48cf4))

## 2.4.0 (2017-08-09)

- feature; adding support for placeholders ([d9edd1a](https://bitbucket.org/atlassian/atlaskit/commits/d9edd1a))

## 2.3.0 (2017-08-09)

- feature; adding usupport to fetch initial state and toggle state ([416ce4e](https://bitbucket.org/atlassian/atlaskit/commits/416ce4e))
- feature; adding resourcedtaskitem ([1c8cccb](https://bitbucket.org/atlassian/atlaskit/commits/1c8cccb))

## 2.2.3 (2017-08-08)

- bug fix; import es5 renderer ([221da82](https://bitbucket.org/atlassian/atlaskit/commits/221da82))

## 2.2.2 (2017-08-07)

- bug fix; fix correct dep for @atlaskit/spinner ([155979d](https://bitbucket.org/atlassian/atlaskit/commits/155979d))

## 2.2.1 (2017-08-03)

- bug fix; fixes broken storybooks due to ED-2389 ([184d93a](https://bitbucket.org/atlassian/atlaskit/commits/184d93a))

## 2.2.0 (2017-08-02)

- bug fix; fix renderer dependency ([2ff20ff](https://bitbucket.org/atlassian/atlaskit/commits/2ff20ff))
- bug fix; fix type export for serviceDecision in test-data ([4ad5bac](https://bitbucket.org/atlassian/atlaskit/commits/4ad5bac))
- feature; add support for service integration for decisions (issues closed: fs-1187) ([6683f58](https://bitbucket.org/atlassian/atlaskit/commits/6683f58))

## 2.1.3 (2017-08-01)

- bug fix; using new renderer from editor-core ([32726cf](https://bitbucket.org/atlassian/atlaskit/commits/32726cf))

## 2.1.2 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 2.1.1 (2017-07-20)

- fix; fixes some IE11-bugs ([de3a2ce](https://bitbucket.org/atlassian/atlaskit/commits/de3a2ce))

## 2.1.0 (2017-07-20)

- feature; adding taskitem and tasklist ([7385442](https://bitbucket.org/atlassian/atlaskit/commits/7385442))

## 1.0.0 (2017-07-19)

- feature; new task-decision component. With decision components ([ea94187](https://bitbucket.org/atlassian/atlaskit/commits/ea94187))
