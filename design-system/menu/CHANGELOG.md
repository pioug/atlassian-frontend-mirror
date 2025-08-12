# @atlaskit/menu

## 8.3.0

### Minor Changes

- [#200326](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200326)
  [`f520c88226d22`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f520c88226d22) -
  Reimplementing these changes due to a revert.

  ButtonItem will convey its selected state to screen readers when `isSelected`. This is done
  through the `aria-current` attribute.

  This change is behind a feature flag, which will be removed in a future release.

## 8.2.0

### Minor Changes

- [#200012](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200012)
  [`3b577f51b24b1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3b577f51b24b1) -
  ButtonItem will convey its selected state to screen readers when `isSelected`. This is done
  through the `aria-current` attribute.

  This change is behind a feature flag, which will be removed in a future release.

## 8.1.2

### Patch Changes

- Updated dependencies

## 8.1.1

### Patch Changes

- [#193214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193214)
  [`c661806a65543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c661806a65543) -
  Internal changes to how border radius and border width values are applied. No visual change.
- Updated dependencies

## 8.1.0

### Minor Changes

- [#191911](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191911)
  [`c1fc152f611b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c1fc152f611b8) -
  Icons will now display consistently in menu items regardless of their spacing

## 8.0.9

### Patch Changes

- [#188621](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188621)
  [`94981059e9ba8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/94981059e9ba8) -
  Added accessible label for MenuGroup in DropdownMenu
- Updated dependencies

## 8.0.8

### Patch Changes

- [#184403](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184403)
  [`aa0e4e09ed566`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aa0e4e09ed566) -
  Internal refactoring of visual regression tests.

## 8.0.7

### Patch Changes

- Updated dependencies

## 8.0.6

### Patch Changes

- Updated dependencies

## 8.0.5

### Patch Changes

- [#175398](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175398)
  [`28c7d87f8d2e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28c7d87f8d2e0) -
  Updated dev dependencies.
- Updated dependencies

## 8.0.4

### Patch Changes

- Updated dependencies

## 8.0.3

### Patch Changes

- [#171641](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/171641)
  [`1d4741f638def`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1d4741f638def) -
  Removed UFO metric interactionName FG from platform

## 8.0.2

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- [#164146](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164146)
  [`cb9fe0058ed87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb9fe0058ed87) -
  Updates package.json direct dependencies to align with actual usage.

## 8.0.0

### Major Changes

- [#157531](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157531)
  [`dd1068010784d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dd1068010784d) -
  Migrated `SkeletonItem` and `SkeletonHeadingItem` components from @emotion/react to
  @compiled/react in order toimprove performance, align with the rest of the Atlaskit techstack, and
  support React 18 StreamingSSR.

  Removed the `cssFn` prop from the `SkeletonItem` and `SkeletonHeadingItem` components.
  Customization can now be applied via the new `xcss` prop. This allows for safe/bounded style
  overrides.

  Removed the following types related to the `cssFn` prop: `CSSFn`, `StatelessCSSFn`, `ItemState`.

## 7.1.0

### Minor Changes

- [#157071](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157071)
  [`a149a0b1559ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a149a0b1559ec) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [#156707](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156707)
  [`84d702274b2dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/84d702274b2dd) -
  Migrated `HeadingItem` and `Section` components from @emotion/react to @compiled/react in order to
  improve performance, align with the rest of the Atlaskit techstack, and support React 18 Streaming
  SSR.

  Removed the deprecated `cssFn` prop from the `HeadingItem` component, as this is not supported
  with @compiled/react.

## 6.0.0

### Major Changes

- [#148607](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148607)
  [`474e66c7b2f54`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/474e66c7b2f54) -
  Removed deprecated `overrides` prop from Section. Introduced `isSideNavSection` prop on Section
  which when true renders headings with reduced padding. This prop was added exclusively to support
  existing functionality in `@atlaskit/side-navigation` and will be removed once the new navigation
  system fully rolls out. It should not be used outside of the Side Navigation component. Removed
  deprecated `Overrides` and `TitleOverrides` types.

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#150647](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150647)
  [`a0fe499b55985`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a0fe499b55985) -
  Adds a `:focus` style reset to menu items to prevent :focus styles with lower specificity from
  leaking through.

## 5.0.0

### Major Changes

- [#146281](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146281)
  [`ebb2af6f3c40f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebb2af6f3c40f) -
  Removed deprecated `overrides` props from ButtonItem, CustomItem, and LinkItem, and from the
  BaseItemProps type export. Introduced `isTitleHeading` prop on CustomItem which when true renders
  its children in a `h2` element rather than the default `span`.

## 4.0.0

### Major Changes

- [#141631](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141631)
  [`064a20b174719`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/064a20b174719) - -
  Migrated `ButtonItem`, `LinkItem` and `CustomItem` components from `@emotion/react` to
  `@compiled/react` in order to improve performance, align with the rest of the Atlaskit techstack,
  and support React 18 Streaming SSR.

  - Removed the deprecated `cssFn` prop from `ButtonItem`, `LinkItem` and `CustomItem` components.

  Please note, in order to use this version of `@atlaskit/menu`, you will need to ensure that your
  bundler is configured to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 3.2.0

### Minor Changes

- [#132213](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132213)
  [`df53b836e03ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/df53b836e03ce) -
  Adds the className prop to the MenuItem type. Although the className prop was already supported by
  the Menu Item components, this change enables its usage with type safety.

## 3.1.2

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#118691](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118691)
  [`fe3551cf3dd67`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fe3551cf3dd67) -
  We are testing improvements behind a feature flag. Menu items will support icons regardless of
  their spacing. If this fix is successful it will be available in a later release.

## 3.0.0

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

## 2.14.4

### Patch Changes

- Updated dependencies

## 2.14.3

### Patch Changes

- [#113256](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113256)
  [`ae6561e3b5b1e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ae6561e3b5b1e) -
  Update dependencies and remove old codemods.

## 2.14.2

### Patch Changes

- Updated dependencies

## 2.14.1

### Patch Changes

- Updated dependencies

## 2.14.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.13.8

### Patch Changes

- Updated dependencies

## 2.13.7

### Patch Changes

- [#174905](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/174905)
  [`450cbe9dbf8ff`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/450cbe9dbf8ff) -
  Upgrade from react-router-dom v4 to v6.

## 2.13.6

### Patch Changes

- [#167504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167504)
  [`3aef43e98843a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3aef43e98843a) -
  Internal change to how styles are applied. There is no expected visual change.

## 2.13.5

### Patch Changes

- Updated dependencies

## 2.13.4

### Patch Changes

- [#168892](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168892)
  [`5eb2a70adb262`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5eb2a70adb262) -
  Remove react-router-dom from devDependencies as it is incompatible with React 18.

## 2.13.3

### Patch Changes

- [#166087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166087)
  [`3ab7d7da348ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ab7d7da348ab) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 2.13.2

### Patch Changes

- Updated dependencies

## 2.13.1

### Patch Changes

- Updated dependencies

## 2.13.0

### Minor Changes

- [#151342](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151342)
  [`2518d31182356`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2518d31182356) -
  Removed feature flag platform.design-system-team.section-1px-seperator-borders, changing the
  border for menu sections from 2px to 1px.

## 2.12.7

### Patch Changes

- Updated dependencies

## 2.12.6

### Patch Changes

- [#148720](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/148720)
  [`fcf151627c8de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fcf151627c8de) -
  Added interactionName to components in menu and dropdownmenu

## 2.12.5

### Patch Changes

- Updated dependencies

## 2.12.4

### Patch Changes

- [#144715](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144715)
  [`dac4cd0c2919b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dac4cd0c2919b) -
  Added UFO interaction metrics to ButtonItem

## 2.12.3

### Patch Changes

- [#144779](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/144779)
  [`de2f4742e3595`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/de2f4742e3595) -
  [ux] Removed menu section header capitalisation.

## 2.12.2

### Patch Changes

- [#129726](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129726)
  [`778c15c1d279a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/778c15c1d279a) -
  [ux] Removed feature flag `platform.design-system-team.menu-tokenised-typography-styles` resulting
  in minor changes to typography and spacing.

## 2.12.1

### Patch Changes

- Updated dependencies

## 2.12.0

### Minor Changes

- [#128489](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128489)
  [`a88a2fe454eb9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a88a2fe454eb9) -
  Updated LinkItem to not render a router link when the href is empty (e.g. href="" or
  href={undefined}).

## 2.11.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 2.10.1

### Patch Changes

- Updated dependencies

## 2.10.0

### Minor Changes

- [`8b8090800a35d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b8090800a35d) -
  Bump peer dependency for react-dom to include version 17 and 18.

## 2.9.0

### Minor Changes

- [#125278](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125278)
  [`f80ae8ed91fc9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f80ae8ed91fc9) -
  Adding data-vc attributes for tracking TTVC (go/ttvc).

## 2.8.1

### Patch Changes

- [#120605](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120605)
  [`0fd1aa0fa64aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fd1aa0fa64aa) -
  Clean up stale feature gate, no functional changes.
- Updated dependencies

## 2.8.0

### Minor Changes

- [#120033](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120033)
  [`89fdaa528833e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89fdaa528833e) -
  Added an UNSAFE_isDraggable prop to LinkItem and menu item that disable drag overrides within the
  components

## 2.7.4

### Patch Changes

- [#119132](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119132)
  [`68ee7be8867d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/68ee7be8867d0) -
  Remove remnants of `extract-react-types` from tsconfig file.

## 2.7.3

### Patch Changes

- [#119110](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119110)
  [`cb28fa67e9a16`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb28fa67e9a16) -
  Update Atlaskit docs so that they point to current ADS site. Remove remnants of
  `extract-react-types`.

## 2.7.2

### Patch Changes

- Updated dependencies

## 2.7.1

### Patch Changes

- [`89377ac3c7f25`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/89377ac3c7f25) -
  Removed internal props from link item and custom item that prevent drag and drop functionality
  from being applied

## 2.7.0

### Minor Changes

- [#117121](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117121)
  [`a3a6ca91979d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3a6ca91979d4) -
  Adds a new optional `UNSAFE_shouldDisableRouterLink` prop, which when set to `true`, will opt out
  of using a router link and instead use a regular anchor element.

## 2.6.2

### Patch Changes

- [#116025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116025)
  [`cd506a937e44f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd506a937e44f) -
  Internal change to how typography is applied. There should be no visual change.

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#115893](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115893)
  [`78d9ff4de5251`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/78d9ff4de5251) -
  Updated LinkItem to conditionally render a router link if a link component is set in the app
  provider and the provided href prop is not an external link or a non-HTTP-based link (e.g. emails,
  phone numbers, hash links etc.). These changes are behind a feature flag and will be available in
  a later release if successful.

## 2.5.2

### Patch Changes

- Updated dependencies

## 2.5.1

### Patch Changes

- Updated dependencies

## 2.5.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 2.4.1

### Patch Changes

- Updated dependencies

## 2.4.0

### Minor Changes

- [#99829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99829)
  [`1e40876a2c40`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1e40876a2c40) -
  Accessibility improvements. Adds a new `titleId` prop to Section.

## 2.3.1

### Patch Changes

- [#105560](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105560)
  [`77772d4d1a22`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77772d4d1a22) -
  [ux] We are testing a visual change behind a feature flag. The capitalisation of menu heading
  remains active for tokenised styles. If this change is successful it will be available in a later
  release.

## 2.3.0

### Minor Changes

- [#100991](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100991)
  [`364a95234076`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/364a95234076) -
  [ux] We are testing a visual change behind a feature flag. The line height of menu item title
  changes. If this change is successful it will be available in a later release.

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#93679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93679)
  [`b35e71a29db0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b35e71a29db0) -
  Add support for React 18 in non-strict mode.

## 2.1.13

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 2.1.12

### Patch Changes

- [#88717](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88717)
  [`d92770eae702`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d92770eae702) -
  Adding internal eslint opt outs for a new rule
  `@atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop`.

## 2.1.11

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.1.10

### Patch Changes

- Updated dependencies

## 2.1.9

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085)
  [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) -
  Update usage of `React.FC` to explicity include `children`

## 2.1.8

### Patch Changes

- Updated dependencies

## 2.1.7

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130)
  [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) -
  Update new button text color fallback for default theme (non-token) to match that of old button
  current text color

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- [#58913](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58913)
  [`36796c121e2a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/36796c121e2a) -
  [ux] This change includes heading role for HeadingItem and new prop `headingLevel` to specify the
  level of heading to be defined by assistive technologies.

## 2.1.3

### Patch Changes

- [#58188](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58188)
  [`e15a2a9480ee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e15a2a9480ee) -
  update deprecation guidance for PopupMenuGroup

## 2.1.2

### Patch Changes

- [#42474](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42474)
  [`d7400cb1aa2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7400cb1aa2) - Adds a
  platform feature flag to adjust Menu Section seperator border widths from 2px to 1px.
- Updated dependencies

## 2.1.1

### Patch Changes

- [#41915](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41915)
  [`99b579bdc84`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99b579bdc84) - Fix
  error in codemod

## 2.1.0

### Minor Changes

- [#41571](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41571)
  [`997b0489687`](https://bitbucket.org/atlassian/atlassian-frontend/commits/997b0489687) - Add
  codemod to convert link item components with invalid `href` attributes to button items. The `href`
  attribute will be required for link items in a later major upgrade. Using this will ease the
  transition.

## 2.0.1

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 2.0.0

### Major Changes

- [#41355](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41355)
  [`cd1c813da18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd1c813da18) - Menu
  items now have a secondary selected state (border or notch), this was previously feature flagged
  for Atlassian experiences and is now available for everyone.

  This change makes all menu items are now relatively positioned, if you had any child elements that
  leaned on this behaviour your experiences will now be broken!

  For example the below code code previously the `div` would be positioned relatively to the menu
  group element. Now, it is positioned relatively to the button item element.

  ```jsx
  <MenuGroup>
  	<ButtonItem>
  		<div style={{ position: 'absolute', top: '100%' }} />
  	</ButtonItem>
  </MenuGroup>
  ```

  As a path forward you should not be leaning on this behaviour. If you need a popup experience use
  `@atlaskit/dropdown-menu` or `@atlaskit/popup`.

## 1.11.1

### Patch Changes

- [#41025](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41025)
  [`518532660de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/518532660de) - Add
  default for environment variable to fix typechecking under local consumption

## 1.11.0

### Minor Changes

- [#40393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40393)
  [`5545e5a6ab2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5545e5a6ab2) - [ux]
  Adds `isLoading` prop to menu group for better context for assistive technology users.

## 1.10.1

### Patch Changes

- [#38745](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38745)
  [`a962b1b24eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a962b1b24eb) - The
  internal composition of this component has changed. There is no expected change in behavior.

## 1.10.0

### Minor Changes

- [#38470](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38470)
  [`6bb299616f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bb299616f3) - Adds a
  killswitch to turn off unsafe style overrides via a feature flag.

## 1.9.8

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 1.9.7

### Patch Changes

- [#37533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37533)
  [`1ed303de3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed303de3e8) - Updated
  dependencies

## 1.9.6

### Patch Changes

- [#37339](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37339)
  [`71c51a488d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71c51a488d7) - Removes
  max-height constraint on compact density.

## 1.9.5

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 1.9.4

### Patch Changes

- Updated dependencies

## 1.9.3

### Patch Changes

- Updated dependencies

## 1.9.2

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 1.9.1

### Patch Changes

- Updated dependencies

## 1.9.0

### Minor Changes

- [#35164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35164)
  [`0af122e7d0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af122e7d0f) - [ux]
  Prop isList in Section component allows to add `<ul>` and `<li>` elements around the items to
  better semantic markup if it is a list of items

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#35038](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35038)
  [`b53207f89ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b53207f89ef) - The
  internal menu context now can have no border or notch for the selected state. This is being tested
  under a feature flag and if successful will be available in a later release.

### Patch Changes

- Updated dependencies

## 1.7.9

### Patch Changes

- Updated dependencies

## 1.7.8

### Patch Changes

- Updated dependencies

## 1.7.7

### Patch Changes

- Updated dependencies

## 1.7.6

### Patch Changes

- [#34655](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34655)
  [`4b76c41be8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b76c41be8e) - Added
  prop deprecation warnings for cssFn and overrides props. These warnings are displayed in the
  console in development environments only.

## 1.7.5

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 1.7.4

### Patch Changes

- [#34445](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34445)
  [`33f10b7eb36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33f10b7eb36) - Removing
  unused dependencies and dev dependencies

## 1.7.3

### Patch Changes

- [#34369](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34369)
  [`a1c538cb238`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1c538cb238) - Enrol
  @atlaskit/menu on push model consumption in Jira.

## 1.7.2

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051)
  [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 1.7.1

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.7.0

### Minor Changes

- [#33349](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33349)
  [`d518f0e34b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d518f0e34b9) - [ux] We
  are testing a selected indicator change to menu, dropdown-menu, and side-navigation packages
  behind an internal feature flag. If successful this will be released in a later minor release.

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

## 1.5.8

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 1.5.7

### Patch Changes

- Updated dependencies

## 1.5.6

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

- [#31691](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31691)
  [`a8debc96871`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8debc96871) - Internal
  update to menu primitive so it renders a span instead of a div as child of button.

## 1.5.2

### Patch Changes

- [#31378](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31378)
  [`3ca97be0c06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ca97be0c06) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.
- Updated dependencies

## 1.5.1

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.
- Updated dependencies

## 1.5.0

### Minor Changes

- [#30362](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30362)
  [`93d761786d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93d761786d6) - [ux]
  Default spacing for all menu items has been changed from 20px inline padding to 16px.

  Adds a new spacing prop to on `MenuGroup`. The prop can be used to control the content density of
  the component and its children.

  Adds a new internal export `SpacingContext`. This should not be used directly.

## 1.4.10

### Patch Changes

- [#29725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29725)
  [`63c2f0b3f96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63c2f0b3f96) - Internal
  changes to use spacing tokens. There is no expected behaviour or visual change.

## 1.4.9

### Patch Changes

- Updated dependencies

## 1.4.8

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 1.4.7

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 1.4.6

### Patch Changes

- Updated dependencies

## 1.4.5

### Patch Changes

- [#28064](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28064)
  [`b0f6dd0bc35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f6dd0bc35) - Updated
  to use typography tokens. There is no expected behaviour or visual change.

## 1.4.4

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`f96f3ebd861`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f96f3ebd861) - [ux] Use
  color.background.neutral.subtle token to represent transparent background.
- [`981faeea2ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/981faeea2ff) -
  Application of spacing tokens for some internal styles of `MenuPrimitive`.
- [`bcbd0c5b5bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bcbd0c5b5bf) - Fix text
  color styling of disabled descriptions in menu and link items

## 1.4.3

### Patch Changes

- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`3acf8a89149`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3acf8a89149) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 1.3.12

### Patch Changes

- [#26408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26408)
  [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal
  changes to include spacing tokens in component implementations.

## 1.3.11

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`8f2153a45a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f2153a45a7) - Convert
  Menu Group to use primitives.
- Updated dependencies

## 1.3.10

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.3.9

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.3.8

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`b196f69e76b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b196f69e76b) - Menu
  items no longer intercept mouse down events to force focus or blur behavior depending on the last
  focused element.
- Updated dependencies

## 1.3.7

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 1.3.6

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`c8145459eb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8145459eb5) - [ux]
  Updating skeleton token in @atlakist/menu, @atlaskit/theme
- Updated dependencies

## 1.3.5

### Patch Changes

- [#21545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21545)
  [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts
  jsdoc strings to improve prop documentation

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`59e2178901f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59e2178901f) - The
  `isShimmering` prop for skeleton items has been fixed, resolving a regression in version 1.2.0.
- [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 1.3.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`77c46ec96a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77c46ec96a7) - Adds a
  prop for `role` to the MenuGroup component that acts as you'd expect the HTML attribute to act.
  You are now able to override the accessibility role for the element.

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal
  code change turning on a new linting rule.
- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`27467f65f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27467f65f68) - [ux]
  Update headingStyle to color that passes WCAG AA color contrast
- [`2066efabc65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2066efabc65) - A fix
  for the `StatelessCSSFn` type so that it now correctly accetps a void argument.
- [`96cfc6c1c7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96cfc6c1c7f) -
  Deprecates the `cssFn` and `overrides` APIs in '@atlaskit/menu'. These APIs are not performant and
  allow unbounded customisation of the Menu components. These APIs will be removed in a future
  release.
- Updated dependencies

## 1.2.5

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 1.2.2

### Patch Changes

- [#16405](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16405)
  [`2eeb5c46710`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2eeb5c46710) - Menu
  items can take `data-testid` directly again however we recommend to still use the officially
  supported `testId` prop instead. The `data-testid` prop was unintentionally removed in a previous
  version however will be removed as a breaking change in a later major version and remains not
  officially typed.

## 1.2.1

### Patch Changes

- [#16335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16335)
  [`2b2290121eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b2290121eb) - Raised
  the minimum version carat range of focus ring to latest.

## 1.2.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`213bfd77e61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/213bfd77e61) - The DOM
  structure of menu item components has been flattened. If you used CSS hacks (via className or
  cssFn) that targetted specific DOM nodes you may be broken.

  Previously the structure looked like:

  ```jsx
  <button>
    <div> // <-- this intermediate div has been removed
      <span>
        <span />
      </span>
    </div>
  </button>
  ```

  Now it looks like:

  ```jsx
  <button>
  	<span>
  		<span />
  	</span>
  </button>
  ```

- [`63888b03b49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63888b03b49) - Internal
  refactor to align style declarations to common techstack.

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#15632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15632)
  [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds
  explicit type to button usages components.

## 1.1.3

### Patch Changes

- [#15531](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15531)
  [`192d35cfdbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/192d35cfdbd) - Defaults
  native button usage to type="button" to prevent unintended submittig of forms.

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`224028babd3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/224028babd3) - Menu now
  uses the design system and emotion styling techstacks.
- [`506282a89f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/506282a89f2) - [ux]
  Menu items now have their text color set using `currentColor` instead of using colors directly off
  the palette.
- [`58832848c98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58832848c98) -
  Instrumented menu with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`f5a527024d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5a527024d4) - Suppress
  `@atlaskit/design-system/ensure-design-token-usage` token fallback errors.
- Updated dependencies

## 1.0.4

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 1.0.3

### Patch Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`3c1182fdf13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c1182fdf13) - added
  optional `role` prop to link item for a11y

## 1.0.2

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 1.0.1

### Patch Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`1648daf0308`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1648daf0308) - Updates
  button item props.

## 1.0.0

### Major Changes

- [#10609](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10609)
  [`7727f723965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7727f723965) - Internal
  change to the release model from continous to scheduled release. There are **NO API CHANGES** in
  this release.

## 0.7.6

### Patch Changes

- [#10255](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10255)
  [`9ea5f8887cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ea5f8887cd) - Internal
  change to menu styling to allow for the separator color to be customisable in side-navigation

## 0.7.5

### Patch Changes

- [#9595](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9595)
  [`21713b1335a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/21713b1335a) - [ux]
  adding shouldTitleWrap and shouldDescriptionWrap prop to menu items for wrap long text in title
  and description

## 0.7.4

### Patch Changes

- [#8861](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8861)
  [`a1def13c6fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1def13c6fb) -
  Restructure the package to align with lite mode convention, and introduce entry points to each
  item type

## 0.7.3

### Patch Changes

- [#8637](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8637)
  [`451f220a771`](https://bitbucket.org/atlassian/atlassian-frontend/commits/451f220a771) - Set
  disabled/aria-disabled for menu item HTML elements, and prevent mouse events when the item is
  disabled
- [`981c9be6b32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/981c9be6b32) - Fix
  generics for custom item to work with typed components from external libs
- [`11fea0f7e4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11fea0f7e4b) - Memoise
  menu item variants

## 0.7.2

### Patch Changes

- [#8514](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8514)
  [`1b5d5c0fca9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b5d5c0fca9) - Use
  light mode values instead of calling the themed() API

## 0.7.1

### Patch Changes

- [#8404](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8404)
  [`0b2f7e76803`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b2f7e76803) - Codemods
  will only format a file if it is mutated.

## 0.7.0

### Minor Changes

- [#6194](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6194)
  [`79a40dec30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79a40dec30) -
  **Breaking** Adjusts the API of the cssFn prop used in both menu and side-navigation. The prop now
  no longer exposes the currentStyles to the user in the callback and instead only provides the
  current state. Users no longer need to spread the currentStyles into their components when
  overriding. This change also resolves a bug where cssFn overrides did not always take precedence
  correctly over the default component styles.

## 0.6.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.6.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.6.3

### Patch Changes

- Updated dependencies

## 0.6.2

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 0.6.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.6.0

### Minor Changes

- [#4029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4029)
  [`63625ea30c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63625ea30c) - Add
  `aria-current="page"` attribute to anchor tag when `isSelected` prop is `true` for `LinkItem`
  component.

## 0.5.2

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 0.5.1

### Patch Changes

- [#3515](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3515)
  [`a70b60d9f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a70b60d9f1) - The line
  height of menu items has been slightly increased to accomodate descender spacing viewed on
  non-retina displays.

## 0.5.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.4.7

### Patch Changes

- [#3025](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3025)
  [`952087be5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952087be5b) - Item
  components now blur themselves during the mouse down event.

## 0.4.6

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 0.4.5

### Patch Changes

- [#2537](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2537)
  [`d674e203b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d674e203b3) - Previously
  Menu items controlled their own margin spacing which caused issues when trying to use them outside
  of Menu. Now we have moved Menu item margin styles into the Section component so now the Section
  dictates the spacing around child items. We had to update Side Navigation to control its child
  item margins as well.

## 0.4.4

### Patch Changes

- [#2430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2430)
  [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all
  packages that are used by confluence that have a broken es2019 dist

## 0.4.3

### Patch Changes

- [#2393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2393)
  [`eb2ed36f5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb2ed36f5a) - Fix
  characters with descenders (eg. 'g', 'j', 'p') in Menu Items from being clipped by increasing the
  line-height.

## 0.4.2

### Patch Changes

- [#2039](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2039)
  [`0b64c87548`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b64c87548) - FIX:
  Global `a:visited` styles should not override LinkItem `:visited` styles

## 0.4.1

### Patch Changes

- [patch][1e7e54c20e](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7e54c20e):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/avatar@17.1.10

## 0.4.0

### Minor Changes

- [minor][7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):

  **BREAKING** - renames `elemBefore` and `elemAfter` props to `iconBefore` and `iconAfter` on all
  item components.-
  [minor][41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):

  **BREAKING**: modifies custom item component to take only valid HTML attributes. This means
  `wrapperClass` is now known as `className`.-
  [minor][fb3ca3a3b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb3ca3a3b2):

  **BREAKING** - removes `cssFn` from section component, introduces overrides on section component
  to override heading css.

### Patch Changes

- [patch][6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):

  Exposes typescript types alongside components.-
  [patch][e4dde0ad13](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dde0ad13):

  Fixes custom item not passing selected and disabled props to the customized component.-
  [patch][971e294b1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/971e294b1e):

  Corrects background color for disabled item to transparent.-
  [patch][684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):

  Improves type safety with custom item by using TypeScript generics to pass on the custom component
  types to the parent.-
  [patch][286770886d](https://bitbucket.org/atlassian/atlassian-frontend/commits/286770886d):

  Fixes item skeleton icon size to be slightly smaller than the real icon.-
  [patch][2c1b78027c](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c1b78027c):

  Fixes skeleton heading and item ui.- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies
  [aff1210e19](https://bitbucket.org/atlassian/atlassian-frontend/commits/aff1210e19):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10
  - @atlaskit/icon-file-type@5.0.4

## 0.3.1

### Patch Changes

- [patch][ed8d8dea65](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8d8dea65):

  Clean-up import statements-
  [patch][db2f869556](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2f869556):

  Corrects separator color.-
  [patch][81ea791176](https://bitbucket.org/atlassian/atlassian-frontend/commits/81ea791176):

  Adds overrides for title component.-
  [patch][e57c4aa96d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e57c4aa96d):

  Fixes vertical alignment for menu items in IE11.-
  [patch][89d35b919a](https://bitbucket.org/atlassian/atlassian-frontend/commits/89d35b919a):

  Adds css function to skeleton components.-
  [patch][083cfbaeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/083cfbaeb4):

  Improvement: `Section` now contains an optional `title` prop, which will be passed into an
  internal `HeadingItem` if provided. See the `Section` documentation for more details-
  [patch][46d95777ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d95777ef):

  Fixes width override in item skeleton component not being applied correctly.-
  [patch][9b264df34d](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b264df34d):

  Fixes users being able to select text and drag both the link and custom item components.- Updated
  dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):

  - @atlaskit/docs@8.5.0

## 0.3.0

### Minor Changes

- [minor][7a6e5f6e3d](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6e5f6e3d):

  Support forward ref on ButtonItem and LinkItem

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
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon-file-type@5.0.3
  - @atlaskit/icon-object@5.0.3
  - @atlaskit/icon@20.1.0
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9

## 0.2.7

### Patch Changes

- [patch][1f9c4f974a](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f9c4f974a):

  Updates to @atlaskit/menu to support better custom components

  - The `description` prop on items has been updated to take either `string` or `JSX.Element`
    allowing custom components such as links to be rendered
  - A stateless CSSFn type has been exported to override styles in static components (such as
    `<HeadingItem />`)- Updated dependencies
    [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/icon@20.0.2

## 0.2.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/icon-file-type@5.0.2
  - @atlaskit/icon-object@5.0.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/theme@9.5.1

## 0.2.5

### Patch Changes

- [patch][77ffd08ea0](https://bitbucket.org/atlassian/atlassian-frontend/commits/77ffd08ea0):

  Adds `onClick` prop to menu group component.-
  [patch][0ae6ce5d46](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae6ce5d46):

  Forwards ref of the button item component.

## 0.2.4

### Patch Changes

- [patch][4ed951b8d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ed951b8d8):

  Fixes on click being fired when items were disabled.-
  [patch][e0e91e02a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0e91e02a6):

  Adds support for a `cssFn` prop that allows consumers to override the styles of ButtonItem and
  LinkItem.- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

- Updated dependencies
  [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 0.2.3

### Patch Changes

- [patch][ab0e00f203](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab0e00f203):

  Fixes width being 100% on link and custom item. Adds export types to the main package.

## 0.2.2

### Patch Changes

- [patch][911d58c568](https://bitbucket.org/atlassian/atlassian-frontend/commits/911d58c568):

  - Fixes spacing between sections and items
  - Introduces new props on `MenuGroup` to control min/max width and height.
  - Introduces new `PopupMenuGroup` component which is variant of `MenuGroup` with sensible
    defaults.

## 0.2.1

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

## 0.2.0

### Minor Changes

- [minor][795a9503da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/795a9503da):

  Menu has had few styling fixes:

  - **BREAKING:** Height for all `Item` components when there is no `description` defined now equals
    `40px`.
  - **BREAKING:** `SkeletonHeadingItem` & `SkeletonItem` now match the real components dimensions,
    this means they will no longer move things around when swapping them in & out.
  - `SkeletonHeadingItem` has had its width slightly increased.
  - `Skeleton` items now have a shimmer effect that you can opt into with the `isShimmering` prop.
  - `HeadingItem` now has the correct `font-weight`.
  - `Item` components `description` now has the correct `font-size`.

### Patch Changes

- [patch][b7b0ead295](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7b0ead295):

  Adds `testId` to all components - useful when wanting to do any automated tests that want to
  target these specific elements.- Updated dependencies
  [429925f854](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/429925f854):

  - @atlaskit/theme@9.4.0

## 0.1.3

### Patch Changes

- [patch][9af7977678](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9af7977678):

  Fixing visual tweaks for top nav and menu spacing

## 0.1.2

### Patch Changes

- [patch][3b785fa323](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b785fa323):

  Various UI fixes

## 0.1.1

### Patch Changes

- [patch][ac6ba9b837](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac6ba9b837):

  Fix bug where Skeleton width wasn't being picked up. Allow skeleton heading width to be
  configurable to make API consistent with skeleton item

## 0.1.0

### Minor Changes

- [minor][d85f0206b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d85f0206b0):

  added isSelected prop to Items

## 0.0.2

### Patch Changes

- [patch][eaca633b3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaca633b3d):

  Style ItemSkeletons and ItemHeadings. Add the ability to add icon or avatar and configure skeleton
  width.

## 0.0.1

### Patch Changes

- [patch][ba4eed96dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba4eed96dc):

  Create Menu package and expose `Item` and `LinkItem` components
