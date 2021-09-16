# @atlaskit/feedback-collector

## 7.1.0

### Minor Changes

- [`dc5c87fae7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc5c87fae7d) - Instrumented feedback-collector with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha). These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`9e89e2d2731`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e89e2d2731) - atlaskit/button has been moved from devDependency to dependency since it is require by runtime code
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 7.0.0

### Major Changes

- [`b000daa6f08`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b000daa6f08) - [ux] Refactor to use new modal dialog API. This includes button order being reversed so that the primary button is on the right.

### Patch Changes

- [`5fe6e21a9a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fe6e21a9a0) - [ux] Upgrade to the latest version of @atlaskit/modal-dialog. This change includes shifting the primary button in the footer of the modal to be on the right instead of the left.
- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 6.2.0

### Minor Changes

- [`d8083af448f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8083af448f) - Updated flexibility for localisation and copy custimisation through additional optional props: description, title, submitButtonLabel, cancelButtonLabel, selectOptionDetails

### Patch Changes

- Updated dependencies

## 6.1.12

### Patch Changes

- Updated dependencies

## 6.1.11

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 6.1.10

### Patch Changes

- Updated dependencies

## 6.1.9

### Patch Changes

- [`76f16d562bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76f16d562bc) - Removed styled-components as a peerDependency

## 6.1.8

### Patch Changes

- [`b71e86a459f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b71e86a459f) - [ux] fixes bug in feedback collector examples where flag would not autodismiss
- Updated dependencies

## 6.1.7

### Patch Changes

- [`82f5dd62177`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82f5dd62177) - Removed axios as a dev dependency since it's no longer used

## 6.1.6

### Patch Changes

- Updated dependencies

## 6.1.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 6.1.4

### Patch Changes

- Updated dependencies

## 6.1.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 6.1.2

### Patch Changes

- Updated dependencies

## 6.1.1

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [`ae57065429`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae57065429) - Updated flexibility for localisation and copy custimisation through additional optional props: showTypeField, feedbackTitle, feedbackTitleDetails, enrolInResearchLabel, canBeContactedLabel, summaryPlaceholder

### Patch Changes

- Updated dependencies

## 6.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 6.0.2

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 5.0.1

### Patch Changes

- [patch][4a06a49210](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a06a49210):

  Change imports to comply with Atlassian conventions- Updated dependencies [bf7a09790f](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf7a09790f):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies [2e52d035cd](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e52d035cd):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
  - @atlaskit/flag@12.3.11
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/logo@12.3.4
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/navigation-next@8.0.4
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/form@7.2.1

## 5.0.0

### Major Changes

- [major][5399d36ca2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5399d36ca2):

  Feedback-collector has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.

### Patch Changes

- Updated dependencies [4c6b8024c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6b8024c8):
- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):
- Updated dependencies [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies [5ecbbaadb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ecbbaadb3):
- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/global-navigation@9.0.0
  - @atlaskit/navigation-next@8.0.0
  - @atlaskit/form@7.1.3
  - @atlaskit/flag@12.3.8
  - @atlaskit/icon@20.0.2
  - @atlaskit/checkbox@10.1.8

## 4.0.24

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/flag@12.3.7
  - @atlaskit/form@7.1.2
  - @atlaskit/global-navigation@8.0.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/navigation-next@7.3.7
  - @atlaskit/select@11.0.7
  - @atlaskit/textarea@2.2.4
  - @atlaskit/theme@9.5.1

## 4.0.23

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [91149b1e92](https://bitbucket.org/atlassian/atlassian-frontend/commits/91149b1e92):
  - @atlaskit/icon@20.0.0
  - @atlaskit/global-navigation@8.0.6
  - @atlaskit/form@7.1.1
  - @atlaskit/navigation-next@7.3.5
  - @atlaskit/flag@12.3.6
  - @atlaskit/logo@12.3.1
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/select@11.0.6

## 4.0.22

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
  - @atlaskit/select@11.0.3
  - @atlaskit/form@7.0.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/navigation-next@7.3.0
  - @atlaskit/textarea@2.2.3

## 4.0.21

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages- Updated dependencies [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2
  - @atlaskit/navigation-next@7.1.3

## 4.0.20

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/form@6.3.2
  - @atlaskit/modal-dialog@10.3.6
  - @atlaskit/navigation-next@7.1.1
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4
  - @atlaskit/logo@12.2.2

## 4.0.19

- Updated dependencies [4778521db3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4778521db3):
  - @atlaskit/global-navigation@8.0.4
  - @atlaskit/navigation-next@7.0.0

## 4.0.18

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 4.0.17

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/form@6.2.3
  - @atlaskit/global-navigation@8.0.1
  - @atlaskit/modal-dialog@10.3.1
  - @atlaskit/select@10.1.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 4.0.16

### Patch Changes

- [patch][738e9f87ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/738e9f87ff):

  FeedbackCollector: Fix regression to ensure the network request fires. Ignore linting rule instead of clearing timeout on unmount.

## 4.0.15

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 4.0.14

- Updated dependencies [f0305e1b06](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0305e1b06):
  - @atlaskit/navigation-next@6.6.3
  - @atlaskit/global-navigation@8.0.0

## 4.0.13

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 4.0.12

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 4.0.11

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 4.0.10

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 4.0.9

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/form@6.1.4
  - @atlaskit/logo@12.1.1
  - @atlaskit/modal-dialog@10.0.10
  - @atlaskit/navigation-next@6.3.4
  - @atlaskit/select@10.0.0

## 4.0.8

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/form@6.1.2
  - @atlaskit/modal-dialog@10.0.8
  - @atlaskit/select@9.1.10
  - @atlaskit/checkbox@9.0.0

## 4.0.7

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/form@6.1.1
  - @atlaskit/flag@12.0.10
  - @atlaskit/global-navigation@7.3.1
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/navigation-next@6.3.2
  - @atlaskit/select@9.1.8
  - @atlaskit/icon@19.0.0

## 4.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 4.0.5

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/flag@12.0.4
  - @atlaskit/form@6.0.5
  - @atlaskit/global-navigation@7.2.4
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/navigation-next@6.0.8
  - @atlaskit/select@9.1.5
  - @atlaskit/icon@18.0.0

## 4.0.4

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/form@6.0.4
  - @atlaskit/modal-dialog@10.0.2
  - @atlaskit/select@9.1.4
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 4.0.3

- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/form@6.0.3
  - @atlaskit/global-navigation@7.2.2
  - @atlaskit/icon@17.1.2
  - @atlaskit/navigation-next@6.0.5
  - @atlaskit/select@9.1.2
  - @atlaskit/modal-dialog@10.0.0

## 4.0.2

- Updated dependencies [238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):
  - @atlaskit/flag@12.0.0

## 4.0.1

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/global-navigation@7.1.1
  - @atlaskit/icon@17.0.2
  - @atlaskit/navigation-next@6.0.2
  - @atlaskit/select@9.1.1
  - @atlaskit/logo@12.0.0

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 3.0.6

- Updated dependencies [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
  - @atlaskit/form@5.2.10
  - @atlaskit/textarea@1.0.0

## 3.0.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/flag@10.0.6
  - @atlaskit/form@5.2.7
  - @atlaskit/global-navigation@6.2.9
  - @atlaskit/icon@16.0.9
  - @atlaskit/logo@10.0.4
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/navigation-next@5.1.5
  - @atlaskit/section-message@2.0.3
  - @atlaskit/select@8.1.1
  - @atlaskit/textarea@0.4.4
  - @atlaskit/theme@8.1.7

## 3.0.4

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/flag@10.0.5
  - @atlaskit/form@5.2.5
  - @atlaskit/global-navigation@6.2.8
  - @atlaskit/icon@16.0.8
  - @atlaskit/logo@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/navigation-next@5.1.4
  - @atlaskit/section-message@2.0.2
  - @atlaskit/select@8.0.5
  - @atlaskit/textarea@0.4.1
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 3.0.3

- [patch][4c6816d81b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c6816d81b):

  - Fix type from typeFiedlId to typeFieldId

## 3.0.2

- Updated dependencies [f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):
  - @atlaskit/form@5.2.4
  - @atlaskit/textarea@0.4.0

## 3.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/flag@10.0.1
  - @atlaskit/form@5.2.1
  - @atlaskit/global-navigation@6.1.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/logo@10.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/navigation-next@5.0.1
  - @atlaskit/section-message@2.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/textarea@0.3.0

## 3.0.0

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

## 2.0.5

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/form@5.1.5
  - @atlaskit/logo@9.2.7
  - @atlaskit/navigation-next@4.2.3
  - @atlaskit/modal-dialog@7.2.3
  - @atlaskit/select@7.0.0

## 2.0.4

- [patch][2a8536a220](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a8536a220):

  - Button is no longer a peer dependency of this module

## 2.0.3

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/flag@9.1.9
  - @atlaskit/form@5.1.2
  - @atlaskit/global-navigation@5.5.2
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/navigation-next@4.1.2
  - @atlaskit/section-message@1.0.16
  - @atlaskit/select@6.1.19
  - @atlaskit/icon@16.0.0

## 2.0.2

- [patch][a048a85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a048a85):

  - Updated to be compatible with new Forms API

- Updated dependencies [647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):
  - @atlaskit/select@6.1.14
  - @atlaskit/form@5.0.0

## 2.0.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/field-text-area@4.0.14
  - @atlaskit/flag@9.1.8
  - @atlaskit/form@4.0.21
  - @atlaskit/global-navigation@5.3.8
  - @atlaskit/icon@15.0.2
  - @atlaskit/logo@9.2.6
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/navigation-next@4.0.9
  - @atlaskit/section-message@1.0.14
  - @atlaskit/select@6.1.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 2.0.0

- Updated dependencies [36929ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36929ef):
  - @atlaskit/button@10.1.0

## 1.0.2

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/field-text-area@4.0.13
  - @atlaskit/flag@9.1.7
  - @atlaskit/form@4.0.20
  - @atlaskit/global-navigation@5.3.6
  - @atlaskit/icon@15.0.1
  - @atlaskit/logo@9.2.5
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/navigation-next@4.0.8
  - @atlaskit/section-message@1.0.13
  - @atlaskit/select@6.1.10
  - @atlaskit/theme@7.0.0

## 1.0.1

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/flag@9.1.6
  - @atlaskit/form@4.0.19
  - @atlaskit/global-navigation@5.3.5
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/navigation-next@4.0.7
  - @atlaskit/section-message@1.0.12
  - @atlaskit/select@6.1.9
  - @atlaskit/icon@15.0.0

## 1.0.0

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/field-text-area@4.0.12
  - @atlaskit/flag@9.1.5
  - @atlaskit/form@4.0.18
  - @atlaskit/global-navigation@5.3.4
  - @atlaskit/icon@14.6.1
  - @atlaskit/logo@9.2.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/navigation-next@4.0.6
  - @atlaskit/section-message@1.0.11
  - @atlaskit/select@6.1.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.2.5

- Updated dependencies [8e753fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e753fc):
  - @atlaskit/global-navigation@5.3.2
  - @atlaskit/navigation-next@4.0.0

## 0.2.4

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

## 0.2.3

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 0.2.2

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/flag@9.0.11
  - @atlaskit/form@4.0.10
  - @atlaskit/global-navigation@5.0.1
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/navigation-next@3.15.5
  - @atlaskit/section-message@1.0.8
  - @atlaskit/select@6.0.2
  - @atlaskit/icon@14.0.0

## 0.2.1

- [patch] Updated dependencies [ac88888](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac88888)
  - @atlaskit/navigation-next@3.15.4
  - @atlaskit/global-navigation@5.0.0

## 0.2.0

- [patch] Fix bug with flag being not auto-dismissable [51fbd9b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51fbd9b)
- [minor] New set of properties to the Feedback Collector that provide improved mapping between JSD and the form. Export feedback form primitive. Removed export of the flag group, export only flag instead. [fca309f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fca309f)

## 0.1.6

- [patch] Fixed a bug that crashes dialog when something is selected; fixed a bug that caused textarea to show error state even if not empty [3a6ac76](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a6ac76)

## 0.1.5

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/form@4.0.9
  - @atlaskit/logo@9.2.2
  - @atlaskit/navigation-next@3.13.2
  - @atlaskit/select@6.0.0

## 0.1.4

- [patch] Updated dependencies [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)
  - @atlaskit/button@9.0.9
  - @atlaskit/form@4.0.5
  - @atlaskit/modal-dialog@7.0.1
  - @atlaskit/select@5.0.18
  - @atlaskit/checkbox@5.0.0

## 0.1.3

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/form@4.0.3
  - @atlaskit/global-navigation@4.3.2
  - @atlaskit/icon@13.8.1
  - @atlaskit/select@5.0.17
  - @atlaskit/flag@9.0.10
  - @atlaskit/modal-dialog@7.0.0

## 0.1.2

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 0.1.1

- [patch] Updated dependencies [d8d8107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d8107)
  - @atlaskit/select@5.0.14
  - @atlaskit/form@4.0.0
