# @atlaskit/avatar-group

## 12.2.0

### Minor Changes

- [#198565](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198565)
  [`d3eacf36afe32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d3eacf36afe32) -
  Adjusted stack spacing at 'small' size to ensure visibility of "more" menu. Fix bug where grid
  spacing was 4px too wide across all sizes

## 12.1.4

### Patch Changes

- Updated dependencies

## 12.1.3

### Patch Changes

- [#193214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193214)
  [`c661806a65543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c661806a65543) -
  Internal changes to how border radius and border width values are applied. No visual change.
- Updated dependencies

## 12.1.2

### Patch Changes

- Updated dependencies

## 12.1.1

### Patch Changes

- Updated dependencies

## 12.1.0

### Minor Changes

- [#180943](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180943)
  [`d9f378fa2f4e7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d9f378fa2f4e7) -
  Added the `moreIndicatorLabel` prop to provide the more indicator an accessible name

## 12.0.15

### Patch Changes

- Updated dependencies

## 12.0.14

### Patch Changes

- Updated dependencies

## 12.0.13

### Patch Changes

- Updated dependencies

## 12.0.12

### Patch Changes

- Updated dependencies

## 12.0.11

### Patch Changes

- Updated dependencies

## 12.0.10

### Patch Changes

- Updated dependencies

## 12.0.9

### Patch Changes

- Updated dependencies

## 12.0.8

### Patch Changes

- Updated dependencies

## 12.0.7

### Patch Changes

- Updated dependencies

## 12.0.6

### Patch Changes

- Updated dependencies

## 12.0.5

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 12.0.4

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

## 11.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 11.1.4

### Patch Changes

- [#114591](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114591)
  [`e0ea3e42506fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0ea3e42506fb) -
  Internal refactor to the "more indicator". Fixes the focus state of the "more indicator" button.

## 11.1.3

### Patch Changes

- Updated dependencies

## 11.1.2

### Patch Changes

- Updated dependencies

## 11.1.1

### Patch Changes

- Updated dependencies

## 11.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 11.0.0

### Major Changes

- [#104933](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104933)
  [`8a592509504c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8a592509504c7) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/avatar-group`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 10.1.5

### Patch Changes

- [#104081](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104081)
  [`9e80fcb611337`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e80fcb611337) -
  Update dev dependencies.

## 10.1.4

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 10.1.3

### Patch Changes

- Updated dependencies

## 10.1.2

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 10.1.1

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [#174545](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174545)
  [`102616f7c8d08`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/102616f7c8d08) -
  [ux] Add override for MoreIndicator

## 10.0.4

### Patch Changes

- [#165798](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165798)
  [`d0ba9d90d42e5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0ba9d90d42e5) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 10.0.3

### Patch Changes

- [#161302](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161302)
  [`e005ceaf960e2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e005ceaf960e2) -
  Make some spread props explicit in internal functions and components.

## 10.0.2

### Patch Changes

- [#161368](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/161368)
  [`870668ea63139`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/870668ea63139) -
  Refactoring internals to make spread props more explicit and resolve ESLint disables.

## 10.0.1

### Patch Changes

- Updated dependencies

## 10.0.0

### Major Changes

- [`8aee79daf4012`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aee79daf4012) -
  Removed `xsmall` size option for AvatarGroup since it is too small to display elements like the
  more indicator in an accessible way. Use the `small` size instead. The standalone Avatar component
  will continue to support the `xsmall` size.

## 9.11.5

### Patch Changes

- Updated dependencies

## 9.11.4

### Patch Changes

- Updated dependencies

## 9.11.3

### Patch Changes

- [#134321](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134321)
  [`4539c88ed5ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4539c88ed5ed3) -
  The avatar group container now creates a new stacking context using `isolation: isolate`. This
  improves how it interacts with other layered elementson the page.

## 9.11.2

### Patch Changes

- [#128022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128022)
  [`1495b8f9c9253`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1495b8f9c9253) -
  Modified popup trigger's aria-haspopup types to support the 'dialog' value.
- Updated dependencies

## 9.11.1

### Patch Changes

- Updated dependencies

## 9.11.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 9.10.0

### Minor Changes

- [#128333](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128333)
  [`e8ee91f820e6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e8ee91f820e6f) -
  Refactors the way focus-rings are applied to avatars and avatar-groups in relation to custom
  border colors.

### Patch Changes

- Updated dependencies

## 9.9.1

### Patch Changes

- [#122942](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122942)
  [`99084c446171e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/99084c446171e) -
  Fixes bug where the border color for avatars in the `data` prop were not being passed through. Now
  the `borderColor` prop from an avatar in the `data` prop will pass through. Preference is given to
  the `borderColor` prop from avatar group, if both are present.

## 9.9.0

### Minor Changes

- [#116644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116644)
  [`40234970169dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40234970169dc) -
  [ux] DSP-19190 We are testing a new visual appearance behind a feature flag. If successful it will
  be released at a later date.

### Patch Changes

- Updated dependencies

## 9.8.0

### Minor Changes

- [#113372](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113372)
  [`4b4faf5caa25a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4b4faf5caa25a) -
  [ux] The font size and font weight of avatar group more button is brought in line with design
  system guidelines.

## 9.7.0

### Minor Changes

- [#111696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111696)
  [`20c2d58f6f8a9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/20c2d58f6f8a9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 9.6.1

### Patch Changes

- [#96699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96699)
  [`1809bf4e75ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1809bf4e75ad) -
  Update font size of the 'more' indicator to be defined in rem rather than px.
- Updated dependencies

## 9.6.0

### Minor Changes

- [#96490](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96490)
  [`e7e14229e1ca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e7e14229e1ca) -
  Add support for React 18 in non-strict mode.

### Patch Changes

- Updated dependencies

## 9.5.4

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 9.5.3

### Patch Changes

- [#82336](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82336)
  [`87dafc8315c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/87dafc8315c4) -
  Updated Avatar Group's 'data' prop documentation to add more clarity around what AvatarGroupProps
  is.

## 9.5.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 9.5.1

### Patch Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130)
  [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) -
  Update new button text color fallback for default theme (non-token) to match that of old button
  current text color

## 9.5.0

### Minor Changes

- [#61786](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61786)
  [`937861329875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/937861329875) -
  Added the `shouldPopupRenderToParent` prop which determines if `shouldRenderToParent` is applied
  to the avatar group's popup.

## 9.4.6

### Patch Changes

- Updated dependencies

## 9.4.5

### Patch Changes

- [#42577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42577)
  [`d51b45b02fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d51b45b02fb) - Add
  component to push model consumption in JFE

## 9.4.4

### Patch Changes

- Updated dependencies

## 9.4.3

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787)
  [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal
  changes to use space tokens. There is no expected visual or behaviour change.

## 9.4.2

### Patch Changes

- [#39128](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39128)
  [`3c114ea4257`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c114ea4257) - Update
  type definitions to conform to inherited changes from `@types/react@16.14.15`.

## 9.4.1

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 9.4.0

### Minor Changes

- [#38166](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38166)
  [`da7b6be2540`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da7b6be2540) - Fixed
  keyboard support for the interactive element. Changed span to button for avatar-group

## 9.3.6

### Patch Changes

- [#36809](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36809)
  [`71b58da4e00`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71b58da4e00) - set
  focus to the first avatar when popup is open

## 9.3.5

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 9.3.4

### Patch Changes

- [#33250](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33250)
  [`cb7033c5b72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb7033c5b72) - keyboard
  arrow (UP and DOWN) support in avatar-group popup component

## 9.3.3

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 9.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 9.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 9.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 9.2.4

### Patch Changes

- [#30248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30248)
  [`a8a1fe824b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8a1fe824b0) - Removed
  unused prop `enableTooltip` and fixed tooltip toggle in examples.
- Updated dependencies

## 9.2.3

### Patch Changes

- Updated dependencies

## 9.2.2

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 9.2.1

### Patch Changes

- [#28064](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28064)
  [`b0f6dd0bc35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f6dd0bc35) - Updated
  to use typography tokens. There is no expected behaviour or visual change.

## 9.2.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`3f8f08a1888`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f8f08a1888) - Updating
  Avatar-group component to position the tooltip either to top or bottom based on configuration.

## 9.1.4

### Patch Changes

- Updated dependencies

## 9.1.3

### Patch Changes

- Updated dependencies

## 9.1.2

### Patch Changes

- Updated dependencies

## 9.1.1

### Patch Changes

- [#26488](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26488)
  [`bc989043572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc989043572) - Internal
  changes to apply spacing tokens. This should be a no-op change.

## 9.1.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`110fb3a5f19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/110fb3a5f19) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behaviour change.

### Patch Changes

- Updated dependencies

## 9.0.4

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 9.0.3

### Patch Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`4bc286406f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bc286406f2) - [ux]
  Update more indicator icon to use new design tokens and remove the unnecessary use of the :after
  element with regards to the consumption of the Avatar component.
- Updated dependencies

## 9.0.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 9.0.1

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`45ebe7af434`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ebe7af434) - Moved to
  using declarative entrypoints internally. Public API is unchanged.

## 9.0.0

### Major Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`92bb02bc46b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92bb02bc46b) - [ux]
  There are **no code changes required** to consume this major, but you should be aware that
  internal changes have been made to how `@atlaskit/avatar` loads images.

  Before, the image loading behaviour was written in JS. Now, it leans on a standard HTML `img` tag
  if you provide a `src` prop, allowing it to rely on the browser to optimise the loading. These
  changes should result in faster image loading and an improved server-side rendering story.

  In this version, the **breaking change is that you will no longer see a fallback icon while the
  image is loading**. We have intentionally removed this loading behaviour as it is no longer
  consistent with our native `img` behaviour-first approach, and was a source of SSR bugs. Avatar
  images will load either instantly from the cache, or very fast from a CDN. In the edge cases where
  there is an error with the image src provided, we will still fall back to a default icon.

### Patch Changes

- [`1276a8179ad`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1276a8179ad) - [ux]
  DSP-4535: Fix wrongly used token.
- Updated dependencies

## 8.5.15

### Patch Changes

- [#21545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21545)
  [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts
  jsdoc strings to improve prop documentation

## 8.5.14

### Patch Changes

- Updated dependencies

## 8.5.13

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 8.5.12

### Patch Changes

- Updated dependencies

## 8.5.11

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`b2f8af359cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2f8af359cf) - Rewrite
  dynamic styles to be static to aid compiled migration.
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 8.5.10

### Patch Changes

- Updated dependencies

## 8.5.9

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal
  code change turning on a new linting rule.

## 8.5.8

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates
  usage of deprecated token names so they're aligned with the latest naming conventions. No UI or
  visual changes
- Updated dependencies

## 8.5.7

### Patch Changes

- Updated dependencies

## 8.5.6

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 8.5.5

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 8.5.4

### Patch Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`2b98dfda0a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b98dfda0a6) - Removes
  `@emotion/styled` in favour of `@emotion/core`.
- Updated dependencies

## 8.5.3

### Patch Changes

- [#15632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15632)
  [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds
  explicit type to button usages components.

## 8.5.2

### Patch Changes

- Updated dependencies

## 8.5.1

### Patch Changes

- Updated dependencies

## 8.5.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`016d19b8038`](https://bitbucket.org/atlassian/atlassian-frontend/commits/016d19b8038) - [ux]
  When avatar's are disabled their tooltip will no longer be displayed.

### Patch Changes

- Updated dependencies

## 8.4.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`c79bc186958`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c79bc186958) - [ux]
  Colors are now sourced through tokens.

### Patch Changes

- [`2d7cc544696`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d7cc544696) - Updates
  token usage to match the latest token set
- Updated dependencies

## 8.3.2

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`0d0ecc6e790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d0ecc6e790) - Corrects
  eslint supressions.
- [`9a84a3ceb82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a84a3ceb82) - Internal
  code changes.
- Updated dependencies

## 8.3.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 8.3.0

### Minor Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`5ba523fc937`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ba523fc937) - Now the
  `AvatarGroup` is marked with ul and li elements. This makes it easier for users with assistive
  technologies to distinguish `AvatarGroup` ( which is a list of avatars ) among other page
  components. The default label that the screen reader announces when a user selects the AvatarGroup
  is `list avatar group x items`. When one of AvatarGroupItems is selected screen reader
  announcement is `[avatar label], i of n` where `i` - index of a selected item, `n` - the length of
  the list.

  To change the label of a list you can use `label` props.

### Patch Changes

- [`c056ee44d4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c056ee44d4b) - Added
  the design system tech stacks to the package.json and fixed linting errors, disabled some rules to
  prevent bringing breaking changes
- [`4121ef822c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4121ef822c4) - Fixing
  issue where AvatarGroup list-style-type style would get overridden by product styles.
- Updated dependencies

## 8.2.0

### Minor Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`8f84c89cad5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f84c89cad5) - [ux] The
  styles of overflow button of avatar group has been aligned with default button styles. Also,
  contrast issue of the button has been fixed.

### Patch Changes

- Updated dependencies

## 8.1.1

### Patch Changes

- Updated dependencies

## 8.1.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`c40dcf42d93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c40dcf42d93) - [ux]
  Added passing an empty name prop to Avatar in the AvararGroupItem that is used for overflow
  dropdown menu. Screen reader does not announce name twice now.

### Patch Changes

- Updated dependencies

## 8.0.15

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`dd0ddc74ee4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd0ddc74ee4) - Support
  onClick handlers on anchor elements in Avatar Group

## 8.0.14

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed
  extraneous/unnecessary dependencies for design system components.

## 8.0.13

### Patch Changes

- Updated dependencies

## 8.0.12

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 8.0.11

### Patch Changes

- [#5620](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5620)
  [`07fcbf76b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07fcbf76b3) - [ux]
  `avatar-group` now renders properly when used in a `modal-dialog`. The overflow menu is visible
  above the modal content.

## 8.0.10

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 8.0.9

### Patch Changes

- Updated dependencies

## 8.0.8

### Patch Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`19d7d96007`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d7d96007) - [ux] Now
  AvatarGroup wouldn't create non-interactive buttons in case there is no action provided

## 8.0.7

### Patch Changes

- Updated dependencies

## 8.0.6

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 8.0.5

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages
- Updated dependencies

## 8.0.4

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 8.0.3

### Patch Changes

- Updated dependencies

## 8.0.2

### Patch Changes

- [#3048](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3048)
  [`3a919f4263`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a919f4263) - Fixed
  .name being used as a key for AvatarGroup Tooltip's

## 8.0.1

### Patch Changes

- [#3804](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3804)
  [`ab9503b252`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab9503b252) - Ensure
  moreButtonProps is passed through to the MoreButton

## 8.0.0

### Major Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`cde426961a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cde426961a) -
  `AvatarGroup` has been migrated to **lite-mode**. Users should see performance improvements and
  reduced bundlesize.

  **Change summary:**

  - `name` is now a required property of the `data` attribute. This was previously not required
    simply because we forwarded avatars props. Names should always be supplied so that avatars can
    be differentiated in a meaningful way (although they are not required to be unique).
  - new prop `isTooltipDisabled` has been provided to allow users to disable tooltips
  - AvatarGroup now uses `@emotion`

  **Misc.**

  - Fixed broken margin styling bug with `stack` groups
  - Replaced `dropdown-menu` with a lighter and more performant `popup` component
  - Removed custom `dropdown-menu` styling
  - Removed all HOC usage
  - More indicator is now just a stylized Avatar rather than a complete style re-implementation of
    Avatar

### Patch Changes

- [`54f1e38676`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54f1e38676) - Replace
  custom menu implementation with @atlaskit/menu components
- [`e99c1c2ac8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99c1c2ac8) - Removes
  text decoration from AvatarItems rendered as anchor tags
- [`d833e8c531`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d833e8c531) -
  AvatarGroup component is longer typed via FC
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable
- Updated dependencies

## 7.0.1

### Patch Changes

- [#3363](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3363)
  [`ae57cd8744`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae57cd8744) - Assignment
  of key for AvatarGroup children made user driven now and using Array.index as a fallback, which
  fixes the unique key issue in AvaratGroup.

## 7.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 6.0.3

### Patch Changes

- [#2443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2443)
  [`e91d934e94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e91d934e94) - Using
  avatar.name + index as key for AvatarGroup

## 6.0.2

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 6.0.1

### Patch Changes

- [#2794](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2794)
  [`2daf5b6054`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2daf5b6054) -
  AvatarGroup will now send the index of the clicked item via the onAvatarClick event handler

## 6.0.0

### Major Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`a7ca7039c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7ca7039c7) -
  AvatarGroup previously depended heavily on Avatar internals such as styles, `getProps` and
  `withPseudoState`. These have been moved directly into AvatarGroup to finally decouple the two
  components. We will revisit this when we convert AvatarGroup to lite-mode and most likely remove
  them entirely.

  Previously, it was possible to pass arbritray props to the underlying Avatar via the `data` prop.
  This is no longer supported. Please pass props directly to the custom avatar / presence / status
  components.

### Patch Changes

- Updated dependencies

## 5.1.2

### Patch Changes

- [patch][e95a8726e2](https://bitbucket.org/atlassian/atlassian-frontend/commits/e95a8726e2):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):

- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [f7f2068a76](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f2068a76):
- Updated dependencies
  [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/code@11.1.5
  - @atlaskit/avatar@17.1.10
  - @atlaskit/dropdown-menu@9.0.3

## 5.1.1

### Patch Changes

- [patch][28573f37a7](https://bitbucket.org/atlassian/atlassian-frontend/commits/28573f37a7):

  Fix hover and focus state of the more indicator- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [8b9598a760](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9598a760):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/item@11.0.2
  - @atlaskit/field-base@14.0.2
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/toggle@8.1.6

## 5.1.0

### Minor Changes

- [minor][e9a14f945f](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9a14f945f):

  Adds overrides for Avatar and AvatarGroupItem.-
  [minor][4859ceaa73](https://bitbucket.org/atlassian/atlassian-frontend/commits/4859ceaa73):

  Adds test id for the container, avatar, and overflow menu elements.

### Patch Changes

- Updated dependencies
  [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/icon@20.0.2

## 5.0.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/code@11.1.3
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/field-base@14.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4

## 5.0.3

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies
  [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 5.0.2

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes onMoreClick return type to void-
  [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes return type of onClick in MoreIndicator to void- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies
  [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/avatar@17.1.5
  - @atlaskit/field-base@13.0.16
  - @atlaskit/item@10.2.0

## 5.0.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 5.0.0

### Major Changes

- [major][40bda8f796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bda8f796):

  @atlaskit/avatar-group has been converted to Typescript. Typescript consumers will now get static
  type safety. Flow types are no longer provided. No API or behavioural changes.

## 4.0.13

- Updated dependencies
  [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/item@10.1.5
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 4.0.12

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 4.0.11

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 4.0.10

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 4.0.9

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 4.0.8

### Patch Changes

- [patch][10d566fe8d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10d566fe8d):

  Removed unused dependencies from package.json for avatar-group: @atlaskit/tooltip was unused.

## 4.0.7

- Updated dependencies
  [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/avatar@16.0.8
  - @atlaskit/toggle@8.0.0

## 4.0.6

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/field-base@13.0.6
  - @atlaskit/item@10.0.5
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 4.0.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 4.0.4

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/dropdown-menu@8.0.5
  - @atlaskit/icon@18.0.1
  - @atlaskit/item@10.0.3
  - @atlaskit/tooltip@15.0.0

## 4.0.3

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/field-base@13.0.4
  - @atlaskit/item@10.0.2
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 4.0.2

- Updated dependencies
  [97bfe81ec8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bfe81ec8):
  - @atlaskit/docs@8.1.0
  - @atlaskit/code@11.0.0

## 4.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 3.0.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/code@9.0.1
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/toggle@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 3.0.3

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/avatar@15.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/icon@16.0.8
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 3.0.2

- [patch][ea173a3ee2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea173a3ee2):

  - Internal changes only. Component is now SSR compatible. If server side rendered, Avatar Images
    will begin to load immediately; before client bundle is ready. If this is undesired, `imageUrl`
    can be passed in after component is mounted.

## 3.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 3.0.0

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

## 2.1.12

- [patch][3a9b559382](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a9b559382):

  - Stopping href from being passed down to Avatar in DropdownMenu rendered in AvatarGroup

## 2.1.11

- [patch][ed05c5c5d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed05c5c5d9):

  - Change border color of avatar in avatar group dropdown menu to transparent so that it does not
    overlap with focus ring

## 2.1.10

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/field-base@11.0.14
  - @atlaskit/item@8.0.15
  - @atlaskit/toggle@5.0.15
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 2.1.9

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/code@8.2.2
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/field-base@11.0.13
  - @atlaskit/icon@15.0.2
  - @atlaskit/item@8.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/toggle@5.0.14
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 2.1.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/code@8.2.1
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/field-base@11.0.12
  - @atlaskit/icon@15.0.1
  - @atlaskit/item@8.0.13
  - @atlaskit/toggle@5.0.13
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 2.1.7

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/field-base@11.0.11
  - @atlaskit/item@8.0.12
  - @atlaskit/toggle@5.0.12
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 2.1.6

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/toggle@5.0.11
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 2.1.5

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 2.1.4

- [patch] Adds new theming API to Avatar and AvatarItem components
  [79dd93f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79dd93f)

## 2.1.3

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/field-base@11.0.8
  - @atlaskit/item@8.0.8
  - @atlaskit/toggle@5.0.9
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 2.1.1

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/toggle@5.0.6
  - @atlaskit/item@8.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/dropdown-menu@6.1.8
  - @atlaskit/code@8.0.1
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 2.1.0

- [minor] Added prop moreButtonProps to allow modification of the group's MoreButton
  [6efa808](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6efa808)

## 2.0.8

- [patch] Updated dependencies
  [f9c0cdb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c0cdb)
  - @atlaskit/code@8.0.0
  - @atlaskit/docs@5.0.5

## 2.0.7

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/field-base@11.0.3
  - @atlaskit/toggle@5.0.5
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/code@7.0.3
  - @atlaskit/item@8.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/dropdown-menu@6.1.5
  - @atlaskit/avatar@14.0.6

## 2.0.6

- [patch] Update pretty-proptypes
  [c7e484c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7e484c)
- [none] Updated dependencies
  [c7e484c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7e484c)
  - @atlaskit/docs@5.0.3

## 2.0.5

- [patch] Clean up changelog
  [5b5bd8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b5bd8e)

## 2.0.4

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/item@8.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/code@7.0.2
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/avatar@14.0.5
  - @atlaskit/field-base@11.0.2

## 2.0.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/field-base@11.0.1
  - @atlaskit/toggle@5.0.3
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/code@7.0.1
  - @atlaskit/item@8.0.2
  - @atlaskit/icon@13.2.1
  - @atlaskit/dropdown-menu@6.1.3
  - @atlaskit/avatar@14.0.4

## 2.0.2

- [patch] Update dev dependencies and docs
  [d0e13b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0e13b7)

## 2.0.1

- [patch] Updated dependencies
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/item@8.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/dropdown-menu@6.1.1
  - @atlaskit/avatar@14.0.1

## 2.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/code@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0

## 1.0.2

- [patch] Fix flow types [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
- [patch] Updated dependencies
  [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/item@7.0.8
  - @atlaskit/dropdown-menu@5.2.3

## 1.0.1

- [patch] Small avatar-group docs improvements
  [a54f6ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a54f6ea)

## 1.0.0

- [major] Split avatar-group into its own package
  [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
- [patch] Updated dependencies
  [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/item@7.0.7
  - @atlaskit/dropdown-menu@5.2.2
