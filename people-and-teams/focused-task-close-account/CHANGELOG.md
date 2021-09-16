# @atlaskit/focused-task-close-account

## 0.14.5

### Patch Changes

- Updated dependencies

## 0.14.4

### Patch Changes

- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 0.14.3

### Patch Changes

- Updated dependencies

## 0.14.2

### Patch Changes

- [`eb0dc29d09b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb0dc29d09b) - Declarative entry points, removes messages, types EPs

## 0.14.1

### Patch Changes

- Updated dependencies

## 0.14.0

### Minor Changes

- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations

## 0.13.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.13.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.13.5

### Patch Changes

- Updated dependencies

## 0.13.4

### Patch Changes

- Updated dependencies

## 0.13.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.13.2

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 0.13.1

### Patch Changes

- Updated dependencies

## 0.13.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.12.18

### Patch Changes

- [`fc83c36503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc83c36503) - Update translation files via Traduki build

## 0.12.17

### Patch Changes

- [`39faba6e98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39faba6e98) - Update all the theme imports to something tree-shakable

## 0.12.16

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 0.12.15

### Patch Changes

- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 0.12.14

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/drawer@5.3.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1

## 0.12.13

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/drawer@5.3.1
  - @atlaskit/inline-dialog@12.1.8

## 0.12.12

- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/i18n-tools@0.6.0

## 0.12.11

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.12.10

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 0.12.9

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/drawer@5.0.10
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 0.12.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.12.7

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 0.12.6

- Updated dependencies [75c64ee36a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75c64ee36a):
  - @atlaskit/drawer@5.0.0

## 0.12.5

### Patch Changes

- [patch][dd9ca0710e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd9ca0710e):

  Removed incorrect jsnext:main field from package.json

## 0.12.4

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 0.12.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 0.12.2

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/checkbox@9.0.0

## 0.12.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/drawer@4.2.1
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/section-message@4.0.5
  - @atlaskit/icon@19.0.0

## 0.12.0

### Minor Changes

- [minor][49f2492645](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49f2492645):

  Minor style changes.

## 0.11.4

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/drawer@4.1.3
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/section-message@4.0.2
  - @atlaskit/icon@18.0.0

## 0.11.3

- Updated dependencies [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/inline-dialog@12.0.0

## 0.11.2

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 0.11.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/checkbox@7.0.1
  - @atlaskit/drawer@4.1.1
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 0.11.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 0.10.0

- [minor][7cf935a323](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf935a323):

  - DeleteUserContentPreviewScreen changes which include similar design to select if the user prefers nickname or former user but as a survey

## 0.9.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/drawer@3.0.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/section-message@2.0.3
  - @atlaskit/theme@8.1.7

## 0.9.1

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/avatar@15.0.3
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/drawer@3.0.6
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/section-message@2.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.9.0

- [minor][524a6d207e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/524a6d207e):

  - Enable noImplicitAny for @atlaskit/focused-task-close-account

## 0.8.4

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.8.3

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/drawer@3.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-dialog@10.0.1
  - @atlaskit/section-message@2.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/i18n-tools@0.5.0
  - @atlaskit/button@11.0.0

## 0.8.2

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/docs@7.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/checkbox@6.0.0
  - @atlaskit/drawer@3.0.0
  - @atlaskit/inline-dialog@10.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/theme@8.0.0

## 0.8.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/drawer@2.7.1
  - @atlaskit/inline-dialog@9.0.14
  - @atlaskit/section-message@1.0.16
  - @atlaskit/icon@16.0.0

## 0.8.0

- [minor][d89857a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d89857a):

  - Deactivation flow added which is a single screen flow in the focused task component

## 0.7.0

- [minor][91f6abc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91f6abc):

  - Bug fix in the basic drawer assembly example

## 0.6.0

- [minor][52c6b63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52c6b63):

  - i18n support added for focused task component

## 0.5.0

- [minor][49bd44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49bd44d):

  - Section message updated when the user is alreaady deactivated

## 0.4.0

- [minor][81299f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81299f6):

  - Copy changes along with addition on new prop, isUserDeactivated

## 0.3.4

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/drawer@2.6.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/inline-dialog@9.0.13
  - @atlaskit/section-message@1.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.3.3

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/drawer@2.5.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/inline-dialog@9.0.12
  - @atlaskit/section-message@1.0.13
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 0.3.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/drawer@2.5.3
  - @atlaskit/inline-dialog@9.0.11
  - @atlaskit/section-message@1.0.12
  - @atlaskit/icon@15.0.0

## 0.3.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/drawer@2.5.2
  - @atlaskit/icon@14.6.1
  - @atlaskit/inline-dialog@9.0.10
  - @atlaskit/section-message@1.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.3.0

- [minor][75772f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75772f8):

  - Content updated and added drop down list support as per the latest design.

## 0.2.0

- [minor][c8ea304](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8ea304):

  - Bug fix - index.ts file moved to src folder. The component couldn’t be imported as the index file was not in the correct directory. Minor changes - ‘Learn more link’ now a part of the FocusedTask props as different links could be sent from unified-profile and id-org manager flow. accessibleSites prop is now an array of string instead of the AccessibleSitesResponse. If accessibleSites data is empty or null, the text displayed will be different. Added deactivateUserHandler prop to DeleteUserOverviewScreen, so that if it's not passed, the warning section is not displayed.

## 0.1.0

- [minor] initial release of the focused task close account component [b0bfb38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0bfb38)
