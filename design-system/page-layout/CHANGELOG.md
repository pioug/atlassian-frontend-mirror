# @atlaskit/page-layout

## 0.5.2

### Patch Changes

- [`2e8933a6a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e8933a6a7) - Change the key for grid storage in localStorage

## 0.5.1

### Patch Changes

- [`9fed259adc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fed259adc) - Adds a default value for dimension (height or width) props in Page Layout content slots.

## 0.5.0

### Minor Changes

- [`80fb46068b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/80fb46068b) - Move all grid state into the ResizeSidebarControl.
  **BREAKING** onExpand and onCollapse callbacks have been removed. They are now called _onLeftSidebarExpand_ and _onLeftSidebarCollapse_ and are passed to the PageLayout component.

## 0.4.2

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 0.4.1

### Patch Changes

- [`c38dd3c0dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c38dd3c0dc) - Fixes a bug where LeftSidebar would go into an inconsistent state when toggled quickly.
- [`6ab2c4b227`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ab2c4b227) - Make flyout behaviour more predictable
- [`7d0af990e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d0af990e1) - Removes overflow auto so that position sticky in Main can work

## 0.4.0

### Minor Changes

- [`bd8f1ab8b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bd8f1ab8b6) - Changes the behaviour of flyout. It now expands to the preferred width of the user

### Patch Changes

- [`25bf379774`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25bf379774) - Removes overflow auto so that position sticky in Main can work

## 0.3.3

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 0.3.2

### Patch Changes

- [`89a5c1ded9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89a5c1ded9) - Fix issue with usePageLayoutResize hook not affecting sidebar

## 0.3.1

### Patch Changes

- [`f5226d360b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5226d360b) - Add onFlyoutExpand and onFlyoutCollapse events. Internal refactor of flyout behaviour.- [`42e3b34fae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42e3b34fae) - _Breaking change_ Hides contents of LeftSidebar when collapsed

## 0.3.0

### Minor Changes

- [`7fb3059a20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fb3059a20) - - _Breaking_ Makes LeftSidebar resizeable by default, does not export ResizeControl anymore.
  - Exports LeftSidebarWithoutResize.
  - Adds the following callback functions to LeftSidebar:
    - onExpand
    - onCollapse
    - onResizeStart
    - onResizeEnd

## 0.2.0

### Minor Changes

- [minor][278f466be0](https://bitbucket.org/atlassian/atlassian-frontend/commits/278f466be0):

  Split page layout to allow tree shaking, allow resize button to have an override and add the required resizeButtonLabel prop to ResizeControl

## 0.1.3

### Patch Changes

- [patch][214c76d2b8](https://bitbucket.org/atlassian/atlassian-frontend/commits/214c76d2b8):

  Change imports to comply with Atlassian conventions- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [e5eb921e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5eb921e97):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/avatar@17.1.10
  - @atlaskit/motion@0.2.4

## 0.1.2

### Patch Changes

- [patch][ca947bd6da](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca947bd6da):

  Prevent left sidebar from jumping when moving the mouse

## 0.1.1

### Patch Changes

- [patch][dd7692e133](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd7692e133):

  Use TS syntax that is compatible with TS version 3.1.0

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
