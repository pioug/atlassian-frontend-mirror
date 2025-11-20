# @atlaskit/modal-dialog

## 14.7.1

### Patch Changes

- Updated dependencies

## 14.7.0

### Minor Changes

- [`05dd9b7db95b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05dd9b7db95b7) -
  Modal dialog now registers with the open layer observer using the `useNotifyLayerObserver` hook.

  This change was previously behind the feature flag `platform-dst-open-layer-observer-layer-type`,
  which has now been removed.

### Patch Changes

- Updated dependencies

## 14.6.2

### Patch Changes

- Updated dependencies

## 14.6.1

### Patch Changes

- Updated dependencies

## 14.6.0

### Minor Changes

- [`8a71ce992f8c8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8a71ce992f8c8) -
  Modal dialog now registers with the open layer observer using the `useNotifyLayerObserver` hook.
  This is behind the `platform-dst-open-layer-observer-layer-type` feature flag.

### Patch Changes

- Updated dependencies

## 14.5.3

### Patch Changes

- Updated dependencies

## 14.5.2

### Patch Changes

- Updated dependencies

## 14.5.1

### Patch Changes

- Updated dependencies

## 14.5.0

### Minor Changes

- [`bab28f9576a96`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bab28f9576a96) -
  Add `onBlur` handler to the close button export.

## 14.4.2

### Patch Changes

- [`437668dfbdec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/437668dfbdec9) -
  Add explicit types to a number of DST components
- Updated dependencies

## 14.4.1

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 14.4.0

### Minor Changes

- [`76a0ea5849a69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76a0ea5849a69) -
  Increases the specificity on the top inset positioning the Modal Dialog to be !important to reduce
  the impact of Compiled consumption issues in DC and Ecosystem.

### Patch Changes

- Updated dependencies

## 14.3.13

### Patch Changes

- [`96f58298f6919`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96f58298f6919) -
  Converts `${gutter}px` to a hardcoded '60px' to avoid a Compiled bug.

## 14.3.12

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 14.3.11

### Patch Changes

- [`71adf38dec5b2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71adf38dec5b2) -
  Increases the specificity of the insetBlockStart whitespace for the Modal Dialog to lessen the
  impact of Compiled consumption issues in DC and Ecosystem.
- Updated dependencies

## 14.3.10

### Patch Changes

- Updated dependencies

## 14.3.9

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 14.3.8

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 14.3.7

### Patch Changes

- [`3b5b4a919aaaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3b5b4a919aaaf) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 14.3.6

### Patch Changes

- Updated dependencies

## 14.3.5

### Patch Changes

- Updated dependencies

## 14.3.4

### Patch Changes

- Updated dependencies

## 14.3.3

### Patch Changes

- [#193214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193214)
  [`c661806a65543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c661806a65543) -
  Internal changes to how border radius and border width values are applied. No visual change.
- Updated dependencies

## 14.3.2

### Patch Changes

- Updated dependencies

## 14.3.1

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 14.3.0

### Minor Changes

- [#173162](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173162)
  [`a3b23b79f4d68`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a3b23b79f4d68) -
  Adds a new `FullScreenModalDialog` component which is exposed behind the `/full-screen`
  entrypoint.

### Patch Changes

- Updated dependencies

## 14.2.12

### Patch Changes

- [#186153](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186153)
  [`4389a7b035d36`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4389a7b035d36) -
  Add testid for modal-dialog to confirm a TTVC blindspot is caused by modal dialog

## 14.2.11

### Patch Changes

- Updated dependencies

## 14.2.10

### Patch Changes

- [#182316](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182316)
  [`3e3e11916be69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3e3e11916be69) -
  Migrated the internal usage of @atlaskit/focus-ring which uses Emotion for styling, to the new
  version built with Compiled CSS-in-JS.
- Updated dependencies

## 14.2.9

### Patch Changes

- Updated dependencies

## 14.2.8

### Patch Changes

- Updated dependencies

## 14.2.7

### Patch Changes

- Updated dependencies

## 14.2.6

### Patch Changes

- Updated dependencies

## 14.2.5

### Patch Changes

- Updated dependencies

## 14.2.4

### Patch Changes

- [#164146](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164146)
  [`cb9fe0058ed87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb9fe0058ed87) -
  Updates package.json direct dependencies to align with actual usage.

## 14.2.3

### Patch Changes

- [#160530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160530)
  [`3d97095c489a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d97095c489a5) -
  Internal change to align styling solutions.
- Updated dependencies

## 14.2.2

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 14.2.1

### Patch Changes

- [#155827](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155827)
  [`f6f4f5a8a8ae8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f6f4f5a8a8ae8) -
  Cleans up the `platform_design_system_motion_on_finish_fix` feature gate.
- Updated dependencies

## 14.2.0

### Minor Changes

- [#154745](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154745)
  [`7618d9837e247`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7618d9837e247) -
  Tidy up design-system-closed-all-when-click-outside and sibling-dropdown-close-issue to provide
  better keyboard navigation.

## 14.1.4

### Patch Changes

- Updated dependencies

## 14.1.3

### Patch Changes

- [#138405](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138405)
  [`7e6b125029348`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e6b125029348) -
  Increased the specificity of the `height` CSS property in desktop view to prevent modal dialogs
  from incorrectly stretching to full height.

## 14.1.2

### Patch Changes

- [#136563](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136563)
  [`ce6e88fc62ca9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ce6e88fc62ca9) -
  Update dependencies

## 14.1.1

### Patch Changes

- Updated dependencies

## 14.1.0

### Minor Changes

- [#134997](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134997)
  [`1c7642dd77422`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1c7642dd77422) -
  Increased the specificity of the `width` CSS property in desktop view to prevent full-width modal
  dialogs. This was caused by an odd CSS ordering issue in Compiled.

### Patch Changes

- Updated dependencies

## 14.0.4

### Patch Changes

- [#133231](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/133231)
  [`82b4213bf8e20`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/82b4213bf8e20) -
  Update the DOM order of the modal header when using the `hasCloseButton` prop to give maximal
  information to users of assistive technology.

## 14.0.3

### Patch Changes

- [#126072](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126072)
  [`bb86d48c26f65`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bb86d48c26f65) -
  Checks for undefined children in `ModalTransition` to prevent potential runtime errors with React
  17
- Updated dependencies

## 14.0.2

### Patch Changes

- Updated dependencies

## 14.0.1

### Patch Changes

- Updated dependencies

## 14.0.0

### Major Changes

- [#128593](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128593)
  [`19d6172ffdfe9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/19d6172ffdfe9) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/modal-dialog`, you will need to ensure that your bundler is
  configured to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understandhow to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

### Patch Changes

- Updated dependencies

## 13.4.0

### Minor Changes

- [#129320](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129320)
  [`1993bb92c16b6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1993bb92c16b6) -
  [ux] Add legacy AUI modal to focus lock allowlist by default

## 13.3.0

### Minor Changes

- [#129312](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129312)
  [`26ac9f1e06b2e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/26ac9f1e06b2e) -
  Modal body now explicitly sets the font style to use typography tokens, instead of relying on the
  CSS reset to be present. This change is behind the feature flag
  `platform_ads_explicit_font_styles`.

## 13.2.0

### Minor Changes

- [#127054](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127054)
  [`fb709895d8d5c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb709895d8d5c) -
  [ux] Adds a new `hasCloseButton` prop to `ModalHeader` to add a close button. This uses the
  exported `CloseButton` internally.

  This is done to improve the accessibility of all modal dialogs and ensure that users of assistive
  technology get full context of the modal and so that pointer users have a more clear way to close
  the modal.

## 13.1.1

### Patch Changes

- [#127022](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127022)
  [`6e22b57d6bf75`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e22b57d6bf75) -
  Update dependencies and remove old codemods.
- Updated dependencies

## 13.1.0

### Minor Changes

- [#126435](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/126435)
  [`2d2f8bd9b056b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2d2f8bd9b056b) -
  Release dedicated close button export. This can be used to add a close button to your modal
  header.

## 13.0.4

### Patch Changes

- Updated dependencies

## 13.0.3

### Patch Changes

- Updated dependencies

## 13.0.2

### Patch Changes

- [#116010](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/116010)
  [`1b66beb10e972`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b66beb10e972) -
  Update dependencies.
- [#118470](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118470)
  [`687094c7a76b3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/687094c7a76b3) -
  Internal refactoring to reduce singleton exports.

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

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

## 12.20.8

### Patch Changes

- [#116009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116009)
  [`b6feda4124cd2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b6feda4124cd2) -
  Remove code path for now obsolete chrome plugin.

## 12.20.7

### Patch Changes

- Updated dependencies

## 12.20.6

### Patch Changes

- Updated dependencies

## 12.20.5

### Patch Changes

- [#113871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113871)
  [`13ca102123e88`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/13ca102123e88) -
  Update dependencies.

## 12.20.4

### Patch Changes

- [#113859](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113859)
  [`c14cf08cfe2e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c14cf08cfe2e9) -
  Remove old codemods.

## 12.20.3

### Patch Changes

- Updated dependencies

## 12.20.2

### Patch Changes

- Updated dependencies

## 12.20.1

### Patch Changes

- Updated dependencies

## 12.20.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 12.19.3

### Patch Changes

- [#107054](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107054)
  [`046508790857d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/046508790857d) -
  Add appearance to modal title for better AT support

## 12.19.2

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 12.19.1

### Patch Changes

- Updated dependencies

## 12.19.0

### Minor Changes

- [#100038](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100038)
  [`f4fe1a42a5809`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f4fe1a42a5809) -
  Move the icon in a modal title (when present) out of the H1 tag

## 12.18.5

### Patch Changes

- Updated dependencies

## 12.18.4

### Patch Changes

- [#175556](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175556)
  [`1011dce3bcb2d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1011dce3bcb2d) -
  [ux] This change allowlists the AUI dialog for @atlaskit/modal-dialog's focus management and is
  implemented behind a feature flag. If successful, it will be available in later releases.

## 12.18.3

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 12.18.2

### Patch Changes

- Updated dependencies

## 12.18.1

### Patch Changes

- [#171994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171994)
  [`be58e4bb2e387`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be58e4bb2e387) -
  Migrating usages of UNSAFE types and entrypoints that have been renamed in `@atlaskit/icon` and
  `@atlaskit/icon-lab`.
- Updated dependencies

## 12.18.0

### Minor Changes

- [#170669](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170669)
  [`cc302b83d5934`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc302b83d5934) -
  Fixes the top and bottom borders which indicate scrollability for modal content on React 18 by
  rewriting internal hooks.

## 12.17.14

### Patch Changes

- Updated dependencies

## 12.17.13

### Patch Changes

- [#167181](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167181)
  [`5bc9dc0796474`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5bc9dc0796474) -
  Remove `react-focus-lock-next` dependency

## 12.17.12

### Patch Changes

- [#166087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166087)
  [`3ab7d7da348ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ab7d7da348ab) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 12.17.11

### Patch Changes

- Updated dependencies

## 12.17.10

### Patch Changes

- [#161638](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161638)
  [`d2e5e5ce0053d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2e5e5ce0053d) -
  Use new API of layering without UNSAFE prefix

## 12.17.9

### Patch Changes

- Updated dependencies

## 12.17.8

### Patch Changes

- Updated dependencies

## 12.17.7

### Patch Changes

- Updated dependencies

## 12.17.6

### Patch Changes

- Updated dependencies

## 12.17.5

### Patch Changes

- [#146685](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146685)
  [`1cb9d5ae0361d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1cb9d5ae0361d) -
  [ux] Reduce spacing between body header, body and footer content.

## 12.17.4

### Patch Changes

- Updated dependencies

## 12.17.3

### Patch Changes

- [#148281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148281)
  [`3c4de48168ffe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c4de48168ffe) -
  Update the import path of `useId*` from `@atlaskit/ds-lib`
- Updated dependencies

## 12.17.2

### Patch Changes

- Updated dependencies

## 12.17.1

### Patch Changes

- Updated dependencies

## 12.17.0

### Minor Changes

- [#144047](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144047)
  [`de70c65e3e5ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de70c65e3e5ff) -
  The Chrome bug workaround shipped in `12.16.0` behind a feature flag is now turned on for everyone
  and is no longer behind a feature flag.

## 12.16.0

### Minor Changes

- [#141279](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141279)
  [`a38f3af4bfc79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a38f3af4bfc79) -
  [ux] Adding a workaround for a Chrome bug where drag and drop cannot occur in an element
  positioned on top of an `<iframe>` on a different origin. The workaround is being added behind a
  feature flag.

## 12.15.7

### Patch Changes

- [#140090](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140090)
  [`2f4fd6db3e451`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f4fd6db3e451) -
  Removes unused devDep react-beautiful-dnd

## 12.15.6

### Patch Changes

- [#138585](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138585)
  [`b72c2c7f9a2fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b72c2c7f9a2fd) -
  Support to close all layers when clicking outside under feature flag

## 12.15.5

### Patch Changes

- [#137443](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137443)
  [`467a08d727c07`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/467a08d727c07) -
  Updated dependencies

## 12.15.4

### Patch Changes

- [#136611](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/136611)
  [`9755fb019113f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9755fb019113f) -
  Clean up emotion Globals usage

## 12.15.3

### Patch Changes

- [#134135](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134135)
  [`6597900cdd5be`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6597900cdd5be) -
  We are testing an internal change to use an ID generator compatible with both React 16 and
  React 18. If these changes are successful, it will be rolled out in a later release.

## 12.15.2

### Patch Changes

- [#130061](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/130061)
  [`b2c47a625a6bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2c47a625a6bb) -
  Fixed bug where component could cause infinite re-render

## 12.15.1

### Patch Changes

- Updated dependencies

## 12.15.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 12.14.10

### Patch Changes

- Updated dependencies

## 12.14.9

### Patch Changes

- Updated dependencies

## 12.14.8

### Patch Changes

- [#123484](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123484)
  [`e241c04ab92d5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e241c04ab92d5) -
  Remove abandoned feature flag usage

## 12.14.7

### Patch Changes

- [#122722](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122722)
  [`512798d699bd1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/512798d699bd1) -
  GA layering in modal-dialog to support multiple layers

## 12.14.6

### Patch Changes

- [#122769](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122769)
  [`e5aebb55bcafc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e5aebb55bcafc) -
  [ux] This version removes `platform.design-system-team.multiple-modal-inappropriate-focus_z5u4j`
  feature flag. Now focus returns back to trigger elements upon closing nested modals.

## 12.14.5

### Patch Changes

- Updated dependencies

## 12.14.4

### Patch Changes

- Updated dependencies

## 12.14.3

### Patch Changes

- Updated dependencies

## 12.14.2

### Patch Changes

- [#114764](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114764)
  [`ae20dac6e31c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ae20dac6e31c4) -
  Bump packages to use react-beautiful-dnd@12.2.0

## 12.14.1

### Patch Changes

- Updated dependencies

## 12.14.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 12.13.5

### Patch Changes

- Updated dependencies

## 12.13.4

### Patch Changes

- [#99952](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99952)
  [`1e7e09d75d5c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1e7e09d75d5c) -
  Support to close popup corrrectly when clicking iframe using layering under feature flag
- Updated dependencies

## 12.13.3

### Patch Changes

- [#100067](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100067)
  [`0601616da694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0601616da694) -
  Internal changes to resolve an issue where global style overrides could break alignment between
  the icon and title.

## 12.13.2

### Patch Changes

- Updated dependencies

## 12.13.1

### Patch Changes

- Updated dependencies

## 12.13.0

### Minor Changes

- [#93686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93686)
  [`acf6d58fc241`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/acf6d58fc241) -
  Add support for React 18 in non-strict mode.

### Patch Changes

- Updated dependencies

## 12.12.0

### Minor Changes

- [#89943](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89943)
  [`9e8e7fd1a601`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e8e7fd1a601) -
  [ux] Internal changes to typography, small visual change to modal title.

## 12.11.1

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 12.11.0

### Minor Changes

- [#82087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82087)
  [`aa45bc0045bb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aa45bc0045bb) -
  [ux] This change introduces `focusLockAllowlist` prop. It allows to pass callback function to
  specify nodes which focus lock should ignore.

## 12.10.10

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 12.10.9

### Patch Changes

- Updated dependencies

## 12.10.8

### Patch Changes

- Updated dependencies

## 12.10.7

### Patch Changes

- Updated dependencies

## 12.10.6

### Patch Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130)
  [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) -
  Update new button text color fallback for default theme (non-token) to match that of old button
  current text color

## 12.10.5

### Patch Changes

- Updated dependencies

## 12.10.4

### Patch Changes

- [#68278](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68278)
  [`291b54998410`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/291b54998410) -
  Reset iframe to have auto pointer-events in modal under feature flag

## 12.10.3

### Patch Changes

- [#60920](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60920)
  [`a77a99360fa2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a77a99360fa2) -
  Revert previous modal gutter change.

## 12.10.2

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 12.10.1

### Patch Changes

- [#58698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58698)
  [`222c15fb9a38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/222c15fb9a38) -
  Modal gutter is now 64px instead of 60px. This means the modal now displays slightly lower than
  before and will be slightly more inset when at max width/height.

## 12.10.0

### Minor Changes

- [#57627](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57627)
  [`bef9748d9db2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bef9748d9db2) -
  [ux] We are testing default return focus on modal close behind a feature flag. This change returns
  focus to the element which triggered the modal to open. If this fix is successful, it will be
  available in a later release.

## 12.9.1

### Patch Changes

- [#43918](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43918)
  [`d100ca42f46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d100ca42f46) - Push
  model consumption configuration done for these packages

## 12.9.0

### Minor Changes

- [#43674](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43674)
  [`4061f5b29f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4061f5b29f8) - [ux]
  shouldReturnFocus now can accept ref as a value to return focus to a specified element on modal
  close.

## 12.8.5

### Patch Changes

- Updated dependencies

## 12.8.4

### Patch Changes

- Updated dependencies

## 12.8.3

### Patch Changes

- [#41628](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41628)
  [`b05664f7aba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b05664f7aba) - Use
  feature flag to toggle if we enable UNSAFE_LAYERING

## 12.8.2

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 12.8.1

### Patch Changes

- [#40647](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40647)
  [`0de92f17021`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0de92f17021) - Bump
  react-focus-lock to latest version

## 12.8.0

### Minor Changes

- [#39425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39425)
  [`f0df9a3b6e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f0df9a3b6e7) -
  [ED-19408] Add new prop to modal shouldReturnFocus - shouldReturnFocus is used to control what
  happens when the user exits focus lock mode. If true, focus will be returned to the element that
  had focus before focus lock was activated. If false, focus remains where it was when the FocusLock
  was deactivated

## 12.7.1

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 12.7.0

### Minor Changes

- [#39726](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39726)
  [`f355884a4aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f355884a4aa) - [ux]
  Support to press escape key and only close the top layer

### Patch Changes

- Updated dependencies

## 12.6.10

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787)
  [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal
  changes to use space tokens. There is no expected visual or behaviour change.

## 12.6.9

### Patch Changes

- [#38948](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38948)
  [`c8d28bd7519`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8d28bd7519) - Adds
  role of region to modal dialog body when scrollable

## 12.6.8

### Patch Changes

- [#37789](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37789)
  [`d6f63fa1abc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f63fa1abc) - Adds
  support for surface detection when using design tokens. Enabling children to be styled with the
  Modal’s surface color when using the `utility.elevation.surface.current` design token.
- Updated dependencies

## 12.6.7

### Patch Changes

- [#39169](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39169)
  [`d2b6377be3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b6377be3d) - Add some
  basic JSDoc for internal components, add tokens.

## 12.6.6

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 12.6.5

### Patch Changes

- [#36744](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36744)
  [`c2484be748e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2484be748e) - [ux]
  DSP-11269: hard coded the warning icon to improve color contrast

## 12.6.4

### Patch Changes

- [#37066](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37066)
  [`c673c7246cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c673c7246cf) - Internal
  change to improve how media queries are applied. There is no expected behaviour change.

## 12.6.3

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 12.6.2

### Patch Changes

- [#34811](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34811)
  [`abf69e9a4f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abf69e9a4f6) - Removes
  usage of deprecated theme mixins in favor of static token / color usage.

## 12.6.1

### Patch Changes

- [#35074](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35074)
  [`b6b02e57520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6b02e57520) - Restore
  support for foreground modal

## 12.6.0

### Minor Changes

- [#34353](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34353)
  [`26388cfdd23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26388cfdd23) - Adds
  `label` prop for users of assistive technology to receive more context when using the modal.

## 12.5.7

### Patch Changes

- [#34427](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34427)
  [`7e018144c35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e018144c35) - [ux] Add
  aria-label to scrollable ModalBody to communicate to AT users why ModalBody is focused.

## 12.5.6

### Patch Changes

- [#34297](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34297)
  [`fd5c7f6ca6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5c7f6ca6a) - Fixes an
  issue where the focus moved inappropriately when closing a modal with multiple modals open.

## 12.5.5

### Patch Changes

- [#34160](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34160)
  [`ba48a3a0fec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba48a3a0fec) - Remove
  redundant language from default icon labels for ModalTitle.

## 12.5.4

### Patch Changes

- [#34170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34170)
  [`e3eff9117fe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3eff9117fe) - Update
  examples to use CTAs with sufficient contrast.

## 12.5.3

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051)
  [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 12.5.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 12.5.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 12.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 12.4.13

### Patch Changes

- [#32734](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32734)
  [`7f53352e047`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f53352e047) - Updates
  the `@types/react-beautiful-dnd` devDependency

## 12.4.12

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`4ba10567310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ba10567310) - Internal
  changes.

## 12.4.11

### Patch Changes

- [#30125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30125)
  [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) -
  Introduce shape tokens to some packages.

## 12.4.10

### Patch Changes

- Updated dependencies

## 12.4.9

### Patch Changes

- [#29725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29725)
  [`63c2f0b3f96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63c2f0b3f96) - Internal
  changes to use spacing tokens. There is no expected behaviour or visual change.

## 12.4.8

### Patch Changes

- Updated dependencies

## 12.4.7

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 12.4.6

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 12.4.5

### Patch Changes

- [#28064](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28064)
  [`b0f6dd0bc35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f6dd0bc35) - Updated
  to use typography tokens. There is no expected behaviour or visual change.

## 12.4.4

### Patch Changes

- Updated dependencies

## 12.4.3

### Patch Changes

- Updated dependencies

## 12.4.2

### Patch Changes

- Updated dependencies

## 12.4.1

### Patch Changes

- [#26408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26408)
  [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal
  changes to include spacing tokens in component implementations.

## 12.4.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`f3ffcf1a783`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3ffcf1a783) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 12.3.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 12.3.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`c44f3f5f973`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c44f3f5f973) - Modal
  Dialog’s focus lock now allows focus to reach elements outside the modal if they contain the
  data-atlas-extension attribute, such as a browser extension that renders in-browser.

### Patch Changes

- Updated dependencies

## 12.2.15

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 12.2.14

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`454ec1bbf07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/454ec1bbf07) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 12.2.13

### Patch Changes

- [#22775](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22775)
  [`1c3948738f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c3948738f9) - Adjust
  the styles for an internal positioning element to constrain the height for ModalBody and restore
  support for custom scrolling regions"

## 12.2.12

### Patch Changes

- [#22758](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22758)
  [`b72e12b97ac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b72e12b97ac) - [ux]
  Fixed a regression which prevented clicks on the blanket from closing modal dialogs with
  `shouldScrollInViewport`.

## 12.2.11

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 12.2.10

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`e4b612d1c48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4b612d1c48) - Internal
  migration to bind-event-listener for safer DOM Event cleanup
- [`347fd703ce0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/347fd703ce0) -
  Internally shifting to using bind-event-listener for events added in effects
- [`07ab2748b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07ab2748b62) - [ux] -
  Changes the position of icon in ModalTitle having an appearance prop to be top aligned instead of
  center. This only affects titles that where the title wraps into multiple lines.
- Updated dependencies

## 12.2.9

### Patch Changes

- Updated dependencies

## 12.2.8

### Patch Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`0d1c80fe00d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d1c80fe00d) - [ux] The
  width of the modal dialog now respect the custom value of the `width` prop.

## 12.2.7

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 12.2.6

### Patch Changes

- Updated dependencies

## 12.2.5

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`dcd92130cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcd92130cc4) - Migrate
  deleted background accent tokens to replacements
- Updated dependencies

## 12.2.4

### Patch Changes

- Updated dependencies

## 12.2.3

### Patch Changes

- Updated dependencies

## 12.2.2

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Bump
  raf-schd to latest (4.0.3), including better TS typings.
- Updated dependencies

## 12.2.1

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`2d60dd3116d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d60dd3116d) - [ux]
  Modal dialogs which contain no focusable children will now lock focus to the modal container. The
  container will have a focus ring, so some VR tests may need to be regenerated.

### Patch Changes

- [`3fced6aa641`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fced6aa641) - Bumped
  `react-focus-lock` to version `^2.2.1`.
- [`a8c55e479e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8c55e479e8) - Removes
  unused dependency on emotion-styled
- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 12.1.1

### Patch Changes

- [#16335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16335)
  [`2b2290121eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b2290121eb) - Raised
  the minimum version carat range of focus ring to latest.

## 12.1.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`993eb469fcb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/993eb469fcb) -
  Instrumented `@atlaskit/modal-dialog` with the new theming package, `@atlaskit/tokens`. Tokens
  will be visible only in applications configured to use the new Tokens API (currently in
  alpha).These changes are intended to be interoperable with the legacy theme implementation. Legacy
  dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 12.0.3

### Patch Changes

- Updated dependencies

## 12.0.2

### Patch Changes

- Updated dependencies

## 12.0.1

### Patch Changes

- Updated dependencies

## 12.0.0

### Major Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`07ad26948a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07ad26948a1) - In this
  version we made modal dialog dramatically faster and lighter with a new composable API. This is a
  large change and we have provided a codemod to help you upgrade. Once you have run the codemod
  there may be manual change required so read below for all the changes in this release.

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed**

  ```bash
  yarn upgrade @atlaskit/modal-dialog@^12.0.0
  ```

  Once upgraded, use `@atlaskit/codemod-cli`:

  ```bash
  npx @atlaskit/codemod-cli --parser {tsx|babylon} --extensions ts,tsx,js [relativePath]
  ```

  The CLI will show a list of components and versions so select `@atlaskit/modal-dialog@^12.0.0` and
  you will automatically be upgraded. If your usage of `@atlaskit/modal-dialog` cannot be upgraded a
  comment will be left that a manual change is required.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to the
  [documentation](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more
  details on the codemod CLI.

  ### Visual changes

  The primary button in the footer is now on the right. This has changed from being on the left to
  match the [design documentation](https://atlassian.design/components/modal-dialog/usage).

  The codemod will automatically reverse the order of your actions for this to happen. You could
  previously achieve this behaviour by adding an `appearance` key to your actions. The codemod will
  detect this and not reverse the array in this case.

  ### Composable API

  The old version of modal dialog had three props that mapped into components.
  - `heading` was the text for the header.
  - `children` was the React node that ended up in the modal body.
  - `actions` was an array of objects that mapped into buttons in the footer.

  The new composable API exposes these components so that you can use them directly as a child of
  modal dialog. This creates a clear parallel between what is given as children and what the modal
  dialog renders. It also allows you to use any valid React node as a child of modal dialog.

  ```
  // Before
  import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

  ...

  <ModalTransition>
    {isOpen && (
      <Modal
        onClose={close}
        heading="Modal Title"
        actions={[
          { text: 'Secondary Action', onClick: secondaryAction },
          { text: 'Close', onClick: close },
        ]}
      >
        <Lorem count={2} />
      </Modal>
    )}
  </ModalTransition>

  // After
  import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
  } from '@atlaskit/modal-dialog';
  import Button from '@atlaskit/button/standard-button';

  ...

  <ModalTransition>
    {isOpen && (
      <Modal onClose={close}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Lorem count={2} />
        </ModalBody>
        <ModalFooter>
          <Button appearance="subtle" onClick={secondaryAction}>
            Secondary Action
          </Button>
          <Button appearance="primary" autoFocus onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    )}
  </ModalTransition>
  ```

  #### Children

  The original children need to be wrapped in a `ModalBody`.

  ```
  // Before
  <Modal>
    <Lorem count={2} />
  </Modal>

  // After
  <Modal>
    <ModalBody>
      <Lorem count={2} />
    </ModalBody>
  </Modal>
  ```

  #### Heading

  The `heading` prop turns into a `ModalHeader` and `ModalTitle`.

  ```
  // Before
  <Modal heading="Modal Title">
    <Lorem count={2} />
  </Modal>

  // After
  <Modal>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <Lorem count={2} />
    </ModalBody>
  </Modal>
  ```

  #### Actions

  The `actions` prop turns into `Button`'s in a `ModalFooter`.

  ```
  // Before
  <Modal
    actions={[
      { text: 'Secondary Action', onClick: secondaryAction },
      { text: 'Close', onClick: close },
    ]}
    heading="Modal Title"
  >
    <Lorem count={2} />
  </Modal>

  // After
  <Modal>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <Lorem count={2} />
    </ModalBody>
    <ModalFooter>
      <Button appearance="subtle" onClick={secondaryAction}>
        Secondary Action
      </Button>
      <Button appearance="primary" autoFocus onClick={close}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
  ```

  Previously in the examples the primary button was on the left, we’ve updated the documentation to
  match our design documentation so that the primary button is on the right. You could previously
  achieve this behaviour by adding an `appearance` key to your actions. The codemod will reverse the
  order of your actions if you have not set the `appearance` in the actions.

  ### Components prop

  The `components` prop has been entirely replaced with the composable API. The philosophy of
  creating a custom component that receive modal's props has been replaced with custom components
  where the user can define their own props.

  #### Container

  To replace using the `Container` prop you can wrap `Modal`'s children in the container component.
  Note that unless you are using a `form` you will need to add the style `all: inherit;` to ensure
  scrolling works.

  ```
  // Before
  <Modal
    components={{
      Container: (props) => (
        <form {...props} onSubmit={onSubmit}>
          {props.children}
        </form>
      ),
    }}
  >
    {children}
  </Modal>

  // After
  <Modal>
    <form onSubmit={onSubmit}>
      {children}
    </form>
  </Modal>
  ```

  #### Header

  To replace using the `Header` prop you can use your custom header as the first child.

  ```
  // Before
  <Modal
    components={{
      Header: CustomHeader,
    }}
  >
    {children}
  </Modal>

  // After
  <Modal>
    <CustomHeader />
    {children}
  </Modal>
  ```

  If you are creating a custom header you should call the new hook `useModal` to get the title id so
  the content and the title can be linked. You can also access the `onClose` function this way.

  ```
  import { useModal } from '@atlaskit/modal-dialog';

  const CustomHeader = () => {
    const { onClose, titleId } = useModal();
    return (
      <div css={headerStyles}>
        <h1 css={headingStyles} id={titleId}>
          Custom modal header
        </h1>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    );
  };
  ```

  If you are doing something simple like adding a button you can continue to use `ModalHeader`.

  ```
  <ModalHeader>
    <ModalTitle>Custom modal header</ModalTitle>
    <Button appearance="link" onClick={closeModal}>
      Close
    </Button>
  </ModalHeader>
  ```

  #### Footer and body

  Similar to `Header`, if you were using the `Footer` or `Body` prop, you can replace `ModalFooter`
  and `ModalBody` with any valid React node. `ModalFooter` and `ModalBody` also accept any valid
  React node as children. `useModal` works in any of `Modal`'s children if you wish to use it.

  ### Scroll behaviour

  The `scrollBehavior` prop has changed from strings 'inside', 'inside-wide' and 'outside' to a
  boolean `shouldScrollInViewport`. 'inside' and 'inside-wide' have consolidated to be
  `shouldScrollInViewport={false}` and 'outside' is `shouldScrollInViewport={true}`.

  ### Appearance

  The `appearance` prop has been removed from `Modal` and is now set on `ModalTitle` and the primary
  `Button`.

  ```
  // Before
  <ModalTransition>
    {isOpen && (
      <Modal
        appearance="danger"
        onClose={close}
        heading="Modal Title"
        actions={[
          { text: 'Secondary Action', onClick: secondaryAction },
          { text: 'Close', onClick: close },
        ]}
      >
        <Lorem count={2} />
      </Modal>
    )}
  </ModalTransition>

  // After
  <ModalTransition>
    {isOpen && (
      <Modal onClose={close}>
        <ModalHeader>
          <ModalTitle appearance="danger">Modal Title</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Lorem count={2} />
        </ModalBody>
        <ModalFooter>
          <Button appearance="subtle" onClick={secondaryAction}>
            Secondary Action
          </Button>
          <Button appearance="danger" autoFocus onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    )}
  </ModalTransition>;
  ```

  ### isChromeless

  The `isChromeless` is no longer supported as you can any valid React node in `Modal` and choose
  not to use `ModalHeader`, `ModalBody` and `ModalFooter`. The only change to this behaviour is that
  there is no way to turn off the box shadow and border radius, which used to happen when
  `isChromeless={true}`. You only need to change your usage if `Modal`'s children set their own
  background and don’t have a border radius of 3 px. In this case set the border radius to 3px.

  ### Test IDs

  The mapping for test IDs have changed.

  Modal: `{testId}` -> `{testId}`

  Modal content: `{testId}-dialog-content` -> DOM node removed

  Modal header: `{testId}-dialog-content--header` -> `{testId}--header`

  Modal title: `{testId}-dialog-content--heading` -> `{testId}--title`

  Modal body: `{testId}-dialog-content--body` -> `{testId}--body`

  Modal footer: `{testId}-dialog-content--footer` -> `{testId}--footer`

  Scrollable body content: `{testId}-dialog-content--scrollable` -> `{testId}--scrollable`

  Blanket: `{testId}--blanket` -> `{testId}--blanket`

  Modal actions: `{testId}-dialog-content--action-{index}` -> Removed, can set on Button

  ### Miscallaneous changes
  - `ModalFooter` now uses `flex-end` instead of `space-between` to justify its contents.
  - Inner components `ModalFooter`, `ModalHeader` and `ModalBody` no longer accepts style prop. If
    you wish to modify the styles, you have to build your own component.
  - `ContainerComponentProps` and `ScrollBehavior` types are now removed with no replacements.
  - `(Header|Body|Footer|Title)ComponentProps` types are now aliased to
    `Modal(Header|Body|Footer|Title)Props`, however most props are not used anymore as state is
    shared via the `useModal` hook.

### Patch Changes

- [`1efbaebfbf3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1efbaebfbf3) - Fixes a
  bug in the appearance of the modal focus state which is now consistent with other elements in the
  Design System.
- Updated dependencies

## 11.7.4

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`adad0d75402`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adad0d75402) - Internal
  test fix.
- Updated dependencies

## 11.7.3

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`f75544b8b57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f75544b8b57) - [ux] As
  a part of DSP-895, a 0px margin was applied to button to fix a regression in Safari. This has been
  reverted as the 0px margin will be moved to css-reset instead. As a part of that same ticket, the
  specificity of the footer buttons in modal dialog was updated. This has also been reverted now
  that the 0px margin is being moved to css-reset.
- Updated dependencies

## 11.7.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 11.7.1

### Patch Changes

- Updated dependencies

## 11.7.0

### Minor Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`6679c172f59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6679c172f59) - Trap the
  virtual cursor within the modal for screen reader

### Patch Changes

- [`0f7fd3e7c0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f7fd3e7c0d) - FIX:
  content focus and keylines only applied when the target DOM node exists
- Updated dependencies

## 11.6.3

### Patch Changes

- [#12263](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12263)
  [`95f500da676`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95f500da676) - [ux]
  Fixes a bug introduced in 11.4.0 – CSS property `left` is put back to the styles of modal dialog
  container so it doesn't push out floated elements in the background.

## 11.6.2

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 11.6.1

### Patch Changes

- [#11407](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11407)
  [`e3a6469c8e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3a6469c8e5) - [ux]
  FIX: fixes a bug introduced in 11.5.0 – now modal dialog is correctly positioned when relative
  sizing is used as width

## 11.6.0

### Minor Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`e1dc82f2825`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1dc82f2825) - Fix
  Modal header and footer tags

### Patch Changes

- Updated dependencies

## 11.5.0

### Minor Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`c9cca93180b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9cca93180b) - [ux]
  Removes unnecessary dom nodes and refactors styles in modal dialog.

### Patch Changes

- [`e48c323dd75`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e48c323dd75) - [ux]
  Fixed `outside` scrolling offset positioning when multiple modals are open.
- [`78803694b8c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78803694b8c) - [ux]
  Fixes display of focus ring on modal dialog content – now only shown when triggered by keyboard.

## 11.4.1

### Patch Changes

- Updated dependencies

## 11.4.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`c0dbb6425f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0dbb6425f7) - [ux]
  Changed ModalDialog html tag from "div" to "section", changed ModalDialog heading from "h4" to
  "h1"
- [`7e3e3e16b55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e3e3e16b55) - Entry
  points are now defined using the declarative format.
- [`441b1eded91`](https://bitbucket.org/atlassian/atlassian-frontend/commits/441b1eded91) - [ux]
  Modal dialog no longer attaches keylines in its header/footer – it now shows and hides keylines in
  its body during scroll when the content overflows.
- [`96f56104518`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96f56104518) - Adds
  ability to pass a element ref to the `autoFocus` prop to specifically focus on an element during
  initial mount.
- [`6ebee3d941d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ebee3d941d) - Internal
  refactor converting to hooks.
- [`e100d801223`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e100d801223) - [ux]
  Modal dialog now uses @atlaskit/motion for its entering/exiting animations.
- [`8a22ca5357b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a22ca5357b) - Event
  handler types are now exposed in the primary and types entrypoints.

### Patch Changes

- [`8db8f3a22cb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8db8f3a22cb) - Modal
  dialog now uses css props for styling.
- [`022ec2307a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/022ec2307a9) - The
  `onClose` callback now correctly has its second argument types as an analytic event.
- [`d7d64aac39d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7d64aac39d) - Fixed
  `onStackChange` from firing on inital mount. It will now only fire after the initial mount and its
  stack position has changed.
- [`1195a2abbbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1195a2abbbf) - Modal
  dialog now uses new utility from ds-lib to merge refs.
- Updated dependencies

## 11.3.0

### Minor Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`0e0b2148d48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e0b2148d48) - Modal
  dialog now attaches data-testid to its header and footer.

### Patch Changes

- [`a9dc147612a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a9dc147612a) -
  [litemode] Internal nested modal components have been re-written as hooks.
- [`910c7744256`](https://bitbucket.org/atlassian/atlassian-frontend/commits/910c7744256) - Internal
  restructure of files and folders.
- Updated dependencies

## 11.2.9

### Patch Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`624d33651cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/624d33651cf) - Fix
  content remounts in version >= 11.1.3
- Updated dependencies

## 11.2.8

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- Updated dependencies

## 11.2.7

### Patch Changes

- [#8478](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8478)
  [`5af85edf960`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af85edf960) - Internal
  code style change of default exports

## 11.2.6

### Patch Changes

- [#7892](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7892)
  [`7490717bdd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7490717bdd4) - Fix
  overflow issue present in Safari 14.0.3

## 11.2.5

### Patch Changes

- [#7425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7425)
  [`d94d90714b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d94d90714b) - Modal will
  retain full-width at viewports < 320px. This makes it consistent with < 480px beahviour.

## 11.2.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 11.2.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 11.2.2

### Patch Changes

- Updated dependencies

## 11.2.1

### Patch Changes

- [#5164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5164)
  [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo
  analytics-next file restructure to allow external ts definitions to continue working

## 11.2.0

### Minor Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`9d5d1ab37f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d5d1ab37f) - Allow for
  non tinted blanket background

### Patch Changes

- [`c48024293c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c48024293c) - Fixed an
  issue when using `scrollBehavior="outside"` would cause Firefox to not allow scrolling of modal
- Updated dependencies

## 11.1.6

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 11.1.5

### Patch Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`8598d0bd13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8598d0bd13) - Remove
  unnecessary code and tests for IE11.
- [`6ac737558f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ac737558f) - Remove
  non-standard CSS property
  [-ms-high-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/-ms-high-contrast).
  The `-ms-high-contrast` CSS media feature is a Microsoft extension that describes whether the
  application is being displayed in high contrast mode, and with what color variation.
- Updated dependencies

## 11.1.4

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 11.1.3

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`c1b8d0e897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1b8d0e897) - You can
  now scroll using a touchscreen in the body of `modal-dialog` content

## 11.1.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 11.1.1

### Patch Changes

- [#4191](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4191)
  [`810f11aaab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/810f11aaab) - Custom
  body styles have been added back. They will be removed in the next major version - if you're
  customizing the body of the modal dialog please make sure to spread props onto your custom
  component.

## 11.1.0

### Minor Changes

- [#3954](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3954)
  [`727776fa32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/727776fa32) - Missing
  types for component overrides are now exposed - you can access them through the root entrypoint.

  ```js
  import {
  	BodyComponentProps,
  	TitleComponentProps,
  	ContainerComponentProps,
  	FooterComponentProps,
  	HeaderComponentProps,
  	ScrollBehavior,
  } from '@atlaskit/modal-dialog';
  ```

## 11.0.3

### Patch Changes

- [#3826](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3826)
  [`5b5e7b6323`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b5e7b6323) - The
  previous hotfix (https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3781) didn't fix
  the appearance override issue.

  This change will be re-introduced in a future major version, please follow this ticket for updates
  https://product-fabric.atlassian.net/browse/DST-660.

## 11.0.2

### Patch Changes

- [#3781](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3781)
  [`9796654bab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9796654bab) - The button
  sequence correction has been reverted as it was causing unintended regressions for some use cases.
  Affected versions include: @atlaskit/modal-dialog@11.0.1.

  This change will be re-introduced in a future major version, please follow this ticket for updates
  https://product-fabric.atlassian.net/browse/DST-660.

## 11.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`95261cf7b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95261cf7b0) - Fixed
  modal dialog focus issue
- [`3414523d6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3414523d6f) - Rearange
  buttons order to align with design guidelines
- [`30f8909177`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30f8909177) - fixed the
  layering between header, content, and footer
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 11.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 10.6.4

### Patch Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`5be257c6f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5be257c6f6) - Fix issue
  with the way that tabIndex was applied to dialog content. Now the check looks at whether the
  container is scrollable, rather than the shouldScroll prop.
- [`057d870973`](https://bitbucket.org/atlassian/atlassian-frontend/commits/057d870973) - Fix
  keyboard scrolling of modal dialog content

## 10.6.3

### Patch Changes

- [#2443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2443)
  [`fddc283495`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fddc283495) - Added
  aria-labelledby to dialog and point it to the real heading
- [`b2b0b94079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2b0b94079) - Reverts
  breaking test id change.

## 10.6.2

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 10.6.1

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 10.6.0

### Minor Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`98e93d93ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98e93d93ec) -
  ActionProps.text now accepts React.ReactNode instead of just string

### Patch Changes

- [`16ccd817d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/16ccd817d8) - Export
  types
- Updated dependencies

## 10.5.9

### Patch Changes

- Updated dependencies

## 10.5.8

### Patch Changes

- [#2012](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2012)
  [`53d09bdb5d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53d09bdb5d) - Reverts
  scrolling fix which introduced a layering regression.

## 10.5.7

### Patch Changes

- [patch][9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies
  [3a09573b4e](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a09573b4e):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies
  [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies
  [6d744d3ff1](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d744d3ff1):
- Updated dependencies
  [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/avatar@17.1.10
  - @atlaskit/inline-dialog@12.1.12
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/blanket@10.0.18
  - @atlaskit/form@7.2.1
  - @atlaskit/webdriver-runner@0.3.4

## 10.5.6

### Patch Changes

- [patch][f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):

  Added a new `ScrollBehavior` value `inside-wide` to support showing modals on pages with body
  wider than viewport width.-
  [patch][89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):

  FIX: `scrollBehavior: outside` Firefox scroll issue- Updated dependencies
  [603413f530](https://bitbucket.org/atlassian/atlassian-frontend/commits/603413f530):

- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
  - @atlaskit/portal@3.1.7
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 10.5.5

### Patch Changes

- [patch][4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

  Upgraded react-scrolllock package- Updated dependencies
  [294c05bcdf](https://bitbucket.org/atlassian/atlassian-frontend/commits/294c05bcdf):

- Updated dependencies
  [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/form@7.2.0
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/docs@8.5.0

## 10.5.4

### Patch Changes

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies
  [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/form@7.1.5
  - @atlaskit/inline-dialog@12.1.11
  - @atlaskit/select@11.0.9
  - @atlaskit/textfield@3.1.9

## 10.5.3

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/avatar@17.1.8
  - @atlaskit/button@13.3.8
  - @atlaskit/checkbox@10.1.9
  - @atlaskit/form@7.1.4
  - @atlaskit/inline-dialog@12.1.10
  - @atlaskit/select@11.0.8
  - @atlaskit/textfield@3.1.8

## 10.5.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/blanket@10.0.17
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/portal@3.1.6
  - @atlaskit/select@11.0.7
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1

## 10.5.1

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies
  [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/field-radio-group@7.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/form@7.1.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/inline-dialog@12.1.8
  - @atlaskit/portal@3.1.5
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5

## 10.5.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Allowing support for using with new react-beautiful-dnd 12.x API

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow
  types are no longer provided. No API changes.- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/form@7.0.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/field-text@9.0.14
  - @atlaskit/textfield@3.1.4
  - @atlaskit/avatar@17.1.5
  - @atlaskit/inline-dialog@12.1.6

## 10.4.0

### Minor Changes

- [minor][1ed27f5f85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ed27f5f85):

  Adds prop types for Header / Footer render props.

## 10.3.6

- Updated dependencies
  [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/form@6.3.2
  - @atlaskit/inline-dialog@12.1.5
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4

## 10.3.5

### Patch Changes

- [patch][b39742b616](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b39742b616):

  fixed type for the actions props

## 10.3.4

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 10.3.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 10.3.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 10.3.1

- Updated dependencies
  [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/form@6.2.3
  - @atlaskit/select@10.1.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 10.3.0

### Minor Changes

- [minor][66e147e6a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66e147e6a1):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help
  products to write better integration and end to end tests.

## 10.2.1

- Updated dependencies
  [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/textfield@3.0.6
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 10.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 10.1.9

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 10.1.8

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 10.1.7

### Patch Changes

- [patch][f4ba40109f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f4ba40109f):

  Refactors modal-dialog's styled component props

## 10.1.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 10.1.5

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 10.1.4

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 10.1.3

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**
  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**
  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source
    code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match
    source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match
    source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 10.1.2

- Updated dependencies
  [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/form@6.1.7
  - @atlaskit/icon@19.0.2
  - @atlaskit/textfield@3.0.0

## 10.1.1

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 10.1.0

### Minor Changes

- [minor][eb7b748d59](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb7b748d59):

  Modal-dialog padding now matches AGD and GUI pack

## 10.0.14

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 10.0.13

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 10.0.12

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:
  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 10.0.11

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props
  as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps
  of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 10.0.10

- Updated dependencies
  [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/form@6.1.4
  - @atlaskit/inline-dialog@12.0.5
  - @atlaskit/select@10.0.0

## 10.0.9

### Patch Changes

- [patch][0342746c45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0342746c45):

  Closing a dialog in IE11 specific event key

## 10.0.8

- Updated dependencies
  [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/form@6.1.2
  - @atlaskit/select@9.1.10
  - @atlaskit/checkbox@9.0.0

## 10.0.7

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/field-radio-group@6.0.4
  - @atlaskit/form@6.1.1
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/portal@3.0.7
  - @atlaskit/select@9.1.8
  - @atlaskit/textfield@2.0.3
  - @atlaskit/icon@19.0.0

## 10.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 10.0.5

### Patch Changes

- [patch][02f1f73671](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/02f1f73671):

  `heading` prop type changed from string to React.ReactNode. This provides more flexibility for
  consumers to provide i18n components like FormattedMessage.

## 10.0.4

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/field-radio-group@6.0.2
  - @atlaskit/form@6.0.5
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/portal@3.0.3
  - @atlaskit/select@9.1.5
  - @atlaskit/textfield@2.0.1
  - @atlaskit/icon@18.0.0

## 10.0.3

- Updated dependencies
  [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/portal@3.0.2
  - @atlaskit/inline-dialog@12.0.0

## 10.0.2

- Updated dependencies
  [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/form@6.0.4
  - @atlaskit/select@9.1.4
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 10.0.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):
  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 10.0.0

- [major][06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - modal-dialog has been converted to Typescript. Typescript consumers will now get static type
    safety. Flow types are no longer provided. No API or behavioural changes.

- [patch][c3ab82ed42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3ab82ed42):
  - Bump react-focus-lock to latest 1.19.1, it will fix a bug with document.activeElement

- Updated dependencies
  [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/portal@3.0.0

## 9.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 8.0.9

- Updated dependencies
  [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
- Updated dependencies
  [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
  - @atlaskit/form@5.2.10
  - @atlaskit/textfield@1.0.0
  - @atlaskit/portal@1.0.0

## 8.0.8

- Updated dependencies
  [38dab947e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38dab947e6):
  - @atlaskit/blanket@9.0.0

## 8.0.7

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/blanket@8.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/field-text@8.0.3
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/select@8.1.1
  - @atlaskit/textfield@0.4.4
  - @atlaskit/theme@8.1.7

## 8.0.6

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/blanket@8.0.2
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/portal@0.3.1
  - @atlaskit/select@8.0.5
  - @atlaskit/textfield@0.4.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 8.0.5

- [patch][cc8378fcd4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc8378fcd4):
  - Modal-dialog has been migrated from styled-components to Emotion (v10)
  - styled-components is no longer a peer-dependency
  - Render props Body, Header, Footer and Container continue to get styles applied via className
  - Fixes an issue with modal contents that re-rendered on resize
  - Fixes an issue with forms losing state
  - SSR now works out of the box

  ### Warning

  Emotion 10 does not provide support for
  [Enzyme shallow rendering](https://airbnb.io/enzyme/docs/api/shallow.html). This is due to the
  fact that uses it's own [JSX pragma](https://emotion.sh/docs/css-prop#jsx-pragma) to support the
  [CSS prop](https://emotion.sh/docs/css-prop). The pragma internally wraps components and attaches
  a sibling style tag. Consequently, these implementation details may now be visible as conflicts in
  your snapshot tests and may be the cause of test failures for cases that reach into modal-dialog.

  If you are using Enzyme to test components dependent on Modal-Dialog, you may need to replace
  calls to [shallow()](https://airbnb.io/enzyme/docs/api/shallow.html) with a call to
  [mount()](https://airbnb.io/enzyme/docs/api/mount.html) instead.

  For more information please see:
  [Migrating to Emotion 10](https://emotion.sh/docs/migrating-to-emotion-10)

## 8.0.4

- Updated dependencies
  [ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):
  - @atlaskit/portal@0.3.0

## 8.0.3

- Updated dependencies
  [8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):
  - @atlaskit/form@5.2.3
  - @atlaskit/textfield@0.4.0

## 8.0.2

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/blanket@8.0.1
  - @atlaskit/checkbox@6.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/form@5.2.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-dialog@10.0.1
  - @atlaskit/portal@0.2.1
  - @atlaskit/select@8.0.3
  - @atlaskit/textfield@0.3.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 8.0.1

- [patch][0f764dbd7c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f764dbd7c):
  - Modal-dialog no longer shows unnecessary scrollbars in modern browsers

## 8.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only
  distribute esm. This means all distributed code will be transpiled, but will still contain
  `import` and `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder,
  we have to worry about how consumers might be using things that aren't _actually_ supposed to be
  used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of
  packages bundling all of theme, just to use a single color, especially in situations where tree
  shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have
  multiple distributions as they would need to have very different imports from of their own
  internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node
  environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but
  we see this as a pretty sane path forward which should lead to some major bundle size decreases,
  saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in
  [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for
  external) if you have any questions or queries about this.

## 7.3.0

- [minor][f26a3d0235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f26a3d0235):
  - Added media queries to make Modal Dialogs Responsive

## 7.2.4

- Updated dependencies
  [e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):
  - @atlaskit/form@5.1.7
  - @atlaskit/textfield@0.2.0

## 7.2.3

- [patch][06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - popup select "target" is now a function that must resolve to a node

## 7.2.2

- [patch][a7670c1488](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7670c1488):
  - Enabling handling focus in model-dialog by rendering component in model-dialog only after portal
    in model-dialog is attached to DOM.

- Updated dependencies
  [27cacd44ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27cacd44ab):
  - @atlaskit/portal@0.1.0

## 7.2.1

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/form@5.1.2
  - @atlaskit/inline-dialog@9.0.14
  - @atlaskit/portal@0.0.18
  - @atlaskit/select@6.1.19
  - @atlaskit/icon@16.0.0

## 7.2.0

- [minor][07c4cd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07c4cd1):
  - **Feature**: `components` prop now has an optional `container` entry that is wrapped around the
    header, body and footer. This provides compatibility for forms with fields in the body, and
    submit buttons in the footer
  - **API changes:**
    - The `header`, `body` and `footer` props have been deprecated; such custom components should be
      passed within the `components` prop instead.
    - Custom `Body` components passed in using the new method must contain a `ref` element; this can
      be done using forwardRef, as seen in the `custom` example.
  - **Documentation:** Examples have been updated to demonstrate the new container prop, as well as
    utilise the new composition method for custom header/body/footers.

## 7.1.2

- [patch][2686f21](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2686f21):
  - Removed example demonstrating deprecated reference behaviour

## 7.1.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/blanket@7.0.12
  - @atlaskit/button@10.1.1
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/field-text@7.0.18
  - @atlaskit/icon@15.0.2
  - @atlaskit/inline-dialog@9.0.13
  - @atlaskit/portal@0.0.17
  - @atlaskit/select@6.1.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 7.1.0

- [minor][7f99dec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f99dec):
  - Fix usage of PopupSelect inside ModalDialog

## 7.0.14

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/blanket@7.0.11
  - @atlaskit/button@10.0.4
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/field-radio-group@4.0.13
  - @atlaskit/field-text@7.0.16
  - @atlaskit/icon@15.0.1
  - @atlaskit/inline-dialog@9.0.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 7.0.13

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/inline-dialog@9.0.11
  - @atlaskit/portal@0.0.16
  - @atlaskit/icon@15.0.0

## 7.0.12

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/blanket@7.0.10
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/field-text@7.0.15
  - @atlaskit/icon@14.6.1
  - @atlaskit/inline-dialog@9.0.10
  - @atlaskit/portal@0.0.15
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 7.0.11

- [patch][abd3a39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abd3a39):
  - Bump react-beautiful-dnd dependency to v10.0.2

## 7.0.10

- [patch][e151c1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151c1a):
  - Removes dependency on @atlaskit/layer-manager

  As of component versions:
  - \`@atlaskit/modal-dialog@7.0.0\`
  - \`@atlaskit/tooltip@12.0.2\`
  - \`@atlaskit/flag@9.0.6\`
  - \`@atlaskit/onboarding@6.0.0\`

  No component requires \`LayerManager\` to layer correctly.

  You can safely remove this dependency and stop rendering \`LayerManager\` in your apps.

## 7.0.9

- [patch][1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):
  - Fixed issue where tooltips and modals would initially render in the wrong location

## 7.0.8

- Updated dependencies [3f5a4dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5a4dd):
  - @atlaskit/portal@0.0.13

## 7.0.7

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):
  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow
    to type check properly

## 7.0.6

- [patch][7cbd729](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cbd729):
  - Fixes visual bug where header and footer keylines appeared below textboxes and other components

## 7.0.5

- [patch][72bc8da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72bc8da):
  - Removes reference to window in initial state to properly support ssr

- [patch][b332c91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b332c91):
  - upgrades verison of react-scrolllock to SSR safe version

## 7.0.4

- [patch] Updated dependencies
  [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/portal@0.0.12

## 7.0.3

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 7.0.2

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/inline-dialog@9.0.6
  - @atlaskit/layer-manager@5.0.13
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 7.0.1

- [patch] Updated dependencies
  [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)
  - @atlaskit/button@9.0.9
  - @atlaskit/checkbox@5.0.0

## 7.0.0

- [patch] Updates dependency on portal
  [b46385f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b46385f)
- [major] Changes the pattern for using dialogs. Adds ModalTransition component to
  @atlaskit/modal-dialog. See the
  [migration guide](http://atlaskit.atlassian.com/packages/core/modal-dialog/docs/migration) for
  more information. [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)

## 6.0.12

- [patch] Bump react-focus-lock to fix issues with selecting text in Safari.
  [62dc9fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62dc9fc)

## 6.0.11

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.0.9

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/layer-manager@5.0.6
  - @atlaskit/inline-dialog@9.0.2
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-text@7.0.6
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/checkbox@4.0.4
  - @atlaskit/button@9.0.6
  - @atlaskit/blanket@7.0.5
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 6.0.8

- [patch] Updated dependencies
  [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/inline-dialog@9.0.0
- [none] Updated dependencies
  [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/inline-dialog@9.0.0
- [none] Updated dependencies
  [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/inline-dialog@9.0.0
- [none] Updated dependencies
  [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/inline-dialog@9.0.0

## 6.0.7

- [patch] Bumping react-beautiful-dnd to version 9. Making use of use onBeforeDragStart for dynamic
  table [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)
- [none] Updated dependencies
  [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)

## 6.0.6

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/inline-dialog@8.0.4
  - @atlaskit/field-text@7.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/checkbox@4.0.3
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/blanket@7.0.4
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/layer-manager@5.0.5
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 6.0.5

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/inline-dialog@8.0.3
  - @atlaskit/layer-manager@5.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/checkbox@4.0.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/blanket@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/avatar@14.0.5

## 6.0.4

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/inline-dialog@8.0.2
  - @atlaskit/field-text@7.0.2
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/checkbox@4.0.1
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/blanket@7.0.2
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1
  - @atlaskit/avatar@14.0.4

## 6.0.3

- [patch] Upgrading react-beautiful-dnd to 8.0.1
  [87cd977](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cd977)
- [patch] Upgrading react-beautiful-dnd to 8.0.0
  [22efc08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22efc08)
- [none] Updated dependencies
  [87cd977](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cd977)
- [none] Updated dependencies
  [22efc08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22efc08)

## 6.0.2

- [patch] Upgrading react-beautiful-dnd to 8.0.5
  [6052132](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6052132)
- [none] Updated dependencies
  [6052132](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6052132)

## 6.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/inline-dialog@8.0.1
  - @atlaskit/field-text@7.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/blanket@7.0.1
  - @atlaskit/field-radio-group@4.0.1
  - @atlaskit/avatar@14.0.2

## 6.0.0

- [major] Provides analytics for common component interations. See the
  [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for
  more details. If you are using enzyme for testing you will have to use
  [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme).
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/inline-dialog@8.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/blanket@7.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/inline-dialog@8.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/blanket@7.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 5.2.8

- [none] Updated dependencies
  [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies
  [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5

## 5.2.7

- [patch] Updated dependencies
  [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0

## 5.2.6

- [patch] Remove or update \$FlowFixMe
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/field-text@6.1.1
  - @atlaskit/button@8.2.4
  - @atlaskit/field-radio-group@3.1.3
  - @atlaskit/icon@12.6.1
  - @atlaskit/avatar@11.2.2

## 5.2.5

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/inline-dialog@7.1.3
  - @atlaskit/button@8.2.2
  - @atlaskit/checkbox@3.1.2
  - @atlaskit/field-radio-group@3.1.2
  - @atlaskit/icon@12.3.1
  - @atlaskit/avatar@11.2.1

## 5.2.4

- [patch] Replaces implementation of ScrollLock with
  [react-scrolllock](https://github.com/jossmac/react-scrolllock). Deprecates ScrollLock export in
  @atlaskit/layer-manager. [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)
- [none] Updated dependencies
  [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)
  - @atlaskit/layer-manager@4.3.1

## 5.2.3

- [patch] Upgrading react-beautiful-dnd dependency to ^7.1.3
  [024b7fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/024b7fb)
- [patch] Updated dependencies
  [024b7fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/024b7fb)

## 5.2.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/inline-dialog@7.1.2
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/checkbox@3.0.6
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 5.2.1

- [patch] Removes tabbable and focusin dependencies
  [274e773](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/274e773)
- [none] Updated dependencies
  [274e773](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/274e773)

## 5.2.0

- [minor] Deprecates the ability to pass a function to the autoFocus prop. Changes implementation of
  FocusLock to use [react-focus-lock](https://github.com/theKashey/react-focus-lock).
  [5b1ab0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b1ab0b)

- [none] Updated dependencies
  [5b1ab0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b1ab0b)
  - @atlaskit/layer-manager@4.2.0
- [none] Updated dependencies
  [de9690b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de9690b)
  - @atlaskit/layer-manager@4.2.0

## 5.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/layer-manager@4.1.1
  - @atlaskit/inline-dialog@7.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/checkbox@3.0.5
  - @atlaskit/button@8.1.1
  - @atlaskit/blanket@6.0.3
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 5.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/inline-dialog@7.1.0
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/checkbox@3.0.4
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/blanket@6.0.2
  - @atlaskit/button@8.1.0

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/inline-dialog@7.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/checkbox@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/blanket@6.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/avatar@11.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/inline-dialog@7.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/checkbox@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/blanket@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/avatar@11.0.0

## 4.0.5

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/inline-dialog@6.0.2
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/field-text@5.0.3
  - @atlaskit/checkbox@2.0.2
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/blanket@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4

## 4.0.2

- [patch] AK-4416 changes meaning of autofocus prop values
  [c831a3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c831a3d)

## 4.0.1

- [patch] Add possibility to display heading in modal in one line (with ellipsis if content is wider
  than modal) [30883b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30883b4)

## 4.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.5.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.5.0

- [minor] Updated website to use iframe to load examples. Example loader now in a separate react
  app. Webpack config refactored to compile separate example loader, chunking refactored to be more
  performant with the new website changes. Updated modal-dialog to use new component structure to
  optionally specify a Body wrapping component.
  [e1fdfd8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1fdfd8)

## 3.4.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.3.15

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.3.14

- [patch] Fix react-beautiful-dnd position issues when used inside a modal dialog
  [cfda546](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfda546)

## 3.3.12

- [patch] Remove babel-plugin-react-flow-props-to-prop-types
  [06c1f08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c1f08)

## 3.3.11

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.3.9

- [patch] Updated inline-dialog to include boundaries element prop, updated Layer to have dynamic
  boolean escapeWithReference property, updated modal-dialog Content component with
  overflow-x:hidden' [cb72752](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb72752)

## 3.3.8

- [patch] Prevent window from being scrolled programmatically
  [3e3085c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e3085c)

## 3.3.5

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak
  mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 3.3.4

- [patch] Fix modal appearing behind navigation's drawer blanket when layer manager is not used
  [a6c6e5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6c6e5e)

## 3.3.3

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 3.3.2

- [patch] Fix modal height being clipped by destination parent
  [c30e7b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c30e7b0)

## 3.3.1

- [patch] Migration of Blanket to mk2 repo
  [1c55d97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c55d97)

## 3.3.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.2.5

- [patch] Migrate modal-dialog to ak mk 2 update deps and add flow types
  [a91cefe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a91cefe)

## 3.2.4 (2017-11-30)

- bug fix; fix modal dialog not shrinking to viewport height in IE11 (issues closed: ak-3879)
  ([d3bb5cd](https://bitbucket.org/atlassian/atlaskit/commits/d3bb5cd))

## 3.2.3 (2017-11-30)

- bug fix; release stories with fixed console errors
  ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 3.2.2 (2017-11-17)

- bug fix; bumping internal dependencies to latest major version
  ([3aefbce](https://bitbucket.org/atlassian/atlaskit/commits/3aefbce))

## 3.2.1 (2017-11-13)

- bug fix; remove chrome from the wrapping dialog (issues closed: #67)
  ([21f3a0e](https://bitbucket.org/atlassian/atlaskit/commits/21f3a0e))

## 3.2.0 (2017-10-26)

- bug fix; add deprecation warning to spotlight package
  ([3ea2312](https://bitbucket.org/atlassian/atlaskit/commits/3ea2312))
- feature; cleanup layer-manager and modal-dialog in preparation for onboarding
  ([02a516b](https://bitbucket.org/atlassian/atlaskit/commits/02a516b))

## 3.1.3 (2017-10-26)

- bug fix; fix to rebuild stories
  ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 3.1.2 (2017-10-22)

- bug fix; update styled-components dep and react peerDep
  ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 3.1.1 (2017-10-12)

- bug fix; bumps version of Page (issues closed: ak-3680)
  ([8713649](https://bitbucket.org/atlassian/atlaskit/commits/8713649))

## 3.1.0 (2017-10-11)

- feature; add chromeless option to modal to support Connect JSAPI
  ([5ca6a65](https://bitbucket.org/atlassian/atlaskit/commits/5ca6a65))

## 3.0.2 (2017-10-05)

- bug fix; resolve error in modal dialog (issues closed: ak-3623)
  ([2052679](https://bitbucket.org/atlassian/atlaskit/commits/2052679))

## 3.0.1 (2017-09-26)

- bug fix; update webpack raw path (issues closed: ak-3589)
  ([0aa9737](https://bitbucket.org/atlassian/atlaskit/commits/0aa9737))

## 3.0.0 (2017-09-13)

- breaking; onDialogDismissed = onClose, isOpen prop removed, just render the modal to display it
  ([3819bac](https://bitbucket.org/atlassian/atlaskit/commits/3819bac))
- breaking; major overhaul to modal implementation and behaviour (issues closed: ak-2972, ak-3343)
  ([3819bac](https://bitbucket.org/atlassian/atlaskit/commits/3819bac))

## 2.6.0 (2017-08-07)

- feature; Added support for custom modal heights, with the new `ModalDialog.height` prop. It
  accepts a number (converted to `px`) or string (not converted to `px`, so you can use any unit you
  like such as `%`, `vh`, etc). (issues closed: ak-1723)
  ([3c1f537](https://bitbucket.org/atlassian/atlaskit/commits/3c1f537))

## 2.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 2.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 2.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 2.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.1.2 (2017-06-15)

- fix; avoid unwanted re-render of modal children when state/props change
  ([7ae6324](https://bitbucket.org/atlassian/atlaskit/commits/7ae6324))

## 2.1.1 (2017-05-26)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- fix; pin react-lorem-component version to avoid newly released broken version
  ([6f3d9c6](https://bitbucket.org/atlassian/atlaskit/commits/6f3d9c6))

## 2.1.0 (2017-05-06)

- feature; animated entry/exit of modal dialog
  ([e721aaa](https://bitbucket.org/atlassian/atlaskit/commits/e721aaa))

## 2.0.0 (2017-05-05)

- switch modal styling to styled-components
  ([f9510b4](https://bitbucket.org/atlassian/atlaskit/commits/f9510b4))
- breaking; Modal dialog now has a peerDependency on the styled-components package.
- ISSUES CLOSED: AK-2290

## 1.3.3 (2017-05-03)

- fix; Fix child position:fixed elements being clipped
  ([fc0a894](https://bitbucket.org/atlassian/atlaskit/commits/fc0a894))

## 1.3.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.3.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.3.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config
  ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.2.15 (2017-03-31)

- fix; update modal story to use latest navigation devDep
  ([5ed9946](https://bitbucket.org/atlassian/atlaskit/commits/5ed9946))
- fix; update modal story to use latest navigation devDep
  ([c074080](https://bitbucket.org/atlassian/atlaskit/commits/c074080))

## 1.2.14 (2017-03-29)

- fix; only show scrolling keylines when header or footer shown
  ([fd1c68a](https://bitbucket.org/atlassian/atlaskit/commits/fd1c68a))

## 1.2.13 (2017-03-29)

- fix; fire onDialogDismissed when clicking on blanket directly below modal
  ([1c9efb0](https://bitbucket.org/atlassian/atlaskit/commits/1c9efb0))

## 1.2.10 (2017-03-21)

- fix; render rounded corners correctly when header/footer omitted
  ([724480d](https://bitbucket.org/atlassian/atlaskit/commits/724480d))
- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.2.9 (2017-02-28)

- fix; dummy commit to release stories
  ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.2.7 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages
  ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.2.7 (2017-02-28)

- fix; dummy commit to release stories for components
  ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.2.6 (2017-02-28)

- fix; removes jsdoc annotations and moves content to usage.md
  ([14f941a](https://bitbucket.org/atlassian/atlaskit/commits/14f941a))

## 1.2.5 (2017-02-27)

- empty commit to make components release themselves
  ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.2.4 (2017-02-13)

- Fix types for modal-dialog typescript declaration file
  ([533adea](https://bitbucket.org/atlassian/atlaskit/commits/533adea))

## 1.2.3 (2017-02-08)

- fix; trigger modal close handler on esc key in older browsers
  ([a692683](https://bitbucket.org/atlassian/atlaskit/commits/a692683))

## 1.2.2 (2017-02-07)

- fix; render dropdown in modal above footer
  ([2b76812](https://bitbucket.org/atlassian/atlaskit/commits/2b76812))

## 1.2.1 (2017-02-06)

- fix; layer navigation at correct level so it works with modal
  ([5bef9db](https://bitbucket.org/atlassian/atlaskit/commits/5bef9db))
