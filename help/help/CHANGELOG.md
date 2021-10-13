# @atlaskit/help

## 4.3.0

### Minor Changes

- [`bdd0be2c294`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdd0be2c294) - [ux] Update navigation logic

## 4.2.4

### Patch Changes

- [`9f016391674`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f016391674) - [ux] Display error message when the "What's new" API fails

## 4.2.3

### Patch Changes

- [`f9bfb2095bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9bfb2095bd) - [ux] Group release notes by date

## 4.2.2

### Patch Changes

- Updated dependencies

## 4.2.1

### Patch Changes

- [`82bdb8cd2d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82bdb8cd2d6) - [ux] Updated examples with the "What's New" section

## 4.2.0

### Minor Changes

- [`3690098a745`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3690098a745) - [ux] Updated navigation logic for the "What's new" section

## 4.1.1

### Patch Changes

- [`13cba790f49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13cba790f49) - Internal test refactor.
- Updated dependencies

## 4.1.0

### Minor Changes

- [`69b577202b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69b577202b6) - [ux] Fixed the "What's New" section. Changed the icon for the "What's New" button. Update examples to showcase the What's new section

## 4.0.8

### Patch Changes

- [`55df23cb742`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55df23cb742) - Removed a snapshot test because assertion wasn't useful

## 4.0.7

### Patch Changes

- [`524b20aff9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524b20aff9a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`3c0349f272a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c0349f272a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`591d34f966f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/591d34f966f) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs

## 4.0.6

### Patch Changes

- [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update the team information in the packages maintained by the In Product Help team

## 4.0.5

### Patch Changes

- [`0845b2c831a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0845b2c831a) - [ux] Fix articles slide-out animation

## 4.0.4

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- [`4941423cb4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4941423cb4e) - [ux] Change how we load svg images

## 4.0.2

### Patch Changes

- [`f4d35d25719`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4d35d25719) - [ux] Hide "What's New" button if the props "onSearchWhatsNewArticles" and "onGetWhatsNewArticle" are not defined

## 4.0.1

### Patch Changes

- [`b0b740e2657`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0b740e2657) - [ux] Fix double scroll in the content area

## 4.0.0

### Major Changes

- [`bc46b0b34ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc46b0b34ed) - [ux] @atlaskit/help-article: Updated component interfaze and removed unused props onArticleRenderBegin and onArticleRenderDone. @atlaskit/help-artilce: major changes in the component interfaze, added "What's new" articles search and articles view. Moved the search input to the header. Updated navigation logic and unit tests

### Patch Changes

- Updated dependencies

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [`f9d42a3f08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9d42a3f08) - Added "isCollapsed" prop to ArticleList Component and RelatedArticles. Added prop "onRelatedArticlesShowMoreClickOfOpenArticle" to Help component

## 3.0.0

### Major Changes

- [`70492a8e83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70492a8e83) - Updated algolia index used in the examples. Added descriptions to the Int messages. Export DivderLine Styled component

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- Updated dependencies

## 2.2.6

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`f9ec749cd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9ec749cd9) - Fix initial animation of the article container

## 2.1.0

### Minor Changes

- [`3ff41f046e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ff41f046e) - Added history and historySetter props

## 2.0.6

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.0.5

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 2.0.4

### Patch Changes

- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 2.0.3

### Patch Changes

- [`55db8c8e8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55db8c8e8e) - Use the new atlaskit/help-layout

## 2.0.2

### Patch Changes

- [`ba2577fd3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba2577fd3f) - Bugfix feedback form

## 2.0.1

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 2.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [`789fe1c4b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/789fe1c4b2) - Updated feedback form

## 1.1.0

### Minor Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards

### Patch Changes

- Updated dependencies

## 1.0.5

### Patch Changes

- [`b8034da50e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8034da50e) - Fix flickering of the search result list. Updated the desing of the feedback form.

## 1.0.4

### Patch Changes

- [`cc14956821`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc14956821) - Update all the theme imports to a path thats tree shakable

## 1.0.3

### Patch Changes

- [`1d3b23b682`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d3b23b682) - Added link to external search site at the end of the search results list

## 1.0.2

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`58cfa9cd97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58cfa9cd97) - Added unit test. Converted class components to functional components.

## 0.23.8

### Patch Changes

- [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency

## 0.23.7

### Patch Changes

- [patch][f45c19a96e](https://bitbucket.org/atlassian/atlassian-frontend/commits/f45c19a96e):

  Remove unused dependencies- Updated dependencies [f45c19a96e](https://bitbucket.org/atlassian/atlassian-frontend/commits/f45c19a96e):

  - @atlaskit/help-article@1.0.5
  - @atlaskit/right-side-panel@0.3.3

## 0.23.6

### Patch Changes

- [patch][b9873fa1c6](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9873fa1c6):

  Update style of related articles. Stick the searchbox to the top. Scroll content area to the top when the articleId changes

## 0.23.5

### Patch Changes

- [patch][6e2ae58903](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e2ae58903):

  Fix style issues in search. Fix infinite loop in article view

## 0.23.4

### Patch Changes

- [patch][1c35cc419d](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c35cc419d):

  Added related articles of an anrticle. Cleanup code.

## 0.23.3

### Patch Changes

- [patch][0aaad6b51f](https://bitbucket.org/atlassian/atlassian-frontend/commits/0aaad6b51f):

  Fixed issue in the search component. Added white background to the root div.

## 0.23.2

### Patch Changes

- [patch][46b52d2fb0](https://bitbucket.org/atlassian/atlassian-frontend/commits/46b52d2fb0):

  Search bug fixing

## 0.23.1

### Patch Changes

- [patch][e964238f73](https://bitbucket.org/atlassian/atlassian-frontend/commits/e964238f73):

  Fix SVG images for search

## 0.23.0

### Minor Changes

- [minor][d4b09c1cc4](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4b09c1cc4):

  We added the search functionality

## 0.22.14

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/analytics@7.0.1
  - @atlaskit/button@13.3.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/navigation@36.0.1
  - @atlaskit/page@11.0.12
  - @atlaskit/radio@3.1.9
  - @atlaskit/section-message@4.1.5
  - @atlaskit/textarea@2.2.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/help-article@1.0.3
  - @atlaskit/right-side-panel@0.3.2
  - @atlaskit/quick-search@7.8.5

## 0.22.13

### Patch Changes

- [patch][8391da4a31](https://bitbucket.org/atlassian/atlassian-frontend/commits/8391da4a31):

  Fix content scrolling issue

## 0.22.12

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/analytics@7.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/navigation@36.0.0
  - @atlaskit/quick-search@7.8.4
  - @atlaskit/form@7.1.1
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/radio@3.1.8
  - @atlaskit/tooltip@15.2.2
  - @atlaskit/help-article@1.0.2
  - @atlaskit/page@11.0.11
  - @atlaskit/right-side-panel@0.3.1

## 0.22.11

### Patch Changes

- [patch][1644406f8f](https://bitbucket.org/atlassian/atlassian-frontend/commits/1644406f8f):

  Fixed articles animation

## 0.22.10

### Patch Changes

- [patch][6c6712195a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c6712195a):

  Added animations to the related articles list- [patch][7f45f76c6a](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f45f76c6a):

  Fixed animation when user opens an article

## 0.22.9

### Patch Changes

- [patch][f38777e561](https://bitbucket.org/atlassian/atlassian-frontend/commits/f38777e561):

  Added routeGroup and routeName props to the RelatedArticles component

## 0.22.8

### Patch Changes

- [patch][3125392e4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/3125392e4c):

  fixed navigation

## 0.22.7

### Patch Changes

- [patch][83e3d4d079](https://bitbucket.org/atlassian/atlassian-frontend/commits/83e3d4d079):

  Updated Header styles

## 0.22.6

### Patch Changes

- [patch][3e8db7e22d](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e8db7e22d):

  Added onRelatedArticlesShowMoreClick prop to the RelatedArticles Component. Fix bug in WasHelpful Form

## 0.22.5

### Patch Changes

- [patch][29a3b445e9](https://bitbucket.org/atlassian/atlassian-frontend/commits/29a3b445e9):

  Updated close button icon

## 0.22.4

### Patch Changes

- [patch][3007201575](https://bitbucket.org/atlassian/atlassian-frontend/commits/3007201575):

  Fix RelatedArticle DividerLine styles

## 0.22.3

### Patch Changes

- [patch][579fa3956c](https://bitbucket.org/atlassian/atlassian-frontend/commits/579fa3956c):

  Fix Article slide-in animation. Fix RelatedArticle Padding

## 0.22.2

### Patch Changes

- [patch][e5dedf3ee4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5dedf3ee4):

  ArticleListItem - Hide "article type header" if the type is not passed as a prop to the component or is invalid.

## 0.22.1

### Patch Changes

- [patch][e9d3baa181](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9d3baa181):

  Bugfix - Fix RelatedArticles component

## 0.22.0

### Minor Changes

- [minor][748d654809](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/748d654809):

  Updated the design and behaviour of RelatedArticles component

## 0.21.9

### Patch Changes

- Updated dependencies [4a1af8b733](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a1af8b733):
  - @atlaskit/help-article@1.0.0

## 0.21.8

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Pull in update to form to fix a bug which could cause the internal fieldId to be incorrectly set- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/quick-search@7.8.2
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/form@7.0.0
  - @atlaskit/radio@3.1.5
  - @atlaskit/item@10.2.0
  - @atlaskit/navigation@35.3.0
  - @atlaskit/textarea@2.2.3

## 0.21.7

### Patch Changes

- [patch][9f54cbb921](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f54cbb921):

  Added onBackButtonClick prop. Enable back button click function only after fade-in animation

## 0.21.6

### Patch Changes

- [patch][d752bf7ae9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d752bf7ae9):

  Dependency bump atlaskit/help-article

## 0.21.5

### Patch Changes

- [patch][dfe328a14b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfe328a14b):

  Updated dependency @atlaskit/help-article

## 0.21.4

### Patch Changes

- [patch][86198c3e5d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86198c3e5d):

  Bugfix - Fix voice-over accessibility issues

## 0.21.3

### Patch Changes

- [patch][da00b546cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da00b546cb):

  Bugfix - Hide DefaultContent if an article is fully visible

## 0.21.2

### Patch Changes

- [patch][bb95b5ff7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb95b5ff7e):

  Updated dependency help-article

## 0.21.1

### Patch Changes

- [patch][bd17edc20c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd17edc20c):

  Bugfix - hide back button if therere is only one article in the history and there isn't default content

## 0.21.0

### Minor Changes

- [minor][e3b6e83622](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3b6e83622):

  Added onArticleRenderBegin and onArticleRenderDone props

## 0.20.14

- Updated dependencies [87d67944cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d67944cc):
  - @atlaskit/help-article@0.7.0

## 0.20.13

### Patch Changes

- [patch][35236f6049](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35236f6049):

  Don't render DefaultContent if is Null

## 0.20.12

### Patch Changes

- [patch][bf5be91872](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf5be91872):

  handle rejected getArticle promises

## 0.20.11

### Patch Changes

- [patch][48cd7f3d35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48cd7f3d35):

  Updated atlaskit/help-article dependency

## 0.20.10

### Patch Changes

- [patch][d951057197](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d951057197):

  Updated dependency atlaskit/help-article

## 0.20.9

### Patch Changes

- [patch][90a14c313d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90a14c313d):

  Fix type errors

- Updated dependencies [17445706d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/17445706d3):
  - @atlaskit/help-article@0.6.0

## 0.20.8

### Patch Changes

- [patch][5027c848f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5027c848f4):

  changed scrollTo for sctollTop (not supported in IE11 and edge)

## 0.20.7

### Patch Changes

- [patch][89c775c2eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89c775c2eb):

  fix animation when ArticleComponent mounts

## 0.20.6

- Updated dependencies [49c89962de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c89962de):
  - @atlaskit/right-side-panel@0.3.0

## 0.20.5

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.20.4

### Patch Changes

- [patch][edd83f6f68](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/edd83f6f68):

  Fix ArticleContent Animation

## 0.20.3

### Patch Changes

- [patch][acbc924e23](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acbc924e23):

  Improved ArticleContent animations

## 0.20.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 0.20.1

### Patch Changes

- [patch][e1de95957a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1de95957a):

  changed action value 'click' to 'clicked'

## 0.20.0

### Minor Changes

- [minor][de49038228](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de49038228):

  Added onRelatedArticlesListItemClick Prop to RelatedArticles and ArticleListItem

## 0.19.2

### Patch Changes

- [patch][e1cf991123](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1cf991123):

  Removed exported interfaces

## 0.19.1

### Patch Changes

- [patch][9891d2418d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9891d2418d):

  Fixed exports and onClick event of RelatedArticles

## 0.19.0

### Minor Changes

- [minor][7736e89a16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7736e89a16):

  Added loading state for RelatedArticleList

## 0.18.1

### Patch Changes

- [patch][93f0ff1a1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93f0ff1a1f):

  Fix toggle related articles

## 0.18.0

### Minor Changes

- [minor][d4b481ebad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4b481ebad):

  Exposed RelatedArticles component and ArticleItem interface

## 0.17.4

### Patch Changes

- [patch][22d5dbc2bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22d5dbc2bb):

  fixed CSS issue of the ArticleListItem icons

## 0.17.3

### Patch Changes

- [patch][c0c49e4c2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0c49e4c2b):

  CSS fixes + added link icon to ArticleListItem

## 0.17.2

### Patch Changes

- [patch][a171dec505](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a171dec505):

  fix onWasHelpfulNoButtonClick prop

## 0.17.1

- Updated dependencies [617591dd61](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/617591dd61):
  - @atlaskit/right-side-panel@0.2.0

## 0.17.0

### Minor Changes

- [minor][67bb0eb7da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67bb0eb7da):

  Added articleIdSetter prop and updated the article navigation logic

## 0.16.1

### Patch Changes

- [patch][dbd5ab6c91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbd5ab6c91):

  Added href prop to ArticleListComponent

## 0.16.0

### Minor Changes

- [minor][23349602c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23349602c7):

  Added Footer and fixed CSS issues

## 0.15.0

### Minor Changes

- [minor][eb130ee556](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb130ee556):

  Added analytics event to onclick event in ArticleListItem

## 0.14.5

### Patch Changes

- [patch][9c28ef71fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c28ef71fe):

  Add missing peerDependency in package.json

## 0.14.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.14.3

### Patch Changes

- [patch][9e23c34ccb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e23c34ccb):

  Use generic types instead of type annotations for styles-components

## 0.14.2

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 0.14.1

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

## 0.14.0

### Minor Changes

- [minor][30d333543b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30d333543b):

  Fixed articles navigation

## 0.13.1

### Patch Changes

- [patch][95cbef78d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95cbef78d5):

  Updated ArticleListItem Title color

## 0.13.0

### Minor Changes

- [minor][5141af87be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5141af87be):

  Updated design and expose ArticleListItem

## 0.12.0

### Minor Changes

- [minor][7880462487](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7880462487):

  Updated design. Added new props related to feedback from

## 0.11.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 0.11.3

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

## 0.11.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/form@6.1.1
  - @atlaskit/item@10.0.5
  - @atlaskit/navigation@35.1.8
  - @atlaskit/radio@3.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/quick-search@7.5.1
  - @atlaskit/icon@19.0.0

## 0.11.1

- Updated dependencies [07c2c73a69](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07c2c73a69):
  - @atlaskit/help-article@0.5.0

## 0.11.0

### Minor Changes

- [minor][a9001be8fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9001be8fd):

  Updated examples. Renamed component and references from help-panel to help

## 0.9.0

### Minor Changes

- [minor][ed8ef1f7af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed8ef1f7af):

  updated help-article version and fix some IE11 CSS issues

## 0.8.5

### Patch Changes

- [patch][0f869bb237](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f869bb237):

  fix loading error state

## 0.8.4

### Patch Changes

- [patch][2870381e09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2870381e09):

  fix IE11 styles issues

## 0.8.3

### Patch Changes

- [patch][e4ecf9b50e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e4ecf9b50e):

  Fix CSS issues. Display loading state only 1000ms after the request was made

## 0.8.2

### Patch Changes

- [patch][4534dc3d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4534dc3d51):

  Fix for dependency on @atlaskit/tooltip

## 0.8.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/form@6.0.5
  - @atlaskit/item@10.0.2
  - @atlaskit/navigation@35.1.5
  - @atlaskit/radio@3.0.3
  - @atlaskit/section-message@4.0.2
  - @atlaskit/quick-search@7.4.1
  - @atlaskit/icon@18.0.0

## 0.8.0

### Minor Changes

- [minor][26759e6bf3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26759e6bf3):

  Updated help-article version

## 0.7.0

### Minor Changes

- [minor][91136c9a7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91136c9a7a):

  Added loading and error state

## 0.6.0

### Minor Changes

- [minor][6fa3249843](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fa3249843):

  Added tooltip and hover state to close button. Updated panel width

## 0.5.8

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 0.5.7

- Updated dependencies [1da5351f72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da5351f72):
  - @atlaskit/form@6.0.3
  - @atlaskit/radio@3.0.0

## 0.5.6

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/navigation@35.1.3
  - @atlaskit/page@11.0.0

## 0.5.5

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/form@6.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/navigation@35.1.2
  - @atlaskit/theme@9.0.2
  - @atlaskit/help-article@0.4.4
  - @atlaskit/section-message@4.0.0

## 0.5.4

- [patch][84b7ee2f8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84b7ee2f8b):

  - fix articles loading when the articleId changes

## 0.5.3

- [patch][45f063521d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45f063521d):

  - Updated dependencies

## 0.5.2

- [patch][d1854796ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1854796ae):

  - Updated dependencies

## 0.5.1

- [patch][ccacfe8570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ccacfe8570):

  - Updated help-article version

## 0.5.0

- [minor][88b9f3568b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/88b9f3568b):

  - Update transition configuration of the panel. If the initial value of isOpen is true, fire analytics event and request the article

## 0.4.2

- [patch][4053dcd740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4053dcd740):

  - added close button and styles for header when the component renders the default content

## 0.4.1

- [patch][a77b18b718](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a77b18b718):

  - fix - Display DefaultContent

## 0.4.0

- [minor][f479974eb4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f479974eb4):

  - Added version.json and update analytics.json to read the info from there

## 0.3.0

- [minor][875ff270e8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/875ff270e8):

  - Use @atlaskit/help-article instead of custom component

## 0.2.0

- [minor][e6b180d4cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b180d4cd):

  - First release of global-help

- [major] First release of global-help
