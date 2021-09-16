# @atlaskit/help-article

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

- [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update the team information in the packages maintained by the In Product Help team

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [`bc46b0b34ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc46b0b34ed) - [ux] @atlaskit/help-article: Updated component interfaze and removed unused props onArticleRenderBegin and onArticleRenderDone. @atlaskit/help-artilce: major changes in the component interfaze, added "What's new" articles search and articles view. Moved the search input to the header. Updated navigation logic and unit tests

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`f88acfa4736`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f88acfa4736) - [ux] Add support for ADF documents. The prop "body" now accepts String and ADF object. The prop "bodyType" was added so the developer can specify which type of content the the "body" prop has ("html" or "adf")

## 2.0.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.0.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.0.1

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 2.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 1.0.8

### Patch Changes

- [`f2a658ac8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2a658ac8a) - Fixed atlaskit default styles

## 1.0.7

### Patch Changes

- [`a5815adf37`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5815adf37) - Fixed es2019 distributable missing a version.json file

## 1.0.6

### Patch Changes

- [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency

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

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/theme@9.5.1
  - @atlaskit/css-reset@5.0.10

## 1.0.2

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
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

  Bugfix - Add extra padding to the iframe. Replaced the article injection using srcdoc for a plain JS one (Microsoft Edge and IE11 doesn't support srcdoc)

## 0.7.2

### Patch Changes

- [patch][c17a72abc4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c17a72abc4):

  Bugfix - Added allow-popups to the sandbox attribute of the article iframe so we can open popups from within

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

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

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
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

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

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 0.4.4

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
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
