# @atlaskit/media-avatar-picker

## 22.2.1

### Patch Changes

- Updated dependencies

## 22.2.0

### Minor Changes

- [`5e6fa1c70a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e6fa1c70a5) - fix unit tests for modal dialog
- [`9c0241362a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c0241362a6) - [ux] Upgrade to the latest version of @atlaskit/modal-dialog. This change includes shifting the primary button in the footer of the modal to be on the right instead of the left.

### Patch Changes

- Updated dependencies

## 22.1.8

### Patch Changes

- Updated dependencies

## 22.1.7

### Patch Changes

- [`d61fa7df04b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d61fa7df04b) - [ux] Removes unnecessary scroll in media's avatar picker dialog.
- Updated dependencies

## 22.1.6

### Patch Changes

- [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed media bundle names following atlassian-frontend linting rules
- Updated dependencies

## 22.1.5

### Patch Changes

- Updated dependencies

## 22.1.4

### Patch Changes

- Updated dependencies

## 22.1.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 22.1.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 22.1.1

### Patch Changes

- Updated dependencies

## 22.1.0

### Minor Changes

- [`7d831363d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d831363d9) - Migrated to declarative entry points

### Patch Changes

- Updated dependencies

## 22.0.3

### Patch Changes

- Updated dependencies

## 22.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 22.0.1

### Patch Changes

- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`861d585ba8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/861d585ba8) - Changed mediaSingle to now render it's child adf nodes using nodeviews rather than directly with react
- Updated dependencies

## 22.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 21.2.9

### Patch Changes

- Updated dependencies

## 21.2.8

### Patch Changes

- Updated dependencies

## 21.2.7

### Patch Changes

- [patch][d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):

  Remove export \* from media components- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [41a2496393](https://bitbucket.org/atlassian/atlassian-frontend/commits/41a2496393):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [bbf5eb8824](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbf5eb8824):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [6b06a7baa9](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b06a7baa9):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [8b34c7371d](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b34c7371d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-ui@12.0.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/media-test-helpers@27.0.0
  - @atlaskit/media-core@31.0.5
  - @atlaskit/button@13.3.9
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/spinner@12.1.6

## 21.2.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/page@11.0.12
  - @atlaskit/range@3.0.12
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/media-core@31.0.4
  - @atlaskit/media-test-helpers@26.1.1
  - @atlaskit/media-ui@11.8.3

## 21.2.5

### Patch Changes

- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
  - @atlaskit/media-test-helpers@26.1.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/media-ui@11.8.2
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/page@11.0.11

## 21.2.4

### Patch Changes

- Updated dependencies [966622bd45](https://bitbucket.org/atlassian/atlassian-frontend/commits/966622bd45):
- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
- Updated dependencies [6ee177aeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee177aeb4):
  - @atlaskit/media-test-helpers@26.0.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-core@31.0.3
  - @atlaskit/media-ui@11.8.1

## 21.2.3

- Updated dependencies [24b8ea2667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24b8ea2667):
  - @atlaskit/media-test-helpers@25.2.2
  - @atlaskit/media-core@31.0.0

## 21.2.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 21.2.1

### Patch Changes

- [patch][fc79969f86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc79969f86):

  Update all the theme imports in media to use multi entry points

## 21.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 21.1.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 21.1.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 21.1.3

- Updated dependencies [69586b5353](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69586b5353):
  - @atlaskit/media-core@30.0.10
  - @atlaskit/media-ui@11.5.2
  - @atlaskit/media-test-helpers@25.0.0

## 21.1.2

### Patch Changes

- [patch][6ad542fe85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ad542fe85):

  Adding try/catch in async imports for @atlaskit/media-avatar-picker, @atlaskit/media-card, @atlaskit/media-editor, @atlaskit/media-viewer

## 21.1.1

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 21.1.0

### Minor Changes

- [minor][ad020848a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad020848a9):

  Allow to pass placeholder to MediaAvatarPicker to render a custom component while it loads

  ```
  import {AvatarPickerDialog} from '@atlaskit/media-avatar-loader'
  ```

<AvatarPickerDialog
placeholder={<div>Avatar picker is loading...</div>}
/>

```

Otherwise still defaults to the existing `ModalSpinner` component

## 21.0.11

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

bugfix, fixes missing version.json file

## 21.0.10

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

In this PR, we are:

- Re-introducing dist build folders
- Adding back cjs
- Replacing es5 by cjs and es2015 by esm
- Creating folders at the root for entry-points
- Removing the generation of the entry-points at the root
  Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 21.0.9

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
- @atlaskit/docs@8.1.3
- @atlaskit/button@13.0.9
- @atlaskit/modal-dialog@10.0.7
- @atlaskit/media-test-helpers@24.1.2
- @atlaskit/media-ui@11.4.1
- @atlaskit/icon@19.0.0

## 21.0.8

- Updated dependencies [4a08d1912e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a08d1912e):
- @atlaskit/range@3.0.0

## 21.0.7

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
- @atlaskit/docs@8.1.2
- @atlaskit/button@13.0.8
- @atlaskit/modal-dialog@10.0.4
- @atlaskit/media-test-helpers@24.0.3
- @atlaskit/media-ui@11.2.8
- @atlaskit/field-range@7.0.4
- @atlaskit/icon@18.0.0

## 21.0.6

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

- This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 21.0.5

- [patch][92381960e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92381960e9):

- Updated types to support modal-dialog typescript conversion

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies [9ecfef12ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ecfef12ac):
- @atlaskit/button@13.0.4
- @atlaskit/media-ui@11.2.5
- @atlaskit/spinner@12.0.0
- @atlaskit/icon@17.1.2
- @atlaskit/modal-dialog@10.0.0
- @atlaskit/media-core@30.0.3
- @atlaskit/media-test-helpers@24.0.0

## 21.0.4

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
- @atlaskit/media-ui@11.2.4
- @atlaskit/page@11.0.0

## 21.0.3

- [patch][76ebbc0130](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76ebbc0130):

- Fix panning and zooming with avatar picker using new viewport.

## 21.0.2

- [patch][6f712416f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6f712416f4):

- Removing dependency of media-core on media-avatar-picker

## 21.0.1

- Updated dependencies [ed3f034232](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed3f034232):
- @atlaskit/media-core@30.0.1
- @atlaskit/media-ui@11.1.1
- @atlaskit/media-test-helpers@23.0.0

## 21.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

- Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

- Updated dependencies [7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
- @atlaskit/docs@8.0.0
- @atlaskit/button@13.0.0
- @atlaskit/field-range@7.0.0
- @atlaskit/icon@17.0.0
- @atlaskit/modal-dialog@9.0.0
- @atlaskit/page@10.0.0
- @atlaskit/spinner@11.0.0
- @atlaskit/theme@9.0.0
- @atlaskit/media-core@30.0.0
- @atlaskit/media-test-helpers@22.0.0
- @atlaskit/media-ui@11.0.0

## 20.0.0

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
- @atlaskit/media-test-helpers@21.4.0
- @atlaskit/media-core@29.3.0

## 19.0.0

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
- @atlaskit/media-test-helpers@21.3.0
- @atlaskit/media-core@29.2.0

## 18.0.3

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

- Bump tslib

## 18.0.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
- @atlaskit/docs@7.0.3
- @atlaskit/button@12.0.3
- @atlaskit/field-range@6.0.4
- @atlaskit/icon@16.0.9
- @atlaskit/modal-dialog@8.0.7
- @atlaskit/spinner@10.0.7
- @atlaskit/media-ui@10.1.5
- @atlaskit/theme@8.1.7

## 18.0.1

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
- @atlaskit/docs@7.0.2
- @atlaskit/icon@16.0.8
- @atlaskit/modal-dialog@8.0.6
- @atlaskit/page@9.0.3
- @atlaskit/spinner@10.0.5
- @atlaskit/theme@8.1.6
- @atlaskit/media-core@29.1.4
- @atlaskit/media-ui@10.1.3
- @atlaskit/field-range@6.0.3
- @atlaskit/button@12.0.0

## 18.0.0

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
- @atlaskit/media-test-helpers@21.1.0
- @atlaskit/media-core@29.1.0

## 17.0.2

- [patch][730d7657fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/730d7657fc):

- Support images with EXIF orientation tag

## 17.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

- Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 17.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

- Dropped ES5 distributables from the typescript packages

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
- @atlaskit/docs@7.0.1
- @atlaskit/icon@16.0.5
- @atlaskit/modal-dialog@8.0.2
- @atlaskit/page@9.0.1
- @atlaskit/spinner@10.0.1
- @atlaskit/theme@8.0.1
- @atlaskit/field-range@6.0.1
- @atlaskit/button@11.0.0
- @atlaskit/media-core@29.0.0
- @atlaskit/media-test-helpers@21.0.0
- @atlaskit/media-ui@10.0.0

## 16.0.0

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
- @atlaskit/media-test-helpers@20.1.8
- @atlaskit/media-core@28.0.0

## 15.0.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
- @atlaskit/button@10.1.3
- @atlaskit/icon@16.0.4
- @atlaskit/media-core@27.2.3
- @atlaskit/media-ui@9.2.1
- @atlaskit/media-test-helpers@20.1.7
- @atlaskit/docs@7.0.0
- @atlaskit/field-range@6.0.0
- @atlaskit/modal-dialog@8.0.0
- @atlaskit/page@9.0.0
- @atlaskit/spinner@10.0.0
- @atlaskit/theme@8.0.0

## 15.0.0

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
- @atlaskit/media-test-helpers@20.1.6
- @atlaskit/media-core@27.2.0

## 14.0.0

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
- @atlaskit/media-test-helpers@20.1.5
- @atlaskit/media-core@27.1.0

## 13.0.2

- [patch][87a9c70162](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a9c70162):

- Update use of ModalSpinner component

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
- @atlaskit/media-test-helpers@20.1.2
- @atlaskit/media-ui@9.0.0

## 13.0.1

- [patch][ef469cbb0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef469cbb0b):

- MS-357 replaced @atlaskit/util-shared-styles from media components by @atlaskit/theme

## 13.0.0

- [major][a0972d484a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0972d484a):

- Remove from export everything but AvatarPickerDialog and Avatar (which is TS interface)

## 12.1.12

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
- @atlaskit/media-test-helpers@20.1.0
- @atlaskit/media-core@27.0.0

## 12.1.11

- Updated dependencies [07a187bb30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07a187bb30):
- @atlaskit/media-core@26.2.1
- @atlaskit/media-ui@8.2.6
- @atlaskit/media-test-helpers@20.0.0

## 12.1.10

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
- @atlaskit/docs@6.0.1
- @atlaskit/button@10.1.2
- @atlaskit/modal-dialog@7.2.1
- @atlaskit/media-test-helpers@19.1.1
- @atlaskit/media-ui@8.2.5
- @atlaskit/field-range@5.0.14
- @atlaskit/icon@16.0.0

## 12.1.9

- Updated dependencies [3ad16f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ad16f3):
- @atlaskit/media-core@26.1.0
- @atlaskit/media-ui@8.2.4
- @atlaskit/media-test-helpers@19.0.0

## 12.1.8

- [patch][6855bec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6855bec):

- Updated internal use of ModalDialog to use new composition API

## 12.1.7

- [patch][e6516fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6516fb):

- Move media mocks into right location to prevent them to be included in dist

## 12.1.6

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
- @atlaskit/media-test-helpers@18.9.1
- @atlaskit/media-core@26.0.0

## 12.1.5

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
- @atlaskit/media-core@25.0.0
- @atlaskit/media-test-helpers@18.9.0

## 12.1.4

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

- Add SSR support to media components

## 12.1.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
- @atlaskit/button@10.1.1
- @atlaskit/field-range@5.0.12
- @atlaskit/icon@15.0.2
- @atlaskit/modal-dialog@7.1.1
- @atlaskit/page@8.0.12
- @atlaskit/spinner@9.0.13
- @atlaskit/media-core@24.5.2
- @atlaskit/media-ui@8.1.2
- @atlaskit/docs@6.0.0

## 12.1.2

- [patch][e375b42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e375b42):

- Update props description

## 12.1.1

- Updated dependencies [5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):
- @atlaskit/media-test-helpers@18.5.2
- @atlaskit/media-ui@8.0.0

## 12.1.0

- [minor][87fe781](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87fe781):

# Productionise ImagePlacer component

The ImagePlacer component provides a polished and flexible solution when
users require placement of an image inside a fixed area, such as avatar or header image selection.
The component is designed to work with mouse and touch events, respond to wheel events, is optimised
to handle large images, and can also respect Exif orientation values.

## 12.0.3

- [patch][5a6de24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a6de24):

- translate component properties in media components

## 12.0.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
- @atlaskit/docs@5.2.2
- @atlaskit/button@10.0.1
- @atlaskit/modal-dialog@7.0.13
- @atlaskit/media-test-helpers@18.3.1
- @atlaskit/media-ui@7.6.2
- @atlaskit/icon@15.0.0

## 12.0.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
- @atlaskit/docs@5.2.1
- @atlaskit/icon@14.6.1
- @atlaskit/modal-dialog@7.0.12
- @atlaskit/spinner@9.0.11
- @atlaskit/media-ui@7.6.1
- @atlaskit/field-range@5.0.9
- @atlaskit/button@10.0.0

## 12.0.0

- [major][b758737](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b758737):

- add i18n support to media-avatar-picker

## 11.0.5

- [patch] Updated dependencies [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)
- @atlaskit/media-test-helpers@18.2.10
- @atlaskit/media-ui@7.0.0

## 11.0.4

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
- @atlaskit/docs@5.0.8
- @atlaskit/button@9.0.13
- @atlaskit/modal-dialog@7.0.2
- @atlaskit/media-test-helpers@18.2.1
- @atlaskit/media-ui@6.0.1
- @atlaskit/icon@14.0.0

## 11.0.3

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
- @atlaskit/media-test-helpers@18.2.0
- @atlaskit/media-ui@6.0.0

## 11.0.2

- [patch] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
- @atlaskit/media-test-helpers@18.0.0

## 11.0.1

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- @atlaskit/media-test-helpers@17.0.2

## 11.0.0

- [major] Changes the pattern for using dialogs. Adds ModalTransition component to @atlaskit/modal-dialog. See the [migration guide](http://atlaskit.atlassian.com/packages/core/modal-dialog/docs/migration) for more information. [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)

## 10.0.3

- [patch] Updated dependencies [911a570](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911a570)
- @atlaskit/media-test-helpers@17.0.0

## 10.0.2

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
- @atlaskit/media-ui@5.1.2

## 10.0.1

- [patch] Use Camera class in avatar picker [335ab1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/335ab1e)
- [patch] Updated dependencies [335ab1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/335ab1e)
- @atlaskit/media-ui@5.1.0

## 10.0.0

- [major] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
- @atlaskit/media-test-helpers@16.0.0

## 9.2.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
- @atlaskit/media-ui@5.0.2
- @atlaskit/icon@13.2.2
- @atlaskit/button@9.0.4
- @atlaskit/media-test-helpers@15.2.1
- @atlaskit/field-range@5.0.2
- @atlaskit/spinner@9.0.4
- @atlaskit/docs@5.0.2
- @atlaskit/modal-dialog@6.0.5

## 9.2.0

- [patch] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- @atlaskit/media-ui@5.0.0
- @atlaskit/media-test-helpers@15.1.0
- [patch] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- @atlaskit/media-ui@5.0.0
- @atlaskit/media-test-helpers@15.1.0
- [patch] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
- @atlaskit/media-ui@5.0.0
- @atlaskit/media-test-helpers@15.1.0
- [minor] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
- @atlaskit/media-ui@5.0.0

## 9.1.0

- [minor] fix panning and origin problems. minor visual improvements. [2045263](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2045263)

## 9.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- @atlaskit/modal-dialog@6.0.0
- @atlaskit/button@9.0.0
- @atlaskit/media-ui@4.0.0
- @atlaskit/media-test-helpers@15.0.0
- @atlaskit/field-range@5.0.0
- @atlaskit/spinner@9.0.0
- @atlaskit/docs@5.0.0
- @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- @atlaskit/media-ui@4.0.0
- @atlaskit/media-test-helpers@15.0.0
- @atlaskit/modal-dialog@6.0.0
- @atlaskit/button@9.0.0
- @atlaskit/field-range@5.0.0
- @atlaskit/spinner@9.0.0
- @atlaskit/docs@5.0.0
- @atlaskit/icon@13.0.0

## 8.1.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
- @atlaskit/spinner@8.0.0
- @atlaskit/button@8.2.3

## 8.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- @atlaskit/media-ui@3.1.2
- @atlaskit/media-test-helpers@14.0.3
- @atlaskit/modal-dialog@5.2.2
- @atlaskit/button@8.1.2
- @atlaskit/field-range@4.0.3
- @atlaskit/spinner@7.0.2
- @atlaskit/icon@12.1.2

## 8.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- @atlaskit/media-ui@3.1.1
- @atlaskit/media-test-helpers@14.0.2
- @atlaskit/spinner@7.0.1
- @atlaskit/modal-dialog@5.1.1
- @atlaskit/icon@12.1.1
- @atlaskit/button@8.1.1
- @atlaskit/docs@4.1.1

## 8.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
- @atlaskit/spinner@7.0.0
- @atlaskit/modal-dialog@5.1.0
- @atlaskit/icon@12.1.0
- @atlaskit/media-ui@3.1.0
- @atlaskit/docs@4.1.0
- @atlaskit/media-test-helpers@14.0.1
- @atlaskit/field-range@4.0.2
- @atlaskit/button@8.1.0

## 8.0.1

- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- @atlaskit/modal-dialog@5.0.1
- @atlaskit/icon@12.0.1
- @atlaskit/button@8.0.1
- @atlaskit/field-range@4.0.1
- @atlaskit/spinner@6.0.1
- @atlaskit/docs@4.0.1

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- @atlaskit/media-ui@3.0.0
- @atlaskit/media-test-helpers@14.0.0
- @atlaskit/modal-dialog@5.0.0
- @atlaskit/icon@12.0.0
- @atlaskit/button@8.0.0
- @atlaskit/field-range@4.0.0
- @atlaskit/spinner@6.0.0
- @atlaskit/docs@4.0.0

## 7.1.3

- [patch] Updated dependencies [bd26d3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd26d3c)
- @atlaskit/media-test-helpers@13.0.1

## 7.1.2

- [patch] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
- @atlaskit/media-test-helpers@13.0.0
- [patch] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
- @atlaskit/media-test-helpers@13.0.0

## 7.1.1

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
- @atlaskit/icon@11.3.0
- @atlaskit/media-ui@2.1.1
- @atlaskit/modal-dialog@4.0.5
- @atlaskit/media-test-helpers@12.0.4
- @atlaskit/button@7.2.5
- @atlaskit/field-range@3.0.2
- @atlaskit/spinner@5.0.2
- @atlaskit/docs@3.0.4

## 7.1.0

- [minor] Allow to customize default avatar list text [d2a7642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2a7642)

## 7.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 7.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.0.6

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 5.4.3

- [patch] Remove TS types that requires styled-components v3 [836e53b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/836e53b)

## 5.4.1

- [patch] Clean up avatar picker dependencies, update readme [a98a141](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a98a141)

## 5.4.0

- [minor] implement loading state in media-avatar-picker [13f9d50](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13f9d50)

## 5.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 5.2.0

- [minor][msw-418] add error state to avatar picker [19c9e98](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19c9e98)

## 5.1.1

- [patch] AvatarPickerDialog: Hide avatar list if avatars prop is empty. Vertically center dialog contents [9d496ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d496ad)

## 5.1.0

- [minor] AvatarPickerDialog: added onImagePickedDataURI prop. The callback will be passed the base64 data URI of the cropped image as a string. onImagePickedDataURI is now optional [eacb1d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eacb1d3)

## 5.0.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 4.6.0

- [minor][msw-338] feat - ability to remove [9905003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9905003)

## 4.5.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 4.4.3

- [patch] Fix console error when running under a React 16 environment. [36d5c0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36d5c0d)

## 4.4.2

- [patch] Update dependencies [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 4.4.0

- [minor] update avatar picker to latest design specs, add snapshot tests [bb4b25d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb4b25d)

## 4.3.11

- [patch] apply prettier to avatar picker source to reduce noise on future PRs [cc618e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc618e4)

## 4.3.7

- [patch] Ensure avatar picker with source submits default image [f8c957f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f8c957f)

## 4.3.5

- [patch] apply pretty printing to avatar picker src [fb77dce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb77dce)

## 4.3.1

- [patch] fix onClick events not firing in media-avatar-picker dialog [cb54328](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb54328)

## 4.2.0

- [minor][msw-339] customise avatar picker dialog labels [c9686ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9686ad)

## 4.1.1

- [patch] fix broken syntax in avatar example [c7cc95d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7cc95d)

## 4.0.1

- [patch] expose Avatar type, fix broken example deps [f3f4bec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3f4bec)

## 4.0.0

- [major] fix selection of predefined avatars. breaking changes, reduced public interface to only expose AvatarPickerDialog. [f76449f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f76449f)

## 3.3.5

- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)
- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 3.3.2

- [patch] Dont render AvatarList when image is selected [25c2253](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25c2253)

## 3.3.1

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)

## 3.3.0

- [minor] Bump media-avatar-picker [36d89f0](36d89f0)

## 3.2.0

- [minor] Upgrade Media Editor packages [193c8a0](193c8a0)

## 3.1.0 (2017-11-16)

- feature; contrain media-avatar-picker panning and zooming ([be3a131](https://bitbucket.org/atlassian/atlaskit/commits/be3a131))

## 3.0.1 (2017-09-18)

- bug fix; update media-core and media-test-helpers version ([00108cf](https://bitbucket.org/atlassian/atlaskit/commits/00108cf))

## 3.0.0 (2017-09-11)

- bug fix; ensures boolean value for hasRenderedImage variable ([a9d53e2](https://bitbucket.org/atlassian/atlaskit/commits/a9d53e2))
- bug fix; renames AvatarPickerDialog props and adds more descriptive variable names and comment ([f323500](https://bitbucket.org/atlassian/atlaskit/commits/f323500))
- breaking; new required props for AvatarPickerDialog and ImageNavigator ([f119bfe](https://bitbucket.org/atlassian/atlaskit/commits/f119bfe))
- breaking; adds onSaveAvatar, onSaveImage and onCancel props to AvatarPickerDialog ([f119bfe](https://bitbucket.org/atlassian/atlaskit/commits/f119bfe))

## 2.3.0 (2017-08-11)

- feature; bump :allthethings: ([f4b1375](https://bitbucket.org/atlassian/atlaskit/commits/f4b1375))

## 2.2.4 (2017-08-03)

- bug fix; fixes broken storybooks due to ED-2389 ([184d93a](https://bitbucket.org/atlassian/atlaskit/commits/184d93a))

## 2.2.3 (2017-08-01)

- bug fix; bumping media-core ([6488cfc](https://bitbucket.org/atlassian/atlaskit/commits/6488cfc))

## 2.2.1 (2017-07-21)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))
- fix; remove SC from peerDependencies to dependencies ([568161b](https://bitbucket.org/atlassian/atlaskit/commits/568161b))

## 2.2.0 (2017-07-10)

- feature; use [@atlaskit](https://github.com/atlaskit)/slider instead of the one from [@atlaskit](https://github.com/atlaskit)/media-avatar-picker ([10aee5d](https://bitbucket.org/atlassian/atlaskit/commits/10aee5d))

## 2.1.0 (2017-06-08)

- fix; remove media-test-helpers from avatar-picker src ([1c80d71](https://bitbucket.org/atlassian/atlaskit/commits/1c80d71))
- feature; add image uploader feature to avatar-picker ([d159185](https://bitbucket.org/atlassian/atlaskit/commits/d159185))
- feature; allow drag files into avatar-picker uploader ([0b5503f](https://bitbucket.org/atlassian/atlaskit/commits/0b5503f))

## 2.0.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.0.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.0.0 (2017-04-19)

- feature; add export functionality to ImageNavigator component ([7c08a4e](https://bitbucket.org/atlassian/atlaskit/commits/7c08a4e))
```
