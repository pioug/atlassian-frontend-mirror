# @atlaskit/side-navigation

## 11.0.32

### Patch Changes

- Updated dependencies

## 11.0.31

### Patch Changes

- [`d14ea5f60b689`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d14ea5f60b689) -
  chore: migrate platform UI & component libraries icon imports from migration paths to core

## 11.0.30

### Patch Changes

- Updated dependencies

## 11.0.29

### Patch Changes

- [`a60a82196851a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a60a82196851a) -
  Internal refactors to remove unused variables. No functional or public changes.
- Updated dependencies

## 11.0.28

### Patch Changes

- [`265c7c2662121`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c7c2662121) -
  Migrating custom icons.
- Updated dependencies

## 11.0.27

### Patch Changes

- Updated dependencies

## 11.0.26

### Patch Changes

- Updated dependencies

## 11.0.25

### Patch Changes

- Updated dependencies

## 11.0.24

### Patch Changes

- Updated dependencies

## 11.0.23

### Patch Changes

- Updated dependencies

## 11.0.22

### Patch Changes

- Updated dependencies

## 11.0.21

### Patch Changes

- Updated dependencies

## 11.0.20

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 11.0.19

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.
- Updated dependencies

## 11.0.18

### Patch Changes

- Updated dependencies

## 11.0.17

### Patch Changes

- Updated dependencies

## 11.0.16

### Patch Changes

- Updated dependencies

## 11.0.15

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 11.0.14

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 11.0.13

### Patch Changes

- Updated dependencies

## 11.0.12

### Patch Changes

- Updated dependencies

## 11.0.11

### Patch Changes

- Updated dependencies

## 11.0.10

### Patch Changes

- Updated dependencies

## 11.0.9

### Patch Changes

- Updated dependencies

## 11.0.8

### Patch Changes

- Updated dependencies

## 11.0.7

### Patch Changes

- [#174616](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/174616)
  [`ee906c44a058e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee906c44a058e) -
  Internal refactors to accomodate for platform package rename.

## 11.0.6

### Patch Changes

- Updated dependencies

## 11.0.5

### Patch Changes

- Updated dependencies

## 11.0.4

### Patch Changes

- [#164701](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164701)
  [`f83ed2799dd47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f83ed2799dd47) -
  Internal refactor. This removes a temporary workaround to increase the specificity of some
  Compiled styles. This is no longer needed now that this package has been completely migrated from
  Emotion to Compiled.

## 11.0.3

### Patch Changes

- Updated dependencies

## 11.0.2

### Patch Changes

- [#160530](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160530)
  [`3d97095c489a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d97095c489a5) -
  Internal change to align styling solutions.
- Updated dependencies

## 11.0.1

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 11.0.0

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

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [#157071](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157071)
  [`a149a0b1559ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a149a0b1559ec) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 10.0.0

### Major Changes

- [#156707](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156707)
  [`84d702274b2dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/84d702274b2dd) -
  Migrated `HeadingItem` and `Section` components from @emotion/react to @compiled/react in order to
  improve performance, align with the rest of the Atlaskit techstack, and support React 18 Streaming
  SSR.

  Removed the deprecated `cssFn` prop from the `HeadingItem` component, as this is not supported
  with @compiled/react.

### Patch Changes

- Updated dependencies

## 9.2.0

### Minor Changes

- [#148607](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148607)
  [`96c3ed72d55bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/96c3ed72d55bf) -
  Internal change to Section component to remove deprecated APIs.

### Patch Changes

- Updated dependencies

## 9.1.1

### Patch Changes

- Updated dependencies

## 9.1.0

### Minor Changes

- [#146281](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/146281)
  [`14f44715214af`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14f44715214af) -
  Internal change to Header component to remove deprecated APIs.

### Patch Changes

- Updated dependencies

## 9.0.0

### Major Changes

- [#141631](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141631)
  [`c6c9daf3fbca2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c6c9daf3fbca2) -
  Removed the deprecated `cssFn` prop from `ButtonItem`, `LinkItem`, `CustomItem` and `GoBackItem`
  components.

### Patch Changes

- Updated dependencies

## 8.0.0

### Major Changes

- [#138235](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138235)
  [`98d3b1420253a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98d3b1420253a) -
  Removes the deprecated `cssFn` prop from `NestingItem` and adds the `className` prop. This allows
  `NestingItem` style overrides that are compatible with Compiled CSS-in-JS.

## 7.0.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 7.0.0

### Major Changes

- [#129933](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129933)
  [`67ff94142c5ad`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/67ff94142c5ad) -
  Removes the deprecated cssFn prop from the Header and Footer components.

## 6.0.3

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- [#124556](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124556)
  [`48adeb70784c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/48adeb70784c5) -
  Updated dependencies and removed old codemods.

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Major Changes

- [#119150](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119150)
  [`5ae7ca716c848`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5ae7ca716c848) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/side-navigation`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

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

## 4.2.5

### Patch Changes

- Updated dependencies

## 4.2.4

### Patch Changes

- [#114382](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114382)
  [`5033cb80b3765`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5033cb80b3765) -
  Updates internal animation logic to leverage static animation timing names, rather than arbitrary
  values.
- Updated dependencies

## 4.2.3

### Patch Changes

- Updated dependencies

## 4.2.2

### Patch Changes

- Updated dependencies

## 4.2.1

### Patch Changes

- Updated dependencies

## 4.2.0

### Minor Changes

- [#95255](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95255)
  [`55f6cfd027e9e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/55f6cfd027e9e) -
  Revert the Compiled migration introduced in `v4.0.0`, as it caused laggy animations in nested
  navigation. The migration will be reintroduced once `@atlaskit/motion` has been updated to use
  Compiled.

## 4.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [#95255](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95255)
  [`155e525c3b156`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/155e525c3b156) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/side-navigation`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 3.6.8

### Patch Changes

- Updated dependencies

## 3.6.7

### Patch Changes

- [#181731](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181731)
  [`910a3ef2381d3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/910a3ef2381d3) -
  Add isSSRPlaceholderEnabled prop for side and top nav v3

## 3.6.6

### Patch Changes

- [#178053](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/178053)
  [`cb318c8c28c26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb318c8c28c26) -
  Internal changes to typography.

## 3.6.5

### Patch Changes

- Updated dependencies

## 3.6.4

### Patch Changes

- [#167504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167504)
  [`3aef43e98843a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3aef43e98843a) -
  Internal change to how styles are applied. There is no expected visual change.
- Updated dependencies

## 3.6.3

### Patch Changes

- [#168160](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168160)
  [`5c96046203b6f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c96046203b6f) -
  Tag top and side navigation components for SSR placeholder replacement

## 3.6.2

### Patch Changes

- [#167483](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/167483)
  [`2dd22b00bedaa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2dd22b00bedaa) -
  Add props for handling server rendered components and data-vc

## 3.6.1

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 3.6.0

### Minor Changes

- [#160699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160699)
  [`a4cb190f3a282`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a4cb190f3a282) -
  Side navigation, keyboard focus should appear on first interactive element which is `Go back`
  button and when `Go back` control is activated, focus should appear on the triggered element.

## 3.5.5

### Patch Changes

- Updated dependencies

## 3.5.4

### Patch Changes

- Updated dependencies

## 3.5.3

### Patch Changes

- Updated dependencies

## 3.5.2

### Patch Changes

- Updated dependencies

## 3.5.1

### Patch Changes

- [#140090](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140090)
  [`2f4fd6db3e451`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f4fd6db3e451) -
  Removes unused devDep react-beautiful-dnd

## 3.5.0

### Minor Changes

- [#137781](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137781)
  [`21bfb50836bad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21bfb50836bad) -
  Migrated to use new iconography behind a feature flag.

### Patch Changes

- Updated dependencies

## 3.4.2

### Patch Changes

- [#129726](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129726)
  [`778c15c1d279a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/778c15c1d279a) -
  [ux] Removed feature flag
  `platform.design-system-team.side-navigation-tokenised-typography-styles` resulting in minor
  visual changes to typography.

## 3.4.1

### Patch Changes

- Updated dependencies

## 3.4.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 3.3.6

### Patch Changes

- Updated dependencies

## 3.3.5

### Patch Changes

- Updated dependencies

## 3.3.4

### Patch Changes

- Updated dependencies

## 3.3.3

### Patch Changes

- Updated dependencies

## 3.3.2

### Patch Changes

- [#114764](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114764)
  [`ae20dac6e31c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ae20dac6e31c4) -
  Bump packages to use react-beautiful-dnd@12.2.0

## 3.3.1

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#105180](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105180)
  [`10ab455ab24b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10ab455ab24b) -
  [ux] We are testing a visual change behind a feature flag. The letter spacing of side navigation
  header title changes. If this change is successful it will be available in a later release.

## 3.1.3

### Patch Changes

- [#102250](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102250)
  [`ba7dc54866b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba7dc54866b9) -
  Update footer to use logical property for padding. Internal changes to tokenise typography values.

## 3.1.2

### Patch Changes

- [#98707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98707)
  [`7cce9cbf2f08`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7cce9cbf2f08) -
  Internal changes to how text is rendered. There is no expected visual change.

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#94389](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94389)
  [`5ca1173e141e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5ca1173e141e) -
  Add support for React 18 in non-strict mode.

## 3.0.10

### Patch Changes

- [#83188](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83188)
  [`cd5d06cd3329`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd5d06cd3329) -
  Minor adjustments to improve compatibility with React 18

## 3.0.9

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 3.0.8

### Patch Changes

- Updated dependencies

## 3.0.7

### Patch Changes

- Updated dependencies

## 3.0.6

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 3.0.3

### Patch Changes

- [#43918](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43918)
  [`d100ca42f46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d100ca42f46) - Push
  model consumption configuration done for these packages

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#42240](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42240)
  [`e5f784d7889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5f784d7889) - Add
  explicit `href` to link item.

## 3.0.0

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

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#39812](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39812)
  [`879275819ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/879275819ed) - Fix for
  `data-testid` not being applied to Header.

## 2.0.3

### Patch Changes

- [#39264](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39264)
  [`e3b28897c5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3b28897c5f) - Internal
  code changes. There is no expected change in behaviour.
- Updated dependencies

## 2.0.2

### Patch Changes

- [#39419](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39419)
  [`bff06efcf86`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bff06efcf86) - Fix a
  bug where `className` was not being applied to Header.

## 2.0.1

### Patch Changes

- [#38751](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38751)
  [`cac6bbb702d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cac6bbb702d) - The
  internal composition of this component has changed. There is no expected change in behavior.

## 2.0.0

### Major Changes

- [#38561](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38561)
  [`cf66b43d67a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf66b43d67a) - Updated
  spacing of Side Navigation components to ensure token values and fallbacks are matching. When used
  with space tokens enabled, there is no visual difference with the previous release of Side
  Navigation. When used without space tokens enabled there will be a slight visual difference; we
  recommend enabling space tokens if they are not already enabled to resolve this.

## 1.10.4

### Patch Changes

- [#37533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37533)
  [`1ed303de3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed303de3e8) - Updated
  dependencies

## 1.10.3

### Patch Changes

- Updated dependencies

## 1.10.2

### Patch Changes

- Updated dependencies

## 1.10.1

### Patch Changes

- Updated dependencies

## 1.10.0

### Minor Changes

- [#36118](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36118)
  [`ee296a14a87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee296a14a87) - Adds the
  `showTopScrollIndicator` prop to the nestable navigation content component. This prop should be
  used only when needed to distinctly separate the side navigation header from the side navigation
  content.

## 1.9.0

### Minor Changes

- [#35164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35164)
  [`0af122e7d0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af122e7d0f) - [ux]
  Prop isList in Section component allows to add `<ul>` and `<li>` elements around the items to
  better semantic markup if it is a list of items

### Patch Changes

- Updated dependencies

## 1.8.10

### Patch Changes

- Updated dependencies

## 1.8.9

### Patch Changes

- Updated dependencies

## 1.8.8

### Patch Changes

- [#35385](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35385)
  [`967dd926bfc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/967dd926bfc) - Updates
  all navigation components to use border/shape tokens. This is a no-op as these tokens are not
  enabled in product.
- Updated dependencies

## 1.8.7

### Patch Changes

- [#35460](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35460)
  [`4757acc0f98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4757acc0f98) - Internal
  change to use space tokens for spacing properties. There is no visual change.

## 1.8.6

### Patch Changes

- Updated dependencies

## 1.8.5

### Patch Changes

- Updated dependencies

## 1.8.4

### Patch Changes

- Updated dependencies

## 1.8.3

### Patch Changes

- [#34881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34881)
  [`774ed69ecef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/774ed69ecef) - Internal
  changes to use space tokens for spacing values. There is no visual change.

## 1.8.2

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 1.8.1

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.8.0

### Minor Changes

- [#33349](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33349)
  [`d518f0e34b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d518f0e34b9) - [ux] We
  are testing a selected indicator change to menu, dropdown-menu, and side-navigation packages
  behind an internal feature flag. If successful this will be released in a later minor release.

### Patch Changes

- Updated dependencies

## 1.7.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.7.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.6.8

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`65e4baeea85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65e4baeea85) - Internal
  changes.

## 1.6.7

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 1.6.6

### Patch Changes

- Updated dependencies

## 1.6.5

### Patch Changes

- [#32173](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32173)
  [`f7f852b0a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7f852b0a4f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 1.6.4

### Patch Changes

- Updated dependencies

## 1.6.3

### Patch Changes

- Updated dependencies

## 1.6.2

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [#31378](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31378)
  [`3ca97be0c06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ca97be0c06) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.
- Updated dependencies

## 1.6.0

### Minor Changes

- [#30362](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30362)
  [`62c9d42799c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62c9d42799c) - [ux] The
  `Footer` component will now warn a user if they are relying on a deprecated API. The `cssFn`,
  `onClick` and `component` are all considered deprecated APIs for `Footer`.

  Additionally, the space between icons and content has been shifted form `16px` to `12px`. This
  matches `@atlaskit/menu`.

  These APIs will be removed from Footer in a future major release. To suppress the warning you can
  choose to use the `useDeprecatedApi={false}` prop which opts into the new API.

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 1.5.1

### Patch Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`eadbf13d8c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eadbf13d8c0) - Updated
  usages of `Text`, `Box`, `Stack`, and `Inline` primitives to reflect their updated APIs. There are
  no visual or behaviour changes.
- Updated dependencies

## 1.5.0

### Minor Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`caa68aad0fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caa68aad0fd) - Internal
  changes around styles:
  - Application of primitives for more declarative code
  - Application of spacing tokens to internal styles

### Patch Changes

- [`f96f3ebd861`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f96f3ebd861) - [ux] Use
  color.background.neutral.subtle token to represent transparent background.
- [`fbe4c12c94b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbe4c12c94b) - DTR-995
  fix move page dialog bg color

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

- [#26817](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26817)
  [`5c065ba2010`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c065ba2010) - Improve
  state management to allow detection of invalid stack state. Add prop `onUnknownNest` to allow
  handling of invalid stack state.

## 1.3.1

### Patch Changes

- [#26390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26390)
  [`5f36f2ce46d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f36f2ce46d) - Adds a
  defensive `css()` function wrapping to many of the style calls in the side-navigation package.
  This is expected to help fix an issue with certain styles in side navigation not appearing if
  consumed when different versions of `@emotion` are present on the page.

## 1.3.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`02e2f7aacef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02e2f7aacef) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 1.2.15

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.2.14

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.2.13

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`b2767947029`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2767947029) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 1.2.12

### Patch Changes

- Updated dependencies

## 1.2.11

### Patch Changes

- [#21545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21545)
  [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts
  jsdoc strings to improve prop documentation

## 1.2.10

### Patch Changes

- Updated dependencies

## 1.2.9

### Patch Changes

- [#21309](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21309)
  [`85ca75319b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85ca75319b1) - Move
  side-navigation docs to Constellation (atlassian.design)

## 1.2.8

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.2.7

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`0f8fe0b80aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f8fe0b80aa) - Adds
  deprecated status to `cssFn` prop. Please avoid using this prop as we intend to remove the prop
  completely in a future release.
- Updated dependencies

## 1.2.3

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

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

- [`e4f332d8697`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4f332d8697) - Internal
  refactor to update style declarations to match menu changes.

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

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`0e1894c8eb0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e1894c8eb0) -
  Instrumented side navigation with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#11491](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11491)
  [`7c843858398`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c843858398) - [ux]
  LinkItem and CustomItem now have correct blue text color when selected and the href has visited

## 1.0.0

### Major Changes

- [#10609](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10609)
  [`7727f723965`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7727f723965) - Internal
  change to the release model from continous to scheduled release. There are **NO API CHANGES** in
  this release.

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- [#10255](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10255)
  [`4e72825fa89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e72825fa89) -
  JET-1156:
  - Export `VAR_SEPARATOR_COLOR` to override separator color when using custom backrounds in side
    navigation.
  - Export `VAR_SCROLL_INDICATOR_COLOR` to override menu scroll indicator color when using custom
    backrounds in side navigation.

## 0.8.4

### Patch Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`240c4120435`](https://bitbucket.org/atlassian/atlassian-frontend/commits/240c4120435) - Side
  navigation now uses the new common utility to calculate scrollbar width for offsetting keylines.
- Updated dependencies

## 0.8.3

### Patch Changes

- [#8875](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8875)
  [`e6f96e8d782`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6f96e8d782) - Fix
  styling for hover and active states for disabled items

## 0.8.2

### Patch Changes

- [#8637](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8637)
  [`101b102ed33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/101b102ed33) - Fix
  disabled state; menu items with icons after the text should have height of 40px

## 0.8.1

### Patch Changes

- [#8404](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8404)
  [`0b2f7e76803`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b2f7e76803) - Codemods
  will only format a file if it is mutated.

## 0.8.0

### Minor Changes

- [#6194](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6194)
  [`79a40dec30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79a40dec30) -
  **Breaking** Adjusts the API of the cssFn prop used in both menu and side-navigation. The prop now
  no longer exposes the currentStyles to the user in the callback and instead only provides the
  current state. Users no longer need to spread the currentStyles into their components when
  overriding. This change also resolves a bug where cssFn overrides did not always take precedence
  correctly over the default component styles.

### Patch Changes

- Updated dependencies

## 0.7.10

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.7.9

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.7.8

### Patch Changes

- [#5419](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5419)
  [`e55c4eb5a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e55c4eb5a8) - [ux]
  Earlier left sidebar was getting focus while clicking on it. We have removed focus ring to fix
  this issue.

## 0.7.7

### Patch Changes

- Updated dependencies

## 0.7.6

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.7.5

### Patch Changes

- [#4272](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4272)
  [`a3c91f82f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3c91f82f6) - Add
  tabindex=0 to nested container which makes it focusable when interacting with keyboard.

## 0.7.4

### Patch Changes

- [#4198](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4198)
  [`308ad47024`](https://bitbucket.org/atlassian/atlassian-frontend/commits/308ad47024) - Passes
  `cssFn` throught to NestingItem so that its styles can be customised

## 0.7.3

### Patch Changes

- Updated dependencies

## 0.7.2

### Patch Changes

- [#3980](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3980)
  [`159e0808a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/159e0808a5) - Updates
  the background color of NestingItem, ButtonItem and LinkItem so that it can work with the
  Onboarding component. Hover and selected states will appear darker and they provide better
  contrast against normal items.

## 0.7.1

### Patch Changes

- [#3532](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3532)
  [`5b3383fe67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b3383fe67) - Nesting
  transitions will no longer occur if a modifier key such as Shift or Control is detected while
  clicking on a nesting item in the side-navigation.

## 0.7.0

### Minor Changes

- [#3569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3569)
  [`c7e637753f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7e637753f) - Removed
  unused export of SIDEBAR_DEFAULT_WIDTH. It was added when page-layout wasn’t complete. Now
  page-layout is fairly mature, that’s why this export isn’t required anymore.

## 0.6.1

### Patch Changes

- [#3469](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3469)
  [`01e279bdcd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01e279bdcd) - Restyled
  footer - align with new design

## 0.6.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.5.7

### Patch Changes

- Updated dependencies

## 0.5.6

### Patch Changes

- [#2889](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2889)
  [`cc14956821`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc14956821) - Update all
  the theme imports to a path thats tree shakable

## 0.5.5

### Patch Changes

- [#2775](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2775)
  [`5217dcfa4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5217dcfa4d) - Remove
  opacity from side-navigation seperators that appear when the container scrolls. The color is the
  same, just without the alpha channel.

## 0.5.4

### Patch Changes

- [#2537](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2537)
  [`d674e203b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d674e203b3) - Previously
  Menu items controlled their own margin spacing which caused issues when trying to use them outside
  of Menu. Now we have moved Menu item margin styles into the Section component so now the Section
  dictates the spacing around child items. We had to update Side Navigation to control its child
  item margins as well.

## 0.5.3

### Patch Changes

- [#2430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2430)
  [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all
  packages that are used by confluence that have a broken es2019 dist

## 0.5.2

### Patch Changes

- [#2099](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2099)
  [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add
  missing tslib dependency

## 0.5.1

### Patch Changes

- [#2098](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2098)
  [`6ef13297b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ef13297b2) - Fixes
  scroll indicator not being the correct width when lazy loading large amounts of nav items.

## 0.5.0

### Minor Changes

- [#2008](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2008)
  [`07b2d8c491`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07b2d8c491) - FIX:
  NestedItem `iconAfter` will now display always and right arrow will show up and replace it on
  hover

## 0.4.0

### Minor Changes

- [minor][7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):

  **BREAKING** - renames `elemBefore` and `elemAfter` props to `iconBefore` and `iconAfter` on all
  item components.-
  [minor][d1ef176211](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1ef176211):

  **BREAKING** - renames section heading to heading item-
  [minor][41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):

  **BREAKING**: modifies custom item component to take only valid HTML attributes. This means
  `wrapperClass` is now known as `className`.-
  [minor][b3441cd210](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3441cd210):

  **BREAKING** - removes render go back item component from nesting item and nestable navigation
  content. Replaces with overrides equivalent.-
  [minor][e67a87dbf2](https://bitbucket.org/atlassian/atlassian-frontend/commits/e67a87dbf2):

  **BREAKING** - renames `customItemComponent` prop on nesting item to `component`.

### Patch Changes

- [patch][724935beab](https://bitbucket.org/atlassian/atlassian-frontend/commits/724935beab):

  Adds loading section component to use when wanting lazy load menu items.-
  [patch][6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):

  Exposes typescript types alongside components.-
  [patch][3bfb526c22](https://bitbucket.org/atlassian/atlassian-frontend/commits/3bfb526c22):

  Corrects disabled nesting item to not show the after element on hover.-
  [patch][7a9bf45e58](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a9bf45e58):

  Fixes section heading to correctly compose passed in css function.-
  [patch][d8dc3813c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8dc3813c1):

  Fixes section heading spacing.-
  [patch][684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):

  Improves type safety with custom item by using TypeScript generics to pass on the custom component
  types to the parent.- Updated dependencies
  [7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):

- Updated dependencies
  [5633f516a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/5633f516a4):
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
  - @atlaskit/motion@0.2.3
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 0.3.1

### Patch Changes

- [patch][ab133d934f](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab133d934f):

  Change imports to comply with Atlassian conventions

## 0.3.0

### Minor Changes

- [minor][7ecbf8d0bd](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ecbf8d0bd):

  **Breaking:**
  - SideNavigation now has a required `label` prop.

  **Accessibility Changes**
  - SideNavigation now has a `navigation` landmark for use with screen readers; this landmark is
    further described by the `label` prop to differentiate it from AtlassianNavigation-
    [minor][1fea6757c4](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fea6757c4):

  **BREAKING** - NavigationFooter component has been renamed to Footer.

### Patch Changes

- [patch][7b230682c2](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b230682c2):

  Adds controlled component support. It is now possible to use the `stack` and `onChange` props on
  the `NestableNavigationContent` component to dictate which view is active. This is useful for use
  cases where nested views need to be changed programmatically.

  ```
  const [stack, setStack] = useState([]);

  <SideNavigation>
    <NestableNavigationContent
      onChange={setStack}
      stack={stack}
    >
      ...
    </NestableNavigationContent>
  </SideNavigation>
  ```

  This is supported by a new hook called `useShouldNestedElementRender()`. All components that can
  be composed with `NestableNavigationContent` use it out of the box, but if you want to compose
  your own components you may have to opt into it else you will see your component rendering on
  every view (which may or may not be what you want).

  ```
  import { useShouldNestedElementRender } from '@atlaskit/side-navigation';

  const MyCustomComponent = () => {
    const { shouldRender } = useShouldNestedElementRender();

    if (shouldRender) {
      return <div>hello world!</div>;
    }

    // If your component takes children you'll probably want to return children here instead.
    return null;
  };
  ```

  ```
  <SideNavigation>
    <NestableNavigationContent>
      <MyCustomComponent />
    </NestableNavigationContent>
  </SideNavigation>
  ```

  - [patch][5c0bb69f7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c0bb69f7b):

  Fixes horizontal alignment for item icons in relation to the app switcher in the horizontal
  navigation bar.-
  [patch][1a3192c1c1](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a3192c1c1):

  Introduces skeletons for heading and item components.-
  [patch][43353900f7](https://bitbucket.org/atlassian/atlassian-frontend/commits/43353900f7):

  Corrects and consolidates colors for item and side navigation components.-
  [patch][c60324c748](https://bitbucket.org/atlassian/atlassian-frontend/commits/c60324c748):

  Adds new Footer component. Ensures this and the Header component come with baked in styles for you
  to use out of the box.-
  [patch][c56d86d95c](https://bitbucket.org/atlassian/atlassian-frontend/commits/c56d86d95c):

  Adds scrolling indicators to the scrollable container component.

- Updated dependencies
  [ed8d8dea65](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8d8dea65):
- Updated dependencies
  [db2f869556](https://bitbucket.org/atlassian/atlassian-frontend/commits/db2f869556):
- Updated dependencies
  [81ea791176](https://bitbucket.org/atlassian/atlassian-frontend/commits/81ea791176):
- Updated dependencies
  [6e2dda87f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e2dda87f4):
- Updated dependencies
  [e57c4aa96d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e57c4aa96d):
- Updated dependencies
  [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies
  [89d35b919a](https://bitbucket.org/atlassian/atlassian-frontend/commits/89d35b919a):
- Updated dependencies
  [083cfbaeb4](https://bitbucket.org/atlassian/atlassian-frontend/commits/083cfbaeb4):
- Updated dependencies
  [46d95777ef](https://bitbucket.org/atlassian/atlassian-frontend/commits/46d95777ef):
- Updated dependencies
  [9b264df34d](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b264df34d):
  - @atlaskit/menu@0.3.1
  - @atlaskit/atlassian-navigation@0.10.0
  - @atlaskit/docs@8.5.0

## 0.2.0

### Minor Changes

- [minor][dce5efb012](https://bitbucket.org/atlassian/atlassian-frontend/commits/dce5efb012):

  Support forward ref on side-navigation primitives

### Patch Changes

- [patch][4da717940e](https://bitbucket.org/atlassian/atlassian-frontend/commits/4da717940e):

  Refactor side-navigation nesting logic to support async components-
  [patch][93709ca7eb](https://bitbucket.org/atlassian/atlassian-frontend/commits/93709ca7eb):

  Adds `testId` to `NestingItem`- Updated dependencies
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
  - @atlaskit/logo@12.3.3
  - @atlaskit/menu@0.3.0
  - @atlaskit/button@13.3.9

## 0.1.0

### Minor Changes

- [minor][e1416630ed](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1416630ed):

  **BREAKING**: Renamed exported components
  - Renamed `MainSection` to `NavigationContent`
  - Renamed `NestingTransitionProvider` to `NestableNavigationContent`
  - `NestableNavigationContent` does not need to be wrapped by a `MainSection`
  - Renamed `HeaderSection` to `NavigationHeader`
  - Renamed `Footer` to `NavigationFooter`

  Improve behaviour of scrollabe sections:
  - Fixes a bug where different views shared the same scrollable section causing unexpected jumps on
    some unnesting interactions
  - `ScrollableSection` now shows an overflow indicator when items are scrolled off the top border
  - Fixes a bug where the Go Back component could scroll off the top in some cases-
    [minor][d752f27427](https://bitbucket.org/atlassian/atlassian-frontend/commits/d752f27427):

  API changes and design changes for side-navigation
  - **BREAKING**: `SectionHeader` has been renamed to `SectionHeading`
  - `SIDEBAR_DEFAULT_WIDTH` has been exported
  - `Item` has been removed and replaced with `CustomItem`, `ButtonItem`, `LinkItem` which are thin
    wrappers around their `@atlaskit/menu` counterparts
  - All exported components now have sensible default styles applied
  - A `GoBackItem` has been exported
  - `testId` props have been added to more components with `side-navigation`
  - `CustomItem`, `ButtonItem` and `LinkItem` themselves have a `cssFn` prop exposed which will
    allow custom styles to be applied and combined with side-navigation defaults
  - `Heading` and `Footer` have been updated to allow consumers to pass in their own custom
    components
  - Rich examples have been updated for composing your own navigations with RBD etc.-
    [minor][08fa439ec7](https://bitbucket.org/atlassian/atlassian-frontend/commits/08fa439ec7):

  **BREAKING**: `id` prop is now required on NestingItems

  The back button in nested views can now be customised
  - By default an English `Go Back` button will be shown
  - Use `renderDefaultBackButton` on the `NestableNavigationContent` to set a new default
  - Use `renderBackButton` on each `NestingItem` to specifically set a back trigger for exiting the
    view it controls

  The link form of nested views can now be customised
  - Use `customItemComponent` to pass in a functional/class component that adds extra behaviour
    around the link (see @atlaskit/menu for examples on how to configure CustomItems)

### Patch Changes

- [patch][babae63a7b](https://bitbucket.org/atlassian/atlassian-frontend/commits/babae63a7b):
  - Refactors nested navigation implementation
  - Now selects `NestingItem` & `GoBackItem` when it is exiting
  - Fixes double clicking a `NestingItem` and `GoBackItem` resulting in an unwanted double
    navigation
  - Fixes `NestingItem` not calling back on click
  - Adds optional `id` prop to `NestingItem`- Updated dependencies
    [1f9c4f974a](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f9c4f974a):

- Updated dependencies
  [b80c88fd26](https://bitbucket.org/atlassian/atlassian-frontend/commits/b80c88fd26):
- Updated dependencies
  [9ec1606d00](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ec1606d00):
- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies
  [1b3069e06b](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3069e06b):
  - @atlaskit/menu@0.2.7
  - @atlaskit/atlassian-navigation@0.9.6
  - @atlaskit/icon@20.0.2

## 0.0.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/menu@0.2.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/motion@0.2.2

## 0.0.3

### Patch Changes

- [patch][f3433f2096](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3433f2096):

  `NestingItem` now has an extra prop `isInitiallyOpen` that allows the side-navigation to initially
  render a particular nested view
  - To select a particular sidebar view to be rendered initially the `isInitiallyOpen` prop must be
    set on all parent `NestingItem`s in the navigation tree-
    [patch][a806cde423](https://bitbucket.org/atlassian/atlassian-frontend/commits/a806cde423):

  Iterative updates to side-navigation:
  - Go Back link in nested views now sticks to the top of the scrollable area
  - Removed broken css styles
  - Implemented sliding transitions rather than fades- Updated dependencies
    [4ed951b8d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ed951b8d8):

- Updated dependencies
  [e0e91e02a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0e91e02a6):
- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies
  [166d7b1626](https://bitbucket.org/atlassian/atlassian-frontend/commits/166d7b1626):
  - @atlaskit/menu@0.2.4
  - @atlaskit/icon@20.0.0
  - @atlaskit/motion@0.2.1
  - @atlaskit/docs@8.3.1

## 0.0.2

### Patch Changes

- [patch][0e6929fbb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e6929fbb9):

  Fixes a broken internal omport-
  [patch][146ca7139a](https://bitbucket.org/atlassian/atlassian-frontend/commits/146ca7139a):

  Bump package to enable branch deploys- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):

- Updated dependencies
  [1d72045e6b](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d72045e6b):
  - @atlaskit/docs@8.3.0
  - @atlaskit/motion@0.2.0
