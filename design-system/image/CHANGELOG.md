# @atlaskit/image

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#130672](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130672)
  [`c92554212ded6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c92554212ded6) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/image`, you will need to ensure that your bundler is configured to
  handle `.css` imports correctly.

  Removed `--img-source` and `--img-source-dark` CSS variables and `content` CSS property from
  `<img>` since the `content` values were invalid before.

  Most bundlers come with built-in support for `.css` imports, so you may not need to do anything.
  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

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

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.3.11

### Patch Changes

- [#108671](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108671)
  [`6cfd20784a42b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6cfd20784a42b) -
  Update dev depdencies.

## 1.3.10

### Patch Changes

- Updated dependencies

## 1.3.9

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.
- Updated dependencies

## 1.3.8

### Patch Changes

- Updated dependencies

## 1.3.7

### Patch Changes

- Updated dependencies

## 1.3.6

### Patch Changes

- Updated dependencies

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.3.3

### Patch Changes

- [#156266](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/156266)
  [`6029cf729997a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6029cf729997a) -
  Fixes an issue where images with invalid/not-found urls will be requested in an infinite loop
- Updated dependencies

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [#89307](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89307)
  [`47cdc66371fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/47cdc66371fb) -
  [ux] Fix bug where images flickered in dark mode. Source URLs are now set based on the current
  theme before first paint.
- Updated dependencies

## 1.2.0

### Minor Changes

- [#96499](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96499)
  [`d9a3724cdeb8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d9a3724cdeb8) -
  Add support for React 18 in non-strict mode.

## 1.1.7

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.1.6

### Patch Changes

- [#38487](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38487)
  [`b2da5b33468`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2da5b33468) -
  Documents that props like `css` and `className` are unsafe and will be deprecated in the future.

## 1.1.5

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 1.1.4

### Patch Changes

- [#34853](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34853)
  [`d0a020ae050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0a020ae050) - Basic
  accessibility unit tests with jest-axe

## 1.1.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 1.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`718d5ad3044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/718d5ad3044) - Updates
  to support the new `@atlaskit/tokens` theming API.
- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#28081](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28081)
  [`98f5ba36c98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f5ba36c98) - Updates
  atlaskit/image thumbnails + descriptions for the website

## 1.0.0

### Major Changes

- [#28012](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28012)
  [`bc74a5feb7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc74a5feb7d) - This
  package is no longer experimental and the API is considered stable. Version contains no changes
  what so ever.

## 0.2.1

### Patch Changes

- [#27885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27885)
  [`c674eafa051`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c674eafa051) - Fixes a
  bug where the system preference would override the default behaviour when the color-mode was not
  set to auto. As a result, an OS setting of "dark" and a product setting of "light" would result in
  a "dark" image.

## 0.2.0

### Minor Changes

- [#27046](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27046)
  [`8ab96dfc824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ab96dfc824) - Adds a
  new Image primitive that works like the native HTML img element, with the added functionality of
  being theme-aware.

## 0.1.0

- Create Image component with theme functionality.
