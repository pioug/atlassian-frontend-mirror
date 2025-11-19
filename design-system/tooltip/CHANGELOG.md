# @atlaskit/tooltip

## 20.10.0

### Minor Changes

- [`e273fa0610764`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e273fa0610764) -
  The keyboard shortcut `font` has been updated to use regular fonts instead of monospace fonts, for
  improved readability and distinction between characters such as the letter O and number 0. It will
  now use the `font.body.small` font token.

  This change is behind the feature gate `platform-tooltip-shortcuts-regular-font`.

## 20.9.0

### Minor Changes

- [`f4cdda6ef6ca0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4cdda6ef6ca0) -
  Removed FG that improves tooltip visibility behavior on focus

## 20.8.2

### Patch Changes

- [`28d426b7134d8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28d426b7134d8) -
  Internal renaming. Public API is unaffected.
- Updated dependencies

## 20.8.1

### Patch Changes

- Updated dependencies

## 20.8.0

### Minor Changes

- [`8f79c1a030071`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8f79c1a030071) -
  The built-in support for displaying keyboard shortcuts via the `shortcut` prop is now available
  for use. It was previously behind the `platform-dst-tooltip-shortcuts` feature flag, which has now
  been cleaned up.

  The top and bottom padding of the tooltip container has also been increased from `2px` to `4px` -
  this change previously also behind the same feature flag.

## 20.7.1

### Patch Changes

- [`5a651fd4cae29`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5a651fd4cae29) -
  Minor changes to package description and README.md. No functional changes.

## 20.7.0

### Minor Changes

- [`37dfc45b61aa2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/37dfc45b61aa2) -
  The font size of keyboard shortcuts has been reduced to `10.5px` from `12.25px`. The keyboard
  shortcuts are behind the `platform-dst-tooltip-shortcuts` feature flag.

## 20.6.1

### Patch Changes

- [`e336b1e1861e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e336b1e1861e5) -
  ts-expect-error was replaced with ts-ignore to fix typecheck issues with help-center local
  consumption

## 20.6.0

### Minor Changes

- [`6915142a30a40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6915142a30a40) -
  The tooltip keyboard shortcut component has been updated to protect against global styles in apps,
  by unsetting styles. Minor tweaks to the keyboard shortcut styling have also been made - font
  size, height, and center alignment.

  The `shortcut` prop is still behind the feature flag `platform-dst-tooltip-shortcuts`.

## 20.5.2

### Patch Changes

- Updated dependencies

## 20.5.1

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 20.5.0

### Minor Changes

- [`4afb88f83d688`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4afb88f83d688) -
  Tooltip now includes support for displaying keyboard shortcuts via the `shortcut` prop. This prop
  is currently behind the `platform-dst-tooltip-shortcuts` feature flag. Example usage:

  ```tsx
  <Tooltip content="Collapse sidebar" shortcut={['Ctrl', '[']}>
  ```

## 20.4.8

### Patch Changes

- [`6d3595e270d09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d3595e270d09) -
  Minor fixes to Tooltip's component prop and DropdownMenu types to be more compatible with React
  18.3.1
- Updated dependencies

## 20.4.7

### Patch Changes

- [`042005250a589`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/042005250a589) -
  Typescript fixes
- Updated dependencies

## 20.4.6

### Patch Changes

- Updated dependencies

## 20.4.5

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 20.4.4

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 20.4.3

### Patch Changes

- Updated dependencies

## 20.4.2

### Patch Changes

- [`2af42ad93c3e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2af42ad93c3e0) -
  Internal changes to use tokens for border radius.

## 20.4.1

### Patch Changes

- Updated dependencies

## 20.4.0

### Minor Changes

- [#191801](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191801)
  [`2896372588f0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2896372588f0c) -
  [ux] Fix tooltip focusing behavior

## 20.3.3

### Patch Changes

- Updated dependencies

## 20.3.2

### Patch Changes

- Updated dependencies

## 20.3.1

### Patch Changes

- Updated dependencies

## 20.3.0

### Minor Changes

- [#157650](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157650)
  [`3696befec09c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3696befec09c1) -
  Minor refactor to the logic for marking a tooltip layer as "open" to the experimental open layer
  observer. This change was previously behind a feature flag, which has now been cleaned up.

### Patch Changes

- Updated dependencies

## 20.2.2

### Patch Changes

- [#162734](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/162734)
  [`eb727b523d74b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/eb727b523d74b) -
  Removes internal dead code related to `z-index` setting.

## 20.2.1

### Patch Changes

- Updated dependencies

## 20.2.0

### Minor Changes

- [#161767](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161767)
  [`de4f10b4e30ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/de4f10b4e30ab) -
  Replaces usage of `@emotion/react` with `@compiled/react` in `TooltipPrimitive`, removing the last
  usage of `@emotion/react` in this package.

## 20.1.0

### Minor Changes

- [#161235](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161235)
  [`cfa80fa55b0d6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cfa80fa55b0d6) -
  The `truncate` prop has been marked as deprecated, as it is inaccessible. It will be be removed in
  a future release.

## 20.0.6

### Patch Changes

- [#141620](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141620)
  [`2a925938dea16`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2a925938dea16) -
  [ux] Check focus-visible before showing tooltip on focus events

## 20.0.5

### Patch Changes

- [#134955](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134955)
  [`ba294ad0536de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ba294ad0536de) -
  An onClose listener is being provided to the experimental open layer observer.
- Updated dependencies

## 20.0.4

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 20.0.3

### Patch Changes

- [#128417](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128417)
  [`889ab4ac93dc2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/889ab4ac93dc2) -
  Update dependencies and remove old unused files.

## 20.0.2

### Patch Changes

- Updated dependencies

## 20.0.1

### Patch Changes

- Updated dependencies

## 20.0.0

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

## 19.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 19.1.4

### Patch Changes

- Updated dependencies

## 19.1.3

### Patch Changes

- Updated dependencies

## 19.1.2

### Patch Changes

- Updated dependencies

## 19.1.1

### Patch Changes

- Updated dependencies

## 19.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 19.0.3

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 19.0.2

### Patch Changes

- [#103594](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103594)
  [`7b1a8574e9c29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7b1a8574e9c29) -
  Fix or temporarily ignore TypeScript errors that occur in internal React 18 suites.

## 19.0.1

### Patch Changes

- Updated dependencies

## 19.0.0

### Major Changes

- [#174355](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174355)
  [`d0d1aae2aa428`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0d1aae2aa428) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/tooltip`, you will need to ensure that your bundler is configured
  to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 18.9.4

### Patch Changes

- Updated dependencies

## 18.9.3

### Patch Changes

- Updated dependencies

## 18.9.2

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 18.9.1

### Patch Changes

- [#164322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/164322)
  [`e9317ed13ba40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e9317ed13ba40) -
  Internal refactors to state to reduce the number of JavaScript event listeners.

## 18.9.0

### Minor Changes

- [`be6f923511512`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be6f923511512) - -
  Added new prop: `canAppear`, which can be used to _conditionally_ show tooltips.
  - Added new prop: `isScreenReaderAnnouncementDisabled` which can be used to disable hidden text
    for tooltips. This is useful when the Tooltip `content` matches the Tooltip trigger content as
    hidden text is not required.

### Patch Changes

- Updated dependencies

## 18.8.5

### Patch Changes

- Updated dependencies

## 18.8.4

### Patch Changes

- Updated dependencies

## 18.8.3

### Patch Changes

- Updated dependencies

## 18.8.2

### Patch Changes

- Updated dependencies

## 18.8.1

### Patch Changes

- [#148281](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148281)
  [`3c4de48168ffe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3c4de48168ffe) -
  Update the import path of `useId*` from `@atlaskit/ds-lib`
- Updated dependencies

## 18.8.0

### Minor Changes

- [#148344](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148344)
  [`025feb57ca48b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/025feb57ca48b) -
  Adds usage of the useNotifyLayerObserver hook from the layering package. The hook is behind a
  feature flag.

## 18.7.3

### Patch Changes

- Updated dependencies

## 18.7.2

### Patch Changes

- [#134213](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134213)
  [`cd16d91b93dff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd16d91b93dff) -
  We are testing an internal change to use an ID generator compatible with both React 16 and
  React 18. If these changes are successful, it will be rolled out in a later release.

## 18.7.1

### Patch Changes

- Updated dependencies

## 18.7.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 18.6.0

### Minor Changes

- [`8b8090800a35d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b8090800a35d) -
  Bump peer dependency for react-dom to include version 17 and 18.

### Patch Changes

- Updated dependencies

## 18.5.2

### Patch Changes

- Updated dependencies

## 18.5.1

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 18.5.0

### Minor Changes

- [#111016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111016)
  [`d131599730792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d131599730792) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 18.4.1

### Patch Changes

- Updated dependencies

## 18.4.0

### Minor Changes

- [#97315](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97315)
  [`9116699f734c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9116699f734c) -
  Add support for React 18 in non-strict mode.

## 18.3.0

### Minor Changes

- [#90966](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90966)
  [`f632d3701e96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f632d3701e96) -
  Add `ignoreTooltipPointerEvents` prop. When set to true it adds `pointer-events: none` to the
  tooltip itself. This will also prevent the tooltip from persisting when hovered.

## 18.2.2

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 18.2.1

### Patch Changes

- [#88717](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88717)
  [`d92770eae702`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d92770eae702) -
  Adding internal eslint opt outs for a new rule
  `@atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop`.

## 18.2.0

### Minor Changes

- [#87879](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87879)
  [`40c7b496eacd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40c7b496eacd) -
  [ux] Internal changes to typography, small visual change to tooltip text line height.

## 18.1.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 18.1.2

### Patch Changes

- [#75714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75714)
  [`33f4a64132a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/33f4a64132a3) -
  Remove duplicate accessible labels on Icon buttons, which were unnecessarily added through the
  `aria-label` attribute.

## 18.1.1

### Patch Changes

- [#64251](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64251)
  [`92b280e734a7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/92b280e734a7) -
  Add a hidden tooltip content when tooltip is in a modal for screen reader announcement

## 18.1.0

### Minor Changes

- [#61952](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61952)
  [`d00b9272c88c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d00b9272c88c) -
  [ux] Tooltips are now hidden during drags. This is to prevent janky UX.

## 18.0.0

### Major Changes

- [#41881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41881)
  [`1de74609c13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1de74609c13) - Removed
  all remaining legacy theming logic from the Tag, Toggle and Tooltip components.

## 17.8.10

### Patch Changes

- [#42577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42577)
  [`d51b45b02fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d51b45b02fb) - Add
  component to push model consumption in JFE

## 17.8.9

### Patch Changes

- [#42475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42475)
  [`c93c86d4089`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c93c86d4089) - Tooltip
  no longer throws in an effect when the first child of tooltip isn't an element.
- [#42475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42475)
  [`61779a58ad8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61779a58ad8) - Tooltip
  nolonger memoizes the ref callback function for the implicit passing-children-jsx API. The
  children-as-function API remains memoized. For more control and better performance characteristics
  we recommend leaning on the explicit children-as-function API over the implicit
  passing-children-jsx API.

## 17.8.8

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 17.8.7

### Patch Changes

- [#40904](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40904)
  [`f5731d7c0ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5731d7c0ca) - Improve
  the performance of the tooltip trigger's ref setter function by ensuring the `useCallback` only
  regenerates a new reference when absolutely needed (rather than on every render).

## 17.8.6

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 17.8.5

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 17.8.4

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 17.8.3

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 17.8.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 17.8.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 17.8.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 17.7.1

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`4ba10567310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ba10567310) - Internal
  changes.

## 17.7.0

### Minor Changes

- [#30248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30248)
  [`03114fe5942`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03114fe5942) - [ux]
  Ensures tooltips are read correctly on screen readers.

## 17.6.9

### Patch Changes

- [#29470](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29470)
  [`6cb57eb428d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cb57eb428d) - Update
  examples for Tooltip to use render props API to aid in eventual deprecation of wrapping children.
- Updated dependencies

## 17.6.8

### Patch Changes

- Updated dependencies

## 17.6.7

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 17.6.6

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 17.6.5

### Patch Changes

- Updated dependencies

## 17.6.4

### Patch Changes

- Updated dependencies

## 17.6.3

### Patch Changes

- [#27313](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27313)
  [`4fd77eaf22b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4fd77eaf22b) - Align
  TriggerProps with the actual output, and make data-testid explicit

## 17.6.2

### Patch Changes

- Updated dependencies

## 17.6.1

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 17.6.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`15f0ad7aaa3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15f0ad7aaa3) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 17.5.17

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 17.5.16

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 17.5.15

### Patch Changes

- [#22691](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22691)
  [`338ba1a1500`](https://bitbucket.org/atlassian/atlassian-frontend/commits/338ba1a1500) - [ux]
  Improves accuracy of Tooltip placement relative to the mouse when using `position="mouse"`

## 17.5.14

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`13a202fde6b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13a202fde6b) - Fixes a
  bug where undefined test IDs were being added to Tooltip wrappers when no test ID was set
- Updated dependencies

## 17.5.13

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`45ebe7af434`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ebe7af434) - Moved to
  using declarative entrypoints internally. Public API is unchanged.
- [`4efc76f8a72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4efc76f8a72) - [ux]
  Fixes a bug where tooltip entrance and exit direction animations were not working since version
  12.1.7, after upgrading `react-popper`.

  This involved adding a wrapper `<div>` around the tooltip to separate the positioning and
  animation styles. The wrapper can be identified in tests using `testId` with the pattern
  `{testId}--wrapper`.

- Updated dependencies

## 17.5.12

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 17.5.11

### Patch Changes

- Updated dependencies

## 17.5.10

### Patch Changes

- Updated dependencies

## 17.5.9

### Patch Changes

- [#21242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21242)
  [`2e7bbdfd813`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e7bbdfd813) -
  Upgrading internal dependency 'bind-event-listener' to 2.1.0 for improved types

## 17.5.8

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 17.5.7

### Patch Changes

- Updated dependencies

## 17.5.6

### Patch Changes

- Updated dependencies

## 17.5.5

### Patch Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`d0eed99c3e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0eed99c3e3) - ED-14264
  Moved styles to emotion css
- [`6007e4f9a97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6007e4f9a97) - Internal
  styling has been refactored in preparation for @compiled/react
- Updated dependencies

## 17.5.4

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 17.5.3

### Patch Changes

- Updated dependencies

## 17.5.2

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 17.5.1

### Patch Changes

- Updated dependencies

## 17.5.0

### Minor Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Added
  the render props support to the Tooltip component. Linked the tooltip text to the trigger using
  aria-describedby for users with assistive technologies.

### Patch Changes

- Updated dependencies

## 17.4.1

### Patch Changes

- Updated dependencies

## 17.4.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`45e06ed2420`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45e06ed2420) -
  Instrumented Tooltip with the new theming package, `@atlaskit/tokens`. Tokens will be visible only
  in applications configured to use the new Tokens API (currently in alpha). These changes are
  intended to be interoperable with the legacy theme implementation. Legacy dark mode users should
  expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 17.3.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 17.3.0

### Minor Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`152d0955271`](https://bitbucket.org/atlassian/atlassian-frontend/commits/152d0955271) -
  Impelemented hiding the tooltip when escape pressed
- [`a5d452bcb30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5d452bcb30) - [ux]
  Tooltip now stays visible when hovering over it, previously it would disappear. This is one of the
  many accessibility improvements we're rolling out to the Atlassian Design System.

### Patch Changes

- Updated dependencies

## 17.2.2

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 17.2.1

### Patch Changes

- Updated dependencies

## 17.2.0

### Minor Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`8386261266c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8386261266c) - Tooltip
  `content` now supports an optional render props API. This API provides an `update` function which
  can be called to manually recalculate the position of the tooltip.

  This `update` function is useful if you are changing the content of the tooltip while it is being
  displayed.

### Patch Changes

- [`1bcfae1edb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1bcfae1edb9) - Add role
  presentation to tooltip.
- [`7116601e1b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7116601e1b2) - Internal
  typing refactored to be readable by extract-react-types.
- Updated dependencies

## 17.1.3

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.

## 17.1.2

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 17.1.1

### Patch Changes

- [#5693](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5693)
  [`d36905cfe9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d36905cfe9) - Fixed
  incorrect function signature for onShow and onHide props, and added improved typing for these
  props.
  - **old:** analyticsEvent was the first argument
  - **change:** analyticsEvent became the second argument unintentionally (bug introduced 17.0.0)
  - **now:** restoring old behavior, analyticsEvent as the first argument

  If you migrated analyticsEvent to the second argument to mitigate this bug, you will need to
  update your code.

- Updated dependencies

## 17.1.0

### Minor Changes

- [#5516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5516)
  [`4a9b4d8808`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a9b4d8808) - DS-7523
  Extends Tooltip to accept strategy as prop

## 17.0.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 17.0.2

### Patch Changes

- Updated dependencies

## 17.0.1

### Patch Changes

- [#4853](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4853)
  [`18f7ccbbfc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18f7ccbbfc) - Fixing
  tooltip prop documentation

## 17.0.0

### Major Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`83586f015e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83586f015e) - Tooltip
  has been refactored to improve performance and be compliant with the lite-mode specification.
  - Removed `react-transition-group` in favor of `@atlaskit/motion` to reduce bundle size
  - Removed `react-node-resolver` because of its use of `React.findDOMNode` which has been marked as
    deprecated by the React team (more below...)
  - Removes analytics-next HOCs in favor of hook variant (You may need to update snapshot tests)
  - Removes all usage of HOCs
  - Replaces `styled-components` v3 with `@emotion/core` to improve runtime and bundle-size
  - If you are passing component to the `tag` prop then your component will need to expose a `ref`
    prop (`ref: React.Ref<HTMLElement>`).

  **Important to note:**

  Only a single element can be supplied to Tooltip as children, no plain text etc. (this has not
  changed from previous version).

### Patch Changes

- [`f32a1f0ebf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f32a1f0ebf) - update
  @atlaskit/tooltip position prop to support Placement type.
- [`3f7751f72c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f7751f72c) - - Fixed
  issue where tooltip would not hide in some circumstances
  - Added official support for nested tooltips within tooltips
  - Test IDs will now be applied to the container element as well as the tooltip, with '--container'
    appended to the end

## 16.0.4

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 16.0.3

### Patch Changes

- Updated dependencies

## 16.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 16.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 16.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 15.2.9

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 15.2.8

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 15.2.7

### Patch Changes

- Updated dependencies

## 15.2.6

### Patch Changes

- [patch][3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):

- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/popper@3.1.12
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/webdriver-runner@0.3.4

## 15.2.5

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
  - @atlaskit/button@13.3.9

## 15.2.4

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8

## 15.2.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/popper@3.1.11
  - @atlaskit/portal@3.1.6
  - @atlaskit/theme@9.5.1

## 15.2.2

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/portal@3.1.5

## 15.2.1

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result-
  Updated dependencies
  [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/popper@3.1.9
  - @atlaskit/portal@3.1.4

## 15.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Tooltip will now be shown when the target element receives focus and hidden when the target
  element loses focus.

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/popper@3.1.8

## 15.1.3

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow
  types are no longer provided.

  ### Breaking

  ** getTokens props changes ** When defining the value function passed into a ThemeProvider, the
  getTokens parameter cannot be called without props; if no props are provided an empty object `{}`
  must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes ** Color palettes have been moved into their own file. Users will need to
  update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 15.1.2

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 15.1.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 15.1.0

### Minor Changes

- [minor][ca1d742875](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca1d742875):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help
  products to write better integration and end to end tests.

## 15.0.15

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 15.0.14

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 15.0.13

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 15.0.12

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 15.0.11

### Patch Changes

- [patch][b8e9a6c5a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8e9a6c5a3):

  Children has now been added to Tooltip's prop-types

## 15.0.10

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 15.0.9

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

## 15.0.8

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 15.0.7

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 15.0.6

- Updated dependencies
  [ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):
  - @atlaskit/popper@3.0.0

## 15.0.5

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 15.0.4

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

## 15.0.3

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 15.0.2

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/portal@3.0.7
  - @atlaskit/icon@19.0.0

## 15.0.1

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 15.0.0

### Major Changes

- [major][67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/tooltip has been converted to Typescript. Typescript consumers will now get static
    type safety. Flow types are no longer provided. No API or behavioural changes.

## 14.0.3

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/portal@3.0.3
  - @atlaskit/icon@18.0.0

## 14.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):
  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 14.0.1

- Updated dependencies
  [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/portal@3.0.0

## 14.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 13.0.5

- Updated dependencies
  [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
- Updated dependencies
  [8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - @atlaskit/portal@1.0.0
  - @atlaskit/popper@1.0.0

## 13.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/popper@0.4.3
  - @atlaskit/theme@8.1.7

## 13.0.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/popper@0.4.2
  - @atlaskit/portal@0.3.1
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 13.0.2

- Updated dependencies
  [ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):
  - @atlaskit/portal@0.3.0

## 13.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/popper@0.4.1
  - @atlaskit/portal@0.2.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 13.0.0

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

## 12.1.17

- [patch][c4edb3ab4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4edb3ab4d):
  - Move tooltip to render popper in portal to maintain ref that Popper needs to initially position
    the tooltip

## 12.1.16

- Updated dependencies
  [27cacd44ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27cacd44ab):
  - @atlaskit/portal@0.1.0

## 12.1.15

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/portal@0.0.18
  - @atlaskit/icon@16.0.0

## 12.1.14

- [patch][8f179c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f179c4):
  - Remove scroll listener in componentWillMount in Tooltip to fix potential memory leak from
    'close' tooltip not properly unmounting when hiding Examples modal via the X button

## 12.1.13

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/popper@0.3.6
  - @atlaskit/portal@0.0.17
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 12.1.12

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/popper@0.3.3
  - @atlaskit/theme@7.0.0

## 12.1.11

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/portal@0.0.16
  - @atlaskit/icon@15.0.0

## 12.1.10

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/popper@0.3.2
  - @atlaskit/portal@0.0.15
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 12.1.9

- Updated dependencies [1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):
  - @atlaskit/portal@0.0.14

## 12.1.8

- Updated dependencies [3f5a4dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5a4dd):
  - @atlaskit/portal@0.0.13

## 12.1.7

- [patch][3b03f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b03f52):
  - Use @atlaskit/popper internally instead of a custom approach to position management

## 12.1.6

- [patch][7f1ff28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1ff28):

  Fixes error when Tooltip attempts to setState on an unmounted component

## 12.1.5

- [patch] Updated dependencies
  [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/portal@0.0.12

## 12.1.4

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 12.1.3

- [patch] onHide and onShow are now called in componentDidUpdate so they behave consistently between
  all hides and shows [e20f11a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e20f11a)

## 12.1.2

- [patch] Fix edgecase where when handleMouseOver was called before handleMouseEnter, causing the
  mouseCoordinates to be null, and the tooltip to render at the top left of the page
  [c2694aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2694aa)

## 12.1.1

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 12.1.0

- [minor] Adds the new hideTooltipOnMouseDown was required since global-navigation and
  navigation-next are using onMouseDown and onMouseUp iteractions
  [8719daf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8719daf)

## 12.0.14

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/portal@0.0.9

## 12.0.13

- [patch] Updated dependencies
  [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [none] Updated dependencies
  [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/portal@0.0.8

## 12.0.12

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 12.0.11

- [patch] tooltip will not appear when content is undefined null or an empty string
  [239b448](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/239b448)

## 12.0.9

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 12.0.8

- [patch] Updated dependencies
  [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/portal@0.0.6
- [none] Updated dependencies
  [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/portal@0.0.6
- [none] Updated dependencies
  [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/portal@0.0.6
- [none] Updated dependencies
  [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/portal@0.0.6

## 12.0.7

- [patch] Adds missing dependency on babel-runtime
  [e41e465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e41e465)
- [patch] Updated dependencies
  [e41e465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e41e465)
  - @atlaskit/portal@0.0.5

## 12.0.6

- [patch] replaces internal utility with flushable library
  [beb9fce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/beb9fce)
- [none] Updated dependencies
  [beb9fce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/beb9fce)

## 12.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [patch] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/portal@0.0.4
  - @atlaskit/icon@13.2.4

## 12.0.4

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/portal@0.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 12.0.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1

## 12.0.2

- [patch] tooltip now renders popup into @atlaskit/portal
  [64fba41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64fba41)
- [none] Updated dependencies
  [64fba41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64fba41)

## 12.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 12.0.0

- [major] Replace the `onMouseOver` function in tooltip with `onTooltipShow`, and `onMouseOut`
  function with `onTooltipHide` to give consumers more useful methods.
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
- [none] Updated dependencies
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/layer-manager@5.0.1
  - @atlaskit/icon@13.1.1

## 11.0.0

- [major] Provides analytics for common component interations. See the
  [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for
  more details. If you are using enzyme for testing you will have to use
  [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme).
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0

## 10.3.1

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 10.3.0

- [minor] Fixes types for Flow 0.74
  [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies
  [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/button@8.2.0
  - @atlaskit/icon@12.2.0

## 10.2.1

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 10.2.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 10.1.0

- [minor] Remove warning HoC from tooltip, meaning base class is the default export again
  [c88ff8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c88ff8c)
- [none] Updated dependencies
  [c88ff8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c88ff8c)

## 10.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 10.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 9.2.1

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 9.2.0

- [minor] add delay prop to tooltip. still defaults to 300ms.
  [66c6264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c6264)
- [none] Updated dependencies
  [66c6264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c6264)

## 9.1.5

- [patch] Fix long words in tooltip content overflowing the tooltip, they will now wrap.
  [b2967ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2967ef)

## 9.1.4

- [patch] Fix tooltips sometimes not hiding when rapidly switching between them
  [760f6a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/760f6a0)

## 9.1.3

- [patch] Fix react warnings caused when unmounting a tooltip when it is queued for show/hide
  [6d9cc52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9cc52)

## 9.1.2

- [patch] Fix tooltip scroll listeners not being removed properly and an edgecase viewport autoflip
  issue [0a3ccc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a3ccc9)

## 9.1.1

- [patch] Fix viewport edge collision detection for non-mouse positions in some cases and improve
  detection to include scrollbars
  [e66bce5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e66bce5)

## 9.1.0

- [patch] Improve viewport edge collision detection. Tooltips will now shift along the secondary
  position axis (e.g. left/right when position is top/bottom) to show within viewport. Fix auto flip
  occurring incorrectly in these situations as well.
  [ebf331a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebf331a)
- [minor] Add new 'mouse' value for position prop and mousePosition prop to allow the tooltip to
  display relative to the mouse.
  [1d5577d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d5577d)

## 9.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 8.4.2

- [patch] Makes packages Flow types compatible with version 0.67
  [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 8.4.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 8.4.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 8.3.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 8.3.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 8.3.0

- [minor] update atlaskit/theme to 2.3.2
  [3795197](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3795197)

## 8.2.1

- [patch] Flatten examples for easier consumer use
  [145b632](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/145b632)

## 8.2.0

- [minor] new prop component to open custom tooltip
  [3f892d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f892d5)

## 8.1.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 8.1.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 8.0.12

- [patch] replace internal deprecation warning hoc with package
  [c399777](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c399777)

## 8.0.10

- [patch] AK-4064 ensure unmountComponentAtNode is called for components rendered via
  ReactDOM.render [e3153c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3153c3)

## 8.0.9

- [patch] remove unused button dependency and corrected themes type
  [3475dd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3475dd6)

## 8.0.6

- [patch] bump icon dependency
  [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 8.0.3

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)

## 8.0.0 (2017-11-10)

- This was an accidental release - do no use, go directly to 8.0.1

## 7.0.0 (2017-11-10)

- added flow types
- rewritten the logic for positioning tooltips, removed Popper.js
- uses @atlaskit/layer-manager to render outside app context/stack
- removed stateless component
- \`description\` has been renamed to \`content\`

## 6.2.2 (2017-10-26)

- bug fix; fix to rebuild stories
  ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.2.1 (2017-10-22)

- bug fix; update styled components dep and react peerDep
  ([5539ada](https://bitbucket.org/atlassian/atlaskit/commits/5539ada))

## 6.2.0 (2017-10-18)

- feature; add trigger prop to tooltip
  ([7721243](https://bitbucket.org/atlassian/atlaskit/commits/7721243))
- feature; use mouseEnter and mouseLeave instead of mouseOver and mouseOut
  ([55cf15e](https://bitbucket.org/atlassian/atlaskit/commits/55cf15e))

## 6.1.0 (2017-10-18)

- feature; add trigger prop to tooltip
  ([7721243](https://bitbucket.org/atlassian/atlaskit/commits/7721243))
- feature; use mouseEnter and mouseLeave instead of mouseOver and mouseOut
  ([55cf15e](https://bitbucket.org/atlassian/atlaskit/commits/55cf15e))

## 6.0.0 (2017-08-30)

- breaking; The tooltip trigger is now wrapped in a div with 'display: inline-block' applied.
  Previously it was ([de263e5](https://bitbucket.org/atlassian/atlaskit/commits/de263e5))
- breaking; tooltip now disappears as soon as the mouse leaves the trigger (issues closed: ak-1834)
  ([de263e5](https://bitbucket.org/atlassian/atlaskit/commits/de263e5))

## 5.0.1 (2017-08-21)

- bug fix; fix PropTypes warning
  ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 5.0.0 (2017-08-11)

- bug fix; fix the theme-dependency
  ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- breaking; affects internal styled-components implementation
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- feature; updated dark colors for Tooltip
  ([8fbbb8c](https://bitbucket.org/atlassian/atlaskit/commits/8fbbb8c))
- feature; new theme methods ([3656ee3](https://bitbucket.org/atlassian/atlaskit/commits/3656ee3))
- feature; add dark mode support to tooltip
  ([aa87b89](https://bitbucket.org/atlassian/atlaskit/commits/aa87b89))

## 4.0.0 (2017-08-11)

- breaking; affects internal styled-components implementation
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- feature; updated dark colors for Tooltip
  ([8fbbb8c](https://bitbucket.org/atlassian/atlaskit/commits/8fbbb8c))
- feature; new theme methods ([3656ee3](https://bitbucket.org/atlassian/atlaskit/commits/3656ee3))
- feature; add dark mode support to tooltip
  ([aa87b89](https://bitbucket.org/atlassian/atlaskit/commits/aa87b89))

## 3.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.0.0 (2017-07-17)

- replace LESS with SC ([d1b5911](https://bitbucket.org/atlassian/atlaskit/commits/d1b5911))
- breaking; named export "Tooltip" is now "TooltipStateless". prop "visible" is now "isVisible"
- ISSUES CLOSED: AK-2059

## 1.2.1 (2017-07-13)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 1.2.0 (2017-05-10)

- feature; bump layer version in [@atlaskit](https://github.com/atlaskit)/tooltip
  ([cfa9903](https://bitbucket.org/atlassian/atlaskit/commits/cfa9903))

## 1.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config
  ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.8 (2017-04-04)

- fix; adds defensive code to allow testing in mocha/jsdom
  ([2eaab5b](https://bitbucket.org/atlassian/atlaskit/commits/2eaab5b))

## 1.0.6 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.4 (2017-02-28)

- fix; prevent word wrapping of tooltip for TextAdvancdFormatting elements
  ([31b51a4](https://bitbucket.org/atlassian/atlaskit/commits/31b51a4))
- fix; removes jsdoc annotations and moves content to usage.md
  ([2d794cd](https://bitbucket.org/atlassian/atlaskit/commits/2d794cd))
- fix; dummy commit to release stories
  ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.3 (2017-02-20)

- Add missing TS definition for tooltip
  ([aae714d](https://bitbucket.org/atlassian/atlaskit/commits/aae714d))
- Add TS definition for tooltip
  ([5c023e9](https://bitbucket.org/atlassian/atlaskit/commits/5c023e9))
- Use atlaskit tooltips instead of browser native tooltips
  ([d0018eb](https://bitbucket.org/atlassian/atlaskit/commits/d0018eb))

## 1.0.2 (2017-02-07)

- fix; Updates package to use scoped ak packages
  ([73d1427](https://bitbucket.org/atlassian/atlaskit/commits/73d1427))
