# @atlaskit/page-layout

## 0.1.0

### Minor Changes

- [minor][9015d5614a](https://bitbucket.org/atlassian/atlassian-frontend/commits/9015d5614a):

  **BREAKING**

  - Make `ResizeControl` composable. If it's not passed as a child to `LeftSidebar`, it will not be resizable.

  **NON-BREAKING**

  - Fix a bug with flyout behaviour in non-fixed mode. It no longer pushes body content to the side.
  - Fix a bug where `Main` couldn't handle wide content without breaking the layout.
  - Fixed the bug where expanding the LeftSidebar always set the width to 240px instead of users' cached width.

## 0.0.4

### Patch Changes

- [patch][4955ff3d36](https://bitbucket.org/atlassian/atlassian-frontend/commits/4955ff3d36):

  Minor package.json config compliance updates- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):

  - @atlaskit/docs@8.5.0

## 0.0.3

### Patch Changes

- [patch][8e76dbf8bc](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e76dbf8bc):

  Add resize control to left sidebar- [patch][b015403f20](https://bitbucket.org/atlassian/atlassian-frontend/commits/b015403f20):

  Adds the ability to resize and collapse left sidebar. Adds the ability to hydrate grid state from local storage. Adds unit and VR tests.

  _Flyout behaviour in the LeftSidebar has a bug when `isFixed` prop is passed as false. It will be fixed in a future release. [Tracked here](https://product-fabric.atlassian.net/browse/DST-142)_

## 0.0.2

### Patch Changes

- [patch][81275873e9](https://bitbucket.org/atlassian/atlassian-frontend/commits/81275873e9):

  Initial release for page layout. Exports a top level Grid component and a number of slot components which fit into a preconfigured grid layout- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
  - @atlaskit/docs@8.4.0
