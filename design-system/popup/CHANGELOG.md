# @atlaskit/popup

## 0.3.3

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [7a6e5f6e3d](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6e5f6e3d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/menu@0.3.0
  - @atlaskit/button@13.3.9
  - @atlaskit/radio@3.1.11
  - @atlaskit/spinner@12.1.6

## 0.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/menu@0.2.6
  - @atlaskit/popper@3.1.11
  - @atlaskit/portal@3.1.6
  - @atlaskit/radio@3.1.9
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 0.3.1

### Patch Changes

- [patch][afc9384399](https://bitbucket.org/atlassian/atlassian-frontend/commits/afc9384399):

  Adds tag prop, use this for changing (or removing with a `Fragment`) the wrapping element around the trigger.- Updated dependencies [671de2d063](https://bitbucket.org/atlassian/atlassian-frontend/commits/671de2d063):

- Updated dependencies [77ffd08ea0](https://bitbucket.org/atlassian/atlassian-frontend/commits/77ffd08ea0):
- Updated dependencies [0ae6ce5d46](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae6ce5d46):
  - @atlaskit/popper@3.1.10
  - @atlaskit/menu@0.2.5

## 0.3.0

### Minor Changes

- [minor][0946fdd319](https://bitbucket.org/atlassian/atlassian-frontend/commits/0946fdd319):

  - **BREAKING** - Changes `content` prop to expect render props instead of a component.
    This is primarily to stop your components remounting when not having a stable reference.

## 0.2.7

### Patch Changes

- [patch][eb1ecc219a](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb1ecc219a):

  Fix issue where stopping event propagation would still close a popup

## 0.2.6

### Patch Changes

- [patch][f534973bd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/f534973bd4):

  Fix a bug causing the page to scroll to top when a popup is opened- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/popper@3.1.9
  - @atlaskit/portal@3.1.4
  - @atlaskit/radio@3.1.6
  - @atlaskit/spinner@12.1.3

## 0.2.5

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/radio@3.1.5
  - @atlaskit/popper@3.1.8

## 0.2.4

### Patch Changes

- [patch][d0415ae306](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0415ae306):

  Popup now uses the correct e200 shadow

## 0.2.3

### Patch Changes

- [patch][542080be8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/542080be8a):

  Bumped react-popper and resolved infinite looping refs issue, and fixed close-on-outside-click for @atlaskit/popup- [patch][995c1f6fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/995c1f6fd6):

  Popup close on outside click no longer fires when clicking on content within the popup that re-renders

## 0.2.2

### Patch Changes

- [patch][3cad6b0118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cad6b0118):

  Exposed offset prop for popper allowing positioning of popups relative to the trigger. Added example for double pop-up pattern

## 0.2.1

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 0.2.0

### Minor Changes

- [minor][6e0bcc75ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e0bcc75ac):

  - Adds the ability to render class components as children of Popup.
  - Removes redundatnt onOpen callback prop for Popup

## 0.1.5

### Patch Changes

- [patch][93fe1d6f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93fe1d6f0d):

  Fix issue where popup content is rendered infinitely

## 0.1.4

### Patch Changes

- [patch][c0a6abed47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0a6abed47):

  Add onOpen and re-render unit tests

## 0.1.3

### Patch Changes

- [patch][28e9c65acd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e9c65acd):

  - Add multiple popups example
  - Add unit tests
  - Add useCloseManager
  - Fix bug that did not call onClose on open popups
  - Move RepositionOnUpdate to a separate file
  - Remove scroll lock and corresponding example
  - Remove requestAnimationFrame usage
  - Replace @emotion/styled with @emotion/core

## 0.1.2

### Patch Changes

- [patch][242dd7a06d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/242dd7a06d):

  Expose additional types

## 0.1.1

### Patch Changes

- [patch][583a9873ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583a9873ef):

  Provided better description for popup types

## 0.1.0

### Minor Changes

- [minor][f1a3548732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a3548732):

  Introduce new package for the lightweight inline-dialog to be used in @atlaskit/app-navigation. The package will stay internal for now until more hardening is done, but releasing first minor to unblock navigation work.
