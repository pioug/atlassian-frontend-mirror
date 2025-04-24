# @atlaskit/help-article

## 6.0.3

### Patch Changes

- [#144736](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144736)
  [`ff74b78729adb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ff74b78729adb) -
  Internal change to move to Compiled CSS-in-JS styling.

## 6.0.2

### Patch Changes

- [#142746](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142746)
  [`2fdbd6f2e517d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2fdbd6f2e517d) -
  Migrated `@atlaskit/primitives` to `@atlaskit/primitives/compiled`

## 6.0.1

### Patch Changes

- [#141987](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141987)
  [`f410194e60135`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f410194e60135) -
  Updated sideEffects and techstack in package.json

## 6.0.0

### Major Changes

- [#141923](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141923)
  [`a87265e55c27f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a87265e55c27f) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/help-article`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 5.0.0

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

## 4.4.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 4.3.2

### Patch Changes

- [#103685](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103685)
  [`eaf3b0b6f8112`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eaf3b0b6f8112) -
  Typography uplift for help packages

## 4.3.1

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [#100272](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100272)
  [`f605240d5de34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f605240d5de34) -
  changed h2 elements to Headings from atlaskit

## 4.2.5

### Patch Changes

- Updated dependencies

## 4.2.4

### Patch Changes

- Updated dependencies

## 4.2.3

### Patch Changes

- Updated dependencies

## 4.2.2

### Patch Changes

- Updated dependencies

## 4.2.1

### Patch Changes

- [#144706](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144706)
  [`8b74177bff7a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b74177bff7a7) -
  Updated to React 18

## 4.2.0

### Minor Changes

- [#144303](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144303)
  [`de9cfac4c3629`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de9cfac4c3629) -
  [ux] Enable new icons behind a feature flag.

## 4.1.13

### Patch Changes

- Updated dependencies

## 4.1.12

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 4.1.11

### Patch Changes

- [#80509](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80509)
  [`fcf7481f594f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcf7481f594f) -
  Upgrade dependency of `@emotion/styled` to version 11

## 4.1.10

### Patch Changes

- [#77102](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77102)
  [`b93a56e5ee66`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b93a56e5ee66) -
  Internal change to enforce token usage for spacing properties. There is no expected visual or
  behaviour change.

## 4.1.9

### Patch Changes

- [#72381](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72381)
  [`613a669ad9bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/613a669ad9bb) -
  Enrolling help packages to push model in JFE.

## 4.1.8

### Patch Changes

- [#68561](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68561)
  [`6a1919bf8400`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a1919bf8400) -
  Migrate packages to use declarative entry points

## 4.1.7

### Patch Changes

- Updated dependencies

## 4.1.6

### Patch Changes

- Updated dependencies

## 4.1.5

### Patch Changes

- [#41087](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41087)
  [`7d066a73736`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d066a73736) - Fix ts
  errors by adding type definition and removing unused parameter

## 4.1.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 4.1.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 4.1.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 4.1.1

### Patch Changes

- [#33218](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33218)
  [`7e051bad115`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e051bad115) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 4.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 4.0.38

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 4.0.37

### Patch Changes

- Updated dependencies

## 4.0.36

### Patch Changes

- Updated dependencies

## 4.0.35

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`224a2482244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/224a2482244) -
  [ED-16166] Changes the renderer prop document type from any to DocNode

  BREAKING for `@atlaskit/renderer`: Previously the `document` prop for the renderer component had
  the type of `any`. This has now been changed to `DocNode` which comes from `@atlaskit/adf-schema`.

  Documents being passed into the renderer component will need to be updated to use this type.

  Example Usage:

  ```tsx
  import { DocNode } from '@atlaskit/adf-schema';

  const emptyDoc: DocNode = {
  	type: 'doc',
  	version: 1,
  	content: [],
  };
  ```

- Updated dependencies

## 4.0.34

### Patch Changes

- Updated dependencies

## 4.0.33

### Patch Changes

- [#26424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26424)
  [`0c19f354255`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c19f354255) -
  Consolidate In Product Help & Self-Help Experiences ownership

## 4.0.32

### Patch Changes

- Updated dependencies

## 4.0.31

### Patch Changes

- Updated dependencies

## 4.0.30

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.0.29

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.0.28

### Patch Changes

- Updated dependencies

## 4.0.27

### Patch Changes

- Updated dependencies

## 4.0.26

### Patch Changes

- Updated dependencies

## 4.0.25

### Patch Changes

- Updated dependencies

## 4.0.24

### Patch Changes

- Updated dependencies

## 4.0.23

### Patch Changes

- Updated dependencies

## 4.0.22

### Patch Changes

- Updated dependencies

## 4.0.21

### Patch Changes

- Updated dependencies

## 4.0.20

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 4.0.19

### Patch Changes

- Updated dependencies

## 4.0.18

### Patch Changes

- Updated dependencies

## 4.0.17

### Patch Changes

- Updated dependencies

## 4.0.16

### Patch Changes

- Updated dependencies

## 4.0.15

### Patch Changes

- Updated dependencies

## 4.0.14

### Patch Changes

- Updated dependencies

## 4.0.13

### Patch Changes

- Updated dependencies

## 4.0.12

### Patch Changes

- Updated dependencies

## 4.0.11

### Patch Changes

- Updated dependencies

## 4.0.10

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 4.0.9

### Patch Changes

- [#16630](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16630)
  [`360ccde3275`](https://bitbucket.org/atlassian/atlassian-frontend/commits/360ccde3275) - [ux]
  Open all links in a new tab

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [#13328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13328)
  [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update
  the team information in the packages maintained by the In Product Help team

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [#11927](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11927)
  [`bc46b0b34ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc46b0b34ed) - [ux]
  @atlaskit/help-article: Updated component interfaze and removed unused props onArticleRenderBegin
  and onArticleRenderDone. @atlaskit/help-artilce: major changes in the component interfaze, added
  "What's new" articles search and articles view. Moved the search input to the header. Updated
  navigation logic and unit tests

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#10745](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10745)
  [`f88acfa4736`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f88acfa4736) - [ux] Add
  support for ADF documents. The prop "body" now accepts String and ADF object. The prop "bodyType"
  was added so the developer can specify which type of content the the "body" prop has ("html" or
  "adf")

## 2.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 2.0.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 2.0.1

### Patch Changes

- [#3226](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3226)
  [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages

## 2.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 1.0.8

### Patch Changes

- [#2742](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2742)
  [`f2a658ac8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2a658ac8a) - Fixed
  atlaskit default styles

## 1.0.7

### Patch Changes

- [#2731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2731)
  [`a5815adf37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5815adf37) - Fixed
  es2019 distributable missing a version.json file

## 1.0.6

### Patch Changes

- [#2099](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2099)
  [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add
  missing tslib dependency

## 1.0.5

### Patch Changes

- [patch][f45c19a96e](https://bitbucket.org/atlassian/atlassian-frontend/commits/f45c19a96e):

  Remove unused dependencies

## 1.0.4

### Patch Changes

- [patch][5960cd3114](https://bitbucket.org/atlassian/atlassian-frontend/commits/5960cd3114):

  Don't return anything if iframeContainer can't be found in the window object

## 1.0.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/theme@9.5.1
  - @atlaskit/css-reset@5.0.10

## 1.0.2

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 1.0.1

### Patch Changes

- [patch][990fba576b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/990fba576b):

  Bugfix - Allow popups to scape sandbox

## 1.0.0

### Major Changes

- [major][4a1af8b733](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a1af8b733):

  Clean up code and delete unused files

## 0.7.4

### Patch Changes

- [patch][5a35773cba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a35773cba):

  Bugfix - Fix iframe scroll in Safari

## 0.7.3

### Patch Changes

- [patch][6f156e8e80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f156e8e80):

  Bugfix - Add extra padding to the iframe. Replaced the article injection using srcdoc for a plain
  JS one (Microsoft Edge and IE11 doesn't support srcdoc)

## 0.7.2

### Patch Changes

- [patch][c17a72abc4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c17a72abc4):

  Bugfix - Added allow-popups to the sandbox attribute of the article iframe so we can open popups
  from within

## 0.7.1

### Patch Changes

- [patch][a3d6edb757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3d6edb757):

  Added onArticleRenderBegin and onArticleRenderDone props

## 0.7.0

### Minor Changes

- [minor][87d67944cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d67944cc):

  Added onArticleRenderBegin and onArticleRenderDone props

## 0.6.3

### Patch Changes

- [patch][c3b69b95e7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b69b95e7):

  Removed sandbox attr from iframe

## 0.6.2

### Patch Changes

- [patch][a44f829bdc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a44f829bdc):

  Fixed IE11 CSS issue (hide horizontal scrollbar)

## 0.6.1

### Patch Changes

- [patch][03293fa2a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03293fa2a5):

  Resize iframe after content is loaded

## 0.6.0

### Minor Changes

- [minor][17445706d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17445706d3):

  Use iframe to display articles

## 0.5.5

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.5.4

### Patch Changes

- [patch][a05133283c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a05133283c):

  Add missing dependency in package.json

## 0.5.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 0.5.2

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 0.5.1

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

## 0.5.0

### Minor Changes

- [minor][07c2c73a69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07c2c73a69):

  Removed hardcoded styles. Added unit test

## 0.4.7

### Patch Changes

- [patch][bd4725ae18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd4725ae18):

  Fix list styling (IE11)

## 0.4.6

### Patch Changes

- [patch][c895bb78fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c895bb78fc):

  Updated styles

## 0.4.5

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 0.4.4

- Updated dependencies
  [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 0.4.3

- [patch][75efe3ab05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75efe3ab05):

  - Updated dependencies

## 0.4.2

- [patch][36558f8fb2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36558f8fb2):

  - Updated CSS styles

## 0.4.1

- [patch][7ad5551b05](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ad5551b05):

  - Updated/fix CSS styles

## 0.4.0

- [minor][05460c129b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05460c129b):

  - Added prop titleLinkUrl to make the title of the article a link

## 0.3.1

- [patch][d3a2a15890](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3a2a15890):

  - Made HelpArticle the default export (fix)

## 0.3.0

- [minor][801e8de151](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/801e8de151):

  - Made HelpArticle the default export. Added styles from Contentful

## 0.2.0

- [minor][d880cc2200](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d880cc2200):

  - First release of global-article
