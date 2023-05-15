# @atlaskit/page-layout

## 1.6.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 1.6.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [`2a9f6f800ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a9f6f800ef) - **Fixes**

  - `onLeftSidebarExpand` is no longer called when the sidebar is already open. `onLeftSidebarExpand` oculd previously be incorrectly called if a user resized an expanded sidebar to slightly smaller than the default sidebar width, or when the user cancelled a sidebar resizing operation with the `"Escape"` key
  - the latest provided `onLeftSidebarCollapse` and `onLeftSidebarExpand` functions are now called when collapsing / expanding respectively. Previously, only the initial `onLeftSidebarCollapse` and `onLeftSidebarExpand` were called (due to a stale closure)
  - `onLeftSidebarCollapse` and `onLeftSidebarExpand` are now called with the latest state values. Previously there were only ever called with the initial left sidebar state value (due to a stale closure)

  **Improvements**

  - no longer possible to trigger the collapse of the sidebar when it is already collapsed
  - no longer possible to trigger an expand of the sidebar when it is already expanded
  - triggering an expand while the sidebar is collapsing will now flush the pending `onLeftSidebarExpand`
  - triggering an collapse while the sidebar is expanding will now flush the pending `onLeftSidebarCollapse`
  - only adding the event listener for `"transitionend"` when the sidebar is expanding or collapsing.
  - removing `"transitionend"` event listener when `<LeftSidebar />` is unmounted
  - explicitly aborting pending collapse / expand actions when `<LeftSidebar />` is unmounted while collapsing / expanding.

## 1.4.0

### Minor Changes

- [`955ee3ea8fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/955ee3ea8fe) - [ux] **fix**: if a `"mousedown"`, `"click"`, `"resize"` or `"visibilitychange"` event occurs while the sidebar is being resized, then the resizing operation will end

  [ux] **new**: if a user presses the `"Escape"` key while the sidebar is being resized, then the resizing operation will end

## 1.3.10

### Patch Changes

- [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.
- Updated dependencies

## 1.3.9

### Patch Changes

- Updated dependencies

## 1.3.8

### Patch Changes

- [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) - ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects` when loading the page.

## 1.3.7

### Patch Changes

- [`7f3ff7f0081`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f3ff7f0081) - [ux] Enhance accessibility of header for skip links component

## 1.3.6

### Patch Changes

- Updated dependencies

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op change to introduce spacing tokens to design system components.

## 1.3.2

### Patch Changes

- [`522a27e6119`](https://bitbucket.org/atlassian/atlassian-frontend/commits/522a27e6119) - Remove `isOpen` prop from @atlaskit/banner, it is now open by default.
- Updated dependencies

## 1.3.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.3.0

### Minor Changes

- [`3de296cfd19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3de296cfd19) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.2.7

### Patch Changes

- [`26b3e978512`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26b3e978512) - Internal code change turning on new linting rules.
- Updated dependencies

## 1.2.6

### Patch Changes

- [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) - Upgrading internal dependency (bind-event-listener) for improved internal types

## 1.2.5

### Patch Changes

- [`e4b612d1c48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4b612d1c48) - Internal migration to bind-event-listener for safer DOM Event cleanup

## 1.2.4

### Patch Changes

- [`ef9ecf15b36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef9ecf15b36) - Calling `collapseLeftSidebar` while the sidebar is already collapsed no longer modifies the sidebar state. This prevents an invalid state that could occur if `collapseLeftSidebar` was called while the sidebar was in flyout.

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`21534d3647e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21534d3647e) - [ux] Update theme colours and remove shadow from resize bar

### Patch Changes

- [`ac9343c3ed4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac9343c3ed4) - Replaces usage of deprecated design tokens. No visual or functional changes
- [`ad0e912661a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad0e912661a) - Styles have been rewritten to be static, in preparation for compiled adoption.
- [`8940901481d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8940901481d) - [ux] The width of right sidebars with fixed positioning (`<RightSidebar isFixed />`) has been fixed. Previously they had automatic sizing, which led to inconsistencies in appearance between static and fixed positioning.
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates all usage of brand tokens to either selected or information tokens. This change is purely for semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 1.1.0

### Minor Changes

- [`567a96da90e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/567a96da90e) - [ux] Instrumented page-layout with the new theming package, `@atlaskit/tokens`. New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 1.0.7

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Bump raf-schd to latest (4.0.3), including better TS typings.

## 1.0.6

### Patch Changes

- [`192d35cfdbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/192d35cfdbd) - Defaults native button usage to type="button" to prevent unintended submittig of forms.

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 1.0.3

### Patch Changes

- [`f9cb2bcf689`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9cb2bcf689) - SkipLink order is now stable after remounting slots.
- [`0eb13e8b2d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0eb13e8b2d8) - Fix "Cannot update a component from inside the function body of a different component" warnings related to skip links.

## 1.0.2

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 1.0.1

### Patch Changes

- [`7d0905b4e81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d0905b4e81) - Fix bug where right sidebar styles were being calculated with the wrong variable.

## 1.0.0

### Major Changes

- [`7727f723965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7727f723965) - Internal change to the release model from continous to scheduled release. There are **NO API CHANGES** in this release.

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [`13d7f548f14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13d7f548f14) - The `usePageLayoutResize` hook no longer exposes the internal `setLeftSidebarState` method.

### Patch Changes

- [`ddff790f9fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ddff790f9fd) - [ux] Added a new hook (`useLeftSidebarFlyoutLock`) which allows locking the sidebar in a flyout state.

## 0.10.14

### Patch Changes

- [`6ae23940b27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ae23940b27) - Remove css-vars-ponyfill from page layout to drop IE10/11 support and reduce the bundle size

## 0.10.13

### Patch Changes

- [`b7c62b4cbb7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7c62b4cbb7) - Fix Page Layout throwing errors in SSR

## 0.10.12

### Patch Changes

- [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed extraneous/unnecessary dependencies for design system components.

## 0.10.11

### Patch Changes

- [`e6c982bb8f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6c982bb8f) - Performance improvement. Simplifies a layout calculation to update less frequently.

## 0.10.10

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.10.9

### Patch Changes

- [`abfb2146c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abfb2146c6) - [ux] Earlier left sidebar was not expanding on resize button click, Now this issue has been fixed.

## 0.10.8

### Patch Changes

- [`1757dec0ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1757dec0ee) - [ux] Fixed bug where skip link menu was moving on scroll. Skip link menu is now using fixed positioning instead of absolute

## 0.10.7

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.10.6

### Patch Changes

- [`d540cd1042`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d540cd1042) - [ux] Moving cursor away from current browser was causing side nav expand unexpectedly. This issue has been fixed now and the flyout will close as mouse will leave browser.

## 0.10.5

### Patch Changes

- [`2c735227f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c735227f9) - Fix resize callback events from being called more than once on mount

## 0.10.4

### Patch Changes

- [`b4fd71e4a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4fd71e4a2) - Fixes the visiblity of left sidebar contents when rendered in SSR mode

## 0.10.3

### Patch Changes

- Updated dependencies

## 0.10.2

### Patch Changes

- [`4cf354b500`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4cf354b500) - Adds the ability to register custom skip links to be displayed in the `PageLayout` skip link menu. Now if you have an element that isn't a slot of the `PageLayout` component, you can still provide a helpful and accessible way to jump straight to it!

  Import the new `useCustomSkipLink` hook and pass in the taget `id` and a `skipLinkTitle` and it will add a new link to the element with a matching `id`, no matter where it is in the document. You can also choose what position the link will show up in the menu by using the optional `listIndex` prop.

## 0.10.1

### Patch Changes

- [`ec3df667ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec3df667ed) - Pass left sidebar state to onResizeStart, onResizeEnd, onLeftSidebarExpand nd onLeftSidebarCollapse

## 0.10.0

### Minor Changes

- [`9db4bdaa00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9db4bdaa00) - **BREAKING** Changes the way css variables were previously exported. They are now exported with proper fallback values. Refer to the [CSS variables](page-layout/docs/css-variables) docs to see how to use them.

## 0.9.4

### Patch Changes

- [`58413f42ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58413f42ab) - Left side bar button disbaled

## 0.9.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.9.2

### Patch Changes

- [`14d289a7ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14d289a7ee) - Fix LeftSidebar flyout not closing sometimes when not in hover state

## 0.9.1

### Patch Changes

- [`0d72fedadb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d72fedadb) - Left-sidebar fixed content will occupy 100% height"

## 0.9.0

### Minor Changes

- [`8fb2f0ac0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8fb2f0ac0e) - **BREAKING** - The `width` prop now controls the width when LeftSidebar is mounted and overrides leftSidebarWidth value in localStorage.
  Also added `collapsedState` prop to control expanded/collapsed state when LeftSidebar is mounted.

## 0.8.6

### Patch Changes

- [`859d71f610`](https://bitbucket.org/atlassian/atlassian-frontend/commits/859d71f610) - Replaces internal usage of Global component from emotion with a style tag

## 0.8.5

### Patch Changes

- [`3305a0494b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3305a0494b) - Added resizing state in left-sidebar - can be used to stop keyboard resize temporarily

## 0.8.4

### Patch Changes

- [`c319029742`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c319029742) - All page-layout slots will now have data attributes

## 0.8.3

### Patch Changes

- [`4d74245d2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d74245d2b) - The left sidebar now has a minimium width of 240px when being resized.
- [`404a32df15`](https://bitbucket.org/atlassian/atlassian-frontend/commits/404a32df15) - The left sidebar now has a minimium width of 240px when being resized.

## 0.8.2

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 0.8.1

### Patch Changes

- [`a05fe35b29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a05fe35b29) - Side navigation now supports being able to resize the sidebar with your keyboard!
  Simply focus onto the grab area and then use your arrow keys to resize.
  Use the `resizeGrabAreaLabel` prop to describe what happens when interacting with it.

## 0.8.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.7.0

### Minor Changes

- [`45b6bc10a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45b6bc10a8) - Renames i18n prop to skipLinksLabel which is now a string. This prop is used as the title of the skip links container.

### Patch Changes

- [`be2323a168`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be2323a168) - Prevents clearing localStorage on unmount

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [`339a126382`](https://bitbucket.org/atlassian/atlassian-frontend/commits/339a126382) - Added skip links

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
