# @atlaskit/visually-hidden

## 3.0.3

### Patch Changes

- [#147260](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/147260)
  [`c5d147b984034`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c5d147b984034) -
  Prevent users to select and copy visually hidden text

## 3.0.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.

## 3.0.1

### Patch Changes

- [#128442](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128442)
  [`e01d9e5a20367`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e01d9e5a20367) -
  Update dependencies.

## 3.0.0

### Major Changes

- [#121002](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121002)
  [`9ddb610c46576`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9ddb610c46576) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/visually-hidden`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports.

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

## 1.6.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 1.5.2

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 1.5.1

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.5.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 1.4.1

### Patch Changes

- [#116025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116025)
  [`cd506a937e44f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd506a937e44f) -
  Internal change to how typography is applied. There should be no visual change.

## 1.4.0

### Minor Changes

- [#111016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111016)
  [`d131599730792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d131599730792) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 1.3.0

### Minor Changes

- [#94500](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94500)
  [`90156a599d98`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/90156a599d98) -
  Add support for React 18 in non-strict mode.

## 1.2.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.2.4

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 1.2.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 1.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 1.1.2

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 1.1.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.1.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`86b6aecec17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86b6aecec17) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 1.0.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.0.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.0.0

### Major Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`08ce7935675`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08ce7935675) - Update
  `@atlaskit/visually-hidden` to v1. No breaking changes from previous version.

  `@atlaskit/visually-hidden` now exposes an additional `id` prop. This prop is exposed to allow
  consumers to pair the component with the `aria-describedby` HTML attribute.

## 0.1.2

### Patch Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`248133ff889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/248133ff889) - Fixes
  the name of the entrypoint in package.json

## 0.1.1

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal
  wiring up to the tokens techstack, no code changes.

## 0.1.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`4a26bfd6414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a26bfd6414) - Initial
  release of the visually hidden component. This component should be used as an accessbility tool to
  wrap content for screen readers that would otherwise not be relevant in the natural flow of the
  page.

## 0.0.4

### Patch Changes

- [#8306](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8306)
  [`229b32842b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/229b32842b5) - Fix
  .npmignore and tsconfig.json for **tests**

## 0.0.3

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.0.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.0.1

### Patch Changes

- [#4967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4967)
  [`b443b5a60f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b443b5a60f) - Renamed
  template package
