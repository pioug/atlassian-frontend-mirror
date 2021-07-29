# @atlaskit/navigation-next

## 9.0.15

### Patch Changes

- [`81b02457010`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81b02457010) - Adjust internal use of isMounted component instance variable to \_isMounted

## 9.0.14

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.
- [`5a662703e55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a662703e55) - Renamed usage of `isMounted` to `_isMounted` to remove naming conflict.

## 9.0.13

### Patch Changes

- Updated dependencies

## 9.0.12

### Patch Changes

- Updated dependencies

## 9.0.11

### Patch Changes

- [`614b41d5203`](https://bitbucket.org/atlassian/atlassian-frontend/commits/614b41d5203) - Fix unhandled exceptions caused when localStorage isn't available.

## 9.0.10

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- Updated dependencies

## 9.0.9

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 9.0.8

### Patch Changes

- Updated dependencies

## 9.0.7

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 9.0.6

### Patch Changes

- Updated dependencies

## 9.0.5

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 9.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 9.0.3

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 9.0.2

### Patch Changes

- Updated dependencies

## 9.0.1

### Patch Changes

- Updated dependencies

## 9.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 8.0.9

### Patch Changes

- Updated dependencies

## 8.0.8

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 8.0.7

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 8.0.6

### Patch Changes

- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- Updated dependencies

## 8.0.5

### Patch Changes

- Updated dependencies

## 8.0.4

### Patch Changes

- [patch][2e52d035cd](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e52d035cd):

  Change imports to comply with Atlassian conventions- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [2bfc59f090](https://bitbucket.org/atlassian/atlassian-frontend/commits/2bfc59f090):
- Updated dependencies [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [d150e2d7f6](https://bitbucket.org/atlassian/atlassian-frontend/commits/d150e2d7f6):
- Updated dependencies [3a09573b4e](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a09573b4e):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [c21a796623](https://bitbucket.org/atlassian/atlassian-frontend/commits/c21a796623):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [a4d063330a](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4d063330a):
- Updated dependencies [093fdc91b1](https://bitbucket.org/atlassian/atlassian-frontend/commits/093fdc91b1):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/drawer@5.3.6
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/logo@12.3.4
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/avatar@17.1.10
  - @atlaskit/onboarding@9.1.6
  - @atlaskit/inline-dialog@12.1.12
  - @atlaskit/banner@10.1.8
  - @atlaskit/lozenge@9.1.7
  - @atlaskit/badge@13.1.8
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3

## 8.0.3

### Patch Changes

- [patch][8f046e84f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f046e84f0):

  Remove logger: Logger as we remove all types.- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies [923c738553](https://bitbucket.org/atlassian/atlassian-frontend/commits/923c738553):
- Updated dependencies [6e2dda87f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e2dda87f4):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/onboarding@9.1.4
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/atlassian-navigation@0.10.0
  - @atlaskit/docs@8.5.0

## 8.0.2

### Patch Changes

- [patch][893886e05a](https://bitbucket.org/atlassian/atlassian-frontend/commits/893886e05a):

  AFP-1401: "Remove the last Flow type and fix the implements function."- [patch][eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):

  Follow-up on AFP-1401 when removing types to component. Some left over types and small issues- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [893886e05a](https://bitbucket.org/atlassian/atlassian-frontend/commits/893886e05a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [8b9598a760](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9598a760):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon-object@5.0.3
  - @atlaskit/icon@20.1.0
  - @atlaskit/logo@12.3.3
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/global-navigation@9.0.1
  - @atlaskit/field-base@14.0.2
  - @atlaskit/avatar@17.1.9
  - @atlaskit/badge@13.1.7
  - @atlaskit/banner@10.1.7
  - @atlaskit/button@13.3.9
  - @atlaskit/drawer@5.3.5
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/inline-dialog@12.1.11
  - @atlaskit/lozenge@9.1.6
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/onboarding@9.1.3
  - @atlaskit/section-message@4.1.7
  - @atlaskit/select@11.0.9
  - @atlaskit/spinner@12.1.6
  - @atlaskit/toggle@8.1.6
  - @atlaskit/tooltip@15.2.5

## 8.0.1

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/avatar@17.1.8
  - @atlaskit/badge@13.1.6
  - @atlaskit/banner@10.1.6
  - @atlaskit/button@13.3.8
  - @atlaskit/drawer@5.3.4
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/inline-dialog@12.1.10
  - @atlaskit/lozenge@9.1.5
  - @atlaskit/modal-dialog@10.5.3
  - @atlaskit/onboarding@9.1.2
  - @atlaskit/section-message@4.1.6
  - @atlaskit/select@11.0.8
  - @atlaskit/spinner@12.1.5
  - @atlaskit/toggle@8.1.5
  - @atlaskit/tooltip@15.2.4

## 8.0.0

### Major Changes

- [major][4c6b8024c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6b8024c8):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages are not typed. Consumer will need to manually add their types to the component.Background ticket: https://product-fabric.atlassian.net/browse/AFP-1397Plan: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies [4c6b8024c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6b8024c8):
- Updated dependencies [b0d1348c83](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0d1348c83):
- Updated dependencies [b80c88fd26](https://bitbucket.org/atlassian/atlassian-frontend/commits/b80c88fd26):
- Updated dependencies [9ec1606d00](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ec1606d00):
- Updated dependencies [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies [62dc057049](https://bitbucket.org/atlassian/atlassian-frontend/commits/62dc057049):
- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [1b3069e06b](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3069e06b):
- Updated dependencies [3b92b89113](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b92b89113):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/global-navigation@9.0.0
  - @atlaskit/onboarding@9.0.10
  - @atlaskit/atlassian-navigation@0.9.6
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/icon@20.0.2
  - @atlaskit/drawer@5.3.3
  - @atlaskit/analytics-listeners@6.2.4

## 7.3.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/badge@13.1.5
  - @atlaskit/banner@10.1.5
  - @atlaskit/button@13.3.7
  - @atlaskit/drawer@5.3.2
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/field-base@14.0.1
  - @atlaskit/global-navigation@8.0.7
  - @atlaskit/icon-object@5.0.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/logo@12.3.2
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/onboarding@9.0.9
  - @atlaskit/section-message@4.1.5
  - @atlaskit/select@11.0.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/analytics-listeners@6.2.3
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/atlassian-navigation@0.9.5

## 7.3.6

### Patch Changes

- [patch][89bb98ab02](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bb98ab02):

  Adds `data-layout-container` to LayoutManager so the Confluence can use it as a CSS selector in server rendered pages

## 7.3.5

### Patch Changes

- Updated dependencies [602ad2855a](https://bitbucket.org/atlassian/atlassian-frontend/commits/602ad2855a):
- Updated dependencies [5c6a0d9512](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c6a0d9512):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [91149b1e92](https://bitbucket.org/atlassian/atlassian-frontend/commits/91149b1e92):
- Updated dependencies [ca86945834](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca86945834):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/atlassian-navigation@0.9.4
  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/global-navigation@8.0.6
  - @atlaskit/avatar@17.1.6
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/logo@12.3.1
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/banner@10.1.4
  - @atlaskit/button@13.3.6
  - @atlaskit/drawer@5.3.1
  - @atlaskit/inline-dialog@12.1.8
  - @atlaskit/onboarding@9.0.8
  - @atlaskit/select@11.0.6
  - @atlaskit/tooltip@15.2.2

## 7.3.4

### Patch Changes

- [patch][6508d3c89d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6508d3c89d):

  Add analytics attribute for horizontal global navigation for navigation-next navigationUIInitialised

## 7.3.3

### Patch Changes

- [patch][9e5ebd1234](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e5ebd1234):

  Adds left and right values for atlassian-navigation wrapper

## 7.3.2

### Patch Changes

- Updated dependencies [24edf508bf](https://bitbucket.org/atlassian/atlassian-frontend/commits/24edf508bf):
  - @atlaskit/atlassian-navigation@0.9.0

## 7.3.1

### Patch Changes

- [patch][5a54e163a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a54e163a7):

  Fix text descenders being clipped in Firefox in the sidenav- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [6dccb16bfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dccb16bfc):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [5c105059ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c105059ef):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/toggle@8.1.3
  - @atlaskit/theme@9.5.0
  - @atlaskit/atlassian-navigation@0.8.5
  - @atlaskit/badge@13.1.4
  - @atlaskit/banner@10.1.3
  - @atlaskit/button@13.3.5
  - @atlaskit/inline-dialog@12.1.7
  - @atlaskit/lozenge@9.1.3
  - @atlaskit/section-message@4.1.3
  - @atlaskit/select@11.0.4
  - @atlaskit/spinner@12.1.3
  - @atlaskit/tooltip@15.2.1
  - @atlaskit/dropdown-menu@8.2.2

## 7.3.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Allowing support for using with new react-beautiful-dnd 12.x API

### Patch Changes

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/avatar@17.1.5
  - @atlaskit/field-base@13.0.16
  - @atlaskit/drawer@5.2.0
  - @atlaskit/onboarding@9.0.7
  - @atlaskit/inline-dialog@12.1.6

## 7.2.2

### Patch Changes

- Updated dependencies [df31cc4fb4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df31cc4fb4):
- Updated dependencies [308708081a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/308708081a):
  - @atlaskit/atlassian-navigation@0.8.0
  - @atlaskit/logo@12.3.0

## 7.2.1

### Patch Changes

- Updated dependencies [63b9f324df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63b9f324df):
  - @atlaskit/atlassian-navigation@0.7.0

## 7.2.0

### Minor Changes

- [minor][920519979d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/920519979d):

  Update collapse affordance icon

## 7.1.3

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages- Updated dependencies [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2

## 7.1.2

### Patch Changes

- [patch][75fa61803d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75fa61803d):

  Reverting broken code

## 7.1.1

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/inline-dialog@12.1.5
  - @atlaskit/modal-dialog@10.3.6
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4
  - @atlaskit/logo@12.2.2

## 7.1.0

### Minor Changes

- [minor][d8b3e9833e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8b3e9833e):

  global-navigation height resizes for mobile browsers

## 7.0.4

### Patch Changes

- [patch][ab32a88243](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab32a88243):

  Use explicit imports in `NavigationProvider` to reduce the size of the `NavigationProvider` entry point

## 7.0.3

- Updated dependencies [355e7ca2ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/355e7ca2ea):
  - @atlaskit/atlassian-navigation@0.6.0

## 7.0.2

### Patch Changes

- [patch][1450c5f1f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1450c5f1f5):

  Fix resize not working on FF when connected to an external monitor

## 7.0.1

- Updated dependencies [48640192dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48640192dc):
  - @atlaskit/atlassian-navigation@0.5.0

## 7.0.0

### Major Changes

- [major][4778521db3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4778521db3):

  **What changed and why was this change made?**

  Lazy load react-select and react-beautiful-dnd to bring down the bundle size. This reduces the main navigation-next bundle by 33% (Drops from 184kb to 124kb un-minified)

  **How to consume the breaking change?**

  Although this is a major version, there's no API change or any other noticable change in the behaviour. It should *just work*™️ like before. But do perform a thorough round of testing to ensure nothing breaks unexpectedly. Areas to stress would be parts of navigation that use the Switcher component and any of the draggable components.

## 6.8.3

- Updated dependencies [f9b5e24662](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9b5e24662):
  - @atlaskit/icon-object@5.0.0
  - @atlaskit/icon@19.0.8

## 6.8.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 6.8.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 6.8.0

### Minor Changes

- [minor][6cc95a6c66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cc95a6c66):

  - Support dynamic removal of contextual navigation via the `showContextualNavigation` prop
  - Support content dataset that targets the page content element
  - Remove re-renders occurring from the resize control hover effect
  - Reduce re-renders occurring from the resize transition

## 6.7.7

### Patch Changes

- [patch][c479e7eb8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c479e7eb8f):

  Fixing nav resize button render issue.

## 6.7.6

### Patch Changes

- [patch][636c5850ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/636c5850ae):

  Fix missing horizontal navigation re-renders

## 6.7.5

### Patch Changes

- [patch][83b9b5e4d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83b9b5e4d0):

  Bumping devDeps for new atlassian-nav component

## 6.7.4

### Patch Changes

- [patch][f7eb0a4886](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7eb0a4886):

  Ensuring new horizontal nav allows for scrollbar width. Using 'vw' units prevents this.

## 6.7.3

- Updated dependencies [c5939cb73d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c5939cb73d):
  - @atlaskit/app-navigation@0.4.0

## 6.7.2

### Patch Changes

- [patch][197aa4ed2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/197aa4ed2c):

  Use context hooks in favour of emotion-theming

## 6.7.1

- Updated dependencies [382273ee49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/382273ee49):
  - @atlaskit/app-navigation@0.3.0

## 6.7.0

### Minor Changes

- [minor][becd9e83bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/becd9e83bd):

  Support experimental_horizontalGlobalNav

## 6.6.3

- Updated dependencies [f0305e1b06](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0305e1b06):
  - @atlaskit/global-navigation@8.0.0

## 6.6.2

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/drawer@5.0.10
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/global-navigation@7.7.1
  - @atlaskit/modal-dialog@10.2.1
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 6.6.1

### Patch Changes

- [patch][6410edd029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6410edd029):

  Deprecated props, `value` and `onValueUpdated` have been removed from the Badge component. Please use the children prop instead.

## 6.6.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 6.5.8

- Updated dependencies [a75dfaad67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a75dfaad67):
  - @atlaskit/global-navigation@7.6.4
  - @atlaskit/onboarding@9.0.0

## 6.5.7

### Patch Changes

- [patch][61ab3a5b1d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61ab3a5b1d):

  Dependency 'prop-types' is unused in package.json.

## 6.5.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 6.5.5

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.5.4

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 6.5.3

### Patch Changes

- [patch][a417c7e117](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a417c7e117):

  Fix Item styles for IE11 and Edge

## 6.5.2

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 6.5.1

- Updated dependencies [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/dropdown-menu@8.0.13
  - @atlaskit/global-navigation@7.4.1
  - @atlaskit/onboarding@8.0.12
  - @atlaskit/select@10.0.3
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/avatar@16.0.10
  - @atlaskit/button@13.1.2
  - @atlaskit/drawer@5.0.4
  - @atlaskit/inline-dialog@12.0.11
  - @atlaskit/modal-dialog@10.1.3
  - @atlaskit/toggle@8.0.1
  - @atlaskit/tooltip@15.0.9
  - @atlaskit/analytics-listeners@6.1.5
  - @atlaskit/analytics-namespaced-context@4.1.5

## 6.5.0

### Minor Changes

- [minor][4c5ceeb532](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c5ceeb532):

  Remove "overflow: auto;" CSS rule from LayoutContainer. This was added earlier to resolve a problem with showing site banners.

## 6.4.0

### Minor Changes

- [minor][570524869c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/570524869c):

  Add bottom shadow on navigation scrollable Section

## 6.3.10

### Patch Changes

- [patch][5e132b0820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e132b0820):

  - Fixes accesibility issues with the expand/collapse affordance.
  - Fixes keyboard tab order when navigating nested nav transistions.
  - Passes `dataset` props correctly when using `AsyncLayoutManagerWithViewController`

## 6.3.9

### Patch Changes

- [patch][a73580e138](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a73580e138):

  BUILDTOOLS-260/BUILDTOOLS-261: Replace data-test-id by data-testid to be consistent with react-testing-library.
  **Products**, you may require to update your integration and end to end tests if they are based on `data-test-id` please replace by `data-testid`.

## 6.3.8

- Updated dependencies [75c64ee36a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75c64ee36a):
  - @atlaskit/global-navigation@7.3.6
  - @atlaskit/drawer@5.0.0

## 6.3.7

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/avatar@16.0.8
  - @atlaskit/global-navigation@7.3.4
  - @atlaskit/toggle@8.0.0

## 6.3.6

### Patch Changes

- [patch][aa493c8ee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa493c8ee5):

  - Fixes app crash issue due to too much recursion.
  - Fixes issue where children with `postion: fixed` would flicker during nav expand/collapse.

## 6.3.5

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 6.3.4

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/inline-dialog@12.0.5
  - @atlaskit/logo@12.1.1
  - @atlaskit/modal-dialog@10.0.10
  - @atlaskit/select@10.0.0

## 6.3.3

### Patch Changes

- [patch][ad3e77e5f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad3e77e5f9):

  Fixes styling issue which happens on pages with page banner and scrollable page content

## 6.3.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/drawer@4.2.1
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/field-base@13.0.6
  - @atlaskit/global-navigation@7.3.1
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/onboarding@8.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/select@9.1.8
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 6.3.1

### Patch Changes

- [patch][fd4008e6a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd4008e6a8):

  Fixes the issue of nav unmounting on collapse correctly

## 6.3.0

### Minor Changes

- [minor][e28067fdf9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e28067fdf9):

  Visually hide nav content when collapsed, rather than unmounting it.

## 6.2.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 6.2.0

### Minor Changes

- [minor][586f8033b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/586f8033b0):

  Add shouldHideGlobalNavShadow prop to LayoutManagerWithViewController

## 6.1.0

### Minor Changes

- [minor][575d2fc15f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/575d2fc15f):

  Adds prop `shouldHideGlobalNavShadow` to control the shadow on global navigation. Fixes an issue where GlobalNavigation didn't pass through props correctly.
  Also includes changes from [this PR](https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/5918/harsha-fix-item-rerenders/diff), which prevents unnecessary re-render of `Item` component in navigation to imporve nav performance.

## 6.0.10

### Patch Changes

- [patch][1d64ee9bda](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d64ee9bda):

  The after and component props for Item and GlobalItem are passed as new functions in every render. This causes them to re-render the entire component heirarchy under them. This PR fixes the issue by retaining the reference to the props and passing that to prevent unnecessary re-renders.

## 6.0.9

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/dropdown-menu@8.0.5
  - @atlaskit/icon@18.0.1
  - @atlaskit/select@9.1.6
  - @atlaskit/tooltip@15.0.0

## 6.0.8

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/drawer@4.1.3
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/field-base@13.0.4
  - @atlaskit/global-navigation@7.2.4
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/onboarding@8.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 6.0.7

- Updated dependencies [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/field-base@13.0.3
  - @atlaskit/modal-dialog@10.0.3
  - @atlaskit/inline-dialog@12.0.0

## 6.0.6

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 6.0.5

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/button@13.0.4
  - @atlaskit/field-base@13.0.1
  - @atlaskit/global-navigation@7.2.2
  - @atlaskit/select@9.1.2
  - @atlaskit/spinner@12.0.0
  - @atlaskit/icon@17.1.2
  - @atlaskit/onboarding@8.0.2
  - @atlaskit/modal-dialog@10.0.0

## 6.0.4

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/dropdown-menu@8.0.2
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 6.0.3

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/drawer@4.1.1
  - @atlaskit/global-navigation@7.2.1
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 6.0.2

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/global-navigation@7.1.1
  - @atlaskit/icon@17.0.2
  - @atlaskit/select@9.1.1
  - @atlaskit/logo@12.0.0

## 6.0.1

- [patch][b98d0779a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b98d0779a6):

  - Fixes issue where the Switcher component opens with the wrong width

## 6.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 5.1.7

- [patch][254dd9145a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/254dd9145a):

  - Fixes performance bug in navigation-next caused that happebs during hover and resize

## 5.1.6

- [patch][a81e516462](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a81e516462):

  - Removes dev-dependency from dependencies

## 5.1.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/badge@11.0.1
  - @atlaskit/button@12.0.3
  - @atlaskit/drawer@3.0.7
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/field-base@12.0.2
  - @atlaskit/global-navigation@6.2.9
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/logo@10.0.4
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/onboarding@7.0.4
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/spinner@10.0.7
  - @atlaskit/toggle@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 5.1.4

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/drawer@3.0.6
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/global-navigation@6.2.8
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/logo@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/onboarding@7.0.3
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/analytics-listeners@5.0.3
  - @atlaskit/button@12.0.0

## 5.1.3

- [patch][a28eb04426](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a28eb04426):

  - Migrates package from emotion 9 to emotion 10. No behaviour or API changes.

## 5.1.2

- [patch][da6ef8b69a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da6ef8b69a):

  - Using new z-index values from theme

## 5.1.1

- Updated dependencies [c95557e3ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c95557e3ff):
  - @atlaskit/global-navigation@6.2.2
  - @atlaskit/badge@11.0.0

## 5.1.0

- [minor][6d7faa9784](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d7faa9784):

  - Adds the ability to a function to access refs in navigation-next/GlobalItem. This function is exposed in GlobalNavigation for each of the items on GlobalNav in a prop called get<X>Ref, where X is product, create etc.

## 5.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/drawer@3.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/global-navigation@6.1.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-dialog@10.0.1
  - @atlaskit/logo@10.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/onboarding@7.0.1
  - @atlaskit/section-message@2.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/analytics-listeners@5.0.0
  - @atlaskit/analytics-namespaced-context@3.0.0

## 5.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 4.5.0

- [minor][bfe0b36312](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfe0b36312):

  - added the topoffset height to navigation-next: layout manager

## 4.4.1

- [patch][e71cc26e15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e71cc26e15):

  - Change padding-top of SectionHeading to margin-top

## 4.4.0

- [minor][8ebfb7165d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ebfb7165d):

  - New props: topOffset - The top offset value to be used in navigation

## 4.3.1

- [patch][5cf4e22048](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cf4e22048):

  - Fixes the issue where the switcher stayed open while navigation is being resized.
  - Fixes the issue where collapse/expanding the navigation caused the Switcher to reset to it's default size.

  [Jira ticket NAV-237](https://product-fabric.atlassian.net/browse/NAV-237)

## 4.3.0

- [minor][f54655ac1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f54655ac1a):

  - Support custom data attributes

## 4.2.3

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/inline-dialog@9.0.15
  - @atlaskit/logo@9.2.7
  - @atlaskit/modal-dialog@7.2.3
  - @atlaskit/select@7.0.0

## 4.2.2

- [patch][313f5283c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/313f5283c5):

  - Make the spacing after BackItem be defined using margin

## 4.2.1

- [patch][967c9ed460](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/967c9ed460):

  - Add IDs to all global nav items

## 4.2.0

- [minor][092845e62c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/092845e62c):

  - Fixes missing tooltip whenexperimental_alternateHoverBehaviouris set to true | [NAV-230](https://product-fabric.atlassian.net/browse/NAV-230)
  - Fixes stacking order issue which causes some elements like InlineDialog to be chopped off when placed in the container Nav | [AK-5818](https://ecosystem.atlassian.net/browse/AK-5818)
  - Add new FF to allow expand fly out to full width | [AK-5820](https://ecosystem.atlassian.net/servicedesk/customer/portal/24/AK-5820)

## 4.1.2

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/drawer@2.7.1
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/field-base@11.0.14
  - @atlaskit/global-navigation@5.5.2
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/onboarding@6.1.16
  - @atlaskit/section-message@1.0.16
  - @atlaskit/select@6.1.19
  - @atlaskit/toggle@5.0.15
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 4.1.1

- [patch][81b12c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/81b12c5):

  - Fixes GlobalNavigationSkeleton throwing TypeError when rendered in products with no globalNav theme

## 4.1.0

- [minor][86aaacd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86aaacd):

  - [Update flyout hover activation zone](https://product-fabric.atlassian.net/browse/NAV-197) - It is controlled by a new FF prop called `experimental_alternateFlyoutBehaviour` which defaults to false. ::NOTE:: For this feature to be enabled, it’s is necessary to have the FF `experimental_flyoutOnHover` to be set to true.
  - Update expand affordance icon

## 4.0.10

- [patch][3a33b6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a33b6b):

  - New entry point for Global Navigation Skeleton

## 4.0.9

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/badge@9.2.2
  - @atlaskit/button@10.1.1
  - @atlaskit/drawer@2.6.1
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/field-base@11.0.13
  - @atlaskit/global-navigation@5.3.8
  - @atlaskit/icon@15.0.2
  - @atlaskit/logo@9.2.6
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/onboarding@6.1.14
  - @atlaskit/section-message@1.0.14
  - @atlaskit/select@6.1.13
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/toggle@5.0.14
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/analytics-listeners@4.1.4
  - @atlaskit/analytics-namespaced-context@2.1.5
  - @atlaskit/docs@6.0.0

## 4.0.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/drawer@2.5.4
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/field-base@11.0.12
  - @atlaskit/global-navigation@5.3.6
  - @atlaskit/icon@15.0.1
  - @atlaskit/logo@9.2.5
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/section-message@1.0.13
  - @atlaskit/select@6.1.10
  - @atlaskit/spinner@9.0.12
  - @atlaskit/toggle@5.0.13
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6
  - @atlaskit/badge@9.2.1
  - @atlaskit/lozenge@6.2.3
  - @atlaskit/onboarding@6.1.12

## 4.0.7

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/drawer@2.5.3
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/field-base@11.0.11
  - @atlaskit/global-navigation@5.3.5
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/onboarding@6.1.11
  - @atlaskit/section-message@1.0.12
  - @atlaskit/select@6.1.9
  - @atlaskit/toggle@5.0.12
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 4.0.6

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/drawer@2.5.2
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/global-navigation@5.3.4
  - @atlaskit/icon@14.6.1
  - @atlaskit/logo@9.2.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/onboarding@6.1.10
  - @atlaskit/section-message@1.0.11
  - @atlaskit/select@6.1.8
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/toggle@5.0.11
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/analytics-listeners@4.1.1
  - @atlaskit/button@10.0.0

## 4.0.5

- [patch][21bc705](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21bc705):

  - Fixing flowtype exports on @atlaskit/navigation-next entry points

## 4.0.4

- [patch][abd3a39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abd3a39):

  - Bump react-beautiful-dnd dependency to v10.0.2

## 4.0.3

- [patch][d22baae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d22baae):

  - Fixing entrypoint replacement script

## 4.0.2

- [patch][01d913d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/01d913d):

  - fixing exports integration on JFE

## 4.0.1

- [patch][f66f71f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f66f71f):

  - Makes all entrypoints have a corresponding .flow file containing the //@flow comment

## 4.0.0

- [major][8e753fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e753fc):

  - View the [upgrade guide](https://atlaskit.atlassian.com/packages/core/navigation-next/docs/upgrade-guide) to help you upgrade to v4
  - The API for renderer items that use components as their `type` property have now changed to use a type value of `'InlineComponent'` and specify the component via a `component` prop instead. This allows the renderer item types to be typed correctly as disjoint unions on the type property.
  - Rename `withNavigationUI` HOC to `withNavigationUIController`
  - Rename `ViewRenderer` component to `ItemsRenderer`
  - Rename AsyncLayoutManagerWithViewController's `viewRenderer` prop to `itemsRenderer`
  - Remove icon prop from ConnectedItem and built-in renderer 'Item' type
  - Remove deprecated `key` prop from GlobalNav's `primaryItems` and `secondaryItems` props
  - Remove ScrollableSectionInner component. Remove scrollHint styles from theme.
  - Remove peeking behaviour

## 3.26.0

- [minor][5c6c893](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c6c893):

  - Create an entrypoint for ViewController and UIController

## 3.25.2

- [patch][5e99cb1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e99cb1):

  - Replacing LayoutManagerWithViewController impl by composing AsyncLMWVC

## 3.25.1

- [patch][a22db3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a22db3c):

  - Update flowtypes of UIController to allow consumer supplied cache getters to return null/undefined

## 3.25.0

- [minor][d96b032](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d96b032):

  - BREAKING: A breaking change was accidentally released in this version.

    The API for renderer items that use components as their \`type\` property have now changed to use a type value of \`'InlineComponent'\` and specify the component via a \`component\` prop instead. See the View the [v3 - v4 upgrade guide](https://atlaskit.atlassian.com/packages/core/navigation-next/docs/upgrade-guide) for more information.

  - Export flow types for each built-in item renderer type
  - Export a generic flow typed version of the renderer, `TypedViewRenderer`, that is designed to be extended to pass custom component flow types
    so the renderer typechecks custom components. See the [View Renderer documentation](https://atlaskit.atlassian.com/packages/core/navigation-next/docs/state-controllers#view-renderer) for more information.

## 3.24.0

- [minor][c2c0b0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c0b0c):

  - Adding new component AsyncLayoutManagerWithViewController to be used with code splitting

## 3.23.0

- [minor][b40e33e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b40e33e):

  - Update flow types of navigation components and higher-order components (HOCs) to allow types to flow through to consumers.

    Previously this was broken because our navigation HOCs (withTheme, withNavigationUIController, withNavigationViewController)
    weren't explicitly typed and swallowed types of a component. Types were also lost when components were wrapped with multiple HOCs (including withAnalyticsEvents, withAnalyticsContext HOCs). This is now fixed by default and a number of types related to our navigation HOCs have been exported so that you can explicitly type any subsequent components
    wrapped with our HOCs.

## 3.22.1

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

## 3.22.0

- [minor][b8bda3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8bda3a):

  - Make Switcher option components styles customizable

## 3.21.0

- [minor][9d98f92](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d98f92):

  - Add SortableContext, SortableGroup and SortableItem components to enable drag and drop of items within a view.

## 3.20.1

- [patch][c2a6561](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2a6561):

  - Fixing section animation on first-page load

## 3.20.0

- [minor][3f17176](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f17176):

  - Make GoToItem display arrow icon on focus event

## 3.19.1

- [patch][f3d0351" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3d0351"
  d):

  - Removing animations on first page load

## 3.19.0

- [minor] Export the following view renderer components as standalone UI components: BackItem, ConnectedItem, GoToItem, HeaderSection, MenuSection, Wordmark [459c2dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/459c2dd)

## 3.18.4

- [patch] Fix LayoutManager's onExpandStart, onExpandEnd, onCollapseStart and onCollapseEnd callbacks being called when the flyout opens or closes. [7b78219](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b78219)

## 3.18.3

- [patch] Make nav bar snap to default width if not moved below collapsing threshold [9617164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9617164)

## 3.18.2

- [patch] stop isResizing state being cached in localStorage. fixes bug where the nav becomes uninteractive if the user refreshes the page mid-drag [67a8d0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67a8d0e)

## 3.18.1

- [patch] fix issues with PopupSelect and NavigationSwitcher [b4e19c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4e19c3)

## 3.18.0

- [minor] Adds a 350ms delay to Flyout to prevent it from opening accidentally. [8175029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8175029)

## 3.17.2

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 3.17.1

- [patch] Fix nav flyout getting stuck in an opened state after global nav drawers are opened [ed585c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed585c6)

## 3.17.0

- [minor] Add expand analytics for flyout hover state [45f9a92](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/45f9a92)

## 3.16.0

- [minor] introduce flyout on hover, with feature-flag property [5c00034](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c00034)

## 3.15.6

- [patch] Avoid re-mount of custom components on re-render [1a47c0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a47c0b)

## 3.15.5

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/drawer@2.1.1
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/field-base@11.0.8
  - @atlaskit/global-navigation@5.0.1
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/onboarding@6.0.2
  - @atlaskit/section-message@1.0.8
  - @atlaskit/select@6.0.2
  - @atlaskit/toggle@5.0.9
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 3.15.4

- [patch] Updated dependencies [ac88888](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac88888)
  - @atlaskit/global-navigation@5.0.0

## 3.15.3

- [patch] Update global nav item click analytics to use actionSubjectId rather than the itemId attribute [56a3ada](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56a3ada)

## 3.15.2

- [patch] Fix misalignment of tooltips for small global items [2c48609](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c48609)

## 3.15.1

- [patch] hide GlobalItem tooltip on click as well as on mousedown [6c35a0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c35a0d)

## 3.15.0

- [minor] Add itemComponent prop to GlobalNav to allow consumers to pass a custom component for rendering items. Add isSelected prop to GlobalItem. [e8163a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8163a6)

## 3.14.3

- [patch] fix item after onclick [ab3a683](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab3a683)

## 3.14.2

- [patch] Remove memoization of custom components in globaItem and wrapping tooltip children in div to maintain reference to it [08dd5f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08dd5f4)

## 3.14.1

- [patch] Fix GlobalItem not passing all GlobalItem props to custom component. [9f95736](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f95736)

## 3.14.0

- [minor] Add enableResize(), disableResize(), and state.isResizeDisabled to UIController. The NavigationProvider's initialUIController prop can now containe a isResizeDisabled property. [a932511](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a932511)

## 3.13.3

- [patch] Adds the new hideTooltipOnMouseDown was required since global-navigation and navigation-next are using onMouseDown and onMouseUp iteractions [8719daf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8719daf)

## 3.13.2

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/logo@9.2.2
  - @atlaskit/select@6.0.0

## 3.13.1

- [patch] fixing remount component on GlobalItem component [e71825a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e71825a)

## 3.13.0

- [minor] introduces never-fully-collapsed content navigation [99add85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99add85)

## 3.12.2

- [patch] fixing HelpIcon active on children :hover [ae95dad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae95dad)

## 3.12.1

- [patch] limit page renders [36da70a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36da70a)

## 3.12.0

- [minor] Export SkeletonContainerView component [b1acba3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1acba3)

## 3.11.4

- [patch] Adds support for closing switcher on create click [057f006](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/057f006)

## 3.11.3

- [patch] Enforcing CONTENT_NAV_WIDTH on the components [d9ae0a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9ae0a9)

## 3.11.2

- [patch] Do not cache CustomComponent in GlobalItem [372795f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/372795f)

## 3.11.1

- [patch] hotfix: return nav item on click element to button [23fa988](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23fa988)

## 3.11.0

- [minor] Add a `getAnalyticsAttributes` prop to the `addView` function of ViewController that enables passing extra analytics attributes to analytics events fired within navigation when the specified view is active. [56452d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56452d3)
- [patch] Add missing navigationLayer attribute to productNavigation expanded/collapsed. [1ffd2ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ffd2ca)

## 3.10.1

- [patch] Resolves nav item pseudo-state locking issue [2a4693c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a4693c)

## 3.10.0

- [minor] Export ThemeProvider from the package. [978e055](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/978e055)

## 3.9.1

- [patch] Fix navigation-next items being re-created at every render [6e8270d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e8270d)

## 3.9.0

- [minor] LayoutManager and LayoutManagerWithViewController accept a getRefs prop which exposes a ref to the expand/collapse button node. The intended use-case is for creating a changeboarding experience for the new collapsed state. [51cd072](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51cd072)

## 3.8.1

- [patch] add styled-components as a peer dep [ce45300](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce45300)

## 3.8.0

- [minor] Add MenuSection, HeaderSection, Wordmark, and BackItem convenience types to the renderer. Lots of design alignment and polishing across all of the components. [742a8f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/742a8f3)

## 3.7.6

- [patch] Changes the way GlobalNavigationItemPrimitive is rendered. The earlier way of rendering was causing the items to mount and remount on every render [b18d920](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b18d920)

## 3.7.5

- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/select@5.0.16
  - @atlaskit/webdriver-runner@0.1.0

## 3.7.4

- [patch] Adjust navigation items background colours theming [da7b64d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da7b64d)

## 3.7.3

- [patch] LayoutManagerWithViewController now will pass Collapse Listeners props to LayoutManager [881ba31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/881ba31)

## 3.7.2

- [patch] Fixing multiple skeleton load states, rendering product and container skeletons [68e49a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68e49a1)

## 3.7.1

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 3.7.0

- [minor] Align styles and behaviours with updated designs [170fda7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/170fda7)

## 3.6.6

- [patch] Updated dependencies [90ba6bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90ba6bd)
  - @atlaskit/global-navigation@4.2.2
  - @atlaskit/analytics-namespaced-context@2.1.2
  - @atlaskit/analytics-listeners@4.0.0

## 3.6.5

- [patch] Update navigation item analytics to gracefully handle invalid or missing ID prop [c3e29af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3e29af)

## 3.6.4

- [patch] Remove BackItem extra margin [bc2d997](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bc2d997)

## 3.6.3

- [patch] Update navigation item click analytics to use an attribute identifier rather than action subject ID. Also convert kebab-case ids to camelCase. [5efaeaf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5efaeaf)

## 3.6.2

- [patch] add better guards around browser globals for SSR [a3db793](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3db793)

## 3.6.1

- [patch] Fix navigation componentName analytics context attribute being placed underneath attributes. It will now appear in componentHierarchy correctly in the resulting event payload rather than componentName [ac34b7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac34b7a)

* [none] Updated dependencies [ac34b7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac34b7a)
  - @atlaskit/global-navigation@4.2.0
* [none] Updated dependencies [f02fb34](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f02fb34)
  - @atlaskit/global-navigation@4.2.0
* [none] Updated dependencies [20b8844](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20b8844)
  - @atlaskit/analytics-listeners@3.4.0
  - @atlaskit/global-navigation@4.2.0
* [none] Updated dependencies [85ddb9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85ddb9e)
  - @atlaskit/global-navigation@4.2.0
  - @atlaskit/analytics-listeners@3.4.0

## 3.6.0

- [minor] GoToItems in views automatically render a Spinner when their goTo prop matches the incoming view ID. [ac0084c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac0084c)

## 3.5.2

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/badge@9.1.1
  - @atlaskit/global-navigation@4.1.6

## 3.5.1

- [patch] Updated dependencies [dfa100e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfa100e)
  - @atlaskit/analytics-listeners@3.3.1
  - @atlaskit/analytics-namespaced-context@2.1.1
  - @atlaskit/global-navigation@4.1.5

## 3.5.0

- [minor] Instrument expanding and collapsing navigation with analytics [e7d32d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7d32d5)
- [none] Updated dependencies [e7d32d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7d32d5)

## 3.4.0

- [minor] Add an operational event for navigation UI initialisation within the LayerManagerWithViewController component [6c2fdd3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c2fdd3)
- [none] Updated dependencies [2d53fc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d53fc1)
  - @atlaskit/analytics-listeners@3.3.0

## 3.3.6

- [patch] add switcher to nav-next ui components docs page [e083d63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e083d63)
- [none] Updated dependencies [e083d63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e083d63)
  - @atlaskit/select@5.0.10

## 3.3.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/toggle@5.0.6
  - @atlaskit/select@5.0.9
  - @atlaskit/section-message@1.0.5
  - @atlaskit/lozenge@6.1.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/global-navigation@4.1.4
  - @atlaskit/field-base@11.0.5
  - @atlaskit/dropdown-menu@6.1.8
  - @atlaskit/badge@9.1.0
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 3.3.4

- [patch] Fix analytics instrumentation of custom component clicks. Custom components will no longer be wrapped with a div that listens to click events and instead will have their onClick prop wrapped with analytics. If custom components wish to send navigationItem click events, they should attach the onClick prop to a DOM element under their control. [4ab7c4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4ab7c4e)
- [none] Updated dependencies [06bf373](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06bf373)
  - @atlaskit/global-navigation@4.1.3

## 3.3.3

- [patch] Fixing update active view method in ViewController [15f93f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/15f93f0)
- [patch] Updated dependencies [15f93f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/15f93f0)
  - @atlaskit/global-navigation@4.1.2

## 3.3.2

- [patch] Fixing dynamic styles on global nagivation [0b2daf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b2daf0)
- [patch] Updated dependencies [0b2daf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b2daf0)
  - @atlaskit/global-navigation@4.1.1

## 3.3.1

- [patch] Prevent page wrapper from growing beyond available space [ee25869](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee25869)
- [patch] Updated dependencies [ee25869](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee25869)

## 3.3.0

- [minor] Instrument analytics for global and product nav item clicks. These will automatically be captured when using the FabricAnalyticsListeners component to listen for them. Note that some event data attributes rely on the ViewRenderer and LayoutManagerWithViewController being used instead of manual component composition. [51e9bee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51e9bee)
- [patch] Updated dependencies [f7432a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7432a2)
  - @atlaskit/analytics-next@3.0.5
  - @atlaskit/global-navigation@4.1.0
- [none] Updated dependencies [b77a884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b77a884)
  - @atlaskit/global-navigation@4.1.0

## 3.2.4

- [patch] Add variable name displayNames for anonymous function SFC components to improve debugging experience [2e148df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e148df)
- [none] Updated dependencies [50d469f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50d469f)
  - @atlaskit/global-navigation@4.0.6

## 3.2.3

- [patch] Update icon color for selected navigation item [d0ab79d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0ab79d)
- [patch] Updated dependencies [d0ab79d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0ab79d)

## 3.2.2

- [patch] Reintroduce navigation z-index [44ac36b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44ac36b)
- [none] Updated dependencies [44ac36b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44ac36b)

## 3.2.1

- [patch] Updated dependencies [626244b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/626244b)
  - @atlaskit/global-navigation@4.0.5

## 3.2.0

- [minor] export wrapped LayoutManager component which is connected to the views API and handles the content navigation automatically. export skeleton components for the Item and ContainerHeader. Renderer now accepts components as a 'type'. [f48e761](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f48e761)
- [none] Updated dependencies [f48e761](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f48e761)

## 3.1.3

- [patch] Updated dependencies [6438477](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6438477)
  - @atlaskit/global-navigation@4.0.3

## 3.1.2

- [patch] Prevent square focus ring on nav resizer icon [a3663d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3663d3)
- [none] Updated dependencies [a3663d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3663d3)

## 3.1.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/global-navigation@4.0.1
  - @atlaskit/logo@9.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/section-message@1.0.3
  - @atlaskit/theme@5.1.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/badge@9.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/avatar@14.0.5
  - @atlaskit/field-base@11.0.2

## 3.1.0

- [minor] add collapse listeners [90199a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90199a5)
- [none] Updated dependencies [90199a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90199a5)

## 3.0.3

- [patch] Updated dependencies [d0733a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0733a7)
  - @atlaskit/global-navigation@4.0.0

## 3.0.2

- [patch] Update docs, change dev deps [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
- [none] Updated dependencies [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
  - @atlaskit/select@5.0.4
  - @atlaskit/avatar@14.0.3
  - @atlaskit/global-navigation@3.0.2

## 3.0.1

- [patch] fix icon imports [df7e2e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df7e2e0)
- [none] Updated dependencies [df7e2e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df7e2e0)

## 3.0.0

- [major] Significant overhaul of API. Publish docs. [532892d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/532892d)
- [none] Updated dependencies [532892d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/532892d)
  - @atlaskit/global-navigation@3.0.1

## 2.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/select@5.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/dropdown-menu@6.1.1
  - @atlaskit/avatar@14.0.1

## 2.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/logo@9.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/logo@9.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0

## 1.1.0

- [minor] Added nav-next "Switcher" component. Minor fixes and dep bump for select. [ed5d8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed5d8d1)
- [none] Updated dependencies [ed5d8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed5d8d1)
  - @atlaskit/select@4.4.0

## 1.0.3

- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/dropdown-menu@5.2.3

## 1.0.2

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/dropdown-menu@5.2.2

## 1.0.1

- [patch] Fix export 'brightness' was not found in 'chromatism' warning/error in navigation-next [0c9d7b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c9d7b1)

## 1.0.0

- [major] Extract standalone Drawer component. Remove drawer state from navigation state manager navigation-next. Stop exporting Drawer component in global-navigation [d11307b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d11307b)

## 0.3.4

- [patch] Update props api for global-navigation. Change the way ResizeControl works in navigation-next [1516d79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1516d79)

## 0.3.3

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/field-base@10.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/theme@4.0.4
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/logo@8.1.2
  - @atlaskit/icon@12.1.2
  - @atlaskit/dropdown-menu@5.0.4

## 0.3.2

- [patch] Add title prop to Group component that will render a title for the group. This is an easier alternative to specifying a separate title item within the group itself. [7200aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7200aa4)

## 0.3.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/logo@8.1.1
  - @atlaskit/field-base@10.1.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/badge@8.0.3
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 0.3.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/logo@8.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/lozenge@5.0.2
  - @atlaskit/badge@8.0.2
  - @atlaskit/field-base@10.1.0

## 0.2.2

- [patch] Fix goTo items not working with href properties. If they have an href, they will prevent the default link action and transition instead, however, they will still be able to be opened in a new tab via middle/right click. [ba0ba79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba0ba79)

## 0.2.1

- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/toggle@4.0.1
  - @atlaskit/logo@8.0.1
  - @atlaskit/field-base@10.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/lozenge@5.0.1
  - @atlaskit/badge@8.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/dropdown-menu@5.0.1
  - @atlaskit/avatar@11.0.1

## 0.2.0

- [minor] rename NavAPI to ViewState and export a RootViewSubscriber and a ContainerViewSubscriber instead of NavAPISubscriber. we now have independent view state managers for root and container views. [41f5218](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41f5218)

## 0.1.3

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/logo@8.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/badge@8.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0
  - @atlaskit/avatar@11.0.0

## 0.1.2

- [patch] navigation-next Item should be updated when new props are different than previous [615e77c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/615e77c)

## 0.1.1

- [patch] add some reducer util functions [3882051](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3882051)

## 0.1.0

- [minor] export basic renderer [a53eda9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a53eda9)

## 0.0.7

- [patch] Exports types for global-navigation to consume [7c99742](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c99742)

## 0.0.6

- [patch] Add debug prop to NavigationProvider that enables Nav API debug logging [018d77d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/018d77d)

## 0.0.5

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/logo@7.0.1
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/theme@3.2.2
  - @atlaskit/badge@7.1.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/lozenge@4.0.1

## 0.0.4

- [patch] port nav views API to ak. only has support for root views atm. also renderer isn't finalised. [25805b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25805b8)

## 0.0.2

- [patch] release @atlaskit/navigation-next [33492df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33492df)
