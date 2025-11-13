# @atlaskit/textarea

## 8.1.0

### Minor Changes

- [`2568622464f45`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2568622464f45) -
  release previously feature-gated change to textfield, textarea, and select to increase font size
  to 16px on mobile

## 8.0.14

### Patch Changes

- Updated dependencies

## 8.0.13

### Patch Changes

- Updated dependencies

## 8.0.12

### Patch Changes

- Updated dependencies

## 8.0.11

### Patch Changes

- Updated dependencies

## 8.0.10

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 8.0.9

### Patch Changes

- Updated dependencies

## 8.0.8

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 8.0.7

### Patch Changes

- Updated dependencies

## 8.0.6

### Patch Changes

- Updated dependencies

## 8.0.5

### Patch Changes

- Updated dependencies

## 8.0.4

### Patch Changes

- Updated dependencies

## 8.0.3

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 8.0.2

### Patch Changes

- [#125737](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125737)
  [`3715d57838782`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3715d57838782) -
  Update dependencies and remove old codemods.

## 8.0.1

### Patch Changes

- Updated dependencies

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

## 7.1.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [#113290](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113290)
  [`a8634aba15b6a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8634aba15b6a) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/textarea`, you will need to ensure that your bundler is configured
  to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

  Removed `styles.tsx` and `component-tokens.tsx` and their entry points
  `@atlaskit/textarea/component-tokens` and `@atlaskit/textarea/styles` from `package.json`

## 6.0.0

### Major Changes

- [#95577](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95577)
  [`ad478a9dbc399`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad478a9dbc399) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/textarea`, you will need to ensure that your bundler is configured
  to handle `.css` imports correctly.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

  Removed styles.tsx and component-tokens.tsx and their entry points from package.json

### Patch Changes

- Updated dependencies

## 5.8.2

### Patch Changes

- Updated dependencies

## 5.8.1

### Patch Changes

- Updated dependencies

## 5.8.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 5.7.3

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 5.7.2

### Patch Changes

- Updated dependencies

## 5.7.1

### Patch Changes

- [#98226](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98226)
  [`9c961c3cbcc7f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9c961c3cbcc7f) -
  Internal changes to typography.

## 5.7.0

### Minor Changes

- [#173737](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173737)
  [`667640085e5c7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/667640085e5c7) -
  Update the font size for the textarea and select components at the `xs` breakpoint. The font size
  will be increased to 16px to prevent IOS Safari from zooming in on the text field when it is
  focused. Styles for larger breakpoints will remain unchanged.

  Apply a fix to the textfield component to ensure monospace is correctly applied to the input at
  the `media.above.xs` breakpoint.

  These changes are currently behind a feature gate and will be evaluated for effectiveness. If
  successful, they will be included in a future release.

## 5.6.4

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 5.6.3

### Patch Changes

- Updated dependencies

## 5.6.2

### Patch Changes

- Updated dependencies

## 5.6.1

### Patch Changes

- Updated dependencies

## 5.6.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 5.5.2

### Patch Changes

- Updated dependencies

## 5.5.1

### Patch Changes

- [#105813](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105813)
  [`f2f51e7a24d00`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f2f51e7a24d00) -
  Internal change only. Update typography to use typography tokens.
- Updated dependencies

## 5.5.0

### Minor Changes

- [#111016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111016)
  [`d131599730792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d131599730792) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 5.4.0

### Minor Changes

- [#96186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96186)
  [`225179567a4c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/225179567a4c) -
  Add support for React 18 in non-strict mode.

## 5.3.0

### Minor Changes

- [#94675](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94675)
  [`5d9e1dccacca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d9e1dccacca) -
  [ux] Update input border color token to meet 3:1 color contrast ratioLight theme:
  color.border.input: #091E4224 → #8590A2Dark mode: color.border.input: #A6C5E229 → #738496

### Patch Changes

- Updated dependencies

## 5.2.0

### Minor Changes

- [#82028](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/82028)
  [`065756e95a09`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/065756e95a09) -
  [ux] This change includes a fix for the TextArea's text color when there is a placeholder and
  isDisabled is true.

## 5.1.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 5.1.1

### Patch Changes

- [#81644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81644)
  [`8ab7a816dca7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ab7a816dca7) -
  Revert input border change from the previous version

## 5.1.0

### Minor Changes

- [#80805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80805)
  [`427c2dd9e0d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/427c2dd9e0d6) -
  [ux] Update input border width from 2px to 1px with darker color to meet 3:1 color contrast

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#74756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74756)
  [`8e66f751df96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e66f751df96) -
  Use feature flag to roll out border width update from 2px to 1px

## 5.0.0

### Major Changes

- [#41866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41866)
  [`ed8b6957789`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed8b6957789) - Removes
  any usage of deprecated legacy theming APIs. These have been superseeded by design tokens.

## 4.7.7

### Patch Changes

- [#37613](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37613)
  [`29941aaea33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29941aaea33) - update
  focused fallback color to meet contrast requirement

## 4.7.6

### Patch Changes

- [#38731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38731)
  [`9af31f3c1ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9af31f3c1ae) - Delete
  version.json

## 4.7.5

### Patch Changes

- [#38201](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38201)
  [`356d6ebed05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/356d6ebed05) - This
  package is now onboarded onto the product push model.

## 4.7.4

### Patch Changes

- [#36662](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36662)
  [`964e8db6c94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/964e8db6c94) - update
  border width to use border spacing token

## 4.7.3

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 4.7.2

### Patch Changes

- [#35111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35111)
  [`8f436f0c301`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f436f0c301) - extend
  border contrast feature flag to support confluence

## 4.7.1

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 4.7.0

### Minor Changes

- [#33171](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33171)
  [`5f37caad726`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f37caad726) - [ux]
  reduce border width to 1px and update fallback color of border

## 4.6.3

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051)
  [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 4.6.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 4.6.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 4.6.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 4.5.7

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004)
  [`e028bee17df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e028bee17df) - [ux]
  fix(style): update fallback color of placeholder to meet contrast requirement

## 4.5.6

### Patch Changes

- Updated dependencies

## 4.5.5

### Patch Changes

- Updated dependencies

## 4.5.4

### Patch Changes

- Updated dependencies

## 4.5.3

### Patch Changes

- Updated dependencies

## 4.5.2

### Patch Changes

- Updated dependencies

## 4.5.1

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 4.5.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`6612a236510`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6612a236510) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- [`32d761cfc1d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32d761cfc1d) - [ux] Fix
  bug that prevented consumers from rendering a single line textarea

## 4.4.0

### Minor Changes

- [#24968](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24968)
  [`b8841384da6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8841384da6) - Disabled
  background and border styles should not be applied to components that have either no background or
  transparent background to begin with. Textfield and textarea variants that do not have backgrounds
  (sublte or none) have no backgrounds or borders applied when disabled. As such, any comopnents
  that consume these will also be affected.

## 4.3.11

### Patch Changes

- [#25314](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25314)
  [`bedbdec0e82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bedbdec0e82) - Update
  hover state appearance of subtle Textarea, Textfield and Select components to match the hover
  states of their default counterparts.

## 4.3.10

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 4.3.9

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 4.3.8

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`e4abd2c2888`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4abd2c2888) - Update
  token used for background color of subtle text area on hover
- [`926f9b57c59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/926f9b57c59) - Internal
  code change turning on new linting rules.
- [`fe575d49d66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe575d49d66) - Updated
  styles to use new input design tokens

## 4.3.7

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`45ebe7af434`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ebe7af434) - Moved to
  using declarative entrypoints internally. Public API is unchanged.

## 4.3.6

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`f63824e8227`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f63824e8227) - [ux]
  Updated input tokens within `@atlaskit/textarea`.

## 4.3.5

### Patch Changes

- Updated dependencies

## 4.3.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

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

- [#18526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18526)
  [`2e56ff8ea50`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e56ff8ea50) - [ux]
  Fixed a bug where smart resize did not work when the value prop was changed

## 4.2.6

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- Updated dependencies

## 4.2.5

### Patch Changes

- Updated dependencies

## 4.2.4

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- [`af7c289395b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af7c289395b) - Fix
  TypeScript issue where text area HTML attributes were not exposed in component prop types.
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

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`ae281b57bcd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae281b57bcd) -
  Instrumented Radio with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes

### Patch Changes

- [`2d7cc544696`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d7cc544696) - Updates
  token usage to match the latest token set
- Updated dependencies

## 4.1.3

### Patch Changes

- [#13728](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13728)
  [`c5785203506`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5785203506) - Updated
  homepage in package.json

## 4.1.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 4.1.1

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 4.1.0

### Minor Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`7af2427f3a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7af2427f3a8) - [ux]
  Update form field examples for validation and add a new prop to RadioGroup component

## 4.0.2

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.

## 4.0.1

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 4.0.0

### Major Changes

- [#5860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5860)
  [`782b6e5182`](https://bitbucket.org/atlassian/atlassian-frontend/commits/782b6e5182) - ### Brief

  The goal of this major for textarea is to improve the component's performance, by both

  reducing static structure and avoiding unnecessary function calls.

  We have made internal refactors and optimizations to improve textarea performance. Some changes
  made are as follows:
  - Moving TextArea to a single element (removed an internal wrapping element)

  - Replace `styled-components` to `emotion` as styling library

  - Moving internal component analytics to a more efficient usePlatformLeafEventHandler hook

  - Refactoring styles to recalculate only when theme & certain props change

  - Controlling CSS change via attributes instead of props

  #### TextArea now has single DOM element

  DOM element 2 -> 1 Removed div surrounding (wrapper) native textarea element and moved all
  behaviors and CSS to that single element.

  Measuring the height of the textarea element will now get different raw values because the text
  area is now rendering it’s own padding and border, but computed height is still the same.

  #### Upgrading with codemod

  ```

  # You first need to have the latest textarea installed before you can run the codemod

  yarn upgrade @atlaskit/textarea@^4.0.0
  ```

# Run the codemod cli

# Pass in a parser for your codebase

npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]

````

## 3.0.5

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 3.0.4

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707) [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 3.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
to prevent duplicates of tslib being bundled.

## 3.0.1

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823) [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 3.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 2.2.10

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866) [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 2.2.9

### Patch Changes

- Updated dependencies

## 2.2.8

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868) [`7aa4756beb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7aa4756beb) - Change imports to comply with Atlassian conventions- Updated dependencies

## 2.2.7

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- @atlaskit/docs@8.5.1
- @atlaskit/theme@9.5.3
- @atlaskit/analytics-next@6.3.6
- @atlaskit/button@13.3.10

## 2.2.6

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
- @atlaskit/docs@8.4.0
- @atlaskit/webdriver-runner@0.3.0
- @atlaskit/button@13.3.9

## 2.2.5

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
- @atlaskit/webdriver-runner@0.2.0
- @atlaskit/button@13.3.8

## 2.2.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

- @atlaskit/docs@8.3.2
- @atlaskit/visual-regression@0.1.9
- @atlaskit/analytics-next@6.3.5
- @atlaskit/button@13.3.7
- @atlaskit/theme@9.5.1
- @atlaskit/type-helpers@4.2.3

## 2.2.3

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

Added name prop to component prop types.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- @atlaskit/analytics-next@6.3.3

## 2.2.2

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

Rebuilds package to fix typescript typing error.

## 2.2.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 2.2.0

### Minor Changes

- [minor][5679449552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5679449552):

Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 2.1.10

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 2.1.9

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

Upgraded Typescript to 3.3.x

## 2.1.8

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

Change all the imports to theme in Core to use multi entry points

## 2.1.7

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

Updates component maintainers

## 2.1.6

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

**Breaking changes**

- `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
- `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

**Breaking changes to TypeScript annotations**

- `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
- Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
- Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
- Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
- Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
- Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
- Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
- Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
- Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
- Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 2.1.5

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

Consume analytics-next ts type definitions as an ambient declaration.

## 2.1.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

Fixes bug, missing version.json file

## 2.1.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

In this PR, we are:

- Re-introducing dist build folders
- Adding back cjs
- Replacing es5 by cjs and es2015 by esm
- Creating folders at the root for entry-points
- Removing the generation of the entry-points at the root
  Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 2.1.2

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

Before:

```typescript
withAnalyticsEvents()(Button) as ComponentClass<Props>;
````

After:

```typescript
withAnalyticsEvents<Props>()(Button);
```

## 2.1.1

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 2.1.0

### Minor Changes

- [minor][2b26a6f408](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b26a6f408):

  Added placeholder prop for textareas

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
  - This major release indicates that this package is no longer under dev preview but is ready for
    use

## 0.4.6

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):
  - Bump tslib

## 0.4.5

- [patch][cd67ae87f8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd67ae87f8):
  - Stop defaultValue from being omitted from props that are spread onto textarea
  - Constraint type of value and defaultValue to string

## 0.4.4

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/theme@8.1.7

## 0.4.3

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):
  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next
    supplied from itself.

## 0.4.2

- [patch][cf018d7630](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cf018d7630):
  - Allow RefObject to be passed in as ref (i.e. using React.createRef()) and set inner padding to 0

## 0.4.1

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.0

- [minor][f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):
  - Fix bug: previous size was size for isCompact, and isCompact did not do anything. Now normal
    textarea is slightly larger and isCompact makes it the previous size

## 0.3.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):
  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 0.3.1

- [patch][90a14be594](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90a14be594):
  - Fix broken type-helpers

## 0.3.0

- [minor][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - Dropped ES5 distributables from the typescript packages

## 0.2.6

- [patch][1b952c437d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b952c437d):
  - Change order of props spread to fix textarea focus glow, and smart resizing when onChange passed
    in

## 0.2.5

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/theme@8.0.0

## 0.2.4

- [patch][aab267bb3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aab267bb3a):
  - Added test to make sure the props are passed down to hidden input

## 0.2.3

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.2.2

- [patch][9e6b592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9e6b592):
  - Added tslib import for textarea

## 0.2.1

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - Change API to experimental theming API to namespace component themes into separate contexts and
    make theming simpler. Update all dependant components.

## 0.2.0

- [minor][76a8f1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76a8f1c):
  - Convert @atlaskit/textarea to Typescript
    - Dist paths have changed, if you are importing by exact file path you will need to update your
      imports `import '@atlaskit/button/dist/es5/components/ButtonGroup'`
    - Flow types are not present any more, Typescript definitions are shipped instead

## 0.1.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.1.0

- [minor][9d77c4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d77c4e):
  - New textarea package, meant to be a replacement for field-text-area, normalised component
    architecture, removed dependency on @atlaskit/field-base, updated to use new @atlaskit/theme api
