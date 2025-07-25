# @atlaskit/tag

## 14.0.16

### Patch Changes

- Updated dependencies

## 14.0.15

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 14.0.14

### Patch Changes

- Updated dependencies

## 14.0.13

### Patch Changes

- Updated dependencies

## 14.0.12

### Patch Changes

- Updated dependencies

## 14.0.11

### Patch Changes

- Updated dependencies

## 14.0.10

### Patch Changes

- Updated dependencies

## 14.0.9

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 14.0.8

### Patch Changes

- Updated dependencies

## 14.0.7

### Patch Changes

- [#131491](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131491)
  [`23dc57fec1763`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23dc57fec1763) -
  Removed css variables mapping object from tag styles. This will fix the missing border color and
  other styles on colored tags.

## 14.0.6

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 14.0.5

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 14.0.4

### Patch Changes

- [#130353](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130353)
  [`ffce98d88de63`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ffce98d88de63) -
  Update dependencies and remove old codemods.

## 14.0.3

### Patch Changes

- Updated dependencies

## 14.0.2

### Patch Changes

- Updated dependencies

## 14.0.1

### Patch Changes

- Updated dependencies

## 14.0.0

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

## 13.1.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- Updated dependencies

## 13.0.3

### Patch Changes

- Updated dependencies

## 13.0.2

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [#94639](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94639)
  [`135106f2d1c95`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/135106f2d1c95) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/tag`, you will need to ensure that your
  bundler is configured to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 12.7.1

### Patch Changes

- Updated dependencies

## 12.7.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 12.6.10

### Patch Changes

- [#103656](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103656)
  [`2935e63775a71`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2935e63775a71) -
  Remove old `extract-react-types` typing files.

## 12.6.9

### Patch Changes

- [#103692](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103692)
  [`ad627ccbb12b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad627ccbb12b8) -
  Refactor internals and flesh out dev dependencies to match internal usage.

## 12.6.8

### Patch Changes

- Updated dependencies

## 12.6.7

### Patch Changes

- Updated dependencies

## 12.6.6

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 12.6.5

### Patch Changes

- Updated dependencies

## 12.6.4

### Patch Changes

- Updated dependencies

## 12.6.3

### Patch Changes

- Updated dependencies

## 12.6.2

### Patch Changes

- [#147531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147531)
  [`8ae1e110621b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ae1e110621b7) -
  Internal changes to feature flag used to toggle new icons

## 12.6.1

### Patch Changes

- Updated dependencies

## 12.6.0

### Minor Changes

- [#137781](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137781)
  [`21bfb50836bad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21bfb50836bad) -
  Migrated to use new iconography behind a feature flag.

### Patch Changes

- Updated dependencies

## 12.5.3

### Patch Changes

- [#135718](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135718)
  [`ed8ae748863a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed8ae748863a0) -
  Enhance the removable Tag component to automatically prepend 'Remove' to the tag text by default.

## 12.5.2

### Patch Changes

- [`a2113e5c2f721`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a2113e5c2f721) -
  Remove unnecessary alt attribute.

## 12.5.1

### Patch Changes

- Updated dependencies

## 12.5.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 12.4.4

### Patch Changes

- Updated dependencies

## 12.4.3

### Patch Changes

- Updated dependencies

## 12.4.2

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 12.4.1

### Patch Changes

- Updated dependencies

## 12.4.0

### Minor Changes

- [#118261](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118261)
  [`1d7ac70801120`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1d7ac70801120) -
  [ux] Testing a new visual appearance behind a feature flag. If successful it'll be released at a
  later date.

## 12.3.3

### Patch Changes

- Updated dependencies

## 12.3.2

### Patch Changes

- Updated dependencies

## 12.3.1

### Patch Changes

- Updated dependencies

## 12.3.0

### Minor Changes

- [#111016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111016)
  [`d131599730792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d131599730792) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 12.2.3

### Patch Changes

- Updated dependencies

## 12.2.2

### Patch Changes

- [#104477](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104477)
  [`d645476428e9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d645476428e9) -
  Fix bug in which tags weren't getting truncated with ellipsis when within smaller containers.

## 12.2.1

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [#96758](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96758)
  [`97190f5196c8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/97190f5196c8) -
  `RemovableTag` remove buttons now use the `Pressable` primitive.

  - Button focus outlines are no longer negatively inset
  - `overflow: hidden` was removed from base tag styles to prevent button focus outlines being
    cropped. No known impacts are expected from this change
  - Pressable includes event tracking on click

## 12.1.0

### Minor Changes

- [#94462](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94462)
  [`a87afa0ac818`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a87afa0ac818) -
  Add support for React 18 in non-strict mode.

## 12.0.4

### Patch Changes

- [#94813](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94813)
  [`f65afadf75cc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f65afadf75cc) -
  Internal changes to typography, no visual change.

## 12.0.3

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 12.0.2

### Patch Changes

- [#80621](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80621)
  [`d3fa752a0e8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d3fa752a0e8e) -
  Updates background color of the YellowLight tag varian to use the appropriate yellow token
- Updated dependencies

## 12.0.1

### Patch Changes

- Updated dependencies

## 12.0.0

### Major Changes

- [#41881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41881)
  [`1de74609c13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1de74609c13) - Removed
  all remaining legacy theming logic from the Tag, Toggle and Tooltip components.

## 11.6.2

### Patch Changes

- [#42577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42577)
  [`d51b45b02fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d51b45b02fb) - Add
  component to push model consumption in JFE

## 11.6.1

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 11.6.0

### Minor Changes

- [#39619](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39619)
  [`a8ad544c90a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8ad544c90a) - [ux]
  Updates background in interaction states to use new interaction accent tokens. Introduces three
  new color variants: Lime, Orange and Magenta.

## 11.5.7

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 11.5.6

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 11.5.5

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 11.5.4

### Patch Changes

- [#35448](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35448)
  [`df07bc1eecf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df07bc1eecf) - Internal
  change to use space tokens for spacing properties. There is no visual change.

## 11.5.3

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051)
  [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 11.5.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 11.5.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 11.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 11.4.11

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`4ba10567310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ba10567310) - Internal
  changes.

## 11.4.10

### Patch Changes

- Updated dependencies

## 11.4.9

### Patch Changes

- [#30097](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30097)
  [`f6c88b297ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6c88b297ae) - [ux]
  Adds back in a focus indicator on Tags when they are also links.

## 11.4.8

### Patch Changes

- Updated dependencies

## 11.4.7

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 11.4.6

### Patch Changes

- Updated dependencies

## 11.4.5

### Patch Changes

- Updated dependencies

## 11.4.4

### Patch Changes

- Updated dependencies

## 11.4.3

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 11.4.2

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`30538b8eba9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30538b8eba9) - [ux]
  Update grey color to use design tokens
- Updated dependencies

## 11.4.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 11.4.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`dcab33b00fd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcab33b00fd) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 11.3.6

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 11.3.5

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`292f10ad52d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/292f10ad52d) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 11.3.4

### Patch Changes

- Updated dependencies

## 11.3.3

### Patch Changes

- Updated dependencies

## 11.3.2

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 11.3.1

### Patch Changes

- Updated dependencies

## 11.3.0

### Minor Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`53588b7628f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53588b7628f) - [ux]
  Color updates

  - Link tag color background + text updates: hovered and pressed states. Now using accent tokens
  - Removable tag background, text, and remove button color updates: hovered and pressed states. Now
    using "danger" token color (red) on hover
  - Elements before tags now vertically centered rather than anchored to the top
  - Elements before tags now match text color of tag, improving visibility on color variations and
    interaction states
  - Replaced some remaining colors with design tokens

### Patch Changes

- Updated dependencies

## 11.2.6

### Patch Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`9a686cea43e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a686cea43e) - [ux]
  Reinstated missing hover states for simple tags
- Updated dependencies

## 11.2.5

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`82149cbba48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82149cbba48) - Internal
  styling has been refactored in preparation for @compiled/react
- Updated dependencies

## 11.2.4

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 11.2.3

### Patch Changes

- Updated dependencies

## 11.2.2

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 11.2.1

### Patch Changes

- Updated dependencies

## 11.2.0

### Minor Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`312f801c5ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/312f801c5ee) - [ux]
  Instrumented tag with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`557c2cacd26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/557c2cacd26) - [ux]
  Fixed the incorrect hover state colours
- Updated dependencies

## 11.1.3

### Patch Changes

- [#13728](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13728)
  [`c5785203506`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5785203506) - Updated
  homepage in package.json

## 11.1.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 11.1.1

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 11.1.0

### Minor Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`4a9029c3018`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a9029c3018) - Add
  aria-label to Remove button in tag

## 11.0.11

### Patch Changes

- Updated dependencies

## 11.0.10

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`753dd89d2db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/753dd89d2db) - Removed
  redundant role attribute of Simple and Removable tags
- Updated dependencies

## 11.0.9

### Patch Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`4aa81830f92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4aa81830f92) - Fix
  space between Before element and text

## 11.0.8

### Patch Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`7116601e1b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7116601e1b2) - Internal
  typing refactored to be readable by extract-react-types.
- Updated dependencies

## 11.0.7

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- Updated dependencies

## 11.0.6

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`863370c4cab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/863370c4cab) - [ux]
  Fixes a bug in which Tag's hover state is incorrectly using the removable color palette.

## 11.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 11.0.4

### Patch Changes

- [#5860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5860)
  [`65d8baf4c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65d8baf4c6) - Fixed
  hover color for linked tag and focus ring for keyboard navigation

## 11.0.3

### Patch Changes

- [#5405](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5405)
  [`c46e5e022f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c46e5e022f) - Fixed
  props table missing and relative path in examples issue

## 11.0.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 11.0.1

### Patch Changes

- Updated dependencies

## 11.0.0

### Major Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`661b22b003`](https://bitbucket.org/atlassian/atlassian-frontend/commits/661b22b003) - ### Brief

  The major changes are mainly on performance tunning for tag. As part of the change, we split `Tag`
  into `RemovableTag` and `SimpleTag`.

  If you just want to display a non-interactive tag, use `SimpleTag`. If you want to display tags
  that can be removed, use `RemovableTag`. We made this split so that people only need to pay the
  cost for the functionality they are using.

  ```js
  import SimpleTag from '@atlaskit/tag/simple-tag';
  ```

  and use `RemovableTag` for the full-featured version in entry point `removable-tag`:

  ```js
  import RemovableTag from '@atlaskit/tag/removable-tag';
  ```

  #### RemovableTag

  `RemovableTag` has the `remove` button so you can remove it from the page. There are a few other
  enhancements as well in this changeset. By using `remove` icon from `@atlaskit/icon` and animation
  from `@atlaskit/motion`, we reduced the overall size of the component. In addition, the DOM
  structure is reduced too.

  #### Other changes

  - Renamed `removeButtonText` to `removeButtonLabel` as it's used as `aria-label`
  - Added `isRemovable` prop to `RemovableTag` so you can conditionally allow removal

  #### Upgrading with codemod

  ```
  # You first need to have the latest range installed before you can run the codemod
  yarn upgrade @atlaskit/tag@^11.0.0

  # Run the codemod cli
  # Pass in a parser for your codebase
  npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
  ```

### Patch Changes

- [`b6d1b68c09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6d1b68c09) - Fix
  exiting animation and adjust paddings for tag content
- Updated dependencies

## 10.0.4

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 10.0.3

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`f425b45b5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f425b45b5a) - Added
  test-id to Tag

## 10.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 10.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`ef21264929`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef21264929) - Export
  type TagColor from Tag component

## 10.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.1.2

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 9.1.1

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove
  unused dependencies

## 9.1.0

### Minor Changes

- [minor][55b726b9af](https://bitbucket.org/atlassian/atlassian-frontend/commits/55b726b9af):

  Various accessibility improvements:

  - Clicking on an element that is not clickable will no longer activate a focus ring
  - Non-clickable tags no longer have focus / hover states
  - Links can be directly navigated to and clicked via native browser behavior
  - Remove button now sets a pointer cursor

### Patch Changes

- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/icon@20.0.2

## 9.0.13

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1

## 9.0.12

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies
  [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1

## 9.0.11

### Patch Changes

- [patch][f998d0afc2](https://bitbucket.org/atlassian/atlassian-frontend/commits/f998d0afc2):

  Removed comment- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):

  - @atlaskit/docs@8.3.0

## 9.0.10

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

## 9.0.9

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.0.8

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 9.0.7

- Updated dependencies
  [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 9.0.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 9.0.5

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.0.4

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 9.0.3

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 9.0.2

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

## 9.0.1

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 9.0.0

### Major Changes

- [major][1adb8727e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adb8727e3):

  @atlaskit/tag has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.6

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 8.0.5

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/icon@19.0.0

## 8.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.3

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/section-message@4.0.2
  - @atlaskit/icon@18.0.0

## 8.0.2

- Updated dependencies
  [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 8.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 7.0.3

- [patch][ef0875bb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef0875bb53):

  - Fixed size of tag remove icon

## 7.0.2

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/theme@8.1.7

## 7.0.1

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 7.0.0

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

## 6.1.4

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/section-message@1.0.16
  - @atlaskit/icon@16.0.0

## 6.1.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/icon@15.0.2
  - @atlaskit/section-message@1.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 6.1.2

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/icon@15.0.1
  - @atlaskit/section-message@1.0.13
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 6.1.1

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/section-message@1.0.12
  - @atlaskit/icon@15.0.0

## 6.1.0

- [minor][925de1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/925de1a):

  - Export `AppearanceType` flow type

## 6.0.9

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.8

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/icon@14.0.0

## 6.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.0.5

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/icon@13.2.5
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 6.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/theme@5.1.3
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 6.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/avatar@14.0.5

## 6.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/theme@5.1.1
  - @atlaskit/icon@13.2.1
  - @atlaskit/avatar@14.0.4

## 6.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/docs@5.0.1
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
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 5.0.7

- [none] Updated dependencies
  [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies
  [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0

## 5.0.6

- [patch] Updated dependencies
  [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0

## 5.0.5

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/icon@12.3.1
  - @atlaskit/avatar@11.2.1

## 5.0.4

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/theme@4.0.4
  - @atlaskit/icon@12.1.2

## 5.0.3

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 5.0.2

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [none] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/avatar@11.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/avatar@11.0.0

## 4.1.1

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/theme@3.2.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4

## 4.1.0

- [minor] Add linkComponent to allow passing of custom link components
  [d2d2678](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2d2678)

## 4.0.1

- [patch] Remove unused dependencies
  [3cfb3fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cfb3fe)

## 4.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.2.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.1.3

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.1.2

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.1.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.0.12

- [patch] Fixed flow error [c3d78ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3d78ba)

## 3.0.10

- [patch] Fix references to link and linkHover (in theme) from the Tag styles components
  [d509c86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d509c86)

## 3.0.8

- [patch] bump icon dependency
  [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 3.0.6

- [patch] Use correct dependencies [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)

## 3.0.2 (2017-09-20)

- bug fix; fix text colors, styling for colored tags (issues closed: #ak-3557)
  ([8c48e98](https://bitbucket.org/atlassian/atlaskit/commits/8c48e98))

## 3.0.1 (2017-08-30)

- bug fix; change darkmode colors after spec update to 1.3
  ([5d78178](https://bitbucket.org/atlassian/atlaskit/commits/5d78178))

## 3.0.0 (2017-08-23)

- breaking; Tag has dark mode colors
  ([149b8df](https://bitbucket.org/atlassian/atlaskit/commits/149b8df))
- breaking; tag has dark mode colors (issues closed: #ak-3239)
  ([149b8df](https://bitbucket.org/atlassian/atlaskit/commits/149b8df))
- Adding Dark mode, so that when the atlaskit theme manager is used it can be turned on. This should
  not be a breaking any old functionality, but as it is a major rewrite, it is a major version bump.

## 2.6.0 (2017-08-03)

- feature; add color options for tag (issues closed: #ak-2910)
  ([76831b4](https://bitbucket.org/atlassian/atlaskit/commits/76831b4))

## 2.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 2.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 2.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.1.4 (2017-06-02)

- fix; Peerdependency is now [@atlaskit](https://github.com/atlaskit)/tag not ak-tag
  ([418e0b3](https://bitbucket.org/atlassian/atlaskit/commits/418e0b3))
- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 2.1.3 (2017-05-03)

- fix; fixes a problem where Tag tries to import a styled component from util-shared-styles@^
  ([c58d643](https://bitbucket.org/atlassian/atlaskit/commits/c58d643))

## 2.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.1.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config
  ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 2.0.0 (2017-04-05)

- refactor the tag component to use styled-components
  ([7a7a513](https://bitbucket.org/atlassian/atlaskit/commits/7a7a513))
- breaking; added peerDependency "styled-components", removed dependency "classnames"
- ISSUES CLOSED: AK-2033

## 1.2.1 (2017-04-02)

- fix; change one of the maintainers
  ([e9a3011](https://bitbucket.org/atlassian/atlaskit/commits/e9a3011))

## 1.2.0 (2017-03-28)

- fix; fIxes bug in firefox where outline was shown for rounded tag buttons
  ([0936fd5](https://bitbucket.org/atlassian/atlaskit/commits/0936fd5))
- feature; adds appearance prop to tags to allow "rounded" appearance
  ([fa1df38](https://bitbucket.org/atlassian/atlaskit/commits/fa1df38))

## 1.1.3 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.1.1 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.0 (2017-03-07)

- feature; adds elemBefore prop to tags
  ([f0faae4](https://bitbucket.org/atlassian/atlaskit/commits/f0faae4))

## 1.0.5 (2017-02-28)

- fix; removes jsdoc annoations and moves content to usage.md
  ([d133f5d](https://bitbucket.org/atlassian/atlaskit/commits/d133f5d))
- fix; dummy commit to release stories
  ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.4 (2017-02-10)

- fix; Updates package to have correct dev-dependency for util-common-test
  ([403d232](https://bitbucket.org/atlassian/atlaskit/commits/403d232))

## 1.0.3 (2017-02-09)

- fix; avoiding binding render to this
  ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.1 (2017-02-07)

- fix; Updates package to use scoped ak packages
  ([b4dd274](https://bitbucket.org/atlassian/atlaskit/commits/b4dd274))
- fix; Fixes incorrect import ([3612a97](https://bitbucket.org/atlassian/atlaskit/commits/3612a97))
- fix; prevent dismiss button from submitting the parent form
  ([32ddf63](https://bitbucket.org/atlassian/atlaskit/commits/32ddf63))
