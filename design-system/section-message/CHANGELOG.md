# @atlaskit/section-message

## 8.9.3

### Patch Changes

- Updated dependencies

## 8.9.2

### Patch Changes

- Updated dependencies

## 8.9.1

### Patch Changes

- Updated dependencies

## 8.9.0

### Minor Changes

- [`0f1032d1ae484`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f1032d1ae484) -
  Updates to Section message actions:
  - Actions that do not have `linkComponent` component overrides will no longer utilize the legacy
    `Button` component, and now utilize either the `Pressable` primitive or `Link` component
    depending on whether `onClick` or `href` props are set. The `linkComponent` prop otherwise
    behaves as it did before, but remains deprecated and scheduled to be removed in a later version.
  - Plain-text actions with a `onClick` or `href` now have body font styles applied by default.

## 8.8.1

### Patch Changes

- [`221b64f10f5eb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/221b64f10f5eb) -
  ts-ignore added as a workaround for help-center local consumption typecheck

## 8.8.0

### Minor Changes

- [`9da67d455336d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9da67d455336d) -
  [ux] Updated default icons for discovery appearance from the 'question mark circle' icon to the
  'discovery' icon.

## 8.7.8

### Patch Changes

- Updated dependencies

## 8.7.7

### Patch Changes

- Updated dependencies

## 8.7.6

### Patch Changes

- Updated dependencies

## 8.7.5

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 8.7.4

### Patch Changes

- Updated dependencies

## 8.7.3

### Patch Changes

- Updated dependencies

## 8.7.2

### Patch Changes

- Updated dependencies

## 8.7.1

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 8.7.0

### Minor Changes

- [`e2151927739e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e2151927739e8) -
  Explicit font styles have been set for the section message actions container, to prevent inherited
  styles from affecting the component. This change is no longer behind a feature flag.

## 8.6.1

### Patch Changes

- Updated dependencies

## 8.6.0

### Minor Changes

- [`98ff1fe25f14a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/98ff1fe25f14a) -
  Introduces the `onDismiss` callback function for usage with the `isDismissible` prop.

## 8.5.2

### Patch Changes

- Updated dependencies

## 8.5.1

### Patch Changes

- Updated dependencies

## 8.5.0

### Minor Changes

- [#191290](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191290)
  [`65bf86ed3a096`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/65bf86ed3a096) -
  Adds new prop `isDismissible` that allows messages to be dismissed and removed from the page.

## 8.4.0

### Minor Changes

- [#189812](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189812)
  [`1a7ddaeaf04ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a7ddaeaf04ce) -
  [ux] We are testing a change behind a feature flag. Section message action link styles will
  reflect and utilize `@atlaskit/link`, being regular font weight and also now support `target`
  attributes. If this fix is successful it will be available in a later release.

## 8.3.0

### Minor Changes

- [#189208](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189208)
  [`b8cad439e7f12`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b8cad439e7f12) -
  [ux] We are testing a change behind a feature flag. Discovery appearance section messages will be
  updated from the 'question mark circle' icon to the 'discovery' icon. If this fix is successful it
  will be available in a later release.

### Patch Changes

- Updated dependencies

## 8.2.10

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 8.2.9

### Patch Changes

- Updated dependencies

## 8.2.8

### Patch Changes

- Updated dependencies

## 8.2.7

### Patch Changes

- Updated dependencies

## 8.2.6

### Patch Changes

- Updated dependencies

## 8.2.5

### Patch Changes

- Updated dependencies

## 8.2.4

### Patch Changes

- Updated dependencies

## 8.2.3

### Patch Changes

- [#138039](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138039)
  [`3e513ed430ccc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3e513ed430ccc) -
  Fix accessibility issue where list was inappropriately used for actions when single action was
  passed.

## 8.2.2

### Patch Changes

- Updated dependencies

## 8.2.1

### Patch Changes

- Updated dependencies

## 8.2.0

### Minor Changes

- [#128669](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128669)
  [`81a9df729e371`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81a9df729e371) -
  Explicit font styles have been set for the section message actions container, to prevent inherited
  styles from affecting the component. This change is behind the feature
  flag`platform_ads_explicit_font_styles`.

## 8.1.1

### Patch Changes

- Updated dependencies

## 8.1.0

### Minor Changes

- [#122958](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122958)
  [`e46a10ea5b483`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e46a10ea5b483) -
  Updated to use new icons. This change is behind a feature flag and will be available in a later
  release.

## 8.0.2

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- [#120710](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120710)
  [`f463409dcaaf5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f463409dcaaf5) -
  Remove old codemod and update dependencies.

## 8.0.0

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

## 7.0.0

### Major Changes

- [#116552](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116552)
  [`e002c7033f5f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e002c7033f5f3) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/section-message`, you will need to ensure that your bundler is
  configured to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

### Patch Changes

- Updated dependencies

## 6.9.4

### Patch Changes

- Updated dependencies

## 6.9.3

### Patch Changes

- Updated dependencies

## 6.9.2

### Patch Changes

- Updated dependencies

## 6.9.1

### Patch Changes

- Updated dependencies

## 6.9.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 6.8.3

### Patch Changes

- Updated dependencies

## 6.8.2

### Patch Changes

- Updated dependencies

## 6.8.1

### Patch Changes

- Updated dependencies

## 6.8.0

### Minor Changes

- [#170738](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170738)
  [`ee3ce64bb7f38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ee3ce64bb7f38) -
  We are testing changes behind a feature gate. Section message actions have been updated to use
  automatic router link configuration (from App provider), as well as default link underlines. If
  this change is successful it will be available in a later release.

## 6.7.0

### Minor Changes

- [#165245](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165245)
  [`6935d35339437`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6935d35339437) -
  Updates internal behaviour to support new icon components

## 6.6.9

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 6.6.8

### Patch Changes

- Updated dependencies

## 6.6.7

### Patch Changes

- Updated dependencies

## 6.6.6

### Patch Changes

- Updated dependencies

## 6.6.5

### Patch Changes

- Updated dependencies

## 6.6.4

### Patch Changes

- [#137586](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137586)
  [`7ef921d67c033`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ef921d67c033) -
  Accessibility changes. Add roles to improve semantics.
- Updated dependencies

## 6.6.3

### Patch Changes

- [#128532](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128532)
  [`4d5c91fed0306`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4d5c91fed0306) -
  Change element wrapping children from `span` to `div` to improve HTML specification compliance.

## 6.6.2

### Patch Changes

- Updated dependencies

## 6.6.1

### Patch Changes

- Updated dependencies

## 6.6.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 6.5.11

### Patch Changes

- Updated dependencies

## 6.5.10

### Patch Changes

- [#123461](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/123461)
  [`4b9d857fa00b4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4b9d857fa00b4) -
  Internal change to use new Heading component. Very minor letter spacing changes.
- Updated dependencies

## 6.5.9

### Patch Changes

- Updated dependencies

## 6.5.8

### Patch Changes

- Updated dependencies

## 6.5.7

### Patch Changes

- Updated dependencies

## 6.5.6

### Patch Changes

- Updated dependencies

## 6.5.5

### Patch Changes

- Updated dependencies

## 6.5.4

### Patch Changes

- Updated dependencies

## 6.5.3

### Patch Changes

- Updated dependencies

## 6.5.2

### Patch Changes

- [#104908](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104908)
  [`43c9d214d373`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43c9d214d373) -
  [ux] Adds text alternatives for icons in the section-message component

## 6.5.1

### Patch Changes

- Updated dependencies

## 6.5.0

### Minor Changes

- [#94378](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94378)
  [`1a8f0d378a8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1a8f0d378a8e) -
  Add support for React 18 in non-strict mode.

## 6.4.26

### Patch Changes

- [#92007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/92007)
  [`85525725cb0d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/85525725cb0d) -
  Migrated to the new button component
- Updated dependencies

## 6.4.25

### Patch Changes

- [#88354](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88354)
  [`4c87d9b4f0c2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c87d9b4f0c2) -
  The internal composition of this component has changed. There is no expected change in behavior.
- Updated dependencies

## 6.4.24

### Patch Changes

- [#84293](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/84293)
  [`1ba0536bcaf9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1ba0536bcaf9) -
  Internal changes to typography. No expected visual or behavioral change.

## 6.4.23

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.4.22

### Patch Changes

- Updated dependencies

## 6.4.21

### Patch Changes

- Updated dependencies

## 6.4.20

### Patch Changes

- Updated dependencies

## 6.4.19

### Patch Changes

- Updated dependencies

## 6.4.18

### Patch Changes

- [#63677](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63677)
  [`f320c8ce5039`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f320c8ce5039) -
  This package has been added to the Jira push model.

## 6.4.17

### Patch Changes

- Updated dependencies

## 6.4.16

### Patch Changes

- Updated dependencies

## 6.4.15

### Patch Changes

- [#41725](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41725)
  [`8d838ab41ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d838ab41ed) - Removed
  all remaining legacy theming logic from Badge, IconObject, Lozenge and SectionMessage. This only
  affects the examples and some tests in each component. No internal component logic contained
  legacy theming.

## 6.4.14

### Patch Changes

- Updated dependencies

## 6.4.13

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749)
  [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect
  yarn changeset to packages, upgrade adf-schema

## 6.4.12

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787)
  [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal
  changes to use space tokens. There is no expected visual or behaviour change.

## 6.4.11

### Patch Changes

- [#37533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37533)
  [`1ed303de3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed303de3e8) - Updated
  dependencies
- [#37419](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37419)
  [`95401cac781`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95401cac781) - Internal
  change to component composition. There is no expected change.

## 6.4.10

### Patch Changes

- Updated dependencies

## 6.4.9

### Patch Changes

- Updated dependencies

## 6.4.8

### Patch Changes

- Updated dependencies

## 6.4.7

### Patch Changes

- Updated dependencies

## 6.4.6

### Patch Changes

- Updated dependencies

## 6.4.5

### Patch Changes

- Updated dependencies

## 6.4.4

### Patch Changes

- Updated dependencies

## 6.4.3

### Patch Changes

- Updated dependencies

## 6.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 6.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 6.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 6.3.17

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 6.3.16

### Patch Changes

- Updated dependencies

## 6.3.15

### Patch Changes

- Updated dependencies

## 6.3.14

### Patch Changes

- Updated dependencies

## 6.3.13

### Patch Changes

- Updated dependencies

## 6.3.12

### Patch Changes

- Updated dependencies

## 6.3.11

### Patch Changes

- [#31242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31242)
  [`cfe48bb7ece`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfe48bb7ece) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 6.3.10

### Patch Changes

- Updated dependencies

## 6.3.9

### Patch Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`eadbf13d8c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eadbf13d8c0) - Updated
  usages of `Text`, `Box`, `Stack`, and `Inline` primitives to reflect their updated APIs. There are
  no visual or behaviour changes.
- Updated dependencies

## 6.3.8

### Patch Changes

- [#28159](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28159)
  [`716af1d3387`](https://bitbucket.org/atlassian/atlassian-frontend/commits/716af1d3387) - Bump
  @atlaskit/heading from 1.0.0 to 1.0.1 to avoid resolving to poison dependency version

## 6.3.7

### Patch Changes

- Updated dependencies

## 6.3.6

### Patch Changes

- Updated dependencies

## 6.3.5

### Patch Changes

- Updated dependencies

## 6.3.4

### Patch Changes

- Updated dependencies

## 6.3.3

### Patch Changes

- [#26801](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26801)
  [`fad3820e125`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad3820e125) - Internal
  adjustment to the way actions are laid out. No visual or API change.
- Updated dependencies

## 6.3.2

### Patch Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`7c6009de2f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c6009de2f1) - [ux]
  Updates the visual appearance to match the legacy light mode palette.
- [`e35fc41dc33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e35fc41dc33) - Internal
  change to use updated primtive spacing prop values. No expected behaviour change.
- Updated dependencies

## 6.3.1

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 6.3.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`7a9e73ec430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a9e73ec430) - [ux]
  Internal changes to how styles are represented in SectionMessage. Some minor visual changes to the
  color and spacing of SectionMessage. No changes to the SectionMessage API.

### Patch Changes

- [`5f07e7b56a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f07e7b56a2) - Updates
  to the public types to better reflect the actual API.
- Updated dependencies

## 6.2.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 6.2.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`24ff3516c8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24ff3516c8d) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 6.1.15

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 6.1.14

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`8202e37941b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8202e37941b) - Internal
  code change turning on new linting rules.

## 6.1.13

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`89a1b9b02d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89a1b9b02d9) - [ux] -
  Actions will now wrap onto new lines rather than overflowing the edges, in cases where the actions
  are wider than the available width of the Section Message.
  - Added test ID data attribute to actions list for testing purposes, using the existing `testId`
    prop.

- [`edafa2f6366`](https://bitbucket.org/atlassian/atlassian-frontend/commits/edafa2f6366) - [ux]
  - Prevent long text overflowing the Section Message content box by utilising CSS property
    `word-break: break-word` to add line breaks. This applies to both the `title` and `children`
    props.
  - Allow text truncation to work inside Section Message content area by adding `overflow: hidden`
    to the flex container. This is due to a quirk with how this property works within CSS flexbox.
  - Added test ID data attribute to content container for testing purposes, using the existing
    `testId` prop.

- Updated dependencies

## 6.1.12

### Patch Changes

- Updated dependencies

## 6.1.11

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 6.1.10

### Patch Changes

- Updated dependencies

## 6.1.9

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates
  all usage of brand tokens to either selected or information tokens. This change is purely for
  semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 6.1.8

### Patch Changes

- Updated dependencies

## 6.1.7

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 6.1.6

### Patch Changes

- Updated dependencies

## 6.1.5

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 6.1.4

### Patch Changes

- Updated dependencies

## 6.1.3

### Patch Changes

- Updated dependencies

## 6.1.2

### Patch Changes

- Updated dependencies

## 6.1.1

### Patch Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`3f6e98f8d0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f6e98f8d0d) - Removes
  styled-components as a dev-dep
- Updated dependencies

## 6.1.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`cd62b457ff9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd62b457ff9) -
  Instrumented Section Message with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`af4bca32ad4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4bca32ad4) - Internal
  changes to supress eslint rules.
- Updated dependencies

## 6.0.3

### Patch Changes

- Updated dependencies

## 6.0.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 6.0.1

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 6.0.0

### Major Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`5b0461cc42d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b0461cc42d) - [ux] In
  this version we made **SectionMessage** dramatically faster and lighter
  - General performance improvements

  - We are now exporting a new component and few new types. The new component is
    `SectionMessageAction`, which you can use with the `actions` props. New types are
    `SectionMessageProps` and `SectionMessageActionProps`.

  - **BREAKING** The `actions` prop now accepts either a single JSX element, or an array with JSX
    elements.

  - **BREAKING** `linkComponent` prop is now moved to `SectionMessageAction`.

  - **BREAKING** The values for the `appearance` prop have changed:
    - `info` is now `information`
    - `confirmation` is now `success`
    - `change` is now `discovery`

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed**

  ```bash
  yarn upgrade @atlaskit/section-message@^6.0.0
  ```

  Once upgraded, use `@atlaskit/codemod-cli` via `npx`:

  ```bash
  npx @atlaskit/codemod-cli --parser babel --extensions ts,tsx,js [relativePath]
  ```

  The CLI will show a list of components and versions so select `@atlaskit/section-message@^6.0.0`
  and you will automatically be upgraded.

  What will be changed:
  - It will convert the `actions` prop from an array of objects to an array of
    `SectionMessageAction`.
  - It will move `linkComponent` prop from `SectionMessage` to `SectionMessageAction`.
  - It will update the `appearance` prop values.

  If your usage of **SectionMessage** cannot be upgraded a comment will be left that a manual change
  is required.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage.

  For Atlassians,

  refer to the [documentation](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods)
  for more details on the codemod CLI.

### Patch Changes

- Updated dependencies

## 5.2.0

### Minor Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756)
  [`190c2c66087`](https://bitbucket.org/atlassian/atlassian-frontend/commits/190c2c66087) -
  **Internal change from class to functional components**
  - Converted all the components from class to functional. This improved performance quite a bit.
    Initial rendering, hydration and re-rendering all have been improved.
  - Stopped exporting unused `theme` variable.
  - Added `ref` support which points to the top level element. Earlier it was not officially
    supported.
  - Dev changes includes: folder restructuring and cleanup, memoizing components, adding `techstack`
    in `package.json`, moving to declarative entry points, removing deprecated `version.json` etc.

### Patch Changes

- [`f10bc0d79f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f10bc0d79f1) - Migrated
  from styled components to emotion
- Updated dependencies

## 5.1.0

### Minor Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`ecced7fd8e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecced7fd8e2) - [ux] The
  linkComponent prop has been fixed to only apply to Actions with an href to align with docs.
  Previously it would apply to Actions with href or onClick.

### Patch Changes

- Updated dependencies

## 5.0.9

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 5.0.8

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 5.0.7

### Patch Changes

- Updated dependencies

## 5.0.6

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 5.0.4

### Patch Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`7315203b80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7315203b80) - Rename
  `AkCode` and `AkCodeBlock` exports to `Code` and `CodeBlock` for `@atlaskit/code`.
- Updated dependencies

## 5.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 5.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 5.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 5.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 4.1.10

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 4.1.9

### Patch Changes

- Updated dependencies

## 4.1.8

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`229d05754b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/229d05754b) - Change
  imports to comply with Atlassian conventions- Updated dependencies

## 4.1.7

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
  - @atlaskit/field-range@8.0.2
  - @atlaskit/button@13.3.9

## 4.1.6

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8

## 4.1.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/code@11.1.3
  - @atlaskit/field-range@8.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/theme@9.5.1

## 4.1.4

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-range@8.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 4.1.3

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
  - @atlaskit/code@11.1.1

## 4.1.2

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

## 4.1.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 4.1.0

### Minor Changes

- [minor][e6439fa292](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6439fa292):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help
  products to write better integration and end to end tests.

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

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 4.0.7

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

## 4.0.6

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 4.0.5

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/icon@19.0.0

## 4.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 4.0.3

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 4.0.2

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/field-range@7.0.4
  - @atlaskit/icon@18.0.0

## 4.0.1

- Updated dependencies
  [97bfe81ec8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bfe81ec8):
  - @atlaskit/docs@8.1.0
  - @atlaskit/field-range@7.0.2
  - @atlaskit/code@11.0.0

## 4.0.0

- [major][6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/section-message has been converted to Typescript. Typescript consumers will now get
    static type safety. Flow types are no longer provided. No API or behavioural changes.

## 3.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 2.0.4

- [patch][2020ab9db1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2020ab9db1):
  - Section message content area now takes 100% of its parent width

## 2.0.3

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-range@6.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/theme@8.1.7

## 2.0.2

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/theme@8.1.6
  - @atlaskit/field-range@6.0.3
  - @atlaskit/button@12.0.0

## 2.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/theme@8.0.1
  - @atlaskit/field-range@6.0.1
  - @atlaskit/button@11.0.0

## 2.0.0

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

## 1.2.0

- [minor][3a7e838663](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a7e838663):
  - Actions now require a key prop and action text now accepts React Nodes

## 1.1.0

- [minor][dfd4cbc475](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfd4cbc475):
  - Actions will now accept a key prop

## 1.0.17

- [patch][b8091afbdd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8091afbdd):
  - Fixed alignment of the separator dots

## 1.0.16

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/field-range@5.0.14
  - @atlaskit/icon@16.0.0

## 1.0.15

- [patch][6d08da6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d08da6):
  - Update css styles to `display: flex` for Actions and replace the content by a mid-dot without
    escape characters

## 1.0.14

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/field-range@5.0.12
  - @atlaskit/icon@15.0.2
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 1.0.13

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-range@5.0.11
  - @atlaskit/icon@15.0.1
  - @atlaskit/theme@7.0.0

## 1.0.12

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/icon@15.0.0

## 1.0.11

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0

## 1.0.10

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 1.0.9

- [patch] Update how actions wrap
  [5a791f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a791f2)

## 1.0.8

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/icon@14.0.0

## 1.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 1.0.5

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-range@5.0.4
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 1.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/field-range@5.0.3
  - @atlaskit/icon@13.2.4

## 1.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-range@5.0.2
  - @atlaskit/docs@5.0.2

## 1.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/field-range@5.0.1
  - @atlaskit/icon@13.2.1

## 1.0.1

- [patch] Change icon used by 'change' section-message
  [06ac04c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06ac04c)

## 1.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 0.1.0

- [minor] Preview release of section-message
  [7bb9a8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bb9a8e)
