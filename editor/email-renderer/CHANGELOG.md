# @atlaskit/email-renderer

## 8.2.5

### Patch Changes

- [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 8.2.4

### Patch Changes

- Updated dependencies

## 8.2.3

### Patch Changes

- Updated dependencies

## 8.2.2

### Patch Changes

- Updated dependencies

## 8.2.1

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 8.2.0

### Minor Changes

- [`65fe45e0cc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65fe45e0cc0) - Promoted border mark to full schema and add border support for email renderer

### Patch Changes

- Updated dependencies

## 8.1.5

### Patch Changes

- [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) - [ED-13910] Fix prosemirror types

## 8.1.4

### Patch Changes

- Updated dependencies

## 8.1.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 8.1.2

### Patch Changes

- [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) - [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds for fixed issues

## 8.1.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 8.1.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 8.0.13

### Patch Changes

- [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed issues"

## 8.0.12

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 8.0.11

### Patch Changes

- [`ecb263f4201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecb263f4201) - added support for custom starting numbers for ordered-list

## 8.0.10

### Patch Changes

- Updated dependencies

## 8.0.9

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 8.0.8

### Patch Changes

- Updated dependencies

## 8.0.7

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 8.0.6

### Patch Changes

- [`d8b3bc73330`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8b3bc73330) - [ED-14507] Deprecate the allowDynamicTextSizing editor prop and remove all code related to it. This feature has been unused since 2020.
- Updated dependencies

## 8.0.5

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 8.0.4

### Patch Changes

- [`b29ce16dad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b29ce16dad8) - [ED-14606] Move bitbucket schema, confluence schema, jira schema, and default schema from @atlaskit/adf-schema to their own entry points. These new entry points are as follows

  @atlaskit/adf-schema/schema-bitbucket for:

  - bitbucketSchema

  @atlaskit/adf-schema/schema-confluence for:

  - confluenceSchema
  - confluenceSchemaWithMediaSingle

  @atlaskit/adf-schema/schema-jira for:

  - default as createJIRASchema
  - isSchemaWithLists
  - isSchemaWithMentions
  - isSchemaWithEmojis
  - isSchemaWithLinks
  - isSchemaWithAdvancedTextFormattingMarks
  - isSchemaWithCodeBlock
  - isSchemaWithBlockQuotes
  - isSchemaWithMedia
  - isSchemaWithSubSupMark
  - isSchemaWithTextColor
  - isSchemaWithTables

  @atlaskit/adf-schema/schema-default for:

  - defaultSchema
  - getSchemaBasedOnStage
  - defaultSchemaConfig

  This change also includes codemods in @atlaskit/adf-schema to update these entry points. It also introduces a new util function "changeImportEntryPoint" to @atlaskit/codemod-utils to handle this scenario.

- Updated dependencies

## 8.0.3

### Patch Changes

- Updated dependencies

## 8.0.2

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 8.0.0

### Major Changes

- [`8f0577e0eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0577e0eb1) - [ux] Promoted captions to full schema and better support of wikimarkup, email and slack renderer

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) - ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

- Updated dependencies

## 7.0.0

### Major Changes

- [`ad7872a08ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad7872a08ed) - Add media inline component to wikimarkup, slack markdown, email renderer transformers

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [`5510b4794db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5510b4794db) - CETI-4 Email renderer now renders the panel of type custom which is defaulted to info panel.

## 6.2.5

### Patch Changes

- Updated dependencies

## 6.2.4

### Patch Changes

- [`414b6216adf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/414b6216adf) - Upgrade date-fns to ^2.17

## 6.2.3

### Patch Changes

- Updated dependencies

## 6.2.2

### Patch Changes

- Updated dependencies

## 6.2.1

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [`63b16140520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63b16140520) - ADFS-70 Allow marks on media single. This is to allow media items to be used as links in the email renderer

## 6.1.9

### Patch Changes

- Updated dependencies

## 6.1.8

### Patch Changes

- [`471e2431a7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/471e2431a7c) - Downgrade back to date-fns 1.30.1
  We discovered big bundle size increases associated with the date-fns upgrade.
  We're reverting the upgarde to investigate

## 6.1.7

### Patch Changes

- [`70f0701c2e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f0701c2e6) - Upgrade date-fns to 2.17

## 6.1.6

### Patch Changes

- [`985d30e44ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/985d30e44ef) - Upgraded dependency 'juice' to ^7.0.0 to remove vulnerable transitive dependency 'request'

## 6.1.5

### Patch Changes

- Updated dependencies

## 6.1.4

### Patch Changes

- [`0d5592e293`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d5592e293) - ADFS-333 Email renderer can now render embedCard as URL link

## 6.1.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 6.1.2

### Patch Changes

- [`703752d487`](https://bitbucket.org/atlassian/atlassian-frontend/commits/703752d487) - ED-10647 Remove caret from prosemirror-model, prosemirror-keymap, prosemirror-state, prosemirror-transform to lock them down to an explicit version
- Updated dependencies

## 6.1.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 6.1.0

### Minor Changes

- [`9a39500244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a39500244) - Bump ProseMirror packages

  Read more: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1671956531/2020-08

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 6.0.1

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 6.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [`8a9e57a986`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a9e57a986) - Add missing label so that email renderer demo appears in Drop-down menu
- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- Updated dependencies

## 5.0.0

### Major Changes

- [major][c7d7467b10](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7d7467b10):

  Changed email-renderer to not be a module ("type":"module" removed from package.json)

### Patch Changes

- [patch][77c3e9887b](https://bitbucket.org/atlassian/atlassian-frontend/commits/77c3e9887b):

  Fix non breaking space in email rendering- Updated dependencies [92d04b5c28](https://bitbucket.org/atlassian/atlassian-frontend/commits/92d04b5c28):

  - @atlaskit/adf-schema@9.0.1

## 4.2.1

### Patch Changes

- Updated dependencies [04e54bf405](https://bitbucket.org/atlassian/atlassian-frontend/commits/04e54bf405):
- Updated dependencies [9f43b9f0ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f43b9f0ca):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [5d430f7d37](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d430f7d37):
  - @atlaskit/adf-schema@9.0.0
  - @atlaskit/docs@8.5.1

## 4.2.0

### Minor Changes

- [minor][358f1c5ffe](https://bitbucket.org/atlassian/atlassian-frontend/commits/358f1c5ffe):

  Updated the way we render ordered and unordered lists.

### Patch Changes

- [patch][c621ea1a96](https://bitbucket.org/atlassian/atlassian-frontend/commits/c621ea1a96):

  ED-8751 Remove 'export \*' from email renderer- Updated dependencies [bc29fbc030](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc29fbc030):

- Updated dependencies [1386afaecc](https://bitbucket.org/atlassian/atlassian-frontend/commits/1386afaecc):
- Updated dependencies [584279e2ae](https://bitbucket.org/atlassian/atlassian-frontend/commits/584279e2ae):
- Updated dependencies [f83b67a761](https://bitbucket.org/atlassian/atlassian-frontend/commits/f83b67a761):
- Updated dependencies [6b4fe5d0e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b4fe5d0e0):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [715572f9e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/715572f9e5):
  - @atlaskit/adf-schema@8.0.0
  - @atlaskit/docs@8.5.0

## 4.1.1

### Patch Changes

- Updated dependencies [7602615cd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7602615cd4):
- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [c171660346](https://bitbucket.org/atlassian/atlassian-frontend/commits/c171660346):
- Updated dependencies [27fde59914](https://bitbucket.org/atlassian/atlassian-frontend/commits/27fde59914):
- Updated dependencies [b18fc8a1b6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b18fc8a1b6):
- Updated dependencies [7baff84f38](https://bitbucket.org/atlassian/atlassian-frontend/commits/7baff84f38):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [a5d0019a5e](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d0019a5e):
  - @atlaskit/adf-schema@7.0.0
  - @atlaskit/docs@8.4.0
  - @atlaskit/util-data-test@13.1.2

## 4.1.0

### Minor Changes

- [minor][e57b753b82](https://bitbucket.org/atlassian/atlassian-frontend/commits/e57b753b82):

  mention contains user id for data

### Patch Changes

- [patch][8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):

  Remove Karma tests - based on AFP-960- Updated dependencies [e8a31c2714](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8a31c2714):

- Updated dependencies [8183f7c8da](https://bitbucket.org/atlassian/atlassian-frontend/commits/8183f7c8da):
  - @atlaskit/adf-schema@6.2.0

## 4.0.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/adf-schema@6.1.1
  - @atlaskit/util-data-test@13.1.1

## 4.0.2

### Patch Changes

- Updated dependencies [3e87f5596a](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e87f5596a):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [26dbe7be6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/26dbe7be6d):
  - @atlaskit/adf-schema@6.0.0
  - @atlaskit/docs@8.3.0

## 4.0.1

### Patch Changes

- Updated dependencies [761dcd6d19](https://bitbucket.org/atlassian/atlassian-frontend/commits/761dcd6d19):
- Updated dependencies [faccb537d0](https://bitbucket.org/atlassian/atlassian-frontend/commits/faccb537d0):
  - @atlaskit/adf-schema@5.0.0

## 4.0.0

### Major Changes

- [major][97441f6abf](https://bitbucket.org/atlassian/atlassian-frontend/commits/97441f6abf):

  break down context object into hydration and conversion

### Minor Changes

- [minor][db2d3620f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2d3620f1):

  ED-7966: Add support for expand and nestedExpand in email renderer

### Patch Changes

- [patch][204c65f686](https://bitbucket.org/atlassian/atlassian-frontend/commits/204c65f686):

  CS-1610: add support to email renderer for nested action lists- Updated dependencies [4eefd368a8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eefd368a8):

- Updated dependencies [e5dd37f7a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5dd37f7a4):
- Updated dependencies [81897eb2e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/81897eb2e6):
  - @atlaskit/adf-schema@4.4.0
  - @atlaskit/util-data-test@13.1.0

## 3.0.2

### Patch Changes

- [patch][cc28419139](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc28419139):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.- [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

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
  - @atlaskit/util-data-test@13.0.0

## 3.0.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 3.0.0

### Major Changes

- [major][80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):

  Remove applicationCard node and action mark

- Updated dependencies [1194ad5eb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1194ad5eb3):
  - @atlaskit/adf-schema@4.0.0

## 2.10.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 2.10.2

### Patch Changes

- [patch][13cc59f1fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13cc59f1fd):

  Minor tweaks in rendering of media previews

## 2.10.1

- Updated dependencies [6164bc2629](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6164bc2629):
  - @atlaskit/adf-schema@3.0.0

## 2.10.0

### Minor Changes

- [minor][44e4f03514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44e4f03514):

  CS-1238 Media nodes render attachments based on context

## 2.9.0

### Minor Changes

- [minor][435258881c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/435258881c):

  CS-1238 Media honor width and flow settings

## 2.8.0

### Minor Changes

- [minor][4c3772ce61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c3772ce61):

  CS-1238 Added generic icon for media attachments

## 2.7.1

### Patch Changes

- [patch][59fb844cd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59fb844cd5):

  CS-1184 Email renderer - prevent tables from flowing outside container

## 2.7.0

### Minor Changes

- [minor][5b89d23a43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b89d23a43):

  CS-1184 Email renderer icons compressed, rendered diff looks better for some nodes

## 2.6.0

### Minor Changes

- [minor][d08834952b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d08834952b):

  CS-1184 CSS prefix shortened

## 2.5.0

### Minor Changes

- [minor][8cd4402937](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8cd4402937):

  CSS corrections

## 2.4.0

### Minor Changes

- [minor][0718ea79a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0718ea79a0):

  Email renderer notification distributor integration

## 2.3.0

### Minor Changes

- [minor][22af1d9ddd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22af1d9ddd):

  FS-4032 - Remove background styling from actions and decisions in email. Unable to support hover.

## 2.2.0

### Minor Changes

- [minor][c617f954b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c617f954b7):

  Extracted CSS for last set of 4 ADF nodes

## 2.1.0

### Minor Changes

- [minor][86218aa155](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86218aa155):

  Email renderer: Extracted CSS for 8 more nodes

## 2.0.0

### Major Changes

- [major][38d11825f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38d11825f2):

  Renderer does not inline CSS anymore, but can be turned on by a flag for testing purposes

## 1.4.0

### Minor Changes

- [minor][60f541121b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60f541121b):

  Added buildstep into atlaskit pipeline

## 1.3.0

### Minor Changes

- [minor][34c6df4fb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34c6df4fb8):

  adf-schema has been extended with one missing color, email-renderer now bundles up styles into .css file

## 1.2.0

### Minor Changes

- [minor][b5c75d12d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5c75d12d5):

  adds support for embedded images in email renderer

## 1.1.1

### Patch Changes

- [patch][fa7d25c521](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa7d25c521):

  Email renderer es5 tsconfig file tweak

## 1.1.0

### Minor Changes

- [minor][59da918bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59da918bba):

  Email renderer builds to es5

## 1.0.0

### Major Changes

- [major][ff85c1c706](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff85c1c706):

  Extracted email renderer outside react renderer
