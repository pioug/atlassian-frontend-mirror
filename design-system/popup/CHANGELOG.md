# @atlaskit/popup

## 4.6.3

### Patch Changes

- Updated dependencies

## 4.6.2

### Patch Changes

- Updated dependencies

## 4.6.1

### Patch Changes

- [`a0bb84bfd5321`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a0bb84bfd5321) -
  Updated JSDocs for the `setInitialFocusRef` property.

## 4.6.0

### Minor Changes

- [`bfdf7891c505f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bfdf7891c505f) -
  Fixes a bug with the compositional popup where focus was not being returned to the trigger when
  the popup is closed. This was occurring in React 18 Strict Mode.

  The regular popup was already using this fix behind the `platform-design-system-popup-ref` feature
  gate.

  This change to compositional popup is behind the feature gate
  `platform-dst-popup-compositional-trigger-ref`.

## 4.5.0

### Minor Changes

- [`0e417a8c4a92e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0e417a8c4a92e) -
  Popup will now stay open when a click starts inside the popup but then moves outside the popup.
  The `onClose` callback will not be called in this case. This aligns it with the behaviour of Modal
  Dialog.

  This change was previously behind a feature flag, which has now been removed.

### Patch Changes

- Updated dependencies

## 4.4.5

### Patch Changes

- Updated dependencies

## 4.4.4

### Patch Changes

- Updated dependencies

## 4.4.3

### Patch Changes

- Updated dependencies

## 4.4.2

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 4.4.1

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.
- Updated dependencies

## 4.4.0

### Minor Changes

- [`02c6e19e8ac81`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/02c6e19e8ac81) -
  Popup will now stay open when a click starts inside the popup but then moves outside the popup.
  The `onClose` callback will not be called in this case. This aligns it with the behaviour of Modal
  Dialog.

  This change is behind a feature flag.

## 4.3.15

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 4.3.14

### Patch Changes

- [`20056074447a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20056074447a2) -
  Switch to more semantically accurate label prop in internal radio and radio group instances.
- Updated dependencies

## 4.3.13

### Patch Changes

- Updated dependencies

## 4.3.12

### Patch Changes

- Updated dependencies

## 4.3.11

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 4.3.10

### Patch Changes

- [`de6195f7484ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de6195f7484ce) -
  Update prop descriptions to reduce confusion

## 4.3.9

### Patch Changes

- [`31c57f650ba07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31c57f650ba07) -
  Improving tests for server side rendering and hydration
- Updated dependencies

## 4.3.8

### Patch Changes

- [`87980402df1c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87980402df1c7) -
  Adds props descriptions for `TriggerProps` type.
- Updated dependencies

## 4.3.7

### Patch Changes

- Updated dependencies

## 4.3.6

### Patch Changes

- Updated dependencies

## 4.3.5

### Patch Changes

- [#188521](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188521)
  [`3ffa5eae8fa80`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ffa5eae8fa80) -
  Internal refactoring of tests.

## 4.3.4

### Patch Changes

- Updated dependencies

## 4.3.3

### Patch Changes

- Updated dependencies

## 4.3.2

### Patch Changes

- Updated dependencies

## 4.3.1

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [#160438](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160438)
  [`b68b92230b3a3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b68b92230b3a3) -
  Pass isReferenceHidden prop from the Popper component to the Popup to allow Popup to determine if
  it's trigger is hidden.

## 4.2.0

### Minor Changes

- [#154745](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154745)
  [`7618d9837e247`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7618d9837e247) -
  Tidy up design-system-closed-all-when-click-outside and sibling-dropdown-close-issue to provide
  better keyboard navigation.

## 4.1.0

### Minor Changes

- [#142168](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142168)
  [`92095a01848e7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/92095a01848e7) -
  The bounded style overrides prop (xcss) now supports logical longhand properties for padding.

## 4.0.0

### Major Changes

- [#137034](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137034)
  [`a832dd489aab3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a832dd489aab3) - -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.
  - Added a `className` prop for applying a focus ring to the custom popup container (Currently
    controlled by the feature flag `platform-design-system-apply-popup-wrapper-focus`). See usage
    example [here](https://atlassian.design/components/popup/examples#customization).

  Please note, in order to use this version of `@atlaskit/popup`, you will need to ensure that your
  bundler is configured to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#134955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134955)
  [`ba294ad0536de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ba294ad0536de) -
  An onClose listener is being provided to the experimental open layer observer.
- Updated dependencies

## 3.0.0

### Major Changes

- [#127309](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127309)
  [`42392c8a66f3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42392c8a66f3d) -
  The `onClose` prop type has been updated, to make the first argument nullable. This argument is
  for the corresponding `event` that led to the callback being called.

  This is to support programatically closing the popup.

  Previously, the type of `onClose` was:

  ```ts
  onClose?(
   event: Event | React.MouseEvent | React.KeyboardEvent,
   currentLevel?: number | any,
  ): void;

  ```

  It is now:

  ```ts
  onClose?(
   event: Event | React.MouseEvent | React.KeyboardEvent | null,
   currentLevel?: number | any,
  ): void;
  ```

  When the popup is closed programatically, the `event` argument will be `null`.

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 2.0.4

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- [#121410](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121410)
  [`b26d53ac2517a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b26d53ac2517a) -
  Prevent onClick handler gets called when popup is open on Firefox

## 2.0.1

### Patch Changes

- [#118418](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118418)
  [`d2e804df6bf9c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2e804df6bf9c) -
  Update dependencies and remove old codemod and unused internal exports.

## 2.0.0

### Major Changes

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

## 1.32.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 1.31.3

### Patch Changes

- Updated dependencies

## 1.31.2

### Patch Changes

- Updated dependencies

## 1.31.1

### Patch Changes

- Updated dependencies

## 1.31.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.30.6

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 1.30.5

### Patch Changes

- [#103594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103594)
  [`7b1a8574e9c29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7b1a8574e9c29) -
  Fix or temporarily ignore TypeScript errors that occur in internal React 18 suites.

## 1.30.4

### Patch Changes

- Updated dependencies

## 1.30.3

### Patch Changes

- [#181817](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181817)
  [`6876e5688ed14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6876e5688ed14) -
  Dropdown open in iframe should be closed when clicking outside of the iframe

## 1.30.2

### Patch Changes

- [#180699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180699)
  [`ba9603c950de1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba9603c950de1) -
  Clicking outside should close all popups

## 1.30.1

### Patch Changes

- Updated dependencies

## 1.30.0

### Minor Changes

- [#171499](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171499)
  [`397ca651978da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/397ca651978da) -
  Adds `shouldDisableGpuAcceleration` prop to composable `PopupContent` API. This prop will
  configure popper.js to position the popup using only position properties, without any `transform`
  usage. This should not be used in most cases, but is needed for some layering issues.

## 1.29.6

### Patch Changes

- Updated dependencies

## 1.29.5

### Patch Changes

- Updated dependencies

## 1.29.4

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.29.3

### Patch Changes

- Updated dependencies

## 1.29.2

### Patch Changes

- [#161638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161638)
  [`d2e5e5ce0053d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2e5e5ce0053d) -
  Use new API of layering without UNSAFE prefix

## 1.29.1

### Patch Changes

- Updated dependencies

## 1.29.0

### Minor Changes

- [#154669](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154669)
  [`20db78434becd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20db78434becd) -
  Bump to the latest version of @compiled/\*

### Patch Changes

- Updated dependencies

## 1.28.5

### Patch Changes

- Updated dependencies

## 1.28.4

### Patch Changes

- [#153563](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/153563)
  [`f737df437eb7a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f737df437eb7a) -
  Support close type in popup to not close all layers
- Updated dependencies

## 1.28.3

### Patch Changes

- Updated dependencies

## 1.28.2

### Patch Changes

- Updated dependencies

## 1.28.1

### Patch Changes

- [#148281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148281)
  [`3c4de48168ffe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c4de48168ffe) -
  Update the import path of `useId*` from `@atlaskit/ds-lib`
- Updated dependencies

## 1.28.0

### Minor Changes

- [#147187](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147187)
  [`f3fc0c5bb919d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f3fc0c5bb919d) -
  Adds usage of the useNotifyLayerObserver hook from the layering package. The hook is behind a
  feature flag.

### Patch Changes

- Updated dependencies

## 1.27.2

### Patch Changes

- Updated dependencies

## 1.27.1

### Patch Changes

- [#144902](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144902)
  [`16cce78563062`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/16cce78563062) -
  Fixes a bug that caused the trigger to lose the ability to have focus after closing a dropdown
  menu using the Escape key inside the popup content.

## 1.27.0

### Minor Changes

- [#143323](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143323)
  [`4fdf6347eb506`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4fdf6347eb506) -
  Popup and compositional popup now take an xcss prop that can adjust the popup contents padding and
  width.
- [#143323](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143323)
  [`4fdf6347eb506`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4fdf6347eb506) -
  Popup and compositional popup now have a new appearance prop. Pass it "modal" to enable the popup
  to appear as a modal on small viewports.

### Patch Changes

- Updated dependencies

## 1.26.0

### Minor Changes

- [#142538](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142538)
  [`3979d0196514a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3979d0196514a) -
  [ux] We are testing focus ring for popup wrapper `onKeyDown`. Changes are implemented behind
  feature flag. If this fix is successful, it will be available in a later release.

## 1.25.0

### Minor Changes

- [#138688](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138688)
  [`961d97994618c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/961d97994618c) -
  Adds `shouldFitViewport` prop which will apply `max-width` and `max-height` to contain the
  popper/popup within the viewport.

### Patch Changes

- [#138585](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138585)
  [`b72c2c7f9a2fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b72c2c7f9a2fd) -
  Support to close all layers when clicking outside under feature flag
- Updated dependencies

## 1.24.2

### Patch Changes

- [#136611](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136611)
  [`9755fb019113f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9755fb019113f) -
  Clean up emotion Globals usage

## 1.24.1

### Patch Changes

- [#135608](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135608)
  [`7498a45496f8a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7498a45496f8a) -
  Update to remove react-uid

## 1.24.0

### Minor Changes

- [#124840](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124840)
  [`2e4f70b9a71fa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e4f70b9a71fa) -
  Fix to set ref for trigger in React 18 Strict mode behind feature flag

## 1.23.2

### Patch Changes

- [#134766](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134766)
  [`56e1c0d98f0c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56e1c0d98f0c2) -
  Fixed unnecessary closing of modal dialogs that opened from a popup.

## 1.23.1

### Patch Changes

- [#133686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133686)
  [`462353527b0db`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/462353527b0db) -
  Expose shouldReturnFocus on Popup component to allow consumers to prevent trigger refocusing on
  popup close

## 1.23.0

### Minor Changes

- [#128022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128022)
  [`1495b8f9c9253`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1495b8f9c9253) -
  [ux] We are testing new focus behavior in non-dialog popup instances behind a feature flag. With
  that in place, all popup instances that don't have role="dialog" applied will have focus traps
  disabled by default. If this fix is successful, it will be available in a later release.

## 1.22.2

### Patch Changes

- Updated dependencies

## 1.22.1

### Patch Changes

- [`49e0363439f7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/49e0363439f7c) -
  [ux] Content inside of a Popup will now always have it's text color reset to `color.text`.
  Previously, the text color of Popup content would be `color.text` if rendering into a
  [portal](https://react.dev/reference/react-dom/createPortal) `shouldRenderToParent={true}` or
  `shouldFitContainer={true}`, but otherwise would inherit the text color of the parent element. We
  have made this change to improve consistency and avoid surprises when working with Popup.

## 1.22.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 1.21.1

### Patch Changes

- Updated dependencies

## 1.21.0

### Minor Changes

- [`8b8090800a35d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b8090800a35d) -
  Bump peer dependency for react-dom to include version 17 and 18.

### Patch Changes

- Updated dependencies

## 1.20.3

### Patch Changes

- [#123803](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123803)
  [`741dadf4fa8f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/741dadf4fa8f9) -
  Added modifiers prop to the popup

## 1.20.2

### Patch Changes

- [#122722](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122722)
  [`512798d699bd1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/512798d699bd1) -
  Disable onClick event if popup is a disabled layer

## 1.20.1

### Patch Changes

- Updated dependencies

## 1.20.0

### Minor Changes

- [#116426](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116426)
  [`d6c9799d09e87`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d6c9799d09e87) -
  Updates compositional popup to take an optional prop for the popup content to expand to the full
  width of the parent container

## 1.19.4

### Patch Changes

- Updated dependencies

## 1.19.3

### Patch Changes

- Updated dependencies

## 1.19.2

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 1.19.1

### Patch Changes

- Updated dependencies

## 1.19.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 1.18.0

### Minor Changes

- [#111709](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111709)
  [`2f3d71601a7c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f3d71601a7c2) -
  [ux] Adds a new optional `shouldFitContainer` prop, which when set to `true`, will fit the popup
  width to its parent's width.

### Patch Changes

- Updated dependencies

## 1.17.2

### Patch Changes

- Updated dependencies

## 1.17.1

### Patch Changes

- [#97895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97895)
  [`4f26610d9fbc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4f26610d9fbc) -
  Adds auto-generated ID to popup and popup triggers for better coverage of assistive technologies
  and `aria-controls`..

## 1.17.0

### Minor Changes

- [#91673](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91673)
  [`e757c83a22ee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e757c83a22ee) -
  Add new props for improving accessibility: `role`, `label` and `titleId`.

## 1.16.0

### Minor Changes

- [#95249](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95249)
  [`039491355ada`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/039491355ada) -
  Adds new entry points for an alternate experimental Popup API using composable components. The new
  exports are prefixed with UNSAFE should only be used after agreement with the Design System team.

## 1.15.1

### Patch Changes

- Updated dependencies

## 1.15.0

### Minor Changes

- [#93705](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93705)
  [`e0da49f51c4b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0da49f51c4b) -
  Add support for React 18 in non-strict mode.

## 1.14.1

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 1.14.0

### Minor Changes

- [#84410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84410)
  [`9d5dc8f7de85`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9d5dc8f7de85) -
  Adds a new `strategy` prop to control the positioning strategy to use other than the default
  'fixed' position.

## 1.13.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.13.1

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 1.13.0

### Minor Changes

- [#70573](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70573)
  [`c8fa9cdd08e4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c8fa9cdd08e4) -
  Accessibility changes. Add a new optional prop `shouldDisableFocusLock`. We are testing the
  ability to close the popup by pressing the Tab key when `shouldDisableFocusLock` is `true` and
  `shouldRenderToParent` is `true` behind a feature flag. This is necessary for the dropdown menu to
  work correctly. If this fix is successful it will be available in a later release.

## 1.12.0

### Minor Changes

- [#70664](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70664)
  [`776e5ba8fc41`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/776e5ba8fc41) -
  Enable layering in popup and dropdown to support nested navigation

## 1.11.6

### Patch Changes

- [#67435](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67435)
  [`7949bd7f5cb6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7949bd7f5cb6) -
  Support to disable pointer-events on iframe when popup is open to fix issue of clicking on iframe
  won't close popup

## 1.11.5

### Patch Changes

- [#40944](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40944)
  [`c6b7d977655`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b7d977655) - Memoize
  the Popup Trigger's ref to avoid unnecessary renders.

## 1.11.4

### Patch Changes

- [#42577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42577)
  [`d51b45b02fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d51b45b02fb) - Add
  component to push model consumption in JFE

## 1.11.3

### Patch Changes

- [#42594](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42594)
  [`07781d6d786`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07781d6d786) - Removes
  feature flag implemented in 1.11.0. Does not implement proposed functionality behind the feature
  flag.

## 1.11.2

### Patch Changes

- [#41628](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41628)
  [`b05664f7aba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b05664f7aba) - Use
  feature flag to toggle if we enable UNSAFE_LAYERING

## 1.11.1

### Patch Changes

- [#41322](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41322)
  [`f54519b315c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f54519b315c) - This
  removes the error in console when passing `shouldRenderToParent` prop.

## 1.11.0

### Minor Changes

- [#41251](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41251)
  [`b0a2a8d78c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0a2a8d78c6) - [ux] We
  are testing removing the `focus-trap` package for a smaller sharper implementation of focus
  management behind a feature flag. If this fix is successful it will be available in a later
  release.

## 1.10.2

### Patch Changes

- [#41354](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41354)
  [`d621fe3e4f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d621fe3e4f8) - fix
  ReferenceError where frameId is used before it is initialised

## 1.10.1

### Patch Changes

- [#40515](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40515)
  [`a54578d2ea9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a54578d2ea9) - This
  removes the feature flag for the `shouldRenderToParent` prop. The prop is available for use.

## 1.10.0

### Minor Changes

- [#39726](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39726)
  [`f355884a4aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f355884a4aa) - [ux]
  Support to press escape key and only close the top layer

### Patch Changes

- Updated dependencies

## 1.9.3

### Patch Changes

- [#39278](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39278)
  [`84442a93613`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84442a93613) - Adds
  support for surface detection when using design tokens. Enabling children to be styled with the
  surface color of the popup when using the `utility.elevation.surface.current` design token.
- Updated dependencies

## 1.9.2

### Patch Changes

- [#38011](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38011)
  [`065da872439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/065da872439) - Css
  changes for testing the feature flag `platform.design-system-team.render-popup-in-parent_f73ij`.

## 1.9.1

### Patch Changes

- [#37614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37614)
  [`6a0a3c059ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a0a3c059ba) - Remove
  unused argument from internal focus management function.

## 1.9.0

### Minor Changes

- [#34797](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34797)
  [`3920dcfd848`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3920dcfd848) - This
  removes the feature flag made for upgrading the `focus-trap` dependency and keeps `focus-trap` at
  it's original version.

## 1.8.3

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 1.8.2

### Patch Changes

- [#36447](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36447)
  [`472a62ce219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/472a62ce219) - [ux]
  Fixes `autoFocus` functionality on upgrade of focus-trap to v7.

## 1.8.1

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 1.8.0

### Minor Changes

- [`ac5a05f5929`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac5a05f5929) - We are
  testing an upgrade to the `focus-trap` dependency behind a feature flag. If this fix is successful
  it will be available in a later release.

## 1.7.0

### Minor Changes

- [#35092](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35092)
  [`eca89633804`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eca89633804) - Add a
  new prop `shouldRenderToParent` to allow render popup into a DOM node within the parent DOM
  hierarchy instead of React portal.

## 1.6.4

### Patch Changes

- [#35299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35299)
  [`e2a6337bb05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2a6337bb05) - Reverts
  changes 1.6.3 in @atlaskit/popup, reverts disabling pointer events on iframes when popup is open.

## 1.6.3

### Patch Changes

- [#34314](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34314)
  [`c394dbc632f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c394dbc632f) -
  Addresses the problem where the popup fails to close upon clicking on the iframe

## 1.6.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.6.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.6.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.5.5

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 1.5.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`c520e306869`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c520e306869) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 1.4.2

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.4.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.4.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`01d80d395bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01d80d395bc) - pass
  event to onOpenChange consistently

### Patch Changes

- [`8202e37941b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8202e37941b) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 1.3.10

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 1.3.9

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`dcf8150c49c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcf8150c49c) - Allow
  `trigger` props to be applied to any HTML element tag without causing type errors for the `ref`
  type

## 1.3.8

### Patch Changes

- Updated dependencies

## 1.3.7

### Patch Changes

- [#21242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21242)
  [`2e7bbdfd813`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e7bbdfd813) -
  Upgrading internal dependency 'bind-event-listener' to 2.1.0 for improved types

## 1.3.6

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#17576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17576)
  [`2e42aa0d900`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e42aa0d900) -
  **Note**: It is a re-release of the wrongly `patched` version `1.1.6` that should have been a
  `minor` release.

  Expose `fallbackPlacement` modifier from to specify a list of fallback options to try incase there
  isn't enough space

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#16960](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16960)
  [`c2dd770a743`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2dd770a743) - Add new
  prop which controls is outside click should be bound using capture

## 1.1.6

_WRONG RELEASE TYPE - DON'T USE_

### Minor Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f142150a3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f142150a3e8) - Expose
  `fallbackPlacement` modifier from to specify a list of fallback options to try incase there isn't
  enough space

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`04cf9c3d28c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04cf9c3d28c) - [ux]
  Colors now sourced from tokens.

### Patch Changes

- Updated dependencies

## 1.0.8

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 1.0.7

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 1.0.6

### Patch Changes

- [#6930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6930)
  [`1858f20ac3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1858f20ac3) - Optimised
  popup performance as part of the lite-mode project. Changes are internal and have no implications
  for component API or usage.

## 1.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 1.0.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#4346](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4346)
  [`fc8f6e61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc8f6e61f3) - Fix
  codemod utilities being exposed through the codemod cli

## 1.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 1.0.0

### Major Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`740e011f8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/740e011f8d) - This first
  major release of popup brings in major changes from @atlaskit/popper. These changes come with
  performance, maintainability and behavioral improvements.

  As popup wraps popper's functionality, these changes result in a breaking change for popup as
  well.

  These changes have ⚙️ codemod support:
  - ⚙️ `offset` is no longer a string, but an array of two integers (i.e. '0px 8px' is now [0, 8])
  - ⚙️ `boundariesElement` has been replaced with two props: `boundary` and `rootBoundary`. The
    three supported values from the boundariesElement prop have been split between the two as
    follows:
    - `boundariesElement = "scrollParents"` has been renamed: use `boundary = "clippingParents"`.
    - `boundariesElement = "window"` has been renamed: use `rootBoundary = "document"`, and acts in
      a similar fashion.
    - `boundariesElement = "viewport"` has been moved: use `rootBoundary = "document"`.
    - **✨new** the `boundary` prop now supports custom elements.

  - Components passed into the `content` have a change to render props:
    - ⚙️ `scheduleUpdate`, for async updates, has been renamed to `update`, and now returns a
      Promise.

  - For more information on the change, see
    [the popper.js docs](https://popper.js.org/docs/v2/utils/detect-overflow/#boundary)

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version of popup installed before you can
  run the codemod**

  `yarn upgrade @atlaskit/popup@^1.0.0`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to
  [this doc](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more details
  on the codemod CLI.

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- [#4329](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4329)
  [`8dd80245bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8dd80245bb) - Remove
  unnecessary code for IE11.

## 0.6.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#3289](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3289)
  [`ebcb467688`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebcb467688) - Add a new
  prop `autoFocus` to allow consumers to control whether the Popup takes focus when opened

## 0.4.3

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 0.4.2

### Patch Changes

- [#2430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2430)
  [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all
  packages that are used by confluence that have a broken es2019 dist

## 0.4.1

### Patch Changes

- [#2186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2186)
  [`f4d4de67e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4d4de67e4) - Prevent
  closing of popup when clicked element (which is inside content) is removed from the DOM

## 0.4.0

### Minor Changes

- [#2060](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2060)
  [`ead13374cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ead13374cf) -
  **BREAKING:** Removes `tag` prop and unneeded wrapping element around the trigger.

## 0.3.5

### Patch Changes

- [patch][a12ea387f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/a12ea387f1):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):

- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [1e7e54c20e](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7e54c20e):
  - @atlaskit/popper@3.1.12
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/menu@0.4.1

## 0.3.4

### Patch Changes

- Updated dependencies
  [7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):
- Updated dependencies
  [603413f530](https://bitbucket.org/atlassian/atlassian-frontend/commits/603413f530):
- Updated dependencies
  [6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):
- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies
  [e4dde0ad13](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dde0ad13):
- Updated dependencies
  [41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [971e294b1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/971e294b1e):
- Updated dependencies
  [684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [286770886d](https://bitbucket.org/atlassian/atlassian-frontend/commits/286770886d):
- Updated dependencies
  [2c1b78027c](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c1b78027c):
- Updated dependencies
  [fb3ca3a3b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb3ca3a3b2):
  - @atlaskit/menu@0.4.0
  - @atlaskit/portal@3.1.7
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 0.3.3

### Patch Changes

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [7a6e5f6e3d](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6e5f6e3d):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/menu@0.3.0
  - @atlaskit/button@13.3.9
  - @atlaskit/radio@3.1.11
  - @atlaskit/spinner@12.1.6

## 0.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
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

  Adds tag prop, use this for changing (or removing with a `Fragment`) the wrapping element around
  the trigger.- Updated dependencies
  [671de2d063](https://bitbucket.org/atlassian/atlassian-frontend/commits/671de2d063):

- Updated dependencies
  [77ffd08ea0](https://bitbucket.org/atlassian/atlassian-frontend/commits/77ffd08ea0):
- Updated dependencies
  [0ae6ce5d46](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae6ce5d46):
  - @atlaskit/popper@3.1.10
  - @atlaskit/menu@0.2.5

## 0.3.0

### Minor Changes

- [minor][0946fdd319](https://bitbucket.org/atlassian/atlassian-frontend/commits/0946fdd319):
  - **BREAKING** - Changes `content` prop to expect render props instead of a component. This is
    primarily to stop your components remounting when not having a stable reference.

## 0.2.7

### Patch Changes

- [patch][eb1ecc219a](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb1ecc219a):

  Fix issue where stopping event propagation would still close a popup

## 0.2.6

### Patch Changes

- [patch][f534973bd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/f534973bd4):

  Fix a bug causing the page to scroll to top when a popup is opened- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/popper@3.1.9
  - @atlaskit/portal@3.1.4
  - @atlaskit/radio@3.1.6
  - @atlaskit/spinner@12.1.3

## 0.2.5

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/radio@3.1.5
  - @atlaskit/popper@3.1.8

## 0.2.4

### Patch Changes

- [patch][d0415ae306](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0415ae306):

  Popup now uses the correct e200 shadow

## 0.2.3

### Patch Changes

- [patch][542080be8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/542080be8a):

  Bumped react-popper and resolved infinite looping refs issue, and fixed close-on-outside-click for
  @atlaskit/popup-
  [patch][995c1f6fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/995c1f6fd6):

  Popup close on outside click no longer fires when clicking on content within the popup that
  re-renders

## 0.2.2

### Patch Changes

- [patch][3cad6b0118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cad6b0118):

  Exposed offset prop for popper allowing positioning of popups relative to the trigger. Added
  example for double pop-up pattern

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

  Introduce new package for the lightweight inline-dialog to be used in @atlaskit/app-navigation.
  The package will stay internal for now until more hardening is done, but releasing first minor to
  unblock navigation work.
