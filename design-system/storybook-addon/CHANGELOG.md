# @atlaskit/storybook-addon-design-system

## 3.1.2

### Patch Changes

- [#183895](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/183895)
  [`6b9d473fcf71a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6b9d473fcf71a) -
  [ux] Bump storybook libs to latest v8 version

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#154276](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/154276)
  [`917104b6edd11`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/917104b6edd11) -
  Introduced `adsTheme` parameter for customizing the theme in preview.js that allows overriding the
  theme with custom values 'light' or 'dark'.

## 3.0.0

### Major Changes

- [#106696](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/106696)
  [`5341965ff8dbe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5341965ff8dbe) -
  Updated to use ESM syntax for exports.

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

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#101255](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101255)
  [`deac0272bf9e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/deac0272bf9e6) -
  Upgraded dependencies '@storybook/components', '@storybook/manager-api' and
  '@storybook/preview-api' from '^8.1.10' to '^8.1.10' and added new dependency 'storybook'

## 1.2.2

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [#121959](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121959)
  [`44763b631bec5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/44763b631bec5) -
  Renamed `typography-minor3` theme to `typography-modernized`. There are no visual changes, purely
  just a rename.

## 1.1.0

### Minor Changes

- [#121858](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121858)
  [`a1c4a37a57a0c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a1c4a37a57a0c) -
  Fixed the build issue in the previous version.

## 1.0.0

### Major Changes

- [#121263](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/121263)
  [`9b5e0cb70a67b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9b5e0cb70a67b) -
  @atlaskit/storybook-addon-design-system has migrated to Storybook 8.0. Use the previous version if
  your project is still on v6 or v7.

### Patch Changes

- Updated dependencies

## 0.8.0

### Minor Changes

- [#94453](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94453)
  [`8b0ba81b30b3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b0ba81b30b3) -
  Add support for React 18 in non-strict mode.

## 0.7.1

### Patch Changes

- [#93943](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93943)
  [`611f5e98470c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/611f5e98470c) -
  Removes fallback colors from styles

## 0.7.0

### Minor Changes

- [#94436](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94436)
  [`c652e1c27a4d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c652e1c27a4d) -
  Updates the default theme to 'auto' to ensure tokens are always applied. "Unthemed" or "No theme"
  is now considered an unsafe appearance.

  If you prefer to use a different theme, you can still override the default theme by setting the
  `adeTheme.defaultValue: 'none'` as mentioned in
  [the documentation](https://staging.atlassian.design/components/storybook-addon-design-system/code#storybook-v7-and-above).

## 0.6.0

### Minor Changes

- [#77691](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77691)
  [`14d18ea34852`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/14d18ea34852) - -
  Enables new `typography` and `shape` themes
  - Sets the color theme to `auto` by default

## 0.5.2

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 0.5.1

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.5.0

### Minor Changes

- [#33632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33632)
  [`389ab86b2a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/389ab86b2a3) - Adding
  spacing tokens to storybook addon so that users spacing tokens appear in storybook

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

## 0.3.9

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`718d5ad3044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/718d5ad3044) - Updates
  to support the new `@atlaskit/tokens` theming API.
- Updated dependencies

## 0.3.8

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- Updated dependencies

## 0.3.6

### Patch Changes

- [#27629](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27629)
  [`f824dcfff6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f824dcfff6e) - Internal
  changes to satisfy various lint warnings & errors

## 0.3.5

### Patch Changes

- Updated dependencies

## 0.3.4

### Patch Changes

- [#26467](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26467)
  [`43464a5fb17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43464a5fb17) - Update
  split and stack theme settings to use tilde selectors

## 0.3.3

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 0.3.2

### Patch Changes

- [#24660](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24660)
  [`d4be43fdc44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4be43fdc44) - Set the
  innerText in our hack correctly - oops!

## 0.3.1

### Patch Changes

- [#24626](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24626)
  [`6dd7050ad7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dd7050ad7a) -
  Reimplement the style tag hack required for enabling split & stack view in the Storybook addon

## 0.3.0

### Minor Changes

- [#21484](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21484)
  [`6c65a3147c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c65a3147c1) - Removes
  root selector hack from lightmode, this is no longer necessary since the default theme no longer
  enables tokens by default

### Patch Changes

- Updated dependencies

## 0.2.6

### Patch Changes

- [#21487](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21487)
  [`4942487a9f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4942487a9f6) - Fixes
  internal representation of CSS entrypoints for themes. This is an internal change only and does
  not effect public APIs.

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#18080](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18080)
  [`068c9a0b770`](https://bitbucket.org/atlassian/atlassian-frontend/commits/068c9a0b770) -
  Refactors the storybook addon into a "tool addon"

## 0.1.1

### Patch Changes

- [#18020](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18020)
  [`32f8832d6c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32f8832d6c5) -
  Temporarily disable css imports to side-step recent changes to the monorepo which trigged a bug

## 0.1.0

### Minor Changes

- [#17460](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17460)
  [`ddbec37a16c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ddbec37a16c) - Initial
  release of the design system storybook addon package. Intended to be a generic package for all
  storybook releated DS tooling
