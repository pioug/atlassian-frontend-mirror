# @atlassian/navigation-system

## 5.9.1

### Patch Changes

- [`8ced6a00eae26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8ced6a00eae26) -
  Improving internal types of menu item component.

  Enhanced ref handling in MenuItemBase to work better with the updated mergeRefs utility, providing
  improved TypeScript compatibility.

- [`ab9386b25161d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ab9386b25161d) -
  Fixed bug where toggle button click was still using the old full height sidebar feature gate to
  close layers
- Updated dependencies

## 5.9.0

### Minor Changes

- [`3665e60cbf959`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3665e60cbf959) -
  Fixes a bug that could cause side nav animations to apply on initial load

## 5.8.2

### Patch Changes

- Updated dependencies

## 5.8.1

### Patch Changes

- [`c60dda81827ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c60dda81827ec) -
  Type fixes for scrollIntoViewIfNeeded

## 5.8.0

### Minor Changes

- [`6a51c2d83eea1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6a51c2d83eea1) -
  Export LazyDragHandle for use by custom menu items that wish to implement drag and drop.

## 5.7.0

### Minor Changes

- [`8b3783c70ef57`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b3783c70ef57) -
  Clicking on the side nav toggle button will now close any open layers such as tooltips. This
  ensures tooltips don't linger on the screen when the buttons inside `TopNavStart` are reordered.

  This change is behind the feature flag `navx-full-height-sidebar`.

### Patch Changes

- Updated dependencies

## 5.6.0

### Minor Changes

- [`b5802cb0960a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5802cb0960a2) -
  Change how full height sidebar is enabled. Instead of a feature gate, use a context value that
  apps can set themselves using their own feature gate or experiment.

## 5.5.1

### Patch Changes

- [`31921a1c13971`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31921a1c13971) -
  Fixes centering of top nav middle items when the `navx-full-height-sidebar` flag is enabled.

## 5.5.0

### Minor Changes

- [`0fd231aa18bd4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fd231aa18bd4) -
  The tooltip for truncated side nav menu item has been updated:
  - The tooltip now uses the standard tooltip styling and behavior, instead of using a custom
    component.
  - The tooltip position has been updated to `right-start` (previously it was `right`).

  These changes were previously behind the feature gate
  `platform_dst_side_nav_remove_custom_tooltip`, which has now been removed.

## 5.4.0

### Minor Changes

- [`05dd9b7db95b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05dd9b7db95b7) -
  The built-in keyboard shortcut for toggling the side nav will check if there are any open modals
  and ignore the shortcut if there are.

  This check was previously behind the feature gate `platform-dst-open-layer-observer-layer-type`,
  which has now been removed.

### Patch Changes

- Updated dependencies

## 5.3.4

### Patch Changes

- Updated dependencies

## 5.3.3

### Patch Changes

- [`5e4877d22ecd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5e4877d22ecd0) -
  Renames the `viewed` analytics event behind the `platform_dst_nav4_fhs_instrumentation_1` feature
  gate to use `viewedOnLoad` as the action name. This is to avoid a conflict with an existing event
  in Global Side Navigation.

## 5.3.2

### Patch Changes

- Updated dependencies

## 5.3.1

### Patch Changes

- [`8f79c1a030071`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f79c1a030071) -
  References to the `platform-dst-tooltip-shortcuts` feature flag have been removed from prop
  JSDocs.
- Updated dependencies

## 5.3.0

### Minor Changes

- [`c8cb0a09979c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c8cb0a09979c1) -
  Adds instrumentation to the side navigation behind the `platform_dst_nav4_fhs_instrumentation_1`
  feature gate.
- [`c8cb0a09979c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c8cb0a09979c1) -
  Changes the `trigger` property in the side nav `onExpand` and `onCollapse` callbacks to be exposed
  behind the `platform_dst_nav4_fhs_instrumentation_1` feature gate instead of the
  `navx-full-height-sidebar` feature gate. The `platform_dst_nav4_fhs_instrumentation_1` feature
  gate is intended to roll out sooner.
- [`f942d05c8a8f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f942d05c8a8f2) -
  Adds support for selected state in ButtonMenuItem component (under feature gate
  platform-dst-buttonmenuitem-selected-state-support)

## 5.2.0

### Minor Changes

- [`fef4ccb6af01f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fef4ccb6af01f) -
  Cleans up the `platform_dst_nav4_side_nav_default_collapsed_api` feature gate. Default side nav
  collapsed state can now be passed into the `Root` component via the `defaultSideNavCollapsed`
  prop. This is the preferred API, and the legacy API will be removed at some point in the future.

### Patch Changes

- Updated dependencies

## 5.1.0

### Minor Changes

- [`03b6f055c6340`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03b6f055c6340) -
  The `SideNavPanelSplitter` component is now exported from
  `@atlaskit/navigation-system/layout/side-nav`. It should be used within the `SideNav` layout area.

  It supports double clicking to collapse the side nav. You can conditionally disable this through
  the `shouldCollapseOnDoubleClick` prop. It is enabled by default.

  It also supports displaying a tooltip when hovered, through the `tooltipContent` prop. This should
  be used to explain the double click to collapse interaction. The recommended tooltip content is
  "Double click to collapse".

  A tooltip will only be displayed if the `shouldCollapseOnDoubleClick` prop is `true`, or not
  provided (as it defaults to `true`), and if the `tooltipContent` prop is provided.

  If the `isSideNavShortcutEnabled` prop is enabled on `<Root />`, the built-in keyboard shortcut
  will be displayed with the tooltip.

  Example usage:

  ```tsx
  import { SideNav, SideNavPanelSplitter } from '@atlaskit/navigation-system/layout/side-nav';

  // In component:
  <SideNav>
  	<SideNavPanelSplitter label="Double click to collapse" />
  </SideNav>;
  ```

## 5.0.2

### Patch Changes

- [`bb5f1424b34de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bb5f1424b34de) -
  [ux] Fixes the scrolled indicator in SideNavContent to set initial state for SSR'd scroll
  position. Behind the `navx-full-height-sidebar` gate.

## 5.0.1

### Patch Changes

- [`5a651fd4cae29`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a651fd4cae29) -
  Minor change to JSDocs for PanelSplitter.
- Updated dependencies

## 5.0.0

### Major Changes

- [`ea9dfe33b50c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ea9dfe33b50c1) -
  Several changes have been made to the tooltip keyboard shortcut functionality:
  - The `shortcut` prop has been removed from `SideNavToggleButton`, `PanelSplitter`, and
    `SideNavPanelSplitter`. The keyboard shortcut used in the tooltips for these components is now
    controlled internally for consistency, and cannot be configured. It is set to `["Ctrl", "["]`.
    The shortcuts will only be displayed in the tooltips for `SideNavToggleButton` and
    `SideNavPanelSplitter` when the `isSideNavShortcutEnabled` prop is enabled on the `Root`
    component. This is behind the `navx-full-height-sidebar` feature flag - previously, the
    `shortcuts` prop (now removed) was behind the `platform-dst-tooltip-shortcuts` feature flag.

  - The `shortcuts` prop has been added to `PanelSplitterProvider`, so that layout components (e.g.
    `SideNav`) can specify the keyboard shortcuts used for the panel splitters that are rendered
    within them, instead of consumers needing to specify them.

  - `SideNavPanelSplitter` will now only render a tooltip if `shouldCollapseOnDoubleClick` is true.
    If it is false, the `tooltipContent` prop will be ignored.

## 4.6.0

### Minor Changes

- [`5bda2d3b2d6cd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5bda2d3b2d6cd) -
  Clicking dropdown menu items will no longer collapse the side navigation on mobile. This change
  was behind a feature flag, which has now been removed.

## 4.5.1

### Patch Changes

- [`f5e53b7b1e130`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f5e53b7b1e130) -
  Use IconRenderer for Themed IconButtons to mitigate their DOM be recreated during SSR -> SPA
  hydration, which delays TTVC. This is an experiment behind
  platform_themed_button_use_icon_renderer.

## 4.5.0

### Minor Changes

- [`8a71ce992f8c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a71ce992f8c8) -
  `SideNav` now provides a built-in keyboard shortcut for expanding and collapsing. This is behind
  the feature gate `navx-full-height-sidebar`.
  - The shortcut key is `Ctrl` + `[`.
  - The shortcut is not enabled by default.
  - The prop `isSideNavShortcutEnabled` has been added to `Root`, as a way to control whether the
    shortcut is enabled (whether the keyboard event listener is binded). It defaults to `false`.
  - The prop `canToggleWithShortcut()` has been added to `SideNav`, as a way to run additional
    checks after the shortcut is pressed, before the side nav is toggled.
  - The shortcut will also be ignored if there are any open modals. This check is behind the feature
    gate `platform-dst-open-layer-observer-layer-type`.

### Patch Changes

- Updated dependencies

## 4.4.0

### Minor Changes

- [`327d6a06eebb2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/327d6a06eebb2) -
  Adds `onPeekStart` and `onPeekEnd` callbacks to the `SideNav` to use for monitoring when users
  peek at the side navigation when it is collapsed.

## 4.3.0

### Minor Changes

- [`4bb7b31bfda3b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4bb7b31bfda3b) -
  Refactors changes that were previously behind `platform_dst_nav4_full_height_sidebar_api_changes`
  to now be behind `platform_dst_nav4_side_nav_default_collapsed_api`. After rollout, both the new
  and legacy APIs for defining side nav initial state will be supported.

## 4.2.0

### Minor Changes

- [`5ab567cfb4d29`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5ab567cfb4d29) -
  Cleans up the `platform_dst_nav4_panel_splitter_guards` feature gate. Panel splitters will now use
  a safe fallback default width if the provided default width is not an integer.

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [`d55bbfc88149b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d55bbfc88149b) -
  Removes type support for `@atlaskit/temp-nav-app-icons` package

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [`5bc3774df4b8f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5bc3774df4b8f) -
  Remove experimental UNSAFE_isTooltipDisabled prop for top nav icons

## 3.1.1

### Patch Changes

- [`ac431cadd9a33`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ac431cadd9a33) -
  Fixes a regression when the `navx-full-height-sidebar` feature gate is enabled, where the peeking
  side nav would close if the user mouses over the `TopNavStart` element.

## 3.1.0

### Minor Changes

- [`ee578a4721dcf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee578a4721dcf) -
  The following animations have been updated to shorten their durations from `300ms` to `200ms`.
  These changes are behind the `navx-full-height-sidebar` feature flag.
  - `SideNav` slide in/out animations, including peek (flyout) and regular expand/collapse
  - `TopNavStart` button reorder animations

## 3.0.1

### Patch Changes

- [`006edbc465657`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/006edbc465657) -
  Fixes when `min-width` is applied to `TopNavStart` while the `navx-full-height-sidebar` feature
  gate is enabled.

## 3.0.0

### Major Changes

- [`f32509352e004`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f32509352e004) -
  `MenuSectionHeading` has been updated to use regular text (`p` element) instead of a heading (`h2`
  element). This change was behind a feature flag, which has now been cleaned up.

  This has been done to resolve accessibility issues with the component. It does not need to be a
  heading semantically.

### Patch Changes

- Updated dependencies

## 2.23.1

### Patch Changes

- Updated dependencies

## 2.23.0

### Minor Changes

- [`46f39b03ba41d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/46f39b03ba41d) -
  The menu item `actionsOnHover` slot has been updated to improve accessibility. These changes were
  previously behind a feature flag, which has now been removed. These changes are now available for
  all consumers.
  - Popup triggers placed inside the slot will now correctly be focused when closing their
    respective popups.

  - Interactive elements placed inside the slot will be in the tab order when tabbing backwards.

## 2.22.0

### Minor Changes

- [`3c732646f3e19`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c732646f3e19) -
  The tooltip for truncated side nav menu item has been updated behind the feature gate
  `platform_dst_side_nav_remove_custom_tooltip`:
  - The tooltip now uses the standard tooltip styling and behavior, instead of using a custom
    component.
  - The tooltip position has been updated to `right-start` (previously it was `right`).

## 2.21.1

### Patch Changes

- Updated dependencies

## 2.21.0

### Minor Changes

- [`3476b9c121ef9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3476b9c121ef9) -
  Side nav animations have been updated to support right-to-left (RTL) languages/text direction.
  This change is behind the feature gate `navx-full-height-sidebar`.

  This includes:
  - `SideNav` peek animations
  - `SideNav` expand and collapse animations
  - `TopNavStart` reorder animations

## 2.20.0

### Minor Changes

- [`bfed073f1849d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfed073f1849d) -
  Animations have been added to the `TopNavStart` component, as part of the full height sidebar
  animations. The reorder of `TopNavStart`'s children elements (toggle button, app switcher, app
  logo) when the side nav is toggled (on desktop) will have slide animations.

  These changes are behind the feature gate `navx-full-height-sidebar`.

## 2.19.1

### Patch Changes

- [`8622b99ec3d36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8622b99ec3d36) -
  Internal refactors to the full height sidebar animations to workaround some Compiled style
  ordering issues. These changes are behind the feature gate `navx-full-height-sidear`.

## 2.19.0

### Minor Changes

- [`c506727d66d32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c506727d66d32) -
  Cleans up the `platform_fix_component_state_update_for_suspense` feature gate. There is now
  improved ref handling for Suspense.

## 2.18.0

### Minor Changes

- [`35dbcb50e7873`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/35dbcb50e7873) -
  Changes TopNavMiddle items (search + create) to now be centred on large desktop screens, when the
  `navx-full-height-sidear` feature gate is enabled.

## 2.17.0

### Minor Changes

- [`dc96cee1f923a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dc96cee1f923a) -
  Minor improvements to the side nav peek (flyout) animations. These changes are behind the
  `navx-full-height-sidebar` feature flag.
  - The timing functions for the peek and hide animations have been slightly tweaked to align with
    the new full height sidebar animations
  - The peek animation duration has been increased to 300ms from 200ms to align with the new full
    height sidebar animations
  - During the collapse animation, the flyout will now maintain its background color and box-shadow.
    They were previously unset as soon as the animation started.

- [`dc96cee1f923a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dc96cee1f923a) -
  [ux] The sidebar will now animate when expanding and collapsing on supported browsers. Currently
  Firefox is not supported. This change is behind the feature gate `navx-full-height-sidebar`.

  The sidebar previously only animated when peeking (flyout mode). This change makes it animate on
  regualar toggles as well. The `Main` layout area will still instantly "snap" into its new position
  without any animations.

## 2.16.0

### Minor Changes

- [`d219613fe59b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d219613fe59b7) -
  When a `FlyoutMenuItemContent` is open, clicking outside the content will close the flyout. We
  have improved this functionality to make it more resilient to application code that stops events.

  This change was previously behind a feature flag, which has now been removed.

## 2.15.0

### Minor Changes

- [`71f5e9dd549f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71f5e9dd549f3) -
  Adds a fix for the flyout breaking due to stale element references behind the
  `platform_dst_nav4_side_nav_toggle_ref_fix` feature gate.

## 2.14.2

### Patch Changes

- [`c2a513589de1c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c2a513589de1c) -
  Pass isTooltipDisabled as prop when render IconButton
- Updated dependencies

## 2.14.1

### Patch Changes

- [`2ee88aea34e7c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2ee88aea34e7c) -
  Internal refactor of logo components

## 2.14.0

### Minor Changes

- [`3ea3fab89f015`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ea3fab89f015) -
  `SideNavToggleButton` now supports displaying keyboard shortcuts in its tooltip through the
  `shortcut` prop.

  `PanelSplitter` can now display a tooltip with an optional keyboard shortcut on hover or focus. A
  tooltip will be rendered when either the `tooltipContent` or `shortcut` prop is set.

  These new props are currently behind the `platform-dst-tooltip-shortcuts` feature flag.

### Patch Changes

- Updated dependencies

## 2.13.0

### Minor Changes

- [`9d65ef412f30c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d65ef412f30c) -
  Cleans up the `platform_design_system_nav4_sidenav_border` feature gate. The side nav border is
  now only applied when it does not have a shadow.

### Patch Changes

- [`437668dfbdec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/437668dfbdec9) -
  Add explicit types to a number of DST components
- Updated dependencies

## 2.12.0

### Minor Changes

- [`d19446c7cb076`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d19446c7cb076) -
  FG cleanup jfp-magma-hydration-harmonise-applogo-classname

## 2.11.1

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 2.11.0

### Minor Changes

- [`825c15fd948fa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/825c15fd948fa) -
  Adds a top border to the side nav content when scrolled, behind the `navx-full-height-sidebar`
  feature gate.
- [`d8b6ae4334ce7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d8b6ae4334ce7) -
  [ux] The minimum width of the `TopNavStart` and `TopNavEnd` slots has been increased to `330px`
  from `300px`. This change is behind a feature flag.

  This is to accommodate larger logos without causing layout shifts in the top nav, when the logo
  changes in a SPA transition.

- [`799d003290f7b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/799d003290f7b) -
  The chevron icon in `FlyoutMenuItemTrigger` now uses `currentColor` when the
  `platform_dst_flyout_menu_item_chevron_color` feature flag is enabled.

  It was previously using the `color.icon` color token. It will now inherit the same color that the
  menu item label uses.

## 2.10.2

### Patch Changes

- [`332393d8d236d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/332393d8d236d) -
  Add `forwardRefWithGeneric` as a util to the `ds-lib` package so it is available for all of the
  Design System.
- Updated dependencies

## 2.10.1

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.
- Updated dependencies

## 2.10.0

### Minor Changes

- [`8c5f4864d7d4c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c5f4864d7d4c) -
  Adds `defaultSideNavCollapsed` prop to `Root` which replaces the `defaultCollapsed` props on
  `SideNav` and `SideNavToggleButton`. This prop is enabled behind the
  `platform_dst_nav4_full_height_sidebar_api_changes` feature gate. When this gate is cleaned up the
  `defaultCollapsed` props will be removed.

## 2.9.0

### Minor Changes

- [`d64bfbee2463f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d64bfbee2463f) -
  Cleans up the `platform_design_system_nav4_panel_mobile_width_fix` feature gate. Mobile panel
  sizes are now more consistent with their desktop sizes, when screen width permits.

### Patch Changes

- Updated dependencies

## 2.8.0

### Minor Changes

- [`a515e172559b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a515e172559b8) -
  Adds `sideNavToggleButton` slot to `TopNavStart` to be used instead of rendering
  `<SideNavToggleButton>` as a child. When `navx-full-height-sidebar` is enabled, the slot is used
  to move the button between start and end positions based on sidebar collapse state.
- [`a515e172559b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a515e172559b8) -
  App logo text will now truncate if there is no available space, when `navx-full-height-sidebar` is
  enabled.

## 2.7.0

### Minor Changes

- [`e091edd5f5159`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e091edd5f5159) -
  Update AppLogo to use non-deprecated primitives

### Patch Changes

- Updated dependencies

## 2.6.1

### Patch Changes

- [`2445e6e19f1c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2445e6e19f1c7) -
  pass testId to menuList

## 2.6.0

### Minor Changes

- [`e9ddf34435a22`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9ddf34435a22) -
  Clicking dropdown menu items will no longer collapse the side navigation on mobile. This change is
  behind a feature flag.

## 2.5.0

### Minor Changes

- [`f506e887c7e55`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f506e887c7e55) -
  Cleans up `platform_design_system_nav4_panel_default_border` feature flag. The `Panel` slot will
  have a border by default.

## 2.4.1

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 2.4.0

### Minor Changes

- [`6743796745b3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6743796745b3d) -
  Changes PanelSplitter to use a `col-resize` cursor instead of `ew-resize`, when the
  `navx-full-height-sidebar` feature gate is enabled.
- [`ad74a7aedf419`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ad74a7aedf419) -
  Adds layout changes to support a full height sidebar behind the `navx-full-height-sidebar` feature
  gate.

## 2.3.4

### Patch Changes

- Updated dependencies

## 2.3.3

### Patch Changes

- [`5a4eb937344d9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a4eb937344d9) -
  Internal refactors to skip links. This was previously behind a feature flag, which is now removed.

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- [`34635d754e047`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/34635d754e047) -
  Update the description of the Side nav's onExpand and onCollapse props.

## 2.3.0

### Minor Changes

- [`40dea92e11501`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40dea92e11501) -
  `MenuSectionHeading` has been updated to use regular text (`p` element) instead of a heading (`h2`
  element). This change is behind a feature flag.

  This has been done to resolve accessibility issues with the component. It does not need to be a
  heading semantically.

## 2.2.0

### Minor Changes

- [`cf5e597de761c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cf5e597de761c) -
  Adds a trigger value to the side nav's `onExpand` and `onCollapse` callbacks, allowing consumers
  to identify the method used to expand or collapse the side nav. Also adds the ability to define
  the trigger value when using the `useToggleSideNav` and `useExpandSideNav` hooks. This change is
  behind the `navx-full-height-sidebar` feature gate.

### Patch Changes

- Updated dependencies

## 2.1.3

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 2.1.2

### Patch Changes

- [`e276abaa88f28`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e276abaa88f28) -
  The `SideNavToggleButton`, `useExpandSideNav` and `useToggleSideNav` functions have been updated
  to not throw an error if the side nav state is not initialised (for example, if the `SideNav` has
  not mounted yet).

## 2.1.1

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 2.1.0

### Minor Changes

- [`8f30ac4ceb737`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f30ac4ceb737) -
  Adds extra guards for resizable slots to avoid invalid widths being set. This change is behind the
  `platform_dst_nav4_panel_splitter_guards` feature gate.

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [`ca468a8bbccd9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ca468a8bbccd9) -
  The elemBefore chevron icon button in the link (selectable) variants of
  `ExpandableMenuItemTrigger` is now labelled by the menu item (specifically, its anchor element)
  through the aria-labelledby attribute. This is to provide context on what will be expanded or
  collapsed to screen readers. Assistive technology users will still have the `aria-expanded`
  attribute to determine the expanded state.

  This change was previously behind a feature flag, which has now been removed.

  **More details:**

  Previously, the chevron icon button would be labelled by the hardcoded strings "Expand" or
  "Collapse" - which is not helpful for screen readers.

  Now, the chevron icon button is labelled by the menu item trigger content (children).

  For example, for the below expandable menu item trigger:

  ```tsx
  <ExpandableMenuItemTrigger href="#">Recent</ExpandableMenuItemTrigger>
  ```

  Previously, the chevron icon button would be a `button` element with the name "Expand" or
  "Collapse", based on the expanded state.

  Now, the chevron icon button will be a `button` element with the name "Recent".

  You will likely need to update your tests to account for this change, by using a different
  selector.

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`c48c55f280ef8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c48c55f280ef8) -
  FlyoutMenuItemContent will render its popup alongside the trigger, instead of using a portal. This
  improves the experience for assistive technology users.

  This change is behind a feature flag.

## 1.1.0

### Minor Changes

- [`e40aa48c11a02`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e40aa48c11a02) -
  The menu item `actionsOnHover` slot has been updated, behind a feature flag, to improve
  accessibility.
  - Popup triggers placed inside the slot will now correctly be focused when closing their
    respective popups.

  - Interactive elements placed inside the slot will be in the tab order when tabbing backwards.

## 1.0.0

### Major Changes

- [`9fb179b645f2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9fb179b645f2d) -
  This package is now in beta and is no longer considered experimental. We will be making iterative
  improvements until GA.

  This release contains no changes whatsoever.

### Patch Changes

- [`3136f686a1929`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3136f686a1929) -
  Adding internal comments to help improve clarity.
- Updated dependencies

## 0.183.0

### Minor Changes

- [`4c0f75924fd2b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4c0f75924fd2b) -
  Internal refactors to skip links behind a feature flag.

### Patch Changes

- [`098cfbb01dc36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/098cfbb01dc36) -
  Add missing npmignore files to remove unnecessary files from published package
- Updated dependencies

## 0.182.0

### Minor Changes

- [`31c57f650ba07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31c57f650ba07) -
  Adding Server Side Rendering test

### Patch Changes

- [`31c57f650ba07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31c57f650ba07) -
  Improving tests for server side rendering and hydration
- Updated dependencies

## 0.181.1

### Patch Changes

- Updated dependencies

## 0.181.0

### Minor Changes

- [`1e64de395c7b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1e64de395c7b5) -
  Cleans up the `platform_dst_nav4_flyout_update_on_resize` feature gate. Flyout menus now correctly
  reposition when their content changes size.

### Patch Changes

- Updated dependencies

## 0.180.0

### Minor Changes

- [`0e77a737f5379`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e77a737f5379) -
  Cleans up `platform_design_system_nav4_live_resizing_css_vars` feature gate. Resizing width is now
  reflected in legacy CSS variables.

## 0.179.0

### Minor Changes

- [#199851](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199851)
  [`625ab3de43de0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/625ab3de43de0) -
  Cleans up the `platform_dst_nav4_disable_is_fixed_prop` feature gate. The `isFixed` prop has now
  been removed from `Main` and `Aside` and these slots will now always be fixed, acting as separate
  scroll containers.

## 0.178.0

### Minor Changes

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`87e1e76c9c3aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87e1e76c9c3aa) -
  The `elemBefore` chevron icon button in the link (selectable) variants of
  `ExpandableMenuItemTrigger` is now labelled by the menu item (specifically, its anchor element)
  through the `aria-labelledby` attribute. This is to provide context on what will be expanded or
  collapsed to screen readers.

  This change is behind a feature flag.

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`87e1e76c9c3aa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87e1e76c9c3aa) -
  The `ExpandableMenuItemTrigger` `testId` is now passed down to the `elemBefore` chevron icon
  button in the link (selectable) variants of `ExpandableMenuItemTrigger`.

### Patch Changes

- [#199297](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199297)
  [`3805d3e955d32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3805d3e955d32) -
  Improve menu item scaling with browser font size by using rem for height.
- [`5bed2aeb9093f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5bed2aeb9093f) -
  Internal refactoring of tests
- Updated dependencies

## 0.177.3

### Patch Changes

- [#197413](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197413)
  [`6909340c54a0b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6909340c54a0b) -
  Minor internal refactor to cleanup unused styles. No external impact.
- Updated dependencies

## 0.177.2

### Patch Changes

- [#198583](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198583)
  [`eaabec48bbfdc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eaabec48bbfdc) -
  Minor internal refactor to AppLogo to remove a component prop that was unused.
- Updated dependencies

## 0.177.1

### Patch Changes

- [#195513](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195513)
  [`1574f6e829fe4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1574f6e829fe4) -
  Fix support for `currentColor` in icons used in `elemBefore` of `ExpandableMenuItemTrigger` to
  ensure correct icon color in selected state.

## 0.177.0

### Minor Changes

- [`e12d813a2d3fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e12d813a2d3fd) -
  The default height of the Banner layout area has been updated to 48px, down from 64px, to align
  with the height of the @atlaskit/banner component. This change was previously behind a feature
  flag, which has now been removed.

### Patch Changes

- Updated dependencies

## 0.176.2

### Patch Changes

- Updated dependencies

## 0.176.1

### Patch Changes

- [#193214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193214)
  [`c661806a65543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c661806a65543) -
  Internal changes to how border radius and border width values are applied. No visual change.
- Updated dependencies

## 0.176.0

### Minor Changes

- [#185231](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185231)
  [`453cf3e421ea9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/453cf3e421ea9) - -
  `NavLogo` has been renamed to `CustomLogo`
  - Fixed issue where `AppLogo` may render old `@atlaskit/logo` designs when certain feature flags
    are disabled

### Patch Changes

- Updated dependencies

## 0.175.1

### Patch Changes

- Updated dependencies

## 0.175.0

### Minor Changes

- [#189410](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189410)
  [`5e491d9960a3f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5e491d9960a3f) -
  When a `FlyoutMenuItemContent` is open, clicking outside the content will close the flyout. We
  have improved this functionality to make it more resilient to application code that stops events.
  This changed is behind the feature flag `"platform_dst_nav4_flyout_use_capture_outside"`

### Patch Changes

- Updated dependencies

## 0.174.0

### Minor Changes

- [#186591](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186591)
  [`66ab2cbaba968`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/66ab2cbaba968) -
  Internal refactor of a test. No public API or behaviour changes.
- [#187173](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187173)
  [`c3ac41e33f28b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c3ac41e33f28b) -
  Cleans up the `platform_design_system_nav4_top_nav_columns` and
  `platform_design_system_nav4_top_nav_min_widths` feature gates. This enables technical
  improvements to the top nav layout for all consumers.

### Patch Changes

- Updated dependencies

## 0.173.0

### Minor Changes

- [#185107](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185107)
  [`3ae5a09dc3f3c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ae5a09dc3f3c) -
  Changes the flyout menu to recalculate its position when its content changes size. This fixes
  issues where the flyout menu could become misaligned or offscreen. This change is behind the
  `platform_dst_nav4_flyout_update_on_resize` feature gate.

### Patch Changes

- [#187177](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187177)
  [`adea77e90c396`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/adea77e90c396) -
  Internal refactoring. There are no visible changes.

## 0.172.0

### Minor Changes

- [#185771](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185771)
  [`bfdde20acda9d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfdde20acda9d) -
  Fixing issue where `<PanelSplitter>` would throw an error if it was suspended with `<Suspense>`.

### Patch Changes

- [#177943](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177943)
  [`db7d983a24821`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/db7d983a24821) -
  Updated package description and docs.

## 0.171.0

### Minor Changes

- [#176815](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176815)
  [`5eed9ac0e28c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5eed9ac0e28c3) -
  Cleans up the `platform_design_system_nav_logo_interaction_states` feature gate. The nav logo will
  now always have interaction states.

## 0.170.0

### Minor Changes

- [#179366](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179366)
  [`c1cd1f32a9703`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c1cd1f32a9703) -
  Adds experimental containment to the `Main` slot behind the
  `platform_dst_nav4_layering_in_main_slot_fixes` feature gate. When enabled, popups inside of
  `Main` will automatically stay inside of the slot. This avoids popups from escaping the slot and
  being hidden behind other slots.
- [#173274](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173274)
  [`e01dc06c9f06e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e01dc06c9f06e) -
  Cleans up `platform_design_system_nav4_preview_panel_support` feature gate. Panel max width is now
  constrained to half of the content area.

### Patch Changes

- Updated dependencies

## 0.169.1

### Patch Changes

- [#182936](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182936)
  [`e51987d54c75f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e51987d54c75f) -
  Allow aria-haspopup to be set on Search component.

## 0.169.0

### Minor Changes

- [#175869](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175869)
  [`e7f822af7edc1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7f822af7edc1) -
  Updated usages of deprecated icons with replacement icons

### Patch Changes

- Updated dependencies

## 0.168.0

### Minor Changes

- [#178562](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178562)
  [`ea3a94fc3c6b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ea3a94fc3c6b0) -
  Adds new AppNavLogo component for use with @atlaskit/logo that displays UI text next to the icon
  at wider screen widths, rather than rendering a unique logo component.

## 0.167.3

### Patch Changes

- [#178797](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/178797)
  [`d82f0a6bd7dd9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d82f0a6bd7dd9) -
  Removing temporary test ids to the collapse toggle icons for a performance investigation

## 0.167.2

### Patch Changes

- Updated dependencies

## 0.167.1

### Patch Changes

- Updated dependencies

## 0.167.0

### Minor Changes

- [#176198](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176198)
  [`6f29446debd94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6f29446debd94) -
  We have now removed the `"platform_design_system_nav4_menu_item_anchor_dnd"` feature flag. Drag
  and drop of side navigation menu items that are anchors (eg `LinkMenuItem`) now needs to be
  explicitly enabled with our
  [side navigation drag and drop API](https://atlassian.design/components/navigation-system/side-navigation/drag-and-drop)
- [#173222](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173222)
  [`1b1ca5e516115`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b1ca5e516115) -
  Cleans up `platform_design_system_nav4_panel_default_bg_color` feature gate. The Panel slot will
  now always have a default background color.

### Patch Changes

- Updated dependencies

## 0.166.0

### Minor Changes

- [#174616](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174616)
  [`ee906c44a058e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee906c44a058e) -
  The package has now been renamed to `"@atlaskit/navigation-system"` and made public.

## 0.165.0

### Minor Changes

- [#173276](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173276)
  [`d2bd64e49cecd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2bd64e49cecd) -
  The package will be renamed to `@atlaskit/navigation-system` in the next release, and will be made
  public and published to npm.

  The existing `@atlassian/navigation-system` package will still be available in Atlassian's
  internal registry, but will be deprecated. There will be no support for the private package going
  forwards - you should migrate to the new `@atlaskit/navigation-system` package.

## 0.164.1

### Patch Changes

- Updated dependencies

## 0.164.0

### Minor Changes

- [#172292](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172292)
  [`e14bf25b72dba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e14bf25b72dba) -
  The entrypoints under `@atlassian/navigation-system/side-nav/` have been renamed to use the prefix
  `@atlassian/navigation-system/side-nav-items/`.

  The full list of changes are:

  ### Before

  ```ts
  '@atlassian/navigation-system/side-nav/container-avatar';
  '@atlassian/navigation-system/side-nav/expandable-menu-item';
  '@atlassian/navigation-system/side-nav/flyout-menu-item';
  '@atlassian/navigation-system/side-nav/button-menu-item';
  '@atlassian/navigation-system/side-nav/link-menu-item';
  '@atlassian/navigation-system/side-nav/menu-list';
  '@atlassian/navigation-system/side-nav/menu-list-item';
  '@atlassian/navigation-system/side-nav/menu-section';
  '@atlassian/navigation-system/side-nav/top-level-spacer';
  '@atlassian/navigation-system/side-nav/drag-and-drop/hitbox';
  '@atlassian/navigation-system/side-nav/drag-and-drop/drag-preview';
  '@atlassian/navigation-system/side-nav/drag-and-drop/drop-indicator';
  '@atlassian/navigation-system/side-nav/drag-and-drop/group-drop-indicator';
  '@atlassian/navigation-system/side-nav/drag-and-drop/use-menu-item-drag-and-drop';
  ```

  ### After

  ```ts
  '@atlassian/navigation-system/side-nav-items/container-avatar';
  '@atlassian/navigation-system/side-nav-items/expandable-menu-item';
  '@atlassian/navigation-system/side-nav-items/flyout-menu-item';
  '@atlassian/navigation-system/side-nav-items/button-menu-item';
  '@atlassian/navigation-system/side-nav-items/link-menu-item';
  '@atlassian/navigation-system/side-nav-items/menu-list';
  '@atlassian/navigation-system/side-nav-items/menu-list-item';
  '@atlassian/navigation-system/side-nav-items/menu-section';
  '@atlassian/navigation-system/side-nav-items/top-level-spacer';
  '@atlassian/navigation-system/side-nav-items/drag-and-drop/hitbox';
  '@atlassian/navigation-system/side-nav-items/drag-and-drop/drag-preview';
  '@atlassian/navigation-system/side-nav-items/drag-and-drop/drop-indicator';
  '@atlassian/navigation-system/side-nav-items/drag-and-drop/group-drop-indicator';
  '@atlassian/navigation-system/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';
  ```

  This change is part of a larger group of changes to the package to prepare it for early access.

## 0.163.1

### Patch Changes

- [#172208](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/172208)
  [`b5882c76f99ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5882c76f99ca) -
  The jsdocs for the `children` prop in menu items has been updated to call out using the slot props
  for non-textual content.
- Updated dependencies

## 0.163.0

### Minor Changes

- [#171544](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/171544)
  [`855881697b291`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/855881697b291) -
  The following components have been renamed:
  - `MenuLinkItem` -> `LinkMenuItem`
  - `MenuButtonItem` -> `ButtonMenuItem`

  Their imports have been updated to use the new names.
  - `@atlassian/navigation-system/side-nav/menu-link-item` ->
    `@atlassian/navigation-system/side-nav/link-menu-item`
  - `@atlassian/navigation-system/side-nav/menu-button-item` ->
    `@atlassian/navigation-system/side-nav/button-menu-item`

  This change is part of a larger group of changes to the package to prepare it for early access.

### Patch Changes

- [#171544](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/171544)
  [`855881697b291`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/855881697b291) -
  Internal refactors to accomodate for platform entrypoint changes and component renames.

## 0.162.0

### Minor Changes

- [#170180](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170180)
  [`de9396e49c569`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de9396e49c569) -
  Cleans up the `platform_design_system_side_nav_click_out_to_close` feature gate. Clicking outside
  of the side nav on mobile will now always close the side nav.
- [#170203](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/170203)
  [`877716a9cd880`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/877716a9cd880) -
  Cleans up the `platform_design_system_nav4_skip_link_styling` feature gate. Skip links will now
  have the updated styling for everyone.

## 0.161.0

### Minor Changes

- [#169983](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169983)
  [`c72e85f165c1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c72e85f165c1b) -
  A number of components have been renamed:
  - `TopBar` -> `TopNav`
  - `HomeActions` -> `TopNavStart`
  - `CommonActions` -> `TopNavMiddle`
  - `UserActions` -> `TopNavEnd`
  - `UserAction` -> `EndItem`

  The `@atlassian/navigation-system/layout/top-bar` entrypoint has been renamed to
  `@atlassian/navigation-system/layout/top-nav`.

  The following components have been moved from the `@atlassian/navigation-system/top-nav-items`
  entrypoint to the `@atlassian/navigation-system/layout/top-nav` entrypoint:
  - `TopNavStart`
  - `TopNavMiddle`
  - `TopNavEnd`

  This change is part of a larger group of changes to the package to prepare it for early access.

## 0.160.0

### Minor Changes

- [#169332](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169332)
  [`d1551201c8a62`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d1551201c8a62) -
  The `@atlassian/navigation-system/top-nav` entrypoint has been renamed to
  `@atlassian/navigation-system/top-nav-items`. This also applies to child entrypoints of this path,
  such as `@atlassian/navigation-system/top-nav-items/notifications`,

  This change is part of a larger group of changes to the package to prepare it for early access.

### Patch Changes

- Updated dependencies

## 0.159.0

### Minor Changes

- [#169127](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/169127)
  [`887e91e29c45d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/887e91e29c45d) -
  The `UNSAFE_height` props for `Banner` and `TopBar` have been updated to remove the `UNSAFE_`
  prefix. They are now just `height`.

### Patch Changes

- Updated dependencies

## 0.158.1

### Patch Changes

- [#162295](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/162295)
  [`1fc0e5e1c0ebd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fc0e5e1c0ebd) -
  Adding some temporary test ids to the collapse toggle icons for a performance investigation

## 0.158.0

### Minor Changes

- [#167316](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/167316)
  [`931d2609cecc6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/931d2609cecc6) -
  Deprecates the `isFixed` prop on `Main` and `Aside` slots. This prop determines if the slot
  scrolls with the body, or if it has its own scroll container.

  Adds the `platform_dst_nav4_disable_is_fixed_prop` feature gate to disable existing usage. When
  enabled the `isFixed` prop on the `Main` and `Aside` slots will be ignored and the
  `isFixed={true}` behavior will always be applied. After rollout the `isFixed` prop will be
  removed.

  We are removing the `isFixed` prop because the `isFixed={false}` behavior has caused bugs, and we
  believe that removing this prop will improve outcomes for users and lower our maintenance burden.

  See https://hello.atlassian.net/wiki/spaces/DST/pages/5400167974 for more information.

### Patch Changes

- Updated dependencies

## 0.157.0

### Minor Changes

- [#161646](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161646)
  [`792ab09b5a38a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/792ab09b5a38a) -
  Memoise NavLogoRenderer to improve performance. This is behind a feature gate targeting Jira.

### Patch Changes

- Updated dependencies

## 0.156.1

### Patch Changes

- [#158374](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158374)
  [`19e469038d7ed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19e469038d7ed) -
  Removes transparent border when box shadow is visible. This change affects the
  `platform_design_system_nav4_sidenav_border` and
  `platform_design_system_nav4_panel_default_border` feature gates.

## 0.156.0

### Minor Changes

- [#165582](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/165582)
  [`35cf9c1eb525b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/35cf9c1eb525b) -
  The default height of the Banner layout area has been updated to `48px`, down from `64px`, to
  align with the height of the `@atlaskit/banner` component. This change is behind a feature flag.

## 0.155.0

### Minor Changes

- [#157650](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157650)
  [`3696befec09c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3696befec09c1) -
  The feature flag for closing open layers (popups, dropdown menus, select menus, tooltips) when
  resizing layout areas has now been cleaned up.
- [#164842](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164842)
  [`f39351a31c34f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f39351a31c34f) -
  The `appearance` prop has been removed from `ContainerAvatar`.

  The previous `appearance="default"` variant would apply a border. Now that the prop has been
  removed, the new default and only style is equivalent to the previous `appearance="subtle"`
  variant, which does not have a border.

  This change was previously applied behind a feature flag, which has now been removed.

### Patch Changes

- Updated dependencies

## 0.154.7

### Patch Changes

- Updated dependencies

## 0.154.6

### Patch Changes

- [#160530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160530)
  [`3d97095c489a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d97095c489a5) -
  Internal change to align styling solutions.
- Updated dependencies

## 0.154.5

### Patch Changes

- Updated dependencies

## 0.154.4

### Patch Changes

- [#158346](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158346)
  [`3be3427559c4a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3be3427559c4a) -
  Changes Panel width on mobile to better align with the default width of the panel. This change is
  behind the `platform_design_system_nav4_panel_mobile_width_fix` flag.
- Updated dependencies

## 0.154.3

### Patch Changes

- [#155817](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155817)
  [`bc10db24ed567`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc10db24ed567) -
  Add `!important` to `NavLogo` pressed interaction states to workaround Compiled issue.
- Updated dependencies

## 0.154.2

### Patch Changes

- [#159929](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159929)
  [`a5db655a2be0f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a5db655a2be0f) -
  Internal clean up of unused code. No change to public API.
- Updated dependencies

## 0.154.1

### Patch Changes

- [#154600](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154600)
  [`0b06dde976fe0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0b06dde976fe0) -
  Internal updates to logo component usage
- Updated dependencies

## 0.154.0

### Minor Changes

- [#149822](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149822)
  [`f9ab0e846ae21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f9ab0e846ae21) -
  Updated to support `size` prop for new icons from `@atlaskit/icon`.

### Patch Changes

- Updated dependencies

## 0.153.0

### Minor Changes

- [#155926](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155926)
  [`00c9e21a20667`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/00c9e21a20667) -
  [ux] FlyoutMenuItemTrigger and ExpandableMenuItemTrigger now display the correct chevron icon for
  right-to-left languages.

### Patch Changes

- Updated dependencies

## 0.152.0

### Minor Changes

- [#156631](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156631)
  [`03d57647f8b39`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03d57647f8b39) -
  The margin and padding of NavLogo has been updated for improved spacing alignment with other top
  nav buttons. This change is behind the feature gate
  `platform_design_system_nav_logo_interaction_states`.

## 0.151.0

### Minor Changes

- [#154361](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154361)
  [`45b0d08584adf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/45b0d08584adf) -
  Changes the unsafe legacy CSS variables for `Aside` and `Panel` to be live updated during
  resizing. This change is behind the `platform_design_system_nav4_live_resizing_css_vars` feature
  gate.

## 0.150.0

### Minor Changes

- [#155125](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155125)
  [`e7c9adbec6388`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7c9adbec6388) -
  `usePrefixedUID` has been replaced by `useSkipLinkId`. It was previously updated to remove the
  unnecessary prefix, behind a feature flag. That feature flag is now being removed.

  As part of cleaning up the feature flag, we are renaming the hook to reflect the new behavior.

## 0.149.0

### Minor Changes

- [#152796](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152796)
  [`530aa01e75ebe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/530aa01e75ebe) -
  Internal refactor of Pragmatic drag and drop usage

### Patch Changes

- Updated dependencies

## 0.148.1

### Patch Changes

- [#152909](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152909)
  [`11ca987900fad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11ca987900fad) -
  [ux] Adds interaction states to the `NavLogo` component behind the
  `platform_design_system_nav_logo_interaction_states` feature gate.
- Updated dependencies

## 0.148.0

### Minor Changes

- [#152893](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152893)
  [`f1c5db83c0cdc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1c5db83c0cdc) -
  The Notifications top nav component has been updated to support popup trigger `aria` attributes.
- [#152893](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152893)
  [`9aec1c2c46cef`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9aec1c2c46cef) -
  `MenuListItem` is now exported from the `@atlassian/navigation-system/top-nav` entrypoint.
- [#152893](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152893)
  [`ffd9759e99c3e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ffd9759e99c3e) -
  Notifications and Help now re-use `UserAction` internally, which means:
  - They now support the `onMouseEnter` prop.
  - They now support the `isListItem` prop. This allows you to disable the default list item
    wrapper. It is intended for use with dropdown menus or popups, and requires you to render your
    own `<MenuListItem>` wrapper. See the prop JSDocs for an example.

## 0.147.1

### Patch Changes

- Updated dependencies

## 0.147.0

### Minor Changes

- [#150849](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150849)
  [`24802ae5fc972`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24802ae5fc972) -
  Adding a workaround for a Safari bug that resulted in drag preview content being concatenated too
  early.

## 0.146.0

### Minor Changes

- [#149907](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149907)
  [`178e3451a3c4b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/178e3451a3c4b) -
  The border has been removed from ContainerAvatar. This change is behind a feature flag.

  The default value of the `appearance` prop would previously apply a border. This will no longer be
  the case when the feature flag is enabled. It will have the same style as the
  `appearance="subtle"` variant. This will become the new default and only style.

  The `appearance` prop will later be removed when the feature flag is cleaned up.

### Patch Changes

- [#150070](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150070)
  [`f6b33c15fc717`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f6b33c15fc717) -
  Added JSDocs for the useSkipLink hook.
- Updated dependencies

## 0.145.0

### Minor Changes

- [#148808](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148808)
  [`32f756068ac52`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/32f756068ac52) -
  Pressed state has been added for MenuLinkItem, the link variant of ExpandableMenuItemTrigger, and
  selected FlyoutMenuItemTrigger.
- [#149808](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149808)
  [`27b15a97959bc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27b15a97959bc) -
  If drag and drop is enabled on a menu item (with `hasDragIndicator`) then the iOS context menu for
  anchors will be disabled in order to enable a better drag and drop experience.
- [#146964](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146964)
  [`9d2e94598e036`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d2e94598e036) -
  Fixing layout issue in drag and drop interactions caused by a bug with subgrid in Safari.
- [#148674](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148674)
  [`483667dce6b0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/483667dce6b0c) -
  [ux] Adds a default background color to the `Panel` slot, behind the
  `platform_design_system_nav4_panel_default_bg_color` gate.

### Patch Changes

- Updated dependencies

## 0.144.2

### Patch Changes

- Updated dependencies

## 0.144.1

### Patch Changes

- Updated dependencies

## 0.144.0

### Minor Changes

- [#144140](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144140)
  [`86019bb1ad72d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/86019bb1ad72d) -
  Cleans up the `platform_design_system_nav4_hide_empty_skip_links` feature gate. Skip links to
  slots with their height/width explicitly set to 0 will no longer be shown.

## 0.143.0

### Minor Changes

- [#146250](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146250)
  [`3b478dc40a087`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3b478dc40a087) -
  Adds `TopNavIconButton` and `TopNavLinkIconButton` exports to the existing
  `/experimental/top-nav-button` entrypoint.

### Patch Changes

- Updated dependencies

## 0.142.0

### Minor Changes

- [#146268](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146268)
  [`4373c928f93f2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4373c928f93f2) -
  Adds `ref` forwarding to the `CreateButton` component.

### Patch Changes

- Updated dependencies

## 0.141.0

### Minor Changes

- [#141616](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141616)
  [`517662bb32ebd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/517662bb32ebd) -
  Additional prop JSDocs has been added for the top nav components.
- [#142228](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142228)
  [`53cccf13c0d82`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/53cccf13c0d82) -
  Additional prop JSDocs has been added for the menu item components.

## 0.140.1

### Patch Changes

- [#144681](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144681)
  [`f29b92c5b24cc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f29b92c5b24cc) -
  Removes the implicit assumption that the `SideNav` is mounted, when calculating the `Panel` slot
  `width` while `platform_design_system_nav4_preview_panel_support` is enabled.

## 0.140.0

### Minor Changes

- [#144065](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144065)
  [`dc8861feb9610`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dc8861feb9610) -
  Adds `ref` and `testId` props to new CustomTitle component.
- [#144065](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/144065)
  [`e6e206809d5e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e6e206809d5e5) -
  [ux] Adds custom theming support to the new CustomTitle component. Adjusts padding of CustomTitle
  component.

## 0.139.1

### Patch Changes

- [#139100](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139100)
  [`e9d667a80b265`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e9d667a80b265) -
  [ux] The `Panel` slot will now have a border (or shadow on small screens) when the
  `platform_design_system_nav4_panel_default_border` gate is enabled.
- [#139100](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139100)
  [`68c01adb6cfe2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/68c01adb6cfe2) -
  [ux] The `SideNav` slot no longer has a border when it also has a shadow. This change is behind
  the `platform_design_system_nav4_sidenav_border` gate.

## 0.139.0

### Minor Changes

- [#142999](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142999)
  [`aca8f629c9199`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aca8f629c9199) -
  Exposing `CustomTitle` topbar component to be used in `HomeActions`.

### Patch Changes

- [#139445](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139445)
  [`0f13df85731d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f13df85731d6) -
  the component state update causes React Streming to have Suspense boundary received update before
  hydrating finished error. Wrapping the state update in startTransition
- [#137059](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137059)
  [`8d6a3a75c70f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8d6a3a75c70f1) -
  [ux] Changes the resizing bounds of the `Panel` slot to have a:
  - Minimum resizing width equal to the `defaultWidth` (up to a maximum of `400px`)
  - Maximum resizing width of half the viewport width after the sidebar has been removed. This means
    that the `Panel` will not be larger than the content.

  Additionally, the `--leftSidebarWidth` CSS variable is now updated live during resizing.

  These changes are behind the `platform_design_system_nav4_preview_panel_support` gate.

- Updated dependencies

## 0.138.0

### Minor Changes

- [#141596](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141596)
  [`b544669f5d156`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b544669f5d156) -
  Exposing `type Availability` from `hitbox`. `Availability` is the `type` that is provided to
  `attachInstruction`

  ```ts
  type Availability = 'available' | 'not-available' | 'blocked';
  ```

  ```ts
  import {
  	type Availability,
  	attachInstruction,
  } from '@atlassian/navigation-system/side-nav/drag-and-drop/hitbox';

  const value: Availability = 'available';

  dropTargetForElements({
  	getData(args) {
  		const data = { type: 'menu-item' };
  		return attachInstruction(data, {
  			input: args.input,
  			element: args.element,
  			operations: {
  				'reorder-above': value,
  				//               👆 this is an `Availability`
  			},
  		});
  	},
  });
  ```

## 0.137.0

### Minor Changes

- [#142177](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142177)
  [`2b5851d15adba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b5851d15adba) -
  The inner wrapper element of Aside will now take up the full height of the layout slot (grid
  item). This change is no longer behind a feature flag.

## 0.136.0

### Minor Changes

- [#142168](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142168)
  [`92095a01848e7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92095a01848e7) -
  FlyoutMenuItemContent padding styles have now been expanded to longhand properties.

### Patch Changes

- Updated dependencies

## 0.135.0

### Minor Changes

- [#141560](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141560)
  [`f4b0e7678d79f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4b0e7678d79f) -
  usePrefixedUID no longer attaches a string prefix to the generated ID. This change is behind a
  feature flag. In a future release, the hook will be renamed as it will no longer apply a prefix.

## 0.134.0

### Minor Changes

- [#141047](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141047)
  [`0e55fa3632fe9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e55fa3632fe9) -
  Additional prop JSDocs has been added for the page layout components.
- [#141047](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141047)
  [`febe778c723f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/febe778c723f8) -
  A new entrypoint for skip links has been added - `@atlassian/navigation-system/layout/skip-links`.
  `useSkipLink()` and `usePrefixedUID()` are no longer exposed from the root package entrypoint, and
  are only exposed from the new entrypoint.

  Before:

  ```tsx
  import { useSkipLink, usePrefixedUID } from '@atlassian/navigation-system';
  ```

  After:

  ```tsx
  import { useSkipLink, usePrefixedUID } from '@atlassian/navigation-system/layout/skip-links';
  ```

### Patch Changes

- Updated dependencies

## 0.133.0

### Minor Changes

- [#140944](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140944)
  [`bb36840ea79f8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bb36840ea79f8) -
  Added an optional `testId` to `ListItem`, `MenuList`, `MenuSection`, and `GroupDropIndicator`
  components.

### Patch Changes

- Updated dependencies

## 0.132.0

### Minor Changes

- [#140214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140214)
  [`7c8481b79231d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7c8481b79231d) -
  The side navigation now supports drag and drop operations 🎉 .
  [Technical documentation and guidance](http://staging.atlassian.design/components/navigation-system/side-navigation/drag-and-drop)

### Patch Changes

- Updated dependencies

## 0.131.0

### Minor Changes

- [#138535](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138535)
  [`5628220f4614e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5628220f4614e) -
  The `resizeBounds` prop on the `PanelSplitterProvider` has been renamed to `getResizeBounds` and
  accepts a function instead of an object. This allows for lazy evaluation. The `ResizeBounds` type
  is now exposed for convenience.

## 0.130.1

### Patch Changes

- Updated dependencies

## 0.130.0

### Minor Changes

- [#136561](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136561)
  [`13fc310556e21`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13fc310556e21) -
  The inner wrapper element of Aside will now take up the full height of the layout slot (grid
  item). This change is behind a feature flag.

## 0.129.0

### Minor Changes

- [#135853](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135853)
  [`e16b7a002f960`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e16b7a002f960) -
  Resizing slots will now close any open @atlaskit/select menus. This change is behind a feature
  flag.

### Patch Changes

- Updated dependencies

## 0.128.0

### Minor Changes

- [#135178](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135178)
  [`b2eb16f6d0658`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2eb16f6d0658) -
  Resizing slots with the keyboard will close any open layers. This change is behind a feature flag.

## 0.127.1

### Patch Changes

- Updated dependencies

## 0.127.0

### Minor Changes

- [#134955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134955)
  [`74cad14449db0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74cad14449db0) -
  Resizing slots will now close any open layers, such as popups or dropdown menus. This change is
  behind a feature flag.

### Patch Changes

- Updated dependencies

## 0.126.0

### Minor Changes

- [#132896](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132896)
  [`4b7bd573c4131`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b7bd573c4131) -
  `FlyoutMenuItem` has been updated to no longer call the `onOpenChange` callback on initial render.
  This change is no longer behind a feature flag.

## 0.125.1

### Patch Changes

- Updated dependencies

## 0.125.0

### Minor Changes

- [#131507](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131507)
  [`ce2ab0826b877`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce2ab0826b877) -
  The `elemBefore` prop on `<ExpandableMenuItemTrigger>` has been widened from `ReactElement` to
  `ReactNode` to improve consistency with other props in menu items.

  ```diff
  type ExpandableMenuItemTriggerProps = {
  -	elemBefore?: ReactElement;
  +	elemBefore?: ReactNode;
  }
  ```

## 0.124.1

### Patch Changes

- Updated dependencies

## 0.124.0

### Minor Changes

- [#130149](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130149)
  [`d0b23591b1da2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d0b23591b1da2) -
  Changes skip link styles to align with design spec, behind the
  `platform_design_system_nav4_skip_link_styling` gate.

## 0.123.0

### Minor Changes

- [#130720](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130720)
  [`2b4555de9adf4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b4555de9adf4) -
  Minor type adjustment to support different logo types

### Patch Changes

- Updated dependencies

## 0.122.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 0.122.0

### Minor Changes

- [#130010](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130010)
  [`13d50a1e1cd5c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13d50a1e1cd5c) -
  Adds feature for side navigation to close when clicking outside of it on mobile. This change is
  behind the `platform_design_system_side_nav_click_out_to_close` gate.

## 0.121.0

### Minor Changes

- [#129306](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129306)
  [`7529486f8fc1b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7529486f8fc1b) -
  Removed `label` prop from slot prop types for slots which did not use it as the `aria-label`.

## 0.120.1

### Patch Changes

- [#128754](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128754)
  [`a0d3455350d79`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a0d3455350d79) -
  Cleans up `platform_design_system_nav4_skip_link_cleanup` gate which made internal-only refactors
  to skip links.

## 0.120.0

### Minor Changes

- [#127977](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127977)
  [`33e25fc7e77c9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/33e25fc7e77c9) -
  Removes the `label` prop from the `Main` slot component. This slot will no longer apply an
  `aria-label` to its element.

### Patch Changes

- [#127298](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127298)
  [`725e0f07a1c6c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/725e0f07a1c6c) -
  Cleans up the `platform_design_system_nav4_banner_slot_role` feature gate. The banner slot no
  longer has an ARIA role.
- Updated dependencies

## 0.119.1

### Patch Changes

- [#128699](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128699)
  [`b17d8bc2700bb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b17d8bc2700bb) -
  Update to use logos from @atlaskit/temp-nav-app-icons
- Updated dependencies

## 0.119.0

### Minor Changes

- [#127254](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127254)
  [`664b2457a0d05`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/664b2457a0d05) -
  Updated MenuButtonItem to support the disabled state. It now sets explicit disabled styles.

  This change is no longer behind a feature flag.

  When isDisabled is true, the actions and actionsOnHover are not supported. The component types
  have been updated to enforce this.

## 0.118.0

### Minor Changes

- [#127412](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127412)
  [`7f49847550683`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f49847550683) -
  `FlyoutMenuItem` has been updated to no longer call the `onOpenChange` callback on initial render.
  This change is behind the feature flag `platform_nav4_flyoutmenuitem_onopenchange_refactor`.

## 0.117.1

### Patch Changes

- [#126199](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126199)
  [`f58699367d980`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f58699367d980) -
  Hides skip links for the Banner, Aside and Panel slots when they have an explicit width or height
  of 0. This change is behind the `platform_design_system_nav4_hide_empty_skip_links` feature gate.

## 0.117.0

### Minor Changes

- [#126835](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126835)
  [`44a4c2b15175a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/44a4c2b15175a) -
  ExpandableMenuItemTrigger will now show the chevron icon when the menu item or any of its
  interactive elements are focused. This change is no longer behind a feature flag.

### Patch Changes

- Updated dependencies

## 0.116.0

### Minor Changes

- [#126083](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126083)
  [`df1bd2b7c3849`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df1bd2b7c3849) -
  Adds `skipLinkLabel` prop to page layout slots, which can be used to override the skip link label
  registered for each slot.

## 0.115.5

### Patch Changes

- Updated dependencies

## 0.115.4

### Patch Changes

- [#125215](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125215)
  [`3c2efab149e6c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c2efab149e6c) -
  Fixes bug behind `platform_design_system_nav4_skip_link_cleanup` gate. The side navigation will
  now expand (if necessary) when navigating to it via skip link.
- Updated dependencies

## 0.115.3

### Patch Changes

- Updated dependencies

## 0.115.2

### Patch Changes

- [#124259](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124259)
  [`844662c1f7113`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/844662c1f7113) -
  Internal refactoring of skip links behind the `platform_design_system_nav4_skip_link_cleanup`
  gate.

## 0.115.1

### Patch Changes

- [#123529](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123529)
  [`8a9a9ecca4148`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a9a9ecca4148) -
  Fixes skip links when ids contain `:` or other special characters, such as when ids are generated
  using the React 18 `useId()` hook.

## 0.115.0

### Minor Changes

- [#119306](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119306)
  [`19e403946c512`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19e403946c512) -
  Adds minimum widths to the `HomeActions` and `UserActions` when the
  `platform_design_system_nav4_top_nav_min_widths` gate is enabled. This creates separation between
  them and the search bar, as well as ensuring the search bar aligns with the side nav when it is at
  its default width.
- [#122155](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122155)
  [`06903d0a6f3a4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06903d0a6f3a4) -
  The FlyoutMenuItemTrigger `iconBefore` prop has been renamed to `elemBefore` to align with other
  menu items.

## 0.114.0

### Minor Changes

- [#121775](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121775)
  [`eeb075e6d2f59`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eeb075e6d2f59) -
  Updated MenuButtonItem to support the disabled state. It now sets explicit disabled styles.

  When `isDisabled` is true, the `actions` and `actionsOnHover` are not supported. The component
  types have been updated to enforce this.

## 0.113.2

### Patch Changes

- [#122202](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122202)
  [`38865fe230ab2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/38865fe230ab2) -
  Removes `role="banner"` from the Banner slot behind the
  `platform_design_system_nav4_banner_slot_role` gate. There should only be one element with
  `role="banner"` on the page and `TopBar` already has this role, and is the more suitable element.

## 0.113.1

### Patch Changes

- Updated dependencies

## 0.113.0

### Minor Changes

- [#121181](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121181)
  [`367ea9a3e7b69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/367ea9a3e7b69) -
  ExpandableMenuItemTrigger will now show the chevron icon when the menu item or any of its
  interactive elements are focused. This change is behind a feature flag.

## 0.112.0

### Minor Changes

- [#121064](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121064)
  [`a22121b86e100`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a22121b86e100) -
  Removed the isChildSelected prop from ExpandableMenuItem.

### Patch Changes

- Updated dependencies

## 0.111.0

### Minor Changes

- [#120563](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120563)
  [`f87e9e9b5c0c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f87e9e9b5c0c2) -
  The isDisabled prop has been removed from FlyoutMenuItemTrigger.

  It was unused and there are no real use cases for it. It was also not fully supported (with
  styles).

## 0.110.1

### Patch Changes

- Updated dependencies

## 0.110.0

### Minor Changes

- [#120414](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120414)
  [`3722a78098896`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3722a78098896) -
  Adds `isListItem` prop to user action components such as `Profile`. This allows you to disable the
  default list item wrapper. It is intended for use with dropdown menus, and requires you to render
  your own `<MenuListItem>` wrapper. See the prop JSDocs for an example.

## 0.109.0

### Minor Changes

- [#119821](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119821)
  [`82c4515546620`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/82c4515546620) -
  Expandable menu items will now keep the chevron icon displayed when there is a nested popup open,
  such as a "More" submenu.

  This fixes a bug with the icon flickering between the custom elemBefore icon and the chevron icon
  when the user hovers over a nested popup.

  This change is no longer behind a feature flag.

- [#119821](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119821)
  [`0799b5b2e2848`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0799b5b2e2848) -
  Fixed a bug with menu items not keeping actionsOnHover visible when there is a nested, portalled
  popup open, such as a "More" submenu. This change is no longer behind a feature flag.

## 0.108.0

### Minor Changes

- [#119194](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119194)
  [`3a3717ecc1175`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3a3717ecc1175) -
  [ux] Align items to the center in the common-actions section in the nav-bar

## 0.107.0

### Minor Changes

- [#119328](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119328)
  [`da429b6cb74f4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/da429b6cb74f4) -
  Removed the MenuItemCommonProps type export from the package root entrypoint. This was an internal
  type and not required for external use.
- [#119328](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119328)
  [`d689466631935`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d689466631935) -
  Internal refactors to menu item types.
- [#119328](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119328)
  [`257449bfc371e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/257449bfc371e) -
  MenuLinkItem and MenuButtonItem onClick prop type has been refined to more accurately reflect the
  underlying element.

## 0.106.1

### Patch Changes

- Updated dependencies

## 0.106.0

### Minor Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 0.105.1

### Patch Changes

- [#113667](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113667)
  [`26d85d05b7766`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/26d85d05b7766) -
  Simplify side nav label to Sidebar to avoid duplicated announcement

## 0.105.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- [#116043](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116043)
  [`0239c7fe5a185`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0239c7fe5a185) -
  [ux] Improved themed link button styles to be more resilient to global styles overriding color and
  text decoration for links
- Updated dependencies

## 0.104.0

### Minor Changes

- [#115300](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115300)
  [`a961fbeb6d9ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a961fbeb6d9ad) -
  [ux] The side nav flyout will now animate when expanding and collapsing, on supported browsers.
  Currently Firefox is not supported. This change is no longer behind a feature flag.

## 0.103.0

### Minor Changes

- [#114062](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114062)
  [`dc5f5fc3db83d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc5f5fc3db83d) -
  Adds `useHasCustomTheme` export to new `/experimental/use-has-custom-theme` entrypoint, which can
  be used to check if a component is inside of a custom themed top bar.
- [#114062](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114062)
  [`0a60994d61baf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0a60994d61baf) -
  Adds `TopNavLinkButton` export to existing `/experimental/top-nav-button` entrypoint. This
  provides a `LinkButton` equivalent to the existing `TopNavButton`.
- [#115006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115006)
  [`3d8e9a3f3f288`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d8e9a3f3f288) -
  [ux] Expandable menu items will now keep the chevron icon displayed when there is a nested popup
  open, such as a "More" submenu.

  This fixes a bug with the icon flickering between the custom elemBefore icon and the chevron icon
  when the user hovers over a nested popup.

  This change is behind a feature flag.

### Patch Changes

- [#115086](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115086)
  [`04714fe459ab4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/04714fe459ab4) -
  Fixes edge case in `platform_design_system_nav4_top_nav_columns` layout changes. Content that
  could wrap was causing columns to be squished.

## 0.102.0

### Minor Changes

- [#113860](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113860)
  [`a4abb72bf5dde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4abb72bf5dde) -
  [ux] Expandable menu items will now keep the chevron icon displayed when there is a nested popup
  open, such as a "More" submenu.

  This fixes a bug with the icon flickering between the custom elemBefore icon and the chevron icon
  when the user hovers over a nested popup.

  This change is behind a feature flag.

## 0.101.0

### Minor Changes

- [#112708](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112708)
  [`a309928983a25`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a309928983a25) -
  [ux] Fixed a bug with menu items not keeping actionsOnHover visible when there is a nested,
  portalled popup open, such as a "More" submenu. This change is behind a feature flag.

## 0.100.1

### Patch Changes

- [#112195](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112195)
  [`f58e19aeae498`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f58e19aeae498) -
  Improves top bar layout and edge case behavior behind
  `platform_design_system_nav4_top_nav_columns` feature gate.

## 0.100.0

### Minor Changes

- [#112335](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112335)
  [`d7dc0f36f7f96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d7dc0f36f7f96) -
  [ux] The side nav flyout will now animate when expanding and collapsing, on supported browsers.
  Currently Firefox is not supported. This change is behind a feature flag.

## 0.99.0

### Minor Changes

- [#111319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111319)
  [`38bb379192046`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/38bb379192046) -
  Internal refactor to menu items.

## 0.98.0

### Minor Changes

- [#111236](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111236)
  [`a4b934b5ad294`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4b934b5ad294) -
  [ux] The notch has been removed from the hover state of menu item components.

## 0.97.0

### Minor Changes

- [#110562](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110562)
  [`9a10f0cfa5ca7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a10f0cfa5ca7) -
  The interactionName prop has been removed from PanelSplitter, as it is no longer a button element.

## 0.96.1

### Patch Changes

- Updated dependencies

## 0.96.0

### Minor Changes

- [#107712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107712)
  [`782dbfc224d3e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/782dbfc224d3e) -
  Adds `TopLevelSpacer` exposed via the `/side-nav/top-level-spacer` entrypoint.

  This component is intended for creating visual separation around the global app shortcut section.

## 0.95.0

### Minor Changes

- [#109452](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109452)
  [`2069ea4a654c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2069ea4a654c9) -
  The resizing element (PanelSplitter) is now accessible for keyboard and screen reader use. This
  change is no longer behind a feature flag.

## 0.94.0

### Minor Changes

- [#109042](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109042)
  [`d3dff0ed2d006`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3dff0ed2d006) -
  Internal clean up. No outward changes.

## 0.93.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 0.92.0

### Minor Changes

- [#106459](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/106459)
  [`173b99bfff61f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/173b99bfff61f) -
  Cleans up `platform_design_system_nav4_top_bar_theming` feature flag. Custom theming is now always
  enabled when a valid theme is passed to the `UNSAFE_theme` prop. This prop will be renamed in the
  future.

## 0.91.0

### Minor Changes

- [#105266](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105266)
  [`a4dcf21e2a29d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4dcf21e2a29d) -
  [ux] Updated flyout menu width

## 0.90.0

### Minor Changes

- [#104751](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104751)
  [`49f324ec26500`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49f324ec26500) -
  The top bar now has a full width bottom border. The border between the side nav and main slot is
  now applied to the side nav. This change is no longer behind a feature flag.

## 0.89.0

### Minor Changes

- [#104520](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104520)
  [`c6f180b32ef0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6f180b32ef0d) -
  The fix for drag and drop in the sidebar flyout is now always applied and no longer behind a
  feature flag.
- [#105706](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105706)
  [`61a93e64e896a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/61a93e64e896a) -
  The panel splitter screen reader announcement has been updated to announce the width percentage
  first - e.g. XX% width

### Patch Changes

- Updated dependencies

## 0.88.0

### Minor Changes

- [#104417](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104417)
  [`19de5443920ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19de5443920ad) -
  We have reverted the recent addition of a main content slot from the grid pending further review

## 0.87.0

### Minor Changes

- [#103043](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103043)
  [`3ad11458706d8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ad11458706d8) -
  [ux] TC-11095: Add main content header to the navigation-system Layout grid

### Patch Changes

- [#103594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103594)
  [`7b1a8574e9c29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7b1a8574e9c29) -
  Fix or temporarily ignore TypeScript errors that occur in internal React 18 suites.

## 0.86.0

### Minor Changes

- [#103025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103025)
  [`f067a78dbcfa0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f067a78dbcfa0) -
  [ux] The top bar now has a full width bottom border. The border between the side nav and main slot
  is now applied to the side nav. This change is behind a feature flag.

## 0.85.1

### Patch Changes

- Updated dependencies

## 0.85.0

### Minor Changes

- [#100405](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100405)
  [`e042031781a96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e042031781a96) -
  [ux] The curved border for the main slot has been removed. This change is behind a feature flag.

## 0.84.0

### Minor Changes

- [#181384](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181384)
  [`2edad72d1f697`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2edad72d1f697) -
  The resizing element (PanelSplitter) is now accessible for keyboard and screen reader use. This
  change is behind a feature flag.

## 0.83.0

### Minor Changes

- [#178407](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178407)
  [`76eac3bc4980d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/76eac3bc4980d) -
  Added autoFocus prop to FlyoutMenuItemContent to override the default autoFocus value of
  PopupContent

## 0.82.0

### Minor Changes

- [#179106](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179106)
  [`58fdafc70836a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58fdafc70836a) -
  MenuLinkItem and ExpandableMenuItemTrigger will now scroll into view when they become selected,
  and all its ancestor menu items are expanded. This change was previously behind a feature flag,
  which is now being removed.

## 0.81.1

### Patch Changes

- Updated dependencies

## 0.81.0

### Minor Changes

- [#178696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178696)
  [`3cabcfbd4725e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3cabcfbd4725e) -
  Top bar custom theming now accepts `RGB` color objects. Hex strings are still supported for
  backwards compatibility but may be removed in the future.

  Color inputs should be parsed into `RGB` objects before providing them as the custom theme.

  We now export multiple utility functions to assist with color parsing:
  - Hex parsing with `parseHex` from
    `@atlassian/navigation-system/experimental/color-utils/parse-hex`
  - CSS `hsl()` parsing with `parseHsl` from
    `@atlassian/navigation-system/experimental/color-utils/parse-hsl`
  - CSS `rgb()` parsing with `parseRgb` from
    `@atlassian/navigation-system/experimental/color-utils/parse-rgb`

  You can also use `parseUserColor` from
  `@atlassian/navigation-system/experimental/color-utils/parse-user-color` if you're not sure which
  color notation is used.

  Example usage:

  ```tsx
  <TopBar
  	UNSAFE_theme={{
  		backgroundColor: parseRgb('rgb(200, 100, 0)'),
  		highlightColor: parseHsl('hsl(90deg, 75%, 25%)'),
  	}}
  />
  ```

## 0.80.0

### Minor Changes

- [#174375](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174375)
  [`c5578097ac579`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c5578097ac579) -
  Some minor refactoring with no API or behaviour impact.

## 0.79.1

### Patch Changes

- Updated dependencies

## 0.79.0

### Minor Changes

- [#177059](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177059)
  [`958b99e722dd2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/958b99e722dd2) -
  Fixing a bug in the side navigation flyout where dragging something in the flyout would cause the
  flyout to close. The fix is currently behind a feature flag.

## 0.78.2

### Patch Changes

- Updated dependencies

## 0.78.1

### Patch Changes

- Updated dependencies

## 0.78.0

### Minor Changes

- [#176005](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176005)
  [`a7f4659856234`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a7f4659856234) -
  Adds `visualContentRef` prop to:
  - `ExpandableMenuItemTrigger`
  - `FlyoutMenuItemTrigger`
  - `MenuButtonItem`
  - `MenuLinkItem`

  Adds `listItemRef` to:
  - `MenuButtonItem`
  - `MenuLinkItem`

  These expose useful parts of the component's markup, in addition to the existing `ref` which
  exposes the main interactive element.

## 0.77.0

### Minor Changes

- [#175928](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175928)
  [`60e8eb5be2e67`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/60e8eb5be2e67) -
  The top nav UserActions are now responsive by default. This behaviour was previously behind a
  feature flag.
- [#173211](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173211)
  [`736311c43b85f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/736311c43b85f) -
  [ux] MenuLinkItem and ExpandableMenuItemTrigger will now scroll into view whenever the
  `isSelected` prop is changed.

  Previously MenuLinkItem would only scroll into view on mount (if it was selected).

### Patch Changes

- [#175575](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175575)
  [`032efbe9dfbb0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/032efbe9dfbb0) -
  Internal optimisation to the menu item scroll into view behaviour.
- Updated dependencies

## 0.76.1

### Patch Changes

- [#171994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171994)
  [`be58e4bb2e387`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be58e4bb2e387) -
  Migrating usages of UNSAFE types and entrypoints that have been renamed in `@atlaskit/icon` and
  `@atlaskit/icon-lab`.
- [#171499](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171499)
  [`13d6fb7c618e3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/13d6fb7c618e3) -
  Flyout content will no longer use `transform` for positioning. This resolves some layering issues
  with nested popups using `shouldRenderToParent` that were unable to escape the flyout's scroll
  container.
- Updated dependencies

## 0.76.0

### Minor Changes

- [#171400](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171400)
  [`a00e4d1e4e1c5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00e4d1e4e1c5) -
  Label props have been standardised across the components under
  @atlassian/navigation-system/top-nav.

  The following components previously had an optional `label` prop, which has now been made
  required:
  - Help
  - NavLogo
  - Notifications

  The following components previously used the `children` prop as the label, but have now been
  updated to use a required `label` prop:
  - Settings
  - Profile
  - UserAction

- [#171400](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171400)
  [`ca52c3e39178a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca52c3e39178a) -
  ShowMoreButton has been removed as an exported package. It is no longer needed. There is
  responsiveness built into the top nav UserActions component, to place the user action list inside
  a popup behind a "Show more" button.

### Patch Changes

- [#171562](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171562)
  [`43749228390bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43749228390bf) -
  Adds explicit box sizing to menu item's elemBefore, to resolve issues with inconsistent sizing.
- Updated dependencies

## 0.75.0

### Minor Changes

- [#171330](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171330)
  [`f1a4f5985187f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f1a4f5985187f) -
  The focus ring is no longer clipped when focusing within menu item slots.

### Patch Changes

- [#170862](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170862)
  [`cca540d19d05b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cca540d19d05b) -
  Cleanup `platform_design_system_nav4_divider_a11y` gate. Menu section dividers now have
  `role="none"` applied.
- Updated dependencies

## 0.74.0

### Minor Changes

- [#166034](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166034)
  [`c390db5935a61`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c390db5935a61) -
  [ux] Conditional tooltips for sidebar menu item content is no longer behind a feature flag. These
  tooltips can be disabled with the `isContentTooltipDisabled` prop if they are not appropriate.

## 0.73.0

### Minor Changes

- [#165756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165756)
  [`fbbd859f9af2e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fbbd859f9af2e) -
  Add `isMenuListItem` prop to `MenuSection` which will render the section inside of a
  `MenuListItem`. This will become the default behaviour in the future.

## 0.72.1

### Patch Changes

- Updated dependencies

## 0.72.0

### Minor Changes

- [#166218](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166218)
  [`07ba023378acb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/07ba023378acb) -
  Panel Splitter will now block dragging to iFrames. This was previously behind a feature flag.

## 0.71.0

### Minor Changes

- [#162526](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162526)
  [`9a0c103641a2f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a0c103641a2f) -
  Menu items are now more resilient to narrow widths and deep nesting.
  - A minimum width of 72px has been set on menu items.
  - The menu item slots (elemBefore, elemAfter, actions, actionsOnHover) now hide overflowing
    content to prevent content spilling out or overlapping other slots when space is limited.

## 0.70.2

### Patch Changes

- [#165741](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165741)
  [`91553c4ece667`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/91553c4ece667) -
  Internal refactor to the implementation of the extended clickable area styles. No consumer change
  required.

## 0.70.1

### Patch Changes

- [#165063](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165063)
  [`c05f62deeac5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c05f62deeac5a) -
  [ux] Removes the `separator` semantics from the menu section `Divider` component, when the
  `platform_design_system_nav4_divider_a11y` feature gate is enabled
- Updated dependencies

## 0.70.0

### Minor Changes

- [#163245](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/163245)
  [`f8263c48df7df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f8263c48df7df) -
  [ux] The icon change to the sidebar toggle button that was shipped in `0.60.0` behind a feature
  flag is no longer behind a feature flag.

## 0.69.0

### Minor Changes

- [#162544](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162544)
  [`82e257cd98330`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/82e257cd98330) -
  [ux] Updated UserActions in the top nav to be responsive, controlled by the feature flag
  `platform_design_system_topnav_responsive_menuitems`. This wrapper collapses into a popup on
  smaller viewports. The list items are displayed in a row on desktop viewports and in a popup on
  smaller viewports.

## 0.68.0

### Minor Changes

- [#161029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161029)
  [`e19bcb7c6107b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e19bcb7c6107b) -
  [ux] Menu items that have an open nested popup will now use hover state background color tokens
  instead of pressed.
- [#161029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161029)
  [`e19bcb7c6107b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e19bcb7c6107b) -
  Selected state has been added to flyout menu items. Use the `isSelected` prop on
  `FlyoutMenuItemTrigger`.

## 0.67.0

### Minor Changes

- [`f7d6d9fa3d9c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7d6d9fa3d9c3) -
  The indentation of expandable menu item content has been reduced. This was previously behind a
  feature flag as of version 0.49.1, and is no longer behind a feature flag.

## 0.66.0

### Minor Changes

- [`be6f923511512`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be6f923511512) -
  `ExpandableMenuItemTrigger`, `FlyoutMenuItemTrigger`, `MenuLinkItem` and `MenuButtonItem` will now
  _conditionally_ show a tooltip when it's content is truncated. This can be disabled with the
  `isContentTooltipDisabled` prop. This change is currently behind a feature flag.

  A `testId` prop added to `ExpandableMenuItemTrigger`.

### Patch Changes

- Updated dependencies

## 0.65.0

### Minor Changes

- [#161542](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161542)
  [`72a19e7853807`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/72a19e7853807) -
  The `useSideNavVisibility` hook is no longer publically exported. If you need to programmatically
  expand or collapse the side nav, use either the `useToggleSideNav` or `useExpandSideNav` hooks.

## 0.64.1

### Patch Changes

- [#160884](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160884)
  [`8aabde15b9662`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aabde15b9662) -
  Themed buttons will now ignore props that affect styling, aligning with regular buttons

## 0.64.0

### Minor Changes

- [`024caade07488`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/024caade07488) -
  Cleans up the feature flag for internal changes for displaying the Main slot curved border.

## 0.63.0

### Minor Changes

- [#156108](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156108)
  [`c3366ec919883`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3366ec919883) -
  The side nav slots and scroll container feature flag has been cleaned up. The following changes
  are now available for all consumers:
  - `PanelSplitterProvider` no longer renders a scroll container, and no longer adds a flex
    container.
  - `SideNavContent` renders a scroll container.
  - `SideNavContent` no longer renders a ul - it now renders a div. If you need a list element for
    semantics, compose in a `MenuList`.
  - `SideNav` now renders a flex container to control the layout of the header, content, and footer
    slots.

  They were previously behind a feature flag in version 0.53.0.

- [#156108](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156108)
  [`c3366ec919883`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3366ec919883) -
  A testId prop has been added to SideNavContent.

## 0.62.1

### Patch Changes

- [#159997](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159997)
  [`7d11c708c8d95`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d11c708c8d95) -
  Fixes to text color for interaction states in themed buttons

## 0.62.0

### Minor Changes

- [#159818](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159818)
  [`ca52b69f59975`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca52b69f59975) -
  Fixing an event issue with new sidebar toggle (which is still behind a feature flag). The issue
  caused the flyout to sometimes open when it should not have for the new sidebar toggle.
- [#159268](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159268)
  [`b3e1a32a69a3a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b3e1a32a69a3a) -
  [ux] The side nav will always collapse when collapsed using the toggle button.

  Previously, if the side nav was in flyout (peek) mode when the user hovered on the toggle button
  and clicked to expand, and then clicked to collapse, the side nav would go back to flyout mode.
  This is no longer the case.

### Patch Changes

- [#159268](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159268)
  [`487d22f32a93f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/487d22f32a93f) -
  Trivial CSS changes to bring this inline with @atlaskit/css typing:
  - We now allow certain `zIndex` values.
  - `background` is a banned property, use `backgroundColor` instead
  - Migrates a few things to the new `@atlaskit/css` JSX pragmas.

- Updated dependencies

## 0.61.0

### Minor Changes

- [#142733](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142733)
  [`1dcf72d7115a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1dcf72d7115a4) -
  Guidance for the callback props on ExpandableMenuItem and ExpandableMenuItemTrigger has been
  added.

## 0.60.0

### Minor Changes

- [#158756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158756)
  [`4a434042f05ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4a434042f05ad) -
  [ux] Updating the icon in the topbar for toggling the sidebar. Now using one icon for expanding,
  and another icon for collapsing. This change is behind a feature flag.

## 0.59.1

### Patch Changes

- [#158301](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158301)
  [`157af47088d40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/157af47088d40) -
  Internal changes to the SideNav and Main slots behind a feature gate, for displaying the Main slot
  curved border.

## 0.59.0

### Minor Changes

- [#157811](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157811)
  [`f6f67d625c05a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f6f67d625c05a) -
  Adds `LogIn` component for use in the top navigation

## 0.58.1

### Patch Changes

- Updated dependencies

## 0.58.0

### Minor Changes

- [#157917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157917)
  [`016b8d2ebdde1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/016b8d2ebdde1) -
  Adds a `useExpandSideNav` hook, which can be used to expand the side nav. It is intended to be
  used for onboarding flows that require showing the side nav.

## 0.57.0

### Minor Changes

- [#157006](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157006)
  [`1b8b690aefaee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1b8b690aefaee) -
  We have added a temporary stopgap to Panel to support the jira migration. The element will be
  hidden on all viewports when the defaultWidth prop is set to 0.

## 0.56.2

### Patch Changes

- [#156341](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156341)
  [`615c70d18f084`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/615c70d18f084) -
  Settings and UserAction now accept `onMouseEnter`, `aria-controls`, `aria-expanded`, and
  `aria-haspopup` props.

## 0.56.1

### Patch Changes

- [#154679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154679)
  [`e5ac221179777`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e5ac221179777) -
  Improves the selected states for themed top navigation buttons

## 0.56.0

### Minor Changes

- [#154357](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154357)
  [`2c2e84d4a6825`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2c2e84d4a6825) -
  Performance improvement: will now only do the work to create a custom theme if the backgroundColor
  or highlightColor values change.

### Patch Changes

- [#156480](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156480)
  [`619ef610bb782`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/619ef610bb782) -
  Updating `package.json` to help ensure the appropriate reviewers are added to pull requests.
- [#155764](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155764)
  [`410ddaf56ec50`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/410ddaf56ec50) -
  The NavLogo component will now restrict the maximum height of the logo

## 0.55.0

### Minor Changes

- [#155970](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155970)
  [`d2e4456064db4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2e4456064db4) -
  Menu link items will no longer scroll towards the center of the viewport when opened. This change
  is behind a feature flag.

### Patch Changes

- Updated dependencies

## 0.54.0

### Minor Changes

- [#154669](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154669)
  [`20db78434becd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20db78434becd) -
  Bump to the latest version of @compiled/\*

### Patch Changes

- [#155024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155024)
  [`e3b1e825c7dd0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e3b1e825c7dd0) -
  [ux] Updated flyout menu width, menu item description color and spacing, menu section heading
  color
- [#155409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155409)
  [`c36d9768308ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c36d9768308ac) -
  remove unused analytics property from MenuLinkItem and MenuButtonItem (it was not used anywhere at
  platform/, except for the optional type property)
- Updated dependencies

## 0.53.0

### Minor Changes

- [#154258](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154258)
  [`c6076b62b62a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6076b62b62a3) -
  Adds experimental `useLegacySearchTheme` export
- [#154274](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154274)
  [`1c3d17bc6120a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c3d17bc6120a) -
  [ux] Minimum width of the Nav4 side-nav component updated from 160px to 240px
- [#153718](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153718)
  [`b6738b5acfef0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6738b5acfef0) -
  We are making changes to the side nav scroll container behind a feature flag, in order to support
  the new header and footer slot components.
  - `PanelSplitterProvider` no longer renders a scroll container, and no longer adds a flex
    container.
  - `SideNavContent` renders a scroll container.
  - `SideNavContent` no longer renders a `ul` - it now renders a `div`. If you need a list element
    for semantics, compose in a `MenuList`.
  - `SideNav` now renders a flex container to control the layout of the header, content, and footer
    slots.

### Patch Changes

- [#152203](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152203)
  [`c68542c9c1f6b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c68542c9c1f6b) -
  Internal changes to support theming
- Updated dependencies

## 0.52.0

### Minor Changes

- [#153551](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153551)
  [`debf8966419d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/debf8966419d6) -
  return whether item was expanded or not from expandable-menu-item-trigger. E.g. to send it in
  analytics

## 0.51.1

### Patch Changes

- [#152881](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152881)
  [`71f8f21c7ca95`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/71f8f21c7ca95) -
  Updating type of label for Notifications Button

## 0.51.0

### Minor Changes

- [#153558](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153558)
  [`73fcbbd6ae2c6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/73fcbbd6ae2c6) -
  Update MainStickyHeader zIndex to fix the problem where its sibling will display on top when
  scrolling
- [#154110](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154110)
  [`4daa6146379d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4daa6146379d2) -
  The peeking side nav (flyout) will stay locked open when layered components (popups, dropdown
  menus, tooltips, flyout menu items) are open within it, and automatically close when there are no
  more open layered components. This change was previously behind a feature flag from version 0.47.0
  but is no longer behind a feature flag.

### Patch Changes

- Updated dependencies

## 0.50.0

### Minor Changes

- [#149247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149247)
  [`6d0d753f79b0a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d0d753f79b0a) -
  SideNavContent will grow to take free space in side nav, and act as scroll container, behind a
  feature flag.
- [#149247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149247)
  [`6d0d753f79b0a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d0d753f79b0a) -
  SideNavFooter and SideNavHeader components have been added, for placing content with the footer
  and header of the side nav.

## 0.49.1

### Patch Changes

- [#153020](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153020)
  [`d8f0d2f0c5523`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8f0d2f0c5523) -
  Adds experimental indentation change to nested items behind the
  `platform_design_system_nav4_indentation_change_1` feature flag.

## 0.49.0

### Minor Changes

- [#148799](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148799)
  [`2900dcedb8cae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2900dcedb8cae) -
  Adds export for experimental theme-aware top navigation button

## 0.48.0

### Minor Changes

- [#148762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148762)
  [`be91f679e4bb9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be91f679e4bb9) -
  The peeking side nav (flyout) will now wait for the timeout duration to expire before
  automatically closing when the last open layer is closed.
- [#151929](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151929)
  [`309682d39cd1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/309682d39cd1a) -
  The AppSwitcher now accepts `onMouseEnter`, `ref`, `aria-controls`, `aria-expanded`,
  `aria-haspopup`. This allows it to be used as a popup trigger and to be integrated with Jira.

## 0.47.1

### Patch Changes

- [`6c3939273a388`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c3939273a388) -
  Internal changes to support search bar theming

## 0.47.0

### Minor Changes

- [#151707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151707)
  [`a2a509ab13335`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a2a509ab13335) -
  The peeking side nav (flyout) will now automatically close once there are no more layered
  components open within the side nav.

### Patch Changes

- Updated dependencies

## 0.46.0

### Minor Changes

- [#145232](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145232)
  [`04641b5e6ed55`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/04641b5e6ed55) -
  Resizing with the `<PanelSplitter>` will now correctly work regardless of the placement of
  `<iframe>` elements. This change is behind a feature flag for this release.

### Patch Changes

- Updated dependencies

## 0.45.5

### Patch Changes

- [#150384](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150384)
  [`100f001fd72f6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/100f001fd72f6) -
  Custom theming (hidden behind a feature flag) will now automatically invert colours for buttons
  and the logo.

## 0.45.4

### Patch Changes

- [#149596](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149596)
  [`6ff0fa45857c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6ff0fa45857c7) -
  Fixes the main content border not stretching over the panel slot in some products.

## 0.45.3

### Patch Changes

- [#144205](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144205)
  [`11fd539edbe0f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/11fd539edbe0f) -
  Added and exposed isSideNavVisible and showSideNav for the ability to determine if the sidebar
  navigation is open on either desktop or mobile, and be able to launch them.

## 0.45.2

### Patch Changes

- [#149469](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149469)
  [`c75edf6df890b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c75edf6df890b) -
  Updated icon types usage since there are now `NewCoreIconProps` and `NewUtilityIconProps`.
- [#149555](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149555)
  [`d83fe15d67945`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d83fe15d67945) -
  Increased specificity of nav logo styles to resolve double logo bug.
- Updated dependencies

## 0.45.1

### Patch Changes

- Updated dependencies

## 0.45.0

### Minor Changes

- [#148601](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148601)
  [`eff2b0c0e6815`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/eff2b0c0e6815) -
  Two required label props have been added to `SideNavToggleButton`:
  - `collapseLabel`: used as the button label when the toggle button will collapse the side nav
  - `expandLabel`: used as the button label when the toggle button will expand the side nav

### Patch Changes

- [#148281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148281)
  [`3c4de48168ffe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c4de48168ffe) -
  Update the import path of `useId*` from `@atlaskit/ds-lib`
- Updated dependencies

## 0.44.1

### Patch Changes

- [#148599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148599)
  [`15dd0178b86ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15dd0178b86ad) -
  Add height 100% into the panel div wrapper

## 0.44.0

### Minor Changes

- [#147863](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147863)
  [`144b13769c7df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/144b13769c7df) -
  The `AppSwitcher` action for the top navigation now accepts an `isSelected` prop.
- [#147863](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147863)
  [`144b13769c7df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/144b13769c7df) -
  Initial custom theming work for the top navigation has been added behind the
  'platform_design_system_nav4_top_bar_theming' feature flag.
- [#147863](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147863)
  [`dda1b73a13a9a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dda1b73a13a9a) -
  NavMenuList has been renamed to SideNavContent to better align with its purpose.

  It can be imported from the entrypoiint: "@atlassian/navigation-system/layout/side-nav"

## 0.43.0

### Minor Changes

- [#147340](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147340)
  [`85a16c495a6f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85a16c495a6f7) -
  The deprecated AvatarDropdownAction component has been removed.
- [#147187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147187)
  [`f3fc0c5bb919d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3fc0c5bb919d) -
  [ux] Side nav flyout will stay locked when a composed popup or dropdown menu is open.

  This change is behind a feature flag.

- [#147187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147187)
  [`f3fc0c5bb919d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3fc0c5bb919d) -
  useSideNavFlyoutLock hook has been removed as an export. We are working on a transparent solution
  to keep the side nav flyout locked open if there are any supported layering components open within
  the side nav.

### Patch Changes

- Updated dependencies

## 0.42.1

### Patch Changes

- Updated dependencies

## 0.42.0

### Minor Changes

- [#145878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145878)
  [`72e885acee099`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/72e885acee099) -
  [ux] SideNav will fly out when the user hovers over the toggle button in the side bar, when the
  side nav is collapsed.
- [#145878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145878)
  [`72e885acee099`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/72e885acee099) -
  useSideNavFlyoutLock hook has been added, for use with any popups or dropdowns that are composed
  with the side nav, to keep the side nav open
- [#145878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145878)
  [`72e885acee099`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/72e885acee099) -
  Added `isEnabled` prop to PanelSplitterProvider, to conditionally render the panel splitter.
- [#145878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145878)
  [`72e885acee099`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/72e885acee099) -
  [ux] Side nav buttons have been consolidated.
  - `SideNavToggleButton` (used in the top bar) is now always visible. It no longer has built in
    visibility logic for showing/hiding itself based on whether the side nav is expanded or
    collapsed.
  - `SideNavCollapseButton` has been removed. It was previously displayed in the side nav, and would
    only be visible when the side nav was hovered over.
  - `collapseButton` prop on `SideNav` has been removed

## 0.41.0

### Minor Changes

- [#144033](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144033)
  [`292f1ceddb35a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/292f1ceddb35a) -
  Removed deprecated components - MobileHamburger and TopNavigation

## 0.40.3

### Patch Changes

- [#143323](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143323)
  [`4fdf6347eb506`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4fdf6347eb506) -
  Flyout menu item content components now appear as a modal on small viewports.
- Updated dependencies

## 0.40.2

### Patch Changes

- Updated dependencies

## 0.40.1

### Patch Changes

- [#139469](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139469)
  [`04ea74bfaf7bd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/04ea74bfaf7bd) -
  Top nav components have been internally moved into separate modules.
- [#140915](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140915)
  [`5741afa7baed6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5741afa7baed6) -
  Page layout components have been internally moved into separate modules.

## 0.40.0

### Minor Changes

- [#140701](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140701)
  [`7dd088f58f9f1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7dd088f58f9f1) -
  The v4 platform package entrypoint has been removed. Instead of using
  @atlassian/navigation-system/v4, use @atlassian/navigation-system.

### Patch Changes

- [#140701](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140701)
  [`7dd088f58f9f1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7dd088f58f9f1) -
  Side nav components have been split into separate modules
- Updated dependencies

## 0.39.1

### Patch Changes

- [`1302e912153c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1302e912153c9) -
  Panel splitter now has a zindex of 1 to allow it to be rendered above position sticky elements
  that also have a zindex of 1.

## 0.39.0

### Minor Changes

- [#139803](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139803)
  [`f98e46fd3e776`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f98e46fd3e776) -
  [ux] Fixes content layering issues with page layout slots on small viewports.

## 0.38.0

### Minor Changes

- [#140022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140022)
  [`9757a63c70784`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9757a63c70784) -
  [ux] Clicking on the `<PanelSplitter>` inside the `<Sidebar>` will no longer collapse the
  `<Sidebar>`. Clicking on the `<PanelSplitter>` will now do nothing.

## 0.37.2

### Patch Changes

- [#139917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139917)
  [`5288d4af60a86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5288d4af60a86) -
  The notification badge is now positioned further to the top right and continues to extend right
  instead of left if it grows in size.
- [#139966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139966)
  [`966d5e56a6e7a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/966d5e56a6e7a) -
  Unneeded styles have been cleaned up - no visual change.

## 0.37.1

### Patch Changes

- [#139740](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139740)
  [`3695b91fedcbe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3695b91fedcbe) -
  Adds optional prop `onClose` to `FlyoutMenuItemContent`

## 0.37.0

### Minor Changes

- [#137888](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137888)
  [`34b2e56d5de47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/34b2e56d5de47) -
  Added onClick handlers in order to send analytic events from Jira

## 0.36.0

### Minor Changes

- [#137852](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137852)
  [`e484ea0d5c1e2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e484ea0d5c1e2) -
  The `NavLogo` component logo and mobileLogo props have changed to prevent invalid and inaccessible
  states.
  - `logo` now takes a component reference that matches `@atlaskit/logo` props instead of arbitrary
    JSX
  - `mobileLogo` has been renamed to `icon` and now takes a component reference that matches
    `@atlaskit/logo` props instead of arbitrary JSX

  **Before**

  ```jsx
  <NavLogo
  	href="/"
  	logo={<AtlassianLogo label="Atlassian Design System" />}
  	mobileLogo={<AtlassianIcon label="Atlassian Design System" appearance="brand" size="small" />}
  />
  ```

  **After**

  ```jsx
  <NavLogo
  	href="/"
  	label="Atlassian Design System"
  	icon={AtlassianLogo}
  	mobileLogo={AtlassianIcon}
  />
  ```

## 0.35.0

### Minor Changes

- [#137247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137247)
  [`77307eedaedd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77307eedaedd5) -
  Padding styles have been removed from xcss prop in Aside and Panel components.

### Patch Changes

- [#137247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137247)
  [`77307eedaedd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77307eedaedd5) -
  The top bar is now visually centered and functional across small viewports.
- [#137247](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137247)
  [`77307eedaedd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77307eedaedd5) -
  The common actions component is now always visually aligned in the top bar when there is enough
  space.

## 0.34.2

### Patch Changes

- [#138688](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138688)
  [`961d97994618c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/961d97994618c) -
  [ux] Flyout menu item popups are now contained within the viewport.
- Updated dependencies

## 0.34.1

### Patch Changes

- [`4b6da1dad2471`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4b6da1dad2471) -
  [ux] The side nav collapse button is now correctly aligned even when the content overflows and a
  vertical scrollbar appears.

## 0.34.0

### Minor Changes

- [#135608](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135608)
  [`4796d6b44cba2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4796d6b44cba2) -
  Remove the use of react-uid, to allow better support of R18. Also removed export `usePrefixedUID`

## 0.33.0

### Minor Changes

- [#135930](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135930)
  [`4ba432807eed2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ba432807eed2) -
  Adds `/side-nav/container-avatar` entrypoint

### Patch Changes

- [#135930](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135930)
  [`1f39fe8e56436`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1f39fe8e56436) -
  [ux] The AppSwitcher component is now using `@atlaskit/icon/core/app-switcher` and will inherit
  the current text color.
- [#135930](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135930)
  [`c801457b57ee2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c801457b57ee2) -
  [ux] The AppSwitcher component now displays a tooltip.
- Updated dependencies

## 0.32.0

### Minor Changes

- [#135036](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135036)
  [`627bd9e8f974b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/627bd9e8f974b) -
  BLU-2783 Panel and Aside layout slots now support resizing with PanelSplitter.

## 0.31.0

### Minor Changes

- [#133727](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133727)
  [`169f345f1da84`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/169f345f1da84) -
  [ux] Panel splitter no longer continues showing itself after a drag. It also has a different color
  while being pressed.

## 0.30.0

### Minor Changes

- [#132082](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132082)
  [`7125120e9f31f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7125120e9f31f) -
  BLU-2783 Updates Aside and Panel layout slots to support resizing with PanelSplitter
- [#132082](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132082)
  [`7125120e9f31f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7125120e9f31f) -
  [ux] Panel splitter no longer continues showing itself after a drag. It also has a different color
  while being pressed.

## 0.29.1

### Patch Changes

- [#132113](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132113)
  [`895a77387e320`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/895a77387e320) -
  Aside and panel components now have "box-sizing border-box" set on their elements.
- [#132113](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132113)
  [`895a77387e320`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/895a77387e320) -
  The content border has been refactored to prevent unexpected layering issues.
- [#132113](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132113)
  [`895a77387e320`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/895a77387e320) -
  Panel and aside components now support bounded typesafe styles through the xcss prop.

## 0.29.0

### Minor Changes

- [#131586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131586)
  [`28709385524a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/28709385524a7) -
  [ux] BLU-3203 Remove fade animation from side nav collapse button

### Patch Changes

- Updated dependencies

## 0.28.0

### Minor Changes

- [#130337](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130337)
  [`89890c9a3f906`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89890c9a3f906) -
  [ux] BLU-3203 The side nav collapse button is now only visible on hover or focus of the side bar

### Patch Changes

- [#131099](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131099)
  [`c34d5005999bc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c34d5005999bc) -
  ExpandableMenuItemContent now renders list markup using ARIA roles, to align with our menu list
  components.
- Updated dependencies

## 0.27.0

### Minor Changes

- [#131088](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131088)
  [`bded9e74b2f3e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bded9e74b2f3e) -
  [ux] BLU-3263 Updates side nav min width to 160px, and max width for mobile to 320px

## 0.26.0

### Minor Changes

- [#130177](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130177)
  [`12f65bc9c64ef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/12f65bc9c64ef) -
  [ux] Pressing on an action in a menu item will not longer cause `:active` styles to be applied to
  the whole menu item. `:active` will only be applied to the action button.
- [#128129](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128129)
  [`b9c47badc1261`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9c47badc1261) -
  Adds `interactionName` prop to all interactive components, to allow for Unified Frontend
  Observability (UFO) press interaction tracing.

### Patch Changes

- [#130413](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130413)
  [`1a796c4acf4e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a796c4acf4e9) -
  Internal update to icons after dependency bump

## 0.25.4

### Patch Changes

- [#128022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128022)
  [`1495b8f9c9253`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1495b8f9c9253) -
  Modified popup trigger's aria-haspopup types to support the 'dialog' value.
- Updated dependencies

## 0.25.3

### Patch Changes

- [#128225](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128225)
  [`5c2e63abd10b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c2e63abd10b0) -
  The `MenuList` component will now print console errors in non-production environments if it has
  semantically invalid children.
- Updated dependencies

## 0.25.2

### Patch Changes

- [#122510](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122510)
  [`9ece2c8382e6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9ece2c8382e6e) -
  Reverted introduced size prop which is no longer required

## 0.25.1

### Patch Changes

- [#129115](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129115)
  [`ff588b0d31454`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff588b0d31454) -
  The border around the top bar and side nav has been moved around the content area in anticipation
  of the visual refresh.

## 0.25.0

### Minor Changes

- [#128623](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128623)
  [`d2f4a623b3f99`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2f4a623b3f99) -
  BLU-3206 Adds useToggleSideNav hook for expanding and collapsing the side nav. Splits the side nav
  visibility context into smaller contexts for state and dispatch functions to optimise for
  re-renders.
- [#129137](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129137)
  [`2a84ee908bf4c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a84ee908bf4c) -
  List items now use ARIA roles for semantics instead of `<ul>` and `<li>` elements. This enables
  more flexible composition by allowing elements to be rendered between lists and list items.

### Patch Changes

- [#128741](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128741)
  [`bc84f3e270193`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bc84f3e270193) -
  Add `MainStickyHeader` component. This component is used for ensuring content inside the `Main`
  component remains visible at all times when scrolling. Use this for experiences such as Confluence
  page headers.

## 0.24.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 0.23.1

### Patch Changes

- Updated dependencies

## 0.23.0

### Minor Changes

- [#128206](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128206)
  [`4e908cefafbe6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4e908cefafbe6) -
  BLU-3417 Replace SideNavButton with SideNavCollapseButton for use with SideNav and collapseButton
  prop, and SideNavToggleButton for use with TopBar
- [#128059](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128059)
  [`42a35fd49b9c9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/42a35fd49b9c9) -
  export useSkipLink

### Patch Changes

- Updated dependencies

## 0.22.0

### Minor Changes

- [#124788](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124788)
  [`df38aae1ec36c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/df38aae1ec36c) -
  Adding optional id and test ID fields, as well as a mechanic for layout to ignore console errors
  for script and style tags.

## 0.21.0

### Minor Changes

- [#127649](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127649)
  [`c71c4fad72a1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c71c4fad72a1a) -
  Internal refactor of how `MenuItem` styles are authored.

## 0.20.0

### Minor Changes

- [`7a2d242f4ca34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a2d242f4ca34) -
  BLU-3417 Add collapseButton slot to SideNav, for use with SideNavButton

## 0.19.0

### Minor Changes

- [`e099cccf48acc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e099cccf48acc) -
  [ux] BLU-3404 Add tooltip to SideNavButton and update label copy

## 0.18.1

### Patch Changes

- [`13e9a02699427`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/13e9a02699427) -
  [ux] Fixes a hover state bug in MenuItem when it has a nested Popup
- Updated dependencies

## 0.18.0

### Minor Changes

- [#125978](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125978)
  [`97af4271e74d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/97af4271e74d3) -
  Updates navigation icon to use productionized version

## 0.17.0

### Minor Changes

- [#125542](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125542)
  [`55b87dacbee32`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/55b87dacbee32) -
  Adds `onResizeStart` and `onResizeEnd` callbacks to the `PanelSplitter`
- [#125542](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125542)
  [`55b87dacbee32`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/55b87dacbee32) -
  Adds `onExpand` and `onCollapse` callbacks to the `SideNav`
- [#125735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125735)
  [`21b77561d773e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21b77561d773e) -
  BLU-3335 Adds Profile, Settings, and ShowMoreButton top nav components. Adds testId to
  Notifications and Help components.
- [#125735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125735)
  [`21b77561d773e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21b77561d773e) -
  BLU-3335 Add separate entrypoints for top nav components

### Patch Changes

- Updated dependencies

## 0.16.0

### Minor Changes

- [#125606](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125606)
  [`8faba4925ae98`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8faba4925ae98) -
  [ux] MenuItem's will now have `elemBefore` take up space by default in order to improve vertical
  alignment in the side navigation. You can opt out of this behaviour by using a special
  `COLLAPSE_ELEM_BEFORE` symbol as the argument for `elemBefore`.

  ```tsx
  import { MenuLinkItem, COLLAPSE_ELEM_BEFORE } from '@atlaskit/navigation/side-nav/menu-link-item';

  function Example() {
  	return (
  		<MenuLinkItem elemBefore={COLLAPSE_ELEM_BEFORE} href="#">
  			Hi
  		</MenuLinkItem>
  	);
  }
  ```

## 0.15.2

### Patch Changes

- [#125240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125240)
  [`fa871e8163b39`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fa871e8163b39) -
  [ux] The `actionsOnHover` actions are now always visible on expanded menu items, even when they
  are not being hovered.

## 0.15.1

### Patch Changes

- [#125233](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125233)
  [`7004985a6921a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7004985a6921a) -
  Introduced a size parameter to the FlyoutMenuItemContent to allow the consumer to opt-in for a
  larger menu width

## 0.15.0

### Minor Changes

- [`aebba1921b323`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aebba1921b323) -
  Allow to pass test IDs to page layout components

## 0.14.1

### Patch Changes

- [#124715](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124715)
  [`b90a1166176a6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b90a1166176a6) -
  [ux] Fixes the issue with broken TopBar layout for the JIRA EntryPoint pages

## 0.14.0

### Minor Changes

- [#124517](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124517)
  [`2518f13ebc566`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2518f13ebc566) -
  [ux] BLU-3127 Hide elemAfter on hover and focus if actionsOnHover are provided
- [#124517](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124517)
  [`2518f13ebc566`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2518f13ebc566) -
  BLU-3127 Add testId prop to MenuButtonItem and MenuLinkItem

## 0.13.0

### Minor Changes

- [#124519](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124519)
  [`31f85206f2625`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31f85206f2625) -
  BLU-3210 Rename CreateButton text prop to children

### Patch Changes

- [#124134](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124134)
  [`76664d193d06f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/76664d193d06f) -
  Adds performance optimisations for SkipLinks
- [#124519](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124519)
  [`31f85206f2625`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/31f85206f2625) -
  BLU-3210 Update top nav action components to include semantic list elements

## 0.12.0

### Minor Changes

- [#123809](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123809)
  [`bada2c94db778`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bada2c94db778) -
  Adds the properties to control open/expanded state to FlyoutMenuItem/ExpandableMenuItem

## 0.11.4

### Patch Changes

- [#123415](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123415)
  [`9cb9d8f61636a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9cb9d8f61636a) -
  MenuLinkItem now accepts Router Link Config generic typescript types

## 0.11.3

### Patch Changes

- [#123811](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123811)
  [`9313dbcfe99df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9313dbcfe99df) -
  [ux] ExpandableMenuItem components that are selectable will now expand and collapse as-normal (the
  same way that non-selectable components behave).

## 0.11.2

### Patch Changes

- [#117215](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117215)
  [`239b6df44cfa3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/239b6df44cfa3) -
  [ux] Selected menu item scrolls into view on page load

## 0.11.1

### Patch Changes

- [#122895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122895)
  [`5d32f0e1cc92c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d32f0e1cc92c) -
  BLU-2820 Remove usage of window.matchMedia in side nav button state initialiser
- Updated dependencies

## 0.11.0

### Minor Changes

- [#123036](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123036)
  [`3a456954b4396`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3a456954b4396) -
  [ux] Added skip links accessibility feature

## 0.10.0

### Minor Changes

- [#123151](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123151)
  [`e254e1cee028a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e254e1cee028a) -
  Adds isDisabled prop to Flyout Menu Trigger

## 0.9.0

### Minor Changes

- [#122964](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122964)
  [`aab73b798d006`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aab73b798d006) -
  [ux] BLU-2820 Update side nav button to be visible or hidden based on side nav visibility and
  screen width; Add defaultCollapsed prop to button

## 0.8.2

### Patch Changes

- [`f16aa7b497c40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f16aa7b497c40) -
  Removed `interactiveElemBefore` prop from menu items.

## 0.8.1

### Patch Changes

- [#121871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121871)
  [`ed19811e379f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed19811e379f3) -
  Remove unnecessary icon button from unselectable `ExpandableMenuItemTrigger`
- [#122002](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122002)
  [`c38c1e4f2659d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c38c1e4f2659d) -
  Code reverted for Fix zindex for content container in page-layout behind FF

## 0.8.0

### Minor Changes

- [#121452](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121452)
  [`b49735b1f1e69`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b49735b1f1e69) -
  Fix zindex for content container in page-layout behind FF
  'ally-jira-team.issue-sideview.inaccurate-reading-order_yna0p'. If successful will remove flag in
  a cleanup PR.

### Patch Changes

- [#121529](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121529)
  [`c3b801ce12d36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c3b801ce12d36) -
  Script and style elements are now ignored during the dev time check for invalid page layout
  children.
- [#121395](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121395)
  [`f6225189cfe5d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f6225189cfe5d) -
  Export PanelSplitterProvider from navigation system
- [#121474](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121474)
  [`bb4e1953ec3b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bb4e1953ec3b8) -
  [ux] Aligns sizing and spacing with designs
- [#121395](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121395)
  [`52c962d29a939`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/52c962d29a939) -
  Expose unsafe legacy page variables through the layout/main entrypoint.
- [#121339](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121339)
  [`487256292a80b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/487256292a80b) -
  Refactor menu item internals
- Updated dependencies

## 0.7.0

### Minor Changes

- [#120444](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120444)
  [`f06109aaf6708`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f06109aaf6708) -
  Transfer migration layer to Jira

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- [#120731](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120731)
  [`ad9a39b61a207`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad9a39b61a207) -
  Add isSelected prop to ChatButton in top navigation

## 0.6.0

### Minor Changes

- [#120434](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120434)
  [`30047b14dcd7d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30047b14dcd7d) -
  BLU-3151 Replace children prop with label in nav4 PanelSplitter

## 0.5.2

### Patch Changes

- [#119869](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119869)
  [`c9fbedbef614e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c9fbedbef614e) -
  Panel splitter now delays showing itself on first hover.
- [#119383](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119383)
  [`b7e84dd7afd14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b7e84dd7afd14) -
  Search trigger text is now visually centered.
- [#119383](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119383)
  [`b7e84dd7afd14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b7e84dd7afd14) -
  Add label prop to nav logo and user actions components. User actions is now a nav element.
- [#119383](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119383)
  [`b7e84dd7afd14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b7e84dd7afd14) -
  Move from xcss func to Compiled cssMap for the search trigger.
- [#119259](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119259)
  [`e6d3571e113c5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e6d3571e113c5) -
  Fix MenuLinkItem hover state style regression
- [#119383](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119383)
  [`b7e84dd7afd14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b7e84dd7afd14) -
  Top bar and top navigtation components have been consolidated in anticipation of the visual
  refresh. Top navigation now renders a fragment and will be removed soon.
- [#119524](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119524)
  [`123bca7624d52`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/123bca7624d52) -
  Adding ref forwarding to Help button
- [#119117](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119117)
  [`ce745c15d2bdb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ce745c15d2bdb) -
  [ux] Update ExpandableMenuItemContent component and not render content initially
- [#119383](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119383)
  [`b7e84dd7afd14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b7e84dd7afd14) -
  Search trigger now has two new props: `beforeIcon` and `afterElem`.
- Updated dependencies

## 0.5.1

### Patch Changes

- [#119010](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119010)
  [`237dfd6bfe9bc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/237dfd6bfe9bc) -
  Fix sidenav being hidden when ran in PROD mode.
- Updated dependencies

## 0.5.0

### Minor Changes

- [#118859](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118859)
  [`58683f4c5aefa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58683f4c5aefa) -
  These APIs have been removed: `useToggleSideNavCollapsed`, `useSideNavCollapsedState`,
  `ShowSideNavInTestEnvironments`.
- [#118859](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118859)
  [`58683f4c5aefa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58683f4c5aefa) -
  Removed isDragDisabled prop from PanelSplitter

### Patch Changes

- [#118859](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118859)
  [`58683f4c5aefa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58683f4c5aefa) -
  The side nav collapsed state has been refactored to support the new designs where the side nav is
  either visible or hidden.
- [#118859](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118859)
  [`58683f4c5aefa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/58683f4c5aefa) -
  Fix `collapsedState` not being passed through in the migration layer.
- [#118240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118240)
  [`f5f4a16aa8ae8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f5f4a16aa8ae8) -
  [ux] Add `aria-current` on selected menu link item.

## 0.4.4

### Patch Changes

- [#118638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118638)
  [`d7a232705b272`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d7a232705b272) -
  Updating entry-points

## 0.4.3

### Patch Changes

- [#118198](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118198)
  [`9faab810fbd04`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9faab810fbd04) -
  [ux] Add `aria-expanded` to expandable menu item. Ensures `aria-expanded` is only added to buttons
  and not anchors in the `MenuItemBase`.

## 0.4.2

### Patch Changes

- [#117922](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117922)
  [`6dad11af3300c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6dad11af3300c) -
  Adds a fixed width to FlyoutMenuItemContent.
- [#117981](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117981)
  [`3b87f835cdc58`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3b87f835cdc58) -
  Fixes stacking order of popups rendered within menu items

## 0.4.1

### Patch Changes

- [#116976](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116976)
  [`1e4ac00498249`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1e4ac00498249) -
  Removes reference to feature flag for style hoisting fix
- [#116949](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116949)
  [`298f927e6009f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/298f927e6009f) -
  Fix spacing issue with user actions t end of top navigation component.
- [#116594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116594)
  [`d43a6afccd6e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d43a6afccd6e6) -
  Fixes issue where `hoverActions` were taking up space when menu items were in default (non-hover)
  state.
- Updated dependencies

## 0.4.0

### Minor Changes

- [#116919](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116919)
  [`ea3df676d3f03`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ea3df676d3f03) -
  Add ChatButton export.

## 0.3.15

### Patch Changes

- [`4709c6e8fcd8a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4709c6e8fcd8a) -
  Bump version to remove extra html comment in style tag in React SSR

## 0.3.14

### Patch Changes

- [#116409](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116409)
  [`b9997b6e42dca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9997b6e42dca) -
  The page layout root now forcibly hides direct child elements that aren't page layout components.
  Only page layout components that are placed onto the page layout grid are supported. An error
  message is logged during dev if you've rendered a non-page layout element as a child of the page
  layout root.
- Updated dependencies

## 0.3.13

### Patch Changes

- Updated dependencies

## 0.3.12

### Patch Changes

- Updated dependencies

## 0.3.11

### Patch Changes

- [#114761](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114761)
  [`d1ffa1b968add`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d1ffa1b968add) -
  Remove primitive component usage in root top nav to resolve a hydration error.

## 0.3.10

### Patch Changes

- [#113897](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113897)
  [`317a503f5adfa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/317a503f5adfa) -
  Handle spacing for emojis passed to the elemBefore prop of menu items.
- Updated dependencies

## 0.3.9

### Patch Changes

- [#114275](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114275)
  [`4b0a6782d8b97`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4b0a6782d8b97) -
  Consolidate mobile and desktop actions together and update icons for the top navigation.

## 0.3.8

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- [#113039](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113039)
  [`a08ae0c22daa3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a08ae0c22daa3) -
  Fix spacing of ExpandableMenuItem and FlyoutMenuItem by removing inherited margins.

## 0.3.6

### Patch Changes

- Updated dependencies

## 0.3.5

### Patch Changes

- [#112636](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112636)
  [`017614e2e4477`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/017614e2e4477) -
  Updates `MenuSectionHeading` typography and spacing style.
- Updated dependencies

## 0.3.4

### Patch Changes

- [#111845](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111845)
  [`236b96dcc18ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/236b96dcc18ea) -
  BLU-2887 Add size props to page layout slot components
- Updated dependencies

## 0.3.3

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- [#111260](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111260)
  [`34872391864a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/34872391864a7) -
  Small style changes to align with side navigation and design specification.

## 0.3.1

### Patch Changes

- [#102669](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102669)
  [`b92a646065d85`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b92a646065d85) -
  Add css side effect flag to pkg json.

## 0.3.0

### Minor Changes

- [#111367](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111367)
  [`df79fcab87bc5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/df79fcab87bc5) -
  Exports Menu Item types. Adds NavMenuList component.

### Patch Changes

- [#111427](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111427)
  [`a030964187b87`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a030964187b87) -
  BLU-2850 Add new entrypoints for each component
- Updated dependencies

## 0.2.2

### Patch Changes

- [#110867](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110867)
  [`dc7e72da70ef7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc7e72da70ef7) -
  Migrating instances of `UNSAFE_ANCHOR` primitive imports to the new safe import `Anchor`, in
  preparation of Anchor open beta and removal of the unsafe export from `@atlaskit/primitives`

## 0.2.1

### Patch Changes

- [#107302](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107302)
  [`e5e9625ef8a49`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e5e9625ef8a49) -
  BLU-2803 Update panel splitter line width to 3px; Add correct active state color token

## 0.2.0

### Minor Changes

- [`2e7d9897cef38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e7d9897cef38) -
  Add `target` prop to the menu link item, along with extra accessibility features for when `target`
  is `_blank`.

## 0.1.1

### Patch Changes

- [#110484](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110484)
  [`87624d8890d70`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87624d8890d70) -
  BLU-2803 Update side nav to support resizing up to 50% of viewport width

## 0.1.0

### Minor Changes

- [#110226](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110226)
  [`713f495106667`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/713f495106667) -
  Add new top navigation in under feature flag.

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- [#107711](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107711)
  [`200eec7e4d2f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/200eec7e4d2f5) -
  [ux] BLU-2803 Remove resting state border shadow from resizable panel splitter
- [#108799](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108799)
  [`19624b276970d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/19624b276970d) -
  Prevent the focus ring of a menu item from being overlapped by sibling menu items.

## 0.0.5

### Patch Changes

- Updated dependencies

## 0.0.4

### Patch Changes

- [#107762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107762)
  [`432dbcf3bdbd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/432dbcf3bdbd) -
  Migrate latest code from Jira to platform.

## 0.0.3

### Patch Changes

- [#105685](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105685)
  [`62358e655d4c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/62358e655d4c) -
  Remove private flag to publish internally.

## 0.0.2

### Patch Changes

- [#107116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107116)
  [`9a038f5d3834`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a038f5d3834) -
  Upgrade dependency @compiled/react to latest version

## 0.0.1

### Patch Changes

- [#104175](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104175)
  [`3ef38cfcb0c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ef38cfcb0c3) -
  Initial release for experimentation.
