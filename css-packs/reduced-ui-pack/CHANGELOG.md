# @atlaskit/reduced-ui-pack

## 14.0.1

### Patch Changes

- Updated dependencies

## 14.0.0

### Patch Changes

- Updated dependencies

## 13.1.1

### Patch Changes

- [`01d837cb7f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01d837cb7f5) - Local build tooling has been improved.
- [`d98f1bb1169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d98f1bb1169) - Local build tooling improvements.

## 13.1.0

### Minor Changes

- [`b9265389fa0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9265389fa0) - Icon now exposes a base icon via the `@atlaskit/icon/base` entrypoint. This is used in all generated glyphs inside the icon package.

## 13.0.8

### Patch Changes

- [`37afe4a0fd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37afe4a0fd5) - [ux] Update Dropbox icon and arrow-left icon

## 13.0.7

### Patch Changes

- [`bd2fa06042`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd2fa06042) - Re-generated icons using newer version of build process, and added missing 'archive' and 'mobile' buttons

## 13.0.6

### Patch Changes

- [`5a25ec3086`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a25ec3086) - Regenerate icon-sprite after forcing resolution for xmldom to `^0.2.1`.

## 13.0.5

### Patch Changes

- [`cdfd30ef56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdfd30ef56) - Bumping dep for fbjs util and moving it to a devDep for css-reset
- Updated dependencies

## 13.0.4

### Patch Changes

- Updated dependencies

## 13.0.3

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 13.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 13.0.1

### Patch Changes

- [`c061751e24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c061751e24) - Fix Codesandbox example and update link in documentation

## 13.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 12.1.3

### Patch Changes

- [patch][eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):

  Follow-up on AFP-1401 when removing types to component. Some left over types and small issues- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/section-message@4.1.7

## 12.1.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1
  - @atlaskit/css-reset@5.0.10

## 12.1.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1

## 12.1.0

### Minor Changes

- [minor][5f19831428](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f19831428):

  As part of AFP-1404, we are dropping flow support. It means that those packages are not typed. Consumer will need to manually add their types to the component.Background ticket: https://product-fabric.atlassian.net/browse/AFP-1397Plan: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/docs@8.3.0

## 12.0.7

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.0.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 12.0.5

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.0.4

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 12.0.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/section-message@4.0.5
  - @atlaskit/icon@19.0.0

## 12.0.2

### Patch Changes

- [patch][56eae512a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56eae512a3):

  Updated the icon for Premium and cleaned up reduced-ui-pack sprite

## 12.0.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/section-message@4.0.2
  - @atlaskit/icon@18.0.0

## 12.0.0

- Updated dependencies [bfb006f65a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfb006f65a):
  - @atlaskit/css-reset@5.0.0

## 11.0.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - @atlaskit/docs@8.0.0
  - @atlaskit/icon@17.0.0
  - @atlaskit/section-message@3.0.0
  - @atlaskit/theme@9.0.0
  - @atlaskit/css-reset@4.0.0

## 10.5.6

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/css-reset@3.0.8
  - @atlaskit/theme@8.1.7

## 10.5.5

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/css-reset@3.0.6
  - @atlaskit/docs@7.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/theme@8.0.0

## 10.5.4

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/section-message@1.0.16
  - @atlaskit/icon@16.0.0

## 10.5.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/icon@15.0.2
  - @atlaskit/section-message@1.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/css-reset@3.0.5
  - @atlaskit/docs@6.0.0

## 10.5.2

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/icon@15.0.1
  - @atlaskit/section-message@1.0.13
  - @atlaskit/css-reset@3.0.4
  - @atlaskit/theme@7.0.0

## 10.5.1

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/section-message@1.0.12
  - @atlaskit/icon@15.0.0

## 10.5.0

- [minor][29968f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29968f4):

  - Add a menu expand icon

## 10.4.0

- [minor][f5e26e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5e26e1):

  - Add a retry icon

## 10.3.1

- [patch][f2f231c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2f231c):

  - Use fontSizeSmall from theme

## 10.3.0

- [minor][dced9bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dced9bf):

  - Remove StarOutlineIcon as it is not used

## 10.2.1

- [patch][d15caa6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d15caa6):

  - adding editor image alignment icons

## 10.2.0

- [minor][fe3c283" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe3c283"
  d):

  - ED-5600: add icons for new table ux

## 10.1.1

- [patch] Consume smallFontSize from @atlaskit/theme [a6f8a43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6f8a43)

## 10.1.0

- [minor] Add drag-handler [b0a64d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0a64d6)

## 10.0.1

- [patch] Update build process to use babel-7 [0e9a221](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e9a221)

## 10.0.0

- [major] Icons that do not exist in the main icons package have been removed [6dd05b2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd05b2)

## 9.6.2

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/section-message@1.0.8
  - @atlaskit/icon@14.0.0

## 9.6.1

- [patch] Moved to @atlaskit/theme for all the values from util-shared-styles [6d35164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d35164)

## 9.6.0

- [minor] Add like icon [cd71c5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd71c5f)

## 9.5.0

- [minor] Add the questions icon [ad96a89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad96a89)

## 9.4.0

- [minor] Add and edit star icons [55e3ec7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55e3ec7)

## 9.3.0

- [minor] Add the new child-issues icon [8d3f8dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d3f8dd)

## 9.2.0

- [minor] Add new icon [d36f760](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d36f760)
- [patch] Add new icon for Roadmap [365460a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/365460a)

## 9.1.2

- [patch] Update warning message and fix test for reduced-ui-pack [4b166d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b166d8)
- [none] Updated dependencies [4b166d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b166d8)
  - @atlaskit/icon@13.2.6

## 9.1.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/docs@5.0.2
  - @atlaskit/css-reset@3.0.1

## 9.1.0

- [minor] Add a new star large icon [5dd7d0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5dd7d0e)
- [none] Updated dependencies [5dd7d0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5dd7d0e)
  - @atlaskit/icon@13.1.0

## 9.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/docs@5.0.0
  - @atlaskit/css-reset@3.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/css-reset@3.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 8.19.0

- [minor] Add new media viewer icons and replace existing ones [623a2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623a2a0)
- [none] Updated dependencies [623a2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623a2a0)
  - @atlaskit/icon@12.8.0

## 8.18.0

- [minor] Added lozenges to reduced-ui-pack [9baf761](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9baf761)

## 8.17.0

- [minor] Add chevron large icons [086b5d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/086b5d7)
- [none] Updated dependencies [086b5d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/086b5d7)
  - @atlaskit/icon@12.7.0

## 8.16.0

- [minor] Updated form field styling to match latest ADG3 styles [e57e853](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e57e853)

## 8.15.0

- [minor] Add a new badge id: department and suitcase [e46ff5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e46ff5e)
- [none] Updated dependencies [e46ff5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e46ff5e)
  - @atlaskit/icon@12.6.0

## 8.14.0

- [minor] Add the new app-switcher icon [8c0cacd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c0cacd)
- [none] Updated dependencies [8c0cacd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c0cacd)
  - @atlaskit/icon@12.4.0

## 8.13.0

- [minor] Object icons color updated and adding file types icons [c49ce0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c49ce0b)
- [none] Updated dependencies [c49ce0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c49ce0b)
  - @atlaskit/icon@12.3.0

## 8.12.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/icon@12.2.0

## 8.11.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/css-reset@2.0.6
  - @atlaskit/icon@12.1.2

## 8.11.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/css-reset@2.0.5
  - @atlaskit/icon@12.1.1
  - @atlaskit/docs@4.1.1

## 8.11.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/css-reset@2.0.4

## 8.10.1

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/css-reset@2.0.3

## 8.10.0

- [minor] Update emoji and add no-image [620557e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/620557e)
- [none] Updated dependencies [620557e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/620557e)
  - @atlaskit/icon@11.4.0

## 8.9.2

- [patch] Fix unit tests [22337bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22337bd)
- [patch] Update for label with white background [a0d7ed7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0d7ed7)
- [patch] Fix whitebackground for label [b8eb930](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8eb930)
- [patch] Fix white background for label [229a63c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/229a63c)
- [none] Updated dependencies [22337bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22337bd)
  - @atlaskit/icon@11.3.1

## 8.9.1

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/docs@3.0.4
  - @atlaskit/css-reset@2.0.2

## 8.9.0

- [minor] Add divider from editor [5cbb8a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cbb8a6)
- [minor] Add divider fabric icon [8b794ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b794ed)
- [minor] Add divider icon from fabric [c8adb64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8adb64)
- [none] Updated dependencies [5cbb8a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cbb8a6)
  - @atlaskit/icon@11.2.0

## 8.8.0

- [minor] Add label icon [72baa86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72baa86)

## 8.7.4

- [patch] ED-4228 adding icons for table floating toolbar advance options. [b466410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b466410)

## 8.7.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 8.7.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 8.7.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 8.6.0

- [minor] Update svg stroke and fill color to match the spec for checkbox and radio button [aaeb66a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaeb66a)

## 8.5.0

- [minor] Updated switcher icon [2815441](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2815441)

## 8.4.0

- [minor] Move icon and reduced-ui pack to new repo, update build process [b3977f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3977f3)

## 8.3.0 (2017-12-08)

- feature; added new media layout icons for the editor (issues closed: ak-4012) ([ee770f5](https://bitbucket.org/atlassian/atlaskit/commits/ee770f5))

## 8.2.1 (2017-11-30)

- bug fix; update the css style to reduce padding in safari ([89cf40c](https://bitbucket.org/atlassian/atlaskit/commits/89cf40c))

## 8.2.0 (2017-11-16)

- feature; new and updated icons for the editor (issues closed: ak-3720) ([2c709e2](https://bitbucket.org/atlassian/atlaskit/commits/2c709e2))

## 8.1.0 (2017-10-10)

- feature; added 8 new icons, updated 4 others (issues closed: ak-3590) ([0cff900](https://bitbucket.org/atlassian/atlaskit/commits/0cff900))

## 8.0.0 (2017-09-25)

- breaking; Removing the "editor/expand" icon. Use the appropriate chevron-up/chevron-down icons instead. ([dc2f175](https://bitbucket.org/atlassian/atlaskit/commits/dc2f175))
- breaking; removing the "expand" icon in preference to using the chevron ones instead (issues closed: ak-2157) ([dc2f175](https://bitbucket.org/atlassian/atlaskit/commits/dc2f175))

## 7.0.0 (2017-09-11)

- breaking; The company/product icons (AtlassianIcon, BitbucketIcon, ConfluenceIcon, HipchatIcon, JiraIcon) have ([8a502b1](https://bitbucket.org/atlassian/atlaskit/commits/8a502b1))
- breaking; new company and product icons added ([8a502b1](https://bitbucket.org/atlassian/atlaskit/commits/8a502b1))

## 6.1.1 (2017-09-06)

- bug fix; reduced-ui buttons now have correct horizontal padding (issues closed: ak-3457) ([31b66b7](https://bitbucket.org/atlassian/atlaskit/commits/31b66b7))

## 6.1.0 (2017-08-28)

- feature; added switcher icon back ([de848a6](https://bitbucket.org/atlassian/atlaskit/commits/de848a6))

## 6.0.0 (2017-08-17)

- bug fix; fixing interactive coloured icon example ([8086a2c](https://bitbucket.org/atlassian/atlaskit/commits/8086a2c))
- feature; updated stories for icons and updated the build step for reduced-ui-pack icons ([0ad9eea](https://bitbucket.org/atlassian/atlaskit/commits/0ad9eea))
- breaking; syncing reduced UI pack icons with the ones from the Icon package ([d78804a](https://bitbucket.org/atlassian/atlaskit/commits/d78804a))

## 5.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 5.4.0 (2017-05-31)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; added log-in icon to [@atlaskit](https://github.com/atlaskit)/icon and [@atlaskit](https://github.com/atlaskit)/reduced-ui-pack ([aa72586](https://bitbucket.org/atlassian/atlaskit/commits/aa72586))
- feature; update color values and usages as per #AK-2482 ([ae8fae5](https://bitbucket.org/atlassian/atlaskit/commits/ae8fae5))

## 5.3.3 (2017-05-25)

- fix; bump util-shared-styles dependency in reduced-ui-pack ([9b46b13](https://bitbucket.org/atlassian/atlaskit/commits/9b46b13))

## 5.3.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 5.3.0 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- feature; Adds switcher icon ([220cc33](https://bitbucket.org/atlassian/atlaskit/commits/220cc33))

## 5.2.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 5.1.0 (2017-04-19)

- feature; add media services scale large and small icons ([3bd9d86](https://bitbucket.org/atlassian/atlaskit/commits/3bd9d86))

## 4.0.0 (2017-03-28)

- fix; show correct npm install command in readme story ([ccee7a2](https://bitbucket.org/atlassian/atlaskit/commits/ccee7a2))
- feature; bulk icon update ([76367b5](https://bitbucket.org/atlassian/atlaskit/commits/76367b5))
- feature; update default icon sizes ([90850bd](https://bitbucket.org/atlassian/atlaskit/commits/90850bd))
- breaking; default SVG artboard sizes are now 24px, with some icons such as editor on the 16px artboard.
- breaking; This icon released contains a large amount of breaking naming changes due to deletions and renames.
- Please update to this new major version and ensure your application is using the correct icon exports via linting.
- ISSUES CLOSED: AK-1924

## 3.0.3 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 3.0.1 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 3.0.0 (2017-03-03)

- feature; add service desk icons ([f8d9ad4](https://bitbucket.org/atlassian/atlaskit/commits/f8d9ad4))
- feature; add reminder for breaking changes to icon affecting reduced-ui-pack ([df73682](https://bitbucket.org/atlassian/atlaskit/commits/df73682))
- breaking; Added service desk icons

## 2.5.1 (2017-02-27)

- fix; fixed the story order for reduced-ui-pack ([2d2a509](https://bitbucket.org/atlassian/atlaskit/commits/2d2a509))

## 2.5.0 (2017-02-24)

- fix; Adjusting field width for reduced-ui-pack large fields ([292dac6](https://bitbucket.org/atlassian/atlaskit/commits/292dac6))
- feature; New styles for form elements for the reduced-ui-pack ([07e6bab](https://bitbucket.org/atlassian/atlaskit/commits/07e6bab))
- feature; Updated some field colors to match the latest specs ([1448ab8](https://bitbucket.org/atlassian/atlaskit/commits/1448ab8))

## 2.4.0 (2017-02-24)

- feature; add tooltips feature to reduced UI pack ([282629d](https://bitbucket.org/atlassian/atlaskit/commits/282629d))

## 2.3.0 (2017-02-23)

- feature; add toggle component to reduced UI pack ([8eeb39e](https://bitbucket.org/atlassian/atlaskit/commits/8eeb39e))

## 2.2.0 (2017-02-21)

- fix; change directory icon specific names to generic icon names ([13bb38a](https://bitbucket.org/atlassian/atlaskit/commits/13bb38a))
- feature; directory icons ([b278823](https://bitbucket.org/atlassian/atlaskit/commits/b278823))

## 2.1.0 (2017-02-20)

- feature; add icons to reduced-ui-pack as svg name export ([c05ba4f](https://bitbucket.org/atlassian/atlaskit/commits/c05ba4f))

## 2.0.1 (2017-02-14)

- fix; Rewording docs and triggering a release. ([27c430f](https://bitbucket.org/atlassian/atlaskit/commits/27c430f))

## 1.0.0 (2017-02-10)

- fix; Updates from pull request feedback ([93d90c7](https://bitbucket.org/atlassian/atlaskit/commits/93d90c7))
- feature; Grid and Button patterns for the reduced-ui-pack ([8336747](https://bitbucket.org/atlassian/atlaskit/commits/8336747))
