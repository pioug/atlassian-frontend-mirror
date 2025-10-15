# @atlaskit/stylelint-design-system

## 4.1.3

### Patch Changes

- Updated dependencies

## 4.1.2

### Patch Changes

- [`437668dfbdec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/437668dfbdec9) -
  Add explicit types to a number of DST components
- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [#186090](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186090)
  [`3162f2036ddae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3162f2036ddae) -
  Add auto-fix logic for spacing values that map to spacing tokens

## 4.0.0

### Major Changes

- [#182157](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182157)
  [`8ba1b0f09a5be`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8ba1b0f09a5be) -
  Changes the way the package exports rules such that it works across cjs/esm in newer versions of
  stylelint. Please see the following issue for more information
  https://github.com/stylelint/stylelint/issues/8573#issuecomment-2982939797

## 3.0.0

### Major Changes

- [#181734](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181734)
  [`a6f029cfca2dc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a6f029cfca2dc) -
  Changes the way the package exports rules such that it works across cjs/esm in newer versions of
  stylelint. Please see the following issue for more information
  https://github.com/stylelint/stylelint/issues/8573#issuecomment-2982939797

## 2.2.3

### Patch Changes

- [#168399](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168399)
  [`b3cac034560a4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3cac034560a4) -
  Reverts export scheme change. now uses default exports again

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [#152787](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152787)
  [`4fd08b0087828`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4fd08b0087828) -
  Updates internal import structure to avoid a bug in stylelint v16

## 2.2.0

### Minor Changes

- [#150219](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150219)
  [`6746314317a26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6746314317a26) -
  Bumps stylelint to v15

## 2.1.9

### Patch Changes

- Updated dependencies

## 2.1.8

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 2.1.7

### Patch Changes

- Updated dependencies

## 2.1.6

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 2.1.5

### Patch Changes

- Updated dependencies

## 2.1.4

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 2.1.3

### Patch Changes

- [#116025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116025)
  [`cd506a937e44f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd506a937e44f) -
  Internal change to how typography is applied. There should be no visual change.

## 2.1.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.1.1

### Patch Changes

- [#43718](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43718)
  [`8aebcad547a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8aebcad547a) -
  Deprecated tokens are now warned against even when a replacement token has not been specified
- Updated dependencies

## 2.1.0

### Minor Changes

- [#43258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43258)
  [`0004d49c240`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0004d49c240) - Adds a
  new argument `fallbackUsage` which replaces `shouldEnforceFallbacks`. This new argument is an enum
  which represents the three possible states this rule can be configured with.
  - `forced`: Fallbacks must always been in use
  - `none`: Fallbacks must never been in use. (Fixer will remove any value provided )
  - `optional`: (new) Fallbacks are optional

## 2.0.0

### Major Changes

- [#42045](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42045)
  [`57ed7946223`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57ed7946223) - Upgrade
  `stylelint` from `14.5.3` to `14.16.1`

## 1.1.1

### Patch Changes

- [#41213](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41213)
  [`f79c2dcb310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f79c2dcb310) - Add
  CHANGELOG.md back to published files

## 1.1.0

### Minor Changes

- [#40796](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40796)
  [`4a861e0b373`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a861e0b373) - Adds a
  new "nonTokenCssVariables" option to the ensure-design-token-usage stylelint rule's configuration.
  When this is enabled, it will disallow CSS variables that aren't design tokens. This is used to be
  the default behavior but needs to now be explicitly enabled with the new option.

## 1.0.3

### Patch Changes

- [#39774](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39774)
  [`8ba9b8924c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ba9b8924c3) - Changes
  published files (allowlist)

## 1.0.2

### Patch Changes

- [#39733](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39733)
  [`8f20e7f6031`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f20e7f6031) -
  Stylelint is now enrolled into the product push model for Jira.

## 1.0.1

### Patch Changes

- [#38471](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38471)
  [`4451f8e1747`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4451f8e1747) - Register
  ts-node and enable direct consumption without precompiling

## 1.0.0

### Major Changes

- [#38972](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38972)
  [`b175ec37c65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b175ec37c65) - Cuts the
  first major release of this package. It is now considered stable and ready for general adoption.
  This version contains no code changes.

## 0.5.0

### Minor Changes

- [#35762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35762)
  [`c92bc3601d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c92bc3601d1) - Add
  autofix to automatically add fallback values for token declarations missing fallbacks

## 0.4.3

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443)
  [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing
  unused dependencies and dev dependencies

## 0.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 0.3.16

### Patch Changes

- Updated dependencies

## 0.3.15

### Patch Changes

- [#29211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29211)
  [`6944a4754db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6944a4754db) - Updated
  error messages to include a link to further guidance.

## 0.3.14

### Patch Changes

- Updated dependencies

## 0.3.13

### Patch Changes

- Updated dependencies

## 0.3.12

### Patch Changes

- [#27650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27650)
  [`a09fcfdc702`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a09fcfdc702) - Adds
  support for typography tokens to ensure-design-token-usage rule.

## 0.3.11

### Patch Changes

- Updated dependencies

## 0.3.10

### Patch Changes

- [#26132](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26132)
  [`61a0cc155e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61a0cc155e2) - Augment
  design-sytem/ensure-design-token-usage rule to include spacing

## 0.3.9

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 0.3.8

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 0.3.7

### Patch Changes

- [#25233](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25233)
  [`631207af050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/631207af050) - Manual
  bump of @atlaskit/tokens due to a bug with atlassian/changesets

## 0.3.6

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 0.3.5

### Patch Changes

- [#22198](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22198)
  [`ec850b9fc2d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec850b9fc2d) - Improves
  lint coverage by ensuring all css variables are wrapped in a design token at the callsite.

  For example, the following will now error:

  ```
  color: var(--adg3-color-R75);
  ```

  and request that you wrap it in a token:

  ```
  color: var(--ds-text-danger, var(--adg3-color-R75));
  ```

  In addition, named colors such as `red, white, violet` will now error.

## 0.3.4

### Patch Changes

- Updated dependencies

## 0.3.3

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- [#20548](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20548)
  [`578055b6cf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/578055b6cf2) - Fix
  dependency issue with `@atlaskit/tokens` requiring minimum version ^0.8.1

## 0.3.0

### Minor Changes

- [#19900](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19900)
  [`47d91601f23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47d91601f23) - -
  'no-deprecated-design-token-usage' rule now provides fix for deprecated tokens by replacing with
  the recommended token replacement
  - 'no-unsafe-design-token-usage' rule now provides fix for deleted tokens by replacing with the
    recommended token replacement

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- [#19607](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19607)
  [`541edde8e78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/541edde8e78) - Upgrade
  `stylelint` from `8.x` to `14.x`

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#19098](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19098)
  [`04386dad0c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04386dad0c2) - Addition
  of new `no-deprecated-design-token-usage` rule, which mirrors its eslint counterpart

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#18248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18248)
  [`260878cb563`](https://bitbucket.org/atlassian/atlassian-frontend/commits/260878cb563) - The
  .npmignore file has been fixed, so that required files are no longer missing.

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [#17170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17170)
  [`0c6d6d29289`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c6d6d29289) - Initial
  release introducing `ensure-design-token-usage` and `no-unsafe-design-token-usage` rules, which
  mirror their eslint counterparts.
